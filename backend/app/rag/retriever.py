"""
Retriever: the single function agents call to get grounded knowledge.

THE CONTRACT (frozen — agents team builds against this):

    retrieve(query, company_id, domain=None, k=4) -> list[RetrievedChunk]

    RetrievedChunk = {"text": str, "source": str, "domain": str, "score": float}

Two corpora live in the same collection, separated by metadata:
- Company-private chunks (uploaded docs, past decisions): company_id = X.
  NEVER visible to other companies.
- Global knowledge (seeded legal/finance KB): corpus = "global", company_id = -1.
  Visible to everyone — curated domain knowledge, not private data.

retrieve() returns the blend: this company's chunks + global knowledge.
Set include_global=False to search private data only.
"""

import logging

from app.rag.store import get_collection

logger = logging.getLogger(__name__)


def retrieve(query, company_id, domain=None, k=4, include_global=True):
    collection = get_collection()
    if collection.count() == 0:
        return []

    if include_global:
        scope = {"$or": [{"company_id": company_id}, {"corpus": "global"}]}
    else:
        scope = {"company_id": company_id}

    where = {"$and": [scope, {"domain": domain}]} if domain else scope

    results = collection.query(query_texts=[query], n_results=k, where=where)

    chunks = []
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    dists = results.get("distances", [[]])[0]
    for text, meta, dist in zip(docs, metas, dists):
        chunks.append(
            {
                "text": text,
                "source": meta.get("source", "unknown"),
                "domain": meta.get("domain", "general"),
                "score": round(1 - dist, 4),
            }
        )
    return chunks


def build_rag_context(question, company_id, k=6):
    """Convenience bundle for the decision pipeline: relevant document
    chunks + relevant past decisions, ready to inject into agent prompts."""
    doc_chunks = retrieve(question, company_id, k=k)
    past = [c for c in doc_chunks if c["domain"] == "decision_history"]
    docs = [c for c in doc_chunks if c["domain"] != "decision_history"]
    return {"document_chunks": docs, "past_decisions": past}


def find_similar_decision(question, company_id, threshold=0.45):
    """DECISION MEMORY: has this company decided something like this before?

    Returns {"decision_id", "title", "status", "date", "score"} for the
    closest past decision above the similarity threshold, else None.
    """
    collection = get_collection()
    if collection.count() == 0:
        return None

    results = collection.query(
        query_texts=[question],
        n_results=1,
        where={"$and": [{"company_id": company_id}, {"kind": "decision"}]},
    )
    metas = results.get("metadatas", [[]])[0]
    dists = results.get("distances", [[]])[0]
    if not metas:
        return None

    score = round(1 - dists[0], 4)
    if score < threshold:
        return None
    meta = metas[0]
    return {
        "decision_id": meta.get("decision_id"),
        "title": meta.get("title", ""),
        "status": meta.get("status", "unknown"),
        "date": meta.get("date"),
        "score": score,
    }
