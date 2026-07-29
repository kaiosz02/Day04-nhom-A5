# Research Agent UI (Next.js)

Frontend cho AI Tech News Assistant. Gọi vào API Python ở `../server.py`
(FastAPI), API đó tái sử dụng đúng `run_model_tool_loop` trong `../chat.py`
nên logic agent chỉ có một chỗ duy nhất.

## Chạy backend (từ `starter_v0/`)

```bash
source .venv/bin/activate            # venv đã setup theo TOOL-SETUP.md
pip install -r requirements.txt      # có thêm fastapi/uvicorn/pydantic
uvicorn server:app --reload --port 8000
```

Cần có `.env` với ít nhất 1 provider key (xem `.env.example`), nếu không
`/api/chat` sẽ trả lỗi rõ ràng thay vì UI đứng im.

## Chạy frontend (từ `starter_v0/frontend/`)

```bash
cp .env.local.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu trúc

- `app/page.tsx` — trang chat chính: sidebar (câu hỏi mẫu + danh sách tool) +
  khung chat ở giữa + panel tool trace bên phải (round/tool/args/status/result).
- `app/versions/page.tsx` — bảng so sánh metric v0-v3, đọc từ `runs/*.json`
  qua `GET /api/versions`.
- `components/` — Header (chọn provider/version), Sidebar, MessageBubble,
  ChatInput, ToolTracePanel.
- `lib/api.ts`, `lib/types.ts` — gọi API + kiểu dữ liệu dùng chung.

## Deploy demo (Cloudflare Tunnel)

Cần tunnel cho cả 2 cổng, hoặc build frontend rồi trỏ `NEXT_PUBLIC_API_URL`
sang tunnel URL của backend trước khi build:

```bash
# terminal 1 (backend)
cloudflared tunnel --url http://localhost:8000
# sửa NEXT_PUBLIC_API_URL trong .env.local thành URL vừa in ra, rồi:
npm run build && npm run start
# terminal 2 (frontend)
cloudflared tunnel --url http://localhost:3000
```

Dán URL frontend vào `artifacts/REPORT.md` phần A1.