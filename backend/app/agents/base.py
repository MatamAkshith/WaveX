from typing import List
from app.schemas.models import ExpertAnalysis, Recommendation


class PlannerAgent:
    """
    Agent responsible for orchestrating the analysis process and planning workflows.
    """

    async def plan(self, question: str, context: dict) -> List[str]:
        """
        Create a plan of which agents to consult based on the question and context.
        """
        # Return dummy list of expert agents to consult
        return ["FinanceAgent", "LegalAgent", "GTMAgent"]


class FinanceAgent:
    """
    Expert agent for financial analysis.
    """

    async def analyze(self, question: str, context: dict) -> ExpertAnalysis:
        """
        Analyze the question/context from a financial perspective.
        """
        return ExpertAnalysis(
            agent_name="FinanceAgent",
            analysis="Financial modeling suggests high capital efficiency. The ROI is projected to be 23% over 18 months, assuming standard customer acquisition cost (CAC) constraints.",
            recommendation="Proceed with the investment, but cap initial outlay at $500k to mitigate short-term liquidity risks.",
        )


class HiringAgent:
    """
    Expert agent for talent and hiring analysis.
    """

    async def analyze(self, question: str, context: dict) -> ExpertAnalysis:
        """
        Analyze the question/context from a staffing/recruitment perspective.
        """
        return ExpertAnalysis(
            agent_name="HiringAgent",
            analysis="The local talent pool for the required technical roles is highly competitive. Hiring may take 3-6 months per role, potentially delaying project milestones.",
            recommendation="Utilize a hybrid staffing model with contractors initially to accelerate development before transitioning to full-time hires.",
        )


class LegalAgent:
    """
    Expert agent for regulatory and legal compliance analysis.
    """

    async def analyze(self, question: str, context: dict) -> ExpertAnalysis:
        """
        Analyze the question/context from a legal and regulatory perspective.
        """
        return ExpertAnalysis(
            agent_name="LegalAgent",
            analysis="No major compliance roadblocks identified. Standard data privacy policies need modification if deploying in EU/EEA jurisdictions due to GDPR requirements.",
            recommendation="Draft updated Terms of Service and secure a localized data storage agreement prior to launch.",
        )


class GTMAgent:
    """
    Expert agent for Go-To-Market and commercial analysis.
    """

    async def analyze(self, question: str, context: dict) -> ExpertAnalysis:
        """
        Analyze the question/context from a marketing and commercial strategy perspective.
        """
        return ExpertAnalysis(
            agent_name="GTMAgent",
            analysis="Competitive analysis indicates high market validation but strong incumbency. Direct competition will require significant marketing expenditure.",
            recommendation="Target a narrow niche segment first to establish a beachhead and refine the product value proposition.",
        )


class JudgeAgent:
    """
    Agent responsible for synthesising expert analyses into a unified recommendation.
    """

    async def synthesize(self, analyses: List[ExpertAnalysis]) -> Recommendation:
        """
        Synthesize the list of expert analyses and produce the final recommendation.
        """
        # Synthesis logic combining different inputs
        why_parts = [f"{a.agent_name} recommended: '{a.recommendation}'" for a in analyses]
        joined_why = " | ".join(why_parts)

        return Recommendation(
            recommendation="Proceed with the strategic initiative under a phased roll-out plan, combining high-ROI budgeting with narrow-niche GTM targeting.",
            why=f"Synthesized from expert inputs: {joined_why}.",
            trade_offs=[
                "High initial marketing burn vs established competitors.",
                "Potential project launch delays due to talent constraints."
            ],
            next_steps=[
                "Approve budget cap of $500k for phase 1.",
                "Engage hybrid contractors to fast-track MVP.",
                "Update privacy policy and localized server configs."
            ],
            confidence=0.85,
        )
