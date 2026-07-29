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
> URL: TODO (chạy `cloudflared tunnel --url http://localhost:3000` rồi dán URL vào đây — xem `frontend/README.md`). UI đã chạy được ở `http://localhost:3000` (Next.js) gọi vào API `http://localhost:8000` (`server.py`, FastAPI), chỉ còn thiếu bước public tunnel cho demo từ máy khác.

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
| Câu hỏi ngoài phạm vi ("Nguyên hàm của x² là gì?") | v0: gọi nhầm `send`. v1+: không gọi tool nào, trả lời/từ chối trực tiếp | v0 case `R08_out_of_scope` fail vì gọi `send` ngoài phạm vi → v1 sửa `system_prompt.md` (bỏ hẳn hành vi này) | `runs/v0_B_base_openai_20260729T153133080224.json` / `runs/v3_base_B_base_openai_20260729T165957121225.json` |
| Thiếu tên tài khoản ("Xem tweet gần đây của người đó") | v0: tự đoán `timeline(screenname="sama")`. v1+: gọi `clarify` hỏi lại tên tài khoản | v0 case `R10_missing_handle` fail vì tự bịa handle → v1 sửa boundary "thiếu info phải hỏi lại" | `runs/v0_..153133080224.json` |
| Đổi chủ đề giữa hội thoại ("Tìm tin AI hôm nay" → "Robotics thì sao?") | Round 2: `lookup(query="Robotics", timeframe="day", ...)` — giữ đúng `timeframe` từ turn trước | Case `M02`/`G09` fail liên tục qua v0-v2, chỉ fix hẳn ở v3/v5_group sau khi nhấn mạnh "giữ ngữ cảnh multi-turn" | `runs/v5_group_B_group_openai_20260729T171229597972.json` |
| Đọc paper arXiv ("Tóm tắt paper 2401.00001" → "đọc nội dung chi tiết") | `papers(...)` rồi `paper_text(arxiv_url="https://arxiv.org/abs/2401.00001", ...)` — full URL, không phải chỉ ID | Case `G08` fail ở v4_group vì truyền thiếu URL đầy đủ, fix ở v5_group | `runs/v4_group_...171122290738.json` / `runs/v5_group_...171229597972.json` |
| Tool mới của nhóm ("Dự án nào đang nổi trên GitHub?") | `tech_trending(topic="ai", limit=5)` — dữ liệu mẫu cục bộ, không phải GitHub thật | Không nằm trong base/group suite (không có version so sánh); demo để chứng minh tool mới hoạt động, cần nói rõ đây là dữ liệu mẫu | Live demo qua UI (`localhost:3000`), chưa có transcript sẵn — nên chạy thử và lưu transcript trước buổi demo |

> 5 scenario trên đều test được qua UI thật ở `http://localhost:3000` (xem `frontend/README.md` để chạy). Nên rehearse từng scenario ít nhất 1 lần trên UI trước showdown để chắc chắn transcript/tool trace hiển thị đúng.

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
| v3 | Tiếp tục siết `system_prompt.md`/`tools.yaml` để khôi phục quy tắc "thiếu URL → clarify" (fix `R11` tái phát ở v2) và làm rõ cách giữ `timeframe` qua các turn (fix `M02`) | Cả 2 hypothesis nêu ở v2 (khôi phục boundary `fetch`, ví dụ giữ ngữ cảnh `timeframe`) | case_accuracy | 0.90 | 1.00 | `runs/v3_base_B_base_openai_20260729T165957121225.json` |

**Chi tiết metric v0** (từ `summary` trong run file trên): `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ để báo cáo) · `case_accuracy=0.70` · `tool_routing_accuracy=0.70` · `argument_accuracy=0.70` · `multiturn_accuracy=1.00`. `artifact_version=v0+peb1c8179815b+t6cdb53d5d7b8`.

**Chi tiết metric v1** (provider `openai`, model `gpt-4o-mini`): `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ) · `case_accuracy=0.85` (+0.15 so với v0) · `tool_routing_accuracy=0.95` · `argument_accuracy=0.85` · `multiturn_accuracy=0.667` (giảm so với v0=1.00, cần Role 3/5 xem lại case multi-turn nào mới fail). `artifact_version=v1+p18f7870af615+t97391bc363be`.

