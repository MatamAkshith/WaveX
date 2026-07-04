# ml_track/core/json_parser.py
import json
import re

def extract_json(raw_text: str) -> dict | None:
    # Strip <think>...</think> blocks if present
    cleaned = re.sub(r"<think>.*?</think>", "", raw_text, flags=re.DOTALL)
    
    # Find the first {...} block
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        return None
    
    json_str = match.group(0)
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return None
    
if __name__ == "__main__":
    test = '<think>reasoning here</think>{"stance": "recommend", "confidence": 80}'
    print(extract_json(test))