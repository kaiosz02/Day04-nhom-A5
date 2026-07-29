from __future__ import annotations

import re
from typing import Any

from tools._shared import err


def extract_entities(text: str = "") -> dict[str, Any]:
    try:
        if not text:
            return {"tool": "entity_extractor", "entities": []}

        entities = []
        for match in re.finditer(r"\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b", text):
            value = match.group(0)
            if len(value.split()) <= 3 and value.lower() not in {"the", "and", "for", "with"}:
                entities.append(value)

        unique_entities = []
        seen = set()
        for entity in entities:
            if entity.lower() not in seen:
                seen.add(entity.lower())
                unique_entities.append(entity)

        return {"tool": "entity_extractor", "entities": unique_entities}
    except Exception as exc:
        return err("entity_extractor", exc)
