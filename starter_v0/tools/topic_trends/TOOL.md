---
name: topic_trends
track: bonus
kind: local_formatter
requires_env: []
inputs: [items, top_k]
outputs: [trends]
side_effect: false
---
# topic_trends

Analyzes an `items` list already collected from other tools (e.g. `lookup`,
`social_search`) and counts the most frequent words across each item's
title/summary/source to surface recurring topics. Returns up to `top_k`
`{term, count}` pairs. Purely local text processing — no external call.

Use after a search tool has returned items and the user wants to know which
topics/keywords come up most. Do not use on an empty/no items list — collect
data first.