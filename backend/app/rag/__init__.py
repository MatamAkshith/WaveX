"""RAG module (Brain 2): ingestion + retrieval over ChromaDB."""

from app.rag.ingest import index_decision, ingest_document
from app.rag.retriever import build_rag_context, find_similar_decision, retrieve

__all__ = ["ingest_document", "index_decision", "retrieve", "build_rag_context", "find_similar_decision"]
