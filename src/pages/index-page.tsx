import { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import {
  activeCourses,
  courseEntryCount,
  courseIndexHref,
  courses,
  coursesIndexHref,
  evaluateSpecialAccess,
  isCourseComplete,
  lessonHref,
  verifySpecialPassword,
} from "../lib/courses";
import { isLessonComplete, useCompletion } from "../lib/completion-store";
import { CourseSearch } from "../components/course-search";
import { cn } from "../lib/cn";
import type { Course, CourseLesson, SpecialContentEntry } from "../lib/types";

function PageShell({
  title,
  description,
  children,
  backHref,
  backLabel = "コース一覧へ",
}: {
  title: string;
  description: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      <header className="mb-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            {backHref ? (
              <a
                href={backHref}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand dark:text-slate-400"
              >
                ← {backLabel}
              </a>
            ) : null}
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
              研修教材
            </p>
          </div>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
      </header>
      {children}
    </main>
  );
}

function LessonRow({ course, lesson }: { course: Course; lesson: CourseLesson }) {
  const completed = isLessonComplete(course.slug, lesson.file);
  return (
    <li className="border-b border-slate-100 last:border-0 dark:border-slate-800">
      <a
        href={lessonHref(course, lesson)}
        className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-brand/5"
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
            completed
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          )}
        >
          {completed ? "✓" : lesson.num}
        </span>
        <span className="min-w-0 flex-1 font-medium">{lesson.title}</span>
        {completed ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            完了
          </span>
        ) : (
          <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{lesson.meta}</span>
        )}
        <span className="text-slate-300" aria-hidden>
          →
        </span>
      </a>
    </li>
  );
}

function LessonList({ course, lessons }: { course: Course; lessons: CourseLesson[] }) {
  return (
    <ol className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {lessons.map((lesson) => (
        <LessonRow key={lesson.file} course={course} lesson={lesson} />
      ))}
    </ol>
  );
}

function CourseSection({
  course,
  heading,
  description,
  lessons,
}: {
  course: Course;
  heading: string;
  description?: string;
  lessons: CourseLesson[];
}) {
  if (lessons.length === 0) return null;

  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-1 text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200">
        {heading}
      </h2>
      {description ? (
        <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
      <LessonList course={course} lessons={lessons} />
    </section>
  );
}

function LockedSpecialRow({
  course,
  entry,
  requirementLabel,
  needsPassword,
}: {
  course: Course;
  entry: SpecialContentEntry;
  requirementLabel?: string;
  needsPassword: boolean;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    if (verifySpecialPassword(course, entry, input)) {
      setError(false);
      setInput("");
      // useCompletion の購読により親が再描画され、解放後の行に切り替わる。
    } else {
      setError(true);
    }
  }

  return (
    <li className="border-b border-slate-100 px-4 py-3.5 last:border-0 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm text-slate-400 dark:bg-slate-800 dark:text-slate-500" aria-hidden>
          🔒
        </span>
        <span className="min-w-0 flex-1 font-medium text-slate-500 dark:text-slate-400">
          {entry.title}
        </span>
        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{entry.meta}</span>
      </div>
      {requirementLabel ? (
        <p className="mt-2 pl-11 text-xs text-slate-500 dark:text-slate-400">{requirementLabel}</p>
      ) : null}
      {needsPassword ? (
        <form onSubmit={handleUnlock} className="mt-2 flex flex-wrap items-center gap-2 pl-11">
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
      ) : null}
    </li>
  );
}

function SpecialContentSection({ course }: { course: Course }) {
  useCompletion();
  if (course.specialContent.length === 0) return null;

  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-1 text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200">
        特別コンテンツ
      </h2>
      <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        コース完了、またはパスワードで解放される特典コンテンツです。
      </p>
      <ol className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {course.specialContent.map((entry) => {
          const access = evaluateSpecialAccess(course, entry);
          if (access.unlocked) {
            return <LessonRow key={entry.file} course={course} lesson={entry} />;
          }
          return (
            <LockedSpecialRow
              key={entry.file}
              course={course}
              entry={entry}
              requirementLabel={access.requirementLabel}
              needsPassword={access.needsPassword}
            />
          );
        })}
      </ol>
    </section>
  );
}

