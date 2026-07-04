import requests

LLM_MODE = "mock"
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"
LM_STUDIO_MODEL = "qwen3-8b"

def call_llm(system_prompt: str, user_prompt: str) -> str:
    if LLM_MODE == "mock":
        return _mock_response(system_prompt, user_prompt)
    elif LLM_MODE == "lm_studio":
        return _call_lm_studio(system_prompt, user_prompt)
    elif LLM_MODE == "hosted_api":
        return _call_hosted_api(system_prompt, user_prompt)
    else:
        raise ValueError(f"Unknown LLM_MODE: {LLM_MODE}")

def _call_lm_studio(system_prompt: str, user_prompt: str) -> str:
    response = requests.post(
        LM_STUDIO_URL,
        json={
            "model": LM_STUDIO_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        },
        timeout=30
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def _call_hosted_api(system_prompt: str, user_prompt: str) -> str:
    raise NotImplementedError("Hosted API not configured yet")

def _mock_response(system_prompt: str, user_prompt: str) -> str:
    if "Finance Advisor" in system_prompt:
        return '''{
          "agent": "finance",
          "stance": "caution",
          "recommendation": "Delay hiring by 4-6 weeks until revenue milestone is hit.",
          "reasoning": "Current runway is under 12 months and additional headcount would accelerate burn without immediate revenue offset.",
          "risk_factors": ["Low runway", "Uncertain revenue timing"],
          "confidence": 72
        }'''
    elif "Hiring Advisor" in system_prompt:
        return '''{
          "agent": "hiring",
          "stance": "recommend",
          "recommendation": "Proceed with hiring 1 engineer now, defer the second.",
          "reasoning": "Team is under-resourced for current roadmap, but hiring 2 at once strains onboarding capacity.",
          "risk_factors": ["Onboarding bandwidth", "Ramp-up time"],
          "confidence": 68
        }'''
    elif "Legal Advisor" in system_prompt:
        return '''{
          "agent": "legal",
          "stance": "caution",
          "recommendation": "Ensure new hires are properly classified as employees, not contractors.",
          "reasoning": "Misclassification risk increases with headcount growth and could trigger compliance issues.",
          "risk_factors": ["Worker misclassification", "Contract review needed"],
          "confidence": 75
        }'''
    elif "Go-To-Market" in system_prompt:
        return '''{
          "agent": "gtm",
          "stance": "recommend",
          "recommendation": "Support hiring if it accelerates customer-facing feature delivery.",
          "reasoning": "Current growth plateau suggests engineering capacity is a bottleneck to GTM execution.",
          "risk_factors": ["Growth plateau", "Feature delivery delays"],
          "confidence": 70
        }'''
    else:
        return '''{
          "recommendation": "Proceed with caution, monitor key metrics closely.",
          "why": "Mixed signals across domains suggest a moderate approach.",
          "trade_offs": "Balancing growth speed against financial and legal risk.",
          "next_steps": ["Review runway monthly", "Reassess in 6 weeks"],
          "confidence": 65
        }'''
