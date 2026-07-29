"""Thin HTTP API bridging the existing CLI agent (chat.py) to the Next.js UI.

Reuses run_model_tool_loop from chat.py exactly like the CLI does, so the UI
sees the same rounds/tool_events/status contract and writes transcripts with
the same shape. Run with:

    uvicorn server:app --reload --port 8000
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chat import now_iso, run_model_tool_loop, safe_slug, trim_history, write_transcript
from env_loader import load_lab_env
from providers import make_provider
from tools import load_tool_declarations, to_openai_tools
from versioning import artifact_version_dict, build_artifact_version

ROOT = Path(__file__).parent
ARTIFACTS_DIR = ROOT / "artifacts"
RUNS_DIR = ROOT / "runs"
TRANSCRIPTS_DIR = ROOT / "transcripts"
load_lab_env(ROOT)

app = FastAPI(title="Research Agent API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_provider_cache: dict[str, Any] = {}


def get_provider(name: str) -> Any:
    if name not in _provider_cache:
        try:
            _provider_cache[name] = make_provider(name)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Unknown or unconfigured provider '{name}': {exc}") from exc
    return _provider_cache[name]


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    session_id: str
    provider: str = "openai"
    model: str | None = None
    version: str = "v0"
    message: str
    history: list[ChatTurn] = []
    history_window: int = 5
    max_tool_rounds: int = 4


class ChatResponse(BaseModel):
    status: str
    assistant_text: str
    rounds: list[dict[str, Any]]
    tool_events: list[dict[str, Any]]
    artifact_version: str
    transcript_file: str


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/system-prompt")
def get_system_prompt() -> dict[str, str]:
    return {"content": (ARTIFACTS_DIR / "system_prompt.md").read_text(encoding="utf-8")}


@app.get("/api/tools")
def get_tools() -> dict[str, Any]:
    declarations = load_tool_declarations(ARTIFACTS_DIR / "tools.yaml")
    return {"tools": declarations}


@app.get("/api/versions")
def list_versions() -> dict[str, Any]:
    """Summarize every runs/*.json for the version-comparison view."""
    runs: list[dict[str, Any]] = []
    for path in sorted(RUNS_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        runs.append({
            "file": path.name,
            "version": data.get("version"),
            "artifact_version": data.get("artifact_version"),
            "provider": data.get("provider"),
            "model": data.get("model"),
            "suite": data.get("suite"),
            "summary": data.get("summary", {}),
        })
    return {"runs": runs}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    system_prompt_path = ARTIFACTS_DIR / "system_prompt.md"
    tools_path = ARTIFACTS_DIR / "tools.yaml"

    system_prompt = system_prompt_path.read_text(encoding="utf-8")
    tool_declarations = load_tool_declarations(tools_path)
    openai_tools = to_openai_tools(tool_declarations)
    provider = get_provider(req.provider)
    artifact_version = build_artifact_version(req.version, system_prompt_path, tools_path)

    history_dicts = [{"role": t.role, "content": t.content} for t in req.history]
    messages = [
        {"role": "system", "content": system_prompt},
        *trim_history(history_dicts, req.history_window),
        {"role": "user", "content": req.message},
    ]

    try:
        result = run_model_tool_loop(
            provider=provider,
            messages=messages,
            tools=openai_tools,
            model=req.model,
            max_tool_rounds=req.max_tool_rounds,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"{type(exc).__name__}: {exc}") from exc

    transcript_id = "_".join([safe_slug(req.version), safe_slug(req.provider), safe_slug(req.session_id)])
    transcript_path = TRANSCRIPTS_DIR / f"{transcript_id}.transcript.json"
    transcript: dict[str, Any] = {}
    if transcript_path.exists():
        transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
    else:
        transcript = {
            "transcript_id": transcript_id,
            **artifact_version_dict(artifact_version),
            "provider": req.provider,
            "model": req.model,
            "created_at": now_iso(),
            "turns": [],
        }
    transcript["turns"].append({
        "turn_index": len(transcript["turns"]) + 1,
        "started_at": now_iso(),
        "user": req.message,
        **result,
        "ended_at": now_iso(),
    })
    write_transcript(transcript_path, transcript)

    return ChatResponse(
        status=result["status"],
        assistant_text=result["assistant_text"],
        rounds=result["rounds"],
        tool_events=result["tool_events"],
        artifact_version=artifact_version.artifact_version,
        transcript_file=transcript_path.name,
    )