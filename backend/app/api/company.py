from datetime import datetime
from fastapi import APIRouter, status
from app.schemas.models import (
    CompanyCreate,
    CompanyCreateResponse,
    CompanyProfileResponse,
    CompanyUpdate,
    CompanyUpdateResponse,
)

router = APIRouter()


@router.post(
    "/",
    response_model=CompanyCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company profile",
)
def create_company(profile: CompanyCreate) -> CompanyCreateResponse:
    """
    Accepts company profile data and registers it.
    Returns a dummy company ID and success confirmation.
    """
    return CompanyCreateResponse(
        id="dummy-company-uuid-12345",
        message="Company profile registered successfully.",
    )


@router.get(
    "/{id}",
    response_model=CompanyProfileResponse,
    summary="Retrieve a company profile",
)
def get_company(id: str) -> CompanyProfileResponse:
    """
    Retrieves the profile configuration for a company by ID.
    """
    return CompanyProfileResponse(
        id=id,
        name="Acme Corporation",
        industry="Technology",
        size="100-500",
        description="A placeholder enterprise software solutions firm.",
        created_at=datetime.utcnow(),
    )


@router.put(
    "/{id}",
    response_model=CompanyUpdateResponse,
    summary="Update a company profile",
)
def update_company(id: str, profile: CompanyUpdate) -> CompanyUpdateResponse:
    """
    Accepts partial updates and modifies the company profile.
    """
    return CompanyUpdateResponse(status="success")
