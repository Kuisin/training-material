import type {
  Course,
  CourseLesson,
  ContentLock,
  ContentRequirement,
  SpecialContentEntry,
} from "./types";
import { appHref, lessonPageHref } from "./app-href";
import {
  CONTENT_PASSWORD_SEARCH_PARAM,
  applyContentPasswordFromUrl,
  allPasswordLockedEntries,
} from "./content-lock-url";
import {
  getCompletedLessons,
  isContentUnlocked,
  markContentUnlocked,
} from "./completion-store";
import { isDevMode } from "./dev-mode";

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
  toolContent?: CourseJsonLesson[];
}

const courseJsonModules = import.meta.glob<CourseJson>("../../courses/*/course.json", {
  eager: true,
  import: "default",
});

function slugFromPath(filePath: string): string {
  const match = filePath.match(/courses\/([^/]+)\/course\.json$/);
  return match?.[1] ?? "";
}

// カテゴリごとに独立した採番。明示的な num があればそれを優先する。
// - レッスン: 0 始まりの番号（ファイル名は 00-slug 形式）
// - コーステスト: "T1", "T2", …（ファイル名は t1-slug 形式）
// - 追加コンテンツ: "A1", "A2", …（ファイル名は a1-slug 形式）
// - 特別コンテンツ: "S1", "S2", …（ファイル名は s1-slug 形式）
// - ツール: "X1", …（ファイル名は x1-slug 形式）
function mapLessonEntries(
  lessons: CourseJsonLesson[] | undefined,
  prefix = "",
  startAt = 0
): CourseLesson[] {
  return (lessons ?? []).map((lesson, index) => ({
    num: lesson.num ?? `${prefix}${index + startAt}`,
    file: lesson.file,
    title: lesson.title,
    meta: lesson.meta ?? "",
    lock: lesson.lock,
  }));
}

function mapSpecialEntries(
  lessons: CourseJsonLesson[] | undefined,
  prefix = "S",
  startAt = 1
): SpecialContentEntry[] {
  return (lessons ?? []).map((lesson, index) => ({
    num: lesson.num ?? `${prefix}${index + startAt}`,
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
    lessons: mapLessonEntries(meta.lessons, "", 0),
    courseTest: mapLessonEntries(meta.courseTest, "T", 1),
    additionalContent: mapLessonEntries(meta.additionalContent, "A", 1),
    specialContent: mapSpecialEntries(meta.specialContent, "S", 1),
    toolContent: mapLessonEntries(meta.toolContent, "X", 1),
  };
}

export const courses: Course[] = Object.entries(courseJsonModules)
  .map(([filePath, meta]) => toCourse(slugFromPath(filePath), meta))
  .sort((a, b) => a.slug.localeCompare(b.slug));

export const activeCourses = courses.filter((course) => course.active);

/** 一覧・URL から開けるコース（dev モード時は active=false も含む） */
export function isCourseAccessible(course: Course): boolean {
  return course.active || isDevMode;
}

export const navigableCourses = courses.filter(isCourseAccessible);

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
    course.specialContent.find((l) => l.file === lessonFile) ??
    course.toolContent.find((l) => l.file === lessonFile)
  );
}

/** course.json の並び順で付与されたレッスン番号（一覧・ヘッダーと同じ） */
export function getLessonNum(courseSlug: string, lessonFile: string): string | undefined {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) return undefined;
  return findCourseEntry(course, lessonFile)?.num;
}

/**
 * レッスン番号から「第{n}章」ラベルを生成（num が数字のときのみ）。
 * 教材本文の章番号表記はファイル名ではなくこの採番に合わせる。
 */
export function lessonChapterLabel(
  courseSlug: string,
  lessonFile: string,
  options?: { suffix?: string }
): string {
  const num = getLessonNum(courseSlug, lessonFile);
  if (!num || !/^\d+$/.test(num)) return "";
  const suffix = options?.suffix ?? "";
  return `第${num}章${suffix}`;
}

/** LessonLinkButton 用: 「第{n}章: 説明」 */
export function lessonLinkChapterLabel(
  courseSlug: string,
  lessonFile: string,
  description: string
): string {
  const chapter = lessonChapterLabel(courseSlug, lessonFile);
  return chapter ? `${chapter}: ${description}` : description;
}

/** コース内の全エントリ数（一覧・カード表示用） */
export function courseEntryCount(course: Course): number {
  return (
    course.lessons.length +
    course.courseTest.length +
    course.additionalContent.length +
    course.specialContent.length +
    course.toolContent.length
  );
}

function courseLessonsComplete(course: Course): boolean {
  if (course.lessons.length === 0) return false;
  const done = new Set(getCompletedLessons(course.slug));
  return course.lessons.every((lesson) => done.has(lesson.file));
}

/** コース完了 = 通常レッスン（lessons）をすべて完了している */
export function isCourseComplete(course: Course): boolean {
  return courseLessonsComplete(course);
}

/** slug 指定でコース完了を判定（別コースの前提条件用） */
export function isCourseSlugComplete(slug: string): boolean {
  const course = courses.find((c) => c.slug === slug);
  return course ? courseLessonsComplete(course) : false;
}

export interface SpecialAccess {
  /** 解放済みか */
  unlocked: boolean;
  /** パスワード入力欄を表示すべきか（パスワード設定あり・未入力・未解放のとき true） */
  needsPassword: boolean;
  /** 前提完了条件を満たしているか */
  requirementMet: boolean;
  /** 前提完了条件の説明（未設定なら undefined） */
  requirementLabel?: string;
  /** requires と password の両方が必要か（"all"）、いずれかか（"any"） */
  mode: "all" | "any";
  /** パスワードを既に入力済みか */
  passwordEntered: boolean;
}

