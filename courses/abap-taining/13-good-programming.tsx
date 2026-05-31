import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  Figure,
  InfoPanel,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "良いABAP — 性能と保守性・SELECT/LOOPの書き方",
  meta: "初学者 · 25分",
};

export default function GoodProgrammingLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "13-good-programming", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "適切なプログラミング\n性能と保守性。10年後も使われることを見据えた、悪い例・良い例の対比で学ぶ仕上げの章です。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・性能（速さ）と保守性（直しやすさ）を両立する書き方\n・SELECT や LOOP の書き方で、なぜ速度に差が出るのか\n・悪い例・良い例の対比と、引き継げるコードの条件\nBちゃん：動けばいいのでは？\n先生：動くことは最低条件。本番のデータ量・次に直す人まで含めて良いコードと呼ぶ。前章の地図と習慣に、速さと直しやすさのバランスを足す章。",
          content: (
            <>
              <hgroup>
                <h1>適切なプログラミング</h1>
                <p>
                  前章までで「安全に直す」地図と習慣を学びました。
                  この章では<strong>速さ</strong>と<strong>直しやすさ</strong>のバランス——
                  10年後も使われる書き方——を、悪い例・良い例の対比で学びます。
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
                <li>性能（速さ）と保守性（直しやすさ）を両立する書き方</li>
                <li><code>SELECT</code> や <code>LOOP</code> の書き方で、なぜ速度に差が出るのか</li>
                <li>悪い例・良い例の対比と、引き継げるコードの条件</li>
              </ul>
              <Dialog speaker="b">
                正直、まだ実務経験がないので…「動けばいいのでは？」って思っちゃいます。
                <br />
                研修のサンプルだと、どっちの書き方でも同じように見えますよね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚、とても自然です。動くことは<strong>最低条件</strong>です。
                <br />
                実務では「本番のデータ量」や「次に直す人（未来の自分）」まで含めて、良いコードと呼びます。
                <br />
                前章の地図と習慣に、<strong>速さと直しやすさのバランス</strong>を足す——それがこの最終章です。
              </Dialog>
              <Dialog speaker="a">
                つまり、品質は「今の画面で動いたか」だけじゃなく、 <strong>本番件数でも困らないか</strong>と <strong>半年後に読めるか</strong>の両方で測る、ですね。
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
                src="image/13-shortcut-traffic.png"
                alt="一見すると速そうな細い近道に車が殺到して大渋滞している様子と、広い本道がスムーズに流れている様子の対比。データ量が増えると近道が詰まる比喩。"
                caption="その場の“近道”が、データ量が増えると渋滞の原因になる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                性能でいちばん怖いのは、<strong>「少ないデータでは気づかない」</strong>ことです。
                <br />
                研修や開発環境では10件・100件——サクサク動きます。 でも本番は10万件・100万件になることも珍しくありません。
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
                「自分のPCでは秒で終わったから問題ない」——本番リリース後に初めてプログラムが止まる、というパターンは本当に多いです。
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
                旅自体に時間がかかる——これが「往復が重い」理由です。
              </Dialog>
              <Dialog speaker="stumble">
                <code>LOOP</code> の中で <code>SELECT</code> するのは、代表的な<strong>アンチパターン</strong>（避けたい書き方）です。
                <br />
                明細100件なら往復100回——<strong>件数 × 往復</strong>で爆発的に遅くなります。 業界では「N+1問題」とも呼ばれます。
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
                10件なら往復10回——体感では気づきにくいです。 でも10万件なら<strong>往復10万回</strong>です。
                <br />
                同じ会社名を何度も聞く無駄も積み上がります。
                <br />
                「動いたからOK」ではなく、<strong>件数が増えても耐えられる形</strong>を選ぶ——それが実務の入口です。
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
                悪い例の逆——<strong>先に1回だけ</strong>まとめて取り、
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
                    手元の <code>lt_t001</code>（内部テーブル）から会社名を探す——往復ゼロ
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
                たとえば明細が0件のとき、<code>WHERE</code> が効かずマスタ全件を取ってしまう——これが罠です。
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
                src="image/13-roundtrip.png"
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
                性能改善の「最初の一手」は、いきなり難しいアルゴリズムではなく<strong>往復回数の削減</strong>—— 研修で学んだ型として、最初から選べるようになりたいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "引き継げる書き方",
          plainText:
            "保守性：10年後も誰かが直せるように\n前章の4習慣に加え、部品化で直す範囲を狭く。速いコードでも読めなければ半年後に誰も触れない。\nコード：SELECT * vs 必要列のみの対比。部品化はFORMで塊を切り出す。\nBちゃん：速さだけじゃなく優しさも品質。未来の自分が助かる。\n先生：速くて読みやすく安全に直せる——3つがそろって適切なプログラミング。",
          content: (
            <>
              <h2>保守性：10年後も誰かが直せるように</h2>
              <p>
                前章で学んだコメント・命名・変更履歴・テストに加え、
                ここでは<strong>部品化</strong>——直す範囲を狭く保つ——を補強します。
                速いコードでも、読めなければ半年後に誰も触れません。
              </p>
              <ul>
                <li><strong>コメント・命名</strong>：意図が読み取れる（前章の地図を読む力の土台）</li>
                <li><strong>変更履歴</strong>：いつ・なぜ変えたか分かる</li>
                <li><strong>開発標準に合わせる</strong>：チームで書き方を揃える（<code>lv_</code> など）</li>
                <li><strong>部品化</strong>：直す範囲を狭く保つ（<code>FORM</code> / <code>FUNCTION</code> に切り出す）</li>
              </ul>
              <h3>コードで見る：必要な列だけ取る</h3>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 全部の列を取る（転送・メモリともに無駄になりやすい）
SELECT * FROM t001
  INTO TABLE lt_t001
  FOR ALL ENTRIES IN lt_bseg
  WHERE bukrs = lt_bseg-bukrs.

" ✅ 必要な列だけ（何のためのデータかも明確になる）
SELECT bukrs butxt FROM t001
  INTO TABLE lt_t001
  FOR ALL ENTRIES IN lt_bseg
  WHERE bukrs = lt_bseg-bukrs.`}
              />
              <Dialog speaker="b">
                <code>SELECT *</code> は楽に見えるのに、実は遅くなることもあるんですね…。
                <br />
                速さと読みやすさ、両方に効くんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。
                <br />
                不要な列は<strong>転送もメモリも消費</strong>しますし、 「結局何のデータを使っているの？」が分かりにくくなります。
                <br />
                前章の命名・コメントとセットで、<strong>必要な列だけ</strong>を取る習慣をつけましょう。
              </Dialog>
              <Dialog speaker="stumble">
                「とにかく全部取れば安心」——一見安全に見えて、本番件数では<strong>遅さと読みにくさ</strong>の両方の原因になります。
              </Dialog>
              <Dialog speaker="a">
                第10章の部品化ともつながりますね。 取得・照合・出力を <code>FORM</code> に分けておけば、 性能改善も影響分析も<strong>直す範囲が狭い</strong>まま進められます。
              </Dialog>
              <Dialog speaker="b">
                速さだけじゃなく、優しさ（読みやすさ）も品質なんですね。
                <br />
                丁寧に書いておくと、未来の自分が助かる——前章と同じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\nBちゃん：実務未経験でも動けばOKじゃない？→最低条件。本番件数と未来の自分まで含めて品質。\n先生：近道＝LOOP内SELECTは試食会では平気・宴会で渋滞。往復は事務所↔倉庫の旅。\nAくん：悪い例はN+1。良い例はFOR ALL ENTRIES＋READ TABLE。空チェック必須。\nつまずき：自分のPCで秒で終わった＝問題ない、は本番で止まる典型。\nBちゃん：往復2つ＋前章の習慣＝速くて読みやすく直せる。研修おつかれさま！\n①往復を減らす ②必要列だけ ③前章の地図と習慣",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="b">
                この章、いちばん最初に思ったのは「実務未経験でも、動けばいいんじゃないの？」でした…。
                <br />
                でも最後まで聞くと、<strong>動くことは最低条件</strong>なんだと腹落ちしました。
              </Dialog>
              <Dialog speaker="teacher">
                よくまとまりました。ABAP研修の最終章——前章の「安全に直す」地図と習慣に、 <strong>速さと直しやすさのバランス</strong>を足した章です。
                <br />
                覚えておきたいのは、大きく3つです。
              </Dialog>
              <Dialog speaker="teacher">
                <strong>① 近道は渋滞の原因</strong>—— <code>LOOP</code> の中で <code>SELECT</code> する書き方は、 試食会（10件）では平気でも、宴会（10万件）で止まります。
                <br />
                「自分のPCで動いた」＝「本番でも大丈夫」ではありません。
              </Dialog>
              <Dialog speaker="a">
                理由は<strong>往復</strong>ですね。 プログラム（事務所）とDB（倉庫）は別の建物——1回聞くたびに旅が発生します。
                <br />
                悪い例は明細件数分の旅（N+1問題）。 良い例は <strong>FOR ALL ENTRIES</strong> で1回まとめて取り、 <strong>READ TABLE</strong> で机の上で照合——往復を激減させます。
              </Dialog>
              <Dialog speaker="b">
                <code>FOR ALL ENTRIES</code> の空チェック、今回でやっと「なぜ必要か」が分かりました。
                <br />
                空のとき全件取得——それ、怖いですね…。
              </Dialog>
              <Dialog speaker="stumble">
                「とにかく全部取れば安心（<code>SELECT *</code>）」
                <br />
                「自分のPCでは秒で終わったから問題ない」
                <br />
                ——実務未経験のうちに避けたい典型パターンです。
              </Dialog>
              <Dialog speaker="teacher">
                性能で覚えるのは<strong>2つだけ</strong>で十分です。
                <br />
                ① DBへの<strong>往復を減らす</strong>
                <br />
                ② <strong>必要な列だけ</strong>取る
                <br />
                保守性は前章のコメント・命名・履歴・テストに<strong>部品化</strong>を足す—— 速いコードでも読めなければ、半年後に誰も触れません。
              </Dialog>
              <Dialog speaker="a">
                つまり「適切なプログラミング」は—— <strong>速くて、読みやすくて、安全に直せる</strong>——の3つがそろった状態です。
                <br />
                第8章の結合、第10章の部品化、第12章の地図と習慣が、ここで一本の線につながりましたね。
              </Dialog>
              <Dialog speaker="b">
                今は動いていても、データが増えたときに困らない書き方を<strong>最初から選ぶ</strong>—— 未来の人（未来の自分）が読めるように書くことまで、品質だと理解できました。
                <br />
                研修、ここまで来られて自分でも驚いてます…！
              </Dialog>
              <Callout variant="tip">
                <strong>① 往復を減らす</strong>（まとめて取得 → <code>READ TABLE</code> で照合）<br />
                <strong>② 必要な列だけ取る</strong>（<code>SELECT *</code> を避ける）<br />
                <strong>③ 前章の地図と習慣</strong>（入力→取得→出力、コメント・命名・履歴・テスト）<br />
                良いコードは、未来へのやさしさです。
              </Callout>
              <Dialog speaker="teacher">
                ここまで来たあなたは、もう「翻訳者」の入口に立っています—— 業務の言葉を、SAPが理解できる形に翻訳する人。
                <br />
                おつかれさまでした。自信を持って、次のステップへ進みましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nBちゃん：間違えても大丈夫？→ 解説で復習できる。実務に入る前の型を確認する場。\nQ1 避けたい書き方→ LOOP内で毎回SELECT（N+1）\nQ2 適切なプログラミング→ 性能と保守性の両立\nQ3 往復を減らすと並ぶ方針→ 必要な列に絞る\n今日のひとこと：翻訳者の入口に立ったあなたへ。良いコードは未来へのやさしさ。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Dialog speaker="b">
                最終確認、ちょっと緊張します…。
                <br />
                間違えても大丈夫ですか？
              </Dialog>
              <Dialog speaker="teacher">
                もちろんです。解説で復習できるので、「覚えたつもり」になっていないかを確かめる場だと思ってください。
                <br />
                実務に入る前に、今日の<strong>型</strong>を自分の言葉で押さえましょう。
              </Dialog>
              <Quiz
                answer={1}
                explanation="LOOP の中で毎回 SELECT すると、DBへの往復が件数分くり返されて遅くなります（N+1問題）。先に FOR ALL ENTRIES などでまとめて取得し、READ TABLE でメモリ照合するのが基本の改善です。開発環境の少ない件数では気づきにくくても、本番の大量データでは止まる——この章でいちばん避けたいパターンです。"
                question={<strong>性能上、避けたい代表的な書き方は？</strong>}
                options={[
                  "必要な列だけを SELECT する",
                  "LOOP の中で毎回 SELECT する",
                  "FOR ALL ENTRIES でまとめて取得する",
                ]}
              />
              <Quiz
                answer={2}
                explanation="適切なプログラミングは、速さ（性能）と読みやすさ・直しやすさ（保守性）の両立です。「動けばOK」は最低条件。本番件数でも耐え、半年後に誰か（未来の自分）が安全に直せる——前章とこの章を合わせた品質の考え方です。"
                question={<strong>「適切なプログラミング」が満たすべきものは？</strong>}
                options={[
                  "とにかく実行が速いことだけ",
                  "とにかく短く書くことだけ",
                  "性能と保守性（読みやすさ・直しやすさ）の両立",
                ]}
              />
              <Quiz
                answer={1}
                explanation="「往復を減らす」と並んで覚えるのは「必要な列だけ取る」です。SELECT * は一見楽ですが、転送・メモリ・読みやすさの三つとも不利になります。FOR ALL ENTRIES や READ TABLE は、むしろ性能改善の味方です。"
                question={<strong>「DB往復を減らす」と並んで性能改善に有効な基本方針は？</strong>}
                options={[
                  "毎回SELECT *で全列を取得する",
                  "必要な列に絞ってSELECTする",
                  "READ TABLEを使わず常に二重LOOPにする",
                ]}
              />
              <Dialog speaker="closing">
                ここまで来たあなたは、もう「翻訳者」の入口に立っています。
                <br />
                良いコードは、未来へのやさしさです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(GoodProgrammingLesson);
