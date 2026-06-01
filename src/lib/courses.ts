import type { Course, CourseLesson } from "./types";
import { appHref, lessonPageHref } from "./app-href";

interface CourseJsonLesson {
  num?: string;
  file: string;
  title: string;
  meta?: string;
}

interface CourseJson {
  title: string;
  description?: string;
  active?: boolean;
  lessons?: CourseJsonLesson[];
  courseTest?: CourseJsonLesson[];
  additionalContent?: CourseJsonLesson[];
}

const courseJsonModules = import.meta.glob<CourseJson>("../../courses/*/course.json", {
  eager: true,
  import: "default",
});

function slugFromPath(filePath: string): string {
  const match = filePath.match(/courses\/([^/]+)\/course\.json$/);
  return match?.[1] ?? "";
}

function mapLessonEntries(lessons: CourseJsonLesson[] | undefined): CourseLesson[] {
  return (lessons ?? []).map((lesson, index) => ({
    num: lesson.num ?? String(index),
    file: lesson.file,
    title: lesson.title,
    meta: lesson.meta ?? "",
  }));
}

function toCourse(slug: string, meta: CourseJson): Course {
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? "",
    active: meta.active !== false,
    lessons: mapLessonEntries(meta.lessons),
    courseTest: mapLessonEntries(meta.courseTest),
    additionalContent: mapLessonEntries(meta.additionalContent),
  };
}

export const courses: Course[] = Object.entries(courseJsonModules)
  .map(([filePath, meta]) => toCourse(slugFromPath(filePath), meta))
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const activeCourses = courses.filter((course) => course.active);

/** 前後ナビ用の線形フロー（レッスン → コーステスト。追加コンテンツは含めない） */
export function courseLinearFlow(course: Course): CourseLesson[] {
  return [...course.lessons, ...course.courseTest];
}

/** コース内の任意カテゴリからレッスンを検索 */
export function findCourseEntry(course: Course, lessonFile: string): CourseLesson | undefined {
  return (
    course.lessons.find((l) => l.file === lessonFile) ??
    course.courseTest.find((l) => l.file === lessonFile) ??
    course.additionalContent.find((l) => l.file === lessonFile)
  );
}

/** コース内の全エントリ数（一覧・カード表示用） */
export function courseEntryCount(course: Course): number {
  return course.lessons.length + course.courseTest.length + course.additionalContent.length;
}

/** トップのコース一覧ページ */
export function coursesIndexHref(): string {
  return appHref("index.html");
}

/** トップのレッスン一覧ページ（コース選択後） */
export function courseIndexHref(courseSlug: string): string {
  return `${coursesIndexHref()}?course=${encodeURIComponent(courseSlug)}`;
}

/** コース内レッスンの URL（BASE_URL 込み） */
export function lessonHref(course: Course, lesson: CourseLesson): string {
  return lessonPageHref(course.slug, lesson.file);
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
    return { lessonNum: "", prevHref: "", nextHref: "", indexHref: coursesIndexHref() };
  }

  const current = findCourseEntry(course, lessonFile);
  const flow = courseLinearFlow(course);
  const flowIndex = flow.findIndex((l) => l.file === lessonFile);
  const prev = flowIndex > 0 ? flow[flowIndex - 1] : undefined;
  const next = flowIndex >= 0 && flowIndex < flow.length - 1 ? flow[flowIndex + 1] : undefined;

  const adjacent = (lesson: CourseLesson) => ({ num: lesson.num, title: lesson.title });

  return {
    lessonNum: current?.num ?? "",
    prevHref: prev ? lessonPageHref(courseSlug, prev.file) : "",
    nextHref: next ? lessonPageHref(courseSlug, next.file) : "",
    indexHref: courseIndexHref(courseSlug),
    prevLesson: prev ? adjacent(prev) : undefined,
    nextLesson: next ? adjacent(next) : undefined,
  };
}
