import json
from ml_track.orchestrator.pipeline import run_decision_pipeline
from ml_track.mock_data import MOCK_CHUNKS

def collect_company_profile() -> dict:
    print("Let's set up your company profile first, so recommendations are tailored to you.\n")

    company_id = input("Company name: ").strip() or "Unnamed Startup"
    stage = input("Funding stage (e.g. Pre-seed, Seed, Series A): ").strip() or "Unknown"
    industry = input("Industry (e.g. SaaS, Fintech, E-commerce): ").strip() or "Unknown"

    def ask_number(prompt, default=0):
        raw = input(prompt).strip()
        try:
            return float(raw) if raw else default
        except ValueError:
            print("  (not a number, using default)")
            return default

    mrr = ask_number("Monthly recurring revenue ($): ")
    runway_months = ask_number("Runway (months of cash left): ")
    team_size = int(ask_number("Team size (number of employees): "))
    monthly_burn = ask_number("Monthly burn rate ($): ")

    profile = {
        "company_id": company_id,
        "stage": stage,
        "industry": industry,
        "mrr": mrr,
        "runway_months": runway_months,
        "team_size": team_size,
        "monthly_burn": monthly_burn
    }

    print("\n--- Your Profile ---")
    print(json.dumps(profile, indent=2))
    confirm = input("\nLooks correct? (y/n): ").strip().lower()
    if confirm != "y":
        print("Let's redo it.\n")
        return collect_company_profile()

    return profile

def ask(question: str, company_context: dict):
    print(f"\n{'='*80}")
    print(f"QUESTION: {question}")
    print('='*80)

    result = run_decision_pipeline(question, company_context, MOCK_CHUNKS)

    print(f"\nAgents consulted: {', '.join(result['agents_called'])}")
    print(f"Routing method: {result.get('routing_method')}")
    if result.get('routing_scores'):
        print(f"Routing scores: {result['routing_scores']}")

    if result['conflict_info']['conflict_detected']:
        print(f"⚠️  Conflict detected: {result['conflict_info']['conflict_reason']}")
    else:
        print("✓ Agents aligned, no conflict")

    print("\n--- Individual Agent Views ---")
    for agent_result in result['agent_results']:
        print(f"\n[{agent_result.get('agent', 'unknown').upper()}] Stance: {agent_result.get('stance')} (confidence: {agent_result.get('confidence')})")
        print(f"  {agent_result.get('reasoning')}")

    print("\n--- FINAL RECOMMENDATION ---")
    judgment = result['final_judgment']
    print(f"Recommendation: {judgment.get('recommendation')}")
    print(f"Why: {judgment.get('why')}")
    print(f"Trade-offs: {judgment.get('trade_offs')}")
    print(f"Next steps: {judgment.get('next_steps')}")
    print(f"Confidence: {judgment.get('confidence')}")

    return result

def interactive_loop():
    print("=== WaveX Decision System ===\n")
    company_context = collect_company_profile()

    print(f"\nProfile set for {company_context['company_id']}. Ask any founder question (finance, hiring, legal, GTM).")
    print("Type 'quit' to exit, or 'profile' to update your company info.\n")

    while True:
        question = input("Your question: ").strip()
        if question.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break
        if question.lower() == "profile":
            company_context = collect_company_profile()
            continue
        if not question:
            continue
        try:
            ask(question, company_context)
        except Exception as e:
            print(f"Error running pipeline: {e}")
        print()

if __name__ == "__main__":
    interactive_loop()
