from ml_track.core.llm_client import call_llm
from ml_track.core.json_parser import extract_json

HIRING_SYSTEM_PROMPT = """You are the Hiring Advisor for a startup decision-making system.
You ONLY consider hiring feasibility - headcount planning, salary costs, talent availability, and ramp-up time.
Do NOT comment on financial runway/burn, legal compliance, or marketing/GTM concerns even if they seem relevant.
State your stance (recommend, caution, or block) based purely on hiring feasibility.
Base your reasoning only on the company context and retrieved knowledge provided - do not invent facts.
Keep your reasoning to 2-3 sentences.
Respond ONLY with valid JSON matching this structure:
{
  "agent": "hiring",
  "stance": "recommend | caution | block",
  "recommendation": "string",
  "reasoning": "string",
  "risk_factors": ["string"],
  "confidence": 0-100
}"""

def run_hiring_agent(question: str, company_context: dict, retrieved_chunks: list[str]) -> dict:
    context_str = "\n".join(retrieved_chunks)
    user_prompt = f"""Company Context: {company_context}

Retrieved Hiring Knowledge:
{context_str}

Founder's Question: {question}"""

    raw_response = call_llm(HIRING_SYSTEM_PROMPT, user_prompt)
    parsed = extract_json(raw_response)
    return parsed
