"""Importing models here registers them on Base.metadata,
so create_all() and Alembic can see them."""

from app.models.entities import Company, Decision, Document

__all__ = ["Company", "Decision", "Document"]
