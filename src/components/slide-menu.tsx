import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import type { SlideDefinition } from "../lib/types";

interface SlideMenuProps {
  open: boolean;
  slides: SlideDefinition[];
  current: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function SlideMenu({ open, slides, current, onSelect, onClose }: SlideMenuProps) {
  const panelRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    activeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
      <nav
        ref={panelRef}
        aria-label="スライド一覧"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 max-w-[82vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900",
          open
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            スライド
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="メニューを閉じる"
          >
            ✕
          </button>
        </div>
        <ol className="flex-1 overflow-y-auto p-2">
          {slides.map((slide, i) => {
            const isActive = i === current;
            return (
              <li key={i}>
                <button
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  onClick={() => onSelect(i)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm leading-snug transition",
                    isActive
                      ? "bg-brand font-semibold text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "tabular-nums",
                      isActive ? "text-white/80" : "text-slate-400"
                    )}
                  >
                    {i + 1}.
                  </span>
                  <span>{slide.title || `スライド ${i + 1}`}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
