import { useEffect, useLayoutEffect } from "react";
import { Deck } from "./deck";
import { ContentLockScreen } from "./content-lock-screen";
import {
  courseIndexHref,
  courses,
  evaluateContentAccess,
  findCourseEntry,
  prepareContentAccessFromUrl,
} from "../lib/courses";
import { courseSlugFromPathname, lessonFileFromPathname } from "../lib/course-search";
import { useCompletion } from "../lib/completion-store";
import type { LessonChrome, SlideDefinition } from "../lib/types";

interface LessonProps {
  chrome: LessonChrome;
  slides: SlideDefinition[];
}

/** レッスン共通ラッパー（Deck + document.title）。各章は default export でこれを返す。 */
export function Lesson({ chrome, slides }: LessonProps) {
  useCompletion();

  const courseSlug = courseSlugFromPathname(window.location.pathname);
  const lessonFile = lessonFileFromPathname(window.location.pathname);
  const course = courseSlug ? courses.find((item) => item.slug === courseSlug) : undefined;
  const entry = course ? findCourseEntry(course, lessonFile) : undefined;

  useLayoutEffect(() => {
    if (course) prepareContentAccessFromUrl(course, lessonFile);
  }, [course?.slug, lessonFile]);

  const lockAccess =
    course && entry?.lock ? evaluateContentAccess(course, entry) : undefined;

  useEffect(() => {
    if (chrome.title) document.title = chrome.title;
  }, [chrome.title]);

  if (course && entry && lockAccess && !lockAccess.unlocked) {
    return (
      <ContentLockScreen
        course={course}
        entry={entry}
        access={lockAccess}
        indexHref={chrome.indexHref || courseIndexHref(course.slug)}
        displayTitle={chrome.title || entry.title}
      />
    );
  }

  return <Deck chrome={chrome} slides={slides} />;
}
