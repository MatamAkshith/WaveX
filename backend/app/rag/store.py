"""
ChromaDB connection (Brain 2's storage).

- PersistentClient: vectors survive restarts, stored on disk at CHROMA_DB_PATH.
- One collection for everything; rows are separated by metadata
  (company_id, domain, source). Metadata filtering at query time is what
  keeps Company A's documents invisible to Company B.
- Embeddings: Chroma's built-in default (all-MiniLM-L6-v2, runs locally,
  no API key). Groq is used for LLM inference only — it has no embedding
  models.
"""

from functools import lru_cache

import chromadb

from app.core.config import settings

COLLECTION_NAME = "wavex_knowledge"


@lru_cache(maxsize=1)
def get_collection():
    """Lazy singleton — Chroma loads the embedding model on first use,
    so we don't pay that cost at API boot."""
    client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH or "./chroma_db")
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
