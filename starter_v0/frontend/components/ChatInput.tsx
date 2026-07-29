"use client";

import { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const [composing, setComposing] = useState(false);

  return (
    <div className="surface flex items-end gap-2 border-t p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !composing) {
            e.preventDefault();
            if (!disabled && value.trim()) onSend();
          }
        }}
        rows={1}
        placeholder="Hỏi về tin tức công nghệ, AI, LLM..."
        className="max-h-40 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-[color:rgb(var(--border))] bg-transparent px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Gửi
      </button>
    </div>
  );
}