import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { DiagramCollapsibleHelp } from "./diagram-collapsible-help";

interface ExpandableFullscreenProps {
  /** 全画面オーバーレイのタイトル（ヘッダー・aria-label） */
  title: string;
  /** スライド内の表示高さ（px） */
  inlineHeight?: number;
  /** インラインパネル用の追加クラス */
  panelClassName?: string;
  /** インライン／全画面それぞれで描画（react-flow 等の再レイアウト用） */
  renderContent: (layout: "inline" | "fullscreen") => ReactNode;
  /** 折りたたみの図の見方・記号説明（省略時は非表示） */
  collapsibleDescription?: ReactNode;
  /** 折りたたみ `<summary>` のラベル */
  descriptionLabel?: string;
}

const expandBtnClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300/90 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700";

/**
 * スライド内にコンテンツを表示し、全画面ボタンでオーバーレイ拡大する共通ラッパー。
 * 全画面は document.body へポータルし、prose／transform 祖先の影響を避ける。
 */
export function ExpandableFullscreen({
  title,
  inlineHeight = 480,
  panelClassName,
  renderContent,
  collapsibleDescription,
  descriptionLabel,
}: ExpandableFullscreenProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [fullscreenKey, setFullscreenKey] = useState(0);
  /** オーバーレイのレイアウト確定後にマウント（react-flow / react-erd の fitView ずれ防止） */
  const [fullscreenReady, setFullscreenReady] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setFullscreenReady(false);
  }, []);

  const openFullscreen = useCallback(() => {
    setFullscreenKey((k) => k + 1);
    setFullscreenReady(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setFullscreenReady(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [open, fullscreenKey]);

  const fullscreenOverlay =
    open &&
    createPortal(
      <div
        className="not-prose fixed inset-0 z-60 flex h-dvh flex-col bg-white dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 id={titleId} className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            閉じる
            <span className="text-slate-400" aria-hidden>
              Esc
            </span>
          </button>
        </header>
        {collapsibleDescription ? (
          <DiagramCollapsibleHelp label={descriptionLabel} className="mx-4 mb-2 shrink-0">
            {collapsibleDescription}
          </DiagramCollapsibleHelp>
        ) : null}
        <div key={fullscreenKey} className="relative min-h-0 flex-1">
          {fullscreenReady ? (
            <div className="absolute inset-0 overflow-hidden">{renderContent("fullscreen")}</div>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-slate-500 dark:text-slate-400">
              読み込み中…
            </div>
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div className="not-prose expandable-fullscreen relative my-6 w-full">
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40",
            panelClassName
          )}
          style={{ height: inlineHeight }}
        >
          {renderContent("inline")}
        </div>
        <button
          type="button"
          className={cn("absolute top-2 right-2 z-10", expandBtnClass)}
          onClick={(event) => {
            event.stopPropagation();
            openFullscreen();
          }}
          aria-label={`${title}を全画面で表示`}
        >
          <span aria-hidden>⛶</span>
          全画面
        </button>
      </div>
      {collapsibleDescription ? (
        <DiagramCollapsibleHelp label={descriptionLabel} className="mt-2">
          {collapsibleDescription}
        </DiagramCollapsibleHelp>
      ) : null}
      {fullscreenOverlay}
    </>
  );
}
