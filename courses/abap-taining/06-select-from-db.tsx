import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  InfoPanel,
  LessonLinkButton,
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
            "データベースから取得する\n倉庫から取ってくる依頼（SELECT）→ 本当に取れたか確認（SY-SUBRC）の2段で学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・SELECT ＝ 倉庫番への取り出し依頼（条件で絞る）\n・件数に応じた SELECT の出し方（まとめて取る／1箱だけ／存在確認）\n・SY-SUBRC ＝ 依頼のあと、本当に箱が取れたかの確認\n・会計でよく使う表（BKPF / BSEG / T001 / T003T）が何の情報か",
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
                <li>何件取るか・どこに受け取るかで変わる <code>SELECT</code> の出し方</li>
                <li><code>SY-SUBRC</code>＝ 依頼のあと、<strong>本当に箱が取れたか</strong>の確認</li>
                <li>会計でよく使う表（BKPF / BSEG / ACDOCA / T001 / T003T）が何の情報か</li>
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
            "会計でよく出る表（ざっくり）\nBKPF：伝票ヘッダ（日付・会社など）\nBSEG：伝票明細（金額・科目）\nACDOCA：Universal Journal（S/4HANA以降の統合会計）\nT001：会社マスタ（辞書）\nT003T：伝票タイプ名称（辞書）\nAくん：第2章のヘッダと明細が BKPF / BSEG になっている。\n先生：T001 などはコードを名前に変える辞書。",
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
                <li>
                  <strong>ACDOCA</strong>：S/4HANA 以降の<strong>Universal Journal</strong>
                  （統合会計テーブル。環境によっては BKPF/BSEG の代わりにこちらを参照する）
                </li>
                <li><strong>T001</strong>：会社コードの<strong>マスタ</strong>（会社の一覧）</li>
                <li><strong>T003T</strong>：伝票タイプの<strong>名称</strong>（コードの読み仮名表）</li>
              </ul>
              <Dialog speaker="a">
                第2章の「ヘッダと明細」が BKPF / BSEG になっているんですね。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="02-business-basics"
                label="第2章: ヘッダと明細を復習する"
                variant="back"
                className="mb-4"
              />
              <Dialog speaker="teacher">
                そうです。両者は「会社コード＋伝票番号＋会計年度」の3つで1件に結びつきます（伝票番号だけでは一意になりません）。
              </Dialog>
              <Dialog speaker="teacher">
                T001 のようなマスタは「コードの意味を引く辞書」です。番号だけでは伝わらないので、名前に変換するときに使います。
                ACDOCA は第2章でも触れた統合版——<strong>まずは BKPF / BSEG を軸</strong>に覚え、環境に応じて ACDOCA を使う、と理解しておけば十分です。
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
          title: "何件・どこへ受け取るか",
          plainText:
            "何件・どこへ受け取るか\nSELECTの書き方は「何件欲しいか」「手元の棚か机の上か」で決める。名前を4つ覚えるより、この2問が先。\n複数件：INTO TABLEで台車いっぱい（倉庫往復1回）。選択画面で絞ったBKPF一覧が典型。\n1件だけ：キーが揃っているときSELECT SINGLE。会社＋伝票番号＋年度で1伝票を机（作業領域）へ。\n存在だけ知りたい：UP TO 1 ROWSで入口で1箱だけ見る。中身は全部運ばない。\n避ける型：SELECT～ENDSELECTは1箱ごとに倉庫往復。第13章で詳しく。\nBちゃん：まとめて運ぶのがこの章の基本形ですね。",
          content: (
            <>
              <h2>何件取る？ どこに置く？</h2>
              <p>
                <code>SELECT</code> にはいくつかの書き方がありますが、
                まず覚えるのは<strong>2つの問い</strong>です。
              </p>
              <ul>
                <li><strong>何件</strong>欲しい？（0件かもしれない／1件／たくさん）</li>
                <li>受け取り先は<strong>手元の棚</strong>（内部テーブル）か、<strong>机の上の1箱</strong>（作業領域）か？</li>
              </ul>
              <Dialog speaker="teacher">
                用語の一覧を丸暗記するより、「この画面では何件・どこへ？」と自分に聞く習慣をつけてください。
              </Dialog>

              <h3>複数件 → 台車いっぱいにまとめて（<code>INTO TABLE</code>）</h3>
              <p>
                選択画面で会社と日付を指定し、<strong>条件に合う伝票をまとめて</strong>扱うときが典型です。
                倉庫番は条件に合う箱を<strong>一度の往復で台車に載せ</strong>、
                手元の棚 <code>lt_bkpf</code> に並べます。これが先ほどの <code>INTO TABLE</code> です。
              </p>
              <Dialog speaker="b">
                往復は1回で、あとは棚の上で <code>LOOP</code> すればいいんですね。
              </Dialog>

              <h3>1件だけ → 伝票キーが揃っているとき（<code>SELECT SINGLE</code>）</h3>
              <p>
                「この会社の、この伝票番号の、この年度」——
                伝票を<strong>1件に特定できる</strong>ときは、箱を1つだけ机に置きます。
                受け取り先は<strong>作業領域</strong>（構造）で、内部テーブルには入れません。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SELECT SINGLE belnr budat bukrs
  FROM bkpf
  INTO ls_bkpf
  WHERE bukrs = p_bukrs
    AND belnr = p_belnr
    AND gjahr = p_gjahr.`}
              />
              <Dialog speaker="a">
                会社コード＋伝票番号＋会計年度、の3つが揃っているから SINGLE で取れるんですね。
              </Dialog>
              <Dialog speaker="stumble">
                キーが足りないのに <code>SINGLE</code> すると、条件に合う「最初の1行」が返るだけで、
                意図した伝票とは限りません。1件に絞れる条件かどうかを先に確認します。
              </Dialog>

              <h3>「あるかだけ知りたい」とき</h3>
              <p>
                日付の範囲だけなど、<strong>まだ1件に特定できない</strong>条件で
                「該当データが1件でもあるか」を調べるときは、
                倉庫の入口で<strong>1箱だけ見て帰る</strong>イメージです。
                <code>SELECT ... UP TO 1 ROWS ... ENDSELECT</code> のように、
                件数に上限を付けて中身を全部運ばない書き方を使います。
              </p>
              <Dialog speaker="teacher">
                この章のメインは「まとめて取って、棚で扱う」です。
                存在確認だけのパターンは、ここでは名前だけ知っておけば十分。実装で迷ったら先輩のコードを見る場面が多いです。
              </Dialog>

              <h3>避けたい型：<code>SELECT</code> ～ <code>ENDSELECT</code></h3>
              <p>
                条件に合う行を<strong>1行ずつ</strong>取りに行く書き方もありますが、
                行の数だけ倉庫へ往復するため、件数が増えると一気に遅くなります。
                可能なら <code>INTO TABLE</code> でまとめて取り、第5章の内部テーブル操作に任せます。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  Q{何件?}
  Q -->|複数| T["INTO TABLE<br/>台車でまとめて"]
  Q -->|1件・キー完備| S["SELECT SINGLE<br/>机に1箱"]
  Q -->|あるかだけ| E["UP TO 1 ROWS<br/>入口で1箱確認"]
  Q -.->|避ける| L["SELECT～ENDSELECT<br/>1行ごとに往復"]`}
              />
              <Dialog speaker="teacher">
                性能の話は第13章で深掘りします。今は「まとめて運ぶのが基本形」と覚えてください。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="05-internal-tables"
                label="第5章: 内部テーブル操作を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "条件分岐（IF / CASE）",
          plainText:
            "条件分岐 IF / CASE\n取得結果や項目値に応じて処理を分ける。SY-SUBRC の確認も IF で行う。\nIF sy-subrc <> 0. MESSAGE 'データなし' TYPE 'E'. ENDIF.\nCASE ls_bkpf-blart. WHEN 'SA'. ... WHEN OTHERS. ... ENDCASE.\nAくん：IF は二択、CASE は複数の値から選ぶ、という使い分けですね。\n先生：SELECT 後の IF sy-subrc が最重要。CASE は伝票タイプごとに表示を変えたいときなどに使います。",
          content: (
            <>
              <h2>条件分岐（<code>IF</code> / <code>CASE</code>）</h2>
              <p>
                取得結果や項目の値に応じて、処理の道筋を変えます。
                照会レポートでいちばん重要なのは、<code>SELECT</code> のあとに <code>IF sy-subrc</code> で分岐することです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`IF sy-subrc <> 0.
  MESSAGE 'データなし' TYPE 'E'.
ENDIF.

" 複数の値から分岐したいとき
CASE ls_bkpf-blart.
  WHEN 'SA'.
    " 総勘定元帳伝票
  WHEN 'KR'.
    " 仕入先伝票
  WHEN OTHERS.
    " その他
ENDCASE.`}
              />
              <Callout variant="note">
                <code>IF</code> … はい／いいえの二択、または <code>ELSEIF</code> で段階的に分岐。
                <code>CASE</code> … 1つの変数の値が決まった候補のどれか、という分岐向け。
              </Callout>
              <Dialog speaker="a">
                <code>IF</code> は二択、<code>CASE</code> は複数の値から選ぶ、という使い分けですね。
              </Dialog>
              <Dialog speaker="teacher">
                <code>SELECT</code> のあとに <code>IF sy-subrc</code> で結果を確認する——これが安全なレポートの基本です。0件のときにそのまま <code>LOOP</code> や帳票出力へ進まないようにします。
              </Dialog>
            </>
          ),
        },
        {
          title: "メッセージ（MESSAGE）",
          plainText:
            "MESSAGE で利用者に伝える\n処理結果やエラーを画面に表示する。TYPE で種類（S/E/W/I/A）を指定する。\nMESSAGE s001(z01) WITH '1000' 'BKPF'.\nS＝成功／E＝エラー（処理停止）／W＝警告／I＝情報／A＝強制終了\nBちゃん：E は赤いエラーで止まる、I は青いお知らせ、というイメージですね。",
          content: (
            <>
              <h2>メッセージ（<code>MESSAGE</code>）</h2>
              <p>
                処理結果やエラーを、利用者の画面に伝えます。
                データが0件のときに <code>MESSAGE</code> で「該当なし」を知らせる場面が典型です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" テキストを直接書く（手軽な方法）
MESSAGE '該当する伝票がありません' TYPE 'I'.

" メッセージクラスを使う（実務でよく見る形）
MESSAGE s001(z01) WITH '1000' 'BKPF'.`}
              />
              <InfoPanel
                title="MESSAGE TYPE の意味"
                variant="reference"
                lead="TYPE の1文字で、画面の見え方と処理への影響が決まります。"
              >
                <ul>
                  <li>
                    <code>S</code> … Success（成功）。緑のステータスバー
                  </li>
                  <li>
                    <code>E</code> … Error（エラー）。処理を停止する
                  </li>
                  <li>
                    <code>W</code> … Warning（警告）。続行可能だが注意を促す
                  </li>
                  <li>
                    <code>I</code> … Information（情報）。該当なしのお知らせなど
                  </li>
                  <li>
                    <code>A</code> … Abend（強制終了）。重大エラーでプログラムを止める
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                <code>E</code> は赤いエラーで止まる、<code>I</code> は青いお知らせ、というイメージですね。
              </Dialog>
              <Dialog speaker="teacher">
                0件のときは <code>TYPE &apos;I&apos;</code> か <code>&apos;E&apos;</code> を使い分けます。
                「続行して空の帳票を出す」のが <code>I</code>、「条件を見直してほしい」のが <code>E</code>、という整理です。
              </Dialog>
            </>
          ),
        },
        {
          title: "取れた？取れない？",
          plainText:
            "本当に取れたか確認（SY-SUBRC）\n依頼（SELECT）の直後に SY-SUBRC を見る。0＝1件以上、0以外＝0件。\nIF sy-subrc = 0. → 続行 / ELSE → MESSAGE で該当なしを伝える。\nつまずき：依頼だけして確認せず、空のまま後続処理へ進む。\n補足：実行中の値は第14章のデバッガで、SELECT直後にブレークポイントを置いて確認できる。\nBちゃん：台車が空っぽなら次へ進まない。",
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
              <Callout variant="note">
                実行中の値を確実に確認したいときは、<code>SELECT</code> 直後の行にブレークポイントを置いて
                デバッガで <code>sy-subrc</code> と <code>lt_bkpf</code> の中身を見ます。
                <br />
                <strong>
                  ブレークポイントの具体的な置き方と、デバッガ画面の見方は次のスライドで説明します。
                </strong>
              </Callout>
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
          title: "BREAK-POINTの使い方",
          plainText:
            "BREAK-POINTで止めて値を確認\nSELECTの直後に BREAK-POINT を置くと、取得結果確認の場所で必ず停止する。\nデバッガは BREAK-POINT で開く。右下の変数（Variables）を見て、sy-subrc や lt_bkpf の値を確認する。\n変数名によっては「グローバル」タブに表示されるので、ローカル/グローバルを切り替えて探す。",
          content: (
            <>
              <h2>
                <code>BREAK-POINT</code> でデバッガを開く
              </h2>
              <p>
                値の確認を確実にしたいときは、<code>SELECT</code> の直後に <code>BREAK-POINT</code> を置きます。
                実行時にその行で停止し、デバッガが開きます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SELECT belnr budat bukrs
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs
    AND budat IN s_budat.

BREAK-POINT.

IF sy-subrc = 0.
  " 取得成功
ENDIF.`}
              />
              <InfoPanel
                title="見る場所（デバッガ画面）"
                variant="reference"
                lead="止まったら、まず右下の変数ウィンドウを確認します。"
              >
                <ol>
                  <li>
                    <code>BREAK-POINT</code> 行で停止するとデバッガが開く
                  </li>
                  <li>
                    画面<strong>右下</strong>の変数（Variables）で <code>sy-subrc</code>、<code>lt_bkpf</code> を確認
                  </li>
                  <li>
                    変数名によって表示場所が変わるため、見つからないときは<strong>グローバル</strong>タブも確認
                  </li>
                </ol>
              </InfoPanel>
              <Dialog speaker="teacher">
                ローカル変数はローカル側、プログラム全体で使う変数はグローバル側に出ることがあります。
                見えないときはタブを切り替えて探す癖をつけると、調査が速くなります。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="14-sap-development-tools"
                label="もっと知りたい？　第14章（デバッグ詳細）で理解を深める"
                className="mb-4"
              />
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
            "理解度チェック\nQ1 明細の表 → BSEG\nQ2 取れたかの判定 → SY-SUBRC = 0\nQ3 複数件の取得 → SELECT ... INTO TABLE ... WHERE ...\nQ4 1件だけ・キー全部指定 → SELECT SINGLE\n締め：依頼して終わりにせず、確認まで。",
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
              <Quiz
                answer={0}
                explanation="伝票キー（会社コード＋伝票番号＋会計年度）が揃っていて1件だけ机（作業領域）に受け取るときは SELECT SINGLE です。複数件を棚に載せるなら INTO TABLE。1行ずつ倉庫へ行く SELECT～ENDSELECT はこの章では避ける型として覚えます。"
                question={
                  <strong>
                    キー項目をすべて条件に指定して、1件だけ変数に受け取りたいときに向いているのは？
                  </strong>
                }
                options={[
                  "SELECT SINGLE ... INTO ...",
                  "SELECT ... ENDSELECT（件数分DBアクセス）",
                  "SELECT ... INTO TABLE ...（複数件一括）",
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
