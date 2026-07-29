# 🗂️ Tổng quan các Tool — Trợ lý AI Tra cứu Tin tức Công nghệ

Dự án xây dựng một **AI Research Agent** chuyên tra cứu và tổng hợp tin tức công nghệ từ nhiều nguồn công khai.

Mục tiêu của nhóm là **demo trên localhost thông qua trình duyệt**, vì vậy các tool được thiết kế theo tiêu chí:

- Không phụ thuộc API trả phí.
- Ưu tiên thư viện Python mã nguồn mở.
- Có thể chạy hoàn toàn trên máy cục bộ.
- Dễ tích hợp vào hệ thống demo hiện tại.

---

# Danh sách Tool

## Core tools (giữ nguyên theo tools.yaml)

| Tool | Loại | Mục đích |
|------|------|----------|
| clarify | Control | Hỏi lại người dùng khi thiếu thông tin |
| timeline | Core | Lấy các bài đăng gần nhất của một tài khoản cụ thể |
| social_search | Core | Tìm tweet/bài đăng theo chủ đề hoặc từ khóa |
| lookup | Core | Tìm kiếm tin tức và thông tin trên web |
| fetch | Core | Đọc nội dung chi tiết của một URL |
| format | Utility | Trình bày kết quả thành markdown đẹp |

## Tool bổ sung đề xuất (liên quan đến tra cứu tin tức công nghệ)

| Tool | Loại | Mục đích |
|------|------|----------|
| tech_trending | Bonus | Theo dõi các repo / dự án công nghệ đang hot trên GitHub |
| topic_trends | Bonus | Phân tích chủ đề đang nóng từ nhiều bài báo/tin tức đã thu thập |
| source_ranker | Bonus | Xếp hạng và chọn nguồn tin phù hợp nhất theo độ tin cậy / mức độ liên quan |
| news_digest | Bonus | Tổng hợp nhiều kết quả thành một bản tin ngắn và dễ đọc |
| entity_extractor | Bonus | Trích xuất tên công ty, sản phẩm, công nghệ và nhân vật quan trọng trong bài viết |

> Các tool liên quan đến research paper như paper reader, arXiv paper search không nằm trong phạm vi này vì chủ đề hiện tại là tra cứu tin tức công nghệ, không phải nghiên cứu học thuật.

---

# 1. clarify

**Loại:** Control

## Mục đích

Hỏi lại người dùng khi yêu cầu chưa đủ thông tin để chọn đúng tool hoặc tiếp tục tra cứu.

Ví dụ:
- Tin AI hay Blockchain?
- Muốn tin hôm nay hay tuần này?
- Muốn tra theo tài khoản hay theo chủ đề?

## Input

| Field | Type |
|------|------|
| question | string |
| response_type | text / yes_no / choice |
| options | array |

## Output

```json
{
  "tool": "clarify",
  "awaiting_user": true
}
```

---

# 2. timeline

**Loại:** Core

## Mục đích

Lấy các bài đăng gần nhất của một tài khoản cụ thể trên X/Twitter.

## Input

| Field | Type |
|------|------|
| screenname | string |
| limit | integer |

## Output

```json
{
  "tool": "timeline",
  "items": []
}
```

---

# 3. social_search

**Loại:** Core

## Mục đích

Tìm kiếm các bài đăng, chủ đề đang thịnh hành trên mạng xã hội.

## Input

| Field | Type |
|------|------|
| query | string |
| search_type | Latest / Top |
| limit | integer |

## Output

```json
{
  "tool": "social_search",
  "items": []
}
```

---

# 4. lookup

**Loại:** Core

## Mục đích

Tìm kiếm tin tức công nghệ, công ty, sản phẩm hoặc sự kiện trên internet.

## Input

| Field | Type |
|------|------|
| query | string |
| topic | general / news |
| timeframe | day / week / month / year |
| max_results | integer |

## Output

```json
{
  "tool": "lookup",
  "items": []
}
```

---

# 5. fetch

**Loại:** Core

## Mục đích

Đọc toàn bộ nội dung một URL cụ thể để tóm tắt hoặc phân tích sâu hơn.

## Input

```json
{
  "url": "https://..."
}
```

## Output

```json
{
  "tool": "fetch",
  "items": []
}
```

---

# 6. format

**Loại:** Utility

## Mục đích

Biến kết quả thu thập được thành một bản tóm tắt đẹp, dễ đọc.

## Input

```json
{
  "items": [],
  "template": "sections",
  "headline": "Tin tức công nghệ"
}
```

## Output

Markdown hoàn chỉnh.

---

# 7. tech_trending

**Loại:** Bonus

## Mục đích

Theo dõi các repository hoặc dự án công nghệ đang nổi trên GitHub, phù hợp với nhu cầu tra cứu xu hướng công nghệ.

## Input

| Field | Type |
|------|------|
| language | string |
| since | daily / weekly / monthly |
| limit | integer |

## Output

```json
{
  "tool": "tech_trending",
  "items": []
}
```

---

# 8. topic_trends

**Loại:** Bonus

## Mục đích

Phân tích các chủ đề đang nóng từ nhiều tin tức đã thu thập, ví dụ: AI agent, GPU, open-source, cybersecurity.

## Input

```json
{
  "items": []
}
```

## Output

```json
{
  "tool": "topic_trends",
  "trends": []
}
```

---

# 9. source_ranker

**Loại:** Bonus

## Mục đích

Đánh giá và xếp hạng các nguồn tin để chọn nguồn phù hợp nhất cho bản tin hoặc phân tích.

## Input

```json
{
  "items": []
}
```

## Output

```json
{
  "tool": "source_ranker",
  "ranked_items": []
}
```

---

# 10. news_digest

**Loại:** Bonus

## Mục đích

Tổng hợp nhiều kết quả tìm kiếm thành một bản tin ngắn, dễ đọc và có cấu trúc.

## Input

```json
{
  "items": []
}
```

## Output

```json
{
  "tool": "news_digest",
  "markdown": ""
}
```

---

# 11. entity_extractor

**Loại:** Bonus

## Mục đích

Trích xuất các thực thể quan trọng như tên công ty, sản phẩm, công nghệ, và nhân vật liên quan từ nội dung bài viết.

## Input

```json
{
  "text": ""
}
```

## Output

```json
{
  "tool": "entity_extractor",
  "entities": []
}
```

---

# Quy trình hoạt động

```text
User Question
      │
      ▼
clarify (nếu thiếu thông tin)
      │
      ▼
lookup / timeline / social_search
      │
      ▼
fetch (nếu có URL cụ thể)
      │
      ▼
format
      │
      ▼
Final Response
```

---

# Ghi chú

- Core tools giữ nguyên theo file tools.yaml.
- Các tool bổ sung nên tập trung vào chủ đề tra cứu tin tức công nghệ, không phải paper nghiên cứu.
- Với mục tiêu demo local, nhóm nên ưu tiên các tool không phụ thuộc API trả phí hoặc có thể chạy offline tốt.