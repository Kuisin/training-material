import type { Course, CourseLesson, ContentLock, SpecialContentEntry } from "./types";
import { appHref, lessonPageHref } from "./app-href";
import {
  getCompletedLessons,
  isSpecialUnlocked,
  markSpecialUnlocked,
} from "./completion-store";

interface CourseJsonLesson {
  num?: string;
  file: string;
  title: string;
  meta?: string;
  lock?: ContentLock;
}

interface CourseJson {
  title: string;
  description?: string;
  active?: boolean;
  lessons?: CourseJsonLesson[];
  courseTest?: CourseJsonLesson[];
  additionalContent?: CourseJsonLesson[];
  specialContent?: CourseJsonLesson[];
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

function mapSpecialEntries(lessons: CourseJsonLesson[] | undefined): SpecialContentEntry[] {
  return (lessons ?? []).map((lesson, index) => ({
    num: lesson.num ?? String(index),
    file: lesson.file,
    title: lesson.title,
    meta: lesson.meta ?? "",
    lock: lesson.lock,
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
    specialContent: mapSpecialEntries(meta.specialContent),
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
    course.additionalContent.find((l) => l.file === lessonFile) ??
    course.specialContent.find((l) => l.file === lessonFile)
  );
}

/** コース内の全エントリ数（一覧・カード表示用） */
export function courseEntryCount(course: Course): number {
  return (
    course.lessons.length +
    course.courseTest.length +
    course.additionalContent.length +
    course.specialContent.length
  );
}

/** コース完了 = 通常レッスン（lessons）をすべて完了している */
export function isCourseComplete(course: Course): boolean {
  if (course.lessons.length === 0) return false;
  const done = new Set(getCompletedLessons(course.slug));
  return course.lessons.every((lesson) => done.has(lesson.file));
}

export interface SpecialAccess {
  /** 解放済みか */
  unlocked: boolean;
  /** パスワード入力が解放手段として有効か（未入力で未解放のとき true） */
  needsPassword: boolean;
  /** 前提完了条件を満たしているか */
  requirementMet: boolean;
  /** 前提完了条件の説明（未設定なら undefined） */
  requirementLabel?: string;
}

function requirementLabel(course: Course, requires: NonNullable<ContentLock["requires"]>): string {
  if (requires === "course") return "コースのレッスンをすべて完了すると解放されます";
  const titles = requires.map((file) => findCourseEntry(course, file)?.title ?? file);
  return `次を完了すると解放されます: ${titles.join(" / ")}`;
}

function requirementSatisfied(
  course: Course,
  requires: NonNullable<ContentLock["requires"]>
): boolean {
  if (requires === "course") return isCourseComplete(course);
  const done = new Set(getCompletedLessons(course.slug));
  return requires.every((file) => done.has(file));
}

/**
 * 特別コンテンツの解放状態を評価する。
 * requires と password は「いずれか」を満たせば解放（and/or）。どちらも未設定なら無条件解放。
 */
export function evaluateSpecialAccess(course: Course, entry: SpecialContentEntry): SpecialAccess {
  const lock = entry.lock;
  if (!lock || (!lock.requires && !lock.password)) {
    return { unlocked: true, needsPassword: false, requirementMet: true };
  }

  const hasRequires = Boolean(lock.requires);
  const hasPassword = Boolean(lock.password);
  const requirementMet = hasRequires ? requirementSatisfied(course, lock.requires!) : false;
  const passwordUnlocked = hasPassword ? isSpecialUnlocked(course.slug, entry.file) : false;

  const unlocked = requirementMet || passwordUnlocked;

  return {
    unlocked,
    needsPassword: hasPassword && !unlocked,
    requirementMet,
    requirementLabel: hasRequires ? requirementLabel(course, lock.requires!) : undefined,
  };
}

/** パスワードを検証し、一致すれば解放を記録する。 */
export function verifySpecialPassword(
  course: Course,
  entry: SpecialContentEntry,
  input: string
): boolean {
  const password = entry.lock?.password;
  if (password && input === password) {
    markSpecialUnlocked(course.slug, entry.file);
    return true;
  }
  return false;
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
