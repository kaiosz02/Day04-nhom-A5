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
- Provider/model: openai / gpt-4o-mini 

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
| v0 | baseline (chưa sửa gì, `system_prompt.md`/`tools.yaml` gốc starter) | N/A — đây là điểm baseline để so sánh các version sau | case_accuracy | — | 0.70 | `runs/v0_B_base_openai_20260729T153133080224.json` |
| v1 | `system_prompt.md` viết lại: thêm mục ROUTING RULES, CONFIRMATION BOUNDARY (bắt buộc `clarify` trước khi thiếu info hoặc trước `send`), và WORKFLOW từng bước | Nghi ngờ v0 fail chủ yếu vì prompt gốc không nêu rõ ranh giới xác nhận và routing `social_search` vs `timeline` → viết rõ 2 phần này sẽ giảm `unnecessary_tool`/`missing_info`/`wrong_boundary` | case_accuracy | 0.70 | 0.85 | `runs/v1_B_base_openai_20260729T155341520199.json` |
| v2 |  |  |  |  |  |  |
| v3 |  |  |  |  |  |  |

**Chi tiết metric v0** (từ `summary` trong run file trên): `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ để báo cáo) · `case_accuracy=0.70` · `tool_routing_accuracy=0.70` · `argument_accuracy=0.70` · `multiturn_accuracy=1.00`. `artifact_version=v0+peb1c8179815b+t6cdb53d5d7b8`.

**Chi tiết metric v1** (provider `openai`, model `gpt-4o-mini`): `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ) · `case_accuracy=0.85` (+0.15 so với v0) · `tool_routing_accuracy=0.95` · `argument_accuracy=0.85` · `multiturn_accuracy=0.667` (giảm so với v0=1.00, cần Role 3/5 xem lại case multi-turn nào mới fail). `artifact_version=v1+p18f7870af615+t97391bc363be`.

> Lưu ý: có 1 file `runs/v1_B_base_openrouter_20260729T155136852024.json` cùng thời điểm nhưng `provider_error_cases=20/20` (toàn bộ case lỗi provider, không đo được) — **không dùng file này làm evidence**, chỉ dùng bản chạy `openai` ở trên.

## B2. Failure analysis

Use actual failures from `results[*].result.failures`.

| Case ID | Failure Type | Actual Tool Calls | What Failed | Fix |
|---|---|---|---|---|
| R08_out_of_scope | unnecessary_tool (unexpected_tool_call) | `send(text="Nguyên hàm của x^2 là...")` | Câu hỏi ngoài phạm vi (toán học) nhưng agent vẫn gọi `send` thay vì trả lời trực tiếp/không gọi tool | TODO (Role 3): siết mô tả `send`/system prompt để chỉ gọi khi có nội dung tin tức đã format + user xác nhận gửi |
| R14_out_of_scope_coding | unnecessary_tool (unexpected_tool_call) | `send(text="...hàm Python Fibonacci...")` | Câu hỏi ngoài phạm vi (lập trình) nhưng agent vẫn gọi `send` | Cùng nguyên nhân với R08 — có thể sửa chung 1 hypothesis |
| R10_missing_handle | missing_info (missing_tool_call) | `timeline(screenname="sama")` | Thiếu handle tài khoản rõ ràng nhưng agent tự đoán `sama` thay vì gọi `clarify` trước | TODO: nhấn mạnh trong system prompt — khi tên tài khoản không rõ/không có trong mapping, phải `clarify` trước |
| R11_missing_url | missing_info (missing_tool_call) | `fetch(url="https://example.com/article")` | Thiếu URL cụ thể nhưng agent tự bịa URL thay vì `clarify` | TODO: nhấn mạnh `fetch` chỉ gọi khi có URL thật từ user |
| R12_confirm_before_send | wrong_boundary (missing_tool_call) | `send(text="Bản tin này", confirmed=?)` | Gọi thẳng `send` mà không qua `clarify(response_type="yes_no")` xác nhận trước — vi phạm confirmation boundary | TODO: làm rõ trong `tools.yaml`/prompt luồng bắt buộc `format → clarify(yes_no) → send(confirmed=True)` |
| R13_parallel_web_and_tweets | wrong_tool + wrong_arg_value | `lookup(query="AI news", timeframe="day")` + `timeline(screenname="sama")` | Đáng lẽ gọi `social_search` (không phải `timeline`), và `query`/`topic` sai giá trị mong đợi | TODO: làm rõ ranh giới `social_search` (theo chủ đề) vs `timeline` (theo 1 tài khoản) trong system prompt |

Nguồn: `results[*].result.failures` + `observed_mismatch` + `actual_tool_calls` trong `runs/v0_B_base_openai_20260729T153133080224.json` (6/20 case fail ở v0).

**Sau v1 — 3/20 case fail (giảm từ 6), evidence: `runs/v1_B_base_openai_20260729T155341520199.json`:**

| Case ID | Failure Type | Actual Tool Calls | What Failed |
|---|---|---|---|
| R08_out_of_scope | — đã fix | (không còn gọi `send` cho câu hỏi ngoài phạm vi) | ✅ Fixed so với v0 |
| R14_out_of_scope_coding | — đã fix | (không còn gọi `send` cho câu hỏi ngoài phạm vi) | ✅ Fixed so với v0 |
| R10_missing_handle | — đã fix | agent gọi `clarify` đúng thay vì tự đoán handle | ✅ Fixed so với v0 |
| R11_missing_url | — đã fix | agent gọi `clarify` đúng thay vì tự bịa URL | ✅ Fixed so với v0 |
| R13_parallel_web_and_tweets | — đã fix | routing `social_search` vs `timeline` đã đúng | ✅ Fixed so với v0 |
| R12_confirm_before_send | wrong_arg_value (vẫn còn, khác lỗi) | `clarify(question=..., response_type="text")` | Đã biết gọi `clarify` trước khi `send` (boundary OK), nhưng dùng sai `response_type` — phải là `"yes_no"` chứ không phải `"text"` |
| M02_carryover_timeframe (mới fail) | wrong_arg_value | `lookup(query="robotics", topic="news")` — thiếu `timeframe` | Multi-turn: agent không giữ lại `timeframe="day"` từ ngữ cảnh lượt trước |
| M06_switch_tool (mới fail) | wrong_tool (missing_tool_call) | `social_search(query="OpenAI", ...)` | Multi-turn: đáng lẽ đổi sang `lookup` khi user đổi ý giữa hội thoại, agent vẫn dùng `social_search` |

Nhận xét: v1 sửa tốt 5/6 lỗi routing/boundary của v0 (đúng hướng), nhưng phát sinh 2 lỗi multi-turn mới (`M02`, `M06`) khiến `multiturn_accuracy` giảm từ 1.00 xuống 0.667 — nên là hypothesis ưu tiên cho v2 (Role 3): nhấn mạnh giữ ngữ cảnh multi-turn và chốt `response_type="yes_no"` cho `clarify` trước `send`.

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
