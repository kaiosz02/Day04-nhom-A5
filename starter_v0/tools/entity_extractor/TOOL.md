---
name: entity_extractor
track: bonus
kind: local_formatter
requires_env: []
inputs: [text]
outputs: [entities]
side_effect: false
---
# entity_extractor

Extracts likely named entities (company/product/tech/person names) from a
block of `text` using a simple capitalized-word regex heuristic (1-3
consecutive Title Case words, common stopwords filtered, deduplicated
case-insensitively). Purely local — no external call, no real NER model, so
accuracy is limited to obvious capitalized names.

Use after `fetch`/`paper_text` has returned article text and the user wants
the key companies/products/people mentioned. Do not use on empty text.