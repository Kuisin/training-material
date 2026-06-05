import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "データ設計 — DDIC・アドオンテーブル・DB更新",
  meta: "初学者 · 25分",
};

export default function DataDesignLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "12-data-design", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "データ設計 — DDIC・アドオンテーブル・DB更新\n取込履歴やエラー記録を支えるテーブル設計とDB更新の知識。設計書のテーブル定義が読めることを目指す。",
          content: (
            <>
              <hgroup>
                <h1>データ設計の知識</h1>
                <p>
                  連携プログラムを支える<strong>アドオンテーブル</strong>と、
                  履歴を書き込むための<strong>DB更新</strong>の型を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>ドメイン → データエレメント → テーブルの作成順と役割</li>
                <li>履歴テーブルの主キー設計と「なぜ履歴を残すか」</li>
                <li>INSERT / COMMIT / ROLLBACK の考え方</li>
              </ul>
              <Callout variant="note">
                会計伝票<strong>本体</strong>（BKPF/BSEG）は BAPI で更新します。
                この章で扱う直接更新は、<strong>自社の履歴・管理用テーブル</strong>向けです。
              </Callout>
            </>
          ),
        },
        {
          title: "名札のたとえ",
          plainText:
            "DDIC — 名札を先に決める\nドメイン=型と桁、データエレメント=意味とラベル、テーブル=実データ。技術属性と意味を分離する。",
          content: (
            <>
              <h2>名札のたとえ — ドメイン・データエレメント・テーブル</h2>
              <p>
                ABAP Dictionary（<code>SE11</code>）では、テーブルを作る前に
                <strong>型</strong>と<strong>意味</strong>を分けて定義します。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  D[ドメイン] --> E[データエレメント]
  E --> T[テーブル]`}
              />
              <InfoPanel title="3つのオブジェクト" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>オブジェクト</th>
                      <th>役割</th>
                      <th>たとえ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ドメイン</td>
                      <td>データ型・桁数・値の範囲</td>
                      <td>名札の<strong>サイズと形式</strong>（10文字・数値など）</td>
                    </tr>
                    <tr>
                      <td>データエレメント</td>
                      <td>項目の意味・画面ラベル</td>
                      <td>名札に書く<strong>日本語の項目名</strong></td>
                    </tr>
                    <tr>
                      <td>テーブル</td>
                      <td>実際のデータを保持</td>
                      <td>データを入れる<strong>棚・箱</strong></td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                いきなりテーブルから作らないんですね。型と意味を先に決める理由は何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                同じ「会社コード」を複数テーブルで使うとき、<strong>1か所で型と意味を揃えられる</strong>からです。
                あとから桁数を変える手間も減ります。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜこの順番",
          plainText:
            "作成順を守る理由\nドメイン→DE→テーブル。設計書の項目定義がこの順で読める。",
          content: (
            <>
              <h2>なぜこの順番で作るか</h2>
              <ol>
                <li><strong>ドメイン</strong> … 「何文字の文字列か」「何桁の数値か」を決める</li>
                <li><strong>データエレメント</strong> … 「この項目は何を表すか」を決める</li>
                <li><strong>テーブル</strong> … データエレメントを並べて、主キーを決める</li>
              </ol>
              <Dialog speaker="a">
                設計書に「ZIFLOG-FILE_ID: CHAR20」と書いてあっても、
                裏ではドメインとデータエレメントが支えている、と理解すればよさそうですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。詳しい <code>SE11</code> 操作は開発ツールの章を参照できます。
                ここでは<strong>設計書の読み方</strong>が目的です。
              </Dialog>
            </>
          ),
        },
        {
          title: "履歴テーブル",
          plainText:
            "履歴テーブルの役割\nなぜ履歴を残すか：二重登録防止・結果追跡・運用調査。ZIFLOG想定。主キーで重複防止、照会用項目。",
          content: (
            <>
              <h2>履歴テーブル — なぜ残すのか</h2>
              <p>
                標準の BKPF/BSEG には「いつ・どのファイルから取り込んだか」は載りません。
                連携専用の<strong>アドオンテーブル</strong>（例: <code>ZIFLOG</code>）に、取込結果を残します。
              </p>
              <ul>
                <li><strong>二重登録防止</strong> … 同じファイル・同じ行を再処理しない</li>
                <li><strong>結果の追跡</strong> … OK/NG・伝票番号・エラーメッセージ</li>
                <li><strong>運用調査</strong> … 「昨日の夜間バッチは何件失敗したか」</li>
              </ul>
              <Dialog speaker="b">
                伝票自体は BAPI で登録されるのに、わざわざ別テーブルに残すのは面倒に見えます…。
              </Dialog>
              <Dialog speaker="teacher">
                運用では「登録できたか」「なぜ失敗したか」を後から調べる必要が必ず出ます。
                履歴がないと、<strong>同じファイルを再実行して二重登録</strong>するリスクも高まります。
              </Dialog>
            </>
          ),
        },
        {
          title: "主キー設計",
          plainText:
            "主キー設計\nファイルID+行番号などで重複防止。照会しやすい項目（日時・ステータス）も設計に含める。",
          content: (
            <>
              <h2>主キー設計 — 重複を防ぐ組み合わせ</h2>
              <InfoPanel title="設計の例（架空）" variant="reference">
                <ul>
                  <li>
                    <strong>主キー</strong> … <code>file_id</code> + <code>row_no</code>
                    （同じファイルの同じ行は1回だけ処理）
                  </li>
                  <li>
                    <strong>照会用</strong> … <code>run_date</code>, <code>status</code>, <code>belnr</code>, <code>msg_text</code>
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                主キーは「この組み合わせなら1行だけ」と決める錠前みたいなものですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。設計書で主キー欄を見たら、「何の重複を防いでいるか」を読み取る習慣をつけましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "DB更新の基礎",
          plainText:
            "DB更新 — INSERT/UPDATE/MODIFY/DELETE\n履歴テーブルへの書き込み。伝票本体はBAPI経由。",
          content: (
            <>
              <h2>DB更新の基礎</h2>
              <CodeBlock
                language="ABAP"
                code={`" 履歴1件を追加
INSERT zif_hist FROM ls_hist.

" 既存行を更新
UPDATE zif_hist FROM ls_hist.

" あれば更新、なければ追加
MODIFY zif_hist FROM ls_hist.

" 条件に合う行を削除
DELETE FROM zif_hist WHERE file_id = lv_file_id.`}
              />
              <InfoPanel title="命令の使い分け（概要）" variant="breakdown">
                <ul>
                  <li><code>INSERT</code> … 新規行を1件追加</li>
                  <li><code>UPDATE</code> … 既存行を上書き（主キーが一致する行）</li>
                  <li><code>MODIFY</code> … あれば更新、なければ追加</li>
                  <li><code>DELETE</code> … 条件に合う行を削除</li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "トランザクション",
          plainText:
            "COMMIT / ROLLBACK\n成功時に確定、失敗時に取り消し。エラー時にどうするかを設計に含める。",
          content: (
            <>
              <h2>トランザクション — COMMIT / ROLLBACK</h2>
              <CodeBlock
                language="ABAP"
                code={`" 更新を DB に反映
COMMIT WORK.

" まとめて取り消す
ROLLBACK WORK.`}
              />
              <Dialog speaker="teacher">
                履歴の書き込みも、<strong>いつ確定するか</strong>を設計します。
                伝票登録（BAPI）の成功・失敗が分かってから履歴に書く、のが一般的な型です。
              </Dialog>
              <Dialog speaker="b">
                エラーが出たときは <code>ROLLBACK</code> して、中途半端な状態を残さないんですね。
              </Dialog>
              <Dialog speaker="stumble">
                <code>COMMIT</code> し忘れると、プログラム上は成功に見えても DB に残らないことがあります。
                登録処理では「確定まで含めて1セット」と覚えましょう。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="13-function-modules"
                label="次へ: 汎用モジュール"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 DDICの作成順は？→ ドメイン→データエレメント→テーブル\nQ2 履歴テーブルの主な目的は？→ 二重登録防止と結果追跡\nQ3 伝票本体の更新は？→ BAPI経由（直接INSERTは不可）",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="ABAP Dictionary では、型（ドメイン）と意味（データエレメント）を先に定義し、最後にテーブルに項目として載せます。この順序を守ると設計の一貫性が保たれます。"
                question={<strong>DDIC でテーブルを作るときの基本的な順序は？</strong>}
                options={[
                  "テーブル → ドメイン → データエレメント",
                  "データエレメント → テーブル → ドメイン",
                  "ドメイン → データエレメント → テーブル",
                ]}
              />
              <Quiz
                answer={0}
                explanation="履歴テーブルは、取込の成功・失敗や伝票番号を記録し、同じデータの二重処理を防ぐために使います。運用時の調査にも欠かせません。"
                question={<strong>連携用の履歴テーブルの主な目的は？</strong>}
                options={[
                  "二重登録の防止と処理結果の追跡",
                  "画面の色を変える",
                  "BKPF を置き換える",
                ]}
              />
              <Quiz
                answer={1}
                explanation="会計伝票本体は整合性を保つため BAPI など公式ルートで更新します。アドオンテーブル（履歴・エラー記録）への INSERT 等は、自社管理用データ向けです。"
                question={<strong>会計伝票本体（BKPF/BSEG）の更新として正しいのは？</strong>}
                options={[
                  "プログラムから直接 INSERT する",
                  "BAPI など SAP 公式の手段を使う",
                  "履歴テーブルだけ更新すればよい",
                ]}
              />
              <Dialog speaker="closing">
                設計書のテーブル定義が、だいぶ読めるようになったはずです。次は、検証や履歴登録を共通化する汎用モジュールです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(DataDesignLesson);
