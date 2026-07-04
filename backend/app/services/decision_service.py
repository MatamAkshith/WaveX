import asyncio
import logging
from typing import Any, Dict
from app.agents.implementations import FinanceAgent, JudgeAgent, PlannerAgent

logger = logging.getLogger(__name__)

# Map string keys from the planner to concrete agent class implementations
AGENT_MAPPING = {
    "finance": FinanceAgent,
}


class DecisionService:
    """
    Service conductor coordinating the pipeline execution across multi-agent steps.
    """

    async def run_pipeline(self, company_id: str, question: str) -> Dict[str, Any]:
        """
        Executes the full conductor sequence: Planner -> Expert Agents -> Judge synthesis.
        """
        logger.info(f"Initiating decision pipeline for company_id: {company_id}")

        # a. Instantiate the PlannerAgent and run it to get the required experts.
        planner = PlannerAgent()
        expert_keys = await planner.execute(question)

        # b. Log the selected experts.
        logger.info(f"Planner resolved experts to consult: {expert_keys}")

        # Prepare contexts for the experts
        context = {"company_id": company_id}

        # c. Instantiate the selected experts and run them concurrently using asyncio.gather.
        tasks = []
        task_keys = []
        for key in expert_keys:
            agent_cls = AGENT_MAPPING.get(key.lower())
            if agent_cls:
                agent_instance = agent_cls()
                # Run the expert execute method
                tasks.append(agent_instance.execute(question, context))
                task_keys.append(key)
            else:
                logger.warning(f"No agent class mapped for expert key: '{key}'")

        # Concurrently gather opinions
        opinions_list = await asyncio.gather(*tasks)

        # Build opinions dictionary mapping agent key to their returned opinion
        expert_opinions = dict(zip(task_keys, opinions_list))
        logger.info(f"Expert opinions gathered successfully: {expert_opinions}")

        # d. Pass the expert outputs to the JudgeAgent.
        judge = JudgeAgent()
        judge_output = await judge.execute(question, expert_opinions)

        # e. Return the final Judge output.
        logger.info("Synthesis complete. Returning judge consensus result.")
        return judge_output
