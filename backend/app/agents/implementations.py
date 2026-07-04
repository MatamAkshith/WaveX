from typing import Any, Dict, List
from app.agents.base import BaseAgent


class PlannerAgent(BaseAgent):
    """
    Planning agent that assesses queries to dynamically route them to expert agents.
    """

    async def execute(self, question: str, *args, **kwargs) -> List[str]:
        """
        Processes query and returns list of required expert keys.
        """
        # Hardcoded to return finance expert as requested
        return ["finance"]


class FinanceAgent(BaseAgent):
    """
    Expert agent analyzing queries from a financial context perspective.
    """

    async def execute(self, question: str, context: dict, *args, **kwargs) -> str:
        """
        Analyzes financial feasibility.
        """
        return "Don't hire."


class JudgeAgent(BaseAgent):
    """
    Synthesis agent consolidating opinions from specialized experts into a final consensus recommendation.
    """

    async def execute(self, question: str, expert_opinions: Dict[str, Any], *args, **kwargs) -> Dict[str, Any]:
        """
        Synthesizes recommendations from expert reports.
        """
        return {
            "Recommendation": "Don't hire.",
            "Why": "Dummy reason",
            "Confidence": 0.9,
        }
