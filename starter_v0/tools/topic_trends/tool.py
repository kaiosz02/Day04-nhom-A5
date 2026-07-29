from __future__ import annotations

from collections import Counter
from typing import Any

from tools._shared import err


def analyze_topics(items: list[dict[str, Any]] | None = None, top_k: int = 5) -> dict[str, Any]:
    try:
        items = items or []
        texts = []
        for item in items:
            text = " ".join([
                str(item.get("title") or ""),
                str(item.get("summary") or ""),
                str(item.get("source") or ""),
            ])
            texts.append(text.lower())

        counts: Counter[str] = Counter()
        for text in texts:
            for token in text.replace("-", " ").split():
                if len(token) >= 4 and token.isalpha():
                    counts[token] += 1

        trends = [
            {"term": term, "count": count}
            for term, count in counts.most_common(int(top_k or 5))
        ]
        return {"tool": "topic_trends", "trends": trends}
    except Exception as exc:
        return err("topic_trends", exc)
