"""
Onboarding flow: demo Google auth -> founder form -> company form -> dashboard.

Auth is intentionally swappable: POST /auth/google takes profile fields now;
replace the body with real Google token verification later without touching
anything downstream.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models import Company, CompanyGoal, ContextMemory, Founder, FounderPreference
from app.rag.ingest import index_context_memory
from app.schemas.models import (
    AuthResponse,
    CompanyOnboardingRequest,
    DashboardSummary,
    FounderOnboardingRequest,
    GoogleAuthRequest,
    OnboardingCompanyResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter()


def _first_company(founder):
    return founder.companies[0] if founder.companies else None


@router.post("/auth/google", response_model=AuthResponse, summary="Sign in with Google (demo)")
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    """Get-or-create the founder account. First-timers get onboarded=False
    (frontend routes them to /onboarding); returning founders go straight
    to the dashboard."""
    email = request.email.strip().lower()
    founder = db.query(Founder).filter(Founder.email == email).first()
    if not founder:
        founder = Founder(email=email, full_name=request.full_name.strip(), avatar_url=request.avatar_url)
        db.add(founder)
        db.commit()
        db.refresh(founder)
        logger.info(f"New founder account: {email}")
    company = _first_company(founder)
    return AuthResponse(
        founder_id=founder.id,
        full_name=founder.full_name,
        onboarded=founder.onboarded,
        company_id=company.id if company else None,
    )


@router.post("/onboarding/founder", summary="Save founder profile (onboarding step 1)")
def onboard_founder(request: FounderOnboardingRequest, db: Session = Depends(get_db)) -> dict:
    founder = db.get(Founder, request.founder_id)
    if not founder:
        raise HTTPException(status_code=404, detail="Founder not found")

    founder.role = request.role
    founder.years_experience = request.years_experience
    founder.industry_experience = request.industry_experience
    founder.country = request.country
    founder.timezone_name = request.timezone_name
    founder.language = request.language
    founder.decision_style = request.decision_style
    founder.biggest_challenge = request.biggest_challenge

    if founder.preferences:
        founder.preferences.notification_preference = request.notification_preference
    else:
        db.add(FounderPreference(founder_id=founder.id, notification_preference=request.notification_preference))

    db.commit()
    return {"status": "saved", "next": "company"}


@router.post(
    "/onboarding/company",
    response_model=OnboardingCompanyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save company profile + metrics + goals + context memory (onboarding step 2)",
)
def onboard_company(request: CompanyOnboardingRequest, db: Session = Depends(get_db)) -> OnboardingCompanyResponse:
    founder = db.get(Founder, request.founder_id)
    if not founder:
        raise HTTPException(status_code=404, detail="Founder not found")

    company = _first_company(founder)
    if not company:
        company = Company(founder_id=founder.id, name=request.name, industry=request.industry, size=str(request.team_size))
        db.add(company)

    company.name = request.name
    company.industry = request.industry
    company.size = str(request.team_size)
    company.stage = request.stage
    company.team_size = request.team_size
    company.monthly_revenue = request.monthly_revenue
    company.monthly_expenses = request.monthly_expenses
    company.cash_available = request.cash_available
    company.funding_raised = request.funding_raised
    company.funding_stage = request.funding_stage
    db.flush()

    # Replace goals
    db.query(CompanyGoal).filter(CompanyGoal.company_id == company.id).delete()
    for goal in request.goals[:10]:
        db.add(CompanyGoal(company_id=company.id, goal=goal))

    # Store context memory + index into Chroma for the advisors
    if request.context_memory.strip():
        db.add(ContextMemory(company_id=company.id, content=request.context_memory.strip()))
        try:
            index_context_memory(company.id, request.context_memory.strip())
        except Exception as exc:
            logger.warning(f"Context memory indexing skipped: {exc}")

    founder.onboarded = True
    db.commit()
    db.refresh(company)

    return OnboardingCompanyResponse(company_id=company.id, runway_months=company.runway_months)


@router.get("/founder/{founder_id}/summary", response_model=DashboardSummary, summary="Dashboard greeting data")
def founder_summary(founder_id: int, db: Session = Depends(get_db)) -> DashboardSummary:
    founder = db.get(Founder, founder_id)
    if not founder:
        raise HTTPException(status_code=404, detail="Founder not found")

    company = _first_company(founder)
    goals = [g.goal for g in company.goals] if company else []
    return DashboardSummary(
        full_name=founder.full_name,
        company_name=company.name if company else None,
        stage=company.stage if company else None,
        runway_months=company.runway_months if company else None,
        monthly_revenue=company.monthly_revenue if company else None,
        team_size=company.team_size if company else None,
        funding_stage=company.funding_stage if company else None,
        top_goal=goals[0] if goals else None,
        goals=goals,
        decisions_count=len(company.decisions) if company else 0,
    )
