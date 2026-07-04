from ml_track.planner.planner import plan
from ml_track.debate.debate import detect_conflict
from ml_track.judge.judge import run_judge

from ml_track.agents.finance_agent import run_finance_agent
from ml_track.agents.hiring_agent import run_hiring_agent
from ml_track.agents.legal_agent import run_legal_agent
from ml_track.agents.gtm_agent import run_gtm_agent

AGENT_FUNCTIONS = {
    "finance": run_finance_agent,
    "hiring": run_hiring_agent,
    "legal": run_legal_agent,
    "gtm": run_gtm_agent
}

def run_decision_pipeline(question: str, company_context: dict, all_chunks: dict) -> dict:
    plan_result = plan(question)
    agents_to_call = plan_result["agents_to_call"]

    agent_results = []
    for agent_name in agents_to_call:
        agent_fn = AGENT_FUNCTIONS[agent_name]
        chunks_for_agent = all_chunks.get(agent_name, [])
        result = agent_fn(question, company_context, chunks_for_agent)
        agent_results.append(result)

    conflict_info = detect_conflict(agent_results)

    final_judgment = run_judge(question, agent_results, conflict_info)

    return {
        "question": question,
        "agents_called": agents_to_call,
        "agent_results": agent_results,
        "conflict_info": conflict_info,
        "final_judgment": final_judgment
    }
