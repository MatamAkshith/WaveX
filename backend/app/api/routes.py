from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.models import (
    ApprovalRequest,
    CompanyCreate,
    CompanyResponse,
    DecisionRequest,
    DecisionResponse,
    ExpertAnalysis,
    Recommendation,
)

router = APIRouter()

# Mock storage to hold created items
MOCK_COMPANIES = [
    CompanyResponse(
        id=1,
        name="Acme Corp",
        industry="Technology",
        size="100-500",
        created_at=datetime.utcnow(),
    )
]

MOCK_DECISIONS = [
    DecisionResponse(
        id=1,
        title="Expansion to EU Market",
        context="We want to expand our operations into Europe. We need to assess legal compliance, hiring, and capital allocations.",
        question="Should we launch in Germany next quarter?",
        company_id=1,
        expert_analyses=[
            ExpertAnalysis(
                agent_name="FinanceAgent",
                analysis="Initial models show $500k CAC but strong long-term profit pools.",
                recommendation="Proceed with startup budget cap.",
            ),
            ExpertAnalysis(
                agent_name="LegalAgent",
                analysis="Compliance looks solid, require local storage for GDPR.",
                recommendation="Draft localized privacy terms.",
            ),
        ],
        final_recommendation=Recommendation(
            recommendation="Launch in Germany next quarter under strict budget cap and localized compliance.",
            why="Strong financial feasibility coupled with clear regulatory resolution.",
            trade_offs=["Increased administrative overhead for GDPR.", "Longer hire cycles."],
            next_steps=["Cap budget at $500k.", "Secure EU host.", "Hire local contractors."],
            confidence=0.85,
        ),
        status="pending",
        created_at=datetime.utcnow(),
    )
]


@router.post(
    "/company",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company",
)
def create_company(company: CompanyCreate) -> CompanyResponse:
    """
    Registers a company in the Decision OS ecosystem.
    Currently returns dummy data.
    """
    new_company = CompanyResponse(
        id=len(MOCK_COMPANIES) + 1,
        name=company.name,
        industry=company.industry,
        size=company.size,
        created_at=datetime.utcnow(),
    )
    MOCK_COMPANIES.append(new_company)
    return new_company


@router.post(
    "/decision",
    response_model=DecisionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create and analyze a decision",
)
def create_decision(request: DecisionRequest) -> DecisionResponse:
    """
    Submits a decision query to the planning and expert agent pool.
    Currently returns dummy data.
    """
    new_decision = DecisionResponse(
        id=len(MOCK_DECISIONS) + 1,
        title=request.title,
        context=request.context,
        question=request.question,
        company_id=request.company_id,
        expert_analyses=[
            ExpertAnalysis(
                agent_name="FinanceAgent",
                analysis="Analyzed context. High initial investment required but positive long-term ROI.",
                recommendation="Proceed with phased rollout.",
            ),
            ExpertAnalysis(
                agent_name="GTMAgent",
                analysis="Analyzed market space. Beachhead segment is ready for engagement.",
                recommendation="Focus on developer tool space first.",
            ),
        ],
        final_recommendation=Recommendation(
            recommendation="Proceed with development targeting developer tool segment.",
            why="Expert analysis suggests high segment readiness with low initial resistance.",
            trade_offs=["Niche segment limit initial scale.", "Competitors might replicate quickly."],
            next_steps=["Setup beta sandbox.", "Target 10 pilot customers.", "Prepare financial allocations."],
            confidence=0.9,
        ),
        status="pending",
        created_at=datetime.utcnow(),
    )
    MOCK_DECISIONS.append(new_decision)
    return new_decision


@router.get(
    "/decision/{id}",
    response_model=DecisionResponse,
    summary="Retrieve a specific decision analysis",
)
def get_decision(id: int) -> DecisionResponse:
    """
    Retrieves the analysis report and final recommendation for a decision.
    Currently returns dummy data.
    """
    for decision in MOCK_DECISIONS:
        if decision.id == id:
            return decision
    raise HTTPException(status_code=404, detail="Decision not found")


@router.get(
    "/history",
    response_model=List[DecisionResponse],
    summary="Retrieve decision history",
)
def get_history() -> List[DecisionResponse]:
    """
    Retrieves a list of all historical decisions.
    Currently returns dummy data.
    """
    return MOCK_DECISIONS


@router.post(
    "/approve",
    summary="Approve or reject a decision recommendation",
)
def approve_decision(request: ApprovalRequest) -> dict:
    """
    Approves or rejects a synthesized decision recommendation.
    Currently returns status status updates as dummy data.
    """
    # Check if the decision exists
    decision_found = False
    for decision in MOCK_DECISIONS:
        if decision.id == request.decision_id:
            decision.status = "approved" if request.approved else "rejected"
            decision_found = True
            break

    if not decision_found:
        raise HTTPException(status_code=404, detail="Decision not found")

    return {"status": "approved"}
