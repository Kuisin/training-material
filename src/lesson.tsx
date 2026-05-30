/** レッスン作成用の統一エクスポート（Next.js の page コンポーネントと同様の import 口）。 */
export { Lesson } from "./components/lesson";
export { Callout } from "./components/callout";
export { Dialog } from "./components/dialog";
export { CodeBlock } from "./components/code-block";
export { Quiz } from "./components/quiz";
export { MermaidDiagram } from "./components/mermaid-diagram";
export { LessonMeta } from "./components/lesson-meta";
export { mountLesson } from "./mount-lesson";
export type { LessonChrome, SlideDefinition } from "./lib/types";