function CourseProgress({ course }: { course: Course }) {
  const total = course.lessons.length;
  if (total === 0) return null;

  const done = course.lessons.filter((lesson) => isLessonComplete(course.slug, lesson.file)).length;
  const complete = isCourseComplete(course);
  const percent = Math.round((done / total) * 100);

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">学習の進捗</h2>
        {complete ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <span aria-hidden>🎉</span>コース完了
          </span>
        ) : (
          <span className="text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
            {done} / {total} レッスン完了
          </span>
        )}
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        各レッスンを最後のスライドまで進めると完了になります。
        {complete ? "" : " すべて完了すると特別コンテンツが解放されます。"}
      </p>
    </div>
  );
}

function CourseContentSections({ course }: { course: Course }) {
  return (
    <>
      <CourseSection course={course} heading="レッスン" lessons={course.lessons} />
      <CourseSection course={course} heading="コーステスト" lessons={course.courseTest} />
      <CourseSection
        course={course}
        heading="追加コンテンツ"
        description="各レッスンの範囲外の詳細資料です。レッスン内のリンクから参照してください。"
        lessons={course.additionalContent}
      />
      <SpecialContentSection course={course} />
    </>
  );
}

function CourseCardBody({ course }: { course: Course }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2
          className={cn(
            "text-lg font-bold",
            course.active && "group-hover:text-brand"
          )}
        >
          {course.title}
        </h2>
        {!course.active ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            準備中
          </span>
        ) : null}
      </div>
      {course.description ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {course.description}
        </p>
      ) : null}
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {courseEntryCount(course)} コンテンツ
        {course.active ? (
          <span className="ml-2 text-brand opacity-0 transition group-hover:opacity-100" aria-hidden>
            →
          </span>
        ) : null}
      </p>
    </>
  );
}

function CourseCard({ course }: { course: Course }) {
  const className = cn(
    "flex flex-col rounded-2xl border p-5 shadow-sm transition",
    course.active
      ? cn(
          "group border-slate-200 bg-white hover:border-brand/40 hover:shadow-md",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand/40"
        )
      : "cursor-not-allowed border-slate-200/80 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-900/50"
  );

  if (!course.active) {
    return (
      <article className={className} aria-disabled="true">
        <CourseCardBody course={course} />
      </article>
    );
  }

  return (
    <a href={courseIndexHref(course.slug)} className={cn("group", className)}>
      <CourseCardBody course={course} />
    </a>
  );
}

function CoursePickerPage() {
  return (
    <PageShell title="コースを選ぶ" description="学びたいコースを選んでください。">
      <CourseSearch placeholder="全コースから検索…" className="mb-6" />
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </PageShell>
  );
}

function CourseLessonsPage({ course, showBack }: { course: Course; showBack: boolean }) {
  // 完了状態の変化（別タブ・レッスン完了後の遷移）で進捗・チェックを再描画する。
  useCompletion();
  return (
    <PageShell
      title={course.title}
      description={course.description || "レッスンを選んで学習を始めましょう。"}
      backHref={showBack ? coursesIndexHref() : undefined}
    >
      <CourseSearch
        courseSlug={course.slug}
        placeholder="このコース内を検索…"
        className="mb-6"
      />
      <CourseProgress course={course} />
      <CourseContentSections course={course} />
    </PageShell>
  );
}

function getActiveCourse(slug: string | null): Course | undefined {
  if (!slug) return undefined;
  const course = courses.find((item) => item.slug === slug);
  if (!course?.active) return undefined;
  return course;
}

export function IndexPage() {
  const [courseSlug, setCourseSlug] = useState(
    () => new URLSearchParams(window.location.search).get("course")
  );

  useLayoutEffect(() => {
    if (activeCourses.length !== 1) return;
    const slug = activeCourses[0]!.slug;
    if (courseSlug !== slug) {
      window.history.replaceState(null, "", courseIndexHref(slug));
      setCourseSlug(slug);
      return;
    }
    if (new URLSearchParams(window.location.search).get("course") !== slug) {
      window.history.replaceState(null, "", courseIndexHref(slug));
    }
  }, [courseSlug]);

  const selectedCourse = getActiveCourse(courseSlug);
  const showCoursePicker = activeCourses.length > 1;

  if (selectedCourse) {
    return <CourseLessonsPage course={selectedCourse} showBack={showCoursePicker} />;
  }

  return <CoursePickerPage />;
}