function courseTitleForSlug(course: Course, slug: string): string {
  if (slug === "self") return course.title;
  return courses.find((c) => c.slug === slug)?.title ?? slug;
}

function requirementLabel(course: Course, requires: ContentRequirement): string {
  if (requires === "course") {
    return "このコースのレッスンをすべて完了すると解放されます";
  }
  if (Array.isArray(requires)) {
    const titles = requires.map((file) => findCourseEntry(course, file)?.title ?? file);
    return `次を完了すると解放されます: ${titles.join(" / ")}`;
  }

  const parts: string[] = [];
  for (const slug of requires.courses ?? []) parts.push(courseTitleForSlug(course, slug));
  for (const file of requires.lessons ?? []) parts.push(findCourseEntry(course, file)?.title ?? file);

  const match = requires.match ?? "all";
  if (parts.length === 0) return "解放条件があります";
  const joiner = match === "any" ? " または " : " / ";
  const verb = match === "any" ? "いずれかを完了" : "すべて完了";
  return `次を${verb}すると解放されます: ${parts.join(joiner)}`;
}

function requirementSatisfied(course: Course, requires: ContentRequirement): boolean {
  if (requires === "course") return courseLessonsComplete(course);

  if (Array.isArray(requires)) {
    const done = new Set(getCompletedLessons(course.slug));
    return requires.every((file) => done.has(file));
  }

  const checks: boolean[] = [];
  for (const slug of requires.courses ?? []) {
    checks.push(slug === "self" ? courseLessonsComplete(course) : isCourseSlugComplete(slug));
  }
  if (requires.lessons && requires.lessons.length > 0) {
    const done = new Set(getCompletedLessons(course.slug));
    for (const file of requires.lessons) checks.push(done.has(file));
  }

  if (checks.length === 0) return true;
  return (requires.match ?? "all") === "any" ? checks.some(Boolean) : checks.every(Boolean);
}

/**
 * 特別コンテンツ（追加コース）の解放状態を評価する。
 * - requires のみ: 完了条件で解放
 * - password のみ: パスワードで解放
 * - 両方 + mode "any"（既定）: どちらかで解放
 * - 両方 + mode "all": 完了条件とパスワードの両方が必要
 */
export function evaluateContentAccess(course: Course, entry: CourseLesson): SpecialAccess {
  const lock = entry.lock;
  const mode = lock?.mode ?? "any";

  if (isDevMode) {
    return { unlocked: true, needsPassword: false, requirementMet: true, mode, passwordEntered: true };
  }

  if (!lock || (lock.requires === undefined && !lock.password)) {
    return { unlocked: true, needsPassword: false, requirementMet: true, mode, passwordEntered: false };
  }

  if (isContentUnlocked(course.slug, entry.file)) {
    return {
      unlocked: true,
      needsPassword: false,
      requirementMet: true,
      requirementLabel: lock.requires
        ? requirementLabel(course, lock.requires)
        : undefined,
      mode,
      passwordEntered: true,
    };
  }

  const hasRequires = lock.requires !== undefined;
  const hasPassword = Boolean(lock.password);
  const requirementMet = hasRequires ? requirementSatisfied(course, lock.requires!) : false;
  const passwordEntered = hasPassword ? isContentUnlocked(course.slug, entry.file) : false;

  let unlocked: boolean;
  if (hasRequires && hasPassword) {
    unlocked = mode === "all" ? requirementMet && passwordEntered : requirementMet || passwordEntered;
  } else if (hasRequires) {
    unlocked = requirementMet;
  } else {
    unlocked = passwordEntered;
  }

  if (unlocked) {
    markContentUnlocked(course.slug, entry.file);
  }

  return {
    unlocked,
    needsPassword: hasPassword && !passwordEntered && !unlocked,
    requirementMet,
    requirementLabel: hasRequires ? requirementLabel(course, lock.requires!) : undefined,
    mode,
    passwordEntered: passwordEntered || unlocked,
  };
}

/** @deprecated Use {@link evaluateContentAccess} */
export const evaluateSpecialAccess = evaluateContentAccess;

/** パスワードを検証し、一致すれば解放を記録する。 */
export function verifyContentPassword(course: Course, entry: CourseLesson, input: string): boolean {
  const password = entry.lock?.password;
  if (password && input === password) {
    markContentUnlocked(course.slug, entry.file);
    return true;
  }
  return false;
}

/** @deprecated Use {@link verifyContentPassword} */
export const verifySpecialPassword = verifyContentPassword;

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

/** ロック済みコンテンツ共有用（`?pw=` で開くと自動解放） */
export function lessonHrefWithPassword(
  course: Course,
  lesson: CourseLesson,
  password: string
): string {
  return `${lessonPageHref(course.slug, lesson.file)}?${CONTENT_PASSWORD_SEARCH_PARAM}=${encodeURIComponent(password)}`;
}

/** コース一覧共有用（特別コンテンツの `pw` 付きリンク） */
export function courseIndexHrefWithPassword(courseSlug: string, password: string): string {
  return `${courseIndexHref(courseSlug)}&${CONTENT_PASSWORD_SEARCH_PARAM}=${encodeURIComponent(password)}`;
}

/** 現在の URL の `pw` を適用（コース一覧・レッスン起動時に呼ぶ） */
export function prepareContentAccessFromUrl(course: Course, lessonFile?: string): void {
  const entries = lessonFile
    ? (() => {
        const entry = findCourseEntry(course, lessonFile);
        return entry?.lock?.password ? [entry] : [];
      })()
    : allPasswordLockedEntries(course);
  if (entries.length > 0) applyContentPasswordFromUrl(course, entries);
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
