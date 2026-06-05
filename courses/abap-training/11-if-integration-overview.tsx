import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "IF連携の全体像 — 業務シナリオとシステム構成",
  meta: "初学者 · 20分",
};

export default function IfIntegrationOverviewLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "11-if-integration-overview", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "IF連携の全体像 — 業務シナリオとシステム構成\n会計伝票登録IFに取り組むうえで必要な知識の入口。IF開発・BAPI・DB設計・品質を一連の流れとして理解します。\n⏱ 20分 / 📶 初学者\n手を動かす演習は別資料。ここでは設計書やコードが読める土台を作ります。",
          content: (
            <>
              <hgroup>
                <h1>IF連携の全体像</h1>
                <p>
                  会計伝票登録のファイル連携に取り組むうえで必要な知識の入口です。
                  <strong>IF開発・BAPI・DB設計・品質改善</strong>を、一連の流れとして捉えます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>外部システムから SAP へ会計データを連携する典型的な業務</li>
                <li>なぜ標準画面（FB01）ではなくプログラム化するのか</li>
                <li>入力・処理・出力が1本のレポートで完結する構成</li>
              </ul>
              <Callout variant="note">
                実際に手を動かす演習は<strong>別資料</strong>で行います。
                本コースでは、設計書や既存コードを読み解くための知識を学びます。
              </Callout>
            </>
          ),
        },
        {
          title: "講義ゴール",
          plainText:
            "会計伝票登録を題材に4つの知識領域\nIF開発（ファイル連携）/ SAP標準（BAPI）/ DB設計・更新 / 品質改善（性能・可読性）。これらがつながった1本の処理として理解する。",
          content: (
            <>
              <h2>会計伝票登録で押さえる4つの知識</h2>
              <InfoPanel title="講義ゴール（到達イメージ）" variant="reference">
                <ul>
                  <li>
                    <strong>IF開発（ファイル連携）</strong> … サーバファイルの読込と行データの分解
                  </li>
                  <li>
                    <strong>SAP標準（BAPI）</strong> … 伝票を公式ルートで登録する型
                  </li>
                  <li>
                    <strong>DB設計・更新</strong> … 履歴テーブルとトランザクションの考え方
                  </li>
                  <li>
                    <strong>品質改善</strong> … 性能と可読性（長く使えるコード）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                バラバラの用語に見えても、実務では<strong>1本の連携プログラム</strong>に全部つながっています。
                この章から順に知識を積み上げていきましょう。
              </Dialog>
              <Dialog speaker="a">
                「読める・説明できる」がゴールなんですね。コードをゼロから書くというより、設計の型が分かれば十分、と理解しました。
              </Dialog>
            </>
          ),
        },
        {
          title: "業務シナリオ",
          plainText:
            "業務シナリオ — 外部システムからSAPへ\n外部で作った会計データをSAPへ自動登録。履歴管理で二重登録防止、エラー内容の保持。なぜFB01画面ではなくプログラム化するか（夜間・大量・再実行）。",
          content: (
            <>
              <h2>業務シナリオ — 外部システムから SAP へ</h2>
              <p>
                実務でよくあるのは、<strong>外部システムで作った会計データを SAP に自動登録する</strong>ケースです。
                人が1件ずつ FB01 で入力するのではなく、夜間や定時にバッチでまとめて処理します。
              </p>
              <ul>
                <li>外部ファイル（または連携データ）を SAP へ取り込む</li>
                <li>会計伝票を BAPI など公式ルートで登録する</li>
                <li><strong>履歴</strong>を残し、二重登録を防ぐ</li>
                <li>エラー内容を保持し、運用者が追えるようにする</li>
              </ul>
              <Dialog speaker="b">
                毎回 FB01 で手入力すればいいのに、わざわざプログラムにする理由って何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                件数が多い・夜間にまとめて処理したい・同じ手順を何度も繰り返す、といったときは
                <strong>プログラム化</strong>が現実的です。これが「IFバッチ開発」の典型パターンです。
              </Dialog>
              <Dialog speaker="stumble">
                画面操作をそのまま真似するだけでは足りません。履歴やエラー管理まで含めて設計するのが連携の型です。
              </Dialog>
            </>
          ),
        },
        {
          title: "IFバッチの典型",
          plainText:
            "IFバッチ開発の典型パターン\n定期実行・大量データ・結果の記録。照会レポート（前半）とは違い書き込みと重複防止まで設計に含める。",
          content: (
            <>
              <h2>IFバッチ開発の典型パターン</h2>
              <MermaidDiagram
                chart={`flowchart LR
  E[外部システム] --> F[サーバファイル]
  F --> P[ABAP連携プログラム]
  P --> S[SAP会計伝票]
  P --> H[履歴テーブル]
  P --> R[結果一覧]`}
              />
              <Dialog speaker="a">
                前半で学んだ照会レポートは「見るだけ」でしたが、ここからは「書き込む」＋「記録する」まで含むんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。連携は<strong>登録の責任</strong>が重いぶん、履歴・エラー・排他まで一式で設計します。
              </Dialog>
            </>
          ),
        },
        {
          title: "システム構成",
          plainText:
            "システム構成 — 入力・処理・出力\n入力=サーバファイル。処理=データ読込・伝票登録(BAPI)・履歴登録。出力=結果一覧。",
          content: (
            <>
              <h2>システム構成 — 入力・処理・出力</h2>
              <InfoPanel title="構成の3層" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>層</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>入力</strong></td>
                      <td>サーバ上のファイル（論理ファイル名で参照）</td>
                    </tr>
                    <tr>
                      <td><strong>処理</strong></td>
                      <td>データ読込 → 検証 → BAPI 登録 → 履歴登録</td>
                    </tr>
                    <tr>
                      <td><strong>出力</strong></td>
                      <td>処理結果一覧（成功件数・エラー内容・伝票番号など）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                第1章の「入力→取得→加工→出力」の型と似てますね。中身が「登録」になっただけ、と捉えればよさそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "1レポートで完結",
          plainText:
            "1つのレポートで業務が完結\nファイル読込から結果表示まで1プログラム。順序：取込→検証→ロック→BAPI→コミット→履歴。",
          content: (
            <>
              <h2>1つのレポートで業務が完結する</h2>
              <p>
                連携登録は、ファイルの読込から結果の記録・表示まで、
                <strong>1本のレポートプログラム</strong>として設計されることが多いです。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  A[ファイル取込] --> B[行の検証]
  B --> C[排他ロック]
  C --> D[BAPI 登録]
  D --> E[コミット/ロールバック]
  E --> F[履歴・結果記録]`}
              />
              <Dialog speaker="teacher">
                この縦の流れは、これから順に学ぶ知識がすべて並んでいます。
                最後の章で、もう一度この地図に戻ってきます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="12-data-design"
                label="次へ: データ設計"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：IF連携は外部→SAPの自動登録。FB01手入力ではなくバッチ化する典型。1レポートで取込から履歴まで完結。\nBちゃん：演習は別資料、ここは知識の土台。\nAくん：4テーマが1本の処理に並ぶ。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の芯は2つです。<strong>なぜプログラム化するか</strong>と、
                <strong>1本の処理で何が起きるか</strong>。用語はこれから増えますが、地図はこの2点に戻れば大丈夫です。
              </Dialog>
              <Dialog speaker="b">
                演習は別資料なので、ここでは焦らず「読めるようになる」ことだけ意識します。
              </Dialog>
              <Dialog speaker="a">
                IF・BAPI・DB・品質の4つが、縦に並んだ1本の処理だと分かりました。次はデータ設計ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 IF連携で履歴を残す主な理由は？→ 二重登録防止と結果の追跡\nQ2 典型的な入力は？→ サーバ上のファイル\nQ3 本コースの到達イメージは？→ 設計書やコードの型が読める",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="履歴テーブルは、同じデータの二重登録を防ぎ、処理結果（成功・失敗・伝票番号）を後から追えるようにするために使います。"
                question={<strong>IF連携で履歴を残す主な理由は？</strong>}
                options={[
                  "画面を見やすくするため",
                  "二重登録を防ぎ、結果を追跡するため",
                  "SELECT を速くするため",
                ]}
              />
              <Quiz
                answer={0}
                explanation="IF連携の典型的な入力は、外部システムから配置されたサーバ上のファイルです。論理ファイル名で参照する設計が一般的です。"
                question={<strong>IF連携プログラムの典型的な入力は？</strong>}
                options={[
                  "サーバ上のファイル",
                  "ユーザがFB01で手入力した画面データ",
                  "PCからのメール添付のみ",
                ]}
              />
              <Quiz
                answer={2}
                explanation="本コースは演習の手順ではなく、設計書や既存コードを読み解くための知識を学びます。実際のコーディング演習は別資料で行います。"
                question={<strong>本コース（知識編）の到達イメージとして正しいのは？</strong>}
                options={[
                  "すべての演習をこのコース内で完了する",
                  "FB01の操作手順を暗記する",
                  "設計の型やコードの意図が読める・説明できる",
                ]}
              />
              <Dialog speaker="closing">
                地図ができました。次は、履歴を支えるデータ設計の知識に進みましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IfIntegrationOverviewLesson);
