import type { Course, CourseLesson } from "./types";

interface CourseJson {
  title: string;
  description?: string;
  active?: boolean;
  lessons: Array<{
    num?: string;
    file: string;
    title: string;
    meta?: string;
  }>;
}

const courseJsonModules = import.meta.glob<CourseJson>("../../courses/*/course.json", {
  eager: true,
  import: "default",
});

function slugFromPath(filePath: string): string {
  const match = filePath.match(/courses\/([^/]+)\/course\.json$/);
  return match?.[1] ?? "";
}

function toCourse(slug: string, meta: CourseJson): Course {
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? "",
    active: meta.active !== false,
    lessons: (meta.lessons ?? []).map((lesson, index) => ({
      num: lesson.num ?? String(index),
      file: lesson.file,
      title: lesson.title,
      meta: lesson.meta ?? "",
    })),
  };
}

export const courses: Course[] = Object.entries(courseJsonModules)
  .map(([filePath, meta]) => toCourse(slugFromPath(filePath), meta))
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const activeCourses = courses.filter((course) => course.active);

/** トップのコース一覧ページ */
export function coursesIndexHref(): string {
  const base = import.meta.env.BASE_URL;
  return `${base}index.html`;
}

/** トップのレッスン一覧ページ（コース選択後） */
export function courseIndexHref(courseSlug: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}index.html?course=${encodeURIComponent(courseSlug)}`;
}

/** コース内レッスンの HTML パス（例 abap-taining/00-introduction.html） */
export function lessonHref(course: Course, lesson: CourseLesson): string {
  return `${course.slug}/${lesson.file}.html`;
}

/** prev/next リンク用のファイル名（例 01-overview.html） */
export function lessonFileHref(lesson: CourseLesson): string {
  return `${lesson.file}.html`;
}

/** レッスン chrome 用: 前後のレッスン href を course.json から生成 */
export function lessonChromeLinks(
  courseSlug: string,
  lessonFile: string
): {
  lessonNum: string;
  prevHref: string;
  nextHref: string;
  indexHref: string;
  prevLesson?: { num: string; title: string };
  nextLesson?: { num: string; title: string };
} {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) {
    return { lessonNum: "", prevHref: "", nextHref: "", indexHref: "../../index.html" };
  }

  const index = course.lessons.findIndex((l) => l.file === lessonFile);
  const current = index >= 0 ? course.lessons[index] : undefined;
  const prev = index > 0 ? course.lessons[index - 1] : undefined;
  const next = index >= 0 && index < course.lessons.length - 1 ? course.lessons[index + 1] : undefined;

  const adjacent = (lesson: CourseLesson) => ({ num: lesson.num, title: lesson.title });

  return {
    lessonNum: current?.num ?? String(Math.max(index, 0)),
    prevHref: prev ? lessonFileHref(prev) : "",
    nextHref: next ? lessonFileHref(next) : "",
    indexHref: `../../index.html?course=${encodeURIComponent(courseSlug)}`,
    prevLesson: prev ? adjacent(prev) : undefined,
    nextLesson: next ? adjacent(next) : undefined,
  };
}
