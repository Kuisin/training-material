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
  title: "実務と品質 — 可読性・設計思想・知識の地図",
  meta: "初学者 · 30分",
};

export default function RealWorldLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "17-real-world", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "実務と品質 — 知識の仕上げ\n会計伝票登録IFに必要な知識の最終章。可読性・設計思想・実務の進め方を統合し、学んだ知識の縦串を地図にします。\n⏱ 30分 / 📶 初学者\n手を動かす演習は別資料。ここでは設計書やコードを読み続けられる土台を固めます。",
          content: (
            <>
              <hgroup>
                <h1>実務と品質 — 知識の仕上げ</h1>
                <p>
                  会計伝票登録 IF に必要な知識の最終章です。
                  可読性・設計思想・実務の進め方を統合し、<strong>学んだ知識の縦串</strong>を地図にします。
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
                <li>コメント・変更履歴・<code>CASE</code> など可読性の型</li>
                <li>設計書の読み方と影響分析 → 回帰テストの循環</li>
                <li>10年後も使えるシンプル設計の考え方</li>
                <li>会計伝票登録を題材にした<strong>知識の地図</strong></li>
              </ul>
              <Callout variant="note">
                手を動かす演習は<strong>別資料</strong>です。本章は知識の仕上げとして、設計書やコードを読み続けられる土台を固めます。
              </Callout>
            </>
          ),
        },
        {
          title: "コメントと明示的な記述",
          plainText:
            "コメントは処理意図 — 変更履歴 — CASE・明示的記述\nコメントは「なぜそうするか」を書く。変更履歴はいつ・なぜ・何を。値の分岐はCASE、SORTはASCENDING/DESCENDINGを明示。IF NOTの多用は避ける。",
          content: (
            <>
              <h2>コメントは処理意図 / 変更履歴 / 明示的な記述</h2>
              <p>
                性能の型を学んだあと、<strong>半年後の自分や後任が読めるか</strong>が品質の另一半分です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" コメント＝処理の意図（「なぜこうするか」）
" 会社コードで絞った後、日付順に出力するためソート
SORT lt_bkpf BY bukrs ASCENDING
                budat ASCENDING.

" 複数値の分岐 → CASE が読みやすい
CASE ls_bkpf-blart.
  WHEN 'SA' OR 'KR'.
    " 総勘定・仕入先
  WHEN OTHERS.
    " その他
ENDCASE.

" 変更履歴の例（プログラムヘッダや修正箇所）
" 2025/05/31 KS 会社コード絞り込み追加（要件#1234）`}
              />
              <InfoPanel title="可読性チェックリスト" variant="reference">
                <ul>
                  <li><strong>コメント</strong> … 処理の意図を書く。デバッグ残しではない</li>
                  <li><strong>変更履歴</strong> … いつ・なぜ・何を（チケット番号も）</li>
                  <li><strong>明示的な指定</strong> … <code>SORT ... ASCENDING</code> のように暗黙の既定値に頼らない</li>
                  <li><strong>条件分岐</strong> … 値の分岐は <code>CASE</code> を優先。<code>IF NOT</code> の多用は避ける</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                「読みにくいから直しにくい」。シンプルでルールに沿ったコードが、長期運用では最強です。
              </Dialog>
            </>
          ),
        },
        {
          title: "設計書を先に読む",
          plainText:
            "設計書を先に読む\n実装の前に、設計書・仕様で入力・取得・出力・例外を把握する。小さく作って都度テストする（第3章と同じリズム）。\n先生：コードを書く速度より、仕様の理解が品質の土台。",
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
                「なぜこの処理か」は設計書に書いてあります。
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
          title: "登録系の落とし穴",
          plainText:
            "登録系プログラムの落とし穴\n連携登録は実案件と同型。RETURN未確認のCOMMIT、DEQUEUE忘れ、履歴なしの再実行で二重登録、が典型障害。設計書でロック単位・コミットタイミング・履歴キーを必ず確認。\n用語：COMMIT＝DBへの変更を確定する命令（実行するまで変更は仮）／ENQUEUE・DEQUEUE＝ロックの取得・解放（他の人が同時に同じ伝票を触らないようにする）／RETURNテーブル＝BAPIが返すメッセージ一覧（成功・警告・エラーが行で入る）。\nBちゃん：COMMITとかENQUEUEとか、言葉が難しいです…。\n先生：COMMIT＝保存ボタン、ENQUEUE＝使用中の札をかける、DEQUEUE＝札を外す。SY-SUBRCは入口の合図だけで、RETURNの中身まで見ないと本当の成否は分からない。\nAくん：登録系は「成功したつもり」が一番こわい。RETURNを見て、確定して、札を外すまでが1セット。",
          content: (
            <>
              <h2>登録系プログラムでよくある落とし穴</h2>
              <p>
                本コースで学んだ「ファイル取込 → BAPI 登録 → 履歴」は、実務の連携案件とほぼ同じ構成です。
                保守・テストでは、次の3点を特に確認します。
              </p>
              <ul>
                <li>
                  <strong>BAPI とコミットの関係</strong> … 成功判定のあとだけ確定する。
                  <code>RETURN</code> にエラーがあるのにコミットしていないか
                </li>
                <li>
                  <strong><code>RETURN</code> テーブル</strong> … <code>SY-SUBRC</code> だけでは不十分なことが多い
                </li>
                <li>
                  <strong>ロック（<code>ENQUEUE</code> / <code>DEQUEUE</code>）</strong> … 解放忘れは他処理を止める。
                  履歴なしの再実行は二重登録につながる
                </li>
              </ul>
              <Callout variant="note">
                <strong>用語ミニ辞典</strong><br />
                <code>COMMIT</code> … DBへの変更を<strong>確定</strong>する命令（実行するまで変更は仮）<br />
                <code>ENQUEUE</code> / <code>DEQUEUE</code> … ロックの<strong>取得・解放</strong>（他の人が同時に同じ伝票を触らないようにする）<br />
                <code>RETURN</code> テーブル … BAPIが返す<strong>メッセージ一覧</strong>（成功・警告・エラーが行で入る）
              </Callout>
              <Dialog speaker="b">
                <code>COMMIT</code> とか <code>ENQUEUE</code> とか、言葉が難しいです…。
              </Dialog>
              <Dialog speaker="teacher">
                身近なものに置き換えると、<code>COMMIT</code>＝<strong>保存ボタン</strong>、
                <code>ENQUEUE</code>＝<strong>「使用中」の札をかける</strong>、
                <code>DEQUEUE</code>＝<strong>札を外す</strong>、です。
                <br />
                注意したいのは、<code>SY-SUBRC</code> は<strong>入口の合図</strong>だけということ。
                <code>RETURN</code> の中身まで見ないと、本当に成功したかは分かりません。
              </Dialog>
              <Dialog speaker="a">
                登録系は「<strong>成功したつもり</strong>」が一番こわいですね。
                <code>RETURN</code> を見て、確定して、札を外すまでが<strong>1セット</strong>だと覚えます。
              </Dialog>
              <Dialog speaker="teacher">
                仕様変更の影響分析でも、「登録の型」のどの段（読込・検証・ロック・BAPI・履歴）に触れるかを
                会計伝票登録の全体フローに当てはめると漏れが減ります。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：修正の循環",
          plainText:
            "図で見る：影響分析 → 修正 → テスト\nflowchart：仕様差分を理解 → 影響分析 → 修正 → 回帰テスト →(問題あり)影響分析へ戻る／(OK)リリース\n用語：影響分析＝直すと他のどこに影響が出るかを事前に洗い出すこと／回帰テスト＝直したあと、前から動いていた機能が壊れていないか確かめるテスト。\n先生：直したら必ず前と同じ動きが壊れていないか（回帰テスト）を確認する。直した所だけでなく周りも見るのがプロ。\nBちゃん：回帰テストって、直した所をテストすることだと思っていました…。\n先生：触っていない周りの機能まで確かめるのが回帰テスト。1か所の修正が別の場所に響くことがあるから。問題ありなら、また影響分析へ戻ってループする。\nAくん：影響分析で「どこに響くか」を予想し、回帰テストで「本当に響いていないか」を確かめる。予想と検証はセット。",
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
              <Callout variant="note">
                <strong>影響分析</strong> … 直すと<strong>他のどこに影響が出るか</strong>を事前に洗い出すこと<br />
                <strong>回帰テスト</strong> … 直したあと、<strong>前から動いていた機能が壊れていないか</strong>を確かめるテスト
              </Callout>
              <Dialog speaker="teacher">
                直したら必ず「前と同じ動きが壊れていないか（回帰テスト）」を確認します。直した所だけでなく、周りも見るのがプロです。
              </Dialog>
              <Dialog speaker="b">
                「回帰テスト」って、直した所をテストすることだと思っていました…。
              </Dialog>
              <Dialog speaker="teacher">
                直した所ではなく、<strong>触っていない周りの機能まで</strong>確かめるのが回帰テストです。
                1か所の修正が別の場所に響くことがあるからですね。
                <br />
                問題が見つかったら、また<strong>影響分析へ戻って</strong>ループします。
              </Dialog>
              <Dialog speaker="a">
                影響分析で「どこに響くか」を<strong>予想</strong>し、回帰テストで「本当に響いていないか」を<strong>確かめる</strong>。
                予想と検証はセットなんですね。
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
          title: "10年後も使えるコード",
          plainText:
            "10年後も使えるコード — シンプル設計 — 保守者は未来の他人\n業務プログラムは継続利用・改修前提。少量データでは高速→本番大量で停止、は典型失敗。部品化（FORM/FM）で直す範囲を狭く。保守者は未来の他人（未来の自分を含む）。",
          content: (
            <>
              <h2>10年後も使えるコード</h2>
              <p>
                業務プログラムは「一度作って終わり」ではありません。
                <strong>継続的に使われ、改修される</strong>ものとして捉えます。
                10年後に元の開発者がいなくても、誰かが安全に直せる。それが実務の品質基準です。
              </p>
              <InfoPanel title="シンプル設計の原則" variant="reference">
                <ul>
                  <li><strong>部品化</strong> … 取得・検証・登録・履歴を <code>FORM</code> / FM に分け、直す範囲を狭く保つ</li>
                  <li><strong>イベントは目次</strong> … イベントブロックには <code>PERFORM</code> だけ並べ、処理は <code>FORM</code> へ</li>
                  <li><strong>開発標準に合わせる</strong> … 命名規則（<code>lv_</code> など）をチームで揃える</li>
                  <li><strong>変更履歴を残す</strong> … いつ・なぜ・何を変えたかを記録する</li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                よくある失敗：少量データでは高速 → 本番の大量データで処理が停止する。
                性能の型（前章）と可読性の型（本章）をセットで守ることが、長期運用の土台です。
              </Callout>
              <Dialog speaker="teacher">
                保守者は<strong>未来の他人</strong>です。未来の自分も、半年後には「他人」に近い。
                丁寧に書いておくのは、チーム全体へのやさしさです。
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
          title: "知識の地図",
          plainText:
            "知識の地図 — 会計伝票登録の縦串\n外部ファイル→論理ファイル→OPEN/READ/SPLIT→検証→ロック→BAPI+RETURN→COMMIT/ROLLBACK→履歴→DEQUEUE。横にDDIC・FM・性能・可読性が支える。",
          content: (
            <>
              <h2>知識の地図 — 会計伝票登録の縦串</h2>
              <p>
                本コースで学んだ知識が、会計伝票登録 IF の1本の処理にどう並ぶかを整理します。
              </p>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph prep [土台の知識]
    O[IF全体像]
    D[データ設計 DDIC・履歴]
    F[汎用モジュール]
  end
  subgraph flow [処理の縦串]
    E1[外部ファイル] --> E2[論理ファイル OPEN/READ]
    E2 --> E3[SPLIT 分解・検証]
    E3 --> E4[ENQUEUE ロック]
    E4 --> E5[BAPI + RETURN]
    E5 --> E6[COMMIT / ROLLBACK]
    E6 --> E7[履歴テーブル更新]
    E7 --> E8[DEQUEUE]
    E8 --> E9[結果一覧レポート]
  end
  subgraph qual [品質の知識]
    P[性能 SELECT最適化]
    Q[可読性・設計思想]
  end
  prep --> flow
  qual --> flow`}
              />
              <InfoPanel title="各レッスンとの対応" variant="reference">
                <ul>
                  <li>IF全体像 … <code>11-if-integration-overview</code></li>
                  <li>データ設計 … <code>12-data-design</code></li>
                  <li>汎用モジュール … <code>13-function-modules</code></li>
                  <li>ファイル連携 … <code>14-files-jobs-and-batch</code></li>
                  <li>BAPI・ロック … <code>15-document-posting</code></li>
                  <li>性能 … <code>16-good-programming</code></li>
                  <li>品質・実務 … 本章</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                設計書を読むときは、この縦串に各処理がどこに当たるかを意識すると、
                全体像が一度に掴めます。演習で手を動かすときも、この地図を手元に置いてください。
              </Dialog>
              <div className="mt-4 flex flex-wrap gap-2">
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="11-if-integration-overview"
                  slide={1}
                  label="IF全体像を復習"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="15-document-posting"
                  slide={4}
                  label="BAPI登録を復習"
                  variant="back"
                />
              </div>
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
                実務ではこちらの方が圧倒的に多い。だから、この章の内容は
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
                第1章のパイプライン。<strong>入力 → 取得 → 出力</strong>。
                に沿って見る場所を決めれば、迷子になりにくくなります。
              </Dialog>
              <Dialog speaker="a">
                具体例で言うと、「会社コードで絞れるようにして」が来たら、
                <code>PARAMETERS</code>（入力）→ <code>SELECT WHERE</code>（取得）→
                <code>WRITE</code> / ALV（出力）の<strong>3か所をセット</strong>で確認する。
                入力だけ直して <code>SELECT</code> を忘れると、
                「欄はあるのに絞れない」。これ、よくある事故ですね。
              </Dialog>
              <Dialog speaker="b">
                あ、それ完全にやりそう…。1か所直したら満足しちゃダメで、
                <strong>パイプライン全体</strong>を見る、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。修正の流れも型があります。
                <strong>仕様差分を理解 → 影響分析 → 修正 → 回帰テスト</strong>。
                テストで問題が出たら、また影響分析に戻る。
                「直した所だけ動けば OK」ではなく、
                <strong>直す前と同じ動きが壊れていないか</strong>まで見るのがプロです。
              </Dialog>
              <Dialog speaker="stumble">
                「とにかく全部書き直す」「テストは後でいい」。
                一見ラクに見えて、後から<strong>倍の時間</strong>を使う典型パターンです。
                実務の近道は、地図を読んでから少しずつ直す方です。
              </Dialog>
              <Dialog speaker="a">
                あと、地味だけど効く4つの習慣。
                コメント（<strong>なぜ</strong>）、命名（<code>lv_subtotal</code> など役割が分かる名前）、
                変更履歴（日付・担当・要件番号）、単体テスト（期待値を先に決める）。
                これは「今の自分」より<strong>次に直す人</strong>（未来の自分を含む）への配慮ですね。
              </Dialog>
              <Dialog speaker="b">
                「動いたら終わり」じゃなくて、
                <strong>次に直す人が困らない状態</strong>まで作るのが仕事、と分かりました。
                丁寧に書いておくのは、未来の自分へのやさしさなんですね…。
                地味な習慣が、チーム全体の安心につながる。それ、すごく大事だと思います。
              </Dialog>
              <Dialog speaker="a">
                品質は「今動くか」だけじゃなく、
                <strong>「これからも安全に変えられるか」</strong>で測る。
                この章でいちばん心に残った言葉です。
              </Dialog>
              <Dialog speaker="teacher">
                よくまとまりました。ABAP を学ぶ旅も、いよいよ「書く」から
                「<strong>長く使われるものを、長く使える形で直す</strong>」段階に入ります。
                覚えておいてほしいのは、この3つだけです。
              </Dialog>
              <Callout variant="tip">
                <strong>① 触る前に地図を読む</strong>（入力 → 取得 → 出力）<br />
                <strong>② 直したら回帰テスト</strong>（周りも含めて確認）<br />
                <strong>③ 地味な習慣を続ける</strong>（コメント・命名・履歴・テスト）<br />
                丁寧な仕事は、未来の自分とチームへの贈り物です。
              </Callout>
              <Dialog speaker="teacher">
                知識の地図まで辿り着きました。設計書やコードを読むときは、
                この縦串に処理を当てはめる習慣を続けてください。
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
