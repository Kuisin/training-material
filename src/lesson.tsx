/** レッスン作成用の統一エクスポート（Next.js の page コンポーネントと同様の import 口）。 */
export { Lesson } from "./components/lesson";
export { Callout } from "./components/callout";
export { InfoPanel } from "./components/info-panel";
export { Dialog } from "./components/dialog";
export { CharacterIntro } from "./components/character-intro";
export { CodeBlock } from "./components/code-block";
export { Quiz } from "./components/quiz";
export { MermaidDiagram } from "./components/mermaid-diagram";
export { Figure } from "./components/figure";
export { LessonMeta } from "./components/lesson-meta";
export { mountLesson } from "./mount-lesson";
export { lessonChrome } from "./lib/lesson-chrome";
export type { LessonChrome, SlideDefinition } from "./lib/types";
