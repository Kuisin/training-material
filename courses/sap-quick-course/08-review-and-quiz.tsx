import {
  Lesson,
  lessonChrome,
  Dialog,
  Quiz,
  MermaidDiagram,
  Figure,
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
          plainText:
            "総仕上げ\n本コースの要点を一枚絵で復習し、確認テストで定着を図ります。\n⏱ 20分 / 📶 初学者 / 🏷 SAP 構造とサービス",
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
              <Dialog speaker="teacher">
                おつかれさまでした。今日は全体を一枚の地図として振り返ります。略語は全部覚えなくていいです。<strong>「どこに何があるか」</strong>が言えれば十分です。
              </Dialog>
              <Dialog speaker="b">
                いろいろ出てきましたが、まとめると整理できそうで少し安心しました。
              </Dialog>
            </>
          ),
        },
        {
          title: "一枚絵",
          plainText:
            "復習の一枚絵\n戦略（Fit to Standard / Clean Core＋拡張 / RISE/GROWクラウド）＋三層（業務/データ/システム）＋E2E（フロント→S4コア→BTP→SaaS）",
          content: (
            <>
              <h2>復習の一枚絵</h2>
              <Figure
                src="image/08-big-picture.webp"
                alt="コース全体をまとめた1枚の地図。上段：戦略（Fit to Standard・Clean Core拡張・RISE/GROWクラウド）。中段：三層（業務モジュール/データHANA/システムFiori-S4-DB）。下段：エンドツーエンド（フロント→S4コア→BTP→SaaS）。3ゾーンが矢印でつながる全体像。"
                caption="SAP ERP の全体像：戦略→三層→エンドツーエンドを一枚に"
                kind="concept"
              />
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
                <li><strong>三層</strong> … 業務 / データ / システム</li>
                <li><strong>S/4 + モジュール</strong> … ERP の中身（FI/SD/MM など）</li>
                <li><strong>クラウド</strong> … RISE、SaaS、SAC、BTP</li>
                <li><strong>標準化と拡張</strong> … Fit to Standard と Clean Core</li>
                <li><strong>エンドツーエンド</strong> … 取引先から SaaS まで</li>
              </ul>
              <Dialog speaker="a">
                三層が骨格で、その上にモジュールやクラウド製品が乗り、エンドツーエンドの流れでつながる——整理できました。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "総合確認テスト\nQ1 データ層の中心技術は？→ SAP HANA\nQ2 プライベートクラウドでS/4を運用するオファーは？→ RISE with SAP\nQ3 「コアを標準のまま保つ」戦略は？→ Clean Core\nQ4 調達SaaSとして代表的なのは？→ Ariba\n今日のひとこと：略語は辞書的に覚えなくていい。どの層・どの製品カテゴリかが言えれば実務の会話に十分乗れます。",
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
              <Dialog speaker="b">
                最初は略語だらけで不安でしたが、層ごとに整理したら急にすっきりしました。
              </Dialog>
              <Dialog speaker="a">
                ABAP 研修で触る BKPF や BSEG が FI という業務層のデータで、それが HANA というデータ層に保存される——全部つながりましたね。
              </Dialog>
              <Dialog speaker="closing">
                地図を手に入れました。これからの研修や現場で「どこの話か」に迷ったら、この地図に戻ってください。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ReviewAndQuizLesson);
