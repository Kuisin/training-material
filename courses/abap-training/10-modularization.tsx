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
            "プログラムを分かりやすくする\n処理をサブルーチンに分けると、なぜ分かりやすくなるのか。引数とスコープを学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・処理をサブルーチン（関数に近い）に分ける理由\n・サブルーチンへ値を渡す引数（USING / CHANGING）\n・変数のスコープ（グローバル＝全体／ローカル＝そのサブルーチンの中だけ）\n補足：処理をサブルーチンに分けるのは「大きな問題を小さく分けて解く」分割統治（ディバイド・アンド・コンカー）の実践。考え方の背景は別コンテンツ「分割統治」で詳しく解説。",
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
              <Callout variant="tip">
                処理をサブルーチンに分けるのは、「大きな問題を小さく分けて解く」という
                <strong>分割統治（ディバイド・アンド・コンカー）</strong>の実践です。
                考え方の背景は、別コンテンツで詳しく解説しています。
              </Callout>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="18-divide-and-conquer"
                label="参考: 分割統治（ディバイド・アンド・コンカー）を学ぶ"
                className="mb-4"
              />
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
            "分けると、3つ良いことがある\n読みやすい：名前を見れば何をする部分か分かる\n直しやすい：そのサブルーチンだけ直せばよい（影響範囲が狭い）\n再利用できる：同じ処理を何度も呼べる\nAくん：関数に切り出すのと同じ発想ですね。重複を1か所にまとめられる。\n先生：そう。同じ処理を何か所にもコピーすると、直すとき全部直さないといけません。1か所なら1回で済む。\n具体例：商品A/B/Cの税額を同じ式でコピペすると、税率10%→8%変更時に3か所直す必要があり、直し忘れがバグになる。\nBちゃん：もし税率が変わったら3か所全部直すんですか？こわい。\n先生：そう。コピペした数だけ直す場所が増える。サブルーチンなら計算式は1か所だけ。\n改善後：PERFORM calc_tax を3回呼ぶだけ。税率を変えるときは calc_tax の中の1行を直せば、3つとも一気に直る。\nBちゃん：calc_tax の中の / 10 の「10」はまだベタ書き。定数にしたほうがよくない？\n先生：良い気づき。意味の分からない数字（マジックナンバー）は CONSTANTS で名前付き定数にするのがおすすめ。\nCONSTANTS c_tax_divisor TYPE i VALUE 10. として p_tax = p_price / c_tax_divisor とすれば意味が分かる。\nBちゃん：名前で意味が分かるし、定数はうっかり書き換えられないのもいい。\n先生：DATA と違い CONSTANTS は値を変えられない。サブルーチンで処理をまとめ、定数で数値に名前を付けるのは同じ「読む人にやさしく」の発想。\nBちゃん：定数で名前を付けられるなら、もう calc_tax のサブルーチンはいらなくない？各行を lv_tax_a = lv_price_a / c_tax_divisor と書けば十分では？\n先生：定数とサブルーチンは解決していることが別もの。定数で書いても3行コピペは残る。定数が名前を付けるのは「10」という値ひとつだけで、計算の手順そのものは3か所に散らばったまま。切り捨てなど仕様が変われば3行とも直す羽目に。calc_tax にまとめれば手順の変更も1か所で済む。\nBちゃん：定数は「値に名前」、サブルーチンは「手順に名前」。役割が違うから両方そろえると一番うれしい。\n先生：値が増えれば定数、処理が増えればサブルーチン。どちらも同じものを1か所にまとめる道具で、競合せず一緒に使える。\nAくん：コピペは「楽そうで後がつらい」、サブルーチンは「最初ひと手間でも後が楽」ですね。",
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
              <h3>具体例：税額の計算をコピペすると…</h3>
              <p>商品 A・B・C の税額を、同じ式（税率10%）で<strong>コピペ</strong>して書いたとします。</p>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 同じ計算式を3か所にコピペ
