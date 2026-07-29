---
name: source_ranker
track: bonus
kind: local_formatter
requires_env: []
inputs: [items]
outputs: [ranked_items]
side_effect: false
---
# source_ranker

Ranks an `items` list already collected from other tools by a simple local
heuristic score: known reputable outlets (reuters, techcrunch, the verge,
wired, arstechnica) get +3, having a `url` gets +1, having a `summary` gets
+1. Returns items sorted highest score first. Purely local — no external
call, no real trust/fact-check verification.

Use after a search tool has returned items and the user wants the most
credible/relevant sources first. Do not use on an empty items list.