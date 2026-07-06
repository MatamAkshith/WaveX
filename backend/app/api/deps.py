"""
Route-protection dependencies (JWT).

get_current_user is the single gate every protected data route depends on:
it decodes the Bearer token, validates signature + expiry, resolves the
`sub` claim to a users row, and raises a standardized 401 on ANY failure
- before execution ever reaches the analytics or AI pipelines.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.deps import get_db
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _credentials_exception() -> HTTPException:
    """Standardized 401 - deliberately identical for every failure mode so
    responses never leak WHY a token was rejected."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """Resolve the Authorization: Bearer <token> header to a User row.

    Raises HTTP 401 on: bad/forged signature, expired token (`exp` is
    validated by jose during decode), missing/malformed `sub` claim, or
    no matching user in the database.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise _credentials_exception()

    subject = payload.get("sub")
    if subject is None:
        raise _credentials_exception()

    try:
        user_id = int(subject)
    except (TypeError, ValueError):
        raise _credentials_exception()

    user = db.get(User, user_id)
    if user is None:
        raise _credentials_exception()
    return user
