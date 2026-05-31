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
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "データベースから取得する",
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
            "データベースから取得する\nSELECT が何をしているのか。取れたか・取れなかったかをどう判定するのかを学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・SELECT ＝ データベースという倉庫から条件に合うデータを取り出すこと\n・会計でよく使う表（BKPF / BSEG / T001 / T003T）が何の情報か\n・取得に成功したか（SY-SUBRC）を見て処理を分ける考え方",
          content: (
            <>
              <hgroup>
                <h1>データベースから取得する</h1>
                <p><code>SELECT</code> が何をしているのか。取れたか・取れなかったかをどう判定するのかを学びます。</p>
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
                <li><code>SELECT</code>＝ データベースという倉庫から条件に合うデータを取り出すこと</li>
                <li>会計でよく使う表（BKPF / BSEG / T001 / T003T）が何の情報か</li>
                <li>取得に成功したか（<code>SY-SUBRC</code>）を見て処理を分ける考え方</li>
              </ul>
            </>
          ),
        },
        {
          title: "倉庫のたとえ",
          plainText:
            "SELECT ＝ 倉庫から必要な箱を取り出す\nデータベースはたくさんの箱（データ）が整理された巨大な倉庫。SELECT は倉庫番に「この条件の箱だけ持ってきて」とお願いする命令。\n先生：倉庫の中身を全部出すと大変。だから前章の入力＝条件が効いてくる。条件で絞って必要な箱だけ取り出す。\nBちゃん：図書館で読みたい本だけ借りる、みたいな感じですね。\n先生：その通り。全部借りたら持ち帰れません。条件で絞るのが基本です。",
          content: (
            <>
              <h2>SELECT ＝ 倉庫から必要な箱を取り出す</h2>
              <p>データベースは、たくさんの箱（データ）が整理された巨大な倉庫です。<code>SELECT</code> は倉庫番に「この条件の箱だけ持ってきて」とお願いする命令です。</p>
              <Figure
                src="image/06-warehouse-pick.png"
                alt="巨大な倉庫の棚から、倉庫番が『条件に合う箱だけ』を選んで台車に載せて運び出すイラスト。条件メモ（WHERE）を見ながら必要な箱だけピックする様子。"
                caption="SELECT＝倉庫番に「条件に合う箱だけ持ってきて」と頼む（全部は出さない）"
                kind="concept"
              />
              <Dialog speaker="teacher">
                倉庫の中身を全部出すと大変です。だから前章の「入力＝条件」が効いてきます。条件で絞って、必要な箱だけ取り出します。
              </Dialog>
              <Dialog speaker="b">
                図書館で読みたい本だけ借りる、みたいな感じですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。全部借りたら持ち帰れません。条件で絞ってから取りに行く、が基本だと覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "会計の主な表",
          plainText:
            "会計でよく出る表（ざっくり）\n細かい列名は今は不要。どんな情報の表かだけ掴めば十分。\nBKPF：会計伝票のヘッダ（見出し：日付・会社など）\nBSEG：会計伝票の明細（中身の行：金額・科目）\nT001：会社コードのマスタ（会社の一覧）\nT003T：伝票タイプの名称（コードの読み仮名表）\nAくん：ヘッダ＝BKPF、明細＝BSEG。第2章のヘッダと明細がそのまま表になっているんですね。\n先生：そう。マスタ(T001)は“コードの意味を引く辞書”だと思ってください。",
          content: (
            <>
              <h2>会計でよく出る表（ざっくり）</h2>
              <p>細かい列名は今は不要。「どんな情報の表か」だけ掴めば十分です。</p>
              <Figure
                src="image/06-bkpf-bseg.png"
                alt="会計テーブルの関係図。BKPF（ヘッダ：1件1行）とBSEG（明細：同じ伝票番号で複数行）が伝票番号でつながる。横にT001（会社マスタ＝辞書）とT003T（伝票タイプ名称＝辞書）を補助テーブルとして配置。"
                caption="BKPF（ヘッダ）と BSEG（明細）は伝票番号でつながる。T001/T003T は“意味を引く辞書”"
                kind="diagram"
              />
              <ul>
                <li><strong>BKPF</strong>：会計伝票の<strong>ヘッダ</strong>（見出し：日付・会社など）</li>
                <li><strong>BSEG</strong>：会計伝票の<strong>明細</strong>（中身の行：金額・科目）</li>
                <li><strong>T001</strong>：会社コードの<strong>マスタ</strong>（会社の一覧）</li>
                <li><strong>T003T</strong>：伝票タイプの<strong>名称</strong>（コードの読み仮名表）</li>
              </ul>
              <Dialog speaker="a">
                ヘッダ＝BKPF、明細＝BSEG。第2章の「ヘッダと明細」がそのまま表になっているんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。T001 のようなマスタは「コードの意味を引く辞書」だと思ってください。番号だけでは人に伝わらないので、名前に変換するのに使います。
              </Dialog>
            </>
          ),
        },
        {
          title: "SELECTの基本形",
          plainText:
            "条件をつけて、内部テーブルへ受け取る\n選択画面で受け取った条件を WHERE に渡し、結果を内部テーブルに入れる。\nSELECT belnr budat bukrs FROM bkpf INTO TABLE lt_bkpf WHERE bukrs IN s_bukrs AND budat IN s_budat.\n先生：INTO TABLE は複数行をまとめて棚（内部テーブル）に入れる意味。1件だけなら SELECT SINGLE を使う。\nAくん：取る列を belnr budat bukrs と絞っているのは、要らない列まで運ばないため？\n先生：その通り。必要な列だけにするのは性能の基本です。",
          content: (
            <>
              <h2>条件をつけて、内部テーブルへ受け取る</h2>
              <p>選択画面で受け取った条件を <code>WHERE</code> に渡し、結果を内部テーブルに入れます。</p>
              <CodeBlock
                language="ABAP"
                code={`SELECT belnr budat bukrs
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs IN s_bukrs
    AND budat IN s_budat.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SELECT belnr budat bukrs</code> … 取りたい列（伝票番号・日付・会社コード）だけを指定
                </li>
                <li>
                  <code>FROM bkpf</code> … 伝票ヘッダテーブルから取得
                </li>
                <li>
                  <code>INTO TABLE lt_bkpf</code> … 結果を内部テーブル（棚）にまとめて受け取る
                </li>
                <li>
                  <code>WHERE bukrs IN s_bukrs AND budat IN s_budat</code> … 選択画面で入力した会社コード・日付の範囲で絞り込み
                </li>
              </ul>
              <Dialog speaker="a">
                取る列を <code>belnr budat bukrs</code> と絞っているのは、要らない列まで運ばないためですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>INTO TABLE</code> は「複数行をまとめて棚（内部テーブル）に入れる」意味。1件だけなら <code>SELECT SINGLE</code> を使います。そして「必要な列だけ取る」のは性能の基本です。
              </Dialog>
            </>
          ),
        },
        {
          title: "取れた？取れない？",
          plainText:
            "取得できたかを SY-SUBRC で判定\nSELECT の直後、システムは SY-SUBRC という変数に結果を入れる。0なら成功、0以外なら該当なし。これを見て処理を分ける。\nSELECT ... INTO TABLE lt_bkpf WHERE ...\nIF sy-subrc = 0. \" 取れた → 続けて処理\nELSE. MESSAGE '該当する伝票がありません' TYPE 'I'. ENDIF.\nつまずき：取れなかったのにそのまま後続処理に進んで空っぽの結果を出してしまう。→ 必ず SY-SUBRC を確認。\nBちゃん：買えたか確かめてからレジを離れる、ですね。",
          content: (
            <>
              <h2>取得できたかを <code>SY-SUBRC</code> で判定</h2>
              <p>
                SELECT の直後、システムは <code>SY-SUBRC</code> という変数に結果を入れます。
                <strong>0なら成功（取れた）</strong>、0以外なら「該当なし」です。これを見て処理を分けます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SELECT belnr budat bukrs
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs IN s_bukrs
    AND budat IN s_budat.

IF sy-subrc = 0.
  " 取れた → 続けて処理
ELSE.
  MESSAGE '該当する伝票がありません' TYPE 'I'.
ENDIF.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SELECT ... INTO TABLE lt_bkpf WHERE ...</code> … 条件に合うデータを棚へ取得（第4章の選択画面の値を <code>WHERE</code> に渡す）
                </li>
                <li>
                  <code>IF sy-subrc = 0.</code> … 取得直後に成功判定。<code>sy-subrc</code> はシステムが結果を入れる変数（0＝成功）
                </li>
                <li>
                  <code>MESSAGE ... TYPE &apos;I&apos;.</code> … 情報メッセージを画面に表示。該当なしのとき利用者に伝える
                </li>
              </ul>
              <Dialog speaker="stumble">
                取れなかったのに、そのまま後続処理に進んで空っぽの結果を出してしまう。→ 必ず <code>SY-SUBRC</code> を確認しましょう。
              </Dialog>
              <Dialog speaker="b">
                お弁当を買えたか確かめてからレジを離れる、みたいなことですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：取得と分岐",
          plainText:
            "図で見る：条件→抽出→件数判定→分岐\nflowchart：選択画面の条件 → SELECTで抽出 → SY-SUBRC=0? →(はい)後続処理／(いいえ)メッセージ\nこの章のABAPキーワード：SELECT / SELECT SINGLE / INTO TABLE / WHERE / SY-SUBRC / IF / CASE / MESSAGE。",
          content: (
            <>
              <h2>図で見る：条件→抽出→件数判定→分岐</h2>
              <MermaidDiagram
                chart={`flowchart TD
  A[選択画面の条件] --> B[SELECT で抽出]
  B --> C{SY-SUBRC = 0?}
  C -->|はい 取れた| D[後続処理へ]
  C -->|いいえ なし| E[メッセージを出す]`}
              />
              <Callout variant="tip">
                この章のABAPキーワード：<code>SELECT</code> / <code>SELECT SINGLE</code> / <code>INTO TABLE</code> / <code>WHERE</code> / <code>SY-SUBRC</code> / <code>IF</code> / <code>CASE</code> / <code>MESSAGE</code>。
              </Callout>
            </>
          ),
        },
        {
          title: "A/Bの理解ポイント",
          plainText:
            "2人の理解ポイント\nAくん：SY-SUBRC は戻り値ですね。0=正常という規約だと思えば腹落ちします。\nBちゃん：取れたか確認してから次へ。お弁当を買えたか確かめてからレジを離れる、みたいなこと。\n先生：その感覚で大丈夫。取得 → 確認 → 分岐 は、登録処理でも繰り返し出てくる超基本。",
          content: (
            <>
              <h2>2人の理解ポイント</h2>
              <Dialog speaker="a">
                <code>SY-SUBRC</code> は“戻り値”ですね。0=正常という規約だと思えば腹落ちします。
              </Dialog>
              <Dialog speaker="b">
                「取れたか確認してから次へ」。生活でも、買えたか確かめてから店を出ますもんね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚で大丈夫。「取得 → 確認 → 分岐」は、登録処理でも繰り返し出てくる超基本です。今のうちに体で覚えておきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：SELECTを倉庫への問い合わせとして正しく扱うことが大切。必要な条件で取得し、結果をSY-SUBRCで確認してから次へ進むのが基本の型。\nAくん：BKPFとBSEGの役割を切り分けたうえで、WHERE句で絞ってINTO TABLEへ受ける流れ。取得件数が0の可能性を前提に分岐を置くと安全性が上がる。\nBちゃん：取れたか確認せず先へ進むのが一番こわいと分かりました。メッセージ表示まで含めて利用者に状態を伝える設計を意識します。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章では、SELECTを「倉庫への問い合わせ」として正しく扱うことが大切です。必要な条件で取得し、結果をSY-SUBRCで確認してから次の処理へ進むのが基本の型になります。
              </Dialog>
              <Dialog speaker="a">
                BKPFとBSEGの役割を切り分けたうえで、WHERE句で絞ってINTO TABLEへ受ける流れですね。取得件数が0の可能性を前提に分岐を置くと、後続処理の安全性が上がる。
              </Dialog>
              <Dialog speaker="b">
                取れたか確認せず先へ進むのが一番こわいと分かりました。メッセージ表示まで含めて「利用者に状態を伝える」設計にすることを意識します。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 会計伝票の明細にあたる表は？→ BSEG\nQ2 SELECTでデータが取れたかは何を見て判断？→ SY-SUBRC が 0 かどうか\nQ3 条件に合う複数伝票をまとめて取得する基本構文は？→ SELECT ... INTO TABLE ... WHERE ...\n今日のひとこと：取って終わりではなく取れたか確認まで。これができると一気にプロっぽくなります。",
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
                「取って終わり」ではなく「取れたか確認」まで。これができると一気にプロっぽくなります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SelectFromDbLesson);
