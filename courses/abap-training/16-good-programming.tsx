import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  Figure,
  InfoPanel,
  MermaidDiagram,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "良いABAP — 性能設計と実行時間分析",
  meta: "初学者 · 30分",
};

export default function GoodProgrammingLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "16-good-programming", lessonMeta.title)}
      slides={[
        {
          title: "概要 — なぜ性能の知識が要るか",
          plainText:
            "性能設計と実行時間分析\n会計伝票登録IFは本番で大量件数を扱う。開発環境の少ないデータでは気づきにくい性能問題を、SELECT最適化と計測の型で学びます。\n⏱ 30分 / 📶 初学者\nこの章で学ぶこと\n・DB往復を減らすSELECTの型\n・NGパターンと内部テーブル技法\n・SE30/SATによる実行時間分析\n・改善サイクル（特定→改修→再測定）",
          content: (
            <>
              <hgroup>
                <h1>性能設計と実行時間分析</h1>
                <p>
                  会計伝票登録 IF は、本番では<strong>大量の取込件数</strong>を扱います。
                  開発環境の少ないデータでは気づきにくい性能問題を、
                  <strong>SELECT の型</strong>と<strong>計測の型</strong>で学びます。
                </p>
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
                <li>なぜ性能の知識が IF 開発で重要か（本番件数の視点）</li>
                <li><code>SELECT</code> の一括取得・<code>WHERE</code> とキー・NGパターン</li>
                <li><code>FOR ALL ENTRIES</code> / <code>JOIN</code> と内部テーブル技法</li>
                <li>実行時間分析（<code>SE30</code> / <code>SAT</code>）と改善サイクル</li>
              </ul>
              <Dialog speaker="b">
                正直、まだ実務経験がないので…「動けばいいのでは？」って思っちゃいます。
                研修のサンプルだと、どっちの書き方でも同じように見えますよね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚、とても自然です。動くことは<strong>最低条件</strong>です。
                取込1万件・10万件の本番では、「往復の回数」がそのまま処理時間になります。
                可読性や設計思想は次の章で扱います。ここでは<strong>速さの型</strong>に集中しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "近道のたとえ",
          plainText:
            "「近道」が、実は渋滞の原因になる\nその場では速そうに見える書き方が、データが増えると一気に遅くなる。とくにDBへ何度も取りに行く書き方は件数が増えるほど効く。\n先生：性能は少ないデータでは気づかないのが怖い。本番の大量データで初めて遅さが牙をむく。だから最初から良い型で書く。\nBちゃん：少人数の試食会では平気でも本番の宴会で回らなくなる…\n先生：まさに。開発環境の10件と本番の10万件は別世界。最初から大人数を前提に仕込む。\nつまずき：自分のPCでは秒で終わったから問題ないと思いがち。本番で初めて止まる。",
          content: (
            <>
              <h2>「近道」が、実は渋滞の原因になる</h2>
              <p>
                その場では速そうに見える書き方が、データが増えると一気に遅くなることがあります。
                とくに「DBへ何度も取りに行く」書き方は、件数が増えるほど効いてきます。
              </p>
              <Figure
                src="image/13-shortcut-traffic.webp"
                alt="一見すると速そうな細い近道に車が殺到して大渋滞している様子と、広い本道がスムーズに流れている様子の対比。データ量が増えると近道が詰まる比喩。"
                caption="その場の“近道”が、データ量が増えると渋滞の原因になる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                性能でいちばん怖いのは、<strong>「少ないデータでは気づかない」</strong>ことです。
                <br />
                研修や開発環境では10件・100件。サクサク動きます。 でも本番は10万件・100万件になることも珍しくありません。
                <br />
                そのとき初めて「あの書き方、遅い…」と分かる。 だから<strong>最初から良い型</strong>で書く習慣をつけます。
              </Dialog>
              <Dialog speaker="b">
                少人数の試食会では平気でも、本番の宴会で回らなくなる…みたいなことですね。
                <br />
                自分のPCで動いたから大丈夫、と思いがちです…。
              </Dialog>
              <Dialog speaker="teacher">
                まさにその比喩です。
                <br />
                開発環境の10件と、本番の10万件は<strong>別世界</strong>です。 「今動いた」＝「本番でも大丈夫」ではありません。
                <br />
                実務未経験のうちから、大人数の宴会を想定して仕込むのがコツです。
              </Dialog>
              <Dialog speaker="stumble">
                「自分のPCでは秒で終わったから問題ない」。本番リリース後に初めてプログラムが止まる、というパターンは本当に多いです。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜ差が出るか",
          plainText:
            "DBアクセスは「往復」が重い\nDBへの問い合わせは1回ごとに往復の時間がかかる。ループの中で毎回SELECTすると往復が件数分くり返されとても遅い。\nBちゃん：往復って何？\n先生：プログラムとDBは別の建物。1回聞くたびに往復の旅が発生。ループ内SELECTは旅を件数分繰り返す。\nつまずき：LOOP内SELECT＝N+1問題。件数×往復で爆発的に遅い。\nAくん：N件ループでN回問い合わせればコストはN倍。往復回数を減らすのが最優先の改善。",
          content: (
            <>
              <h2>DBアクセスは「往復」が重い</h2>
              <p>
                データベース（DB）への問い合わせは、1回ごとに
                <strong>“往復の時間”</strong>がかかります。
                ループの中で毎回 <code>SELECT</code> すると、その往復が件数分くり返され、とても遅くなります。
              </p>
              <Dialog speaker="b">
                「往復」って、具体的に何のことですか？
                <br />
                まだDBの中身をイメージしづらくて…。
              </Dialog>
              <Dialog speaker="teacher">
                たとえば、プログラムが<strong>事務所</strong>、データが<strong>倉庫（DB）</strong>にあると想像してください。
                <br />
                「この会社の名前を教えて」と聞くたびに、事務所から倉庫まで<strong>往復の旅</strong>が1回発生します。
                <br />
                旅自体に時間がかかる。これが「往復が重い」理由です。
              </Dialog>
              <Dialog speaker="stumble">
                <code>LOOP</code> の中で <code>SELECT</code> するのは、代表的な<strong>アンチパターン</strong>（避けたい書き方）です。
                <br />
                明細100件なら往復100回。<strong>件数 × 往復</strong>で爆発的に遅くなります。 業界では「N+1問題」とも呼ばれます。
              </Dialog>
              <Dialog speaker="a">
                計算量の話ですね。
                <br />
                N件のループ内でN回問い合わせれば、コストはおおむねN倍に膨らみます。 だから<strong>往復の回数そのものを減らす</strong>のが、いちばん効く改善になります。
              </Dialog>
              <Dialog speaker="teacher">
                いい着眼です。次のスライドで、第8章の「まとめて取って、メモリで突き合わせる」書き方が、 なぜ速いのかを<strong>悪い例・良い例</strong>で体感しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "SELECT：一括取得",
          plainText:
            "INTO TABLE vs SELECT～ENDSELECT\nDBアクセス回数を削減し、必要最小限のデータだけ取得する。\n✅ SELECT ... INTO TABLE → LOOP AT\n❌ SELECT ... ENDSELECT（1行ごとに倉庫往復）\nAくん：第6章で学んだ INTO TABLE が、性能面でも正解だったんですね。",
          content: (
            <>
              <h2><code>SELECT</code>：一括取得が基本</h2>
              <p>
                性能改善の第一歩は、<strong>DBアクセス回数を減らす</strong>ことと、
                <strong>必要最小限のデータだけ</strong>取ることです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ✅ 良い：1回で内部テーブルへまとめて取得
SELECT bukrs belnr budat
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs.

LOOP AT lt_bkpf INTO ls_bkpf.
  " 手元の棚で処理
ENDLOOP.

" ❌ 悪い：1行ごとにDBへ往復
SELECT bukrs belnr budat
  FROM bkpf
  WHERE bukrs = p_bukrs.
  APPEND ... TO lt_bkpf.
ENDSELECT.`}
              />
              <Dialog speaker="a">
                第6章で学んだ <code>INTO TABLE</code> が、性能面でも正解だったんですね。
                <code>SELECT</code> ～ <code>ENDSELECT</code> は行数分だけ倉庫へ往復します。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="06-select-from-db"
                slide={5}
                label="第6章: SELECT の基本を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "悪い例",
          plainText:
            "悪い例：ループの中で毎回DBへ\n❌ 明細1件ごとにDBへ取りに行く（往復が件数分）\nBちゃん：1件ごとに倉庫まで歩いて取りに行ってる…\n先生：第8章の結合と同じ課題。会社名を明細ごとに取りに行く。100件なら100回往復。同じ会社コードでも毎回聞く無駄もある。\nAくん：研修10件では気づかない。本番10万件で止まる典型パターン。",
          content: (
            <>
              <h2>悪い例：ループの中で毎回DBへ</h2>
              <p>
                会計明細（<code>lt_bseg</code>）を1件ずつ見ながら、
                その都度マスタ（<code>t001</code>）から会社名を取りに行く書き方です。
                第8章で「まとめて取る」方がよいと学んだのと<strong>同じ課題</strong>が、
                性能の観点でも表れます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 明細1件ごとにDBへ取りに行く（往復が件数分）
LOOP AT lt_bseg INTO ls_bseg.
  SELECT SINGLE butxt FROM t001
    INTO lv_name
    WHERE bukrs = ls_bseg-bukrs.
  WRITE: / ls_bseg-belnr, lv_name.
ENDLOOP.`}
              />
              <h3>何が問題か</h3>
              <ul>
                <li>
                  <code>LOOP</code> の<strong>中</strong>に <code>SELECT SINGLE</code> … 明細100件ならDBへ100回往復する（N+1問題）
                </li>
                <li>
                  毎回同じ会社コードでも取りに行く … 無駄な重複アクセス（例：会社コード「1000」が50行あっても50回聞く）
                </li>
                <li>
                  研修データでは「動く」ので気づきにくい … 本番件数で初めて止まる
                </li>
              </ul>
              <Dialog speaker="b">
                1件ごとに倉庫まで歩いて取りに行ってる…たしかに大変そう。
                <br />
                でも、10件くらいなら平気に見えますね？
              </Dialog>
              <Dialog speaker="teacher">
                10件なら往復10回。体感では気づきにくいです。 でも10万件なら<strong>往復10万回</strong>です。
                <br />
                同じ会社名を何度も聞く無駄も積み上がります。
                <br />
                「動いたからOK」ではなく、<strong>件数が増えても耐えられる形</strong>を選ぶ。それが実務の入口です。
              </Dialog>
              <Dialog speaker="a">
                第8章の「ヘッダと明細を結合する」と同じ構図ですね。 明細ごとにマスタへ行くより、<strong>先にまとめて取る</strong>方が筋がいい、と学びました。
              </Dialog>
            </>
          ),
        },
        {
          title: "良い例",
          plainText:
            "良い例：先にまとめて取り、メモリで突き合わせ\n✅ 必要な会社名を一度だけまとめて取得。ループ内はREAD TABLEで机の上で照合（往復なし）。\nAくん：倉庫から台車でまとめて運び、机で照合。往復激減。\nBちゃん：FOR ALL ENTRIESは第8章で見たやつ。空のとき全件取得の罠に注意。\n先生：空チェックは必須。必要な列だけSELECTも保守性に効く。\nキーワード：FOR ALL ENTRIES / READ TABLE / 必要な列だけSELECT。",
          content: (
            <>
              <h2>良い例：先にまとめて取り、メモリで突き合わせ</h2>
              <p>
                悪い例の逆。<strong>先に1回だけ</strong>まとめて取り、
                ループの中では手元の内部テーブル（棚）から照合します。
                第8章のデータ結合で学んだパターンと同じ考え方です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ✅ 必要な会社名を一度だけまとめて取得
SELECT bukrs butxt FROM t001
  INTO TABLE lt_t001
  FOR ALL ENTRIES IN lt_bseg
  WHERE bukrs = lt_bseg-bukrs.

LOOP AT lt_bseg INTO ls_bseg.
  READ TABLE lt_t001 INTO ls_t001
    WITH KEY bukrs = ls_bseg-bukrs.   " メモリ内で照合（往復なし）
  WRITE: / ls_bseg-belnr, ls_t001-butxt.
ENDLOOP.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SELECT ... INTO TABLE lt_t001 FOR ALL ENTRIES IN lt_bseg</code> … 明細に登場する会社コードに必要な会社名だけを<strong>1回のSELECT</strong>でまとめて取得
                </li>
                <li>
                  <code>WHERE bukrs = lt_bseg-bukrs</code> … 明細テーブルに含まれる会社コードに限定
                </li>
                <li>
                  <code>READ TABLE lt_t001 ... WITH KEY bukrs = ls_bseg-bukrs</code> … ループ内ではDBへ行かず、手元の棚（<code>lt_t001</code>）から会社名を照合
                </li>
              </ul>
              <InfoPanel
                title="悪い例との違い"
                variant="breakdown"
                lead="同じ結果を出しながら、DBへの往復だけを大きく減らす書き方です。"
              >
                <ul>
                  <li>
                    <strong>① まとめて取得</strong> … <code>FOR ALL ENTRIES IN lt_bseg</code> で、
                    明細に登場する会社コードに必要な行だけを<strong>1回のSELECT</strong>で取る
                  </li>
                  <li>
                    <strong>② ループ内はDBへ行かない</strong> … <code>READ TABLE</code> で
                    手元の <code>lt_t001</code>（内部テーブル）から会社名を探す。往復ゼロ
                  </li>
                  <li>
                    <strong>③ 必要な列だけ</strong> … <code>bukrs butxt</code> だけ取得。
                    全部の列（<code>SELECT *</code>）は転送もメモリも無駄になりやすい
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                先に倉庫から必要分を台車でまとめて運び、あとは机の上で照合。
                <br />
                明細が10万件でも、往復は<strong>最初の1回</strong>に抑えられますね。
              </Dialog>
              <Dialog speaker="b">
                <code>FOR ALL ENTRIES</code>、第8章でも見ました！
                <br />
                でも「空のとき全件取得」って、まだピンときてないです…。
              </Dialog>
              <Dialog speaker="teacher">
                たとえば明細が0件のとき、<code>WHERE</code> が効かずマスタ全件を取ってしまう。これが罠です。
                <br />
                だから使う前に <code>IF lt_bseg IS NOT INITIAL.</code> で<strong>空チェック</strong>を必ず入れます。
                <br />
                実務未経験のうちから、この1行をセットで覚えておいてください。
              </Dialog>
              <Callout variant="warning">
                <code>FOR ALL ENTRIES</code> の注意：駆動テーブル（<code>lt_bseg</code>）が
                <strong>空のときは <code>WHERE</code> が無視され全件取得</strong>になります。使う前に{" "}
                <code>IF lt_bseg IS NOT INITIAL.</code> で空チェックを（重複行は自動で除かれます）。
              </Callout>
              <Callout variant="tip">
                この章のABAPキーワード：<code>FOR ALL ENTRIES</code> / <code>READ TABLE</code> / 必要な列だけ <code>SELECT</code> / 性能・保守性。
              </Callout>
            </>
          ),
        },
        {
          title: "WHEREとキー項目",
          plainText:
            "WHERE句とキー項目\nキー項目を条件に指定すると、DBが効率よくデータを探せる。LIKEよりEQを優先。\n日付条件はできるだけ早い段階で絞る。条件が後ろに回るとデータ増加で性能劣化。\nAくん：インデックス付きの棚で、ラベルが完全一致の方が探しやすい、というイメージですね。",
          content: (
            <>
              <h2><code>WHERE</code> 句とキー項目</h2>
              <p>
                DBは<strong>キー項目</strong>（インデックス）を使ってデータを探します。
                キーを条件に含めると、探す範囲が一気に狭まり、数倍～数十倍速くなることもあります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ✅ キー項目（会社コード＋伝票番号＋年度）を指定
SELECT belnr budat
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs
    AND belnr = p_belnr
    AND gjahr = p_gjahr.

" ✅ 完全一致（EQ）を優先。LIKE は必要なときだけ
WHERE bukrs = p_bukrs          " EQ（等しい）
  AND budat IN s_budat.`}
              />
              <Callout variant="note">
                日付などの抽出条件は、<strong>できるだけ早い段階</strong>で絞り込みます。
                条件が後ろの処理に回る設計は、データ増加とともに性能が劣化しやすいです。
              </Callout>
              <Dialog speaker="a">
                インデックス付きの棚で、ラベルが完全一致の方が探しやすい。そんなイメージですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "SELECTの技法",
          plainText:
            "SELECT SINGLE / 集計 / ビュー / JOIN\n1件だけなら SELECT SINGLE。MAX など集計関数もDB側で処理。\nSAP標準ビューや JOIN で、複数表を1回の取得にまとめる。\nBちゃん：往復1回で済むなら、それが一番ですね。",
          content: (
            <>
              <h2><code>SELECT</code> のその他の技法</h2>
              <CodeBlock
                language="ABAP"
                code={`" 1件だけ → SELECT SINGLE（キーが揃っているとき）
SELECT SINGLE budat
  FROM bkpf
  INTO ls_bkpf
  WHERE bukrs = p_bukrs
    AND belnr = p_belnr
    AND gjahr = p_gjahr.

" 集計 → DB側で計算（全件を取ってから MAX するより効率的）
SELECT MAX( msgnr )
  FROM t100
  INTO lv_max
  WHERE arbgb = 'Z01'.

" 複数表 → JOIN で1回の取得に（ループ内SELECTの代替）
SELECT mkpf~mblnr mseg~matnr mseg~menge
  FROM mkpf
  INNER JOIN mseg ON mkpf~mblnr = mseg~mblnr
                   AND mkpf~mjahr = mseg~mjahr
  INTO TABLE lt_mat
  WHERE mkpf~budat IN s_budat.`}
              />
              <Callout variant="tip">
                SAP標準<strong>ビュー</strong>を使うと、アプリ側で複雑な <code>JOIN</code> を書かずに
                まとめて取得できる場合があります。既存の標準ビューがないか、先に調べるのも有効です。
              </Callout>
              <Dialog speaker="b">
                往復1回で済むなら、それがいちばんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "SELECTアンチパターン",
          plainText:
            "避けたいSELECTの書き方\n❌ SELECT *（不要列まで転送）\n❌ LOOP内SELECT（二重ループ＝DBアクセス爆増）\n❌ 日付条件が後ろ、キーなしの全件取得\n先生：二重ループは致命的。まず往復回数を数える習慣を。",
          content: (
            <>
              <h2>避けたい <code>SELECT</code> の書き方</h2>
              <ul>
                <li>
                  <code>SELECT *</code> … 不要な列まで転送・メモリ消費（必要列だけ指定）
                </li>
                <li>
                  <code>LOOP</code> 内の <code>SELECT</code> … 二重ループに相当し、DBアクセスが件数分爆増（N+1問題）
                </li>
                <li>
                  キーなし・日付条件なしの全件取得 … データ増加で一気に遅くなる
                </li>
                <li>
                  日付条件を後段の処理に回す設計 … 最初に絞れないと、無駄なデータを運ぶ
                </li>
              </ul>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph bad ["❌ 二重ループ"]
    L1[LOOP 外側] --> L2[LOOP 内側]
    L2 --> S[毎回 SELECT]
    S --> L2
  end
  subgraph good ["✅ 一括取得"]
    Q[1回 SELECT / JOIN] --> M[メモリで照合]
  end`}
              />
              <Dialog speaker="teacher">
                「二重ループ」は性能問題の典型です。コードを読むとき、
                <strong>DBへの往復が何回起きるか</strong>を数える習慣をつけましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "内部テーブルで速く",
          plainText:
            "内部テーブルの性能\nLOOP回数を減らし、処理をシンプルに。条件付きLOOP、BINARY SEARCH、一括挿入など。\nSORTしてから READ TABLE ... BINARY SEARCH で高速検索。\nAくん：DB往復を減らしたあとは、手元の棚の操作を効率化する段階ですね。",
          content: (
            <>
              <h2>内部テーブル：LOOPを減らす</h2>
              <p>
                DBからまとめて取ったあとは、<strong>手元の棚（内部テーブル）</strong>の操作を効率化します。
                基本方針は「LOOP回数を減らす」「処理をシンプルにする」の2つです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 条件付き LOOP（不要な行をスキップ）
LOOP AT lt_bkpf INTO ls_bkpf WHERE bukrs = '1000'.
  " 会社1000だけ処理
ENDLOOP.

" BINARY SEARCH（SORT 済みが前提）
SORT lt_bkpf BY bukrs belnr.
READ TABLE lt_bkpf INTO ls_bkpf
  WITH KEY bukrs = '1000' belnr = '0000000001'
  BINARY SEARCH.

" 一括挿入
APPEND LINES OF lt_src TO lt_dest.`}
              />
              <Dialog speaker="a">
                DB往復を減らしたあとは、手元の棚の操作を効率化する段階ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "内部テーブル技法",
          plainText:
            "内部テーブル早見表\nフィールドシンボル、重複削除、ソート項目明示、一括代入など。\nAPPEND LINES OF / ASSIGNING / DELETE ADJACENT DUPLICATES / SORT BY 項目明示 / TAB2 = TAB1",
          content: (
            <>
              <h2>内部テーブルの技法（早見表）</h2>
              <InfoPanel
                title="LOOP削減・高速化のテクニック"
                variant="reference"
                lead="第5章の基本操作を、性能向きに使いこなす。"
              >
                <ul>
                  <li>
                    <code>LOOP AT ... WHERE ...</code> … 条件に合う行だけ処理（全件ループを避ける）
                  </li>
                  <li>
                    <code>SORT ... BY 項目.</code> ＋ <code>READ TABLE ... BINARY SEARCH</code> … ソート済み表からの高速検索
                  </li>
                  <li>
                    <code>APPEND LINES OF lt_a TO lt_b.</code> … 行を一括で追加（1行ずつ <code>APPEND</code> より効率的）
                  </li>
                  <li>
                    <code>LOOP AT ... ASSIGNING &lt;fs&gt;.</code> … フィールドシンボルで直接参照（コピー削減）
                  </li>
                  <li>
                    <code>DELETE ADJACENT DUPLICATES FROM lt ... COMPARING ...</code> … 隣接する重複行を削除
                  </li>
                  <li>
                    <code>SORT lt BY bukrs ASCENDING budat DESCENDING.</code> … 昇順/降順を明示（意図が読み取りやすい）
                  </li>
                  <li>
                    <code>lt_b = lt_a.</code> … 内部テーブル全体の一括代入
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <code>APPEND</code> 前に <code>SORT</code> する必要がある場合は、
                <strong>ソートと追加を分けて</strong>書くと、意図が明確になりバグも減ります。
              </Callout>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="05-internal-tables"
                slide={2}
                label="第5章: 内部テーブルの基本を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "図解：往復を減らす",
          plainText:
            "図で見る：無駄な往復を減らす\n悪い例＝LOOP↔毎回SELECT（往復多）／良い例＝1回まとめてSELECT→メモリ照合\nBちゃん：左の矢印がすごい…右は最初だけ太い矢印であとは机の上。\n先生：往復を減らす・必要な列だけ取る。この2つだけでも体感速度は大きく変わる。\nAくん：性能改善の最初の一手は往復回数の削減。設計の型として覚える。",
          content: (
            <>
              <h2>図で見る：無駄な往復を減らす</h2>
              {/* <MermaidDiagram
                chart={`flowchart LR
  subgraph 悪い例
    L1[LOOP] --> Q1[毎回SELECT]
    Q1 --> L1
  end
  subgraph 良い例
    Q2[1回でまとめてSELECT] --> M[メモリ上で照合]
  end`}
              /> */}
              <Figure
                src="image/13-roundtrip.webp"
                alt="左：LOOPの各回ごとにDB（倉庫）へ何度も往復する矢印が大量にある悪い例。右：最初に1回だけまとめてDBから取り、あとは内部テーブル（机）で照合する良い例。往復回数の多寡を矢印の数で対比。"
                caption="悪い例＝件数分の往復／良い例＝1回でまとめて取り、あとはメモリ内で照合"
                kind="diagram"
              />
              <Dialog speaker="b">
                左の図、矢印がすごい数…。
                <br />
                右は最初だけ太い矢印があって、あとは机の上で済んでる感じですね。
                <br />
                同じ結果なのに、こんなに違うんですか。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそこが性能の本質です。
                <br />
                覚えておくのはこの<strong>2つだけ</strong>で十分です。
                <br />
                ① <strong>DBへの往復を減らす</strong>（まとめて取得 → メモリ照合）
                <br />
                ② <strong>必要な列だけ取る</strong>（<code>SELECT *</code> を避ける）
                <br />
                実務でも、この2つだけで体感速度は大きく変わります。
              </Dialog>
              <Dialog speaker="a">
                性能改善の「最初の一手」は、いきなり難しいアルゴリズムではなく<strong>往復回数の削減</strong>。 研修で学んだ型として、最初から選べるようになりたいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "実行時間分析",
          plainText:
            "SE30 / SAT で計測\n同条件で複数回実行し、平均値で判断。Database時間＝SELECT問題、ABAP時間＝LOOP問題、System時間＝設計問題の目安。\n注意：本番データで実行すると更新系は実データが変わる。分析環境で行う。",
          content: (
            <>
              <h2>実行時間分析（<code>SE30</code> / <code>SAT</code>）</h2>
              <p>
                「遅い」と感じたら、<strong>どこに時間がかかっているか</strong>を計測します。
                古典的な <code>SE30</code>（Runtime Analysis）や、新しい <code>SAT</code>（ABAP Trace）が代表ツールです。
              </p>
              <InfoPanel
                title="分析指標の見方（目安）"
                variant="reference"
                lead="同条件で複数回計測し、平均値で判断するのが定石です。"
              >
                <ul>
                  <li>
                    <strong>Database 時間</strong> … <code>SELECT</code> がボトルネック。WHERE・キー・一括取得を見直す
                  </li>
                  <li>
                    <strong>ABAP 時間</strong> … <code>LOOP</code> や内部テーブル操作がボトルネック
                  </li>
                  <li>
                    <strong>System 時間</strong> … 設計全体（呼び出し構造・不要処理）を見直す段階
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                計測実行は、<strong>更新処理</strong>（登録・変更）を含むプログラムでは実データが変わる場合があります。
                分析は開発・検証環境で行い、本番データへの影響に注意してください。
              </Callout>
              <Dialog speaker="teacher">
                感覚で「たぶんSELECTが遅い」と決めつけず、計測結果で<strong>根拠を持って直す</strong>。
                これが性能改善の実務的な進め方です。
              </Dialog>
            </>
          ),
        },
        {
          title: "改善サイクル",
          plainText:
            "改善サイクル — 特定→改修→再測定\n① SE30/SATでボトルネックを特定（Database時間かABAP時間か）\n② 往復削減・WHERE見直し・LOOP削減などを改修\n③ 同条件で再計測し、改善を確認\n感覚だけで終わらせず、数値で効果を見るのが実務の型。",
          content: (
            <>
              <h2>改善サイクル — 特定 → 改修 → 再測定</h2>
              <p>
                性能改善は一度直せば終わりではありません。
                <strong>計測 → 改修 → 再計測</strong>のサイクルで、効果を確認しながら進めます。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  M[SE30 / SAT で計測] --> A[ボトルネック特定]
  A --> F[改修 往復削減・WHERE・LOOP]
  F --> R[同条件で再計測]
  R -->|まだ遅い| A
  R -->|改善確認| OK[完了]`}
              />
              <InfoPanel title="サイクルの各段階" variant="reference">
                <ul>
                  <li>
                    <strong>特定</strong> … Database 時間が突出 → <code>SELECT</code> を見直す。ABAP 時間 → <code>LOOP</code> や内部テーブル操作
                  </li>
                  <li>
                    <strong>改修</strong> … 往復削減（一括取得・<code>FOR ALL ENTRIES</code>）、キー指定、必要列だけ取得
                  </li>
                  <li>
                    <strong>再測定</strong> … 同じデータ量・同じ条件で比較。開発環境と本番で件数が違う点に注意
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                「直したつもり」で終わらせず、数値で確認する。これが設計書の性能要件を満たす進め方ですね。
              </Dialog>
              <Dialog speaker="teacher">
                取込件数が増える IF では、このサイクルを前提にコードレビューします。
                可読性や長期運用の考え方は、次の章でまとめます。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n性能の要点：①往復を減らす ②必要列だけ ③計測→改修→再測定。LOOP内SELECTはN+1問題。FOR ALL ENTRIESは空チェック必須。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="b">
                この章、いちばん最初は「動けばいいんじゃないの？」と思っていました…。
                でも本番の件数を想像すると、往復の回数がそのまま時間になるんですね。
              </Dialog>
              <Dialog speaker="teacher">
                性能で覚えるのは<strong>3つ</strong>です。
                <br />
                ① DBへの<strong>往復を減らす</strong>（一括取得 → メモリ照合）
                <br />
                ② <strong>必要な列だけ</strong>取る
                <br />
                ③ <strong>計測 → 改修 → 再測定</strong>のサイクル
              </Dialog>
              <Dialog speaker="a">
                悪い例は N+1 問題。良い例は <code>FOR ALL ENTRIES</code> ＋ <code>READ TABLE</code>。
                空チェック（<code>IS NOT INITIAL</code>）を忘れると全件取得の罠に落ちます。
              </Dialog>
              <Dialog speaker="stumble">
                「自分のPCでは秒で終わったから問題ない」— 本番で初めて止まる典型パターンです。
              </Dialog>
              <Callout variant="tip">
                <strong>最重要3点</strong><br />
                ① <code>SELECT</code> 最適化（<code>WHERE</code>・キー・一括取得）<br />
                ② 内部テーブル運用（LOOP削減・<code>BINARY SEARCH</code>）<br />
                ③ 改善サイクル（<code>SE30</code> / <code>SAT</code> で根拠を持って直す）
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 避けたい書き方→ LOOP内SELECT\nQ2 Database時間突出→ SELECT/WHERE見直し\nQ3 改善サイクル→ 計測→改修→再測定\nQ4 FOR ALL ENTRIESの注意→ 駆動表が空だと全件取得",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="LOOP の中で毎回 SELECT すると、DBへの往復が件数分くり返されて遅くなります（N+1問題）。先に FOR ALL ENTRIES などでまとめて取得し、READ TABLE でメモリ照合するのが基本の改善です。"
                question={<strong>性能上、避けたい代表的な書き方は？</strong>}
                options={[
                  "必要な列だけを SELECT する",
                  "LOOP の中で毎回 SELECT する",
                  "FOR ALL ENTRIES でまとめて取得する",
                ]}
              />
              <Quiz
                answer={1}
                explanation="SE30 や SAT で Database 時間が突出している場合、SELECT 文（WHERE 条件・キー・一括取得）の見直しが第一候補です。ABAP 時間は LOOP、System 時間は設計全体の見直しを示唆します。"
                question={<strong>実行時間分析で Database 時間が突出している場合、最初に見直すのは？</strong>}
                options={[
                  "WRITE の桁位置指定",
                  "SELECT 文と WHERE 条件",
                  "コメントの量",
                ]}
              />
              <Quiz
                answer={0}
                explanation="性能改善は感覚だけで終わらせず、SE30/SAT で計測し、改修後に同条件で再計測して効果を確認するのが実務の型です。"
                question={<strong>性能改善の実務的な進め方として適切なのは？</strong>}
                options={[
                  "計測 → 改修 → 同条件で再計測",
                  "感覚で直してテストは省略する",
                  "本番データで最初から計測する",
                ]}
              />
              <Quiz
                answer={2}
                explanation="FOR ALL ENTRIES の駆動テーブルが空のとき、WHERE 句が無視されマスタ全件を取得してしまう罠があります。使う前に IF lt_xxx IS NOT INITIAL. で空チェックを入れます。"
                question={<strong>FOR ALL ENTRIES を使うときの注意として正しいのは？</strong>}
                options={[
                  "駆動テーブルが空でも問題ない",
                  "SELECT * とセットで使うのが最速",
                  "駆動テーブルが空のとき全件取得になるので事前に空チェックする",
                ]}
              />
              <Dialog speaker="closing">
                性能の型を身につけました。次は可読性・設計思想・知識の地図で仕上げます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="17-real-world"
                slide={1}
                label="次へ: 可読性・設計思想・知識の地図"
                className="mb-4 mt-4"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(GoodProgrammingLesson);
