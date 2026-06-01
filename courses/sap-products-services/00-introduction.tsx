import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CharacterIntro,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "SAP ERP とは — DX 基盤としての3つの軸",
  meta: "初学者 · 15分",
};

export default function IntroductionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "00-introduction", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "SAP ERP とは\nSAP ERP は単なる業務システムではなく、デジタルトランスフォーメーション（DX）を実現する統合プラットフォームです。\n⏱ 15分 / 📶 初学者 / 🏷 SAP 構造とサービス",
          content: (
            <>
              <hgroup>
                <h1>SAP ERP とは</h1>
                <p>
                  SAP ERP は<strong>単なる業務システムではありません</strong>。会計・販売・購買などを一つの基盤でつなぎ、
                  <strong>デジタルトランスフォーメーション（DX）</strong>を進めるための<strong>統合プラットフォーム</strong>です。
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
                <li>SAP ERP を「DX 基盤」と捉える理由</li>
                <li>標準化・差別化（拡張）・運用最適化の3つの軸</li>
                <li>RISE / GROW などクラウド移行の位置づけ（概要）</li>
              </ul>
            </>
          ),
        },
        {
          title: "登場人物",
          plainText: "3人で学ぶ\nSAP の製品名は多いですが、まずは全体の地図を押さえます。",
          content: (
            <>
              <h2>3人で学ぶ</h2>
              <CharacterIntro speaker="teacher">
                これからは「画面操作」ではなく、<strong>SAP の製品とサービスの地図</strong>を描きます。モジュール名や略語は後から覚えれば十分です。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                ABAP 研修の前に、FI や S/4HANA がどこに位置するのか整理したいです。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                RISE や BTP という言葉は聞いたことがあるけど、まだ一枚絵になっていません…。
              </CharacterIntro>
              <Dialog speaker="teacher">
                大丈夫です。今日は「駅の路線図」を見る感覚で進めましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "3つの軸",
          plainText:
            "SAP ERP の3つの軸\n① 標準化（Fit to Standard）② 差別化（拡張・BTP）③ 運用の最適化（RISE / GROW などクラウド）",
          content: (
            <>
              <h2>SAP ERP の3つの軸</h2>
              <ol>
                <li>
                  <strong>標準化（Fit to Standard）</strong> … 業界のベストプラクティスに沿った標準プロセスを活用する
                </li>
                <li>
                  <strong>差別化（拡張）</strong> … 自社独自の要件は BTP などで<strong>コアを汚さず</strong>拡張する
                </li>
                <li>
                  <strong>運用の最適化</strong> … <strong>RISE with SAP</strong> や <strong>GROW with SAP</strong> などクラウドで運用負荷を下げる
                </li>
              </ol>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph axes["SAP ERP の価値"]
    F[標準化\nFit to Standard]
    E[差別化\n拡張・BTP]
    O[運用最適化\nRISE / GROW]
  end
  F --> DX[DX 実現]
  E --> DX
  O --> DX`}
              />
              <Callout variant="tip">
                「全部カスタム」ではなく、<strong>標準を土台に、必要なところだけ拡張</strong>するのが現代の SAP の考え方です。
              </Callout>
            </>
          ),
        },
        {
          title: "全体像",
          plainText:
            "SAP ERP の全体像\n三層（業務・データ・システム）の上に、標準化・拡張・クラウド運用の3軸が載る。",
          content: (
            <>
              <h2>SAP ERP の全体像</h2>
              <p>
                製品を一枚絵で捉えると、<strong>下に三層の構造</strong>があり、その上で
                <strong>標準化・差別化・運用最適化</strong>の方針が決まります。
              </p>
              <ul>
                <li>
                  <strong>業務層</strong> … FI / CO / SD / MM / PP などモジュール単位の処理
                </li>
                <li>
                  <strong>データ層</strong> … SAP HANA に集約された統合データ
                </li>
                <li>
                  <strong>システム層</strong> … Fiori（UI）→ S/4HANA（アプリ）→ HANA DB
                </li>
              </ul>
              <p>
                この三層を土台に、<strong>Fit to Standard</strong> で標準プロセスを採用し、
                足りない部分は <strong>BTP</strong> で拡張、運用は <strong>RISE / GROW</strong> などクラウドで最適化する——という流れが、以降の章の骨格です。
              </p>
              <Dialog speaker="teacher">
                略語は後からで大丈夫です。まずは「<strong>層</strong>」と「<strong>3つの軸</strong>」だけ覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SAP ERP の位置づけは？→ DX を支える統合プラットフォーム\nQ2 差別化の代表的な手段は？→ BTP による拡張",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="SAP ERP は業務処理だけでなく、標準化・拡張・クラウド運用を通じて DX を実現する統合基盤として位置づけられます。"
                question={<strong>SAP ERP の説明として最も適切なのは？</strong>}
                options={[
                  "会計ソフトの一種で、他部門とは独立している",
                  "DX を実現するための統合プラットフォーム",
                  "開発者だけが使うプログラミング環境",
                ]}
              />
              <Quiz
                answer={2}
                explanation="独自要件は In-App や BTP（Side-by-Side）で拡張します。詳しくは第6章で学びます。"
                question={<strong>「差別化（拡張）」でよく挙げられる手段は？</strong>}
                options={["Excel マクロのみ", "紙の帳票への置き換え", "BTP を使った拡張"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
