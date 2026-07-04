"""
Groq LLM client - one function the whole app uses.

complete() returns the model's text, or None on ANY failure (no key,
network down, rate limit). Callers must handle None with a fallback so
the demo never crashes because of an API hiccup.
"""

import json
import logging
import re

from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is None and settings.GROQ_API_KEY:
        from groq import Groq

        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def complete(system, user, temperature=0.4, max_tokens=1024):
    client = _get_client()
    if client is None:
        logger.warning("GROQ_API_KEY not set - falling back to canned agent output")
        return None
    try:
        resp = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content
    except Exception as exc:
        logger.error(f"Groq call failed: {exc}")
        return None


def extract_json(text):
    """Parse JSON out of an LLM reply, tolerating code fences and chatter."""
    if not text:
        return None
    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"[\[{].*[\]}]", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                return None
    return None
