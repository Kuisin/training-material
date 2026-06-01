import { cn } from "../lib/cn";
import { isLessonComplete, markLessonComplete, useCompletion } from "../lib/completion-store";

interface LessonCompleteButtonProps {
  courseSlug: string;
  lessonFile: string;
}

/** 最終スライドに表示する「このレッスンを完了にする」ボタン。 */
export function LessonCompleteButton({ courseSlug, lessonFile }: LessonCompleteButtonProps) {
  useCompletion();
  const completed = isLessonComplete(courseSlug, lessonFile);

  return (
    <div className="not-prose mt-10 flex flex-col items-center gap-2 border-t border-slate-200 pt-8 dark:border-slate-700">
      {completed ? (
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          <span aria-hidden>✓</span>
          このレッスンは完了済みです
        </p>
      ) : (
        <button
          type="button"
          onClick={() => markLessonComplete(courseSlug, lessonFile)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition",
            "hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
            "dark:bg-emerald-500 dark:hover:bg-emerald-400"
          )}
        >
          <span aria-hidden>🎓</span>
          このレッスンを完了にする
        </button>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        完了するとコース一覧の進捗に反映されます。
      </p>
    </div>
  );
}
