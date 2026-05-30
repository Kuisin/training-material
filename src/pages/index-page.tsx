interface LessonLink {
  num: string;
  /** トラック相対パス（例 abap-taining/00-introduction.html） */
  href: string;
  title: string;
  meta: string;
}

const baseUrl = import.meta.env.BASE_URL;

const ABAP_LESSONS: LessonLink[] = [
  { num: "0", href: "abap-taining/00-introduction.html", title: "なぜABAPを学ぶのか", meta: "初学者 · 15分" },
  { num: "1", href: "abap-taining/01-overview.html", title: "研修全体マップ", meta: "初学者 · 15分" },
  { num: "2", href: "abap-taining/02-business-basics.html", title: "仕訳日記帳と会計伝票", meta: "初学者 · 20分" },
  { num: "3", href: "abap-taining/03-abap-minimum-unit.html", title: "はじめてのレポートプログラム", meta: "初学者 · 20分" },
  { num: "4", href: "abap-taining/04-selection-screen.html", title: "入力を受け取る", meta: "初学者 · 20分" },
  { num: "5", href: "abap-taining/05-internal-tables.html", title: "データを扱う基本", meta: "初学者 · 25分" },
  { num: "6", href: "abap-taining/06-select-from-db.html", title: "データベースから取得する", meta: "初学者 · 25分" },
  { num: "7", href: "abap-taining/07-output-report.html", title: "出力をつくる", meta: "初学者 · 20分" },
  { num: "8", href: "abap-taining/08-combine-data.html", title: "複数データをまとめる", meta: "初学者 · 25分" },
  { num: "9", href: "abap-taining/09-control-flow.html", title: "制御の考え方", meta: "初学者 · 30分" },
  { num: "10", href: "abap-taining/10-modularization.html", title: "プログラムを分かりやすくする", meta: "初学者 · 25分" },
  { num: "11", href: "abap-taining/11-document-posting.html", title: "会計伝票登録へ進む", meta: "初学者 · 30分" },
  { num: "12", href: "abap-taining/12-real-world.html", title: "実務っぽい観点", meta: "初学者 · 20分" },
  { num: "13", href: "abap-taining/13-good-programming.html", title: "適切なプログラミング", meta: "初学者 · 25分" },
];

function LessonRow({ lesson }: { lesson: LessonLink }) {
  return (
    <li className="border-b border-slate-100 last:border-0 dark:border-slate-800">
      <a
        href={`${baseUrl}${lesson.href}`}
        className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-brand/5"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {lesson.num}
        </span>
        <span className="min-w-0 flex-1 font-medium">{lesson.title}</span>
        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{lesson.meta}</span>
        <span className="text-slate-300" aria-hidden>
          →
        </span>
      </a>
    </li>
  );
}

export function IndexPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
          研修教材
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">研修レッスン一覧</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          自分のペースで学べるレッスン集。トピックを選んで始めましょう。
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold">ABAP研修（仕訳日記帳・会計伝票登録）</h2>
        <ol className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {ABAP_LESSONS.map((lesson) => (
            <LessonRow key={lesson.href} lesson={lesson} />
          ))}
        </ol>
      </section>

      <footer className="mt-12 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        研修教材
      </footer>
    </main>
  );
}
