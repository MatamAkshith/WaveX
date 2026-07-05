from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class CompanyCreate(BaseModel):
    """Schema for company creation."""

    name: str = Field(..., description="Name of the company")
    industry: str = Field(..., description="Industry the company operates in")
    size: str = Field(..., description="Size of the company (e.g. number of employees)")


class CompanyResponse(BaseModel):
    """Schema for company response data."""

    id: int = Field(..., description="Unique database ID of the company")
    name: str = Field(..., description="Name of the company")
    industry: str = Field(..., description="Industry the company operates in")
    size: str = Field(..., description="Size of the company")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")


class DecisionRequest(BaseModel):
    """Schema for decision creation/analysis request."""

    title: str = Field(..., description="Title of the decision to analyze")
    context: str = Field(..., description="Background context for the decision")
    question: str = Field(..., description="The main question/decision to be resolved")
    company_id: int = Field(..., description="ID of the company requesting the decision")


class ExpertAnalysis(BaseModel):
    """Schema for individual expert agent analysis."""

    agent_name: str = Field(..., description="Name of the analyzing agent (e.g. Finance, Legal)")
    analysis: str = Field(..., description="Detailed textual analysis from the expert agent")
    recommendation: str = Field(..., description="Specific recommendation from the expert agent")
    action_output: Optional[str] = Field(
        None,
        description="Concrete deliverable produced by action agents (e.g. job description draft, GTM plan)",
    )


class Recommendation(BaseModel):
    """Schema for the synthesized final recommendation."""

    recommendation: str = Field(..., description="The final synthesized recommendation")
    why: str = Field(..., description="Rationale behind the recommendation")
    trade_offs: List[str] = Field(..., description="Key trade-offs of the recommendation")
    next_steps: List[str] = Field(..., description="Next steps to implement the recommendation")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")


class SimilarDecision(BaseModel):
    """DECISION MEMORY: a previously resolved decision similar to the
    current question. Lets the founder see 'you already decided this'
    and get an explicit re-evaluation in the new recommendation."""

    decision_id: int = Field(..., description="ID of the similar past decision")
    title: str = Field(..., description="Title of the past decision")
    status: str = Field(..., description="Outcome of the past decision (approved/rejected)")
    decided_at: Optional[datetime] = Field(None, description="When it was resolved")
    days_ago: Optional[int] = Field(None, description="Days elapsed since that decision")
    similarity: float = Field(..., description="Semantic similarity score 0-1")


class DecisionResponse(BaseModel):
    """Schema for the complete decision response containing full workflow data."""

    id: int = Field(..., description="Unique database ID of the decision analysis")
    title: str = Field(..., description="Title of the decision")
    context: str = Field(..., description="Context provided for the decision")
    question: str = Field(..., description="The decision question analyzed")
    company_id: int = Field(..., description="ID of the requesting company")
    expert_analyses: List[ExpertAnalysis] = Field(
        ..., description="List of individual expert analysis reports"
    )
    final_recommendation: Optional[Recommendation] = Field(
        None, description="The final synthesised recommendation from the Judge agent"
    )
    similar_past_decision: Optional[SimilarDecision] = Field(
        None, description="A similar decision this company already made, if one exists"
    )
    status: str = Field(default="pending", description="Status of the decision (e.g. pending, approved)")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")


class ApprovalRequest(BaseModel):
    """Schema for decision approval/rejection."""

    decision_id: int = Field(..., description="ID of the decision to approve/reject")
    approved: bool = Field(..., description="True if approved, False if rejected")
    comments: Optional[str] = Field(None, description="Optional explanation or comments")


class DocumentResponse(BaseModel):
    """Schema for uploaded document metadata."""

    id: int = Field(..., description="Unique database ID of the document")
    company_id: int = Field(..., description="ID of the owning company")
    filename: str = Field(..., description="Original filename")
    domain: str = Field(..., description="Knowledge domain tag (finance/hiring/legal/gtm/general)")
    status: str = Field(..., description="Ingestion status (processing/indexed/failed)")
    chunk_count: int = Field(..., description="Number of chunks indexed into the vector store")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Upload timestamp")


# --- Onboarding schemas (additive) ---


class GoogleAuthRequest(BaseModel):
    """Demo Google auth payload (swap for real OAuth token later)."""

    email: str = Field(..., description="Google account email")
    full_name: str = Field(..., description="Google account display name")
    avatar_url: Optional[str] = Field(None, description="Google profile picture URL")


class AuthResponse(BaseModel):
    founder_id: int = Field(..., description="Founder account id")
    full_name: str = Field(..., description="Founder display name")
    onboarded: bool = Field(..., description="True if onboarding was completed before")
    company_id: Optional[int] = Field(None, description="Founder's company, if created")


class FounderOnboardingRequest(BaseModel):
    founder_id: int
    role: str = Field(..., description="CEO / CTO / COO / Other")
    years_experience: int = Field(..., ge=0, le=60)
    industry_experience: str = Field(..., max_length=255)
    country: str = Field(..., max_length=100)
    timezone_name: str = Field(..., max_length=100)
    language: str = Field(default="English", max_length=50)
    decision_style: str = Field(..., description="Conservative / Balanced / Aggressive")
    biggest_challenge: str = Field(..., description="Hiring/Finance/Fundraising/Product/Marketing/Sales/Operations")
    notification_preference: str = Field(default="Email")


class CompanyOnboardingRequest(BaseModel):
    founder_id: int
    name: str = Field(..., min_length=1, max_length=255)
    industry: str = Field(..., min_length=1, max_length=255)
    stage: str = Field(..., description="Idea/MVP/Early Revenue/Growth/Scaling/Enterprise")
    team_size: int = Field(..., ge=1, le=100000)
    monthly_revenue: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    cash_available: float = Field(..., ge=0)
    funding_raised: float = Field(default=0, ge=0)
    funding_stage: str = Field(..., description="Bootstrapped/Pre Seed/Seed/Series A/Series B/Other")
    goals: List[str] = Field(default_factory=list, max_length=10)
    context_memory: str = Field(default="", max_length=20000)


class OnboardingCompanyResponse(BaseModel):
    company_id: int
    runway_months: Optional[float] = None
    onboarded: bool = True


class DashboardSummary(BaseModel):
    full_name: str
    company_name: Optional[str] = None
    stage: Optional[str] = None
    runway_months: Optional[float] = None
    monthly_revenue: Optional[float] = None
    team_size: Optional[int] = None
    funding_stage: Optional[str] = None
    top_goal: Optional[str] = None
    goals: List[str] = Field(default_factory=list)
    decisions_count: int = 0