> Lưu ý: có 1 file `runs/v1_B_base_openrouter_20260729T155136852024.json` cùng thời điểm nhưng `provider_error_cases=20/20` (toàn bộ case lỗi provider, không đo được) — **không dùng file này làm evidence**, chỉ dùng bản chạy `openai` ở trên.

**Chi tiết metric v2**: `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ) · `case_accuracy=0.90` (+0.05 so với v1) · `tool_routing_accuracy=0.95` · `argument_accuracy=0.90` · `multiturn_accuracy=0.833` (tăng từ 0.667 ở v1, nhưng vẫn chưa lại được mức 1.00 của v0). `artifact_version=v2+p1edc6c44c37e+t5e044aede690` — hash này khác hẳn v1 (`p18f7870af615/t97391bc363be`), xác nhận đây là một thay đổi thật, không phải run trùng lặp.

**Chi tiết metric v3**: `total_cases=20`, `measured_cases=20`, `provider_error_cases=0` (hợp lệ) · `case_accuracy=1.00` · `tool_routing_accuracy=1.00` · `argument_accuracy=1.00` · `multiturn_accuracy=1.00` — **20/20 case pass, 0 failure**. `artifact_version=v3_group+p900580c3b2b7+t31bcb0a94c70` (label nội bộ trong file là `v3_group` vì cùng bản prompt/tools được dùng để tune tiếp trên eval_group ở B3, nhưng đây chính là kết quả base suite cho v3).

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

**Sau v3 — 0/20 case fail, evidence: `runs/v3_base_B_base_openai_20260729T165957121225.json`:**

Cả `R11_missing_url` và `M02_carryover_timeframe` — 2 lỗi tồn đọng xuyên suốt v0→v2 — đều đã fix. Base suite đạt 20/20, không còn failure nào để phân tích thêm. Đây là điểm dừng hợp lý cho vòng tối ưu base suite; các vòng tối ưu tiếp theo (v3_group/v4_group/v5_group, xem B3) chuyển sang nhắm vào bộ 10 case nhóm tự viết (`eval_group.json`) — bộ case này lộ ra các lỗi khác (thiếu default argument, sai format `arxiv_url`) mà 20 case base suite không test tới.

## B3. Team eval cases

List the 10 cases added to `data/eval_group.json`:

- 5 single-turn
- 5 multi-turn

This section is for the mandatory team-authored eval set. Optional built-ins do
not belong here.

File template để trống có chủ đích; nhóm phải tự thiết kế đủ 10 case.

Đã chạy `--suite group` 3 lần trên chính bộ 10 case này để tối ưu riêng (không đụng vào base suite):

| Run | artifact_version | case_accuracy | tool_routing | argument_acc | multiturn_acc | Run file |
|---|---|---:|---:|---:|---:|---|
| Lần 1 (v3_group) | `v3_group+p900580c3b2b7+t31bcb0a94c70` | 0.30 | 0.80 | 0.30 | 0.40 | `runs/v3_group_B_group_openai_20260729T170118851280.json` |
| Lần 2 (v4_group) | `v4_group+p50bbaeca1034+tfddf8fa46190` | 0.80 | 1.00 | 0.80 | 0.60 | `runs/v4_group_B_group_openai_20260729T171122290738.json` |
| Lần 3 (v5_group) | `v5_group+p54a99f7def8d+t3d05bb14da7d` | 1.00 | 1.00 | 1.00 | 1.00 | `runs/v5_group_B_group_openai_20260729T171229597972.json` |

**Lần 1 → 7/10 case fail** — routing tool đúng phần lớn (`tool_routing=0.80`) nhưng sai/thiếu default argument (`max_results`, `limit`, `top_k` không được điền dù có default trong `tools.yaml`), và 2 case multi-turn chọn sai tool (`G04` gọi `clarify` thay vì `fetch`, `G08` gọi `fetch` thay vì `paper_text`). Hypothesis: model không tự suy ra default parameters — sửa `tools.yaml` để đặt các tham số có default quan trọng thành `required` thay vì optional.

**Lần 2 (sau khi sửa `tools.yaml`) → 2/10 case fail** — `tool_routing` lên 1.00 (100%, đúng hướng), còn lại 2 lỗi cụ thể: `G08` truyền `arxiv_url="2401.00001"` (chỉ ID) thay vì full URL `https://arxiv.org/abs/2401.00001`; `G10` giữ `timeframe="day"` từ turn trước thay vì đổi đúng theo yêu cầu mới là `"week"`. Hypothesis: ép rõ format `arxiv_url` phải là full URL, và nêu rõ default `timeframe="week"` khi user không nói cụ thể ngày/tuần.

