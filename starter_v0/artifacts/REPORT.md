# Day 04 Lab v2 Report — Research Agent

> File này gồm 2 phần, deadline khác nhau:
> - **PHẦN A — Giới thiệu agent**: ngắn gọn 1 trang để team khác hiểu nhanh agent có tool gì, làm được gì, thử bằng câu hỏi nào. Xong trước 16:30 để làm tài liệu phụ trợ khi demo.
> - **PHẦN B — Chi tiết / Bằng chứng**: bảng đầy đủ (v0–v3, failure, eval, chat) dựa trên log thật. Có thể hoàn thiện sau buổi debate để nộp bài.

## Team

- Team: Trợ lý AI Tra cứu Tin tức Công nghệ (A5)
- Members:
  - Nguyễn Văn Hải - 2A202601708 - Role 1: Product Architect
  - Lê Ngọc Minh - 2A202601228 - Role 2: Tool Engineer
  - Hoàng Văn Quang - 2A202601334 - Role 3: Prompt Engineer
  - Hoàng Thị Trà My - 2A202601290 - Role 4: Dev
  - Hồ Thanh Bình - 2A202601832 - Role 5: Trace Analyst
  - Nguyễn Thị Việt Vinh - 2A202601836 - Role 6: Flowchart Architect
- Provider/model: openai

---

# PHẦN A — Giới thiệu agent

## A1. Agent này làm được gì

Trợ lý AI Tra cứu Tin tức Công nghệ: tìm tin tức công nghệ/AI/LLM theo từ khóa, theo dõi bài đăng của tài khoản công nghệ trên mạng xã hội, đọc nội dung một URL bài viết, và tổng hợp các kết quả tìm được thành digest markdown dễ đọc.

**Link dùng thử (truy cập được trong showdown):**

> Dán public URL nếu người khác cần mở từ máy riêng; localhost cũng được nếu demo trực tiếp trên máy trình chiếu. Streamlit được khuyến nghị, nhưng nhóm có thể dùng bất kỳ framework nào.
>
> URL: TODO (điền sau khi Dev dựng UI + chạy Cloudflare Tunnel)

## A2. Tool agent có

> Liệt kê các tool agent đang dùng. Mỗi tool 1 dòng: tên + làm được gì.

| Tên tool | Làm được gì | Tool mới nhóm thêm? |
|---|---|---|
| clarify | hỏi lại người dùng khi thiếu thông tin hoặc xác nhận yes/no trước hành động nhạy cảm | không |
| lookup | tìm kiếm tin tức/thông tin công nghệ trên web qua Tavily API | không |
| fetch | đọc toàn bộ nội dung một URL cụ thể qua Firecrawl API | không |
| timeline | lấy tweet mới nhất của một tài khoản X (Twitter) cụ thể | không |
| social_search | tìm tweet theo chủ đề/từ khóa trên X (Twitter) | không |
| format | trình bày kết quả từ các tool khác thành markdown digest | không |
| tech_trending | lấy danh sách GitHub repo đang trending theo ngôn ngữ/khoảng thời gian | **có — tool mới của nhóm** |
| send *(bonus, optional)* | gửi bản tin đã format lên Telegram, cần xác nhận yes/no trước | không (built-in optional) |
| policy *(bonus, optional)* | tra cứu chính sách nội bộ công ty | không (built-in optional) |
| papers *(bonus, optional)* | tìm bài báo khoa học AI trên ArXiv | không (built-in optional) |
| paper_text *(bonus, optional)* | tải PDF ArXiv và trích xuất nội dung text | không (built-in optional) |

## A3. Câu hỏi mẫu để thử

> 3–5 câu hỏi/yêu cầu mẫu để team khác tự thử agent ngay.
> Đã cập nhật theo tool thật trong `tools/TOOLS_OVERVIEW.md`; nên rehearse thử trước khi dùng chính thức trong demo.

1. Tìm tin mới nhất về LLM trong tuần này. *(→ `lookup`)*
2. Tweet mới của Sam Altman nói gì về AI gần đây? *(→ `timeline`)*
3. Dự án AI Python nào đang nổi trên GitHub tuần này? *(→ `tech_trending` — tool mới của nhóm)*
4. Đọc bài viết ở URL này và tóm tắt lại nội dung chính. *(→ `fetch`, cần điền URL thật khi demo)*
5. Bạn muốn tra tin về lĩnh vực nào? *(hỏi thiếu chủ đề → test `clarify`, response_type="choice")*

## A4. Kịch bản demo đã rehearse

> Chuẩn bị 3–5 scenario. Mỗi scenario cần cho thấy tool đã làm gì và một thay đổi cụ thể giữa các version.

| Scenario | Tool trace cần thấy | Câu chuyện cải thiện version | Fallback run/transcript |
|---|---|---|---|
|  |  |  |  |

---

# PHẦN B — Chi tiết / Bằng chứng

> Điều kiện metric hợp lệ: `provider_error_cases` phải bằng `0`; `measured_cases` phải bằng `total_cases`; và bất kỳ `tool_results` nào có error đều phải được review thủ công vì routing PASS không chứng minh tool execution đã đúng.

## B1. Version evidence

Fill from `artifacts/version_log.csv` and `runs/*.json`.

| Version | Prompt/tool change | Hypothesis | Metric name | Before | After | Run File |
|---|---|---|---|---:|---:|---|
| v0 | baseline |  |  |  |  |  |
| v1 |  |  |  |  |  |  |
| v2 |  |  |  |  |  |  |
| v3 |  |  |  |  |  |  |

## B2. Failure analysis

Use actual failures from `results[*].result.failures`.

| Case ID | Failure Type | Actual Tool Calls | What Failed | Fix |
|---|---|---|---|---|
|  |  |  |  |  |

## B3. Team eval cases

List the 10 cases added to `data/eval_group.json`:

- 5 single-turn
- 5 multi-turn

This section is for the mandatory team-authored eval set. Optional built-ins do
not belong here.

File template để trống có chủ đích; nhóm phải tự thiết kế đủ 10 case.

| Case ID | What It Tests | Expected Tool/Behavior | Result |
|---|---|---|---|
|  |  |  |  |

## B4. Live chat evidence

Use `transcripts/*.transcript.json`.

| Scenario/Turn | Version | Tool Calls + Args | Transcript/Run | Outcome |
|---|---|---|---|---|
|  |  |  |  |  |

## B5. Tool capability evidence

Phân loại rõ tool mới bắt buộc, optional built-in và tool đủ điều kiện bonus. Chỉ ghi Telegram/PDF nếu nhóm thực sự dùng; base report không cần chúng.

UI is core deliverable, not bonus. Do not list it here.

| Category | Evidence File | What Worked | Risk / Guardrail |
|---|---|---|---|
| Must-have: tool mới đầu tiên |  |  |  |
| Optional built-in |  |  |  |
| Bonus: tool mới thứ 4 trở đi |  |  |  |

## B6. Reflection

- Which fixes belonged in `system_prompt.md`?
- Which fixes belonged in `tools.yaml`?
- Which failure needed manual review instead of automatic grading?
- What would you improve next?
