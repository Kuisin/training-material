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
  title: "モジュール化 — FORM/PERFORM・引数（USING/CHANGING）・スコープ",
  meta: "初学者 · 25分",
};

export default function ModularizationLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "10-modularization", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "プログラムを分かりやすくする\n処理をサブルーチンに分けると、なぜ分かりやすくなるのか。引数とスコープを学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・処理をサブルーチン（関数に近い）に分ける理由\n・サブルーチンへ値を渡す引数（USING / CHANGING）\n・変数のスコープ（グローバル＝全体／ローカル＝そのサブルーチンの中だけ）",
          content: (
            <>
              <hgroup>
                <h1>プログラムを分かりやすくする</h1>
                <p>処理をサブルーチンに分けると、なぜ分かりやすくなるのか。引数とスコープを学びます。</p>
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
                <li>処理をサブルーチン（他の言語の<strong>関数</strong>に近い）に分ける理由</li>
                <li>サブルーチンへ値を渡す引数（<code>USING</code> / <code>CHANGING</code>）</li>
                <li>変数のスコープ（グローバル＝全体／ローカル＝そのサブルーチンの中だけ）</li>
              </ul>
              <Callout variant="note">
                <strong>サブルーチン</strong>＝名前を付けた処理のかたまり。Excel のマクロや、他の言語の<strong>関数</strong>と同じ発想で、「必要なときに呼び出す」ものです。
              </Callout>
            </>
          ),
        },
        {
          title: "手順書のたとえ",
          plainText:
            "長い手順書は「章」に分ける\n1000行の手順書がのっぺり続くと、どこに何が書いてあるか分からない。準備／本作業／片付けと章に分ければ探すのも直すのも楽。プログラムも同じ。\n先生：処理を意味のかたまり（サブルーチン）に分けて名前を付ける。これがサブルーチンの発想。\nBちゃん：料理本も下ごしらえ／焼く／盛り付けに分かれてると作りやすいです。\n先生：そう。1つの長い文章より、見出しのある章立てのほうが探しやすいですよね。",
          content: (
            <>
              <h2>長い手順書は「章」に分ける</h2>
              <p>1000行の手順書がのっぺり続くと、どこに何が書いてあるか分かりません。「準備」「本作業」「片付け」と章に分ければ、探すのも直すのも楽になります。プログラムも同じです。</p>
              <Figure
                src="image/10-chapters.webp"
                alt="左：見出しのない、びっしり続く長い手順書（読みにくい）。右：準備・本作業・片付けと見出しで章分けされた手順書（探しやすい）。before/afterの対比。"
                caption="長い処理を章（サブルーチン）に分けると、探すのも直すのも楽になる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                処理を意味のかたまり（サブルーチン）に分けて名前を付ける。これがサブルーチンの発想です。
              </Dialog>
              <Dialog speaker="b">
                料理本も「下ごしらえ」「焼く」「盛り付け」に分かれてると作りやすいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜ分けるか",
          plainText:
            "分けると、3つ良いことがある\n読みやすい：名前を見れば何をする部分か分かる\n直しやすい：そのサブルーチンだけ直せばよい（影響範囲が狭い）\n再利用できる：同じ処理を何度も呼べる\nAくん：関数に切り出すのと同じ発想ですね。重複を1か所にまとめられる。\n先生：そう。同じ処理を何か所にもコピーすると、直すとき全部直さないといけません。1か所なら1回で済む。",
          content: (
            <>
              <h2>分けると、3つ良いことがある</h2>
              <ul>
                <li><strong>読みやすい</strong>：名前を見れば「何をする部分か」が分かる</li>
                <li><strong>直しやすい</strong>：そのサブルーチンだけ直せばよい（影響範囲が狭い）</li>
                <li><strong>再利用できる</strong>：同じ処理を何度も呼べる</li>
              </ul>
              <Dialog speaker="a">
                関数に切り出すのと同じ発想ですね。重複を1か所にまとめられる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。同じ処理を何か所にもコピーすると、直すとき全部直す羽目になります。1か所にまとめておけば、修正は1回で済みます。
              </Dialog>
            </>
          ),
        },
        {
          title: "FORMとPERFORM",
          plainText:
            "サブルーチンを作る FORM、呼ぶ PERFORM\nFORM でサブルーチンを定義し、PERFORM で呼び出す。値を渡すときは USING（渡すだけ）／CHANGING（渡して結果も受け取る）。\nPERFORM calc_tax USING lv_price CHANGING lv_tax.\nFORM calc_tax … USING p_price TYPE i … CHANGING p_tax TYPE i. … p_tax = p_price / 10. … ENDFORM.\n1行ずつ：PERFORM＝呼び出し／FORM calc_tax＝名前／USING p_price＝入力（lv_priceが入る）／CHANGING p_tax＝出力（lv_taxへ戻る）／代入＝中身／ENDFORM＝定義終了。\nInfoPanel：変数の動き（単価1000円の例）。\nBちゃん：全部CHANGINGに統一できない？先生：動くことはあるがUSINGは入力だけの宣言。PERFORM1行で入出力が分かる。\nInfoPanel：分ける理由＝読みやすさ・書き換え範囲の明示・後から読む人への配慮。\nAくん：USING/CHANGINGは結果を受け取る場所の看板。先生：矢印の向きをコード上で宣言しておく。",
          content: (
            <>
              <h2>サブルーチンを作る <code>FORM</code>、呼ぶ <code>PERFORM</code></h2>
              <p><code>FORM</code> でサブルーチン（関数のような処理）を定義し、<code>PERFORM</code> で呼び出します。値を渡すときは <code>USING</code>（渡すだけ）／<code>CHANGING</code>（渡して結果も受け取る）。</p>
              <CodeBlock
                language="ABAP"
                code={`" 呼び出し側
PERFORM calc_tax USING lv_price CHANGING lv_tax.

" サブルーチンの定義
FORM calc_tax
  USING    p_price TYPE i
  CHANGING p_tax   TYPE i.
  
  p_tax = p_price / 10.

ENDFORM.`}
              />
              <Dialog speaker="b">
                <code>PERFORM</code> は「税計算、お願い！」と<strong>頼む</strong>側で、
                <code>FORM</code> は「税の求め方」が書いてある<strong>サブルーチンそのもの</strong>、というイメージで合ってますか？
              </Dialog>
              <Dialog speaker="teacher">
                合っています。同じ名前 <code>calc_tax</code> で「どのサブルーチンか」を決めて、呼び出す側（<code>PERFORM</code>）と定義側（<code>FORM</code>）をつないでいます。
              </Dialog>
              <h3>1行ずつ読む</h3>
              <h4>呼び出し側</h4>
              <ul>
                <li>
                  <code>PERFORM calc_tax USING lv_price CHANGING lv_tax.</code> … 名前 <code>calc_tax</code> のサブルーチンを呼び出す。単価 <code>lv_price</code> を渡し（<code>USING</code>）、税額 <code>lv_tax</code> に結果を受け取る（<code>CHANGING</code>）
                </li>
              </ul>
              <h4>定義側（<code>FORM</code>）</h4>
              <ul>
                <li>
                  <code>FORM calc_tax</code> … サブルーチン定義の開始。<strong>名前</strong>は呼び出し側の <code>PERFORM calc_tax</code> と同じにする
                </li>
                <li>
                  <code>USING p_price TYPE i</code> … <strong>入力</strong>用の引数。呼び出し側の <code>lv_price</code> の値が、ここでは <code>p_price</code> という名前で受け取れる（<code>TYPE i</code>＝整数）
                </li>
                <li>
                  <code>CHANGING p_tax TYPE i.</code> … <strong>出力</strong>用の引数。呼び出し側の <code>lv_tax</code> と対応。サブルーチン内で <code>p_tax</code> に書いた値が、終了後に <code>lv_tax</code> へ戻る
                </li>
                <li>
                  <code>p_tax = p_price / 10.</code> … サブルーチンの<strong>中身</strong>。受け取った単価から税額を計算し、<code>p_tax</code> に代入する
                </li>
                <li>
                  <code>ENDFORM.</code> … サブルーチン定義の終了。ここで呼び出し元（<code>PERFORM</code> の次の行）に戻る
                </li>
              </ul>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                呼び出し側は <code>lv_</code>、定義側の引数は <code>p_</code> と名前を分けるのがよくある書き方です（同じ値でも、場所が違えば別名で受け取る）。
              </p>
              <Dialog speaker="b">
                単価は <code>USING</code> で渡すだけ、税額は <code>CHANGING</code> で結果をもらう…。
                空の小皿を渡して「計算結果をここに入れて！」って言ってる感じですか？
              </Dialog>
              <InfoPanel
                title="変数の動き（単価 1000 円の例）"
                variant="reference"
                lead={
                  <>
                    <code>PERFORM calc_tax USING lv_price CHANGING lv_tax.</code> を実行したとき、
                    変数がどう変わるかを順番に追います。
                  </>
                }
              >
                <ul>
                  <li>
                    <strong>① 呼び出し前</strong> … <code>lv_price = 1000</code>、<code>lv_tax</code> は空
                  </li>
                  <li>
                    <strong>② USING</strong> … <code>lv_price</code> の値（1000）が <code>p_price</code> にコピーされる。サブルーチン内では<strong>読むだけ</strong>
                  </li>
                  <li>
                    <strong>③ FORM 内で計算</strong> … <code>p_tax = p_price / 10</code> → <code>p_tax = 100</code>
                  </li>
                  <li>
                    <strong>④ CHANGING</strong> … <code>p_tax</code> に書いた 100 が、<code>ENDFORM</code> 後に <code>lv_tax</code> へ戻る
                  </li>
                  <li>
                    <strong>⑤ 呼び出し後</strong> … <code>lv_price = 1000</code> のまま、<code>lv_tax = 100</code> になる
                  </li>
                </ul>
              </InfoPanel>
              {/* <MermaidDiagram
                chart={`flowchart TD
  S["① 呼び出し前<br/>lv_price = 1000<br/>lv_tax = 空"]
  U["② USING<br/>1000 → p_price"]
  C["③ 計算<br/>p_tax = 100"]
  G["④ CHANGING<br/>100 → lv_tax"]
  E["⑤ 戻った後<br/>lv_price = 1000 のまま<br/>lv_tax = 100"]
  S --> U --> C --> G --> E`}
              /> */}
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                USING は<strong>入力だけ</strong>（呼び出し側は変わらない）／ CHANGING は<strong>結果を書き戻す</strong>
              </p>
              <Dialog speaker="teacher">
                <code>USING</code>＝「材料を渡す」、<code>CHANGING</code>＝「材料を渡して、加工後を返してもらう」。役割で使い分けます。
              </Dialog>
              <Dialog speaker="b">
                覚え方は合ってます。単価は「読むだけ」、税額は「書き換えてもらう箱」ですね。
                でも、入力も出力も全部 <code>CHANGING</code> に統一して、シンプルに書けないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                技術的には、全部 <code>CHANGING</code> だけでも動く書き方はあります。
                ただ <code>USING</code> は「<strong>ここは入力だけ</strong>」と宣言するためのキーワードです。
              </Dialog>
              <InfoPanel
                title="なぜ USING と CHANGING を分けるのか"
                variant="breakdown"
                lead="分ける理由は「正しく動くため」より、呼び出し側から見て読みやすくするためです。"
              >
                <ul>
                  <li>
                    <strong>PERFORM の1行だけで入出力が分かる</strong> …{" "}
                    <code>USING lv_price</code>＝渡すだけ、<code>CHANGING lv_tax</code>＝結果が入る箱。
                    サブルーチンの中身を開かなくても、「どこに答えが返るか」が分かります
                  </li>
                  <li>
                    <strong>書き換えてほしくない値を明示できる</strong> … 単価（<code>lv_price</code>）は読むだけ、
                    税額（<code>lv_tax</code>）だけが書き換わる、と意図をはっきり示せます
                  </li>
                  <li>
                    <strong>後から読む人への配慮</strong> … 3ヶ月後の自分や、初めて見る仲間が
                    「どの変数が結果を受け取るか」をすぐ追えるようになります
                  </li>
                </ul>
                <p className="mb-2 mt-4 font-semibold">全部 CHANGING にした場合</p>
                <ul>
                  <li>
                    動くことはありますが、<code>PERFORM</code> の行だけ見ても
                    「どれが入力で、どれが出力か」が分かりにくくなります
                  </li>
                  <li>
                    そのたびに <code>FORM</code> の中身まで読んで、どの引数に結果を書いているか確認する必要が出ます
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                つまり <code>USING</code> / <code>CHANGING</code> は、値の渡し方の設定だけでなく、
                「この変数は結果を受け取る場所ですよ」という<strong>看板</strong>なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                いいまとめです。入口だけ（<code>USING</code>）か、入口かつ出口（<code>CHANGING</code>）か。
                矢印の向きをコード上で宣言しておく、と覚えてください。
              </Dialog>
              <Callout variant="note">
                補足：この例は <code>p_price</code> / <code>p_tax</code> が <code>TYPE i</code>（整数）なので、ABAPの整数除算は切り捨てではなく<strong>四捨五入</strong>されます（例：<code>105 / 10</code> → <code>11</code>）。金額・税率を正確に扱うときは <code>TYPE p DECIMALS 2</code> を使うのが安全です。
              </Callout>
            </>
          ),
        },
        {
          title: "変数スコープ",
          plainText:
            "グローバル と ローカル\nDATA の宣言場所で決まる。FORM の外＝グローバル、FORM の中＝ローカル。\nDATA lv_total（外）… FORM 内 DATA lv_step（作業用・その FORM だけ）… ENDFORM 後 lv_step は使えない。\nBちゃん：作業用も外に DATA 宣言しちゃダメ？先生：動くがどの FORM 用か分からなくなる。FORM 内 DATA がよい。\nつまずき：何でもグローバルにするとどこで値が変わったか追えない。",
          content: (
            <>
              <h2>グローバル と ローカル</h2>
              <p>
                前のスライドでは <code>USING</code> / <code>CHANGING</code> で<strong>値の渡し方</strong>を学びました。
                ここでは <code>DATA</code> を<strong>どこで宣言するか</strong>で決まる、変数の見える範囲（スコープ）を見ます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" --- FORM の外（メインプログラム）---
DATA lv_total TYPE i VALUE 0.    " グローバル：どの FORM からも見える

PERFORM add_ten CHANGING lv_total.

" --- FORM の中 ---
FORM add_ten CHANGING p_total TYPE i.
  DATA lv_step TYPE i VALUE 10.  " ローカル：この FORM の中だけ

  p_total = p_total + lv_step.
ENDFORM.
" ENDFORM 後：lv_step はもう使えない。lv_total だけ残る`}
              />
              <h3>1行ずつ読む（スコープに注目）</h3>
              <ul>
                <li>
                  <code>DATA lv_total TYPE i VALUE 0.</code> … <strong>グローバル</strong>。
                  <code>FORM</code> の<strong>外</strong>で宣言 → プログラム全体から見える
                </li>
                <li>
                  <code>DATA lv_step TYPE i VALUE 10.</code> … <strong>ローカル</strong>。
                  <code>FORM</code> の<strong>中</strong>で宣言 → この <code>FORM</code> の実行中だけ使える作業用変数
                </li>
                <li>
                  <code>p_total = p_total + lv_step.</code> … ローカルの <code>lv_step</code> を使って計算。
                  結果の返し方（<code>CHANGING</code>）は前のスライドのとおり
                </li>
                <li>
                  <code>ENDFORM.</code> … <code>lv_step</code> はここで役目終了。
                  次に同じ <code>FORM</code> を呼んでも <code>lv_step</code> はまた <code>VALUE 10</code> から始まる
                </li>
              </ul>
              <InfoPanel
                title="スコープのルール"
                variant="breakdown"
                lead="比喩：グローバル＝共有の掲示板、ローカル＝手元のメモ。"
              >
                <ul>
                  <li>
                    <strong>グローバル</strong> … <code>FORM</code> の<strong>外</strong>の <code>DATA</code>。
                    複数の <code>FORM</code> から共有したい値向け（使いすぎ注意）
                  </li>
                  <li>
                    <strong>ローカル</strong> … <code>FORM</code> の<strong>中</strong>の <code>DATA</code>。
                    その <code>FORM</code> だけで使う作業用（ループの一時値、計算の途中結果など）
                  </li>
                  <li>
                    <strong>引数</strong>（<code>USING</code> / <code>CHANGING</code>）… 呼び出し側と意図的につなぐ窓口（前スライド）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                <code>lv_step</code> も <code>FORM</code> の外に <code>DATA</code> 宣言しちゃダメなんですか？
                グローバルなら <code>FORM</code> からも見えますよね。
              </Dialog>
              <Dialog speaker="teacher">
                動くことはあります。でも外に出すと「どの <code>FORM</code> 専用の作業変数か」が分かりにくくなります。
                <strong>その <code>FORM</code> の中だけで使うものは、<code>FORM</code> の中で <code>DATA</code></strong>。
                手元のメモで済むなら、掲示板に貼らない、です。
              </Dialog>
              <Dialog speaker="stumble">
                何でもグローバルにすると、どこで値が変わったか追えなくなる。→ できるだけローカルに閉じ込めるのが安全です。
              </Dialog>
              <Dialog speaker="a">
                スコープを狭く保つと、影響範囲が読めて安心ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚で正解です。「手元のメモ（ローカル）で済むなら、共有の掲示板（グローバル）には貼らない」と覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：メインとサブルーチン",
          plainText:
            "図で見る：メインからサブルーチンを呼ぶ\nflowchart：メイン処理 → PERFORM 入力チェック／データ取得／整形／出力・ダウンロード\nこの章のABAPキーワード：FORM / PERFORM / USING / CHANGING / グローバル・ローカル。",
          content: (
            <>
              <h2>図で見る：メインからサブルーチンを呼ぶ</h2>
              <MermaidDiagram
                chart={`flowchart TD
  M[メイン処理] --> A[PERFORM 入力チェック]
  M --> B[PERFORM データ取得]
  M --> C[PERFORM 整形]
  M --> D[PERFORM 出力/ダウンロード]`}
              />
              <Callout variant="tip">
                この章のABAPキーワード：<code>FORM</code> / <code>PERFORM</code> / <code>USING</code> / <code>CHANGING</code> / グローバル・ローカル。
              </Callout>
            </>
          ),
        },
        {
          title: "GUI・イベント・DL",
          plainText:
            "画面・イベント・ダウンロード\nレポートのライフサイクル：INITIALIZATION→START-OF-SELECTION→END-OF-SELECTION→TOP-OF-PAGE。ボタン押下はAT USER-COMMAND。\nSET TITLEBAR/SET PF-STATUSで画面を整え、GUI_DOWNLOADでファイル出力。\n汎用モジュール（CALL FUNCTION）はプログラム横断の共通処理。パラメータ変更は全利用先に影響するので注意。",
          content: (
            <>
              <h2>画面・イベント・ダウンロード処理もサブルーチンに</h2>
              <p>
                実務では、画面の表示・ボタンが押されたときの処理（イベント）・ファイルのダウンロードなども、
                それぞれサブルーチンに分けて整理します。機能が増えるほど、この“分ける力”が効いてきます。
              </p>
              <Figure
                src="image/10-gui-modules.webp"
                alt="左：画面とボタンがあるアプリ画面。右：メインプログラムから3つのサブルーチン（画面表示・イベント処理・ファイルダウンロード）へPERFORMで分岐する構成図。GUIまわりも役割ごとに分けるイメージ。"
                caption="画面表示／ボタン押下／ダウンロードも、それぞれ別のサブルーチンに分けて整理する"
                kind="concept"
              />
              <h3>レポートのイベント（処理のタイミング）</h3>
              <ul>
                <li><code>INITIALIZATION</code> … プログラム開始時の初期設定</li>
                <li><code>START-OF-SELECTION</code> … メイン処理の入口（データ取得・加工）</li>
                <li><code>END-OF-SELECTION</code> … メイン処理の後（結果表示・ダウンロード準備）</li>
                <li><code>TOP-OF-PAGE</code> … 改ページ時の見出し出力</li>
                <li><code>AT SELECTION-SCREEN</code> … 選択画面での入力チェック</li>
                <li><code>AT USER-COMMAND</code> … ツールバーのボタンが押されたとき</li>
              </ul>
              <h3>画面とダウンロード</h3>
              <CodeBlock
                language="ABAP"
                code={`" 画面のタイトルとボタン（PF-STATUS）を設定
SET TITLEBAR '仕訳日記帳'.
SET PF-STATUS 'ZSTATUS' EXCLUDING lt_exclude.

" ファイル保存ダイアログ → PCへダウンロード
CALL METHOD cl_gui_frontend_services=>file_save_dialog
  EXPORTING default_extension = 'txt'
  CHANGING  filename           = lv_path.

CALL FUNCTION 'GUI_DOWNLOAD'
  EXPORTING filename = lv_path filetype = 'ASC'
  TABLES    data_tab = lt_out.`}
              />
              <InfoPanel
                title="汎用モジュール（Function Module）"
                variant="reference"
                lead={
                  <>
                    <code>CALL FUNCTION &apos;...&apos;</code> で呼ぶ、SAP 全体で再利用できる共通処理。
                    第11章の BAPI も同じ呼び方です。
                  </>
                }
              >
                <ul>
                  <li><strong>再利用</strong> … 検証・ダウンロードなど、複数プログラムで同じ処理を共通化できる</li>
                  <li><strong>注意</strong> … インターフェース（引数）を変えると、利用している<strong>全プログラム</strong>に影響する</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                今は「役割ごとに分ける」という発想と、イベントが“いつ動くか”の位置づけだけ押さえれば十分です。
                詳しい書き方は使うときに深めていきましょう。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="11-document-posting"
                slide={6}
                label="第11章: 会計伝票登録（BAPI）へ進む"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：要点は、処理を役割単位のサブルーチンに分けて読む人が流れを追える構造にすること。FORMで定義しPERFORMで呼び、USINGとCHANGINGでデータの出入りを明確にする。\nAくん：引数の向きを明示すると副作用が見えやすい。ローカル変数中心にすればどこで値が変わるか追跡しやすく、修正時の影響範囲も限定できる。\nBちゃん：長いコードを章立てして読む感覚で、サブルーチンごとに意味がまとまっていると安心。機能追加のときもどこを触るか判断しやすい。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の要点は、処理を役割単位のサブルーチンに分けて、読む人が流れを追える構造にすることです。FORMで定義しPERFORMで呼び、USINGとCHANGINGでデータの出入りを明確にします。
              </Dialog>
              <Dialog speaker="a">
                引数の向きを明示すると副作用が見えやすくなりますね。さらにローカル変数中心にすれば、どこで値が変わるか追跡しやすく、修正時の影響範囲も限定できる。
              </Dialog>
              <Dialog speaker="b">
                長いコードを章立てして読む感覚で、サブルーチンごとに意味がまとまっていると安心です。後で機能追加するときも、どこを触るか判断しやすくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 処理をサブルーチンに分ける利点は？→ 読みやすく・直しやすく・再利用しやすくなる\nQ2 サブルーチンに値を渡し加工後の結果も受け取りたいときは？→ CHANGING\nQ3 保守性を高める変数設計は？→ 可能な限りローカル変数に閉じ込める\n今日のひとこと：分けることは未来の自分と仲間への親切。整理されたコードはそれだけで価値があります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="処理をサブルーチンに分けると「読みやすい・直しやすい・再利用できる」。どこを直せばよいか分かりやすくなります。結果として、仕様変更時に修正対象を局所化でき、レビューやテストの負担も軽減されます。"
                question={<strong>処理をサブルーチンに分ける利点として正しいのは？</strong>}
                options={[
                  "プログラムのファイルサイズが必ず小さくなる",
                  "読みやすく・直しやすく・再利用しやすくなる",
                  "実行が必ず速くなる",
                ]}
              />
              <Quiz
                answer={2}
                explanation="USING は値を渡すだけ、CHANGING は渡して加工後の結果も受け取ります。どちらを使うかを明示しておくと、呼び出し側から見たデータ更新の有無が分かり、副作用を読み解きやすくなります。"
                question={<strong>サブルーチンに値を渡し、加工後の結果も受け取りたいときに使うのは？</strong>}
                options={["WRITE", "USING", "CHANGING"]}
              />
              <Quiz
                answer={1}
                explanation="ローカル変数はそのサブルーチン内でのみ有効なため、値の変更範囲を閉じ込められます。グローバル変数を乱用すると、どこで値が変わったか追いにくくなり保守性が低下します。"
                question={<strong>保守性を高めるための変数設計として望ましいのは？</strong>}
                options={[
                  "更新が必要な値はすべてグローバルに置く",
                  "可能な限りローカル変数に閉じ込める",
                  "変数名を短くしてスコープを気にしない",
                ]}
              />
              <Dialog speaker="closing">
                分けることは、未来の自分と仲間への親切。整理されたコードは、それだけで価値があります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ModularizationLesson);
