import json
from ml_track.orchestrator.pipeline import run_decision_pipeline
from ml_track.mock_data import MOCK_COMPANY_CONTEXT, MOCK_CHUNKS

TEST_QUESTIONS = [
    "Should we hire 2 more engineers this quarter?",
    "Can we afford to increase our marketing spend right now?",
    "Is it risky to bring on a new contractor without a formal contract?",
    "What is our overall strategy for the next 6 months?"
]

def run_all_tests():
    for i, question in enumerate(TEST_QUESTIONS, 1):
        print(f"\n{'='*80}")
        print(f"TEST {i}: {question}")
        print('='*80)

        result = run_decision_pipeline(question, MOCK_COMPANY_CONTEXT, MOCK_CHUNKS)

        print(f"Agents called: {result['agents_called']}")
        print(f"Conflict detected: {result['conflict_info']['conflict_detected']}")
        print(f"Conflict reason: {result['conflict_info']['conflict_reason']}")
        print("\nFinal Judgment:")
        print(json.dumps(result['final_judgment'], indent=2))

if __name__ == "__main__":
    run_all_tests()
