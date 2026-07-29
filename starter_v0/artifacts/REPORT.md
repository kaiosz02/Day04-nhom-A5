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

> Danh sách và mô tả lấy theo `tools/TOOLS_OVERVIEW.md` (Role 2 vừa cập nhật). Nhóm chuyển hướng: bỏ nhóm tool phụ thuộc app ngoài (Telegram/policy/paper), tập trung tool tra cứu tin tức công nghệ + 1 tool GitHub trending.

**Core tools (đã có code, đang hoạt động):**

| Tên tool | Làm được gì | Tool mới nhóm thêm? |
|---|---|---|
| clarify | hỏi lại người dùng khi thiếu thông tin | không |
| timeline | lấy các bài đăng gần nhất của một tài khoản cụ thể | không |
| social_search | tìm tweet/bài đăng theo chủ đề hoặc từ khóa | không |
| lookup | tìm kiếm tin tức và thông tin trên web (Tavily) | không |
| fetch | đọc nội dung chi tiết của một URL (Firecrawl) | không |
| format | trình bày kết quả thành markdown đẹp | không |

**Tool mới nhóm thêm (đã có `tool.py` + đăng ký trong `tools.yaml`/`tools/__init__.py`):**

| Tên tool | Làm được gì | Ghi chú |
|---|---|---|
| tech_trending | lấy danh sách chủ đề công nghệ đang nổi bật (theo `topic`, `limit`) | **Tool mới #1 (must-have)** |
| topic_trends | phân tích chủ đề đang nóng từ nhiều tin đã thu thập | Tool mới #2 (bonus) |
| source_ranker | xếp hạng nguồn tin theo độ tin cậy/liên quan | Tool mới #3 (bonus) |
| news_digest | tổng hợp nhiều kết quả thành bản tin ngắn | Tool mới #4 (bonus) |
| entity_extractor | trích xuất tên công ty/sản phẩm/nhân vật từ nội dung văn bản | Tool mới #5 (bonus) |

> 5 tool trên xử lý local (dữ liệu mẫu/xử lý text nội bộ, không gọi API ngoài thật). `send` không dùng trong demo (không kết nối Telegram); `policy`/`papers`/`paper_text` vẫn khai báo trong `tools.yaml` để phục vụ một số case trong `eval_group.json`.

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
| v2 | `system_prompt.md` mục 2 (CONFIRMATION BOUNDARY) viết lại: bỏ đoạn nhắc `send`, thêm câu "chỉ dùng tool tra cứu/đọc/tóm tắt, không dùng tool gửi tin/hành động ra ngoài" — khớp với việc `send` đã bị gỡ khỏi `tools.yaml` | Nghi ngờ 2 lỗi multi-turn còn lại của v1 (`M02` giữ ngữ cảnh timeframe, `M06` đổi tool giữa hội thoại) một phần do prompt còn nhắc tool không còn tồn tại gây nhiễu; dọn lại boundary cho gọn sẽ giảm lỗi | case_accuracy | 0.85 | 0.90 | `runs/v2_B_base_openai_20260729T162726879988.json` |
| v3 |  |  |  |  |  |  |

**Chi tiết metric v0** (từ `summary` trong run file trên): `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ để báo cáo) · `case_accuracy=0.70` · `tool_routing_accuracy=0.70` · `argument_accuracy=0.70` · `multiturn_accuracy=1.00`. `artifact_version=v0+peb1c8179815b+t6cdb53d5d7b8`.

**Chi tiết metric v1** (provider `openai`, model `gpt-4o-mini`): `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ) · `case_accuracy=0.85` (+0.15 so với v0) · `tool_routing_accuracy=0.95` · `argument_accuracy=0.85` · `multiturn_accuracy=0.667` (giảm so với v0=1.00, cần Role 3/5 xem lại case multi-turn nào mới fail). `artifact_version=v1+p18f7870af615+t97391bc363be`.

> Lưu ý: có 1 file `runs/v1_B_base_openrouter_20260729T155136852024.json` cùng thời điểm nhưng `provider_error_cases=20/20` (toàn bộ case lỗi provider, không đo được) — **không dùng file này làm evidence**, chỉ dùng bản chạy `openai` ở trên.

