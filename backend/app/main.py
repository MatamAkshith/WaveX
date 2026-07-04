import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.company import router as company_router
from app.api.decision import router as decision_router
from app.api.documents import router as documents_router
from app.core.config import settings
from app.database.session import engine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Log application startup and active environment info
    logger.info(f"Starting WaveX Backend API in {settings.ENVIRONMENT} mode...")
    if settings.DEBUG:
        logger.info("Debug mode is enabled.")
    yield
    # Shutdown: Clean up connections
    logger.info("Disposing database connection engine...")
    engine.dispose()


app = FastAPI(
    title="WaveX Backend API",
    description="FastAPI Backend for WaveX",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers with prefixes
app.include_router(company_router, prefix="/company", tags=["Company"])
app.include_router(documents_router, prefix="/documents", tags=["Documents"])
app.include_router(decision_router, prefix="/decision", tags=["Decision"])


@app.get("/")
def read_root() -> dict:
    """
    Root endpoint checking if the service is running.
    """
    return {"status": "running"}


@app.get("/health")
def health_check() -> dict:
    """
    Health check endpoint to verify that the backend is running.
    Does NOT perform actual database queries.
    """
    return {
        "status": "healthy",
        "database": "configured",
    }
