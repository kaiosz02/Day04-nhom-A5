from __future__ import annotations

from typing import Any

from tools._shared import err


def get_tech_trending(topic: str = "ai", limit: int = 5) -> dict[str, Any]:
    try:
        sample_topics = {
            "ai": ["OpenAI GPT-5 rumors", "Claude 4 updates", "Google Gemini tools"],
            "web": ["Vite 6 release", "React Server Components", "Next.js AI SDK"],
            "cloud": ["Azure AI Foundry", "AWS Bedrock enhancements", "Kubernetes GPU support"],
        }
        items = sample_topics.get((topic or "ai").lower(), sample_topics["ai"])
        return {
            "tool": "tech_trending",
            "topic": topic,
            "items": [{"title": item, "source": "sample"} for item in items[: int(limit or 5)]],
        }
    except Exception as exc:
        return err("tech_trending", exc)
