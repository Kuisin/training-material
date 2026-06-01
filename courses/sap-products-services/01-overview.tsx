import {
  Lesson,
  lessonChrome,
  Dialog,
  MermaidDiagram,
  Figure,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "コース全体像 — この研修で身につける地図",
  meta: "初学者 · 10分",
};

export default function OverviewLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "01-overview", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "コース全体像\nSAP の製品・サービスを「構造」として理解し、他研修や実務の会話に迷わず参加できる地図を作ります。",
          content: (
            <>
              <hgroup>
                <h1>コース全体像</h1>
                <p>SAP の製品・サービスを<strong>構造</strong>として理解し、研修やプロジェクトの会話に迷わない地図を作ります。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "10分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
              <h3>ゴール</h3>
              <ul>
                <li>業務・データ・システムの三層が説明できる</li>
                <li>主要モジュール（FI / SD / MM など）の役割が大まかに分かる</li>
                <li>クラウド製品（SaaS・BTP・RISE）の位置が分かる</li>
                <li>標準化と拡張、エンドツーエンドの流れを説明できる</li>
              </ul>
              <Dialog speaker="b">
                覚えることがいっぱいで、ちょっと身構えてしまいます…。
              </Dialog>
              <Dialog speaker="teacher">
                暗記ではなく「地図づくり」です。製品名を覚えるより、<strong>どこに何があるか</strong>が言えればOK。会議で迷子にならないことがゴールです。
              </Dialog>
            </>
          ),
        },
        {
          title: "学習の流れ",
          plainText:
            "章の流れ\n三層→モジュール→クラウド→標準化→拡張→エンドツーエンド→復習",
          content: (
            <>
              <h2>章の流れ</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A[三層構造] --> B[S/4 モジュール]
  B --> C[クラウド製品]
  C --> D[Fit to Standard]
  D --> E[拡張と BTP]
  E --> F[エンドツーエンド]
  F --> G[復習テスト]`}
              />
              <Figure
                src="image/01-course-map.webp"
                alt="左から右へ続く道のりマップ。三層構造→S/4モジュール→クラウド製品→Fit to Standard→拡張とBTP→エンドツーエンド→復習テスト、の順にマイルストーンのピンが並ぶ。"
                caption="本コースの道のり：構造を下から積み上げ、最後に一枚絵で復習する"
                kind="concept"
              />
              <ol>
                <li>
                  <strong>第2章</strong> … 業務層・データ層・システム層
                </li>
                <li>
                  <strong>第3章</strong> … S/4HANA と FI / CO / SD / MM など
                </li>
                <li>
                  <strong>第4章</strong> … RISE、SaaS、Analytics Cloud、BTP
                </li>
                <li>
                  <strong>第5章</strong> … 標準化（Fit to Standard）
                </li>
                <li>
                  <strong>第6章</strong> … Clean Core、In-App / Side-by-Side
                </li>
                <li>
                  <strong>第7章</strong> … 顧客・サプライヤから SaaS までの一本流れ
                </li>
                <li>
                  <strong>第8章</strong> … 総復習と確認テスト
                </li>
              </ol>
              <Dialog speaker="teacher">
                略語は多いですが、<strong>「どの層の話か」</strong>が分かれば会話に乗れます。
              </Dialog>
            </>
          ),
        },
        {
          title: "他研修との関係",
          plainText:
            "他研修とのつながり\nSAP GUI 基礎 → 本コース → ABAP 研修、の順がおすすめ。",
          content: (
            <>
              <h2>他研修とのつながり</h2>
              <p>おすすめの順番は次のとおりです。</p>
              <ol>
                <li>
                  <strong>SAP GUI 基礎</strong> … 画面操作の共通ルール
                </li>
                <li>
                  <strong>本コース（構造とサービス）</strong> … 製品・モジュールの地図
                </li>
                <li>
                  <strong>ABAP 研修</strong> … 仕訳日記帳など開発の実習
                </li>
              </ol>
              <LessonLinkButton
                courseSlug="sap-gui-basics"
                lessonFile="00-introduction"
                label="SAP GUI 基礎: はじめに"
                variant="back"
              />
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="00-introduction"
                label="ABAP 研修: はじめに"
                variant="forward"
              />
              <Dialog speaker="a">
                モジュール名が分かっていると、ABAP で触るテーブル（BKPF など）の意味も腹落ちしそうです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OverviewLesson);
