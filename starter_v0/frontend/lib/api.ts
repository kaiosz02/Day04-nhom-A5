import type { ChatMessage, ChatResponse, RunSummary, ToolDeclaration } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function getSystemPrompt(): Promise<{ content: string }> {
  return getJson("/api/system-prompt");
}

export function getTools(): Promise<{ tools: ToolDeclaration[] }> {
  return getJson("/api/tools");
}

export function getVersions(): Promise<{ runs: RunSummary[] }> {
  return getJson("/api/versions");
}

export interface SendChatArgs {
  sessionId: string;
  provider: string;
  model?: string;
  version: string;
  message: string;
  history: ChatMessage[];
}

export async function sendChat(args: SendChatArgs): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: args.sessionId,
      provider: args.provider,
      model: args.model || null,
      version: args.version,
      message: args.message,
      history: args.history,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Chat request failed: ${res.status}`);
  }
  return res.json() as Promise<ChatResponse>;
}