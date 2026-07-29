---
name: news_digest
track: bonus
kind: local_formatter
requires_env: []
inputs: [items, headline]
outputs: [markdown, item_count]
side_effect: false
---
# news_digest

Turns an `items` list already collected from other tools into a short
numbered markdown digest (title + source + summary per item, capped at 8
items) under the given `headline`. Purely local formatting — no external
call.

Use when the user wants a quick digest of already-collected items. Overlaps
with `format`; prefer `format` when the user wants full template control
(`brief`/`bullets`/`sections`/`thread`/`daily_ai_vn`), use `news_digest` for a
simple fixed numbered-list summary.