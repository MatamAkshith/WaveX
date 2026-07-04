KEYWORD_MAP = {
    "finance": ["runway", "burn", "cash", "revenue", "funding", "budget", "cost", "mrr", "profit", "spend"],
    "hiring": ["hire", "hiring", "headcount", "engineer", "recruit", "team size", "salary", "onboard", "candidate"],
    "legal": ["contract", "compliance", "legal", "ip", "intellectual property", "classify", "classification", "regulation", "liability"],
    "gtm": ["marketing", "customer", "acquisition", "growth", "sales", "cac", "ltv", "launch", "campaign", "gtm"]
}

def route_by_keywords(question: str) -> list[str]:
    question_lower = question.lower()
    matched_agents = []

    for agent, keywords in KEYWORD_MAP.items():
        if any(keyword in question_lower for keyword in keywords):
            matched_agents.append(agent)

    if not matched_agents:
        matched_agents = list(KEYWORD_MAP.keys())

    return matched_agents

def plan(question: str) -> dict:
    relevant_agents = route_by_keywords(question)
    return {
        "question": question,
        "agents_to_call": relevant_agents,
        "routing_method": "keyword" if len(relevant_agents) < len(KEYWORD_MAP) else "fallback_all"
    }
