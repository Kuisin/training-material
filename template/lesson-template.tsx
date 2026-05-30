/**
 * レッスンテンプレート（TSX版）
 *
 * 使い方:
 * 1. このファイルを <track>/NN-kebab-title.tsx にコピー
 * 2. chrome の title / prevHref / nextHref を設定
 * 3. slides 配列にスライドを追加（title + content + plainText）
 * 4. index.tsx のレッスン一覧にリンクを追加
 */
import { renderLesson } from "../src/render-lesson";
import { Callout } from "../src/components/callout";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";

const chrome = {
  title: "{{LESSON_TITLE}}",
  prevHref: "{{PREV_HREF}}",
  nextHref: "{{NEXT_HREF}}",
  indexHref: "../index.html",
};

const slides = [
  {
    title: "概要",
    plainText: "{{LESSON_TITLE}}\n{{ONE_LINE_SUMMARY}}",
    content: (
      <>
        <hgroup>
          <h1>{{LESSON_TITLE}}</h1>
          <p>{{ONE_LINE_SUMMARY}}</p>
        </hgroup>
        <LessonMeta
          items={[
            { icon: "⏱", text: "{{DURATION}}" },
            { icon: "📶", text: "{{LEVEL}}" },
            { icon: "🏷", text: "{{TRACK}}" },
          ]}
        />
        <h3>この章で学ぶこと</h3>
        <ul>
          <li>{{GOAL_1}}</li>
          <li>{{GOAL_2}}</li>
          <li>{{GOAL_3}}</li>
        </ul>
      </>
    ),
  },
  {
    title: "{{SLIDE_2_MENU_LABEL}}",
    plainText: "{{SLIDE_2_HEADING}}\n{{PARAGRAPH}}",
    content: (
      <>
        <h2>{{SLIDE_2_HEADING}}</h2>
        <p>{{PARAGRAPH}}</p>
        <CodeBlock code={`{{CODE_EXAMPLE}}`} />
        <Callout variant="tip">{{TIP_TEXT}}</Callout>
      </>
    ),
  },
  {
    title: "仕組み",
    plainText: "仕組み",
    content: (
      <>
        <h2>仕組み</h2>
        <MermaidDiagram
          chart={`flowchart LR
  A[{{NODE_A}}] --> B[{{NODE_B}}]`}
        />
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={0}
          explanation="{{EXPLANATION}}"
          question={<strong>{{QUESTION}}</strong>}
          options={["{{OPTION_0}}", "{{OPTION_1}}", "{{OPTION_2}}"]}
        />
      </>
    ),
  },
];

renderLesson(chrome, slides);
