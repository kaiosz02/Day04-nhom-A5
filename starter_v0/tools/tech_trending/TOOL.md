---
name: tech_trending
track: bonus
kind: local_knowledge
requires_env: []
inputs: [topic, limit]
outputs: [items]
side_effect: false
---
# tech_trending

Returns trending tech items for a given `topic` (`ai`, `web`, or `cloud`) from
a small built-in sample list — it does not call any external API. Unknown
topics fall back to the `ai` list. `limit` caps how many items come back.

Use when the user asks what's trending/hot in a broad tech area (AI, web dev,
cloud). Do not use for a specific search query or a specific account's posts —
use `lookup` or `social_search`/`timeline` for those.