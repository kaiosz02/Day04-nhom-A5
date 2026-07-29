"use client";

interface HeaderProps {
  version: string;
  onVersionChange: (v: string) => void;
  provider: string;
  onProviderChange: (p: string) => void;
  artifactVersion?: string;
}

const VERSIONS = ["v0", "v1", "v2", "v3"];
const PROVIDERS = ["openai", "openrouter", "anthropic", "gemini"];

export default function Header({
  version,
  onVersionChange,
  provider,
  onProviderChange,
  artifactVersion,
}: HeaderProps) {
  return (
    <header className="surface flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">AI Tech News Assistant</h1>
        <p className="text-xs text-muted">Research agent · tra cứu tin tức công nghệ</p>
      </div>

      <div className="flex items-center gap-2">
        {artifactVersion && (
          <span className="hidden rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 dark:border-accent-700 dark:bg-transparent dark:text-accent-500 sm:inline-block">
            {artifactVersion}
          </span>
        )}

        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="surface rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={version}
          onChange={(e) => onVersionChange(e.target.value)}
          className="surface rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
        >
          {VERSIONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <a
          href="/versions"
          className="rounded-lg border border-accent-600 px-3 py-1.5 text-sm font-medium text-accent-600 transition hover:bg-accent-50 dark:hover:bg-accent-700/10"
        >
          So sánh version
        </a>
      </div>
    </header>
  );
}