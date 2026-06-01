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
  title: "エンドツーエンド — フロントから SaaS まで",
  meta: "初学者 · 15分",
};

export default function EndToEndLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "07-end-to-end", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "エンドツーエンド構造\n顧客・サプライヤ → S/4HANA（ERPコア）→ BTP（拡張）→ SaaS（Ariba/Concur/SF）の一本流れ。",
          content: (
            <>
              <hgroup>
                <h1>エンドツーエンド構造</h1>
                <p>
                  SAP の製品群を<strong>一つの流れ</strong>として見ると、
                  外部の取引先から ERP コア、拡張、クラウド SaaS までがつながっていることが分かります。
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
                <li>4 段階のエンドツーエンド構造</li>
                <li>各段階の代表製品</li>
                <li>全体像を一枚絵で説明する練習</li>
              </ul>
            </>
          ),
        },
        {
          title: "4段階",
          plainText:
            "①フロント:顧客・サプライヤ ②ERPコア:S/4HANA ③拡張:BTP ④外部:SaaS",
          content: (
            <>
              <h2>4 段階の構造</h2>
              <ol>
                <li>
                  <strong>【フロント】</strong> … <strong>顧客・サプライヤ</strong>（取引の入口）
                </li>
                <li>
                  <strong>【ERP コア】</strong> … <strong>S/4HANA</strong>（受注・購買・会計などの業務処理）
                </li>
                <li>
                  <strong>【拡張】</strong> … <strong>BTP</strong>（AI・連携・独自アプリ）
                </li>
                <li>
                  <strong>【外部 SaaS】</strong> … <strong>Ariba / Concur / SuccessFactors</strong> など
                </li>
              </ol>
              <MermaidDiagram
                chart={`flowchart TB
  F["【フロント】\n顧客・サプライヤ"]
  E["【ERP コア】\nS/4HANA\n業務処理"]
  X["【拡張】\nBTP\nAI・連携"]
  S["【外部】\nSaaS\nAriba / Concur / SF"]
  F --> E --> X --> S`}
              />
              <Dialog speaker="teacher">
                案件では必ずしも4つ全部が同時に入るわけではありませんが、<strong>「どこに何があるか」</strong>の説明には最適な図です。
              </Dialog>
            </>
          ),
        },
        {
          title: "つながりの例",
          plainText:
            "例: サプライヤが Ariba で見積 → S/4 で発注・会計 → BTP で在庫連携 → Concur で経費。",
          content: (
            <>
              <h2>つながりの例（イメージ）</h2>
              <p>4 段階を、調達から経費までのざっくりした流れで見てみます。</p>
              <ol>
                <li>
                  <strong>【フロント】</strong> … サプライヤがポータルや Ariba 経由で見積・受注情報をやり取り
                </li>
                <li>
                  <strong>【ERP コア】</strong> … S/4HANA で発注・入庫・仕訳（MM / FI）を処理
                </li>
                <li>
                  <strong>【拡張】</strong> … BTP で倉庫システムや AI 需要予測と連携
                </li>
                <li>
                  <strong>【外部 SaaS】</strong> … 出張者は Concur、人事評価は SuccessFactors
                </li>
              </ol>
              <p>
                実案件ではこのうち<strong>必要な段だけ</strong>を導入します。重要なのは、
                「今の話はフロントか、コアか、拡張か、SaaS か」を切り分けられることです。
              </p>
              <Dialog speaker="b">
                会議で「BTP でやりましょう」と言われたら、<strong>拡張層</strong>の話だと分かる、という感じですね。
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
                explanation="S/4HANA は ERP コアとして業務処理の中心です。"
                question={<strong>【ERP コア】に位置づけられるのは？</strong>}
                options={["Concur のみ", "S/4HANA", "顧客ポータルのみ"]}
              />
              <Quiz
                answer={2}
                explanation="BTP は拡張層で AI や連携を担います。Ariba / Concur / SuccessFactors は外部 SaaS 層の例です。"
                question={<strong>【拡張】層の代表例は？</strong>}
                options={["SAP GUI", "BTP", "紙の伝票"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(EndToEndLesson);
