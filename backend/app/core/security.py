"""
Security core: JWT auth primitives + database firewall (judge feedback).

Defense layers:
1. JWT authentication: signup/login issue HS256-signed access tokens
   (python-jose); passwords stored as bcrypt hashes (passlib). Route
   protection lives in app/api/deps.py (get_current_user).
2. Firewall middleware: when armed, every data route requires the
   X-API-Key header. Wrong/missing key -> 401 before any DB access.
3. CORS lockdown in main.py: only whitelisted origins may call the API.
4. SQLAlchemy ORM: all queries parameterized -> SQL injection blocked.
5. Multi-tenancy: every RAG query is scoped by company_id, and every
   data route is scoped to the authenticated user's records.

The firewall can be armed two ways:
- API_KEY in .env (armed at boot), or
- POST /firewall/enable at runtime (no restart needed - demo friendly).
Disarming ALWAYS requires the current key: anyone may lock, only the
keyholder may unlock.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Request
from fastapi.responses import JSONResponse
from jose import jwt
from passlib.context import CryptContext
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

logger = logging.getLogger(__name__)

# Auth endpoints must stay reachable without an API key: a user cannot
# obtain a JWT if the firewall blocks the login door itself.
PUBLIC_PATHS = {"/", "/health", "/docs", "/openapi.json", "/redoc", "/api/auth/signup", "/api/auth/login"}

# ---------- password hashing (bcrypt via passlib) ----------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Constant-time check of a plaintext password against its bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a plaintext password with bcrypt (salt generated per call)."""
    return pwd_context.hash(password)


# ---------- JWT access tokens (python-jose, HS256) ----------


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Sign a JWT carrying `data` claims; `exp` defaults to
    ACCESS_TOKEN_EXPIRE_MINUTES from settings."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta is not None else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# Runtime firewall state. Seeded from .env; mutable via /firewall endpoints.
firewall = {"api_key": settings.API_KEY}


class ApiKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        active_key = firewall["api_key"]
        if not active_key or request.url.path in PUBLIC_PATHS or request.method == "OPTIONS":
            return await call_next(request)

        provided = request.headers.get("X-API-Key")
        if provided != active_key:
            logger.warning(f"FIREWALL BLOCKED unauthenticated request to {request.url.path}")
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or missing API key (X-API-Key header required)."},
            )
        return await call_next(request)
