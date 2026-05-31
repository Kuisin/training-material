import { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import {
  activeCourses,
  courseIndexHref,
  courses,
  coursesIndexHref,
  lessonHref,
} from "../lib/courses";
import { cn } from "../lib/cn";
import type { Course, CourseLesson } from "../lib/types";

const baseUrl = import.meta.env.BASE_URL;

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
  return (
    <li className="border-b border-slate-100 last:border-0 dark:border-slate-800">
      <a
        href={`${baseUrl}${lessonHref(course, lesson)}`}
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

function LessonList({ course }: { course: Course }) {
  return (
    <ol className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {course.lessons.map((lesson) => (
        <LessonRow key={lesson.file} course={course} lesson={lesson} />
      ))}
    </ol>
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
        {course.lessons.length} レッスン
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
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </PageShell>
  );
}

function CourseLessonsPage({ course, showBack }: { course: Course; showBack: boolean }) {
  return (
    <PageShell
      title={course.title}
      description={course.description || "レッスンを選んで学習を始めましょう。"}
      backHref={showBack ? coursesIndexHref() : undefined}
    >
      <LessonList course={course} />
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
