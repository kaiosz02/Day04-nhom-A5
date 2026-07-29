# 🗂️ Tổng quan các Tool — Trợ lý AI Tra cứu Tin tức Công nghệ

Dự án này xây dựng một **Research Agent** chuyên tra cứu và tổng hợp tin tức công nghệ.
Agent sẽ tự chọn tool phù hợp dựa trên yêu cầu của người dùng.

---

## Danh sách tool

| Tên tool | Loại | API cần | Mô tả ngắn |
|----------|------|---------|------------|
| `clarify` | Control | Không | Hỏi lại khi thiếu thông tin |
| `lookup` | Core – Live API | TAVILY_API_KEY | Tìm kiếm tin tức trên web |
| `fetch` | Core – Live API | FIRECRAWL_API_KEY | Đọc nội dung một URL cụ thể |
| `timeline` | Core – Live API | RAPIDAPI_KEY | Lấy tweet mới nhất của một tài khoản |
| `social_search` | Core – Live API | RAPIDAPI_KEY | Tìm tweet theo chủ đề/từ khóa |
| `format` | Core – Local | Không | Trình bày kết quả thành markdown đẹp |
| `send` | Bonus – Action | TELEGRAM_BOT_TOKEN | Gửi bản tin lên Telegram |
| `policy` | Bonus – Local | Không | Tra cứu chính sách nội bộ công ty |
| `papers` | Bonus – Live API | Không | Tìm bài báo khoa học trên ArXiv |
| `paper_text` | Bonus – Local | Không | Lấy nội dung text từ PDF ArXiv |
| `tech_trending` | **MỚI** – Live API | Không (GitHub public) | *(Tool mới của nhóm)* Lấy trending GitHub repos |

---

## Chi tiết từng tool

---

### `clarify`

> **Loại:** Control | **Side effect:** Không | **API:** Không cần

**Mục đích:**
Hỏi lại người dùng khi thiếu thông tin cần thiết để thực hiện yêu cầu.
Khi tool này được gọi, agent sẽ **dừng lại** và chờ người dùng trả lời trước khi tiếp tục.

**Dùng khi:**
- Yêu cầu mơ hồ, không rõ cần lấy tin về chủ đề gì / của ai
- Trước khi thực hiện hành động nhạy cảm (gửi tin, đăng bài) cần xác nhận yes/no từ người dùng
- Cần chọn một trong nhiều lựa chọn

**Không dùng khi:**
- Đã đủ thông tin để gọi tool khác
- Dùng để hỏi thông tin mà agent tự biết được từ context

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `question` | string | `""` | Câu hỏi hiển thị cho người dùng |
| `response_type` | enum | `"text"` | `"text"` / `"yes_no"` / `"choice"` |
| `options` | array | `[]` | Danh sách lựa chọn (khi response_type="choice") |

**Ví dụ:**
```json
{
  "question": "Bạn muốn tra tin về lĩnh vực nào?",
  "response_type": "choice",
  "options": ["AI", "Blockchain", "Cybersecurity"]
}
```

---

### `lookup`

> **Loại:** Core – Live API | **Side effect:** Không | **API:** `TAVILY_API_KEY`

**Mục đích:**
Tìm kiếm thông tin và tin tức công nghệ trên internet thông qua **Tavily Search API**.

**Dùng khi:**
- Người dùng hỏi tin tức mà không có URL cụ thể (ví dụ: "Tin AI hôm nay", "Cập nhật về GPT-5")
- Cần tra cứu tổng quát về sản phẩm, công ty, hoặc sự kiện công nghệ
- Muốn tổng hợp từ nhiều nguồn khác nhau

**Không dùng khi:**
- Đã có URL cụ thể → dùng `fetch`
- Hỏi về tweet của ai đó → dùng `timeline`
- Hỏi về chủ đề đang hot trên Twitter → dùng `social_search`

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `query` | string | `""` | Từ khóa tìm kiếm |
| `topic` | enum | `"general"` | `"news"` cho tin tức thời sự |
| `timeframe` | enum | `"week"` | `"day"` / `"week"` / `"month"` / `"year"` |
| `max_results` | integer | `5` | Số kết quả (tối đa 10) |

**Quy ước:**
- "Hôm nay" → `timeframe="day"`, `topic="news"`
- "Tuần này" → `timeframe="week"`, `topic="news"`
- Query nên viết tiếng Anh để Tavily cho kết quả chính xác hơn

---

### `fetch`

> **Loại:** Core – Live API | **Side effect:** Không | **API:** `FIRECRAWL_API_KEY`

**Mục đích:**
Đọc toàn bộ nội dung một URL và trả về dạng markdown thông qua **Firecrawl API**.

**Dùng khi:**
- Người dùng cung cấp link cụ thể và muốn tóm tắt / đọc nội dung bài viết
- Cần đọc chi tiết một bài báo, blog, thông cáo báo chí công nghệ

