import {
  Lesson,
  lessonChrome,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "SELECT — DB取得・SY-SUBRC・会計テーブル（BKPF/BSEG）",
  meta: "初学者 · 25分",
};

export default function SelectFromDbLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "06-select-from-db", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "データベースから取得する\n倉庫から取ってくる依頼（SELECT）→ 本当に取れたか確認（SY-SUBRC）の2段で学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・SELECT ＝ 倉庫番への取り出し依頼（条件で絞る）\n・SY-SUBRC ＝ 依頼のあと、本当に箱が取れたかの確認\n・会計でよく使う表（BKPF / BSEG / T001 / T003T）が何の情報か",
          content: (
            <>
              <hgroup>
                <h1>データベースから取得する</h1>
                <p>
                  <strong>倉庫から取ってくる依頼</strong>（<code>SELECT</code>）→{" "}
                  <strong>本当に取れたか確認</strong>（<code>SY-SUBRC</code>）の2段で学びます。
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
                <li><code>SELECT</code>＝ 倉庫番への<strong>取り出し依頼</strong>（条件で絞る）</li>
                <li><code>SY-SUBRC</code>＝ 依頼のあと、<strong>本当に箱が取れたか</strong>の確認</li>
                <li>会計でよく使う表（BKPF / BSEG / T001 / T003T）が何の情報か</li>
              </ul>
            </>
          ),
        },
        {
          title: "倉庫のたとえ",
          plainText:
            "SELECT ＝ 倉庫への取り出し依頼\nデータベースは巨大な倉庫。SELECT は倉庫番に条件付きで箱の取り出しを依頼する命令。全部依頼すると運びきれないので、前章の入力＝条件（WHERE）で絞る。\nBちゃん：依頼メモ（WHERE）を渡して、必要な箱だけ運んでもらう感じですね。",
          content: (
            <>
              <h2><code>SELECT</code> ＝ 倉庫への取り出し依頼</h2>
              <p>
                データベースは箱（データ）が並んだ巨大な倉庫です。
                <code>SELECT</code> は倉庫番に<strong>「この条件の箱を持ってきて」</strong>と依頼する命令です。
              </p>
              <Figure
                src="image/06-warehouse-pick.webp"
                alt="巨大な倉庫の棚から、倉庫番が『条件に合う箱だけ』を選んで台車に載せて運び出すイラスト。条件メモ（WHERE）を見ながら必要な箱だけピックする様子。"
                caption="倉庫番に条件（WHERE）を伝え、必要な箱だけ取り出してもらう"
                kind="concept"
              />
              <Dialog speaker="teacher">
                全部依頼すると運びきれません。前章の「入力＝条件」を <code>WHERE</code> に書いて、必要な箱だけ依頼します。
              </Dialog>
              <Dialog speaker="b">
                依頼メモ（<code>WHERE</code>）を渡す感じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "会計の主な表",
          plainText:
            "会計でよく出る表（ざっくり）\nBKPF：伝票ヘッダ（日付・会社など）\nBSEG：伝票明細（金額・科目）\nT001：会社マスタ（辞書）\nT003T：伝票タイプ名称（辞書）\nAくん：第2章のヘッダと明細が BKPF / BSEG になっている。\n先生：T001 などはコードを名前に変える辞書。",
          content: (
            <>
              <h2>会計でよく出る表（ざっくり）</h2>
              <p>細かい列名は今は不要。「どんな情報の表か」だけ掴めば十分です。</p>
              <Figure
                src="image/06-bkpf-bseg.webp"
                alt="会計テーブルの関係図。BKPF（ヘッダ：1件1行）とBSEG（明細：同じ伝票で複数行）が会社コード＋伝票番号＋会計年度でつながる。横にT001（会社マスタ＝辞書）とT003T（伝票タイプ名称＝辞書）を補助テーブルとして配置。"
                caption="BKPF（ヘッダ）と BSEG（明細）は伝票キー（会社コード＋伝票番号＋会計年度）でつながる。T001/T003T は“意味を引く辞書”"
                kind="diagram"
              />
              <ul>
                <li><strong>BKPF</strong>：会計伝票の<strong>ヘッダ</strong>（見出し：日付・会社など）</li>
                <li><strong>BSEG</strong>：会計伝票の<strong>明細</strong>（中身の行：金額・科目）</li>
                <li><strong>T001</strong>：会社コードの<strong>マスタ</strong>（会社の一覧）</li>
                <li><strong>T003T</strong>：伝票タイプの<strong>名称</strong>（コードの読み仮名表）</li>
              </ul>
              <Dialog speaker="a">
                第2章の「ヘッダと明細」が BKPF / BSEG になっているんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。両者は「会社コード＋伝票番号＋会計年度」の3つで1件に結びつきます（伝票番号だけでは一意になりません）。
              </Dialog>
              <Dialog speaker="teacher">
                T001 のようなマスタは「コードの意味を引く辞書」です。番号だけでは伝わらないので、名前に変換するときに使います。
              </Dialog>
            </>
          ),
        },
        {
          title: "SELECTの基本形",
          plainText:
            "倉庫への依頼（SELECT）\n選択画面の条件を WHERE に書き、BKPF から取得。結果は内部テーブル lt_bkpf（手元の棚）へ。\nSELECT belnr budat bukrs FROM bkpf INTO TABLE lt_bkpf WHERE bukrs = p_bukrs AND budat IN s_budat.\nAくん：列を絞るのは、要らない箱まで運ばないため？\n先生：その通り。必要な列だけが基本。",
          content: (
            <>
              <h2>倉庫への依頼（<code>SELECT</code>）</h2>
              <p>
                選択画面の条件を <code>WHERE</code> に書き、伝票ヘッダ（BKPF）から取得します。
                返ってきたデータは内部テーブル <code>lt_bkpf</code>（手元の棚）に受け取ります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SELECT belnr budat bukrs
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs
    AND budat IN s_budat.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SELECT belnr budat bukrs</code> … 必要な列だけ指定
                </li>
                <li>
                  <code>FROM bkpf</code> … 伝票ヘッダ表から取得
                </li>
                <li>
                  <code>INTO TABLE lt_bkpf</code> … 複数行を内部テーブルへ一括受け取り
                </li>
                <li>
                  <code>WHERE ...</code> … 選択画面の会社・日付で絞り込み
                </li>
              </ul>
              <Dialog speaker="a">
                列を絞るのは、要らないデータまで運ばないためですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。依頼も受け取りも、必要最小限にします。なお本コースは読みやすさ優先の「クラシック構文」で書いています。新しい厳格構文ではカンマと <code>@</code> を付けて <code>SELECT belnr, budat, bukrs ... INTO TABLE @lt_bkpf</code> のように書きます。
              </Dialog>
            </>
          ),
        },
        {
          title: "取れた？取れない？",
          plainText:
            "本当に取れたか確認（SY-SUBRC）\n依頼（SELECT）の直後に SY-SUBRC を見る。0＝1件以上、0以外＝0件。\nIF sy-subrc = 0. → 続行 / ELSE → MESSAGE で該当なしを伝える。\nつまずき：依頼だけして確認せず、空のまま後続処理へ進む。\nBちゃん：台車が空っぽなら次へ進まない。",
          content: (
            <>
              <h2>本当に取れたか確認（<code>SY-SUBRC</code>）</h2>
              <p>
                ①の依頼（<code>SELECT</code>）の<strong>直後</strong>、<code>SY-SUBRC</code> に結果が入ります。
                <code>0</code>＝1件以上、<code>0</code>以外＝0件（該当なし）です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SELECT belnr budat bukrs
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs
    AND budat IN s_budat.

IF sy-subrc = 0.
  " 取れた → 続けて処理
ELSE.
  MESSAGE '該当する伝票がありません' TYPE 'I'.
ENDIF.`}
              />
              <h3>追記した2行</h3>
              <ul>
                <li>
                  <code>IF sy-subrc = 0.</code> … 箱が1個以上あるときだけ後続処理へ
                </li>
                <li>
                  <code>MESSAGE ... TYPE &apos;I&apos;.</code> … 0件のとき利用者に「該当なし」を伝える
                </li>
              </ul>
              <Dialog speaker="stumble">
                依頼しただけで確認せず、空の内部テーブルのまま <code>LOOP</code> や帳票出力へ進むのがよくあるミスです。
              </Dialog>
              <Dialog speaker="b">
                台車が空っぽなら次へ進まない、ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：依頼→確認→分岐は登録処理でも繰り返す基本の型。\nAくん：BKPF/BSEG を切り分け、0件を前提に分岐を置く。\nBちゃん：0件のときは MESSAGE で状態を伝える。",
          content: (
            <>
              <h2>対話で整理</h2>
              <MermaidDiagram
                chart={`flowchart TD
  A[選択画面の条件] --> B[SELECT 依頼]
  B --> C{SY-SUBRC = 0?}
  C -->|はい| D[後続処理]
  C -->|いいえ| E[MESSAGE]`}
              />
              <Dialog speaker="teacher">
                この型は登録処理でも繰り返します。ヘッダ用・明細用で表を分け、<code>WHERE</code> で絞って依頼し、<code>SY-SUBRC</code> で確認してから次へ進みます。
              </Dialog>
              <Dialog speaker="a">
                0件の可能性を前提に分岐を置くと、後続処理が安全になりますね。
              </Dialog>
              <Dialog speaker="b">
                0件のときは <code>MESSAGE</code> で利用者に伝える、と意識します。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 明細の表 → BSEG\nQ2 取れたかの判定 → SY-SUBRC = 0\nQ3 複数件の取得 → SELECT ... INTO TABLE ... WHERE ...\n締め：依頼して終わりにせず、確認まで。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="BKPFは伝票ヘッダ（見出し）、BSEGは明細（中身の行）。第2章のヘッダ/明細がそのまま表になっています。用途に応じて参照先を分けることで、取得項目を最小化しクエリの意図も明確になります。"
                question={<strong>会計伝票の「明細」にあたる表はどれ？</strong>}
                options={["BKPF", "BSEG", "T001"]}
              />
              <Quiz
                answer={0}
                explanation="SELECT直後の SY-SUBRC が 0 なら取得成功。0以外は該当なし。必ず確認してから分岐します。確認せず処理を続けると、空データのまま帳票出力や後続ロジックへ進み、原因調査が難しくなります。"
                question={<strong>SELECT でデータが取れたかは、何を見て判断する？</strong>}
                options={["SY-SUBRC が 0 かどうか", "WRITE の出力結果", "PARAMETERS の値"]}
              />
              <Quiz
                answer={2}
                explanation="SELECT ... INTO TABLE は複数件を一括で内部テーブルへ受けるための基本形で、後続のLOOP処理と相性が良い構造です。1件だけを前提にするときはSELECT SINGLEを使い、要件に合わせて使い分けます。"
                question={<strong>条件に合う複数伝票をまとめて取得したいときの基本構文は？</strong>}
                options={[
                  "SELECT SINGLE ... INTO ...",
                  "READ TABLE ... WITH KEY ...",
                  "SELECT ... INTO TABLE ... WHERE ...",
                ]}
              />
              <Dialog speaker="closing">
                「依頼して終わり」ではなく「本当に取れたか確認」まで。これができると一気にプロっぽくなります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SelectFromDbLesson);
