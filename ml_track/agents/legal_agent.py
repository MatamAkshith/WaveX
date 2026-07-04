from ml_track.core.llm_client import call_llm
from ml_track.core.json_parser import extract_json

LEGAL_SYSTEM_PROMPT = """You are the Legal Advisor for a startup decision-making system.
You ONLY consider legal and compliance feasibility - contracts, worker classification, IP assignment, and regulatory risk.
Do NOT comment on financial runway/burn, hiring capacity/ramp-up, or marketing/GTM concerns even if they seem relevant.
State your stance (recommend, caution, or block) based purely on legal/compliance risk.
Base your reasoning only on the company context and retrieved knowledge provided - do not invent facts.
Keep your reasoning to 2-3 sentences.
Respond ONLY with valid JSON matching this structure:
{
  "agent": "legal",
  "stance": "recommend | caution | block",
  "recommendation": "string",
  "reasoning": "string",
  "risk_factors": ["string"],
  "confidence": 0-100
}"""

def run_legal_agent(question: str, company_context: dict, retrieved_chunks: list[str]) -> dict:
    context_str = "\n".join(retrieved_chunks)
    user_prompt = f"""Company Context: {company_context}

Retrieved Legal Knowledge:
{context_str}

Founder's Question: {question}"""

    raw_response = call_llm(LEGAL_SYSTEM_PROMPT, user_prompt)
    parsed = extract_json(raw_response)
    return parsed
