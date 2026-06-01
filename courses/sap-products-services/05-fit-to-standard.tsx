import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "標準化 — Fit to Standard の考え方",
  meta: "初学者 · 15分",
};

export default function FitToStandardLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "05-fit-to-standard", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "Fit to Standard\n業務をシステムの標準プロセスに合わせることで、コスト削減・迅速なアップデート・ベストプラクティス適用が期待できる。",
          content: (
            <>
              <hgroup>
                <h1>標準化（Fit to Standard）</h1>
                <p>
                  <strong>Fit to Standard</strong> は、「システムを業務に合わせる」より
                  <strong>「業務を SAP の標準プロセスに合わせる」</strong>という考え方です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>Fit to Standard のコンセプト</li>
                <li>期待される効果（コスト・更新・ベストプラクティス）</li>
                <li>「全部カスタム」とのバランス</li>
              </ul>
            </>
          ),
        },
        {
          title: "コンセプト",
          plainText: "業務 → システムに合わせる。効果: 開発コスト削減、アップデート高速化、ベストプラクティス適用。",
          content: (
            <>
              <h2>コンセプトと効果</h2>
              <p>
                従来型の「既存の紙の運用をそのままシステムに載せ替える」方式と比べ、SAP では
                <strong>標準プロセスを採用する</strong>ことで次のメリットを狙います。
              </p>
              <ul>
                <li>
                  <strong>開発コストの削減</strong> … 独自 ABAP や改修が減る
                </li>
                <li>
                  <strong>アップデートの高速化</strong> … カスタムが少ないほど、新バージョン取り込みが容易
                </li>
                <li>
                  <strong>ベストプラクティスの適用</strong> … 業界で実績のあるプロセスをそのまま活用
                </li>
              </ul>
              <MermaidDiagram
                chart={`flowchart LR
  A[従来型\n業務そのまま実装] --> C[高コスト\n更新困難]
  B[Fit to Standard\n標準プロセス採用] --> D[低コスト\n更新しやすい]`}
              />
              <Callout variant="warning">
                標準化は「現場の事情を無視する」ことではありません。<strong>本当に差別化が必要な部分だけ拡張</strong>する、というバランスが重要です。
              </Callout>
            </>
          ),
        },
        {
          title: "実務での判断",
          plainText:
            "標準化は「業務 → システムに合わせる」。無理なカスタムを減らし、本当に必要な差別化だけ残す。",
          content: (
            <>
              <h2>実務での判断のしかた</h2>
              <p>
                標準化構造のキーメッセージは、<strong>「業務をシステムの標準に合わせる」</strong>ことです。
                現場の運用をそのまま再現するのではなく、SAP が持つ標準プロセスを起点に設計します。
              </p>
              <ul>
                <li>
                  <strong>やめること</strong> … 標準で賄える処理の独自 ABAP、重複する帳票、過剰なワークフロー
                </li>
                <li>
                  <strong>残すこと</strong> … 競争優位に直結する差別化（次章の拡張で実装）
                </li>
                <li>
                  <strong>得られること</strong> … 開発コスト削減、リリース・アップグレードの迅速化、ベストプラクティス適用
                </li>
              </ul>
              <Dialog speaker="a">
                ABAP で全部作るのではなく、<strong>標準機能＋最小限の拡張</strong>、がプロジェクトの方針になりそうです。
              </Dialog>
              <Dialog speaker="teacher">
                「標準に合わせられない」要件が出たら、まず<strong>本当に標準で無理か</strong>を確認してから拡張を検討します。
              </Dialog>
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
                answer={1}
                explanation="Fit to Standard は業務を SAP の標準プロセスに合わせる考え方です。"
                question={<strong>Fit to Standard の説明として正しいのは？</strong>}
                options={[
                  "SAP を完全に使わず Excel のみで運用する",
                  "業務を SAP の標準プロセスに合わせる",
                  "すべての画面を ABAP で作り直す",
                ]}
              />
              <Quiz
                answer={2}
                explanation="標準化により、カスタムが減りアップデートやベストプラクティス適用がしやすくなります。"
                question={<strong>標準化の期待効果に含まれないのは？</strong>}
                options={["開発コスト削減", "アップデートのしやすさ", "SAP を使わないこと"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FitToStandardLesson);
