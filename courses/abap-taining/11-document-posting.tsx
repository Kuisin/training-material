import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "会計伝票登録 — BAPI・ロック・検証から登録までのフロー",
  meta: "初学者 · 30分",
};

export default function DocumentPostingLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "11-document-posting", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "会計伝票登録へ進む\n「見る」から「書き込む」へ。登録の責任の重さと、安全に登録する仕組みを学びます。\n⏱ 30分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・照会（見る）と登録（書き込む）の責任の違い\n・外部ファイル → 検証 → 登録 → 履歴 → 結果、という登録フロー\n・登録を支える部品：アドオンテーブル・汎用モジュール・BAPI・ロックオブジェクト",
          content: (
            <>
              <hgroup>
                <h1>会計伝票登録へ進む</h1>
                <p>「見る」から「書き込む」へ。登録の責任の重さと、安全に登録する仕組みを学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>照会（見る）と登録（書き込む）の責任の違い</li>
                <li>外部データの取込 → 検証 → 登録 → 履歴 → 結果、という登録フロー</li>
                <li>登録を支える部品：アドオンテーブル・汎用モジュール・BAPI・ロックオブジェクト</li>
                <li>BAPI の結果判定（<code>RETURN</code>）と確定（コミット）の関係</li>
              </ul>
            </>
          ),
        },
        {
          title: "連携登録の目的",
          plainText:
            "連携登録の目的と構成\n外部システム由来の会計データを、SAPへ安全に登録する典型パターン。要件：取込・伝票登録・履歴管理（重複防止）・エラー保持。\n構成：レポート→ファイル読込→BAPI登録→汎用モジュールで履歴。アドオンテーブルに結果を残す。",
          content: (
            <>
              <h2>連携登録の目的と構成</h2>
              <p>
                実務でよくあるのは、<strong>外部システムで作った会計データを SAP に自動登録する</strong>プログラムです。
                照会レポート（前半）とは違い、「書き込み」「重複防止」「エラー管理」まで設計に含めます。
              </p>
              <InfoPanel title="よくある要件（概念）" variant="reference">
                <ul>
                  <li>外部ファイル（または連携データ）を SAP へ取り込む</li>
                  <li>会計伝票を<strong>公式ルート</strong>（BAPI）で登録する</li>
                  <li>登録履歴を残し、<strong>二重登録を防ぐ</strong></li>
                  <li>エラー内容を保持し、運用者が追えるようにする</li>
                </ul>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart TB
  F[外部データ] --> R[レポートプログラム]
  R --> U[ファイル読込]
  R --> B[BAPI 会計伝票登録]
  R --> H[履歴登録]
  H --> T[(アドオンテーブル)]`}
              />
              <Dialog speaker="teacher">
                ファイルの置き場所や論理名、テーブル名はプロジェクトごとに決まります。
                <strong>この図の役割分担</strong>は本番でもほぼ同じです。
              </Dialog>
            </>
          ),
        },
        {
          title: "メモと正式台帳のたとえ",
          plainText:
            "閲覧メモ と 正式な台帳\nこれまでは台帳を見るだけ（照会）。これからは台帳に正式に書き込む（登録）。書き込みは間違えると正式記録が汚れるのでより慎重さが必要。\n先生：見るのは何度やっても安全。でも書き込みは消えない記録を残す。だから検証やロックといった守りの仕組みが必要。\nBちゃん：下書きと清書（提出する書類）の違いみたいですね。清書は緊張します。\n先生：その緊張は正しい感覚。だから人ではなく仕組みで守ります。",
          content: (
            <>
              <h2>閲覧メモ と 正式な台帳</h2>
              <p>これまでは「台帳を見るだけ（照会）」でした。これからは「台帳に正式に書き込む（登録）」をします。書き込みは、間違えると正式記録が汚れるので、より慎重さが必要です。</p>
              <Figure
                src="image/11-draft-vs-final.webp"
                alt="左：鉛筆で書いた下書きメモ（照会・気軽、消せる）。右：ペンで正式台帳に清書して印を押す様子（登録・消えない記録）。気軽さと責任の重さの対比。"
                caption="照会＝下書き（消せる）／登録＝清書（消えない正式記録）。だから守りが要る"
                kind="concept"
              />
              <Dialog speaker="teacher">
                見るのは何度やっても安全。でも書き込みは“消えない記録”を残します。だから検証やロックといった守りの仕組みが必要になります。
              </Dialog>
              <Dialog speaker="b">
                下書きと、清書（提出する書類）の違いみたいですね。清書は緊張します。
              </Dialog>
              <Dialog speaker="teacher">
                その緊張は正しい感覚です。だからこそ、人の注意力だけに頼らず「仕組み」で守ります。次から、その仕組みを見ていきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：登録フロー",
          plainText:
            "図で見る：登録の一連の流れ\nsequence：外部ファイル→取込→検証→ロック→BAPIで登録→結果(伝票番号 or エラー)→コミット(確定)→履歴・結果を記録/表示\nAくん：取って終わりではなく、確定(コミット)と記録までが1セットなんですね。",
          content: (
            <>
              <h2>図で見る：登録の一連の流れ</h2>
              <MermaidDiagram
                chart={`sequenceDiagram
  participant F as 外部ファイル
  participant P as ABAPプログラム
  participant S as SAP(伝票)
  F->>P: 取込（データを読む）
  P->>P: 検証（ルールチェック）
  P->>S: ロック（他から触らせない）
  P->>S: 登録（BAPIで伝票作成）
  S-->>P: 結果（伝票番号 or エラー）
  P->>S: コミット（確定）
  P->>P: 履歴・結果を記録/表示`}
              />
              <Dialog speaker="a">
                取って終わりではなく、確定（コミット）と記録までが1セットなんですね。途中で止まると中途半端な登録になりそう。
              </Dialog>
              <Callout variant="tip">
                第15章では「ファイルをどう読むか」、履歴用テーブルと検証用の汎用モジュールは本章で扱い、開発ツールの全体像は第14章を参照します。
                この章では<strong>登録の責任と順序</strong>に集中します。
              </Callout>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="15-files-jobs-and-batch"
                  slide={5}
                  label="第15章: ファイル読込の詳細へ"
                />
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="14-sap-development-tools"
                  slide={2}
                  label="第14章: 開発ツールへ"
                />
              </div>
            </>
          ),
        },
        {
          title: "BAPIはなぜ必要か",
          plainText:
            "BAPI ＝ SAP公式の「安全な登録窓口」\n伝票テーブルに直接書き込むのは危険（整合性が崩れる）。BAPI はSAPが用意した正しい手順で登録してくれる公式の窓口。通せば必要なチェックや関連更新もまとめて面倒を見てくれる。\nつまずき：テーブルに直接 INSERT すればいいは厳禁。\nAくん：APIを通すと内部の整合性ルールを破らずに済む。\nBちゃん：別途登録した独自のステップ（会社のチェック）も実行される？\n先生：その通り。公式の通り道なので標準＋自社の拡張も動く。直接INSERTはそれもすっ飛ばす。\nコード：INSERT bkpf/bsegは危険、CALL FUNCTION BAPI_ACC_DOCUMENT_POSTが安全。Aくん：CALL FUNCTIONは第10章の汎用モジュールと同じ形。",
          content: (
            <>
              <h2>BAPI ＝ SAP公式の「安全な登録窓口」</h2>
              <p>
                伝票テーブルに直接書き込むのは危険です（整合性が崩れる）。<strong>BAPI</strong> は、SAPが用意した「正しい手順で登録してくれる公式の窓口」。
                これを通せば、SAP標準のチェック・関連テーブルの更新に加え、
                会社ごとに追加した処理（<strong>拡張</strong>＝独自のステップ）も通常は一緒に実行されます。
              </p>
              <Figure
                src="image/11-bapi-gate.webp"
                alt="左：複数の伝票テーブルに直接INSERTしようとして整合性が崩れ警告マークが出る危険な経路。右：BAPIという公式の窓口（ゲート）を通すと、チェックと関連テーブル更新が正しく行われ整合する安全な経路。×と○の対比。"
                caption="直接INSERT＝整合性が壊れる危険／BAPI＝チェック付きの公式窓口を通る安全な道"
                kind="diagram"
              />
              <Dialog speaker="stumble">
                「テーブルに直接 INSERT すればいい」は厳禁。会計伝票は必ず BAPI など正式な手段で登録します。
              </Dialog>
              <Dialog speaker="a">
                APIを通すことで、SAP標準の整合性ルールを破らずに済むんですね。
              </Dialog>
              <Dialog speaker="b">
                BAPI を通すと、別途登録してある<strong>独自のステップ</strong>
                （会社特有のチェックや追加処理）も実行されるんですよね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。BAPI は「公式の通り道」なので、標準の更新処理に加えて、
                あらかじめ組み込んだ拡張（自社ルール）も通常は一緒に動きます。
                直接 <code>INSERT</code> すると標準だけでなく<strong>自社のチェックもすっ飛ばす</strong>——
                これも BAPI を使う大きな理由です。
              </Dialog>
              <Callout variant="note">
                用語メモ：<strong>拡張</strong>＝SAP標準の登録処理に、会社ごとに追加したチェックや処理。
                詳しい仕組み（BAdI など）は本コースの範囲外ですが、「BAPI なら拡張も通る」と覚えておけば十分です。
              </Callout>
              <h3>コードで見る：直接 INSERT vs BAPI</h3>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 危険：伝票テーブルへ直接書き込む
INSERT bkpf FROM ls_bkpf.
INSERT bseg FROM TABLE lt_bseg.
" → 標準チェック・関連更新・自社拡張をすべてすっ飛ばす

" ✅ 安全：BAPI という公式窓口を通す
CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'
  EXPORTING
    documentheader = ls_header
  TABLES
    accountgl      = lt_gl
  IMPORTING
    obj_key        = lv_obj_key
  EXCEPTIONS
    OTHERS         = 1.
" → 標準＋拡張のチェックが通ったうえで、関連テーブルもまとめて更新`}
              />
              <Dialog speaker="a">
                BAPI の呼び出しは <code>CALL FUNCTION</code> ですね。第10章の汎用モジュールと同じ形で、
                「公式の登録窓口を呼ぶ」と理解しました。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="10-modularization"
                slide={4}
                label="第10章: FORM/CALL FUNCTION を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "BAPIの結果と確定",
          plainText:
            "BAPIの結果判定と確定\n会計伝票でよく使うBAPI：POST（登録）・COMMIT（確定）・ROLLBACK（取消）。RETURNテーブルでtype=Eを見てエラー判定。sy-subrcだけでは不十分なことが多い。\n成功時のみCOMMIT WORKまたはBAPI_TRANSACTION_COMMIT。失敗時はROLLBACK。RETURN未確認のCOMMITは危険。",
          content: (
            <>
              <h2>BAPI の結果判定と確定</h2>
              <p>
                BAPI は「呼べば必ず成功」とは限りません。会計伝票では、
                <strong><code>RETURN</code> テーブル</strong>にメッセージが返り、
                <code>TYPE = &apos;E&apos;</code>（エラー）があれば登録は失敗扱いにします。
              </p>
              <InfoPanel title="会計伝票でよく使う BAPI（用途で覚える）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>BAPI（例）</th>
                      <th>役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>BAPI_ACC_DOCUMENT_POST</code>
                      </td>
                      <td>伝票登録（本番の書き込み）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>BAPI_ACC_DOCUMENT_CHECK</code>
                      </td>
                      <td>登録前の検証のみ（DB に確定しない）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>BAPI_TRANSACTION_COMMIT</code>
                      </td>
                      <td>BAPI 更新の確定（<code>COMMIT WORK</code> と同目的のことが多い）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>BAPI_TRANSACTION_ROLLBACK</code>
                      </td>
                      <td>BAPI 更新の取消</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'
  EXPORTING documentheader = ls_header
  TABLES    accountgl      = lt_gl
            return           = lt_return.

DATA lv_error TYPE abap_bool.
LOOP AT lt_return INTO DATA(ls_return).
  IF ls_return-type = 'E' OR ls_return-type = 'A'.
    lv_error = abap_true.
  ENDIF.
ENDLOOP.

IF lv_error = abap_false.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'.
  " または COMMIT WORK.  （プロジェクトの標準に従う）
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
  " または ROLLBACK WORK.
ENDIF.`}
              />
              <Dialog speaker="stumble">
                <code>SY-SUBRC</code> だけ見てコミットするのは危険です。
                BAPI は「呼び出しは成功したが、<code>RETURN</code> にエラーがある」パターンがよくあります。
              </Dialog>
              <Dialog speaker="teacher">
                実務で特に押さえる3点は、<strong>BAPI とコミットのセット</strong>、
                <strong><code>RETURN</code> のエラー確認</strong>、<strong>ロック（<code>ENQUEUE</code>）</strong>です。
              </Dialog>
            </>
          ),
        },
        {
          title: "ロックは何を守るか",
          plainText:
            "ロック ＝ 「使用中」の札\n2人が同時に同じデータを書き込むと記録が壊れる。ロックオブジェクトはトイレの使用中札のように今このデータは私が触っていますと示し二重更新を防ぐ。\nBちゃん：試着室の使用中札と同じ。空くまで待つ？\n先生：取れなければRETURNで諦めるのが基本。終わったら必ずDEQUEUE。\nコード：ENQUEUE_EZ_BKPF→mode_bukrs='E'排他/bukrs=会社コード→foreign_lock=他者使用中→sy-subrc<>0でRETURN→BAPI→DEQUEUE必須。\n1行ずつ：CALL FUNCTION ENQUEUE=札を出す/sy-subrc=結果/DEQUEUE=札を戻す。\nQ：なぜBAPI前？Q：DEQUEUEは成功時だけ？→どちらも不可。",
          content: (
            <>
              <h2>ロック ＝ 「使用中」の札</h2>
              <p>
                2人が同時に同じデータを書き込むと、記録が壊れます。<strong>ロックオブジェクト</strong>は、
                トイレの「使用中」札のように「今このデータは私が触っています」と示し、二重更新を防ぎます。
                テーブル全体ではなく、<strong>主キー（会社コード・伝票キーなど）単位</strong>で札を出すのが基本です。
              </p>
              <Dialog speaker="b">
                試着室の「使用中」札と同じですね。空くまで待つんですか？
              </Dialog>
              <Dialog speaker="teacher">
                待つ実装もありますが、この章の例では<strong>取れなければ諦める（<code>RETURN</code>）</strong>形にしています。
                無理に二重登録しないことが優先です。終わったら必ず <code>DEQUEUE</code> で札を戻す——
                札を出したまま帰ると、ほかの人がずっと使えなくなります。
              </Dialog>
              <h3>コードで見る：ロックの取得と解放</h3>
              <p>
                会計伝票（BKPF）を<strong>会社コード単位</strong>で排他する例です。
                流れは <strong>①札を出す → ②書き込み → ③必ず札を戻す</strong> の3段階です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ① 使用中札を出す（他の処理を待たせる）
CALL FUNCTION 'ENQUEUE_EZ_BKPF'
  EXPORTING
    mode_bkpf = 'E'           " 排他ロック
    bukrs     = lv_bukrs      " 会社コード 1000 など
  EXCEPTIONS
    foreign_lock = 1
    OTHERS       = 2.

IF sy-subrc <> 0.
  " 他の人が使用中 → 登録せず終了
  RETURN.
ENDIF.

" ② ここで BAPI 登録など書き込み処理を行う
" ...

" ③ 必ず札を戻す（成功・失敗どちらでも）
CALL FUNCTION 'DEQUEUE_EZ_BKPF'
  EXPORTING
    mode_bkpf = 'E'
    bukrs     = lv_bukrs.`}
              />
              <h3>1行ずつ読む</h3>
              <InfoPanel
                title="① ENQUEUE — 使用中札を出す"
                variant="breakdown"
                lead={
                  <>
                    <code>CALL FUNCTION &apos;ENQUEUE_EZ_BKPF&apos;</code> …
                    ロックオブジェクト <code>EZ_BKPF</code> 用の「札を取る」関数を呼び出します。
                    名前の <code>ENQUEUE_</code> は「待ち行列に入れる＝今から使います」の意味です。
                  </>
                }
              >
                <ul>
                  <li>
                    <strong><code>mode_bkpf = &apos;E&apos;</code></strong> … ロックの<strong>種類</strong>。
                    <code>E</code> = Exclusive（排他）＝自分だけが触れるモード。
                    共有ロック（<code>S</code>）など他の種類もありますが、登録処理では排他が基本
                  </li>
                  <li>
                    <strong><code>bukrs = lv_bukrs</code></strong> … <strong>どのデータ</strong>をロックするか。
                    ここでは会社コード（例：<code>1000</code>）単位。
                    同じ <code>bukrs</code> を触ろうとする他処理をブロックする
                  </li>
                  <li>
                    <strong><code>EXCEPTIONS foreign_lock = 1</code></strong> …
                    <strong>他の人が先にロック中</strong>のときに返るエラー。
                    「試着室に使用中札がかかっていた」状態
                  </li>
                  <li>
                    <strong><code>EXCEPTIONS OTHERS = 2</code></strong> … 上記以外のエラー（通信障害など）を受け取る
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel
                title="② sy-subrc — ロックが取れたか確認"
                variant="breakdown"
                lead={
                  <>
                    <code>sy-subrc</code> は「直前の処理の結果コード」です。
                    <strong>0 ＝ 成功</strong>、0 以外 ＝ 失敗、と覚えます（第9章の <code>IF</code> と同じ考え方）。
                  </>
                }
              >
                <ul>
                  <li>
                    <strong><code>IF sy-subrc &lt;&gt; 0.</code></strong> … ロック取得に失敗。
                    <code>foreign_lock</code>（他者使用中）か、その他エラーのどちらか
                  </li>
                  <li>
                    <strong><code>RETURN.</code></strong> … この処理を<strong>諦めて抜ける</strong>。
                    無理に BAPI 登録しない＝二重更新を防ぐ
                  </li>
                  <li>
                    <strong>補足</strong> … 実務では「一定時間待ってリトライ」する実装もありますが、
                    初学者向けには「取れなければスキップ」の方が意図が分かりやすい
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel
                title="③ DEQUEUE — 必ず札を戻す"
                variant="breakdown"
                lead={
                  <>
                    <code>DEQUEUE_EZ_BKPF</code> は <code>ENQUEUE</code> の<strong>ペア</strong>。
                    取得時と同じ <code>mode_bkpf</code> / <code>bukrs</code> を渡して、どの札を戻すか特定します。
                  </>
                }
              >
                <ul>
                  <li>
                    <strong>成功・失敗どちらでも実行</strong> … BAPI が失敗しても、
                    <code>ENQUEUE</code> は成功しているので札は出たまま。
                    <code>IF sy-subrc = 0</code> の中だけ <code>DEQUEUE</code> を書くのは<strong>NG</strong>
                  </li>
                  <li>
                    <strong>他言語の <code>finally</code> に相当</strong> … ABAP には <code>finally</code> はない。
                    「成功・失敗の分岐の<strong>後</strong>」に必ず <code>DEQUEUE</code> を書く
                  </li>
                  <li>
                    <strong>忘れたときの症状</strong> … 他の処理が永久に <code>ENQUEUE</code> で弾かれる。
                    運用では SM12 などでロック一覧を確認し、手動解放することもある
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                なんで BAPI の<strong>前</strong>にロックするんですか？ BAPI 自体が守ってくれないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                BAPI 単体でもある程度は守られます。ただ、<strong>業務単位（会社コードなど）で排他</strong>したい場面では、
                複数プログラムが同時に同じ範囲を触らないよう、<code>ENQUEUE</code> で先に札を出すのが実務の型です。
                「BAPI だけ」より「ロック → BAPI → DEQUEUE」のセットが安全です。
              </Dialog>
              <Dialog speaker="a">
                コードとたとえの対応はこうですね——
                <code>ENQUEUE</code>＝試着室に使用中札、
                <code>sy-subrc &lt;&gt; 0</code>＝札がかかっていたら入らない、
                BAPI 登録＝中で着替える、
                <code>DEQUEUE</code>＝必ず札を外して帰る。
              </Dialog>
              <Callout variant="note">
                関数名 <code>ENQUEUE_EZ_BKPF</code> は BKPF 用ロックオブジェクトの<strong>例</strong>です。
                実プロジェクトでは SE11 などで定義された名前を使います。
                覚えるのは <code>ENQUEUE_</code> / <code>DEQUEUE_</code> がペア、
                引数で「どのキー（ここでは <code>bukrs</code>）をロックするか」を渡す、の2点で十分です。
              </Callout>
            </>
          ),
        },
        {
          title: "登録を支える部品",
          plainText:
            "登録を支える仕組み（一覧）\n登録フローの各段階：検証→ロック→BAPI→コミット→履歴記録。\nアドオンテーブル(ZIFLOG)：取込履歴・結果・エラー内容を保存。\n汎用モジュール：検証ロジックをCALL FUNCTIONで共通化。\nBAPI：伝票登録の公式窓口。ロックオブジェクト：会社コード単位の使用中札。COMMIT WORK：成功後に確定。\nBちゃん：名前の辞書みたいですね。先生：フローのどこで何を使うかが分かれば十分。",
          content: (
            <>
              <h2>登録を支える仕組み（一覧）</h2>
              <p>
                前のスライドの登録フロー（取込 → 検証 → ロック → BAPI → コミット → 履歴）の<strong>各段階</strong>を、
                次の仕組みが支えています。名前は多いですが、「<strong>いつ・何のために使うか</strong>」で覚えると整理しやすいです。
              </p>
              <h3>早見表</h3>
              <ul>
                <li>
                  <strong>アドオンテーブル</strong> … 標準にない情報の保存場所（取込履歴・エラー記録など）
                </li>
                <li>
                  <strong>汎用モジュール</strong> … 検証・変換など、複数プログラムで共通利用する処理（<code>CALL FUNCTION</code>）
                </li>
                <li>
                  <strong>BAPI</strong> … SAP 公式の業務処理窓口（伝票登録。拡張も通る）
                </li>
                <li>
                  <strong>ロックオブジェクト</strong> … 同時更新を防ぐ「使用中」札（<code>ENQUEUE</code> / <code>DEQUEUE</code>）
                </li>
                <li>
                  <strong>コミット</strong>（<code>COMMIT WORK</code>）… 成功した更新を DB に確定する操作
                </li>
              </ul>
              <Dialog speaker="b">
                名前がいっぱいで大変ですね…。辞書みたいに、フローの段階ごとに「これ！」と対応づければいいんですか？
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。実務では詳細を覚えますが、今は
                「検証＝汎用モジュール／ロック＝使用中札／登録＝BAPI／確定＝コミット／履歴＝アドオンテーブル」
                の対応が分かれば OK です。
              </Dialog>
              <InfoPanel
                title="登録フローと仕組みの対応（具体例）"
                variant="reference"
                lead="架空のファイル取込プログラムを想定した例です。実際の名称はプロジェクトごとに異なります。"
              >
                <ul>
                  <li>
                    <strong>① 検証</strong> … <strong>汎用モジュール</strong>（<code>FUNCTION</code>）
                    <br />
                    例：<code>CALL FUNCTION &apos;Z_CHECK_INVOICE_ROW&apos;</code> で CSV 1行の必須チェック・金額形式チェック。
                    同じ検証を別プログラムからも呼べる（<code>FORM</code> のプログラム横断版）
                  </li>
                  <li>
                    <strong>② ロック</strong> … <strong>ロックオブジェクト</strong>
                    <br />
                    例：会社コード <code>1000</code> を <code>ENQUEUE_...</code> で「使用中」にする。
                    終わったら <code>DEQUEUE_...</code> で必ず解放
                  </li>
                  <li>
                    <strong>③ 登録</strong> … <strong>BAPI</strong>
                    <br />
                    例：<code>BAPI_ACC_DOCUMENT_POST</code> など、会計伝票を公式ルートで登録。
                    成功すると伝票番号、失敗するとエラー内容が返る
                  </li>
                  <li>
                    <strong>④ 確定</strong> … <strong>コミット</strong>（<code>COMMIT WORK</code>）
                    <br />
                    例：BAPI が成功したあと <code>COMMIT WORK.</code> で DB に正式反映。
                    ここまで来て初めて「登録完了」。失敗時は <code>ROLLBACK WORK</code> で取り消し
                  </li>
                  <li>
                    <strong>⑤ 履歴・結果の記録</strong> … <strong>アドオンテーブル</strong>（自社用の <code>Z</code> 表）
                    <br />
                    例：<code>ZIFLOG</code> に取込日時・ファイル名・処理結果（OK/NG）・作成伝票番号・エラーメッセージを保存。
                    標準の BKPF/BSEG にはない<strong>取込管理用</strong>の情報向け
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                この章のABAPキーワード：BAPI / ロックオブジェクト / 汎用モジュール / アドオンテーブル / コミット（<code>COMMIT WORK</code>）。
              </Callout>
            </>
          ),
        },
        {
          title: "実装の全体フロー",
          plainText:
            "実装の全体フロー（最重要）\n①ファイル読込 ②行の分解 ③BAPI用データ作成 ④ロック ⑤BAPI ⑥RETURNでエラー判定 ⑦COMMIT/ROLLBACK ⑧履歴更新 ⑨ロック解除。\n第15章が①②、本章が⑧の土台と③〜⑦の責任。",
          content: (
            <>
              <h2>実装の全体フロー（最重要）</h2>
              <p>
                ファイル連携＋会計伝票登録は、次の順序を<strong>1本の処理</strong>として設計します。
                順番を入れ替えると、未検証登録・未確定データ・ロック残りなどの不具合につながります。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  S1[① ファイル読込] --> S2[② 行データの分解]
  S2 --> S3[③ BAPI 用データ作成]
  S3 --> S4[④ 排他ロック]
  S4 --> S5[⑤ BAPI 登録]
  S5 --> S6[⑥ RETURN でエラー判定]
  S6 --> S7[⑦ COMMIT / ROLLBACK]
  S7 --> S8[⑧ 履歴テーブル更新]
  S8 --> S9[⑨ ロック解除]`}
              />
              <InfoPanel title="各段の担当（章との対応）" variant="reference">
                <ul>
                  <li>
                    <strong>①②</strong> … 第15章（<code>OPEN DATASET</code>・<code>SPLIT</code> など）
                  </li>
                  <li>
                    <strong>③〜⑦</strong> … 本章（BAPI・ロック・確定）
                  </li>
                  <li>
                    <strong>⑧</strong> … 本章のアドオンテーブル・汎用モジュール（履歴・重複チェック）
                  </li>
                  <li>
                    <strong>⑨</strong> … 本章（<code>DEQUEUE</code> は成功・失敗どちらでも）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                開発ではパーツごとに作ることもありますが、本番はこの図のように<strong>つながった1本</strong>なんですね。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="15-files-jobs-and-batch"
                slide={5}
                label="第15章: ファイル読込（①②）の詳細へ"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "コードで見る：登録の型",
          plainText:
            "コードで見る：登録の型\n架空のファイル取込プログラムの骨格。①検証→②ロック→③BAPI→④RETURN確認→⑤COMMIT/ROLLBACK→⑥履歴→⑦DEQUEUE。\n検証失敗はCONTINUE、RETURNにEがあればROLLBACK、成功のみCOMMIT、最後に必ずDEQUEUE。",
          content: (
            <>
              <h2>コードで見る：登録の型</h2>
              <p>
                前のスライドで整理した5段階を、1本のループにまとめた<strong>骨格</strong>です。
                細部はプロジェクトごとに異なりますが、「型」の順番は守ります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_csv INTO ls_row.

  " ① 検証（汎用モジュール）
  CALL FUNCTION 'Z_CHECK_INVOICE_ROW'
    EXPORTING is_row = ls_row
    IMPORTING ev_ok  = lv_ok ev_msg = lv_msg.
  IF lv_ok = abap_false.
    PERFORM log_result USING ls_row lv_msg.  " ZIFLOG へ NG 記録
    CONTINUE.
  ENDIF.

  " ② ロック
  CALL FUNCTION 'ENQUEUE_EZ_BKPF'
    EXPORTING mode_bkpf = 'E' bukrs = ls_row-bukrs
    EXCEPTIONS OTHERS = 1.
  IF sy-subrc <> 0. CONTINUE. ENDIF.

  " ③ BAPI で登録
  PERFORM build_bapi_data USING ls_row
    CHANGING ls_header lt_gl lt_return.
  CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'
    EXPORTING documentheader = ls_header
    TABLES    accountgl      = lt_gl
              return           = lt_return
    IMPORTING obj_key         = lv_belnr
    EXCEPTIONS OTHERS = 1.

  " ④ RETURN でエラー判定 → 確定 or 取り消し
  PERFORM check_bapi_return USING lt_return CHANGING lv_error.
  IF sy-subrc = 0 AND lv_error = abap_false.
    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'.
    PERFORM log_result USING ls_row lv_belnr.  " 履歴へ OK + 伝票番号
  ELSE.
    CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
    PERFORM log_result USING ls_row sy-msgv1.  " 履歴へ NG + エラー
  ENDIF.

  " ⑤ ロック解放（成功・失敗どちらでも）
  CALL FUNCTION 'DEQUEUE_EZ_BKPF'
    EXPORTING mode_bkpf = 'E' bukrs = ls_row-bukrs.

ENDLOOP.`}
              />
              <InfoPanel
                title="1行ずつ読む（登録の型）"
                variant="breakdown"
                lead="図解の sequence と同じ流れを、コード上で追います。"
              >
                <ul>
                  <li>
                    <strong>① 検証</strong> … <code>CALL FUNCTION 'Z_CHECK_...'</code>。
                    失敗行は <code>CONTINUE</code> でスキップ（登録しない）
                  </li>
                  <li>
                    <strong>② ロック</strong> … 書き込み前に <code>ENQUEUE</code>。
                    取れなければその行は諦める（無理に二重登録しない）
                  </li>
                  <li>
                    <strong>③ BAPI</strong> … 登録実行。<code>RETURN</code> と <code>sy-subrc</code> の<strong>両方</strong>を見る
                  </li>
                  <li>
                    <strong>④ 確定</strong> … エラーがなければ <code>BAPI_TRANSACTION_COMMIT</code> 等で確定。
                    エラー時は <code>ROLLBACK</code>
                  </li>
                  <li>
                    <strong>⑤ 履歴</strong> … アドオンテーブルへ OK/NG・伝票番号・エラーを記録（標準テーブルとは別）
                  </li>
                  <li>
                    <strong>⑥ DEQUEUE</strong> … ループの各行の最後に必ず実行（使用中札を戻す）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                <code>DEQUEUE</code> は <code>IF</code> の外側ですね。
                成功でも失敗でも、必ず札を戻す——<code>finally</code> で片付けるイメージです。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で OK です。ABAP には <code>finally</code> はありませんが、
                「成功・失敗どちらの分岐の<strong>後</strong>に <code>DEQUEUE</code> を書く」が鉄則です。
              </Dialog>
              <Dialog speaker="a">
                <code>ZIFLOG</code> への記録は、BAPI の<strong>後</strong>（結果が分かってから）ですね。
                成功なら伝票番号、失敗ならエラーメッセージを残す。
              </Dialog>
            </>
          ),
        },
        {
          title: "「見る」と「登録」の整理",
          plainText:
            "照会と登録、責任の違いを整理\nAくん：照会は読み取りだけ＝安全。登録は書き込み＝整合性・排他・確定（コミット）まで責任を持つ、という違い。\nBちゃん：見るのは気軽、書くのは責任重大。心構えから違うんですね。\n先生：その通り。だから登録処理は検証 → ロック → BAPI → コミット → 結果記録という型を守る。怖がる必要はなく型どおりに進めれば大丈夫。",
          content: (
            <>
              <h2>照会と登録、責任の違いを整理</h2>
              <Dialog speaker="a">
                照会は読み取りだけ＝安全。登録は書き込み＝整合性・排他・確定（コミット）まで責任を持つ、という違いですね。
              </Dialog>
              <Dialog speaker="b">
                見るのは気軽、書くのは責任重大。心構えから違うんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。だから登録処理は「検証 → ロック → BAPI → コミット → 結果記録」という型を守ります。怖がる必要はなく、型どおりに進めれば大丈夫です。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\nBちゃん：この章は複雑でした。下書き→清書、取込から履歴まで1セット、が心の整理。\nAくん：BAPIは標準＋拡張も通る公式窓口。直接INSERTは両方すっ飛ばす。\nBちゃん：コミットを飛ばすと未確定、DEQUEUE忘れは使用中札のまま。\nAくん：ZIFLOGは取込管理、BKPF/BSEGは伝票本体で役割が違う。\n先生：検証→ロック→BAPI→コミット→履歴の型を守れば大丈夫。名前は段階と対応づけて覚える。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章は「見る処理」から「書き込む処理」へ、<strong>責任の重さが変わる</strong>転換点です。
                キーワードは多いですが、芯は「型どおりに進めて、整合性を壊さない」ことだけ覚えてください。
              </Dialog>
              <Dialog speaker="b">
                正直、いちばん複雑に感じた章でした…。でも心の整理としては、
                「照会＝下書き、登録＝清書」で、取込から<strong>履歴を残すまでが1セット</strong>、ですよね。
              </Dialog>
              <Dialog speaker="teacher">
                いいまとめです。流れは次の5段階を順番に守る——
                <strong>検証 → ロック → BAPI → コミット → 履歴記録</strong>。
                途中で飛ばすと、未チェック登録や未確定データにつながります。
              </Dialog>
              <Dialog speaker="a">
                BAPI は SAP 公式の窓口なので、標準チェックと関連更新に加え、
                会社の<strong>拡張</strong>も通ります。直接 <code>INSERT</code> は、
                標準だけでなく自社ルールもすっ飛ばす——だから使わない、と理解しました。
              </Dialog>
              <Dialog speaker="stumble">
                「とりあえず INSERT」の近道は、一見ラクに見えて後から大事故になりやすい。
                登録系は<strong>型から外れない</strong>のが安全策です。
              </Dialog>
              <Dialog speaker="b">
                ロックは「使用中」札、コミットは「正式に押印」——たとえで言うとそうですよね。
                もし<strong>コミットを忘れたら</strong>どうなりますか？ あと、<code>DEQUEUE</code> を忘れると？
              </Dialog>
              <Dialog speaker="teacher">
                コミット前は、まだ「確定していない」状態です。成功メッセージが出ても、
                確定前に止まると中途半端になり得ます。
                <code>DEQUEUE</code> 忘れは、使用中札を出したまま帰るのと同じ——
                他の処理がずっと待たされます。どちらも<strong>終了処理まで含めて1セット</strong>です。
              </Dialog>
              <Dialog speaker="a">
                アドオンテーブル（例：<code>ZIFLOG</code>）は、取込の成功/失敗やファイル名を残す<strong>管理用</strong>。
                伝票本体は BKPF/BSEG 側で、BAPI 経由で更新される——保存場所の役割が違いますね。
              </Dialog>
              <Dialog speaker="b">
                名前はまだ全部覚えられませんが、
                「検証＝汎用モジュール／ロック＝札／登録＝BAPI／確定＝コミット／履歴＝アドオンテーブル」
                と対応づけると、だいぶ怖くなくなりました。
              </Dialog>
              <Dialog speaker="teacher">
                それで十分です。実務では詳細を深めますが、今は<strong>型と役割</strong>が分かれば OK。
                登録は責任が重いぶん、SAP 側も守りの仕組みを用意してくれています。型に乗れば安全に進めます。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 会計伝票を登録する正しい方法は？→ BAPIなど公式の手段を通して登録する\nQ2 ロックオブジェクトの役割は？→ 同時更新による不整合を防ぐ\nQ3 安全な会計伝票登録フローは？→ 検証してからロックし、BAPI後にコミットして結果を残す\n今日のひとこと：登録は責任が重いぶん、守りの型がしっかり用意されています。型に乗れば安全に進めます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="会計伝票は、整合性を保つため SAP公式の窓口である BAPI 等を通して登録します。テーブルへの直接書き込みは厳禁です。公式手段を使うことで、関連データ更新や業務チェックが一貫して適用され、障害時の追跡性も確保できます。"
                question={<strong>会計伝票を登録する正しい方法は？</strong>}
                options={[
                  "テーブルに直接 INSERT する",
                  "BAPI など公式の手段を通して登録する",
                  "WRITE で画面に出すだけでよい",
                ]}
              />
              <Quiz
                answer={0}
                explanation="ロックオブジェクトは「使用中」の札のように、複数の処理が同時に同じデータを更新して壊すのを防ぎます。登録系処理では排他制御がないと重複更新や不整合が発生しやすいため、ロック取得と解放を必ず設計に含めます。"
                question={<strong>ロックオブジェクトの役割は？</strong>}
                options={["同時更新による不整合を防ぐ", "画面を見やすく整える", "データを並べ替える"]}
              />
              <Quiz
                answer={2}
                explanation="登録処理は「検証→ロック→BAPI登録→コミット→結果記録」の順で進めると、失敗時の切り戻しと成功時の追跡がしやすくなります。順序を崩すと、未検証登録や確定漏れなど重大な不具合につながります。"
                question={<strong>安全な会計伝票登録フローとして最も適切なのは？</strong>}
                options={[
                  "BAPI登録だけ行い、結果記録は省略する",
                  "ロックより先にコミットしてから検証する",
                  "検証してからロックし、BAPI後にコミットして結果を残す",
                ]}
              />
              <Quiz
                answer={1}
                explanation="BAPI の成否は RETURN テーブルの TYPE（E/A など）で判定するのが基本です。SY-SUBRC だけではエラーを見逃すことがあります。エラー時は COMMIT せず ROLLBACK します。"
                question={<strong>BAPI 登録後のエラー判定として適切なのは？</strong>}
                options={[
                  "RETURN を見ずに SY-SUBRC だけで COMMIT する",
                  "RETURN の TYPE が E の行がないことを確認してから COMMIT する",
                  "エラーがあっても COMMIT してから履歴に書く",
                ]}
              />
              <Dialog speaker="closing">
                登録は責任が重いぶん、守りの型がしっかり用意されています。型に乗れば安全に進めます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(DocumentPostingLesson);
