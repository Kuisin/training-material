import { Lesson } from "./components/lesson";
import type { LessonChrome, SlideDefinition } from "./lib/types";
import { mountLesson } from "./mount-lesson";

/** @deprecated `Lesson` + `mountLesson` を使って default export してください。 */
export function renderLesson(chrome: LessonChrome, slides: SlideDefinition[]): void {
  function LegacyLessonPage() {
    return <Lesson chrome={chrome} slides={slides} />;
  }

  mountLesson(LegacyLessonPage);
}
