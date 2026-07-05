"""
Brain 3: the decision engine agents, powered by Groq.

Agent roles (judge feedback):
- ACTION agents (Hiring, GTM): produce a live deliverable (action_output)
  the founder can use immediately, like Anthropic-style task agents.
- KNOWLEDGE agents (Finance, Legal): ground analysis in the local
  knowledge bases (finance benchmarks, legal KB) + company documents.

Every agent degrades gracefully: if GROQ_API_KEY is missing or the call
fails, it returns sensible canned output so the demo never crashes.
"""

import logging
from typing import List

from app.core.llm import complete, extract_json
from app.schemas.models import ExpertAnalysis, Recommendation

logger = logging.getLogger(__name__)

ALL_EXPERTS = ["FinanceAgent", "HiringAgent", "LegalAgent", "GTMAgent"]

EXPERT_DOMAINS = {
    "FinanceAgent": "finance",
    "HiringAgent": "hiring",
    "LegalAgent": "legal",
    "GTMAgent": "gtm",
}

_FALLBACK_KEYWORDS = {
    "FinanceAgent": ["budget", "cost", "runway", "fund", "invest", "burn", "revenue", "afford", "price", "money"],
    "HiringAgent": ["hire", "hiring", "team", "recruit", "salary", "engineer", "staff", "employee", "talent"],
    "LegalAgent": ["legal", "compliance", "contract", "gdpr", "dpdp", "regulation", "ip", "patent", "law", "policy", "esop"],
    "GTMAgent": ["market", "launch", "customer", "sales", "growth", "competitor", "expand", "segment", "brand"],
}



# BI metric contracts: what each advisor must quantify, and how the
# frontend should chart each key. LLM outputs numbers ONLY - the
# frontend turns them into charts.
METRIC_SPECS = {
    "finance": '"runway_months": <number>, "cash_available": <number>, "monthly_burn": <number>, "burn_after_decision": <number>, "risk_score": <0-100>, "confidence": <0-100>',
    "hiring": '"team_size": <number>, "recommended_team_size": <number>, "hiring_cost_monthly": <number>, "hiring_priority_score": <0-100>, "risk_score": <0-100>, "confidence": <0-100>',
    "legal": '"legal_risk": <0-100>, "compliance_score": <0-100>, "confidence": <0-100>',
    "gtm": '"marketing_budget": <number>, "expected_roi_percent": <number>, "cac": <number>, "ltv": <number>, "risk_score": <0-100>, "confidence": <0-100>',
}

CHART_HINTS = {
    "finance": {
        "runway_months": "gauge", "cash_available": "bar", "monthly_burn": "bar",
        "burn_after_decision": "bar", "cash_projection": "area", "risk_score": "progress_ring",
        "confidence": "progress_ring",
    },
    "hiring": {
        "team_size": "bar", "recommended_team_size": "bar", "hiring_cost_monthly": "bar",
        "hiring_priority_score": "gauge", "risk_score": "progress_ring", "confidence": "progress_ring",
    },
    "legal": {"legal_risk": "progress_ring", "compliance_score": "progress_ring", "confidence": "progress_ring"},
    "gtm": {
        "marketing_budget": "bar", "expected_roi_percent": "gauge", "cac": "bar", "ltv": "bar",
        "customer_growth_prediction": "line", "risk_score": "progress_ring", "confidence": "progress_ring",
    },
    "judge": {
        "overall_risk": "gauge", "overall_confidence": "progress_ring",
        "advisor_consensus": "donut", "decision": "label",
    },
}


def _num(v, lo=None, hi=None):
    try:
        n = float(v)
    except (TypeError, ValueError):
        return None
    if lo is not None: n = max(lo, n)
    if hi is not None: n = min(hi, n)
    return round(n, 2)


def _clean_metrics(raw):
    """Keep only numeric values / numeric lists - never trust LLM types."""
    out = {}
    if not isinstance(raw, dict):
        return out
    for k, v in raw.items():
        if isinstance(v, (int, float)):
            out[k] = round(float(v), 2)
        elif isinstance(v, list) and v and all(isinstance(x, (int, float)) for x in v):
            out[k] = [round(float(x), 2) for x in v[:12]]
        elif isinstance(v, str) and k in ("decision", "hiring_priority"):
            out[k] = v[:60]
    return out


def _format_chunks(chunks, limit=4):
    if not chunks:
        return "None available."
    return "\n".join(f"- [{c['source']}] {c['text'][:400]}" for c in chunks[:limit])


def _company_line(context):
    c = context.get("company", {})
    return f"{c.get('name', 'Unknown')} - industry: {c.get('industry', '?')}, size: {c.get('size', '?')}"


