import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { copyText } from "../lib/clipboard";
import type { SlideDefinition } from "../lib/types";

interface AiAskButtonProps {
  title: string;
  slides: SlideDefinition[];
}

function slidesToPlainText(slides: SlideDefinition[]): string {
  return slides
    .map((s) => `## ${s.title}\n${s.plainText?.trim() || s.title}`)
    .join("\n\n");
}

function buildPromptText(title: string, slides: SlideDefinition[]): string {
  const body = slidesToPlainText(slides);
  return (
    `以下は研修レッスン「${title}」の内容です。この内容について質問があります。\n\n` +
    `----\n${body}\n----\n\n【質問】（ここに知りたいことを書いてください）`
  );
}

const STEPS = [
  "Microsoft Copilot（Edge・Teams・Outlook など）を開きます。",
  "チャット入力欄に貼り付け、【質問】の行に知りたいことを書いて送信します。",
] as const;

interface AiAskDialogProps {
  open: boolean;
  title: string;
  slides: SlideDefinition[];
  onClose: () => void;
}

function AiAskDialog({ open, title, slides, onClose }: AiAskDialogProps) {
  const [copied, setCopied] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setCopied(null);
      return;
    }
    let cancelled = false;
    copyText(buildPromptText(title, slides)).then((ok) => {
      if (!cancelled) setCopied(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [open, title, slides]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-ask-dialog-title"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          "fixed inset-x-4 top-20 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="ai-ask-dialog-title"
              className="text-sm font-bold text-slate-800 dark:text-slate-100"
            >
              Copilot への質問の仕方
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {copied === null
                ? "レッスン内容をコピーしています…"
                : copied
                  ? "レッスン内容をコピーしました。Copilot に貼り付けてください。"
                  : "コピーに失敗しました。もう一度お試しください。"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="ダイアログを閉じる"
          >
            ✕
          </button>
        </div>

        <ol className="mb-5 space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900"
                aria-hidden
              >
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            閉じる
          </button>
        </div>
      </div>
    </>
  );
}

export function AiAskButton({ title, slides }: AiAskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Copilot への質問の仕方を表示"
        className="fixed right-4 top-16 z-30 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        <span aria-hidden>🤖</span>
        Copilotに質問
      </button>

      <AiAskDialog
        open={open}
        title={title}
        slides={slides}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