lv_tax_a = lv_price_a / 10.    " 商品Aの税額
lv_tax_b = lv_price_b / 10.    " 商品Bの税額
lv_tax_c = lv_price_c / 10.    " 商品Cの税額`}
              />
              <Dialog speaker="b">
                もし税率が 10%→8% に変わったら…この3行ぜんぶ直すんですか？1つでも直し忘れたら、その商品だけ税額がズレちゃう。こわいです。
              </Dialog>
              <Dialog speaker="teacher">
                そう、まさにそこが落とし穴です。コピペした数だけ「直す場所」と「直し忘れる危険」が増えます。
                計算式を <code>calc_tax</code> という<strong>サブルーチン1か所</strong>にまとめておけばどうでしょう。
              </Dialog>
              <CodeBlock
                language="ABAP"
                code={`" ✅ 計算式は calc_tax の中だけ。呼ぶ側は3回頼むだけ
PERFORM calc_tax USING lv_price_a CHANGING lv_tax_a.
PERFORM calc_tax USING lv_price_b CHANGING lv_tax_b.
PERFORM calc_tax USING lv_price_c CHANGING lv_tax_c.

" 税率を変えるときは、この1行を直すだけで A・B・C 全部に効く
FORM calc_tax USING p_price TYPE i CHANGING p_tax TYPE i.
  p_tax = p_price / 10.
ENDFORM.`}
              />
              <Dialog speaker="b">
                あれ、でも <code>calc_tax</code> の中の <code>/ 10</code> って、まだ「10」がそのまま書いてありますよね。
                これって<strong>定数</strong>にしておいたほうがよくないですか？「<code>10</code>」だけ見ても、何の数字か分からないし…。
              </Dialog>
              <Dialog speaker="teacher">
                とても良い気づきです。その <code>10</code> のような<strong>意味の分からない数字（マジックナンバー）</strong>は、
                名前を付けた<strong>定数</strong>にしておくのがおすすめです。<code>CONSTANTS</code> で宣言します。
              </Dialog>
              <CodeBlock
                language="ABAP"
                code={`" 税率を「名前付きの定数」にする（10で割る＝税率10%）
CONSTANTS c_tax_divisor TYPE i VALUE 10.

FORM calc_tax USING p_price TYPE i CHANGING p_tax TYPE i.
  p_tax = p_price / c_tax_divisor.   " 「10」より意味が分かる
ENDFORM.`}
              />
              <Dialog speaker="b">
                <code>c_tax_divisor</code> って名前なら「税率に関わる数だな」って一目で分かりますね。
                それに <code>CONSTANTS</code> は<strong>うっかり書き換えられない</strong>のもいいです。
              </Dialog>
              <Dialog speaker="teacher">
                そのとおり。<code>DATA</code>（変数）と違って <code>CONSTANTS</code>（定数）は途中で値を変えられないので、
                「ここは固定値ですよ」という意図がコードに残ります。
                <strong>サブルーチンで処理をまとめ、定数で数値に名前を付ける</strong>——どちらも「読む人にやさしく」の同じ発想です。
              </Dialog>
              <Dialog speaker="b">
                あれ、でも定数で <code>10</code> に名前を付けられるなら…
                もう <code>calc_tax</code> の<strong>サブルーチンはいらなく</strong>ないですか？
                各行を <code>lv_tax_a = lv_price_a / c_tax_divisor.</code> って書けば、定数だけで十分な気が…。
              </Dialog>
              <Dialog speaker="teacher">
                鋭い質問ですね。でも、定数とサブルーチンは<strong>解決していることが別もの</strong>なんです。
                定数で書いても、ほら——まだ3行コピペが残りますよね。
              </Dialog>
              <CodeBlock
                language="ABAP"
                code={`" 定数を使っても…計算の「式」は3行コピペのまま
lv_tax_a = lv_price_a / c_tax_divisor.
lv_tax_b = lv_price_b / c_tax_divisor.
lv_tax_c = lv_price_c / c_tax_divisor.`}
              />
              <Dialog speaker="teacher">
                定数が名前を付けるのは<strong>「10」という値ひとつ</strong>だけ。
                計算の<strong>手順そのもの</strong>（割る、将来は端数処理や割引も足すかも）は、まだ3か所に散らばっています。
                たとえば「税額は<strong>切り捨て</strong>にしよう」と仕様が変わったら、定数だけでは3行とも直す羽目に。
                <code>calc_tax</code> にまとめてあれば、<strong>手順の変更も1か所</strong>で済みます。
              </Dialog>
              <Dialog speaker="b">
                なるほど…定数は「<strong>値</strong>に名前」、サブルーチンは「<strong>手順</strong>に名前」。
                役割が違うから、両方そろえると一番うれしいんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解でばっちりです。<strong>値が増えれば定数、処理が増えればサブルーチン</strong>。
                どちらも「同じものを1か所にまとめる」道具で、競合せず一緒に使えます。
              </Dialog>
              <Callout variant="tip">
                <strong>読みやすい</strong>＝「<code>calc_tax</code>＝税額計算」と名前で分かる。
                <strong>直しやすい</strong>＝税率変更は <code>FORM</code> の中の1行だけ。
                <strong>再利用できる</strong>＝同じ <code>calc_tax</code> を A・B・C で使い回せる。3つの良いことが、この1例にぜんぶ詰まっています。
              </Callout>
              <Dialog speaker="a">
                コピペは「いま楽そうで、あとがつらい」。サブルーチンは「最初にひと手間でも、あとがずっと楽」なんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "まずは引数なしのFORM",
          plainText:
            "いちばん単純な FORM ＝ 引数なし\nFORM はいつも USING / CHANGING が必要なわけではない。いちばん単純なのは引数なし——名前を付けた処理のかたまりを PERFORM で呼ぶだけ。\nPERFORM print_header. … FORM print_header. WRITE … ENDFORM.\n1行ずつ：PERFORM print_header＝名前を言って呼ぶ／FORM print_header＝定義の開始（名前は同じ）／WRITE＝中身（見出しを出す）／ENDFORM＝定義終了、呼び出し元に戻る。\nBちゃん：えっ、これだけでいいんですか？先生：そう。値の受け渡しがいらないなら、引数もいらない。名前を付けた処理を呼ぶだけ。\n再利用：同じ見出しを何度も出したいなら PERFORM print_header. を必要なところで呼ぶだけ。\nAくん：じゃあ USING / CHANGING はいつ要るんですか？先生：値を渡したり結果を受け取りたくなったとき。次のスライドで見ていく。",
          content: (
            <>
              <h2>いちばん単純な <code>FORM</code> ＝ 引数なし</h2>
              <p>
                <code>FORM</code> はいつも <code>USING</code> / <code>CHANGING</code> が必要なわけではありません。
                いちばん単純なのは<strong>引数なし</strong>——名前を付けた処理のかたまりを、
                <code>PERFORM</code> で呼ぶだけの形です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 呼び出し側：名前を言うだけ
PERFORM print_header.

" 定義側：引数なしの FORM（見出しを出すだけ）
FORM print_header.
  WRITE: / '=== 仕訳日記帳 ==='.
  WRITE: / '日付', '伝票番号', '金額'.
ENDFORM.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>PERFORM print_header.</code> … 名前 <code>print_header</code> のサブルーチンを呼ぶ。渡す値がないので名前だけ
                </li>
                <li>
                  <code>FORM print_header.</code> … サブルーチン定義の開始。<strong>名前</strong>は呼び出し側と同じにする
                </li>
                <li>
                  <code>WRITE: / '...'.</code> … サブルーチンの<strong>中身</strong>。ここでは見出しを画面に出す
                </li>
                <li>
                  <code>ENDFORM.</code> … 定義の終了。ここで呼び出し元（<code>PERFORM</code> の次の行）に戻る
                </li>
              </ul>
              <Dialog speaker="b">
                えっ、<code>FORM</code> って、これだけでもいいんですか？<code>USING</code> とか <code>CHANGING</code> がないと動かないのかと…。
              </Dialog>
              <Dialog speaker="teacher">
                これで立派なサブルーチンです。<strong>値の受け渡しがいらないなら、引数もいりません</strong>。
                「名前を付けた処理のかたまりを呼ぶ」——まずはこれが <code>FORM</code> / <code>PERFORM</code> の基本形です。
              </Dialog>
              <Callout variant="tip">
                <strong>再利用も引数なしでOK</strong>：同じ見出しを何度も出したいなら、
                出したいところで <code>PERFORM print_header.</code> と呼ぶだけ。見出しの文言を変えるときは <code>FORM</code> の中の1か所だけ直せば、呼び出し全部に効きます。
              </Callout>
              <Dialog speaker="a">
                じゃあ <code>USING</code> / <code>CHANGING</code> は、いつ要るんですか？
              </Dialog>
              <Dialog speaker="teacher">
                サブルーチンに<strong>値を渡したい</strong>とき、または<strong>結果を受け取りたい</strong>ときです。
                次のスライドで、引数つきの <code>FORM</code> を見ていきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "引数を渡す（USING / CHANGING）",
          plainText:
            "引数を渡す FORM、呼ぶ PERFORM\n引数なしの FORM に、値の受け渡しを足したのが USING / CHANGING。USING（渡すだけ）／CHANGING（渡して結果も受け取る）。\nPERFORM calc_tax USING lv_price CHANGING lv_tax.\nFORM calc_tax … USING p_price TYPE i … CHANGING p_tax TYPE i. … p_tax = p_price / 10. … ENDFORM.\n1行ずつ：PERFORM＝呼び出し／FORM calc_tax＝名前／USING p_price＝入力（lv_priceが入る）／CHANGING p_tax＝出力（lv_taxへ戻る）／代入＝中身／ENDFORM＝定義終了。\nInfoPanel：変数の動き（単価1000円の例）。\nBちゃん：全部CHANGINGに統一できない？先生：動くことはあるがUSINGは入力だけの宣言。PERFORM1行で入出力が分かる。\nInfoPanel：分ける理由＝読みやすさ・書き換え範囲の明示・後から読む人への配慮。\nAくん：USING/CHANGINGは結果を受け取る場所の看板。先生：矢印の向きをコード上で宣言しておく。",
          content: (
            <>
              <h2>引数を渡す <code>FORM</code>（<code>USING</code> / <code>CHANGING</code>）</h2>
              <p>前のスライドの<strong>引数なしの <code>FORM</code></strong> に、<strong>値の受け渡し</strong>を足したのが <code>USING</code> / <code>CHANGING</code> です。<code>USING</code>（渡すだけ）／<code>CHANGING</code>（渡して結果も受け取る）。</p>
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
            "グローバル と ローカル\nDATA の宣言場所で決まる。FORM の外＝グローバル、FORM の中＝ローカル。\nDATA lv_total（外）… FORM 内 DATA lv_step（作業用・その FORM だけ）… ENDFORM 後 lv_step は使えない。\nBちゃん：作業用も外に DATA 宣言しちゃダメ？先生：動くがどの FORM 用か分からなくなる。FORM 内 DATA がよい。\nつまずき：何でもグローバルにするとどこで値が変わったか追えない。\n具体例：print_headers と print_footers が同じ名前 lv_i をそれぞれ FORM 内で DATA 宣言。\nAくん：同じ名前だと上書きして壊れない？先生：壊れない。ローカルはその FORM の中だけの手元メモで、名前が同じでも別物。print_headers が終われば消える。\nBちゃん：クラスごとに出席番号1番がいても別人と同じ。だから他のFORMの変数名を気にせず使える。\n補足：もし lv_i をグローバルにすると共有メモが1枚になり、片方の値変更が他方に波及して追いにくい。作業用はローカルが安全。",
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
              <h3>具体例：同じ名前 <code>lv_i</code> でもぶつからない</h3>
              <p>
                2つの <code>FORM</code> が、たまたま同じ名前 <code>lv_i</code>（ループ用のカウンタ）を使っています。
                それぞれ <code>FORM</code> の<strong>中</strong>で <code>DATA</code> 宣言したローカル変数です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM print_headers.
  DATA lv_i TYPE i.        " この FORM 専用の lv_i
  DO 3 TIMES.
    lv_i = sy-index.       " 1, 2, 3 と進む（見出しを3行出す）
    WRITE: / '見出し', lv_i.
  ENDDO.
ENDFORM.

FORM print_footers.
  DATA lv_i TYPE i.        " 別物！print_headers の lv_i とは無関係
  DO 5 TIMES.
    lv_i = sy-index.       " こちらは 1〜5（脚注を5行出す）
    WRITE: / '脚注', lv_i.
  ENDDO.
ENDFORM.`}
              />
              <Dialog speaker="a">
                両方 <code>lv_i</code> って同じ名前ですけど…<code>print_footers</code> の <code>DO 5 TIMES</code> が、
                <code>print_headers</code> の <code>lv_i</code> を上書きして壊したりしないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                壊れません。ローカル変数は「その <code>FORM</code> の中だけに存在する手元のメモ」です。
                名前が同じでも、<strong>別々のメモ用紙</strong>なので中身は混ざりません。
                <code>print_headers</code> が終われば、そこの <code>lv_i</code> は消えてなくなります。
              </Dialog>
              <Dialog speaker="b">
                クラスごとに「出席番号1番」がいても別人なのと同じですね。
                だから他の <code>FORM</code> の変数名を気にせず、好きなカウンタ名を使えるんだ。
              </Dialog>
              <Callout variant="note">
                もし <code>lv_i</code> を <code>FORM</code> の<strong>外</strong>（グローバル）に置くと、これは1枚しかない共有メモになります。
                <code>print_headers</code> で 3 にした値が、<code>print_footers</code> を呼ぶと 5 に書き換わる…と、
                どこで値が変わったか追いにくくなります。だから<strong>作業用はローカル</strong>が安全です。
              </Callout>
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
                ファイル出力の詳細は追加コンテンツ「ファイル出力」、実装例は特別演習④ Part B で深めていきましょう。
              </Dialog>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="19-file-output"
                  slide={1}
                  label="ファイル出力: PCへのダウンロードへ"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="11-document-posting"
                  slide={6}
                  label="第11章: 会計伝票登録（BAPI）へ進む"
                />
              </div>
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
