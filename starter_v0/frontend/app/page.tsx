"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import ToolTracePanel from "@/components/ToolTracePanel";
import { getTools, sendChat } from "@/lib/api";
import type { ToolDeclaration, TurnDisplay } from "@/lib/types";

function makeSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatPage() {
  const [provider, setProvider] = useState("openai");
  const [version, setVersion] = useState("v0");
  const [tools, setTools] = useState<ToolDeclaration[]>([]);
  const [turns, setTurns] = useState<TurnDisplay[]>([]);
  const [input, setInput] = useState("");
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const sessionId = useRef(makeSessionId());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTools()
      .then((r) => setTools(r.tools))
      .catch(() => setTools([]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const selectedTurn = useMemo(
    () => turns.find((t) => t.id === selectedTurnId) ?? turns[turns.length - 1],
    [turns, selectedTurnId]
  );

  async function handleSend() {
    const message = input.trim();
    if (!message || sending) return;

    const id = `${Date.now()}`;
    const history = turns
      .filter((t) => t.response)
      .flatMap((t) => [
        { role: "user" as const, content: t.user },
        { role: "assistant" as const, content: t.response!.assistant_text },
      ]);

    setTurns((prev) => [...prev, { id, user: message, pending: true }]);
    setSelectedTurnId(id);
    setInput("");
    setSending(true);

    try {
      const response = await sendChat({
        sessionId: sessionId.current,
        provider,
        version,
        message,
        history,
      });
      setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, pending: false, response } : t)));
    } catch (err) {
      setTurns((prev) =>
        prev.map((t) => (t.id === id ? { ...t, pending: false, error: (err as Error).message } : t))
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        version={version}
        onVersionChange={setVersion}
        provider={provider}
        onProviderChange={setProvider}
        artifactVersion={turns[turns.length - 1]?.response?.artifact_version}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar tools={tools} onPickQuestion={setInput} />

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {turns.length === 0 && (
              <div className="mx-auto max-w-md pt-16 text-center text-sm text-muted">
                Chọn một câu hỏi mẫu ở sidebar hoặc gõ câu hỏi của bạn để bắt đầu.
              </div>
            )}
            {turns.map((turn) => (
              <MessageBubble
                key={turn.id}
                turn={turn}
                active={turn.id === selectedTurn?.id}
                onSelect={() => setSelectedTurnId(turn.id)}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={sending} />
        </main>

        <ToolTracePanel response={selectedTurn?.response} />
      </div>
    </div>
  );
}