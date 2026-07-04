"""
SQLAlchemy ORM models — the persistent shape of WaveX data (Brain 1).

Design notes:
- Mirrors the frozen Pydantic contracts in app/schemas/models.py.
- expert_analyses and final_recommendation are stored as JSON blobs, not
  separate tables. Agent output schemas will churn during the hackathon;
  JSON columns absorb that churn without migrations.
- Document rows hold METADATA only. The actual text chunks + vectors live
  in ChromaDB (Brain 2). The DB row is the source of truth for "what was
  uploaded"; Chroma is the source of truth for "what can be retrieved".
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(255), nullable=False)
    size: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    decisions: Mapped[list["Decision"]] = relationship(
        back_populates="company", cascade="all, delete-orphan"
    )
    documents: Mapped[list["Document"]] = relationship(
        back_populates="company", cascade="all, delete-orphan"
    )


class Decision(Base):
    """One row = one complete decision lifecycle: question -> expert
    analyses -> final recommendation -> founder approval. This IS the
    Decision Ledger."""

    __tablename__ = "decisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    context: Mapped[str] = mapped_column(Text, nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)

    # JSON snapshots of agent output (list[ExpertAnalysis], Recommendation)
    expert_analyses: Mapped[list] = mapped_column(JSON, default=list)
    final_recommendation: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    status: Mapped[str] = mapped_column(String(50), default="pending", index=True)
    approval_comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    company: Mapped["Company"] = relationship(back_populates="decisions")


class Document(Base):
    """Metadata for an uploaded document. Chunks/embeddings live in Chroma,
    keyed by this row's id and company_id."""

    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), index=True, nullable=False
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), default="general")  # finance/hiring/legal/gtm/general
    status: Mapped[str] = mapped_column(String(50), default="processing")  # processing/indexed/failed
    chunk_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    company: Mapped["Company"] = relationship(back_populates="documents")
