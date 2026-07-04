from ml_track.core.llm_client import call_llm
from ml_track.core.json_parser import extract_json

JUDGE_SYSTEM_PROMPT = """You are the Judge in a startup decision-making system.
You receive independent analyses from domain agents (Finance, Hiring, Legal, GTM) along with a conflict detection summary.
Your job is to synthesize all of this into ONE final, balanced recommendation for the founder.
Weigh each agent's stance and confidence. If there is a conflict, address the trade-off explicitly rather than ignoring it.
Do not simply repeat one agent's opinion - integrate all perspectives provided.
Respond ONLY with valid JSON matching this structure:
{
  "recommendation": "string - the final decision/action to take",
  "why": "string - 2-4 sentences justifying the recommendation using the agent inputs",
  "trade_offs": "string - what is being sacrificed or risked by this recommendation",
  "next_steps": ["string", "string"],
  "confidence": 0-100
}"""

def run_judge(question: str, agent_results: list[dict], conflict_info: dict) -> dict:
    agents_summary = "\n".join(
        f"- {r.get('agent', 'unknown')}: stance={r.get('stance')}, "
        f"recommendation={r.get('recommendation')}, reasoning={r.get('reasoning')}, "
        f"confidence={r.get('confidence')}"
        for r in agent_results
    )

    user_prompt = f"""Founder's Question: {question}

Agent Analyses:
{agents_summary}

Conflict Detection: {conflict_info.get('conflict_reason')}
Conflict Detected: {conflict_info.get('conflict_detected')}

Synthesize a final recommendation for the founder."""

    raw_response = call_llm(JUDGE_SYSTEM_PROMPT, user_prompt)
    parsed = extract_json(raw_response)
    return parsed
