import {
  Lesson,
  lessonChrome,
  Dialog,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "総仕上げ — 構造の復習と確認テスト",
  meta: "初学者 · 20分",
};

export default function ReviewAndQuizLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "08-review-and-quiz", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText: "総仕上げ\n本コースの要点を一枚絵で復習し、確認テストで定着を図ります。",
          content: (
            <>
              <hgroup>
                <h1>総仕上げ</h1>
                <p>これまでの章を<strong>一枚の地図</strong>にまとめ、確認テストで定着させます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
            </>
          ),
        },
        {
          title: "一枚絵",
          plainText:
            "復習の一枚絵\n三層・モジュール・クラウド・標準化・拡張・エンドツーエンド",
          content: (
            <>
              <h2>復習の一枚絵</h2>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph strategy["戦略"]
    FT[Fit to Standard]
    CC[Clean Core + 拡張]
    CL[RISE / GROW / クラウド]
  end
  subgraph layers["三層"]
    B[業務: FI SD MM...]
    D[データ: HANA]
    S[システム: Fiori S/4 DB]
  end
  subgraph e2e["エンドツーエンド"]
    FR[フロント]
    ER[S/4 コア]
    BT[BTP]
    SA[SaaS]
  end
  strategy --> layers --> e2e
  FR --> ER --> BT --> SA`}
              />
              <ul>
                <li>
                  <strong>三層</strong> … 業務 / データ / システム
                </li>
                <li>
                  <strong>S/4 + モジュール</strong> … ERP の中身
                </li>
                <li>
                  <strong>クラウド</strong> … RISE、SaaS、SAC、BTP
                </li>
                <li>
                  <strong>標準化と拡張</strong> … Fit to Standard と Clean Core
                </li>
                <li>
                  <strong>エンドツーエンド</strong> … 取引先から SaaS まで
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText: "総合確認テスト",
          content: (
            <>
              <h2>総合確認テスト</h2>
              <Quiz
                answer={2}
                explanation="SAP HANA は統合データベースであり、データ層の中心です。"
                question={<strong>データ層の中心技術は？</strong>}
                options={["SAP Fiori", "SAP Cloud Connector", "SAP HANA"]}
              />
              <Quiz
                answer={0}
                explanation="RISE with SAP は S/4HANA Cloud private edition などを含むクラウド移行・運用のオファーです。"
                question={<strong>プライベートクラウドで S/4 を運用するオファーの例は？</strong>}
                options={["RISE with SAP", "Notepad", "Windows メモ帳"]}
              />
              <Quiz
                answer={1}
                explanation="Fit to Standard は標準プロセスへの合わせ、Clean Core はコアを標準のまま保つ戦略です。"
                question={<strong>「コアを標準のまま保つ」戦略は？</strong>}
                options={["Fit to Standard", "Clean Core", "Legacy Only"]}
              />
              <Quiz
                answer={2}
                explanation="エンドツーエンドでは S/4 が ERP コア、BTP が拡張、Ariba 等が SaaS 層です。"
                question={<strong>調達 SaaS として代表的なのは？</strong>}
                options={["SuccessFactors", "Concur", "Ariba"]}
              />
              <Dialog speaker="teacher">
                略語は辞書的に覚えなくて大丈夫です。<strong>「どの層・どの製品カテゴリか」</strong>が言えれば、実務の会話に十分乗れます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ReviewAndQuizLesson);
