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
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "実務の進め方 — 仕様変更・影響分析・回帰テスト・保守の習慣",
  meta: "初学者 · 20分",
};

export default function RealWorldLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "12-real-world", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "実務っぽい観点\n追加要望が来たとき、どこを見て・どう直し・どう確かめるか。実務の進め方を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・仕様変更が来たときに、最初に見るべきポイント\n・「影響分析 → 修正 → 回帰テスト」という循環\n・コメント・命名・履歴・単体テストが、なぜ実務で大事か",
          content: (
            <>
              <hgroup>
                <h1>実務っぽい観点</h1>
                <p>追加要望が来たとき、どこを見て・どう直し・どう確かめるか。実務の進め方を学びます。</p>
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
                <li>仕様変更が来たときに、最初に見るべきポイント</li>
                <li>「影響分析 → 修正 → 回帰テスト」という循環</li>
                <li>コメント・命名・履歴・単体テストが、なぜ実務で大事か</li>
              </ul>
            </>
          ),
        },
        {
          title: "設計書を先に読む",
          plainText:
            "設計書を先に読む\n実装の前に、設計書・仕様で入力・取得・出力・例外を把握する。小さく作って都度テストする（第3章と同じリズム）。\n先生：コードを書く速度より、仕様の理解が品質の土台。演習の手順は別資料、意味はここで押さえる。",
          content: (
            <>
              <h2>設計書を先に読む</h2>
              <p>
                実務でいちばん効くのは、「コードを速く書く」ことより<strong>設計書・仕様を理解してから書く</strong>ことです。
                第1章のパイプライン（入力 → 取得 → 加工 → 出力）に沿って、仕様の欄を読み解きます。
              </p>
              <ul>
                <li>何を<strong>入力</strong>として受け取るか（選択画面・ファイル・パラメータ）</li>
                <li>どこから<strong>取得</strong>し、どう<strong>加工</strong>するか</li>
                <li>何を<strong>出力</strong>し、登録やファイル連携があるか</li>
                <li>エラー時・件数ゼロ時など<strong>例外</strong>はどうするか</li>
              </ul>
              <Dialog speaker="teacher">
                演習の具体操作は<strong>別資料</strong>で進めますが、「なぜこの処理か」は設計書に書いてあります。
                小さく実装して動かす（第3章）習慣とセットで、ここを欠かさないでください。
              </Dialog>
            </>
          ),
        },
        {
          title: "増改築のたとえ",
          plainText:
            "増改築には「図面」が要る\n家を増築するとき元の図面を見ずに壁を壊したら水道管を切ってしまうかも。プログラムの修正も同じで、まず今どうなっているかを把握してから手を入れる。\n先生：実務の修正はゼロから作るより既にあるものを安全に直すほうが多い。だから読む力と影響を見る力が大切。\nBちゃん：模様替えの前に家具の配置を確認するのと同じですね。\n先生：そう。見ずに壊すのが一番こわい。まず現状把握です。",
          content: (
            <>
              <h2>増改築には「図面」が要る</h2>
              <p>家を増築するとき、元の図面を見ずに壁を壊したら、水道管を切ってしまうかもしれません。プログラムの修正も同じで、まず「今どうなっているか」を把握してから手を入れます。</p>
              <Figure
                src="image/12-renovation-blueprint.webp"
                alt="家の増改築の場面。設計図（図面）を広げて確認してから壁に手を入れる職人。図面を見ずに壊すと水道管を切ってしまう危険、という対比を添える。"
                caption="改修はまず「図面（現状）」を読む。見ずに壊すと思わぬ所を壊す"
                kind="concept"
              />
              <Dialog speaker="teacher">
                実務の修正は「ゼロから作る」より「既にあるものを安全に直す」ほうが多いです。だから“読む力”と“影響を見る力”が大切になります。
              </Dialog>
              <Dialog speaker="b">
                模様替えの前に、家具の配置を確認するのと同じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "最初に見る3点",
          plainText:
            "仕様変更で、最初に見る3つ\n入力：受け取る条件（選択画面）は変わる？\n取得：どのテーブルから取っている？条件は？\n出力：何を、どんな形で出している？\nAくん：第1章のパイプライン（入力→取得→加工→出力）がそのまま調査の地図になるんですね。\n先生：その通り。毎回ゼロから読むのではなく、地図に沿って見る場所を決めると速いです。\nコード例：PARAMETERS/SELECT-OPTIONS→SELECT WHERE→WRITE/ALVの3か所を順に確認。入力だけ直してSELECT忘れはよくあるミス。",
          content: (
            <>
              <h2>仕様変更で、最初に見る3つ</h2>
              <ol>
                <li><strong>入力</strong>：受け取る条件（選択画面）は変わる？</li>
                <li><strong>取得</strong>：どのテーブルから取っている？ 条件は？</li>
                <li><strong>出力</strong>：何を、どんな形で出している？</li>
              </ol>
              <Figure
                src="image/12-investigate-pipeline.webp"
                alt="入力→取得→加工→出力のパイプライン図に虫めがねを重ね、仕様変更の調査時に各段（入力・取得・出力）のどこが変わるかを当てはめて見る『調査の地図』として描く。"
                caption="入力→取得→加工→出力のパイプラインを「調査の地図」として使う"
                kind="diagram"
              />
              <Dialog speaker="a">
                第1章のパイプライン（入力→取得→加工→出力）が、そのまま“調査の地図”になるんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。毎回ゼロから全部読むのではなく、地図に沿って「見る場所」を決めると、調査が速く・漏れなくなります。
              </Dialog>
              <h3>コードで見る：パイプラインに沿った調査</h3>
              <p>
                例：「会社コードの入力欄を追加してほしい」という要望が来たとき、
                次の3か所を<strong>順番に</strong>当たります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" --- ① 入力：選択画面 ---
" ★ ここに p_bukrs を追加する必要があるか？
PARAMETERS p_gjahr TYPE bkpf-gjahr.
SELECT-OPTIONS s_budat FOR bkpf-budat.

" --- ② 取得：DB からの SELECT ---
" ★ 新しい入力を WHERE に足す必要があるか？
SELECT belnr bukrs budat
  FROM bkpf
  INTO TABLE lt_bkpf
  WHERE gjahr = p_gjahr
    AND budat IN s_budat.

" --- ③ 出力：ALV / WRITE ---
" ★ 画面に bukrs 列を出す必要があるか？
LOOP AT lt_bkpf INTO ls_bkpf.
  WRITE: / ls_bkpf-belnr, ls_bkpf-bukrs, ls_bkpf-budat.
ENDLOOP.`}
              />
              <InfoPanel
                title="調査の順番（具体例）"
                variant="reference"
                lead="要望「会社コードで絞れるようにして」→ 次の3点をメモしながら読む。"
              >
                <ul>
                  <li>
                    <strong>① 入力</strong> … <code>PARAMETERS p_bukrs</code> を追加するか？
                    選択画面の定義（<code>PARAMETERS</code> / <code>SELECT-OPTIONS</code>）を確認
                  </li>
                  <li>
                    <strong>② 取得</strong> … <code>WHERE bukrs = p_bukrs</code> を足すか？
                    <code>SELECT</code> の条件句を確認（ここを忘れると入力しても効かない）
                  </li>
                  <li>
                    <strong>③ 出力</strong> … <code>WRITE</code> や ALV の列定義に <code>bukrs</code> を足すか？
                    利用者が結果を確認できるか確認
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                入力だけ直して <code>SELECT</code> を忘れると、「欄はあるのに絞れない」状態になりますね…。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。パイプラインの3か所を<strong>セットで</strong>チェックするのが、影響分析の基本です。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：修正の循環",
          plainText:
            "図で見る：影響分析 → 修正 → テスト\nflowchart：仕様差分を理解 → 影響分析 → 修正 → 回帰テスト →(問題あり)影響分析へ戻る／(OK)リリース\n先生：直したら必ず前と同じ動きが壊れていないか（回帰テスト）を確認する。直した所だけでなく周りも見るのがプロ。",
          content: (
            <>
              <h2>図で見る：影響分析 → 修正 → テスト</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A[仕様差分を理解] --> B[影響分析]
  B --> C[修正]
  C --> D[回帰テスト]
  D -->|問題あり| B
  D -->|OK| E[リリース]`}
              />
              <Dialog speaker="teacher">
                直したら必ず「前と同じ動きが壊れていないか（回帰テスト）」を確認します。直した所だけでなく、周りも見るのがプロです。
              </Dialog>
            </>
          ),
        },
        {
          title: "実務を支える習慣",
          plainText:
            "地味だけど効く4つの習慣\nコメント：なぜそうしたかを残す（次に直す人のため）\n命名：名前で役割が分かる（lv_total など意味のある名前）\n変更履歴：いつ・誰が・なぜ変えたかを残す\n単体テスト：部品ごとに期待通りか確かめる\nつまずき：動いたから完成と思いがち。実務では次の人が安全に直せることまで含めて完成。\nコード：x/y vs lv_subtotal/lv_taxの対比。コメントはなぜ、履歴は日付・担当・要件番号、テストは期待値を先に決める。",
          content: (
            <>
              <h2>地味だけど効く4つの習慣</h2>
              <ul>
                <li><strong>コメント</strong>：なぜそうしたかを残す（次に直す人のため）</li>
                <li><strong>命名</strong>：名前で役割が分かる（<code>lv_total</code> など意味のある名前）</li>
                <li><strong>変更履歴</strong>：いつ・誰が・なぜ変えたかを残す</li>
                <li><strong>単体テスト</strong>：部品ごとに「期待通りか」を確かめる</li>
              </ul>
              <Dialog speaker="stumble">
                「動いたから完成」と思いがち。実務では“次の人が安全に直せること”まで含めて完成です。
              </Dialog>
              <h3>コードで見る：コメントと命名</h3>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 半年後に読めない
DATA x TYPE i.
DATA y TYPE i.
x = x + 100.   " 加算
y = x / 10.

" ✅ 意図が伝わる
DATA lv_subtotal TYPE p DECIMALS 2.   " 税抜き小計
DATA lv_tax      TYPE p DECIMALS 2.   " 消費税（10%）
lv_subtotal = lv_subtotal + lv_shipping.
lv_tax = lv_subtotal / 10.`}
              />
              <InfoPanel
                title="4つの習慣をコードで見る"
                variant="breakdown"
                lead="地味ですが、次に直す人（未来の自分を含む）への配慮です。"
              >
                <ul>
                  <li>
                    <strong>コメント</strong> … 「何をしているか」より<strong>なぜそうしたか</strong>を残す。
                    例：<code>" 会計年度は4月始まりのため +3 ヶ月</code>
                  </li>
                  <li>
                    <strong>命名</strong> … <code>x</code> / <code>y</code> より <code>lv_subtotal</code> / <code>lv_tax</code>。
                    プレフィックス（<code>lv_</code>＝ローカル変数）もチームの約束に合わせる
                  </li>
                  <li>
                    <strong>変更履歴</strong> … プログラム先頭や修正箇所に
                    <code>" 2025/05/31 KS 会社コード絞り込み追加（要件#1234）</code> のように残す
                  </li>
                  <li>
                    <strong>単体テスト</strong> … 検証用の <code>FORM</code> やテストプログラムで、
                    「入力1000 → 税100」など<strong>期待値</strong>を先に決めて確かめる
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                命名とコメントは、影響分析のとき「この変数は何のためか」をすぐ思い出す助けになりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "「動けば良い」ではない",
          plainText:
            "「動く」と「使い続けられる」は違う\nその場で動くだけのコードは半年後に誰も触れなくなる。読みやすさ・直しやすさ・確認のしやすさまで含めてはじめて良いプログラム。\nAくん：品質は今動くかだけでなくこれからも安全に変えられるかで測るんですね。\nBちゃん：丁寧に作っておくと未来の自分が助かるんですね。やさしさだ…。",
          content: (
            <>
              <h2>「動く」と「使い続けられる」は違う</h2>
              <p>その場で動くだけのコードは、半年後に誰も触れなくなります。読みやすさ・直しやすさ・確認のしやすさまで含めて、はじめて“良いプログラム”です。</p>
              <Dialog speaker="a">
                品質は「今動くか」だけでなく「これからも安全に変えられるか」で測るんですね。
              </Dialog>
              <Dialog speaker="b">
                丁寧に作っておくと、未来の自分が助かるんですね。やさしさだ…。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：新規開発より既存改修が圧倒的に多い章。芯は「図面を読んでから触る」。\nBちゃん：コードが怖い→地図があれば迷子にならない。入力・取得・出力の3点セット。\nAくん：入力だけ直してSELECT忘れは欄はあるのに絞れない。3か所セットでチェック。\n先生：仕様差分→影響分析→修正→回帰テストの循環。直した所だけでなく周りも見る。\nつまずき：全部書き直す・テスト省略は実務の近道に見えて後から地獄。\nBちゃん：動いたら終わりじゃない。未来の自分へのやさしさ＝コメント・命名・履歴・テスト。\nAくん：品質＝今動く＋これからも安全に変えられる。\n先生：丁寧な仕事は未来の自分とチームへの贈り物。地味な習慣こそ一番効く。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                ここまで「新しいプログラムを書く」より、
                <strong>「既にあるものを、安全に直す」</strong>話が中心でした。
                実務ではこちらの方が圧倒的に多い——だから、この章の内容は
                <strong>明日からそのまま使える</strong>と思ってください。
              </Dialog>
              <Dialog speaker="b">
                正直、既存コードを触るのがいちばん怖かったです…。
                でも「増改築の前に図面を読む」で、
                <strong>いきなり壊す必要はない</strong>んですよね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚、とても大事です。怖さを消すのは「才能」ではなく
                <strong>調査の地図</strong>です。
                第1章のパイプライン——<strong>入力 → 取得 → 出力</strong>——
                に沿って見る場所を決めれば、迷子になりにくくなります。
              </Dialog>
              <Dialog speaker="a">
                具体例で言うと、「会社コードで絞れるようにして」が来たら、
                <code>PARAMETERS</code>（入力）→ <code>SELECT WHERE</code>（取得）→
                <code>WRITE</code> / ALV（出力）の<strong>3か所をセット</strong>で確認する。
                入力だけ直して <code>SELECT</code> を忘れると、
                「欄はあるのに絞れない」——これ、よくある事故ですね。
              </Dialog>
              <Dialog speaker="b">
                あ、それ完全にやりそう…。1か所直したら満足しちゃダメで、
                <strong>パイプライン全体</strong>を見る、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。修正の流れも型があります——
                <strong>仕様差分を理解 → 影響分析 → 修正 → 回帰テスト</strong>。
                テストで問題が出たら、また影響分析に戻る。
                「直した所だけ動けば OK」ではなく、
                <strong>直す前と同じ動きが壊れていないか</strong>まで見るのがプロです。
              </Dialog>
              <Dialog speaker="stumble">
                「とにかく全部書き直す」「テストは後でいい」——
                一見ラクに見えて、後から<strong>倍の時間</strong>を使う典型パターンです。
                実務の近道は、地図を読んでから少しずつ直す方です。
              </Dialog>
              <Dialog speaker="a">
                あと、地味だけど効く4つの習慣——
                コメント（<strong>なぜ</strong>）、命名（<code>lv_subtotal</code> など役割が分かる名前）、
                変更履歴（日付・担当・要件番号）、単体テスト（期待値を先に決める）——
                これは「今の自分」より<strong>次に直す人</strong>（未来の自分を含む）への配慮ですね。
              </Dialog>
              <Dialog speaker="b">
                「動いたら終わり」じゃなくて、
                <strong>次に直す人が困らない状態</strong>まで作るのが仕事、と分かりました。
                丁寧に書いておくのは、未来の自分へのやさしさなんですね…。
                地味な習慣が、チーム全体の安心につながる——それ、すごく大事だと思います。
              </Dialog>
              <Dialog speaker="a">
                品質は「今動くか」だけじゃなく、
                <strong>「これからも安全に変えられるか」</strong>で測る——
                この章でいちばん心に残った言葉です。
              </Dialog>
              <Dialog speaker="teacher">
                よくまとまりました。ABAP を学ぶ旅も、いよいよ「書く」から
                「<strong>長く使われるものを、長く使える形で直す</strong>」段階に入ります。
                覚えておいてほしいのは、この3つだけです——
              </Dialog>
              <Callout variant="tip">
                <strong>① 触る前に地図を読む</strong>（入力 → 取得 → 出力）<br />
                <strong>② 直したら回帰テスト</strong>（周りも含めて確認）<br />
                <strong>③ 地味な習慣を続ける</strong>（コメント・命名・履歴・テスト）<br />
                丁寧な仕事は、未来の自分とチームへの贈り物です。
              </Callout>
              <Dialog speaker="teacher">
                次の章では「速さ」と「直しやすさ」のバランス——
                10年後も使える書き方——に踏み込みます。
                ここまでの地図と習慣があれば、きっと乗り越えられます。自信を持って進みましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 修正した後に必ず行うべきことは？→ 回帰テスト（前の動きが壊れていないか確認）\nQ2 仕様変更の調査で最初の手がかりは？→ 入力→取得→出力のパイプラインで現状を追う\nQ3 地味だけど効く習慣を続ける価値は？→ 将来の改修と引き継ぎを安全にする\n今日のひとこと：丁寧な仕事は、未来の自分とチームへの贈り物。地味な習慣こそ一番効きます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="修正後は「前と同じ動きが壊れていないか」を確認する回帰テストが欠かせません。直した所だけでなく周辺も確認します。局所的な修正でも連鎖的に別機能へ影響するため、確認範囲を意識的に広げることが品質確保の鍵です。"
                question={<strong>プログラムを修正した後に必ず行うべきことは？</strong>}
                options={[
                  "コメントを全部消す",
                  "変数を全部グローバルにする",
                  "回帰テスト（前の動きが壊れていないか確認）",
                ]}
              />
              <Quiz
                answer={0}
                explanation="仕様変更の調査では「入力・取得・出力」のパイプラインに沿って現状を把握するのが近道です。調査軸を固定すると、影響漏れや思い込みによる修正ミスを減らし、説明可能な改修計画を立てやすくなります。"
                question={<strong>仕様変更の調査で、最初の手がかりになる見方は？</strong>}
                options={[
                  "入力→取得→出力のパイプラインで現状を追う",
                  "とにかくコードを上から全部書き直す",
                  "テストせずにすぐリリースする",
                ]}
              />
              <Quiz
                answer={1}
                explanation="コメント・命名・変更履歴・単体テストは、将来の改修時に意図と影響範囲を素早く把握するための土台です。日々の小さな記録があるほど、緊急対応でも安全に判断できるようになります。"
                question={<strong>実務で「地味だけど効く習慣」を続ける主な価値は？</strong>}
                options={[
                  "その場の実装速度だけを最大化できる",
                  "将来の改修と引き継ぎを安全にする",
                  "回帰テストを省略できるようになる",
                ]}
              />
              <Dialog speaker="closing">
                丁寧な仕事は、未来の自分とチームへの贈り物。地味な習慣こそ一番効きます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(RealWorldLesson);
