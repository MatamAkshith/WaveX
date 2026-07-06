import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.api.auth import router as auth_router
from app.api.onboarding import router as onboarding_router
from app.api.routes import router as api_router
from app.core.config import settings
from app.core.security import ApiKeyMiddleware
from app.database.base import Base
from app.database.session import engine
import app.models  # noqa: F401 - registers ORM models on Base.metadata

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Columns added by the onboarding feature. create_all() cannot ALTER existing
# tables, so on SQLite we add any missing columns in place (dev convenience;
# Postgres deployments start fresh or use Alembic).
_COMPANY_MIGRATIONS = {
    "user_id": "INTEGER",
    "founder_id": "INTEGER",
    "stage": "VARCHAR(50)",
    "team_size": "INTEGER",
    "monthly_revenue": "FLOAT",
    "monthly_expenses": "FLOAT",
    "cash_available": "FLOAT",
    "funding_raised": "FLOAT",
    "funding_stage": "VARCHAR(50)",
}


def _sqlite_migrate():
    if not settings.DATABASE_URL.startswith("sqlite"):
        return
    with engine.begin() as conn:
        existing = {row[1] for row in conn.execute(text("PRAGMA table_info(companies)"))}
        for col, coltype in _COMPANY_MIGRATIONS.items():
            if existing and col not in existing:
                conn.execute(text(f"ALTER TABLE companies ADD COLUMN {col} {coltype}"))
                logger.info(f"Migrated companies table: added {col}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting WaveX Backend API in {settings.ENVIRONMENT} mode...")
    if settings.DEBUG:
        logger.info("Debug mode is enabled.")
    Base.metadata.create_all(bind=engine)
    _sqlite_migrate()
    logger.info("Database tables verified/created.")
    try:
        from app.rag.seed_legal import seed_global_knowledge

        seed_global_knowledge()
    except Exception as exc:
        logger.warning(f"Knowledge base seeding skipped: {exc}")
    yield
    logger.info("Disposing database connection engine...")
    engine.dispose()


app = FastAPI(
    title="WaveX Backend API",
    description="FastAPI Backend for WaveX",
    version="0.3.0",
    lifespan=lifespan,
)

# CORS lockdown: only whitelisted origins (part of the database firewall)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database firewall: X-API-Key required on data routes when armed
app.add_middleware(ApiKeyMiddleware)

app.include_router(auth_router)
app.include_router(onboarding_router)
app.include_router(api_router)


@app.get("/")
def read_root() -> dict:
    """Root endpoint checking if the service is running."""
    return {"status": "running"}


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint to verify that the backend is running."""
    from app.core.security import firewall

    return {
        "status": "healthy",
        "database": "configured",
        "firewall": "enabled" if firewall["api_key"] else "disabled (POST /firewall/enable to arm)",
    }
