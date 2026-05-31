import { lessonChromeLinks } from "./courses";
import type { LessonChrome } from "./types";

export function lessonChrome(
  courseSlug: string,
  lessonFile: string,
  title: string
): LessonChrome {
  const { prevHref, nextHref, indexHref } = lessonChromeLinks(courseSlug, lessonFile);
  return { title, prevHref, nextHref, indexHref };
}
