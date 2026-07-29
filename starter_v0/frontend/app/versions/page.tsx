"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVersions } from "@/lib/api";
import type { RunSummary } from "@/lib/types";

function metric(value: number | undefined): string {
  return value === undefined ? "—" : value.toFixed(2);
}

export default function VersionsPage() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVersions()
      .then((r) => setRuns(r.runs))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">So sánh version</h1>
          <p className="text-sm text-muted">Đọc trực tiếp từ runs/*.json — bằng chứng cải thiện qua v0 → v3.</p>
        </div>
        <Link href="/" className="text-sm font-medium text-accent-600 hover:underline">
          ← Về chat
        </Link>
      </div>

      {loading && <p className="text-sm text-muted">Đang tải...</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="surface overflow-x-auto rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr className="border-b">
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Provider / Model</th>
                <th className="px-4 py-3">Case Acc.</th>
                <th className="px-4 py-3">Tool Routing</th>
                <th className="px-4 py-3">Argument Acc.</th>
                <th className="px-4 py-3">Multiturn Acc.</th>
                <th className="px-4 py-3">Provider Errors</th>
                <th className="px-4 py-3">Run file</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.file} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono font-medium">{run.version}</td>
                  <td className="px-4 py-3 text-muted">
                    {run.provider} / {run.model}
                  </td>
                  <td className="px-4 py-3">{metric(run.summary.case_accuracy)}</td>
                  <td className="px-4 py-3">{metric(run.summary.tool_routing_accuracy)}</td>
                  <td className="px-4 py-3">{metric(run.summary.argument_accuracy)}</td>
                  <td className="px-4 py-3">{metric(run.summary.multiturn_accuracy)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        run.summary.provider_error_cases
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      {run.summary.provider_error_cases ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{run.file}</td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-muted">
                    Chưa có run nào trong runs/. Chạy run_eval.py trước.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}