**Chi tiết metric v2**: `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ) · `case_accuracy=0.90` (+0.05 so với v1) · `tool_routing_accuracy=0.95` · `argument_accuracy=0.90` · `multiturn_accuracy=0.833` (tăng từ 0.667 ở v1, nhưng vẫn chưa lại được mức 1.00 của v0). `artifact_version=v2+p1edc6c44c37e+t5e044aede690` — hash này khác hẳn v1 (`p18f7870af615/t97391bc363be`), xác nhận đây là một thay đổi thật, không phải run trùng lặp.

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

**Sau v2 — 2/20 case fail (giảm từ 3), evidence: `runs/v2_B_base_openai_20260729T162726879988.json`:**

| Case ID | Failure Type | Actual Tool Calls | What Failed |
|---|---|---|---|
| R12_confirm_before_send | — đã fix | (không còn xuất hiện; `send` đã bị gỡ khỏi `tools.yaml`) | ✅ Fixed so với v1 |
| M06_switch_tool | — đã fix | agent đổi đúng sang `lookup` khi user đổi ý | ✅ Fixed so với v1 |
| R11_missing_url (tái phát) | missing_info (missing_tool_call) | `fetch(url="https://example.com")` | Case này từng PASS ở v1 nhưng fail lại ở v2 — agent lại tự bịa URL thay vì `clarify`. Cần review kỹ vì đây là dấu hiệu prompt v2 có thể làm yếu quy tắc "thiếu URL phải hỏi lại" so với v1 |
| M02_carryover_timeframe | wrong_arg_value (vẫn còn) | `lookup(query="robotics", topic="news")` — vẫn thiếu `timeframe` | Chưa fix qua cả 3 version — vấn đề giữ ngữ cảnh multi-turn vẫn tồn tại, nên là hypothesis chính cho v3 |

Nhận xét: v2 cải thiện tổng thể (`case_accuracy` 0.85→0.90) nhưng có 1 **regression** đáng chú ý (`R11` PASS ở v1 rồi FAIL lại ở v2) — nên soát kỹ đoạn nào trong `system_prompt.md` v2 làm yếu quy tắc "thiếu URL → clarify". Hypothesis cho v3: (1) khôi phục/làm rõ lại quy tắc `fetch` cần URL thật, (2) thêm ví dụ cụ thể về giữ `timeframe` qua các turn để fix `M02`.

## B3. Team eval cases

List the 10 cases added to `data/eval_group.json`:

- 5 single-turn
- 5 multi-turn

This section is for the mandatory team-authored eval set. Optional built-ins do
not belong here.

File template để trống có chủ đích; nhóm phải tự thiết kế đủ 10 case.

> Chưa chạy `--suite group` — cột Result để trống, cần chạy `python run_eval.py --provider openai --version v2 --suite group --eval-cases data/eval_group.json` (hoặc version mới nhất) rồi điền lại.

| Case ID | Kind | Failure Type | What It Tests | Expected Tool/Behavior | Result |
|---|---|---|---|---|---|
| G01_lookup_ai_news | single | wrong_tool | Tra cứu tin AI trong ngày bằng lookup | `lookup(query="AI", topic="news", timeframe="day", max_results=5)` | TODO — chưa chạy suite group |
| G02_openai_timeline | single | wrong_tool | Tra cứu timeline của tài khoản OpenAI | `timeline(screenname="openai", limit=5)` | TODO |
| G03_social_search_gemini | single | wrong_tool | Tìm bài đăng mạng xã hội theo chủ đề | `social_search(query="Google Gemini", search_type="Latest", limit=10)` | TODO |
| G04_fetch_article | single | wrong_tool | Đọc nội dung từ URL | `fetch(url="https://openai.com/news")` | TODO |
| G05_policy_data_privacy | single | wrong_tool | Tra cứu chính sách bảo mật dữ liệu | `policy(query="bảo mật dữ liệu AI", policy_area="data_privacy", top_k=3)` | TODO |
| G06_clarify_then_fetch | multi | missing_info | Thiếu URL, sau khi user bổ sung thì gọi fetch | `fetch(url="https://openai.com/news")` | TODO |
| G07_clarify_then_timeline | multi | missing_info | Bổ sung tên tài khoản ở lượt hội thoại tiếp theo | `timeline(screenname="openai", limit=3)` | TODO |
| G08_paper_then_text | multi | wrong_tool | Đọc nội dung paper từ URL arXiv | `paper_text(arxiv_url="https://arxiv.org/abs/2401.00001", max_pages=5, max_chars=10000)` | TODO |
| G09_change_topic | multi | wrong_arg_value | Đổi query nhưng giữ timeframe | `lookup(query="Robotics", topic="news", timeframe="day", max_results=5)` | TODO |
| G10_switch_social_to_web | multi | wrong_tool | Chuyển từ social_search sang lookup | `lookup(query="ChatGPT", topic="news", timeframe="week", max_results=5)` | TODO |

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
