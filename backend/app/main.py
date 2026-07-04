import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.core.config import settings
from app.core.security import ApiKeyMiddleware
from app.database.base import Base
from app.database.session import engine
import app.models  # noqa: F401 - registers ORM models on Base.metadata

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting WaveX Backend API in {settings.ENVIRONMENT} mode...")
    if settings.DEBUG:
        logger.info("Debug mode is enabled.")
    # Create tables that don't exist yet (idempotent - safe on every boot)
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created.")
    # Seed the global legal + finance knowledge bases (idempotent upsert)
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
    version="0.2.0",
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

# Database firewall: X-API-Key required on data routes when API_KEY is set
app.add_middleware(ApiKeyMiddleware)

app.include_router(api_router)


@app.get("/")
def read_root() -> dict:
    """Root endpoint checking if the service is running."""
    return {"status": "running"}


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint to verify that the backend is running."""
    return {
        "status": "healthy",
        "database": "configured",
        "firewall": "enabled" if settings.API_KEY else "disabled (set API_KEY to enable)",
    }
