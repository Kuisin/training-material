import { useEffect, useState, type ChangeEvent } from "react";
import { cn } from "../lib/cn";
import { downloadAppData, importAppData } from "../lib/data-transfer";

function DataTransferPanel({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleExport() {
    downloadAppData();
    setStatus({ type: "success", message: "エクスポートしました" });
  }

  function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw: unknown = JSON.parse(ev.target?.result as string);
        const result = importAppData(raw);
        if (result.ok) {
          setStatus({ type: "success", message: "インポートしました。ページを再読み込みします…" });
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setStatus({ type: "error", message: `エラー: ${result.error}` });
        }
      } catch {
        setStatus({ type: "error", message: "ファイルの読み込みに失敗しました" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label="データの転送"
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="mb-1 text-sm font-bold text-slate-700 dark:text-slate-200">データの転送</h3>
        <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          レッスン進捗とテスト結果を別のデバイスに移行できます。
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand/5 hover:border-brand/40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand/40"
          >
            <span className="text-base" aria-hidden>
              ↓
            </span>
            エクスポート（ファイルに保存）
          </button>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand/5 hover:border-brand/40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand/40">
            <span className="text-base" aria-hidden>
              ↑
            </span>
            インポート（ファイルから読み込み）
            <input
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={handleImport}
            />
          </label>
        </div>
        {status && (
          <p
            className={cn(
              "mt-3 text-xs font-medium",
              status.type === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {status.message}
          </p>
        )}
      </div>
    </>
  );
}

export function DataTransferButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="データの転送"
        title="データの転送"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </button>
      {open && <DataTransferPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
