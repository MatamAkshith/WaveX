"""
JWT authentication router.

POST /api/auth/signup - create an account (email + password -> bcrypt hash).
POST /api/auth/login  - OAuth2 password form -> signed JWT access token
                        with the user id in the `sub` claim.

Login intentionally uses OAuth2PasswordRequestForm (fields: username,
password) so the Swagger "Authorize" button and any standards-compliant
OAuth2 client work against tokenUrl=/api/auth/login. The `username`
field carries the email.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.database.deps import get_db
from app.models import User
from app.schemas.models import SignupResponse, Token, UserCreate, UserResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user account",
)
def signup(request: UserCreate, db: Session = Depends(get_db)) -> SignupResponse:
    email = request.email.strip().lower()

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )

    user = User(email=email, hashed_password=get_password_hash(request.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"New user account created: {email}")

    return SignupResponse(
        message="Account created successfully",
        user=UserResponse(id=user.id, email=user.email, created_at=user.created_at),
    )


@router.post(
    "/login",
    response_model=Token,
    summary="Exchange email + password for a JWT access token",
)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Token:
    email = form_data.username.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    # Same 401 whether the email is unknown or the password is wrong:
    # never confirm to an attacker which accounts exist.
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token, token_type="bearer")
