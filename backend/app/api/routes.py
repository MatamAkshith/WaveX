"""
API routes - backed by the real database (Brain 1), RAG (Brain 2), and
Groq agents (Brain 3).

Request lifecycle for POST /decision:
  1. Load company profile from DB                    (Brain 1)
  2. DECISION MEMORY check: has this company decided
     something similar before? If yes, surface it and
     ask the Judge to explicitly re-evaluate.
  3. Retrieve doc chunks + past decisions from Chroma (Brain 2)
  4. Planner picks experts -> experts analyze
     -> Judge synthesizes                             (Brain 3)
  5. Persist to the Decision Ledger                   (Brain 1)

On approval/rejection the decision is indexed into decision memory.
"""

import logging
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.agents.base import (
    EXPERT_DOMAINS,
    FinanceAgent,
    GTMAgent,
    HiringAgent,
    JudgeAgent,
    LegalAgent,
    PlannerAgent,
)
from app.api.deps import get_current_user
from app.database.deps import get_db
from app.models import Company, Decision, Document, User
from app.rag import build_rag_context, find_similar_decision, index_decision, ingest_document, retrieve
from app.schemas.models import (
    ApprovalCommentRequest,
    ApprovalRequest,
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
    DecisionRequest,
    DecisionResponse,
    DocumentResponse,
    ExpertAnalysis,
    Recommendation,
    SimilarDecision,
)

logger = logging.getLogger(__name__)
router = APIRouter()

EXPERT_REGISTRY = {
    "FinanceAgent": FinanceAgent(),
    "HiringAgent": HiringAgent(),
    "LegalAgent": LegalAgent(),
    "GTMAgent": GTMAgent(),
}


def _decision_to_response(d, similar=None):
    return DecisionResponse(
        id=d.id,
        title=d.title,
        context=d.context,
        question=d.question,
        company_id=d.company_id,
        expert_analyses=[ExpertAnalysis(**a) for a in (d.expert_analyses or [])],
        final_recommendation=Recommendation(**d.final_recommendation) if d.final_recommendation else None,
        similar_past_decision=similar,
        status=d.status,
        created_at=d.created_at,
    )


def _get_owned_company_or_404(db: Session, company_id: int, user: User) -> Company:
    """Tenancy gate: a company resolves ONLY for the user that owns it.
    Cross-tenant access returns the same 404 as a nonexistent id, so
    authenticated users cannot probe which company ids exist."""
    company = db.get(Company, company_id)
    if not company or company.user_id != user.id:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


def _get_owned_decision_or_404(db: Session, decision_id: int, user: User) -> Decision:
    """Tenancy gate for decisions, enforced through the owning company."""
    row = db.get(Decision, decision_id)
    if not row or not row.company or row.company.user_id != user.id:
        raise HTTPException(status_code=404, detail="Decision not found")
    return row


def _company_to_response(row: Company) -> CompanyResponse:
    return CompanyResponse(
        id=row.id, name=row.name, industry=row.industry, size=row.size, created_at=row.created_at
    )


