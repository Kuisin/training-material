import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeArrange,
  FlowArrange,
  Quiz,
  MultiQuiz,
  ScoreBoard,
  PageSubmitBar,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";
import type { SlideDefinition } from "../../src/lesson";
import { quizLevelLabel } from "../../src/components/quiz-level-badge";
import { configureAssessmentStorage, useAttemptId } from "../../src/lib/score-store";
import {
  ASSESSMENTS,
  isMultiQuiz,
  type LessonAssessmentData,
} from "./14-assessment-data";

const ASSESSMENT_STORAGE_KEY = "abap-final-assessment";
configureAssessmentStorage(ASSESSMENT_STORAGE_KEY);

export const lessonMeta = {
  title: "総仕上げ — レッスン別確認テスト",
  meta: "初学者 · 60分",
};

function pageId(num: string): string {
  return `fa-l${num.padStart(2, "0")}`;
}

function pageItemIds(num: string): string[] {
  return [
    scoreId(num, "arrange"),
    scoreId(num, "quiz-basic"),
    scoreId(num, "quiz-intermediate"),
    scoreId(num, "quiz-advanced"),
  ];
}

function scoreId(num: string, suffix: string): string {
  return `${pageId(num)}-${suffix}`;
}

const SCORE_ITEMS = ASSESSMENTS.flatMap((a) => {
  const arrangeLabel = a.arrangeKind === "flow" ? "フロー組み立て" : "コード組み立て";
  return [
    {
      id: scoreId(a.num, "arrange"),
      label: `L${a.num} ${a.title} — ${arrangeLabel}`,
      labelText: `${a.title} — ${arrangeLabel}`,
      lessonNum: a.num,
      lessonTitle: a.title,
      kind: a.arrangeKind,
      explanation: a.codeInstruction,
    },
    ...a.quizzes.map((q) => ({
    id: scoreId(a.num, `quiz-${q.level}`),
    label: (
      <>
        L{a.num} {a.title} — 理解度チェック（{quizLevelLabel(q.level)}）
      </>
    ),
    labelText: `${a.title} — 理解度チェック（${quizLevelLabel(q.level)}）`,
    lessonNum: a.num,
    lessonTitle: a.title,
    kind: "quiz" as const,
    difficulty: q.level,
    explanation: q.explanation,
  })),
  ];
});

const REPORT_META = {
  courseTitle: "ABAP研修（仕訳日記帳・会計伝票登録）",
  assessmentTitle: lessonMeta.title,
  fileName: "abap-training-assessment-report.xlsx",
};

function LessonReviewSlide({ lesson }: { lesson: LessonAssessmentData }) {
  return (
    <>
      <p className="text-sm font-semibold text-brand">レッスン {lesson.num}</p>
      <h2>{lesson.title}</h2>
      <p>{lesson.summary}</p>

      <h3>{lesson.arrangeKind === "flow" ? "フロー組み立て" : "コード組み立て"}</h3>
      {lesson.arrangeKind === "flow" ? (
        <FlowArrange
          scoreId={scoreId(lesson.num, "arrange")}
          instruction={lesson.codeInstruction}
          lines={lesson.codeLines}
        />
      ) : (
        <CodeArrange
          scoreId={scoreId(lesson.num, "arrange")}
          instruction={lesson.codeInstruction}
          lines={lesson.codeLines}
        />
      )}

      <h3>理解度チェック</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        基礎（単一選択）→ 応用（複数選択）→ 発展（複数選択）の順で難しくなります。
      </p>
      {lesson.quizzes.map((q) =>
        isMultiQuiz(q) ? (
          <MultiQuiz
            key={q.level}
            scoreId={scoreId(lesson.num, `quiz-${q.level}`)}
            level={q.level}
            question={<strong>{q.question}</strong>}
            options={q.options}
            answers={q.answers}
            explanation={q.explanation}
          />
        ) : (
          <Quiz
            key={q.level}
            scoreId={scoreId(lesson.num, `quiz-${q.level}`)}
            level={q.level}
            question={<strong>{q.question}</strong>}
            options={q.options}
            answer={q.answer}
            explanation={q.explanation}
          />
        )
      )}

      <PageSubmitBar
        pageId={pageId(lesson.num)}
        itemIds={pageItemIds(lesson.num)}
        lessonLabel={`L${lesson.num}`}
      />
    </>
  );
}

function buildLessonSlides(): SlideDefinition[] {
  return ASSESSMENTS.map((lesson) => ({
    title: `L${lesson.num} ${lesson.title}`,
    plainText: `L${lesson.num} ${lesson.title}\n${lesson.summary}\n${lesson.arrangeKind === "flow" ? "フロー" : "コード"}組み立て + 理解度チェック（基礎・応用・発展）`,
    content: <LessonReviewSlide lesson={lesson} />,
  }));
}

export default function FinalAssessmentLesson() {
  const attemptId = useAttemptId();

  return (
    <Lesson
      key={attemptId}
      chrome={lessonChrome("abap-taining", "14-final-assessment", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "総仕上げテスト\n全14レッスン分の確認テスト。各ページで提出して採点。\n⏱ 60分 / 📶 初学者 / 🏷 ABAP研修",
          content: (
            <>
              <hgroup>
                <h1>総仕上げテスト</h1>
                <p>
                  レッスン 0〜13 それぞれに1ページ。各ページで<strong>フロー/コード組み立て</strong>と
                  <strong>理解度チェック（基礎→応用→発展）</strong>に取り組み、ページごとに提出して採点します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "60分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>進め方</h3>
              <ul>
                <li>
                  <strong>1ページ = 1レッスン</strong>（L0 から L13 まで全14ページ）
                </li>
                <li>
                  各ページ：<strong>フロー組み立て</strong>（概念・手順）または
                  <strong>コード組み立て</strong>（ABAP）＋ 理解度チェック 3 問
                  <ul>
                    <li><strong>基礎</strong> — 単一選択（用語・定義の確認）</li>
                    <li><strong>応用</strong> — 複数選択（学んだ内容の理解）</li>
                    <li><strong>発展</strong> — 複数選択（実務・トラブルを想定）</li>
                  </ul>
                </li>
                <li>
                  回答が終わったらページ下部の<strong>「提出する」</strong>で採点 — 正解・解説が表示されます
                </li>
                <li>回答と結果は<strong>ブラウザに自動保存</strong>されます（ページ移動・再読み込み後も保持）</li>
              </ul>
              <Callout variant="note">
                全 {SCORE_ITEMS.length} 問（14レッスン × 4問：組み立て1 + クイズ3）。最終ページで総合スコア・受験履歴・再テストができます。
              </Callout>
              <Dialog speaker="teacher">
                基礎で確認してから応用・発展に進む構成です。間違えた問題は該当レッスンに戻って復習しましょう。
              </Dialog>
            </>
          ),
        },
        ...buildLessonSlides(),
        {
          title: "総合結果",
          plainText:
            "総合結果\n各レッスンページで提出した結果の集計。再テストと受験履歴もここで確認できます。",
          content: (
            <>
              <h2>総合結果</h2>
              <p>
                各レッスンページで「提出する」を押した結果を集計しています（全 {SCORE_ITEMS.length} 問）。
              </p>
              <ScoreBoard items={SCORE_ITEMS} report={REPORT_META} />
              <Dialog speaker="closing">
                ここまでやり切ったあなたは、仕訳日記帳を題材に ABAP の一連の流れを体験できました。間違えたレッスンは該当章に戻って復習しましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FinalAssessmentLesson);
