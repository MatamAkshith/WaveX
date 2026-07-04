def detect_conflict(agent_results: list[dict]) -> dict:
    stances = [result["stance"] for result in agent_results if "stance" in result]

    has_block = "block" in stances
    has_recommend = "recommend" in stances
    has_caution = "caution" in stances

    conflict_detected = False
    conflict_reason = "No conflict - agents are aligned."

    if has_block and has_recommend:
        conflict_detected = True
        conflict_reason = "Direct conflict - at least one agent says block while another says recommend."
    elif has_block and has_caution:
        conflict_detected = True
        conflict_reason = "Partial conflict - a block stance alongside caution stances."
    elif has_recommend and has_caution and len(set(stances)) > 1:
        conflict_detected = True
        conflict_reason = "Mild conflict - mixed recommend and caution stances."

    return {
        "conflict_detected": conflict_detected,
        "conflict_reason": conflict_reason,
        "stances_seen": stances,
        "agent_results": agent_results
    }
