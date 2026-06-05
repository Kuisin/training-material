import { useEffect, useId, useState, type ChangeEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  applyImportPayload,
  buildExportPayload,
  parseAndValidateImport,
  type ExportPayload,
} from "../lib/data-transfer";
import { copyText } from "../lib/clipboard";
import { cn } from "../lib/cn";

// ---- shared modal shell ----

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="not-prose fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2
            id={titleId}
            className="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            閉じる
          </button>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ---- export dialog ----

function ExportDialog({ onClose }: { onClose: () => void }) {
  const text = JSON.stringify(buildExportPayload(), null, 2);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal title="エクスポート — データのコピー" onClose={onClose}>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
        以下のテキストをコピーして、別のブラウザやデバイスに貼り付けてインポートできます。
      </p>
      <textarea
        readOnly
        value={text}
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        rows={10}
        className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          閉じる
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
            copied
              ? "bg-green-600 hover:bg-green-600"
              : "bg-brand hover:bg-brand/90"
          )}
        >
          {copied ? "コピーしました ✓" : "クリップボードにコピー"}
        </button>
      </div>
    </Modal>
  );
}

// ---- import dialog ----

type ImportStatus = "idle" | "valid" | "invalid" | "done";

function ImportDialog({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [parsed, setParsed] = useState<ExportPayload | null>(null);

  function validate(t: string) {
    if (!t.trim()) {
      setStatus("idle");
      setParsed(null);
      setErrorMsg("");
      return;
    }
    try {
      const p = parseAndValidateImport(t);
      setParsed(p);
      setStatus("valid");
      setErrorMsg("");
    } catch (err) {
      setParsed(null);
      setStatus("invalid");
      setErrorMsg(err instanceof Error ? err.message : "不明なエラー");
    }
  }

  async function handlePasteFromClipboard() {
    try {
      const t = await navigator.clipboard.readText();
      setText(t);
      validate(t);
    } catch {
      setErrorMsg("クリップボードの読み取りに失敗しました（ブラウザの権限を確認してください）");
      setStatus("invalid");
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    validate(e.target.value);
  }

  function handleImport() {
    if (!parsed) return;
    applyImportPayload(parsed);
    setStatus("done");
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <Modal title="インポート — データの貼り付け" onClose={onClose}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          エクスポートしたテキストを貼り付けてください。
        </p>
        <button
          type="button"
          onClick={handlePasteFromClipboard}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ⬆ クリップボードから貼り付け
        </button>
      </div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder='{"version":1,"exportedAt":"...","completion":{...}}'
        rows={10}
        className={cn(
          "w-full resize-none rounded-lg border p-3 font-mono text-xs focus:outline-none",
          status === "valid"
            ? "border-green-400 bg-green-50 text-slate-700 dark:border-green-700 dark:bg-green-950/30 dark:text-slate-300"
            : status === "invalid"
              ? "border-red-400 bg-red-50 text-slate-700 dark:border-red-700 dark:bg-red-950/30 dark:text-slate-300"
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        )}
      />
      {status === "valid" && parsed && (
        <p className="mt-2 text-xs text-green-600 dark:text-green-400">
          ✓ データを確認しました（エクスポート日時: {parsed.exportedAt}）
        </p>
      )}
      {status === "invalid" && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400">✗ {errorMsg}</p>
      )}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={status !== "valid"}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
            status === "done"
              ? "bg-green-600"
              : "bg-brand hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          {status === "done" ? "完了！" : "インポートする"}
        </button>
      </div>
    </Modal>
  );
}

// ---- main button + menu ----

export function DataTransferButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"export" | "import" | null>(null);

  function openExport() {
    setMenuOpen(false);
    setDialogMode("export");
  }

  function openImport() {
    setMenuOpen(false);
    setDialogMode("import");
  }

  function closeDialog() {
    setDialogMode(null);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="データのエクスポート・インポート"
        title="データ転送"
      >
        ↑↓
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-40 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={openExport}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden>⬇</span>
              エクスポート（コピー）
            </button>
            <button
              type="button"
              onClick={openImport}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden>⬆</span>
              インポート（ペースト）
            </button>
          </div>
        </>
      )}

      {dialogMode === "export" && <ExportDialog onClose={closeDialog} />}
      {dialogMode === "import" && <ImportDialog onClose={closeDialog} />}
    </div>
  );
}
