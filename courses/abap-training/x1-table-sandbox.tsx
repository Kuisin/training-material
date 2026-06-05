import { mountLesson } from "../../src/lesson";
import { AbapTableSandbox } from "../../src/components/abap-table-sandbox";
import { courseIndexHref } from "../../src/lib/courses";
import { ThemeToggle } from "../../src/components/theme-toggle";
import { applyStoredTheme } from "../../src/lib/theme";

applyStoredTheme();

export const lessonMeta = {
  title: "内部テーブルSandbox — テーブルを定義してコードで書き込みを試す",
  meta: "ツール · いつでも",
};

function TableSandboxPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <a
          href={courseIndexHref("abap-training")}
          className="text-sm font-medium text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← コース一覧
        </a>
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
            ツール
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            内部テーブルSandbox
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            テーブルと項目を定義して、ABAPライクなコードで書き込み操作を試せます。リアルタイムで結果を確認しながら、APPEND・CLEAR の動きを体感してください。
          </p>
        </div>
        <AbapTableSandbox />
      </main>
    </div>
  );
}

export default TableSandboxPage;
mountLesson(TableSandboxPage);
