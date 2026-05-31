import { ThemeToggle } from "./theme-toggle";

interface TopBarProps {
  lessonNum: string;
  title: string;
  current: number;
  total: number;
  indexHref: string;
  onOpenMenu: () => void;
}

export function TopBar({
  lessonNum,
  title,
  current,
  total,
  indexHref,
  onOpenMenu,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label="スライド一覧メニューを開く"
      >
        <span aria-hidden>☰</span>
        <span className="hidden sm:inline">メニュー</span>
      </button>

      <span
        className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        aria-label={`レッスン ${lessonNum}`}
      >
        {lessonNum}
      </span>

      <h1 className="min-w-0 flex-1 truncate text-base font-bold">{title}</h1>

      <span className="hidden whitespace-nowrap text-sm tabular-nums text-slate-500 sm:inline dark:text-slate-400">
        {current} / {total}
      </span>

      <ThemeToggle />

      <a
        href={indexHref}
        className="inline-flex items-center rounded-lg border border-brand px-3 py-1.5 text-sm font-medium text-brand transition hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="hidden sm:inline">レッスン一覧</span>
        <span className="sm:hidden" aria-hidden>
          ⌂
        </span>
      </a>
    </header>
  );
}
