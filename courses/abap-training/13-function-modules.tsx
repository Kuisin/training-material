import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "汎用モジュール — 再利用設計と部品の確認",
  meta: "初学者 · 25分",
};

export default function FunctionModulesLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "13-function-modules", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "汎用モジュール — 再利用設計と部品の確認\n共通処理の部品化、IMPORT/EXPORT/例外、SE37での確認の考え方。FORMとの違い。",
          content: (
            <>
              <hgroup>
                <h1>汎用モジュールの知識</h1>
                <p>
                  検証や履歴登録など、複数プログラムで使う処理を<strong>部品化</strong>する考え方と、
                  その<strong>呼び出し方・確認の仕方</strong>を学びます。
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
                <li>汎用モジュール（Function Module）と <code>FORM</code> の違い</li>
                <li><code>IMPORT</code> / <code>EXPORT</code> / 例外と <code>sy-subrc</code></li>
                <li>部品を <code>SE37</code> で確認する考え方（正常系・異常系）</li>
              </ul>
            </>
          ),
        },
        {
          title: "FORMとの違い",
          plainText:
            "汎用モジュールとは\nFORM=1冊のノート内の章。FM=図書館の共有本。他プログラムからCALL FUNCTIONで呼ぶ。",
          content: (
            <>
              <h2>汎用モジュールとは — <code>FORM</code> との違い</h2>
              <InfoPanel title="比較" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th><code>FORM</code> / <code>PERFORM</code></th>
                      <th>汎用モジュール</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>スコープ</td>
                      <td>同じプログラム内</td>
                      <td><strong>プログラムをまたいで</strong>利用可能</td>
                    </tr>
                    <tr>
                      <td>呼び出し</td>
                      <td><code>PERFORM</code></td>
                      <td><code>CALL FUNCTION</code></td>
                    </tr>
                    <tr>
                      <td>たとえ</td>
                      <td>1冊のノートの中の章</td>
                      <td>図書館の<strong>共有の参考書</strong></td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                第10章の <code>FORM</code> を、他のプログラムからも使いたいときが汎用モジュール、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。連携では「行の検証」「履歴の記録」を複数のプログラムで共通化することが多いです。
              </Dialog>
            </>
          ),
        },
        {
          title: "IF設計",
          plainText:
            "IF設計 — IMPORT/EXPORT/CHANGING/EXCEPTIONS\n入力・出力・例外。sy-subrcで成否判定。戻り値と例外の使い分け。\nインターフェースとは：部品の「入力・出力・例外の約束ごと（仕様）」のこと。中身の作りを知らなくても、この約束さえ分かれば呼び出せる。\nQ(B): 表ではIMPORTが入力なのに、コードではEXPORTINGで入力を渡しているのは逆では？\nA(先生): パラメータ種別の名前（IMPORT/EXPORT）は「部品（モジュール）から見た向き」。CALL FUNCTION文のEXPORTING/IMPORTINGは「呼び出し側から見た向き」。呼び出し側がEXPORTING（送り出す）した値を、部品がIMPORT（受け取る）。だから〈呼ぶ側のEXPORTING〉と〈部品のIMPORT〉がペア、〈呼ぶ側のIMPORTING〉と〈部品のEXPORT〉がペア。視点が逆なだけで矛盾していない。\nA(A): 「誰から見た向きか」をそろえれば迷わない。",
          content: (
            <>
              <h2>インターフェース設計 — 引数と例外</h2>
              <Callout variant="note">
                <strong>インターフェース</strong>とは、部品の「入力・出力・例外の約束ごと（仕様）」のことです。
                中身の作りを知らなくても、この約束さえ分かれば呼び出せます。
              </Callout>
              <InfoPanel title="パラメータの種別" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>種別</th>
                      <th>方向</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>IMPORT</code></td>
                      <td>呼び出し側 → 部品</td>
                      <td>入力データ</td>
                    </tr>
                    <tr>
                      <td><code>EXPORT</code></td>
                      <td>部品 → 呼び出し側</td>
                      <td>結果・メッセージ</td>
                    </tr>
                    <tr>
                      <td><code>CHANGING</code></td>
                      <td>双方向</td>
                      <td>渡した値を書き換えて返す</td>
                    </tr>
                    <tr>
                      <td><code>EXCEPTIONS</code></td>
                      <td>エラー種別</td>
                      <td>呼び出し側で <code>sy-subrc</code> を確認</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`CALL FUNCTION 'Z_CHECK_INVOICE_ROW'
  EXPORTING
    is_row = ls_row
  IMPORTING
    ev_ok  = lv_ok
    ev_msg = lv_msg
  EXCEPTIONS
    invalid_format = 1
    OTHERS         = 2.

IF sy-subrc <> 0.
  " 例外が発生 → 登録せずエラー処理
ENDIF.`}
              />
              <Dialog speaker="b">
                あれ？表では <code>IMPORT</code> が入力なのに、コードでは <code>EXPORTING</code> で入力を渡しているのは逆では？
              </Dialog>
              <Dialog speaker="teacher">
                よい気づきです。パラメータ種別の名前（<code>IMPORT</code> / <code>EXPORT</code>）は
                「<strong>部品（モジュール）から見た向き</strong>」です。
                一方 <code>CALL FUNCTION</code> 文の <code>EXPORTING</code> / <code>IMPORTING</code> は
                「<strong>呼び出し側から見た向き</strong>」です。
                呼び出し側が <code>EXPORTING</code>（送り出す）した値を、部品が <code>IMPORT</code>（受け取る）。
                だから〈呼ぶ側の <code>EXPORTING</code>〉と〈部品の <code>IMPORT</code>〉がペア、
                〈呼ぶ側の <code>IMPORTING</code>〉と〈部品の <code>EXPORT</code>〉がペアになります。
                視点が逆なだけで、矛盾していません。
              </Dialog>
              <Dialog speaker="a">
                「誰から見た向きか」をそろえれば迷わない、ということですね。
              </Dialog>
              <Dialog speaker="a">
                <code>EXPORT</code> で結果を受け取るパターンと、<code>EXCEPTIONS</code> で
                「失敗した種類」を <code>sy-subrc</code> で見るパターン、両方ありますね。
              </Dialog>
              <Dialog speaker="teacher">
                設計書を読むときは、「正常時はどの EXPORT を見るか」「異常時はどの EXCEPTION か」を
                セットで確認する習慣をつけましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "戻り値と例外",
          plainText:
            "戻り値と例外の使い分け\nビジネス結果はEXPORT、致命的エラーはEXCEPTIONS。sy-subrcは直前のCALL FUNCTIONの結果。",
          content: (
            <>
              <h2>戻り値と例外の使い分け</h2>
              <ul>
                <li>
                  <strong>ビジネス上の結果</strong>（OK/NG・メッセージ）… 多くは <code>EXPORT</code> や <code>CHANGING</code> で返す
                </li>
                <li>
                  <strong>呼び出し自体の失敗</strong>（形式不正・重複など）… <code>EXCEPTIONS</code> + <code>sy-subrc</code>
                </li>
              </ul>
              <Dialog speaker="stumble">
                BAPI では <code>RETURN</code> テーブルも見る、と第15章で出てきます。
                汎用モジュールでも「<code>sy-subrc</code> だけ見て安心」は禁物です。設計書の戻り方を確認しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "SE37で確認",
          plainText:
            "SE37で部品を確認する\n正常系：期待どおりの入力→期待どおりの出力。異常系：わざと不正入力→例外やエラーメッセージ。再利用するからこそテスト重視。",
          content: (
            <>
              <h2><code>SE37</code> で部品を確認する考え方</h2>
              <p>
                汎用モジュールは<strong>何度も再利用</strong>されます。1か所の不具合が複数プログラムに波及するため、
                部品単位での確認が重要です（詳しい画面操作は開発ツールの章を参照）。
              </p>
              <InfoPanel title="確認の2パターン" variant="reference">
                <ul>
                  <li>
                    <strong>正常系</strong> … 正しい入力を渡し、期待どおりの <code>EXPORT</code> / <code>ev_ok = abap_true</code> になるか
                  </li>
                  <li>
                    <strong>異常系</strong> … 必須項目欠落・形式不正などを渡し、
                    <code>EXCEPTIONS</code> やエラーメッセージが期待どおり返るか
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                「再利用するからこそテストを重視する」。全体のプログラムを動かす前に、
                部品が単体で正しいかを確かめるのが実務の近道です。
              </Dialog>
              <Dialog speaker="b">
                実際に <code>SE37</code> を触らなくても、ここでは「何を確認すべきか」が分かればOK、ですね。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="a1-sap-development-tools"
                slide={12}
                label="参考: 開発ツール（SE37）"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "呼び出し例",
          plainText:
            "連携での利用例\nZ_CHECK_INVOICE_ROWで行検証、Z_LOG_INTERFACE_RESULTで履歴。CALL FUNCTIONの形はBAPIと同じ。",
          content: (
            <>
              <h2>連携プログラムでの利用例</h2>
              <CodeBlock
                language="ABAP"
                code={`" 行の検証（汎用モジュール）
CALL FUNCTION 'Z_CHECK_INVOICE_ROW'
  EXPORTING is_row = ls_row
  IMPORTING ev_ok = lv_ok ev_msg = lv_msg.

" 履歴登録（汎用モジュール）
CALL FUNCTION 'Z_LOG_INTERFACE_RESULT'
  EXPORTING
    is_key    = ls_key
    iv_status = 'OK'
    iv_belnr  = lv_belnr
  EXCEPTIONS
    duplicate = 1
    OTHERS    = 2.`}
              />
              <Dialog speaker="a">
                BAPI も <code>CALL FUNCTION</code> ですね。形が同じなので、設計書の読み方も通じます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="14-files-jobs-and-batch"
                label="次へ: ファイル連携"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 FMの呼び出しは？→ CALL FUNCTION\nQ2 IMPORTの意味は？→ 呼び出し側から部品へ渡す入力\nQ3 部品確認で重要な考え方は？→ 正常系と異常系の両方を確かめる",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="汎用モジュールは CALL FUNCTION で呼び出します。BAPI も同じ形式です。FORM は PERFORM で呼び出します。"
                question={<strong>汎用モジュールを呼び出す命令は？</strong>}
                options={["CALL FUNCTION", "PERFORM", "SELECT"]}
              />
              <Quiz
                answer={2}
                explanation="IMPORT は呼び出し側から汎用モジュールへ値を渡すパラメータです。EXPORT は逆方向、CHANGING は入出力両方です。"
                question={<strong><code>IMPORT</code> パラメータの意味は？</strong>}
                options={[
                  "部品から呼び出し側へ結果を返す",
                  "DBからデータを取得する",
                  "呼び出し側から部品へ入力を渡す",
                ]}
              />
              <Quiz
                answer={1}
                explanation="再利用される部品は、正しい入力での動作（正常系）と、不正入力でのエラー処理（異常系）の両方を確認します。これが連携品質の土台になります。"
                question={<strong>汎用モジュールを確認するときの重要な考え方は？</strong>}
                options={[
                  "正常系だけ見れば十分",
                  "正常系と異常系の両方を確かめる",
                  "呼び出し元のプログラムだけテストすればよい",
                ]}
              />
              <Dialog speaker="closing">
                部品化の知識が揃いました。次は、ファイルをどう読み込むか — ファイル連携の章です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FunctionModulesLesson);
