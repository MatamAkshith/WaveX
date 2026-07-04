from ml_track.core.llm_client import _call_hosted_api
from ml_track.core.json_parser import extract_json

KEYWORD_MAP = {
    "finance": ["runway", "burn", "cash", "revenue", "funding", "budget", "cost", "mrr", "profit", "spend"],
    "hiring": ["hire", "hiring", "headcount", "engineer", "recruit", "team size", "salary", "onboard", "candidate"],
    "legal": ["contract", "compliance", "legal", "ip", "intellectual property", "classify", "classification", "regulation", "liability"],
    "gtm": ["marketing", "customer", "acquisition", "growth", "sales", "cac", "ltv", "launch", "campaign", "gtm"]
}

PLANNER_SYSTEM_PROMPT = """You are a routing classifier for a startup decision-making system.
Given a founder's question, score how relevant each domain is to answering it well, from 0-100.

Domains:
- finance: runway, burn rate, budget, cash, revenue, funding, spending decisions
- hiring: headcount, recruiting, team capacity, ramp-up, salaries, hiring decisions
- legal: contracts, compliance, IP, worker classification, regulation, legal risk
- gtm: marketing, sales, customer acquisition, growth, ad spend, campaigns, launches, revenue growth strategy

A question can be relevant to multiple domains simultaneously. Score based on actual relevance to the question's intent, not just literal keyword overlap. Questions about spending money on growth, marketing, or advertising should score high on gtm even if they also mention cost/budget (which would also score finance high).

Respond ONLY with valid JSON, no other text:
{"finance": 0-100, "hiring": 0-100, "legal": 0-100, "gtm": 0-100}"""

def route_by_keywords(question: str) -> list[str]:
    question_lower = question.lower()
    matched_agents = []
    for agent, keywords in KEYWORD_MAP.items():
        if any(keyword in question_lower for keyword in keywords):
            matched_agents.append(agent)
    if not matched_agents:
        matched_agents = list(KEYWORD_MAP.keys())
    return matched_agents

def route_by_llm_score(question: str, threshold: int = 40) -> dict:
    raw_response = _call_hosted_api(PLANNER_SYSTEM_PROMPT, question)
    scores = extract_json(raw_response)

    matched_agents = [agent for agent, score in scores.items() if score >= threshold]
    if not matched_agents:
        matched_agents = list(KEYWORD_MAP.keys())

    return {
        "agents_to_call": matched_agents,
        "scores": scores
    }

def plan(question: str, use_llm: bool = True, threshold: int = 40) -> dict:
    if use_llm:
        try:
            result = route_by_llm_score(question, threshold)
            return {
                "question": question,
                "agents_to_call": result["agents_to_call"],
                "scores": result["scores"],
                "routing_method": "llm_score"
            }
        except Exception as e:
            print(f"LLM routing failed ({e}), falling back to keyword routing")

    relevant_agents = route_by_keywords(question)
    return {
        "question": question,
        "agents_to_call": relevant_agents,
        "scores": None,
        "routing_method": "keyword_fallback"
    }