**Lần 3 (sau khi sửa system_prompt + tools) → 10/10 case pass.**

| Case ID | Kind | Failure Type | What It Tests | Expected Tool/Behavior | Result (v5_group) |
|---|---|---|---|---|---|
| G01_lookup_ai_news | single | wrong_tool | Tra cứu tin AI trong ngày bằng lookup | `lookup(query="AI", topic="news", timeframe="day", max_results=5)` | ✅ PASS |
| G02_openai_timeline | single | wrong_tool | Tra cứu timeline của tài khoản OpenAI | `timeline(screenname="openai", limit=5)` | ✅ PASS |
| G03_social_search_gemini | single | wrong_tool | Tìm bài đăng mạng xã hội theo chủ đề | `social_search(query="Google Gemini", search_type="Latest", limit=10)` | ✅ PASS |
| G04_fetch_article | single | wrong_tool | Đọc nội dung từ URL | `fetch(url="https://openai.com/news")` | ✅ PASS |
| G05_policy_data_privacy | single | wrong_tool | Tra cứu chính sách bảo mật dữ liệu | `policy(query="bảo mật dữ liệu AI", policy_area="data_privacy", top_k=3)` | ✅ PASS |
| G06_clarify_then_fetch | multi | missing_info | Thiếu URL, sau khi user bổ sung thì gọi fetch | `fetch(url="https://openai.com/news")` | ✅ PASS |
| G07_clarify_then_timeline | multi | missing_info | Bổ sung tên tài khoản ở lượt hội thoại tiếp theo | `timeline(screenname="openai", limit=3)` | ✅ PASS |
| G08_paper_then_text | multi | wrong_tool | Đọc nội dung paper từ URL arXiv | `paper_text(arxiv_url="https://arxiv.org/abs/2401.00001", max_pages=5, max_chars=10000)` | ✅ PASS |
| G09_change_topic | multi | wrong_arg_value | Đổi query nhưng giữ timeframe | `lookup(query="Robotics", topic="news", timeframe="day", max_results=5)` | ✅ PASS |
| G10_switch_social_to_web | multi | wrong_tool | Chuyển từ social_search sang lookup | `lookup(query="ChatGPT", topic="news", timeframe="week", max_results=5)` | ✅ PASS |

## B4. Live chat evidence

Use `transcripts/*.transcript.json`. Chat qua UI thật (`frontend/` + `server.py`), không phải CLI `chat.py`.

| Scenario/Turn | Version | Tool Calls + Args | Transcript | Outcome |
|---|---|---|---|---|
| "tin tức mới về AI" | v0 | `lookup(query="AI", topic="news", timeframe="day")` | `transcripts/v0_openai_2760178b-....transcript.json` | answered — trả tin thật (Tavily) |
| "tìm tài liệu về llm" | v0 | `papers(query="llm", ...)` | (cùng transcript trên) | answered |
| "cho tôi biết thông tin về gpt5.6" | v0 | không gọi tool | (cùng transcript trên) | answered — model tự trả lời, không bịa tool |
| "tin tức về gpt5.6" | v3 | `lookup(query="gpt5.6", topic="news", ...)` | `transcripts/v3_openai_21c5f300-....transcript.json` | answered |
| "tôi là ai" | v3 | không gọi tool | (cùng transcript trên) | answered — câu hỏi ngoài phạm vi, không gọi tool thừa |
| "tin tức về llm" | v3 | `lookup(query="llm", topic="news", ...)` | (cùng transcript trên) | answered |