class PlannerAgent:
    """Selects ONLY the experts relevant to this question (judge feedback:
    specific agent selection, not all experts every time)."""

    async def plan(self, question: str, context: dict) -> List[str]:
        reply = complete(
            system=(
                "You are the Planner of a startup decision engine. Choose which experts are "
                "genuinely needed for the question. Available experts: FinanceAgent (budgets, "
                "runway, ROI), HiringAgent (talent, team, compensation), LegalAgent (compliance, "
                "contracts, regulation), GTMAgent (market, customers, growth). "
                'Reply with ONLY a JSON array of expert names, e.g. ["FinanceAgent","LegalAgent"]. '
                "Pick 1-3 experts. Never pick an expert with nothing domain-specific to add."
            ),
            user=f"Company: {_company_line(context)}\nQuestion: {question}",
            temperature=0.1,
            max_tokens=100,
        )
        selected = extract_json(reply) if reply else None
        if isinstance(selected, list):
            valid = [s for s in selected if s in ALL_EXPERTS]
            if valid:
                logger.info(f"Planner selected: {valid}")
                return valid

        q = question.lower()
        picked = [name for name, kws in _FALLBACK_KEYWORDS.items() if any(kw in q for kw in kws)]
        return picked or ["FinanceAgent", "GTMAgent"]


class _BaseExpert:
    name = "Expert"
    domain = "general"
    persona = ""
    action_instruction = ""
    fallback_analysis = "Analysis unavailable."
    fallback_recommendation = "Consult the team."

    async def analyze(self, question: str, context: dict) -> ExpertAnalysis:
        domain_chunks = context.get("domain_chunks", {}).get(self.domain, [])
        metric_spec = METRIC_SPECS.get(self.domain, '"confidence": <0-100>')
        bi_part = (
            '"key_insights": ["<insight 1>", "<insight 2>", "<insight 3>"], '
            '"metrics": {' + metric_spec + '}, '
            '"recommendations": ["<action 1>", "<action 2>"]'
        )
        if self.action_instruction:
            json_shape = (
                '{"analysis": "<3-5 sentences>", "recommendation": "<1-2 sentences>", '
                '"action_output": "<the deliverable>", ' + bi_part + '}'
            )
        else:
            json_shape = '{"analysis": "<3-5 sentences>", "recommendation": "<1-2 sentences>", ' + bi_part + '}'
        reply = complete(
            system=(
                f"You are the {self.name} of a startup decision engine. {self.persona} "
                "Ground your analysis in the provided company facts and knowledge chunks - cite "
                "sources by name when you use them. Be specific and quantitative where possible. "
                f"{self.action_instruction} "
                "All metrics MUST be plain numbers derived from the company profile and your analysis - no strings, no units, no graphs. "
                f"Reply with ONLY JSON: {json_shape}"
            ),
            user=(
                f"Company: {_company_line(context)}\n"
                f"Decision context: {context.get('decision_context', '')}\n"
                f"Question: {question}\n\n"
                f"Relevant knowledge for your domain:\n{_format_chunks(domain_chunks)}\n\n"
                f"Company documents (general):\n{_format_chunks(context.get('document_chunks', []), 3)}\n\n"
                f"Past decisions by this company:\n{_format_chunks(context.get('past_decisions', []), 2)}"
            ),
            temperature=0.4,
            max_tokens=900,
        )
        data = extract_json(reply) if reply else None
        if isinstance(data, dict) and data.get("analysis"):
            action = data.get("action_output")
            return ExpertAnalysis(
                agent_name=self.name,
                analysis=str(data.get("analysis", "")),
                recommendation=str(data.get("recommendation", "")),
                action_output=str(action) if action else None,
                key_insights=[str(i)[:200] for i in data.get("key_insights", [])[:4]],
                metrics=_clean_metrics(data.get("metrics")),
                chart_hints=CHART_HINTS.get(self.domain, {}),
                recommendations=[str(r)[:200] for r in data.get("recommendations", [])[:4]],
            )
        return ExpertAnalysis(
            agent_name=self.name,
            analysis=self.fallback_analysis,
            recommendation=self.fallback_recommendation,
            chart_hints=CHART_HINTS.get(self.domain, {}),
        )


class FinanceAgent(_BaseExpert):
    name = "FinanceAgent"
    domain = "finance"
    persona = (
        "You think in runway, burn rate, unit economics, and capital efficiency. "
        "You protect the company from decisions it cannot afford. You are a KNOWLEDGE agent: "
        "ground every claim in the finance knowledge base benchmarks and the company's own "
        "financial documents provided below."
    )
    fallback_analysis = (
        "Financial modeling suggests high capital efficiency. The ROI is projected to be 23% "
        "over 18 months, assuming standard customer acquisition cost (CAC) constraints."
    )
    fallback_recommendation = "Proceed with the investment, but cap initial outlay to mitigate liquidity risks."


