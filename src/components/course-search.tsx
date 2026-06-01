import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn";
import {
  groupSearchHits,
  loadSearchIndex,
  parseSearchTerms,
  searchCourseEntries,
  type SearchHit,
  type SnippetPart,
} from "../lib/course-search";

interface CourseSearchProps {
  courseSlug?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function HighlightedSnippet({ parts }: { parts: SnippetPart[] }) {
  return (
    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      {parts.map((part, index) =>
        part.highlight ? (
          <mark
            key={index}
            className="rounded bg-brand/15 px-0.5 font-medium text-brand dark:bg-brand/25 dark:text-brand"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </p>
  );
}

function ResultLabel({ hit }: { hit: SearchHit }) {
  if (hit.slideIndex < 0 && !hit.lessonFile) {
    return <span className="font-medium">{hit.slideTitle}</span>;
  }
  if (hit.slideIndex < 0) {
    return (
      <span className="font-medium">
        {hit.lessonNum ? `${hit.lessonNum}. ` : ""}
        {hit.lessonTitle}
      </span>
    );
  }
  return (
    <span className="font-medium">
      {hit.lessonNum ? `${hit.lessonNum}. ` : ""}
      {hit.lessonTitle}
      <span className="font-normal text-slate-500 dark:text-slate-400">
        {" "}
        / {hit.slideTitle}
      </span>
    </span>
  );
}

function SearchResultItem({
  hit,
  active,
  onNavigate,
  itemRef,
}: {
  hit: SearchHit;
  active: boolean;
  onNavigate?: () => void;
  itemRef?: (node: HTMLAnchorElement | null) => void;
}) {
  return (
    <a
      ref={itemRef}
      href={hit.href}
      onClick={onNavigate}
      aria-current={active ? "true" : undefined}
      className={cn(
        "block px-4 py-3 transition",
        active ? "bg-brand/10 ring-1 ring-inset ring-brand/30" : "hover:bg-brand/5"
      )}
    >
      <ResultLabel hit={hit} />
      <HighlightedSnippet parts={hit.snippetParts} />
    </a>
  );
}

export function CourseSearch({
  courseSlug,
  placeholder = "キーワードで検索…（複数語は空白区切り）",
  autoFocus = false,
  onNavigate,
  className,
}: CourseSearchProps) {
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebouncedValue(query, 180);

  useEffect(() => {
    let cancelled = false;
    loadSearchIndex()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "検索インデックスを読み込めませんでした");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !debouncedQuery.trim()) {
      setHits([]);
      setActiveIndex(-1);
      return;
    }

    let cancelled = false;
    loadSearchIndex().then((index) => {
      if (cancelled) return;
      setHits(searchCourseEntries(index.entries, debouncedQuery, courseSlug));
      setActiveIndex(-1);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, courseSlug, ready]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, hits]);

  const terms = parseSearchTerms(query);
  const showResults = query.trim().length > 0;
  const grouped = groupSearchHits(hits);
  const useGroupedView = hits.length > 6 && hits.some((hit) => hit.slideIndex >= 0);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults || hits.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? hits.length - 1 : current - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      itemRefs.current[activeIndex]?.click();
    }
  }

  let flatIndex = -1;

  return (
    <div className={cn("space-y-3", className)}>
      <label htmlFor={inputId} className="sr-only">
        コース内検索
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"
          aria-hidden
        >
          🔍
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-expanded={showResults && hits.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        複数キーワードは AND 検索 · レッスン番号は <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">L3</kbd> や{" "}
        <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">3</kbd> · ↑↓ Enter で選択 ·{" "}
        <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">Ctrl</kbd>+
        <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">K</kbd> でフォーカス
      </p>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {showResults ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {!ready ? (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">読み込み中…</p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
              {terms.length > 1
                ? `「${terms.join("」「")}」をすべて含む結果はありません`
                : `「${query}」に一致する結果はありません`}
            </p>
          ) : (
            <>
              <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {hits.length} 件{hits.length >= 50 ? "（上位50件）" : ""}
              </p>
              <ul id={listId} role="listbox" className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {useGroupedView
                  ? grouped.map((group) => (
                      <li key={group.key}>
                        <p className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                          {group.lessonNum ? `${group.lessonNum}. ` : ""}
                          {group.lessonTitle}
                        </p>
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                          {group.hits.map((hit) => {
                            flatIndex += 1;
                            const index = flatIndex;
                            return (
                              <li key={`${hit.href}-${hit.slideTitle}`} role="option">
                                <SearchResultItem
                                  hit={hit}
                                  active={activeIndex === index}
                                  onNavigate={onNavigate}
                                  itemRef={(node) => {
                                    itemRefs.current[index] = node;
                                  }}
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ))
                  : hits.map((hit, index) => (
                      <li key={`${hit.href}-${hit.slideTitle}`} role="option">
                        <SearchResultItem
                          hit={hit}
                          active={activeIndex === index}
                          onNavigate={onNavigate}
                          itemRef={(node) => {
                            itemRefs.current[index] = node;
                          }}
                        />
                      </li>
                    ))}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

interface CourseSearchDialogProps {
  open: boolean;
  courseSlug?: string;
  onClose: () => void;
}

export function CourseSearchDialog({ open, courseSlug, onClose }: CourseSearchDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
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
      <div
        role="dialog"
        aria-modal="true"
        aria-label="コース内検索"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          "fixed inset-x-4 top-16 z-50 mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">コース内検索</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="検索を閉じる"
          >
            ✕
          </button>
        </div>
        <CourseSearch
          courseSlug={courseSlug}
          autoFocus={open}
          onNavigate={onClose}
          placeholder="レッスン・スライドを検索…"
        />
      </div>
    </>
  );
}
