"""
Database firewall (judge feedback).

Defense layers:
1. This middleware: when the firewall is armed, every data route requires
   the X-API-Key header. Wrong/missing key -> 401 before any DB access.
2. CORS lockdown in main.py: only whitelisted origins may call the API.
3. SQLAlchemy ORM: all queries parameterized -> SQL injection blocked.
4. Multi-tenancy: every RAG query is scoped by company_id.

The firewall can be armed two ways:
- API_KEY in .env (armed at boot), or
- POST /firewall/enable at runtime (no restart needed - demo friendly).
Disarming ALWAYS requires the current key: anyone may lock, only the
keyholder may unlock.
"""

import logging

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

logger = logging.getLogger(__name__)

PUBLIC_PATHS = {"/", "/health", "/docs", "/openapi.json", "/redoc"}

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
