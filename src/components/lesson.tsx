import { useEffect } from "react";
import { Deck } from "./deck";
import type { LessonChrome, SlideDefinition } from "../lib/types";

interface LessonProps {
  chrome: LessonChrome;
  slides: SlideDefinition[];
}

/** レッスン共通ラッパー（Deck + document.title）。各章は default export でこれを返す。 */
export function Lesson({ chrome, slides }: LessonProps) {
  useEffect(() => {
    if (chrome.title) document.title = chrome.title;
  }, [chrome.title]);

  return <Deck chrome={chrome} slides={slides} />;
}
