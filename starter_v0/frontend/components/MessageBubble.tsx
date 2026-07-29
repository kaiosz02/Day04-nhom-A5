"use client";

import type { TurnDisplay } from "@/lib/types";

export default function MessageBubble({ turn, active, onSelect }: {
  turn: TurnDisplay;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-accent-600 px-4 py-2 text-sm text-white">
          {turn.user}
        </div>
      </div>

      <button onClick={onSelect} className="flex justify-start text-left">
        <div
          className={`surface max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-2 text-sm transition ${
            active ? "ring-2 ring-accent-500" : ""
          }`}
        >
          {turn.pending && <span className="text-muted">Đang xử lý…</span>}
          {turn.error && <span className="text-red-600 dark:text-red-400">Lỗi: {turn.error}</span>}
          {turn.response && (
            <>
              <p className="whitespace-pre-wrap">{turn.response.assistant_text}</p>
              {turn.response.status !== "answered" && (
                <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  {turn.response.status}
                </span>
              )}
            </>
          )}
        </div>
      </button>
    </div>
  );
}