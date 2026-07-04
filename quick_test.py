from ml_track.agents.finance_agent import run_finance_agent
from ml_track.mock_data import MOCK_COMPANY_CONTEXT, MOCK_CHUNKS

result = run_finance_agent(
    "Should we hire 2 more engineers this quarter?",
    MOCK_COMPANY_CONTEXT,
    MOCK_CHUNKS["finance"]
)
print(result)
