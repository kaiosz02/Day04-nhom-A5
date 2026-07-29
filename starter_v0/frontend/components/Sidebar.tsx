"use client";

import type { ToolDeclaration } from "@/lib/types";

const SAMPLE_QUESTIONS = [
  "Tìm tin mới nhất về LLM trong tuần này.",
  "Tweet mới của Sam Altman nói gì về AI gần đây?",
  "Dự án AI nào đang nổi trên GitHub tuần này?",
  "Đọc bài viết ở URL này và tóm tắt lại nội dung chính.",
  "Bạn muốn tra tin về lĩnh vực nào?",
];

interface SidebarProps {
  tools: ToolDeclaration[];
  onPickQuestion: (q: string) => void;
}

export default function Sidebar({ tools, onPickQuestion }: SidebarProps) {
  return (
    <aside className="surface flex h-full w-72 shrink-0 flex-col gap-6 overflow-y-auto border-r p-4">
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Câu hỏi mẫu
        </h2>
        <div className="flex flex-col gap-1.5">
          {SAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onPickQuestion(q)}
              className="rounded-lg border border-transparent px-3 py-2 text-left text-sm transition hover:border-accent-100 hover:bg-accent-50 dark:hover:border-accent-700/40 dark:hover:bg-accent-700/10"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Tool khả dụng ({tools.length})
        </h2>
        <div className="flex flex-col gap-1.5">
          {tools.map((tool) => (
            <details
              key={tool.name}
              className="group rounded-lg border border-transparent px-3 py-1.5 open:border-[color:rgb(var(--border))]"
            >
              <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
                <span className="mr-1 inline-block w-3 text-muted transition group-open:rotate-90">
                  ›
                </span>
                {tool.name}
              </summary>
              <p className="mt-1 pl-4 text-xs text-muted">{tool.description}</p>
            </details>
          ))}
        </div>
      </section>
    </aside>
  );
}