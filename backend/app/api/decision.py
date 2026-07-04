from typing import List
from fastapi import APIRouter, status
from app.schemas.models import (
    DecisionApprovalResponse,
    DecisionCreateRequest,
    DecisionDetailedResponse,
    DecisionInitResponse,
    ExpertAnalysis,
)

router = APIRouter()

# Shareable dummy detailed response data
DUMMY_DECISION = DecisionDetailedResponse(
    decision_id="dummy-uuid",
    planner=["FinanceAgent", "LegalAgent", "GTMAgent"],
    experts=[
        ExpertAnalysis(
            agent_name="FinanceAgent",
            analysis="Highly cost-effective with low burn rate projections.",
            recommendation="Allocate phase 1 capital limit.",
        ),
        ExpertAnalysis(
            agent_name="LegalAgent",
            analysis="Requires standard compliance adjustments for localization.",
            recommendation="Implement local host staging.",
        ),
    ],
    recommendation="Launch in the target market under strict phase-1 capital limits and localized compliance configurations.",
    confidence=0.85,
    next_steps=[
        "Establish localized servers.",
        "Onboard local contractor support.",
        "Fund phase 1 project allocations.",
    ],
    status="completed",
)


@router.post(
    "/",
    response_model=DecisionInitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Initiate a decision evaluation query",
)
def create_decision(request: DecisionCreateRequest) -> DecisionInitResponse:
    """
    Submits a query for multi-agent evaluation.
    Immediately returns processing tracking details.
    """
    # TODO: Inject DecisionService.run_pipeline() here as a background task.
    # For example:
    # background_tasks.add_task(
    #     decision_service.run_pipeline,
    #     company_id=request.company_id,
    #     question=request.question
    # )
    return DecisionInitResponse(
        decision_id="dummy-uuid",
        status="processing",
    )


@router.get(
    "/history",
    response_model=List[DecisionDetailedResponse],
    summary="Retrieve history of decision outcomes",
)
def list_decision_history() -> List[DecisionDetailedResponse]:
    """
    Returns lists of all historical decision outcomes analyzed.
    """
    return [DUMMY_DECISION]


@router.get(
    "/{id}",
    response_model=DecisionDetailedResponse,
    summary="Retrieve individual decision profiles",
)
def get_decision(id: str) -> DecisionDetailedResponse:
    """
    Retrieves full evaluation profile for an analyzed query.
    """
    # Simply return the shareable dummy response using the requested id
    response = DUMMY_DECISION.model_copy()
    response.decision_id = id
    return response


@router.post(
    "/{id}/approve",
    response_model=DecisionApprovalResponse,
    summary="Approve a decision recommendation",
)
def approve_decision(id: str) -> DecisionApprovalResponse:
    """
    Logs approval confirmation status.
    """
    return DecisionApprovalResponse(status="approved")


@router.post(
    "/{id}/reject",
    response_model=DecisionApprovalResponse,
    summary="Reject a decision recommendation",
)
def reject_decision(id: str) -> DecisionApprovalResponse:
    """
    Logs rejection confirmation status.
    """
    return DecisionApprovalResponse(status="rejected")
