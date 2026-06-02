import {
  Lesson,
  Callout,
  Dialog,
  CodeBlock,
  InfoPanel,
  Reveal,
  LessonQuiz,
  MermaidDiagram,
  LessonMeta,
  LessonLinkButton,
  SapErdDiagram,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "特別演習 — 仕訳日記帳プログラムを作る",
  meta: "特別 · 45分",
};

/** 各ステップ共通の「ブレークポイントで確認」ブロック。 */
function BreakPointCheck({
  insert,
  ask,
  reveal,
}: {
  insert: string;
  ask: React.ReactNode;
  reveal: React.ReactNode;
}) {
  return (
    <>
      <Callout variant="note">
        <strong>🔴 ブレークポイントで確認</strong>
        <br />
        次の <code>BREAK-POINT.</code> を一時的に差し込んで実行し、デバッガで変数の中身を確認します。
      </Callout>
      <CodeBlock language="ABAP" code={insert} />
      <Dialog speaker="teacher">{ask}</Dialog>
      <Reveal label="期待される結果を見る">
        <InfoPanel title="デバッガで見えるはず" variant="reference">
          {reveal}
        </InfoPanel>
      </Reveal>
    </>
  );
}

export default function ExerciseJournalLedgerLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "92-exercise-journal-ledger",
        lessonMeta.title
      )}
      slides={[
        {
          title: "演習の概要",
          plainText:
            "特別演習 — 仕訳日記帳プログラムを作る\nコース完了者・パスワード保持者向けの実践演習。入力→取得→加工→出力の流れを、6ステップで1本のレポートに組み立てます。\n各ステップでBREAK-POINTを差し込み、変数が想定どおり動いているかをデバッガで確認します。最後に単体テストと機能テストを行います。",
          content: (
            <>
              <hgroup>
                <h1>特別演習 — 仕訳日記帳プログラムを作る</h1>
                <p>
                  会計伝票ヘッダ（BKPF）を読み取り、
                  <strong>仕訳日記帳</strong>として一覧出力するレポートを、6ステップで組み立てます。
                  SE38 で任意のプログラム名（例：<code>z_journal_ledger</code>）を付けて作成してください。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "45分" },
                  { icon: "⭐", text: "特別演習" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Callout variant="tip">
                このページはコース完了
                <strong>かつ</strong>パスワードで解放される特別コンテンツです。
                手を動かして、1本のプログラムを最後まで作り切りましょう。
              </Callout>
              <h3>この演習の進め方</h3>
              <ul>
                <li>6つのステップで、少しずつコードを書き足していきます</li>
                <li>
                  各ステップの最後に <code>BREAK-POINT.</code>{" "}
                  を差し込み、変数が想定どおりかをデバッガで確認します
                </li>
                <li>
                  最後に <strong>単体テスト</strong>（部品ごと）と{" "}
                  <strong>機能テスト</strong>（通し）で品質を確かめます
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "全体像",
          plainText:
            "全体像 — 入力→取得→加工→出力\nステップ1 ヘッダ作成（REPORT・TOP-OF-PAGE・システム値）\nステップ2 入力画面（PARAMETERS・SELECT-OPTIONS）\nステップ3 型と変数の準備（TYPES・DATA）\nステップ4 SELECTでデータ取得\nステップ5 データ加工（READ TABLE・SORT）\nステップ6 画面に表示（END-OF-SELECTION・LOOP・WRITE）",
          content: (
            <>
              <h2>全体像 — 6ステップで組み立てる</h2>
              <p>
                ABAPレポートは「処理ブロック」を並べて作ります。今回作るブロックの並びは次のとおりです。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  S1["① ヘッダ作成<br/>REPORT / TOP-OF-PAGE"] --> S2["② 入力画面<br/>PARAMETERS / SELECT-OPTIONS"]
  S2 --> S3["③ 型と変数<br/>TYPES / DATA"]
  S3 --> S4["④ データ取得<br/>SELECT ... FROM bkpf"]
  S4 --> S5["⑤ データ加工<br/>READ TABLE / SORT"]
  S5 --> S6["⑥ 画面表示<br/>END-OF-SELECTION / LOOP / WRITE"]`}
              />
              <InfoPanel title="完成形のイメージ" variant="reference">
                <ul>
                  <li>会社コードと転記日付の範囲を入力して実行</li>
                  <li>BKPFから該当伝票ヘッダを取得し、日付・伝票番号で並べ替え</li>
                  <li>ページ上部に共通ヘッダ、本体に明細を整列して出力</li>
                  <li>
                    <code>p_demo</code>{" "}
                    にチェックを入れると、DBを使わずデモ2行で動作確認できる
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                いきなり全部は書きません。1ブロックずつ「書く →
                ブレークポイントで確認」を繰り返します。これが一番ミスに気づきやすい進め方です。
              </Dialog>
            </>
          ),
        },
        {
          title: "① ヘッダ作成",
          plainText:
            "ステップ1 ヘッダ作成（練習WRITE：定数→システム値）\nREPORT文でプログラム属性を宣言し、TOP-OF-PAGEでページ共通ヘッダをWRITEする。定数の見出し（'PGMID:'など）とシステム値（sy-cprog, sy-uname, sy-datum, sy-uzeit, sy-pagno）を組み合わせる。\nブレークポイント：START-OF-SELECTIONの先頭にBREAK-POINTを置き、sy-cprog/sy-uname/sy-datum/sy-uzeitに値が入っているか確認する。",
          content: (
            <>
              <h2>① ヘッダ作成 — 定数とシステム値でWRITE</h2>
              <p>
                まずプログラムの「枠」を作ります。<code>REPORT</code>{" "}
                文で属性を宣言し、<code>TOP-OF-PAGE</code>{" "}
                で全ページ共通のヘッダを出力します。見出しの文字は
                <strong>定数（リテラル）</strong>、日付やユーザは
                <strong>システム値</strong>です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`REPORT z_journal_ledger
  NO STANDARD PAGE HEADING
  MESSAGE-ID z01        " メッセージクラス（SE91で文言を登録）
  LINE-SIZE 170
  LINE-COUNT 58.

TOP-OF-PAGE.
  WRITE: /1  'PGMID:' NO-GAP,
           9  sy-cprog,
           155 'DATE:' NO-GAP,
           160(10)  sy-datum RIGHT-JUSTIFIED,
         /1  'USER:'  NO-GAP,
           9  sy-uname,
           155 'TIME:' NO-GAP,
           160(10)  sy-uzeit RIGHT-JUSTIFIED,
         /70(30) '仕訳日記帳' CENTERED,
           155 'PAGE:' NO-GAP,
           160(10)  sy-pagno RIGHT-JUSTIFIED NO-SIGN.
  SKIP 1.
  ULINE.`}
              />
              <Callout variant="note">
                <strong>「動いていない」ように見えても、ここは仕様どおりです（エラーではありません）。</strong>
                <br />
                この時点のコードはヘッダ定義の学習が目的で、明細を出す処理はまだ未実装です。
                そのため、条件によっては <code>TOP-OF-PAGE</code> が表示されず、
                「コードが動かない」ように見えることがありますが正常です。
              </Callout>
              <InfoPanel title="この行たちの意味" variant="breakdown">
                <ul>
                  <li>
                    <code>MESSAGE-ID z01</code> — デフォルトのメッセージクラス。
                    後述の <code>MESSAGE s000.</code> は SE91 で登録した文言が画面に出る
                  </li>
                  <li>
                    <code>NO STANDARD PAGE HEADING</code> — 標準ヘッダを止め、
                    <code>TOP-OF-PAGE</code> で自前のヘッダを出す
                  </li>
                  <li>
                    <code>'PGMID:'</code> などの引用符付きは{" "}
                    <strong>定数（固定の見出し）</strong>
                  </li>
                  <li>
                    <code>sy-cprog</code>=プログラム名 / <code>sy-uname</code>
                    =ユーザ / <code>sy-datum</code>=日付 / <code>sy-uzeit</code>
                    =時刻 / <code>sy-pagno</code>=ページ番号
                  </li>
                  <li>
                    <code>/</code>=改行、<code>NO-GAP</code>=直後と詰める、
                    <code>RIGHT-JUSTIFIED</code>=右寄せ
                  </li>
                </ul>
              </InfoPanel>
              <BreakPointCheck
                insert={`START-OF-SELECTION.
  BREAK-POINT.        " ★確認用（あとで削除）
  WRITE: / 'header test'.`}
                ask={
                  <>
                    実行して止まったら、デバッガで <code>sy-cprog</code>・
                    <code>sy-uname</code>・<code>sy-datum</code>・
                    <code>sy-uzeit</code> を見てください。値は入っていますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>sy-cprog</code> = 自分が付けたプログラム名（例{" "}
                      <code>Z_JOURNAL_LEDGER</code>）
                    </li>
                    <li>
                      <code>sy-uname</code> = ログイン中のユーザ名
                    </li>
                    <li>
                      <code>sy-datum</code> = 当日（例 <code>20260601</code>）
                    </li>
                    <li>
                      <code>sy-uzeit</code> = 現在時刻（例 <code>135400</code>）
                    </li>
                    <li>
                      確認できたら <code>WRITE: / 'header test'.</code> と{" "}
                      <code>BREAK-POINT.</code> は削除します
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "② 入力画面",
          plainText:
            "ステップ2 データ入力画面（選択画面）\nPARAMETERSで会社コード（単一・必須）、SELECT-OPTIONSで転記日付（範囲・必須）、p_demoのチェックボックスを用意する。SELECT-OPTIONSの参照用にlv_budatを先に宣言する。\nブレークポイント：START-OF-SELECTION先頭で止め、p_bukrs・s_budat[]・p_demoに入力値が入っているか確認する。",
          content: (
            <>
              <h2>② 入力画面 — 条件を受け取る選択画面</h2>
              <p>
                次に、利用者が条件を入力する画面を作ります。単一値は{" "}
                <code>PARAMETERS</code>、範囲は <code>SELECT-OPTIONS</code>{" "}
                です。<code>SELECT-OPTIONS</code> は参照する変数が必要なので、
                <code>lv_budat</code> を先に宣言しておきます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA: lv_budat TYPE bkpf-budat.                 "S_BUDAT参照用

PARAMETERS:     p_bukrs TYPE t001-bukrs OBLIGATORY. "会社コード（単一）
SELECT-OPTIONS: s_budat FOR lv_budat OBLIGATORY. "転記日付（範囲）

PARAMETERS: p_demo AS CHECKBOX DEFAULT ''.          "デモ用スイッチ`}
              />
              <InfoPanel title="入力部品の選び方" variant="breakdown">
                <ul>
                  <li>
                    <code>PARAMETERS</code> … 1つの値（会社コードは1社だけ）
                  </li>
                  <li>
                    <code>SELECT-OPTIONS</code> … 範囲・複数（日付はFrom〜To）
                  </li>
                  <li>
                    <code>OBLIGATORY</code> … 必須入力。空のまま実行できない
                  </li>
                  <li>
                    <code>AS CHECKBOX</code> … ON/OFFのスイッチ（デモ切替）
                  </li>
                </ul>
              </InfoPanel>
              <BreakPointCheck
                insert={`START-OF-SELECTION.
  BREAK-POINT.        " ★確認用`}
                ask={
                  <>
                    環境に存在する会社コードと日付の範囲を入れて実行します。
                    <code>p_bukrs</code>・<code>s_budat[]</code>・
                    <code>p_demo</code> は入力どおりですか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>p_bukrs</code> = 入力した会社コード
                    </li>
                    <li>
                      <code>s_budat</code> = 1行（<code>sign=I</code>,{" "}
                      <code>option=BT</code>, <code>low</code>/<code>high</code>{" "}
                      に範囲）
                    </li>
                    <li>
                      <code>p_demo</code> = チェックなしなら空、ありなら{" "}
                      <code>X</code>
                    </li>
                    <li>
                      必須を空にすると、そもそも実行できない（
                      <code>OBLIGATORY</code> が効いている）
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "③ 型と変数",
          plainText:
            "ステップ3 テーブル型と変数の準備\nTYPESでヘッダ取得用の構造ty_bkpf_hdr（bukrs/blart/budat/bldat/belnr/usnam）を定義し、DATAで内部テーブルlt_bkpfと作業領域ls_bkpf、ヘッダ表示用のlv_start_date/lv_end_dateを宣言する。\nブレークポイント：宣言直後で止め、lt_bkpfが0行・各変数が初期値であることを確認する。",
          content: (
            <>
              <h2>③ 型と変数 — 入れ物を用意する</h2>
              <p>
                取得したデータを入れる「型」と「箱」を作ります。
                <code>TYPES</code> で<strong>構造（1行の形）</strong>を定義し、
                <code>DATA</code> で<strong>内部テーブル（複数行）</strong>と
                <strong>作業領域（1行）</strong>を宣言します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`TYPES:
  BEGIN OF ty_bkpf_hdr,
    bukrs TYPE bkpf-bukrs,   "会社コード
    blart TYPE bkpf-blart,   "伝票タイプ
    budat TYPE bkpf-budat,   "転記日付
    bldat TYPE bkpf-bldat,   "伝票日付
    belnr TYPE bkpf-belnr,   "会計伝票番号
    usnam TYPE bkpf-usnam,   "ユーザ名
  END OF ty_bkpf_hdr.

DATA: lt_bkpf TYPE STANDARD TABLE OF ty_bkpf_hdr,  "内部テーブル
      ls_bkpf TYPE ty_bkpf_hdr.                    "作業領域

DATA: lv_start_date TYPE bkpf-budat,   "ヘッダ表示用 開始日
      lv_end_date   TYPE bkpf-budat.   "ヘッダ表示用 終了日`}
              />
              <Callout variant="tip">
                <code>TYPE bkpf-bukrs</code>{" "}
                のように「テーブル-項目」で型を借りると、桁数や型がDB定義と必ず一致します。自分で桁数を決める必要はありません。
              </Callout>
              <BreakPointCheck
                insert={`START-OF-SELECTION.
  BREAK-POINT.        " ★確認用（取得前）`}
                ask={
                  <>
                    取得処理を書く前に止めます。<code>lt_bkpf</code>{" "}
                    は空（0行）、<code>ls_bkpf</code>・<code>lv_start_date</code>{" "}
                    は初期値になっていますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>lt_bkpf</code> = 0 行（テーブル表示で「行なし」）
                    </li>
                    <li>
                      <code>ls_bkpf</code> = 全項目が空
                    </li>
                    <li>
                      <code>lv_start_date</code> / <code>lv_end_date</code> ={" "}
                      <code>00000000</code>
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "④ データ取得",
          plainText:
            "ステップ4 SELECTでデータ取得\nSTART-OF-SELECTIONでCLEAR後、p_demo='X'ならデモ2行をAPPEND、そうでなければBKPFからbukrs=p_bukrs AND budat IN s_budatでINTO TABLE取得する。SELECTの直後はsy-subrcを確認し、0以外ならMESSAGE後にLEAVE LIST-PROCESSING。\nブレークポイント：SELECT直後で止め、sy-subrcとlt_bkpfの件数を確認する。",
          content: (
            <>
              <h2>④ データ取得 — SELECTとSY-SUBRC</h2>
              <p>
                主処理 <code>START-OF-SELECTION</code> で、BKPFから条件に合う行を
                <strong>内部テーブルへ一括取得</strong>します。デモのときはDBを使わず2行を作ります。
                取得の<strong>直後は必ず <code>SY-SUBRC</code> を確認</strong>します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`START-OF-SELECTION.

  CLEAR lt_bkpf.

  IF p_demo = 'X'.
    " --- デモ2行（DB不要で動作確認）---
    CLEAR ls_bkpf.
    ls_bkpf-bukrs = p_bukrs.  ls_bkpf-blart = 'SA'.
    ls_bkpf-budat = '20250101'.  ls_bkpf-bldat = '20250101'.
    ls_bkpf-belnr = '1000000001'.  ls_bkpf-usnam = sy-uname.
    APPEND ls_bkpf TO lt_bkpf.

    CLEAR ls_bkpf.
    ls_bkpf-bukrs = p_bukrs.  ls_bkpf-blart = 'SA'.
    ls_bkpf-budat = '20250102'.  ls_bkpf-bldat = '20250102'.
    ls_bkpf-belnr = '1000000002'.  ls_bkpf-usnam = sy-uname.
    APPEND ls_bkpf TO lt_bkpf.

  ELSE.
    " --- BKPFから会計伝票ヘッダを取得 ---
    SELECT bukrs blart budat bldat belnr usnam
      FROM bkpf
      INTO TABLE lt_bkpf
      WHERE bukrs = p_bukrs
        AND budat IN s_budat.

    IF sy-subrc <> 0.
      MESSAGE s000.       " → 画面下部ステータスバーに表示（SE91: z01/000 の文言）
      LEAVE LIST-PROCESSING. " → リスト出力を終了し、選択画面へ戻る
    ENDIF.
  ENDIF.`}
              />
              <InfoPanel
                title="MESSAGE s000 の見え方"
                variant="reference"
                lead="メッセージクラス z01 の 000 番が呼ばれます。SE91 で登録した文言・種別どおりに画面に出ます。"
              >
                <ul>
                  <li>
                    <code>s000</code> の先頭 <code>s</code> … Success（成功）種別 →{" "}
                    <strong>画面下部のステータスバーが緑</strong>で表示
                  </li>
                  <li>
                    SE91 で z01/000 に「該当データがありません」等と登録されていれば、その文言が出る
                  </li>
                  <li>
                    <code>LEAVE LIST-PROCESSING.</code> … 空の帳票を出さず、
                    <strong>選択画面に戻る</strong>
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                <code>SELECT … INTO TABLE</code> の <code>SY-SUBRC</code> は
                「1件でも取れたら 0 / 0件なら 4」です。0件のときに後続のLOOPへ進むと空の帳票が出てしまうため、ここで止めます。
              </Callout>
              <BreakPointCheck
                insert={`    SELECT bukrs blart budat bldat belnr usnam
      FROM bkpf INTO TABLE lt_bkpf
      WHERE bukrs = p_bukrs AND budat IN s_budat.
    BREAK-POINT.        " ★SELECT直後で確認`}
                ask={
                  <>
                    取得直後に止めます。<code>sy-subrc</code> は何ですか？{" "}
                    <code>lt_bkpf</code> の件数は入力条件と合っていますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      該当ありなら <code>sy-subrc = 0</code>、
                      <code>lt_bkpf</code> に件数分の行
                    </li>
                    <li>
                      該当なしなら <code>sy-subrc = 4</code> →{" "}
                      ステータスバーに <code>MESSAGE s000</code> の文言が表示 → 選択画面へ戻る
                    </li>
                    <li>
                      デモ実行（<code>p_demo = X</code>）なら、SELECTを通らず2行が入る
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "⑤ データ加工",
          plainText:
            "ステップ5 データ加工\nREAD TABLE s_budat INDEX 1で入力範囲を取り出し、lv_start_date/lv_end_dateへ退避（ヘッダ表示用）。SORT lt_bkpf BY budat belnrで転記日付・伝票番号順に並べ替える。\nブレークポイント：SORT後に止め、lv_start_date/lv_end_dateと並び順を確認する。",
          content: (
            <>
              <h2>⑤ データ加工 — 退避と並べ替え</h2>
              <p>
                表示の前にひと手間。入力した日付範囲をヘッダ表示用の変数に退避し、明細を
                <strong>転記日付・伝票番号の順</strong>に並べ替えます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`  " ヘッダ表示用に転記日付の範囲を退避
  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    lv_start_date = s_budat-low.
    lv_end_date   = s_budat-high.
  ENDIF.

  " 明細を 転記日付 → 伝票番号 の順に並べ替え
  SORT lt_bkpf BY budat belnr.`}
              />
              <InfoPanel title="なぜ並べ替える？" variant="breakdown">
                <ul>
                  <li>
                    DBから取った順番は<strong>保証されない</strong>ため、出力前に
                    <code>SORT</code> で意図した順に整える
                  </li>
                  <li>
                    仕訳日記帳は「日付順」が読みやすい → <code>budat</code> を第1キーに
                  </li>
                  <li>
                    <code>READ TABLE … INDEX 1</code> は「1行目を読む」。
                    <code>s_budat-low</code>/<code>-high</code> が範囲の下限・上限
                  </li>
                </ul>
              </InfoPanel>
              <BreakPointCheck
                insert={`  SORT lt_bkpf BY budat belnr.
  BREAK-POINT.        " ★加工後に確認`}
                ask={
                  <>
                    <code>lv_start_date</code>・<code>lv_end_date</code>{" "}
                    に範囲が入りましたか？ <code>lt_bkpf</code>{" "}
                    は日付順に並んでいますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>lv_start_date</code> = 入力Fromの日付、
                      <code>lv_end_date</code> = 入力Toの日付
                    </li>
                    <li>
                      <code>lt_bkpf</code> の <code>budat</code>{" "}
                      が昇順、同日内は <code>belnr</code> 昇順
                    </li>
                    <li>
                      範囲を単一値（Toなし）で入れた場合、<code>lv_end_date</code>{" "}
                      は <code>00000000</code> のことがある
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "⑥ 画面に表示",
          plainText:
            "ステップ6 画面に表示\nTOP-OF-PAGEに明細見出しを追加し、END-OF-SELECTIONでLOOP AT lt_bkpf INTO ls_bkpf。WRITEで会社/伝票タイプ/転記日付/伝票日付/伝票番号/ユーザ名を整列出力。日付はUSING EDIT MASK '____/__/__'で見やすく。\nブレークポイント：LOOP内で止め、ls_bkpfが1行ずつ更新されることを確認する。",
          content: (
            <>
              <h2>⑥ 画面に表示 — LOOPとWRITE</h2>
              <p>
                最後に明細を出力します。<code>TOP-OF-PAGE</code>{" "}
                に見出しを足し、<code>END-OF-SELECTION</code> の{" "}
                <code>LOOP</code> で1行ずつ <code>WRITE</code> します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`TOP-OF-PAGE.
  " （前略：共通ヘッダ）
  ULINE.
  WRITE: /1  '会社', 8 '伝票タイプ', 20 '転記日付',
           35 '伝票日付', 50 '伝票番号', 65 'ユーザ名'.
  ULINE.

END-OF-SELECTION.
  LOOP AT lt_bkpf INTO ls_bkpf.
    WRITE: /1  ls_bkpf-bukrs,
             8  ls_bkpf-blart,
             20 ls_bkpf-budat USING EDIT MASK '____/__/__',
             35 ls_bkpf-bldat USING EDIT MASK '____/__/__',
             50 ls_bkpf-belnr,
             65 ls_bkpf-usnam.
  ENDLOOP.`}
              />
              <Callout variant="tip">
                <code>USING EDIT MASK '____/__/__'</code> は{" "}
                <code>20250101</code> を <code>2025/01/01</code>{" "}
                の見た目にします（中身は変わりません）。列番号（1, 8, 20…）で整列します。
              </Callout>
              <BreakPointCheck
                insert={`  LOOP AT lt_bkpf INTO ls_bkpf.
    BREAK-POINT.        " ★1行ずつ確認（F8で次の行へ）
    WRITE: /1 ls_bkpf-bukrs.
  ENDLOOP.`}
                ask={
                  <>
                    ループ内で止めます。<code>ls_bkpf</code>{" "}
                    は周回ごとに次の行へ変わりますか？ 列の位置はそろっていますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      1周目は <code>lt_bkpf</code> の1行目、2周目は2行目…と{" "}
                      <code>ls_bkpf</code> が更新される
                    </li>
                    <li>
                      <code>sy-tabix</code> が現在の行番号（1, 2, 3…）
                    </li>
                    <li>
                      出力されたリストで、日付が <code>2025/01/01</code>{" "}
                      形式・各列がそろっていればOK
                    </li>
                    <li>確認できたら BREAK-POINT を削除して完成</li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "単体テスト",
          plainText:
            "単体テスト（部品ごとの確認）\n各処理ブロックを切り出して、入力に対する出力を1つずつ確認する。観点：会社コード必須・日付必須（OBLIGATORY）、デモ2行の生成、SELECTのSY-SUBRC分岐（0件→メッセージ）、日付範囲退避（READ TABLE）、SORTの並び順、EDIT MASKの整形。\np_demoチェックボックスを使えばDBなしで出力ロジックだけを単体確認できる。",
          content: (
            <>
              <h2>単体テスト — 部品ごとに確かめる</h2>
              <p>
                <strong>単体テスト</strong>は「処理ブロックを1つずつ」検証します。
                <code>p_demo</code>{" "}
                チェックを使えば、DBに依存せず出力ロジックだけを切り出して確認できます。
              </p>
              <div className="not-prose my-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        観点
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        入力・操作
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        期待結果
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        必須チェック
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        会社コードを空で実行
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>OBLIGATORY</code> で実行不可・入力を促す
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        デモ生成
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>p_demo = X</code> で実行
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        SELECTを通らず2行が出力される
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        SY-SUBRC分岐
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        該当しない会社・日付で実行
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>MESSAGE s000</code> がステータスバー（緑）に表示 →{" "}
                        <code>LEAVE LIST-PROCESSING</code> で選択画面へ戻る
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        並べ替え
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        日付がバラバラな複数件
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>budat → belnr</code> の昇順で並ぶ
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        日付整形
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>20250101</code> を出力
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>2025/01/01</code> と表示される
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Dialog speaker="teacher">
                単体テストのコツは「1つの観点で1つだけ条件を変える」こと。ブレークポイントと{" "}
                <code>p_demo</code> を使えば、DBの状態に左右されず安定して確認できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "機能テスト",
          plainText:
            "機能テスト（通しの確認）\n入力→取得→加工→出力を本番に近い条件で通して確認する。正常系：実在する会社コードと日付範囲→ヘッダと明細が整合した一覧。境界値：範囲の上限下限・1件・大量件数。異常系：該当0件→メッセージ。デモ系：p_demo=X→2行。\nヘッダのPGMID/USER/DATE/PAGEと明細の列ずれ・ページ送りも確認する。",
          content: (
            <>
              <h2>機能テスト — 通しで確かめる</h2>
              <p>
                <strong>機能テスト</strong>
                は、入力から出力までを<strong>本番に近い条件で一気通貫</strong>に確認します。単体で部品がOKでも、つないだときの整合は別途確認が必要です。
              </p>
              <div className="not-prose my-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        シナリオ
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        条件
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        期待結果
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        正常系
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        実在の会社・該当のある日付範囲
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        日付順に明細が並び、ヘッダと整合
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        境界値
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        範囲の上限／下限ちょうど・1件のみ
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        取りこぼし・余分な行がない
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        大量件数
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        58行を超える件数
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        ページ送りされ、各ページにヘッダが出る
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        異常系
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        該当0件になる条件
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>MESSAGE s000</code> がステータスバーに表示・空の帳票を出さない
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        デモ系
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>p_demo = X</code>
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        DB非依存で2行が安定して出る
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Callout variant="warning">
                出力の見た目も観点です。<code>PGMID</code>/<code>USER</code>/
                <code>DATE</code>/<code>PAGE</code>{" "}
                が正しいか、明細の列ずれがないか、改ページ後もヘッダが出るかを必ず目視確認します。
              </Callout>
            </>
          ),
        },
        {
          title: "完成コードと確認",
          plainText:
            "完成コード（全体）と理解度チェック\n6ステップを結合すると、REPORT→TYPES→DATA→PARAMETERS/SELECT-OPTIONS→START-OF-SELECTION（取得・加工）→TOP-OF-PAGE（ヘッダ）→END-OF-SELECTION（出力）の1本になる。\nQ SELECTの直後に必ず行うことは → SY-SUBRCの確認",
          content: (
            <>
              <h2>完成コードと理解度チェック</h2>
              <p>
                6つのステップを結合すると、最初に提示した完成形と同じ1本のレポートになります。下に全体を載せます。
              </p>
              <Reveal label="完成コード（全体）を見る">
                <CodeBlock
                  language="ABAP"
                  code={`*&-------------------------------------------------------------------*
*&  仕訳日記帳レポート（演習）
*&-------------------------------------------------------------------*
REPORT z_journal_ledger
  NO STANDARD PAGE HEADING
  MESSAGE-ID z01        " メッセージクラス（SE91で文言を登録）
  LINE-SIZE 170 LINE-COUNT 58.

TYPES: BEGIN OF ty_bkpf_hdr,
         bukrs TYPE bkpf-bukrs, blart TYPE bkpf-blart,
         budat TYPE bkpf-budat, bldat TYPE bkpf-bldat,
         belnr TYPE bkpf-belnr, usnam TYPE bkpf-usnam,
       END OF ty_bkpf_hdr.

DATA: lv_budat  TYPE bkpf-budat.
DATA: lt_bkpf   TYPE STANDARD TABLE OF ty_bkpf_hdr,
      ls_bkpf   TYPE ty_bkpf_hdr.
DATA: lv_start_date TYPE bkpf-budat, lv_end_date TYPE bkpf-budat.

PARAMETERS:     p_bukrs TYPE t001-bukrs OBLIGATORY.
SELECT-OPTIONS: s_budat FOR lv_budat OBLIGATORY.
PARAMETERS:     p_demo  AS CHECKBOX DEFAULT ''.

START-OF-SELECTION.
  CLEAR lt_bkpf.

  IF p_demo = 'X'.
    CLEAR ls_bkpf.
    ls_bkpf-bukrs = p_bukrs. ls_bkpf-blart = 'SA'.
    ls_bkpf-budat = '20250101'. ls_bkpf-bldat = '20250101'.
    ls_bkpf-belnr = '1000000001'. ls_bkpf-usnam = sy-uname.
    APPEND ls_bkpf TO lt_bkpf.
    CLEAR ls_bkpf.
    ls_bkpf-bukrs = p_bukrs. ls_bkpf-blart = 'SA'.
    ls_bkpf-budat = '20250102'. ls_bkpf-bldat = '20250102'.
    ls_bkpf-belnr = '1000000002'. ls_bkpf-usnam = sy-uname.
    APPEND ls_bkpf TO lt_bkpf.
  ELSE.
    SELECT bukrs blart budat bldat belnr usnam
      FROM bkpf INTO TABLE lt_bkpf
      WHERE bukrs = p_bukrs AND budat IN s_budat.
    IF sy-subrc <> 0.
      MESSAGE s000.       " → 画面下部ステータスバーに表示（SE91: z01/000 の文言）
      LEAVE LIST-PROCESSING. " → リスト出力を終了し、選択画面へ戻る
    ENDIF.
  ENDIF.

  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    lv_start_date = s_budat-low. lv_end_date = s_budat-high.
  ENDIF.
  SORT lt_bkpf BY budat belnr.

TOP-OF-PAGE.
  WRITE: /1 'PGMID:' NO-GAP, 9 sy-cprog,
           155 'DATE:' NO-GAP, 160(10) sy-datum RIGHT-JUSTIFIED,
         /1 'USER:' NO-GAP, 9 sy-uname,
           155 'TIME:' NO-GAP, 160(10) sy-uzeit RIGHT-JUSTIFIED,
         /70(30) '仕訳日記帳' CENTERED,
           155 'PAGE:' NO-GAP, 160(10) sy-pagno RIGHT-JUSTIFIED NO-SIGN.
  SKIP 1. ULINE.
  WRITE: /1 '会社', 8 '伝票タイプ', 20 '転記日付',
           35 '伝票日付', 50 '伝票番号', 65 'ユーザ名'.
  ULINE.

END-OF-SELECTION.
  LOOP AT lt_bkpf INTO ls_bkpf.
    WRITE: /1 ls_bkpf-bukrs, 8 ls_bkpf-blart,
             20 ls_bkpf-budat USING EDIT MASK '____/__/__',
             35 ls_bkpf-bldat USING EDIT MASK '____/__/__',
             50 ls_bkpf-belnr, 65 ls_bkpf-usnam.
  ENDLOOP.`}
                />
              </Reveal>
              <LessonQuiz
                answer={1}
                explanation="SELECT直後はSY-SUBRCを確認します。0なら成功（1件以上取得）、0以外なら0件などの失敗。確認せずに進むと、空の帳票やエラーを見逃します。"
                question={
                  <strong>SELECT … INTO TABLE の直後に必ず行うことは？</strong>
                }
                options={[
                  "WRITE で列をそろえる",
                  "SY-SUBRC で取得結果を確認する",
                  "SORT で並べ替える",
                ]}
              />
            </>
          ),
        },
        {
          title: "テーブル関連図（ERD）",
          plainText:
            "テーブル関連図（ERD）\n演習で使う BKPF（伝票ヘッダ）と T001（会社コード・選択画面の型）のキーと関連。各列は『日本語名（列コード）』。GJAHR は SELECT していないが伝票を一意にする主キーの一部。\n関連：T001 1―多 BKPF（BUKRS）。WHERE bukrs = p_bukrs AND budat IN s_budat でヘッダを取得。",
          content: (
            <>
              <h2>テーブル関連図（ERD）</h2>
              <p>
                この演習では<strong>会計伝票ヘッダ（BKPF）だけ</strong>を読み、1伝票＝リスト1行で仕訳日記帳を出します。
                選択画面の会社コード（<code>p_bukrs</code>）は <code>T001-BUKRS</code> 型です。
                各列は<strong>日本語名（列コード）</strong>で表示し、鍵アイコン付きの列が主キーです。
                図に載せているのは<strong>演習の型・SELECT で使う列</strong>と、主キーに必要な <code>GJAHR</code> です。
              </p>
              <SapErdDiagram variant="journalLedgerHeader" height={400} />
              <InfoPanel title="演習コードとの対応" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>プログラムでの使い方</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>BUKRS</code>
                      </td>
                      <td>
                        <code>PARAMETERS p_bukrs</code>（型は <code>t001-bukrs</code>）／{" "}
                        <code>WHERE bukrs = p_bukrs</code>／一覧の「会社」列
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>BUDAT</code>
                      </td>
                      <td>
                        <code>SELECT-OPTIONS s_budat</code>／<code>WHERE budat IN s_budat</code>／「転記日付」列
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>BLART</code> / <code>BLDAT</code> / <code>BELNR</code> / <code>USNAM</code>
                      </td>
                      <td>
                        <code>SELECT</code> リストに含め、<code>WRITE</code> で出力
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>GJAHR</code>
                      </td>
                      <td>
                        本演習の <code>SELECT</code> には含めないが、実務では伝票番号と合わせて主キー。
                        演習②（明細つき）では必須になる
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>T001</code> → <code>BKPF</code>
                      </td>
                      <td>
                        会社コードで BKPF を絞る（T001 自体は <code>SELECT</code> しない）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                図の右上「全画面」で拡大表示できます。明細（BSEG）や名称テーブルまで含む関連図は{" "}
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="93-exercise-journal-ledger-detail"
                  slide={17}
                  label="特別演習②: テーブル関連図"
                  variant="back"
                  className="inline-flex"
                />{" "}
                を参照してください。
              </Callout>
              <Dialog speaker="teacher">
                演習①は<strong>「表紙（BKPF）だけ読む」</strong>段階です。
                1伝票1行の一覧に慣れたら、演習②で BSEG・辞書テーブルを足して「明細1行＝リスト1行」へ進みます。
              </Dialog>
              <Dialog speaker="closing">
                お疲れさまでした。SELECT → SY-SUBRC → SORT → WRITE の流れと、BKPF
                の項目の役割を押さえられれば、この演習の目的は達成です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerLesson);
