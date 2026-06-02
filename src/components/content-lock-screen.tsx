import { useState } from "react";
import type { Course, CourseLesson } from "../lib/types";
import type { SpecialAccess } from "../lib/courses";
import { verifyContentPassword } from "../lib/courses";
import { useCompletion } from "../lib/completion-store";
import { cn } from "../lib/cn";
import { ThemeToggle } from "./theme-toggle";

interface ContentLockPasswordFormProps {
  course: Course;
  entry: CourseLesson;
  className?: string;
}

function ContentLockPasswordForm({ course, entry, className }: ContentLockPasswordFormProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    if (verifyContentPassword(course, entry, input)) {
      setError(false);
      setInput("");
    } else {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleUnlock} className={cn("flex flex-wrap items-center gap-2", className)}>
      <input
        type="password"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setError(false);
        }}
        placeholder="パスワードを入力"
        aria-label={`${entry.title} のパスワード`}
        className="w-44 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
      />
      <button
        type="submit"
        className="rounded-lg border border-brand/40 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/10 dark:border-brand/30 dark:bg-brand/10 dark:hover:bg-brand/20"
      >
        解放する
      </button>
      {error ? (
        <span className="text-xs font-medium text-red-600 dark:text-red-400">
          パスワードが違います
        </span>
      ) : null}
    </form>
  );
}

function ContentLockRequirements({
  access,
  indentClassName,
}: {
  access: SpecialAccess;
  indentClassName: string;
}) {
  const bothRequired = access.mode === "all" && Boolean(access.requirementLabel) && access.needsPassword;

  return (
    <>
      {bothRequired ? (
        <p className={cn("mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400", indentClassName)}>
          完了条件とパスワードの両方が必要です
        </p>
      ) : null}
      {access.requirementLabel ? (
        <p
          className={cn(
            "mt-2 text-xs",
            indentClassName,
            access.requirementMet
              ? "font-medium text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          <span aria-hidden>{access.requirementMet ? "✓ " : "・"}</span>
          {access.requirementLabel}
        </p>
      ) : null}
    </>
  );
}

export function LockedContentListRow({
  course,
  entry,
  access,
}: {
  course: Course;
  entry: CourseLesson;
  access: SpecialAccess;
}) {
  useCompletion();

  return (
    <li className="border-b border-slate-100 px-4 py-3.5 last:border-0 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          aria-hidden
        >
          🔒
        </span>
        <span className="min-w-0 flex-1 font-medium text-slate-500 dark:text-slate-400">{entry.title}</span>
        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{entry.meta}</span>
      </div>
      <ContentLockRequirements access={access} indentClassName="pl-11" />
      {access.needsPassword ? (
        <ContentLockPasswordForm course={course} entry={entry} className="mt-2 pl-11" />
      ) : null}
    </li>
  );
}

export function ContentLockScreen({
  course,
  entry,
  access,
  indexHref,
  displayTitle,
}: {
  course: Course;
  entry: CourseLesson;
  access: SpecialAccess;
  indexHref: string;
  displayTitle: string;
}) {
  useCompletion();

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4">
        <a
          href={indexHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand dark:text-slate-400"
        >
          ← レッスン一覧へ
        </a>
        <ThemeToggle />
      </header>
      <main className="mx-auto w-full max-w-lg px-5 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-lg dark:bg-slate-800"
              aria-hidden
            >
              🔒
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight">{displayTitle}</h1>
              {entry.meta ? (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.meta}</p>
              ) : null}
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            このコンテンツはまだ解放されていません。条件を満たすか、パスワードを入力してからご覧ください。
          </p>
          <ContentLockRequirements access={access} indentClassName="" />
          {access.needsPassword ? (
            <>
              <ContentLockPasswordForm course={course} entry={entry} className="mt-4" />
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                共有するときは URL に <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">?pw=パスワード</code>{" "}
                を付けると、開いたときに自動で解放されます。
              </p>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
