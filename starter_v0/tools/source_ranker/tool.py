from __future__ import annotations

from typing import Any

from tools._shared import err


def rank_sources(items: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    try:
        items = items or []
        ranked = []
        for item in items:
            source = str(item.get("source") or "unknown").strip()
            score = 0
            if source.lower() in {"reuters", "techcrunch", "the verge", "wired", "arstechnica"}:
                score += 3
            if item.get("url"):
                score += 1
            if item.get("summary"):
                score += 1
            ranked.append({"source": source, "score": score, "item": item})

        ranked.sort(key=lambda x: x["score"], reverse=True)
        return {"tool": "source_ranker", "ranked_items": ranked}
    except Exception as exc:
        return err("source_ranker", exc)
