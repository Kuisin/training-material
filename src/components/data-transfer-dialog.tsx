import { useRef, useState, type ChangeEvent } from "react";
import { downloadExport, importFromFile } from "../lib/data-transfer";

export function DataTransferButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "importing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    downloadExport();
    setOpen(false);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("importing");
    try {
      await importFromFile(file);
      setStatus("done");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "不明なエラー");
      setStatus("error");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="データのエクスポート・インポート"
        title="データ転送"
      >
        ↑↓
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-40 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={handleExport}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden>⬇</span>
              エクスポート（ファイルに保存）
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              disabled={status === "importing"}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden>⬆</span>
              {status === "importing"
                ? "読み込み中…"
                : status === "done"
                  ? "完了！"
                  : "インポート（ファイルから読み込み）"}
            </button>
            {status === "error" && (
              <p className="mt-1 px-3 text-xs text-red-500">{errorMsg}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