**Không dùng khi:**
- Không có URL cụ thể → dùng `lookup`
- URL là file PDF từ ArXiv → dùng `paper_text`

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `url` | string | `""` | Địa chỉ URL đầy đủ (phải có https://) |

---

### `timeline`

> **Loại:** Core – Live API | **Side effect:** Không | **API:** `RAPIDAPI_KEY`

**Mục đích:**
Lấy các tweet/bài đăng gần nhất của **một tài khoản X (Twitter) cụ thể** qua RapidAPI.

**Dùng khi:**
- Người dùng hỏi về tweet của một người cụ thể (CEO, nhà nghiên cứu, công ty công nghệ)
- Ví dụ: "Tweet mới của Sam Altman", "Elon Musk nói gì về AI gần đây"

**Không dùng khi:**
- Hỏi về chủ đề chung trên Twitter → dùng `social_search`

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `screenname` | string | `""` | Twitter handle, KHÔNG có dấu @ (ví dụ: `"sama"`) |
| `limit` | integer | `5` | Số tweet trả về |

**Mapping tên nổi tiếng → handle:**
| Tên | Handle |
|-----|--------|
| Sam Altman | `sama` |
| Elon Musk | `elonmusk` |
| Andrej Karpathy | `karpathy` |
| Yann LeCun | `ylecun` |
| Greg Brockman | `gdb` |

---

### `social_search`

> **Loại:** Core – Live API | **Side effect:** Không | **API:** `RAPIDAPI_KEY`

**Mục đích:**
Tìm kiếm tweet/bài đăng theo **chủ đề hoặc từ khóa** trên X (Twitter).

**Dùng khi:**
- Hỏi cộng đồng đang bàn gì về một chủ đề công nghệ
- Ví dụ: "Mọi người nói gì về GPT-5?", "Trend AI agent trên Twitter"

**Không dùng khi:**
- Hỏi về tweet của một người cụ thể → dùng `timeline`

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `query` | string | `""` | Từ khóa tìm kiếm |
| `search_type` | enum | `"Latest"` | `"Latest"` hoặc `"Top"` |
| `limit` | integer | `5` | Số tweet trả về |

**Quy ước:**
- "Phổ biến nhất", "top", "viral" → `search_type="Top"`
- "Mới nhất", "gần đây" → `search_type="Latest"`

---

### `format`

> **Loại:** Core – Local | **Side effect:** Không | **API:** Không cần

**Mục đích:**
Nhận danh sách kết quả từ các tool khác và trình bày thành **markdown có cấu trúc** dễ đọc.

**Dùng khi:**
- Sau khi thu thập đủ dữ liệu từ `lookup`, `timeline`, `social_search`...
- Người dùng muốn một bản tóm tắt / digest / thread rõ ràng

**Không dùng khi:**
- Chưa có dữ liệu (phải chạy tool thu thập trước)

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `items` | array | `[]` | Danh sách item từ kết quả tool khác |
| `template` | enum | `"sections"` | Kiểu trình bày (xem bảng bên dưới) |
| `headline` | string | `""` | Tiêu đề của digest |

**Các template:**
| Template | Dùng khi |
|----------|---------|
| `brief` | Tóm tắt ngắn 5 dòng |
| `bullets` | Danh sách gạch đầu dòng |
| `sections` | Phân nhóm theo section (mặc định) |
| `thread` | Định dạng thread Twitter |
| `daily_ai_vn` | Bản tin AI hàng ngày tiếng Việt |

---

### `send`

> **Loại:** Bonus – Action | **Side effect:** CÓ | **API:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

**Mục đích:**
Gửi một đoạn văn bản lên **Telegram channel** của nhóm.

> ⚠️ **Quan trọng:** Chỉ gửi tin khi `confirmed=True`. Luôn phải dùng `clarify(response_type="yes_no")` để xác nhận với người dùng trước.

**Dùng khi:**
- Người dùng yêu cầu gửi/đăng bản tin công nghệ lên Telegram
- Sau khi đã `format` nội dung và người dùng đã xác nhận

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `text` | string | `""` | Nội dung cần gửi (hỗ trợ Markdown) |
| `confirmed` | boolean | `false` | Phải là `true` để gửi thật |

**Luồng bắt buộc:**
```
user muốn gửi
  → format(items, template)
  → clarify(question="Gửi lên Telegram không?", response_type="yes_no")
  → (nếu yes) send(text=..., confirmed=True)
```

---

### `policy`

> **Loại:** Bonus – Local Knowledge | **Side effect:** Không | **API:** Không cần

**Mục đích:**
Tìm kiếm trong các file **chính sách nội bộ** của công ty (lưu tại `company_policy/*.md`).

**Dùng khi:**
- Hỏi về quy định sử dụng AI, trích dẫn nguồn, quyền riêng tư, đăng bài ra ngoài

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `query` | string | `""` | Câu hỏi cần tra cứu |
| `policy_area` | enum | `"all"` | Nhóm chính sách cụ thể |
| `top_k` | integer | `3` | Số kết quả trả về |

---

### `papers`

> **Loại:** Bonus – Live API | **Side effect:** Không | **API:** Không cần (ArXiv public)

**Mục đích:**
Tìm kiếm **bài báo khoa học** về AI/công nghệ trên ArXiv.

**Dùng khi:**
- Người dùng hỏi về nghiên cứu học thuật, paper AI mới nhất

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `query` | string | `""` | Từ khóa tìm kiếm (nên viết tiếng Anh) |
| `max_results` | integer | `5` | Số paper (tối đa 10) |
| `sort_by` | enum | `"relevance"` | `"relevance"` / `"lastUpdatedDate"` / `"submittedDate"` |

---

### `paper_text`

> **Loại:** Bonus – Local | **Side effect:** Ghi file tạm | **API:** Không cần

**Mục đích:**
Tải PDF từ ArXiv và trích xuất nội dung văn bản để đọc chi tiết.

**Dùng khi:**
- Sau khi `papers` tìm được paper, muốn đọc nội dung cụ thể

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `arxiv_url` | string | `""` | ArXiv ID (vd: `"2301.07041"`) hoặc URL đầy đủ |
| `max_pages` | integer | `5` | Số trang PDF tối đa |
| `max_chars` | integer | `8000` | Số ký tự tối đa |

---

### `tech_trending` ⭐ Tool mới của nhóm

> **Loại:** MỚI – Live API | **Side effect:** Không | **API:** Không cần (GitHub public API)

**Mục đích:**
Lấy danh sách **GitHub repositories đang trending** theo ngôn ngữ và khoảng thời gian.
Giúp người dùng nắm bắt các dự án open-source công nghệ đang được cộng đồng quan tâm.

**File cần tạo:**
```
tools/tech_trending/
├── TOOL.md   ← mô tả tool
└── tool.py   ← implementation
```

**Dùng khi:**
- "GitHub trending hôm nay có gì hot?"
- "Dự án AI Python nào đang nổi trên GitHub?"
- "Tool open-source nào được star nhiều nhất tuần này?"

**Không dùng khi:**
- Hỏi tin tức chung → dùng `lookup`
- Hỏi tweet về công nghệ → dùng `social_search`

**Parameters:**
| Tên | Kiểu | Mặc định | Mô tả |
|-----|------|---------|-------|
| `language` | string | `""` | Ngôn ngữ lập trình (vd: `"python"`, `""` = tất cả) |
| `since` | enum | `"daily"` | `"daily"` / `"weekly"` / `"monthly"` |
| `limit` | integer | `5` | Số repo trả về |

**Output mẫu:**
```json
{
  "tool": "tech_trending",
  "since": "daily",
  "language": "python",
  "items": [
    {
      "title": "openai/whisper",
      "summary": "Robust Speech Recognition via Large-Scale Weak Supervision",
      "url": "https://github.com/openai/whisper",
      "source": "github.com",
      "stars": 45231,
      "stars_today": 312,
      "language": "Python"
    }
  ]
}
```

---

## Sơ đồ quyết định chọn tool

```
Người dùng gửi yêu cầu
│
├── Thiếu thông tin rõ ràng?               → clarify
│
├── Có URL cụ thể trong yêu cầu?           → fetch
│
├── Hỏi tweet của MỘT NGƯỜI cụ thể?       → timeline
│
├── Hỏi chủ đề đang hot trên Twitter?     → social_search
│
├── Hỏi GitHub trending / dự án OS?       → tech_trending  ⭐
│
├── Hỏi paper khoa học / nghiên cứu AI?   → papers
│   └── Muốn đọc chi tiết nội dung paper? → paper_text
│
├── Hỏi tin tức / tra cứu chung?          → lookup
│
├── Muốn trình bày / format kết quả đẹp?  → format
│
└── Muốn gửi bản tin?
    └── clarify(yes_no) → send(confirmed=True)
```

---

## Lưu ý quan trọng

1. **Tên tool phải đồng bộ** ở 3 nơi: `tools/__init__.py` → `artifacts/tools.yaml` → `data/eval_group.json`
2. **Không bao giờ raise exception** ra ngoài tool — luôn bắt `try/except` và dùng hàm `err()` từ `tools/_shared.py`
3. **Tool `send`** bắt buộc phải có `clarify(response_type="yes_no")` trước khi gọi với `confirmed=True`
4. **Tool mới** (`tech_trending`) phải có đủ: `TOOL.md` + `tool.py` + đăng ký trong `__init__.py` + khai báo trong `tools.yaml` + smoke test PASS
