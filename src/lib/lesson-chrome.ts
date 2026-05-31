import { lessonChromeLinks } from "./courses";
import type { LessonChrome } from "./types";

export function lessonChrome(
  courseSlug: string,
  lessonFile: string,
  title: string
): LessonChrome {
  const { lessonNum, prevHref, nextHref, indexHref, prevLesson, nextLesson } = lessonChromeLinks(
    courseSlug,
    lessonFile
  );
  return { title, lessonNum, prevHref, nextHref, indexHref, prevLesson, nextLesson };
}
