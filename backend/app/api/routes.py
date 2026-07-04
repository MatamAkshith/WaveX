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
from app.database.deps import get_db
from app.models import Company, Decision, Document
from app.rag import build_rag_context, find_similar_decision, index_decision, ingest_document, retrieve
from app.schemas.models import (
    ApprovalRequest,
    CompanyCreate,
    CompanyResponse,
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


def _get_company_or_404(db, company_id):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post(
    "/company",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company",
)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)) -> CompanyResponse:
    row = Company(name=company.name, industry=company.industry, size=company.size)
    db.add(row)
    db.commit()
    db.refresh(row)
    return CompanyResponse(
        id=row.id, name=row.name, industry=row.industry, size=row.size, created_at=row.created_at
    )


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
) -> DocumentResponse:
    """Accepts PDF/TXT/MD. Chunks, embeds, and indexes into ChromaDB with
    company_id metadata so retrieval stays private per company."""
    _get_company_or_404(db, company_id)

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


@router.get(
    "/company/{company_id}/documents",
    response_model=List[DocumentResponse],
    summary="List a company's uploaded documents",
)
def list_documents(company_id: int, db: Session = Depends(get_db)) -> List[DocumentResponse]:
    _get_company_or_404(db, company_id)
    docs = db.query(Document).filter(Document.company_id == company_id).all()
    return [DocumentResponse.model_validate(d, from_attributes=True) for d in docs]


@router.post(
    "/decision",
    response_model=DecisionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create and analyze a decision",
)
async def create_decision(request: DecisionRequest, db: Session = Depends(get_db)) -> DecisionResponse:
    company = _get_company_or_404(db, request.company_id)

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
        "decision_context": request.context + reevaluation_note,
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

    # 6. Judge synthesizes (with explicit re-evaluation if memory hit)
    judge = JudgeAgent()
    recommendation = await judge.synthesize(analyses, question=request.question + reevaluation_note)

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
def get_decision(id: int, db: Session = Depends(get_db)) -> DecisionResponse:
    row = db.get(Decision, id)
    if not row:
        raise HTTPException(status_code=404, detail="Decision not found")
    return _decision_to_response(row)


@router.get(
    "/history",
    response_model=List[DecisionResponse],
    summary="Retrieve decision history",
)
def get_history(db: Session = Depends(get_db)) -> List[DecisionResponse]:
    rows = db.query(Decision).order_by(Decision.created_at.desc()).all()
    return [_decision_to_response(r) for r in rows]


@router.post(
    "/approve",
    summary="Approve or reject a decision recommendation",
)
def approve_decision(request: ApprovalRequest, db: Session = Depends(get_db)) -> dict:
    row = db.get(Decision, request.decision_id)
    if not row:
        raise HTTPException(status_code=404, detail="Decision not found")

    row.status = "approved" if request.approved else "rejected"
    row.approval_comments = request.comments
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
