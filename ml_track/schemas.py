# ml_track/schemas.py

AGENT_OUTPUT_SCHEMA_DESC = """
Respond ONLY with valid JSON matching this exact structure, no other text:
{
  "agent": "<agent_name>",
  "stance": "recommend" | "caution" | "block",
  "recommendation": "<one sentence>",
  "reasoning": "<2-3 sentences>",
  "risk_factors": ["<string>", "<string>"],
  "confidence": <integer 0-100>
}
"""

REQUIRED_AGENT_KEYS = ["agent", "stance", "recommendation", "reasoning", "risk_factors", "confidence"]
VALID_STANCES = ["recommend", "caution", "block"]

JUDGE_OUTPUT_SCHEMA_DESC = """
Respond ONLY with valid JSON matching this exact structure, no other text:
{
  "recommendation": "<string>",
  "why": "<string>",
  "trade_offs": "<string>",
  "next_steps": ["<string>", "<string>", "<string>"],
  "confidence": <integer 0-100>
}
"""

REQUIRED_JUDGE_KEYS = ["recommendation", "why", "trade_offs", "next_steps", "confidence"]