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
