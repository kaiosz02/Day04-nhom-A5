from __future__ import annotations

from typing import Any

from tools._shared import err


def build_digest(items: list[dict[str, Any]] | None = None, headline: str = "News Digest") -> dict[str, Any]:
    try:
        items = items or []
        lines = [f"# {headline}"]
        for idx, item in enumerate(items[:8], start=1):
            title = str(item.get("title") or "Untitled").strip()
            summary = str(item.get("summary") or "").strip()
            source = str(item.get("source") or "unknown").strip()
            lines.append(f"{idx}. **{title}** ({source})")
            if summary:
                lines.append(f"   - {summary}")
        markdown = "\n".join(lines)
        return {"tool": "news_digest", "markdown": markdown, "item_count": len(items)}
    except Exception as exc:
        return err("news_digest", exc)
