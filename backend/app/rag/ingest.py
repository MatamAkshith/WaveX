"""
Ingestion pipeline: raw uploaded file -> text -> chunks -> vectors in Chroma.

Chunking strategy (hackathon-pragmatic):
- ~250 words per chunk with 40-word overlap. Overlap prevents a fact that
  straddles a boundary from being lost to retrieval.
- Every chunk carries metadata: company_id (privacy filter), doc_id
  (deletion/tracing), domain (routes finance chunks to the Finance agent),
  source (filename, for citations in the UI).
"""

import io
import logging
from datetime import datetime, timezone

from app.rag.store import get_collection

logger = logging.getLogger(__name__)

CHUNK_WORDS = 250
OVERLAP_WORDS = 40


def extract_text(filename, data):
    """Extract plain text from PDF / txt / md uploads."""
    name = filename.lower()
    if name.endswith(".pdf"):
        from pypdf import PdfReader

        reader = PdfReader(io.BytesIO(data))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if name.endswith((".txt", ".md")):
        return data.decode("utf-8", errors="replace")
    raise ValueError(f"Unsupported file type: {filename}. Use PDF, TXT, or MD.")


def chunk_text(text):
    """Word-window chunking with overlap."""
    words = text.split()
    if not words:
        return []
    chunks = []
    step = CHUNK_WORDS - OVERLAP_WORDS
    for start in range(0, len(words), step):
        chunk = " ".join(words[start : start + CHUNK_WORDS])
        if chunk.strip():
            chunks.append(chunk)
        if start + CHUNK_WORDS >= len(words):
            break
    return chunks


def ingest_document(company_id, doc_id, filename, domain, data):
    """Full pipeline for one uploaded file. Returns number of chunks indexed."""
    text = extract_text(filename, data)
    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("No extractable text found in the document.")

    collection = get_collection()
    collection.add(
        ids=[f"doc{doc_id}_chunk{i}" for i in range(len(chunks))],
        documents=chunks,
        metadatas=[
            {
                "company_id": company_id,
                "doc_id": doc_id,
                "domain": domain,
                "source": filename,
                "kind": "document",
            }
            for _ in chunks
        ],
    )
    logger.info(f"Indexed {len(chunks)} chunks from '{filename}' for company {company_id}")
    return len(chunks)


def index_decision(company_id, decision_id, title, question, recommendation, status):
    """Index a resolved decision into DECISION MEMORY so future questions
    can find it. This powers both organizational memory (agents cite past
    decisions) and re-evaluation (similar question -> 'you decided this
    N days ago, here is a fresh look')."""
    rec_text = ""
    if recommendation:
        rec_text = (
            f" Final recommendation: {recommendation.get('recommendation', '')}"
            f" Reasoning: {recommendation.get('why', '')}"
        )
    summary = f"Past decision ({status}): {title}. Question: {question}.{rec_text}"

    collection = get_collection()
    collection.upsert(
        ids=[f"decision{decision_id}"],
        documents=[summary],
        metadatas=[
            {
                "company_id": company_id,
                "decision_id": decision_id,
                "title": title,
                "domain": "decision_history",
                "source": f"Decision #{decision_id}: {title}",
                "kind": "decision",
                "status": status,
                "date": datetime.now(timezone.utc).isoformat(),
            }
        ],
    )
    logger.info(f"Indexed decision {decision_id} into decision memory")
