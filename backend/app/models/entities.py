"""
SQLAlchemy ORM models - the persistent shape of WaveX data (Brain 1).

Onboarding additions: founders own companies; companies carry business
metrics (runway auto-derives from cash / burn); goals and context memory
hang off the company. All FK-linked, Postgres-ready.
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    """Authenticated account (JWT auth). Owns companies; every data route
    is scoped to the requesting user's records via this ownership chain."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    companies: Mapped[list["Company"]] = relationship(back_populates="user")


class Founder(Base):
    __tablename__ = "founders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    role: Mapped[str | None] = mapped_column(String(50), nullable=True)  # CEO/CTO/COO/Other
    years_experience: Mapped[int | None] = mapped_column(Integer, nullable=True)
    industry_experience: Mapped[str | None] = mapped_column(String(255), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    timezone_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    language: Mapped[str | None] = mapped_column(String(50), nullable=True)
    decision_style: Mapped[str | None] = mapped_column(String(50), nullable=True)  # conservative/balanced/aggressive
    biggest_challenge: Mapped[str | None] = mapped_column(String(50), nullable=True)

    onboarded: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    preferences: Mapped["FounderPreference | None"] = relationship(
        back_populates="founder", uselist=False, cascade="all, delete-orphan"
    )
    companies: Mapped[list["Company"]] = relationship(back_populates="founder")


class FounderPreference(Base):
    __tablename__ = "founder_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    founder_id: Mapped[int] = mapped_column(ForeignKey("founders.id", ondelete="CASCADE"), index=True)
    notification_preference: Mapped[str | None] = mapped_column(String(50), nullable=True)

    founder: Mapped["Founder"] = relationship(back_populates="preferences")


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True
    )
    founder_id: Mapped[int | None] = mapped_column(
        ForeignKey("founders.id", ondelete="SET NULL"), index=True, nullable=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(255), nullable=False)
    size: Mapped[str] = mapped_column(String(100), nullable=False)

    stage: Mapped[str | None] = mapped_column(String(50), nullable=True)  # Idea..Enterprise
    team_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    monthly_revenue: Mapped[float | None] = mapped_column(Float, nullable=True)
    monthly_expenses: Mapped[float | None] = mapped_column(Float, nullable=True)
    cash_available: Mapped[float | None] = mapped_column(Float, nullable=True)
    funding_raised: Mapped[float | None] = mapped_column(Float, nullable=True)
    funding_stage: Mapped[str | None] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User | None"] = relationship(back_populates="companies")
    founder: Mapped["Founder | None"] = relationship(back_populates="companies")
    decisions: Mapped[list["Decision"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    documents: Mapped[list["Document"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    goals: Mapped[list["CompanyGoal"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    context_memories: Mapped[list["ContextMemory"]] = relationship(
        back_populates="company", cascade="all, delete-orphan"
    )

    @property
    def runway_months(self):
        """Auto-calculated: months of cash left at current net burn."""
        if not self.cash_available or not self.monthly_expenses:
            return None
        net_burn = self.monthly_expenses - (self.monthly_revenue or 0)
        if net_burn <= 0:
            return 99.0  # profitable or break-even: effectively infinite runway
        return round(self.cash_available / net_burn, 1)


class CompanyGoal(Base):
    __tablename__ = "company_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    goal: Mapped[str] = mapped_column(String(100), nullable=False)

    company: Mapped["Company"] = relationship(back_populates="goals")


class ContextMemory(Base):
    """Long-form founder-written company context. Stored here as the source
    of truth AND chunked into ChromaDB so advisors retrieve it semantically."""

    __tablename__ = "context_memory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    company: Mapped["Company"] = relationship(back_populates="context_memories")


class Decision(Base):
    """One row = one complete decision lifecycle. This IS the Decision Ledger."""

    __tablename__ = "decisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    context: Mapped[str] = mapped_column(Text, nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)

    expert_analyses: Mapped[list] = mapped_column(JSON, default=list)
    final_recommendation: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    status: Mapped[str] = mapped_column(String(50), default="pending", index=True)
    approval_comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    company: Mapped["Company"] = relationship(back_populates="decisions")


class Document(Base):
    """Metadata for an uploaded document. Chunks/embeddings live in Chroma."""

    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), index=True, nullable=False
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), default="general")
    status: Mapped[str] = mapped_column(String(50), default="processing")
    chunk_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    company: Mapped["Company"] = relationship(back_populates="documents")
