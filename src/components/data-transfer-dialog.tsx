import { useState } from "react";
import { copyExport, importFromText } from "../lib/data-transfer";

export function DataTransferButton() {
  const [open, setOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "copied" | "error">("idle");
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "done" | "error">("idle");
  const [pasteText, setPasteText] = useState("");
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleExport() {
    const ok = await copyExport();
    setExportStatus(ok ? "copied" : "error");
    setTimeout(() => setExportStatus("idle"), 2000);
  }

  function handleImportClick() {
    setShowPasteArea(true);
    setImportStatus("idle");
    setPasteText("");
    setErrorMsg("");
  }

  function handleImportApply() {
    if (!pasteText.trim()) return;
    setImportStatus("importing");
    try {
      importFromText(pasteText);
      setImportStatus("done");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "不明なエラー");
      setImportStatus("error");
    }
  }

  function handleClose() {
    setOpen(false);
    setShowPasteArea(false);
    setPasteText("");
    setImportStatus("idle");
    setExportStatus("idle");
    setErrorMsg("");
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
            onClick={handleClose}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-40 mt-1 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={handleExport}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden>📋</span>
              {exportStatus === "copied"
                ? "コピーしました！"
                : exportStatus === "error"
                  ? "コピー失敗"
                  : "エクスポート（クリップボードにコピー）"}
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden>📥</span>
              インポート（貼り付けから読み込み）
            </button>

            {showPasteArea && (
              <div className="mt-2 px-2 pb-1">
                <textarea
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                  rows={6}
                  placeholder="エクスポートしたJSONをここに貼り付けてください"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  disabled={importStatus === "importing" || importStatus === "done"}
                />
                <button
                  type="button"
                  onClick={handleImportApply}
                  disabled={!pasteText.trim() || importStatus === "importing" || importStatus === "done"}
                  className="mt-1 w-full rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
                >
                  {importStatus === "importing"
                    ? "読み込み中…"
                    : importStatus === "done"
                      ? "完了！"
                      : "インポート"}
                </button>
                {importStatus === "error" && (
                  <p className="mt-1 text-xs text-red-500">{errorMsg}</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