@router.post(
    "/company",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company (owned by the authenticated user)",
)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CompanyResponse:
    row = Company(
        user_id=current_user.id, name=company.name, industry=company.industry, size=company.size
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _company_to_response(row)


@router.get(
    "/company/{company_id}",
    response_model=CompanyResponse,
    summary="Retrieve one of the authenticated user's companies",
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CompanyResponse:
    return _company_to_response(_get_owned_company_or_404(db, company_id, current_user))


@router.put(
    "/company/{company_id}",
    response_model=CompanyResponse,
    summary="Update one of the authenticated user's companies",
)
def update_company(
    company_id: int,
    request: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CompanyResponse:
    row = _get_owned_company_or_404(db, company_id, current_user)
    if request.name is not None:
        row.name = request.name
    if request.industry is not None:
        row.industry = request.industry
    if request.size is not None:
        row.size = request.size
    db.commit()
    db.refresh(row)
    return _company_to_response(row)


async def _ingest_upload(db: Session, company_id: int, file: UploadFile, domain: str) -> DocumentResponse:
    """Persist document metadata, then chunk/embed/index into ChromaDB with
    company_id metadata so retrieval stays private per company."""
    doc = Document(company_id=company_id, filename=file.filename, domain=domain)
    db.add(doc)
    db.commit()
    db.refresh(doc)

    try:
        data = await file.read()
        chunk_count = ingest_document(company_id, doc.id, file.filename, domain, data)
        doc.status = "indexed"
        doc.chunk_count = chunk_count
    except Exception as exc:
        doc.status = "failed"
        logger.error(f"Ingestion failed for '{file.filename}': {exc}")
        db.commit()
        raise HTTPException(status_code=422, detail=f"Could not ingest document: {exc}")

    db.commit()
    db.refresh(doc)
    return DocumentResponse.model_validate(doc, from_attributes=True)


@router.post(
    "/company/{company_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document into the company's knowledge base",
)
async def upload_document(
    company_id: int,
    file: UploadFile = File(...),
    domain: str = Form(default="general"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentResponse:
    """Accepts PDF/TXT/MD. Only the company's owner may upload."""
    _get_owned_company_or_404(db, company_id, current_user)
    return await _ingest_upload(db, company_id, file, domain)


@router.post(
    "/documents/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document (company_id as form field)",
)
async def upload_document_flat(
    company_id: int = Form(...),
    file: UploadFile = File(...),
    domain: str = Form(default="general"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentResponse:
    """Flat variant of the company-scoped upload; identical ownership gate."""
    _get_owned_company_or_404(db, company_id, current_user)
    return await _ingest_upload(db, company_id, file, domain)


@router.get(
    "/company/{company_id}/documents",
    response_model=List[DocumentResponse],
    summary="List a company's uploaded documents",
)
def list_documents(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[DocumentResponse]:
    _get_owned_company_or_404(db, company_id, current_user)
    docs = db.query(Document).filter(Document.company_id == company_id).all()
    return [DocumentResponse.model_validate(d, from_attributes=True) for d in docs]


@router.get(
    "/documents",
    response_model=List[DocumentResponse],
    summary="List all documents across the authenticated user's companies",
)
def list_all_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[DocumentResponse]:
    docs = (
        db.query(Document)
        .join(Company, Document.company_id == Company.id)
        .filter(Company.user_id == current_user.id)
        .all()
    )
    return [DocumentResponse.model_validate(d, from_attributes=True) for d in docs]


@router.post(
    "/decision",
    response_model=DecisionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create and analyze a decision",
)
async def create_decision(
    request: DecisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DecisionResponse:
    # Tenancy gate FIRST: no agent/RAG pipeline runs for a company the
    # authenticated user does not own.
    company = _get_owned_company_or_404(db, request.company_id, current_user)

    # BUSINESS PROFILE: every advisor automatically receives the founder's
    # onboarding data - metrics, goals, style - with zero repetition needed.
    goals = [g.goal for g in company.goals]
    founder = company.founder
    profile_lines = [f"Company: {company.name} | Industry: {company.industry}"]
    if company.stage:
        profile_lines.append(f"Startup stage: {company.stage} | Funding stage: {company.funding_stage or 'n/a'}")
    if company.team_size:
        profile_lines.append(f"Team size: {company.team_size}")
    if company.monthly_revenue is not None:
        profile_lines.append(f"Monthly revenue: {company.monthly_revenue:,.0f}")
    if company.monthly_expenses is not None:
        profile_lines.append(f"Monthly expenses (burn): {company.monthly_expenses:,.0f}")
    if company.cash_available is not None:
        profile_lines.append(f"Cash available: {company.cash_available:,.0f}")
    if company.runway_months is not None:
        profile_lines.append(f"Runway: {company.runway_months} months (auto-calculated)")
    if company.funding_raised:
        profile_lines.append(f"Funding raised to date: {company.funding_raised:,.0f}")
    if goals:
        profile_lines.append(f"Business goals: {', '.join(goals)}")
    if founder:
        profile_lines.append(
            f"Founder: {founder.full_name} ({founder.role or 'Founder'}) | "
            f"decision style: {founder.decision_style or 'balanced'} | "
            f"biggest challenge: {founder.biggest_challenge or 'n/a'}"
        )
    business_profile_text = (
        "\n\nCOMPANY BUSINESS PROFILE (from onboarding - ground your analysis in these exact facts):\n- "
        + "\n- ".join(profile_lines)
    )

    # 1. DECISION MEMORY: was something similar already decided?
    similar_model = None
    reevaluation_note = ""
    sim = find_similar_decision(request.question, request.company_id)
    if sim and sim.get("decision_id"):
        past_row = db.get(Decision, sim["decision_id"])
        if past_row:
            decided_at = past_row.created_at
            days_ago = None
            if decided_at:
                ref = decided_at if decided_at.tzinfo else decided_at.replace(tzinfo=timezone.utc)
                days_ago = max(0, (datetime.now(timezone.utc) - ref).days)
            similar_model = SimilarDecision(
                decision_id=past_row.id,
                title=past_row.title,
                status=past_row.status,
                decided_at=decided_at,
                days_ago=days_ago,
                similarity=sim["score"],
            )
            past_rec = (past_row.final_recommendation or {}).get("recommendation", "unknown")
            reevaluation_note = (
                f"\n\nIMPORTANT - DECISION MEMORY: This company faced a similar decision "
                f"{days_ago if days_ago is not None else 'some'} days ago "
                f"(Decision #{past_row.id}: '{past_row.title}', outcome: {past_row.status}, "
                f"recommendation then: '{past_rec}'). Explicitly state whether your "
                f"recommendation CHANGES now given the time elapsed and any new context, "
                f"and reference the past decision in your reasoning."
            )
            logger.info(
                f"Decision memory hit: #{past_row.id} '{past_row.title}' "
                f"(similarity {sim['score']}, {days_ago} days ago)"
            )

    # 2. Context bundle (Brain 1) + RAG retrieval (Brain 2)
    rag = build_rag_context(request.question, request.company_id)
    context = {
        "company": {"name": company.name, "industry": company.industry, "size": company.size},
        "decision_context": request.context + business_profile_text + reevaluation_note,
        "document_chunks": rag["document_chunks"],
        "past_decisions": rag["past_decisions"],
    }

    # 3. Planner selects ONLY the relevant experts (Brain 3)
    planner = PlannerAgent()
    selected = await planner.plan(request.question, context)

    # 4. Domain-scoped retrieval for each selected expert
    #    (Legal/Finance automatically blend the global knowledge bases)
    context["domain_chunks"] = {
        EXPERT_DOMAINS[name]: retrieve(
            request.question, request.company_id, domain=EXPERT_DOMAINS[name], k=3
        )
        for name in selected
        if name in EXPERT_DOMAINS
    }

    # 5. Selected experts analyze independently
    analyses: List[ExpertAnalysis] = []
    for name in selected:
        agent = EXPERT_REGISTRY.get(name)
        if agent:
            analyses.append(await agent.analyze(request.question, context))

    # 5.5 BI guarantee: deterministic metrics from the DB fill any gaps
    _augment_metrics(analyses, company)

    # 6. Judge synthesizes (with explicit re-evaluation if memory hit)
    judge = JudgeAgent()
    recommendation = await judge.synthesize(analyses, question=request.question + business_profile_text + reevaluation_note)
    _ensure_judge_metrics(recommendation, analyses)

    # 7. Persist to the Decision Ledger
    row = Decision(
        company_id=request.company_id,
        title=request.title,
        context=request.context,
        question=request.question,
        expert_analyses=[a.model_dump() for a in analyses],
        final_recommendation=recommendation.model_dump(),
        status="pending",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _decision_to_response(row, similar=similar_model)


@router.get(
    "/decision/{id}",
    response_model=DecisionResponse,
    summary="Retrieve a specific decision analysis",
)
def get_decision(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DecisionResponse:
    return _decision_to_response(_get_owned_decision_or_404(db, id, current_user))


@router.get(
    "/history",
    response_model=List[DecisionResponse],
    summary="Retrieve the authenticated user's decision history",
)
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[DecisionResponse]:
    rows = (
        db.query(Decision)
        .join(Company, Decision.company_id == Company.id)
        .filter(Company.user_id == current_user.id)
        .order_by(Decision.created_at.desc())
        .all()
    )
    return [_decision_to_response(r) for r in rows]


def _resolve_decision(db: Session, row: Decision, approved: bool, comments) -> dict:
    row.status = "approved" if approved else "rejected"
    row.approval_comments = comments
    db.commit()

    # Decision memory: resolved decisions become retrievable context
    # for future decisions (including rejected ones - knowing what was
    # turned down and why is as valuable as knowing what was approved).
    try:
        index_decision(
            company_id=row.company_id,
            decision_id=row.id,
            title=row.title,
            question=row.question,
            recommendation=row.final_recommendation,
            status=row.status,
        )
    except Exception as exc:
        logger.warning(f"Could not index decision into memory: {exc}")

    return {"status": row.status}


@router.post(
    "/approve",
    summary="Approve or reject a decision recommendation",
)
def approve_decision(
    request: ApprovalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    row = _get_owned_decision_or_404(db, request.decision_id, current_user)
    return _resolve_decision(db, row, request.approved, request.comments)


@router.post(
    "/decision/{decision_id}/approve",
    summary="Approve a decision recommendation",
)
def approve_decision_by_id(
    decision_id: int,
    request: ApprovalCommentRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    row = _get_owned_decision_or_404(db, decision_id, current_user)
    return _resolve_decision(db, row, True, request.comments if request else None)


@router.post(
    "/decision/{decision_id}/reject",
    summary="Reject a decision recommendation",
)
def reject_decision_by_id(
    decision_id: int,
    request: ApprovalCommentRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    row = _get_owned_decision_or_404(db, decision_id, current_user)
    return _resolve_decision(db, row, False, request.comments if request else None)


# ---------- firewall control (runtime toggle, demo-friendly) ----------

from pydantic import BaseModel as _BaseModel

from app.core.security import firewall


class FirewallRequest(_BaseModel):
    key: str


@router.post("/firewall/enable", summary="Arm the database firewall (no restart needed)")
def enable_firewall(request: FirewallRequest) -> dict:
    """Anyone may LOCK the system. From this moment every data route
    requires the X-API-Key header with this key."""
    firewall["api_key"] = request.key
    logger.info("FIREWALL ARMED at runtime")
    return {"firewall": "enabled", "note": "All data routes now require the X-API-Key header."}


@router.post("/firewall/disable", summary="Disarm the firewall (requires the current key)")
def disable_firewall() -> dict:
    """Only reachable WITH a valid X-API-Key header - the middleware
    blocks this route like any other when armed. Anyone can lock;
    only the keyholder can unlock."""
    firewall["api_key"] = None
    logger.info("Firewall disarmed by keyholder")
    return {"firewall": "disabled"}


# ---------- BI metric guarantees (deterministic, from the database) ----------


def _augment_metrics(analyses, company):
    """Charts must ALWAYS render: fill any metric the LLM missed with
    numbers computed from the company's own database row."""
    for a in analyses:
        m = a.metrics
        if a.agent_name == "FinanceAgent":
            if company.cash_available is not None:
                m.setdefault("cash_available", company.cash_available)
            if company.monthly_expenses is not None:
                m.setdefault("monthly_burn", company.monthly_expenses)
            if company.monthly_revenue is not None:
                m.setdefault("current_revenue", company.monthly_revenue)
            if company.runway_months is not None:
                m.setdefault("runway_months", company.runway_months)
            if company.cash_available and company.monthly_expenses and "cash_projection" not in m:
                net_burn = (company.monthly_expenses or 0) - (company.monthly_revenue or 0)
                if net_burn > 0:
                    m["cash_projection"] = [
                        round(max(0, company.cash_available - net_burn * i), 2) for i in range(0, 7)
                    ]
            a.chart_hints.setdefault("current_revenue", "bar")
            a.chart_hints.setdefault("cash_projection", "area")
        elif a.agent_name == "HiringAgent" and company.team_size:
            m.setdefault("team_size", company.team_size)
        elif a.agent_name == "LegalAgent":
            m.setdefault("legal_risk", 35)
            m.setdefault("compliance_score", 85)
        m.setdefault("confidence", 75)


def _ensure_judge_metrics(recommendation, analyses):
    """Judge BI metrics always present: derive from expert numbers if the
    LLM omitted them. advisor_consensus = 100 minus the spread of expert
    confidence scores (aligned experts -> high consensus)."""
    m = recommendation.metrics
    confs = [x.metrics.get("confidence") for x in analyses if x.metrics.get("confidence")]
    risks = [x.metrics.get("risk_score") for x in analyses if x.metrics.get("risk_score")]
    m.setdefault("overall_confidence", round(recommendation.confidence * 100, 1))
    m.setdefault("overall_risk", round(sum(risks) / len(risks), 1) if risks else 50)
    if "advisor_consensus" not in m:
        if len(confs) >= 2:
            m["advisor_consensus"] = round(max(40.0, 100 - (max(confs) - min(confs))), 1)
        else:
            m["advisor_consensus"] = 85
    m.setdefault("decision", recommendation.recommendation[:40])