> Các turn trên đều `status=answered` (không có case nào rơi vào `waiting_for_user`/`max_tool_rounds` trong log hiện có). README khuyến nghị thử thêm tối thiểu 1 turn thiếu thông tin (kích hoạt `clarify`) và 1 turn hành động nhạy cảm cần xác nhận yes/no — nên bổ sung trước khi demo để có đủ 3 loại evidence.

## B5. Tool capability evidence

Phân loại rõ tool mới bắt buộc, optional built-in và tool đủ điều kiện bonus. Chỉ ghi Telegram/PDF nếu nhóm thực sự dùng; base report không cần chúng.

UI is core deliverable, not bonus. Do not list it here.

| Category | Evidence File | What Worked | Risk / Guardrail |
|---|---|---|---|
| Must-have: `tech_trending` | `tools/tech_trending/TOOL.md`, `tools/tech_trending/tool.py` | Đăng ký đúng trong `tools.yaml`/`tools/__init__.py`, có `TOOL.md` đầy đủ | Chỉ trả dữ liệu mẫu hard-code theo 3 chủ đề (ai/web/cloud), không gọi API GitHub thật — cần nói rõ khi demo để tránh hiểu nhầm là dữ liệu live |
| Bonus: `topic_trends`, `source_ranker`, `news_digest`, `entity_extractor` | `tools/<tên>/TOOL.md` tương ứng | Đủ 4 tool bonus (>3 theo yêu cầu), đều có `TOOL.md`+`tool.py`, đăng ký đầy đủ | Cả 4 xử lý local/heuristic đơn giản (đếm từ, regex, rule-based score) — không phải model/NER thật, độ chính xác hạn chế |
| Optional built-in: `policy`, `papers`, `paper_text` | dùng trong `data/eval_group.json` (`G05`, `G08`) | Vẫn khai báo trong `tools.yaml`, phục vụ case nhóm tự viết | Không phải tool nhóm tự làm — không tính vào 5 tool mới |
| Optional built-in: `send` (Telegram) | không dùng | Đã gỡ khỏi `tools.yaml`/system prompt từ v2 | Không dùng trong demo — team chỉ demo qua UI local/tunnel |

## B6. Reflection

- **Fixes thuộc `system_prompt.md`**: ranh giới xác nhận (confirmation boundary) trước hành động nhạy cảm, quy tắc "thiếu thông tin → `clarify`" (fix `R10`, `R11`, `G06`, `G07`), routing giữa các tool dễ nhầm (`social_search` vs `timeline`, fix `R13`), giữ ngữ cảnh multi-turn (`timeframe` carryover, fix `M02`, `G09`).
- **Fixes thuộc `tools.yaml`**: gỡ hẳn `send` khỏi declaration khi quyết định không dùng Telegram (v2); đổi các tham số có default quan trọng (`max_results`, `limit`, `top_k`) từ optional sang bắt buộc điền — đây là fix có tác động lớn nhất trên eval_group (case_accuracy 0.30→0.80 chỉ sau 1 thay đổi).
- **Lỗi cần review thủ công thay vì chỉ tin PASS/FAIL tự động**: `tech_trending` luôn "PASS" theo nghĩa không lỗi vì chỉ trả dữ liệu mẫu cứng — routing đúng không đồng nghĩa dữ liệu trả về đúng/thật; cần review riêng khi demo. Tương tự `R11`/`M02` từng PASS ở v1 rồi FAIL lại ở v2 — nhắc rằng một version "điểm cao hơn" không có nghĩa mọi case cũ vẫn đúng, luôn cần soát lại danh sách case fail cụ thể, không chỉ nhìn accuracy tổng.
- **Việc tiếp theo nếu có thêm thời gian**: (1) làm `tech_trending` gọi GitHub Trending thật thay vì dữ liệu mẫu; (2) bổ sung transcript live chat có case `clarify`/`send`-style confirmation (hiện chưa có trong log); (3) review kỹ nguyên nhân regression `R11` giữa v1→v2 để hiểu rõ cơ chế, không chỉ vá triệu chứng.
