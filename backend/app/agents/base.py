from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """
    Abstract base class defining the standard interface for all agents
    in the AI Decision Operating System.
    """

    @abstractmethod
    async def execute(self, *args, **kwargs) -> Any:
        """
        Execute the agent's core evaluation logic.
        """
        pass
