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
  title: "三層構造 — 業務・データ・システム",
  meta: "初学者 · 20分",
};

export default function ThreeLayersLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "02-three-layers", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "三層構造\nSAP ERP を理解するうえで、まず押さえるのは三層のフレームです。会話が「どの層の話か」で整理できます。\n⏱ 20分 / 📶 初学者 / 🏷 SAP 構造とサービス\nこの章で学ぶこと\n・業務層・データ層・システム層の役割\n・各層に対応する代表的な要素（モジュール / HANA / Fiori など）\n・三層が一体として動くイメージ",
          content: (
            <>
              <hgroup>
                <h1>三層構造</h1>
                <p>
                  SAP ERP を理解するうえで、まず押さえるのは<strong>三層のフレーム</strong>です。会話が「どの層の話か」で整理できます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>業務層・データ層・システム層の役割</li>
                <li>各層に対応する代表的な要素（モジュール / HANA / Fiori など）</li>
                <li>三層が一体として動くイメージ</li>
              </ul>
              <Dialog speaker="teacher">
                SAP の話をするとき、「それはどの層の話ですか？」と切り分けられると、会議でも迷いにくくなります。今日はその切り分け方を学びます。
              </Dialog>
            </>
          ),
        },
        {
          title: "三層の定義",
          plainText:
            "① 業務層＝モジュール ② データ層＝統合DB（HANA） ③ システム層＝UI・アプリ・DBの技術スタック\n先生：層ごとに「担当が違う人」がいるイメージです。業務は現場、データはDB管理者、システムはインフラ担当。\nAくん：FI や SD は業務層、HANA はデータ層、Fiori は画面（システム層）ですね。\nBちゃん：建物のフロアに例えると覚えやすいかも。",
          content: (
            <>
              <h2>三層の定義</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pr-4">層</th>
                    <th className="text-left">何を表すか</th>
                    <th className="text-left">例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>① 業務層</strong></td>
                    <td>部門・プロセスごとの機能</td>
                    <td>FI, CO, SD, MM, PP …</td>
                  </tr>
                  <tr>
                    <td><strong>② データ層</strong></td>
                    <td>統合された業務データの置き場</td>
                    <td>SAP HANA（統合データベース）</td>
                  </tr>
                  <tr>
                    <td><strong>③ システム層</strong></td>
                    <td>ユーザーが触る技術スタック</td>
                    <td>Fiori → S/4HANA → HANA DB</td>
                  </tr>
                </tbody>
              </table>
              <Dialog speaker="a">
                FI や SD は業務層、HANA はデータ層、Fiori は画面（システム層）——という切り分けですね。
              </Dialog>
              <Dialog speaker="b">
                建物のフロアに例えると、1階が業務の現場、地下が倉庫（データ）、外壁が画面（システム）、みたいな感じですか？
              </Dialog>
              <Dialog speaker="teacher">
                いいたとえです。大事なのは「モジュールの話」「テーブルの話」「画面の話」を混ぜないこと。それだけで会話がずっとクリアになります。
              </Dialog>
            </>
          ),
        },
        {
          title: "全体図",
          plainText:
            "三層の全体図（Mermaid）\n業務層（FI/CO/SD/MM/PP）がHANAへデータを送り、システム層（Fiori→S/4→HANA DB）がその上で動く。\nBちゃん：業務の処理結果がHANAに溜まり、Fioriから見る、という流れですね。",
          content: (
            <>
              <h2>構造の全体図</h2>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph biz["① 業務層"]
    FI[FI 財務]
    CO[CO 管理会計]
    SD[SD 販売]
    MM[MM 購買・在庫]
    PP[PP 生産]
  end
  subgraph data["② データ層"]
    HANA[(統合 DB\nSAP HANA)]
  end
  subgraph sys["③ システム層"]
    UI[SAP Fiori\nUI]
    APP[SAP S/4HANA\nアプリケーション]
  end
  biz --> HANA
  UI --> APP
  APP --> HANA`}
              />
              <Dialog speaker="b">
                業務の処理結果が HANA に溜まり、Fiori から S/4 を通して見る、という流れですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "層のつながり",
          plainText:
            "三層は独立ではなく連動する。業務処理の結果がHANAに残り、Fioriから参照・分析される。\n手順：①Fioriで入力 → ②S/4HANAでルールチェック・番号採番 → ③HANAに保存 → ④他モジュールや帳票が参照。\n先生：「SD で受注が入る」→「FI で会計処理が走る」→「どちらも同じ HANA に結果が残る」、これが統合 ERP の価値です。\nAくん：モジュールを分けて入れても HANA でデータはひとつにつながるんですね。",
          content: (
            <>
              <h2>三層はどうつながるか</h2>
              <p>三層は箱が3つ並んだだけではありません。<strong>処理の流れ</strong>でつながります。</p>
              <ol>
                <li>ユーザーが <strong>Fiori</strong> で受注登録や仕訳入力をする（システム層・UI）</li>
                <li><strong>S/4HANA</strong> がルールチェック・番号採番などを実行（システム層・アプリ ＝ 業務ロジック）</li>
                <li>結果が <strong>HANA</strong> のテーブルに保存される（データ層）</li>
                <li>他モジュールやレポートが、同じ HANA 上のデータを参照する（業務層どうしの連携）</li>
              </ol>
              <Dialog speaker="teacher">
                「SD で受注が入る」と「FI で会計処理が走る」は別モジュールですが、どちらも同じ HANA にデータが残ります。これが統合 ERP の本当の価値です。
              </Dialog>
              <Dialog speaker="a">
                モジュールを分けて入れても、HANA でデータは1つにつながるんですね。バラバラなのに実はつながっている。
              </Dialog>
              <Callout variant="note">
                会話で「SD の話」と言われたら<strong>業務層</strong>、「テーブル設計」と言われたら<strong>データ層</strong>、
                「画面が重い」と言われたら<strong>システム層（UI）</strong>、と切り分けると迷いません。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SD（販売管理）は主にどの層？→ 業務層\nQ2 データ層の中心は？→ SAP HANA\n今日のひとこと：「どの層の話か」が言えると、現場の会話がすっきりします。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="FI / SD / MM などは業務（機能）モジュールであり、業務層に属します。"
                question={<strong>「SD（販売管理）」は主にどの層の話？</strong>}
                options={["データ層のみ", "システム層のみ", "業務層"]}
              />
              <Quiz
                answer={0}
                explanation="SAP HANA は統合データベースとして、業務データを一元的に保持するデータ層の中心です。"
                question={<strong>データ層の中心として説明されるのは？</strong>}
                options={["SAP HANA", "Microsoft Excel", "SAP GUI だけ"]}
              />
              <Dialog speaker="closing">
                「どの層の話か」が言えると、現場の会話がすっきりします。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ThreeLayersLesson);
