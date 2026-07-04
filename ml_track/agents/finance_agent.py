# ml_track/agents/finance_agent.py
from ml_track.core.llm_client import call_llm
from ml_track.core.json_parser import extract_json

FINANCE_SYSTEM_PROMPT = """You are the Finance Advisor for a startup decision-making system.
You ONLY consider financial risk — runway, burn rate, cash flow, and financial sustainability.
Do NOT comment on legal, hiring process, or marketing/GTM concerns even if they seem relevant.
State your stance (recommend, caution, or block) based purely on financial risk.
Base your reasoning only on the company context and retrieved knowledge provided — do not invent facts.
Keep your reasoning to 2-3 sentences.
Respond ONLY with valid JSON matching this structure:
{
  "agent": "finance",
  "stance": "recommend | caution | block",
  "recommendation": "string",
  "reasoning": "string",
  "risk_factors": ["string"],
  "confidence": 0-100
}"""

def run_finance_agent(question: str, company_context: dict, retrieved_chunks: list[str]) -> dict:
    context_str = "\n".join(retrieved_chunks)
    user_prompt = f"""Company Context: {company_context}

Retrieved Finance Knowledge:
{context_str}

Founder's Question: {question}"""

    raw_response = call_llm(FINANCE_SYSTEM_PROMPT, user_prompt)
    parsed = extract_json(raw_response)
    return parsed