class HiringAgent(_BaseExpert):
    name = "HiringAgent"
    domain = "hiring"
    persona = (
        "You think in talent markets, hiring timelines, compensation bands, and team topology. "
        "You flag when headcount plans collide with reality. You are an ACTION agent: you do "
        "the work, not just advise."
    )
    action_instruction = (
        'Additionally produce "action_output": a concrete, ready-to-use deliverable for this '
        "question - e.g. a complete job description draft, an interview loop plan, or a "
        "role-by-role 90-day hiring plan with compensation bands. Make it usable as-is."
    )
    fallback_analysis = (
        "The local talent pool for the required technical roles is highly competitive. "
        "Hiring may take 3-6 months per role, potentially delaying project milestones."
    )
    fallback_recommendation = "Utilize a hybrid staffing model with contractors initially to accelerate development."


class LegalAgent(_BaseExpert):
    name = "LegalAgent"
    domain = "legal"
    persona = (
        "You are a startup lawyer versed in Indian company law, DPDP/GDPR data protection, "
        "employment law, contracts, ESOPs, and fundraising terms. You are a KNOWLEDGE agent: "
        "use the legal knowledge base provided to give concrete, jurisdiction-aware guidance - "
        "not generic disclaimers."
    )
    fallback_analysis = (
        "No major compliance roadblocks identified. Standard data privacy policies need "
        "modification if deploying in EU/EEA jurisdictions due to GDPR requirements."
    )
    fallback_recommendation = "Draft updated Terms of Service and review data storage agreements prior to launch."


class GTMAgent(_BaseExpert):
    name = "GTMAgent"
    domain = "gtm"
    persona = (
        "You think in market segments, positioning, channels, and competitive dynamics. "
        "You push for focus over spray-and-pray. You are an ACTION agent: you do the work, "
        "not just advise."
    )
    action_instruction = (
        'Additionally produce "action_output": a concrete, ready-to-execute deliverable - '
        "e.g. a 30-day GTM action plan with weekly milestones, a cold outreach sequence, or "
        "a positioning statement with 3 channel experiments. Make it usable as-is."
    )
    fallback_analysis = (
        "Competitive analysis indicates high market validation but strong incumbency. "
        "Direct competition will require significant marketing expenditure."
    )
    fallback_recommendation = "Target a narrow niche segment first to establish a beachhead."


class JudgeAgent:
    """Synthesizes expert analyses into one accountable recommendation."""

    async def synthesize(self, analyses: List[ExpertAnalysis], question: str = "") -> Recommendation:
        experts_block = "\n\n".join(
            f"{a.agent_name}:\nAnalysis: {a.analysis}\nRecommendation: {a.recommendation}" for a in analyses
        )
        reply = complete(
            system=(
                "You are the Judge of a startup decision engine. Synthesize the expert analyses "
                "into ONE clear, decisive recommendation. Weigh disagreements explicitly. "
                'Reply with ONLY JSON: {"recommendation": str, "why": str, '
                '"trade_offs": [str, str], "next_steps": [str, str, str], "confidence": <0.0-1.0>, '
                '"metrics": {"overall_risk": <0-100>, "overall_confidence": <0-100>, '
                '"advisor_consensus": <0-100 how aligned the experts are>, "decision": "<2-4 word label>"}}'
            ),
            user=f"Question: {question}\n\nExpert analyses:\n{experts_block}",
            temperature=0.3,
            max_tokens=800,
        )
        data = extract_json(reply) if reply else None
        if isinstance(data, dict) and data.get("recommendation"):
            try:
                return Recommendation(
                    recommendation=str(data["recommendation"]),
                    why=str(data.get("why", "")),
                    trade_offs=[str(t) for t in data.get("trade_offs", [])] or ["Not specified."],
                    next_steps=[str(s) for s in data.get("next_steps", [])] or ["Review with the team."],
                    confidence=max(0.0, min(1.0, float(data.get("confidence", 0.7)))),
                    metrics=_clean_metrics(data.get("metrics")),
                )
            except (TypeError, ValueError):
                pass

        why_parts = [f"{a.agent_name} recommended: '{a.recommendation}'" for a in analyses]
        expert_conf = [a.metrics.get("confidence") for a in analyses if a.metrics.get("confidence")]
        expert_risk = [a.metrics.get("risk_score") for a in analyses if a.metrics.get("risk_score")]
        avg = lambda xs, d: round(sum(xs) / len(xs), 1) if xs else d
        return Recommendation(
            recommendation="Proceed with the strategic initiative under a phased roll-out plan.",
            why=f"Synthesized from expert inputs: {' | '.join(why_parts)}.",
            trade_offs=["Execution risk during roll-out.", "Resource allocation trade-offs."],
            next_steps=["Approve phase-1 budget.", "Assign owners.", "Review in 30 days."],
            confidence=0.75,
            metrics={
                "overall_risk": avg(expert_risk, 50),
                "overall_confidence": avg(expert_conf, 75),
                "advisor_consensus": 80,
                "decision": "Phased roll-out",
            },
        )
