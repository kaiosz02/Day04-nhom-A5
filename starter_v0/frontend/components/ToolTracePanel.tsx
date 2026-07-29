"use client";

import type { ChatResponse, RoundRecord, ToolEvent } from "@/lib/types";

function statusOf(event: ToolEvent): { label: string; className: string } {
  const result = event.result || {};
  if (result.error) {
    return { label: "error", className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" };
  }
  if (result.awaiting_user) {
    return {
      label: "awaiting_user",
      className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    };
  }
  return { label: "ok", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" };
}

function ToolEventRow({ event }: { event: ToolEvent }) {
  const status = statusOf(event);
  return (
    <div className="surface rounded-lg p-3 text-xs">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono font-semibold">{event.tool}</span>
        <span className={`rounded-full px-2 py-0.5 font-medium ${status.className}`}>{status.label}</span>
      </div>
      {event.args && Object.keys(event.args).length > 0 && (
        <pre className="mb-1 overflow-x-auto whitespace-pre-wrap break-words text-muted">
          {JSON.stringify(event.args, null, 2)}
        </pre>
      )}
      {event.result && (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words">
          {JSON.stringify(event.result, null, 2).slice(0, 1200)}
        </pre>
      )}
    </div>
  );
}

function RoundBlock({ round }: { round: RoundRecord }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold text-muted">Round {round.round}</div>
      {round.tool_results.length === 0 ? (
        <p className="text-xs text-muted">Không gọi tool nào ở round này.</p>
      ) : (
        round.tool_results.map((event, idx) => <ToolEventRow key={`${round.round}-${idx}`} event={event} />)
      )}
    </div>
  );
}

export default function ToolTracePanel({ response }: { response: ChatResponse | undefined }) {
  return (
    <aside className="surface flex h-full w-96 shrink-0 flex-col gap-4 overflow-y-auto border-l p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Tool trace</h2>

      {!response ? (
        <p className="text-sm text-muted">Gửi một tin nhắn để xem trace tool ở đây.</p>
      ) : (
        <>
          <div className="surface flex flex-col gap-1 rounded-lg p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">status</span>
              <span className="font-medium">{response.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">artifact_version</span>
              <span className="font-mono">{response.artifact_version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">transcript</span>
              <span className="font-mono">{response.transcript_file}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {response.rounds.map((round) => (
              <RoundBlock key={round.round} round={round} />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}