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
  title: "プログラムを分かりやすくする",
  meta: "初学者 · 25分",
};

export default function ModularizationLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "10-modularization", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "プログラムを分かりやすくする\n処理をサブルーチンに分けると、なぜ分かりやすくなるのか。引数とスコープを学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・処理を「部品（サブルーチン）」に分ける理由\n・部品へ値を渡す引数（USING / CHANGING）\n・変数のスコープ（グローバル＝全体／ローカル＝その部品の中だけ）",
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
                <li>処理を「部品（サブルーチン）」に分ける理由</li>
                <li>部品へ値を渡す引数（<code>USING</code> / <code>CHANGING</code>）</li>
                <li>変数のスコープ（グローバル＝全体／ローカル＝その部品の中だけ）</li>
              </ul>
            </>
          ),
        },
        {
          title: "手順書のたとえ",
          plainText:
            "長い手順書は「章」に分ける\n1000行の手順書がのっぺり続くと、どこに何が書いてあるか分からない。準備／本作業／片付けと章に分ければ探すのも直すのも楽。プログラムも同じ。\n先生：処理を意味のかたまり（部品）に分けて名前を付ける。これがサブルーチンの発想。\nBちゃん：料理本も下ごしらえ／焼く／盛り付けに分かれてると作りやすいです。\n先生：そう。1つの長い文章より、見出しのある章立てのほうが探しやすいですよね。",
          content: (
            <>
              <h2>長い手順書は「章」に分ける</h2>
              <p>1000行の手順書がのっぺり続くと、どこに何が書いてあるか分かりません。「準備」「本作業」「片付け」と章に分ければ、探すのも直すのも楽になります。プログラムも同じです。</p>
              <Figure
                src="image/10-chapters.png"
                alt="左：見出しのない、びっしり続く長い手順書（読みにくい）。右：準備・本作業・片付けと見出しで章分けされた手順書（探しやすい）。before/afterの対比。"
                caption="長い処理を「章（部品）」に分けると、探すのも直すのも楽になる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                処理を意味のかたまり（部品）に分けて名前を付ける。これがサブルーチンの発想です。
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
            "分けると、3つ良いことがある\n読みやすい：名前を見れば何をする部分か分かる\n直しやすい：その部品だけ直せばよい（影響範囲が狭い）\n再利用できる：同じ処理を何度も呼べる\nAくん：関数に切り出すのと同じ発想ですね。重複を1か所にまとめられる。\n先生：そう。同じ処理を何か所にもコピーすると、直すとき全部直さないといけません。1か所なら1回で済む。",
          content: (
            <>
              <h2>分けると、3つ良いことがある</h2>
              <ul>
                <li><strong>読みやすい</strong>：名前を見れば「何をする部分か」が分かる</li>
                <li><strong>直しやすい</strong>：その部品だけ直せばよい（影響範囲が狭い）</li>
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
            "部品を作る FORM、呼ぶ PERFORM\nFORM で部品を定義し、PERFORM で呼び出す。値を渡すときは USING（渡すだけ）／CHANGING（渡して結果も受け取る）。\nPERFORM calc_tax USING lv_price CHANGING lv_tax.\nFORM calc_tax USING p_price TYPE i CHANGING p_tax TYPE i. p_tax = p_price / 10. ENDFORM.\n先生：USING＝材料を渡す、CHANGING＝材料を渡して加工後を返してもらう。役割で使い分ける。\nAくん：入口(USING)と、入口かつ出口(CHANGING)の違いですね。",
          content: (
            <>
              <h2>部品を作る <code>FORM</code>、呼ぶ <code>PERFORM</code></h2>
              <p><code>FORM</code> で部品を定義し、<code>PERFORM</code> で呼び出します。値を渡すときは <code>USING</code>（渡すだけ）／<code>CHANGING</code>（渡して結果も受け取る）。</p>
              <CodeBlock
                language="ABAP"
                code={`" 呼び出し側
PERFORM calc_tax USING lv_price CHANGING lv_tax.

" 部品の定義
FORM calc_tax USING    p_price TYPE i
              CHANGING p_tax   TYPE i.
  p_tax = p_price / 10.
ENDFORM.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>PERFORM calc_tax USING lv_price CHANGING lv_tax.</code> … <code>calc_tax</code> 部品を呼び出し。単価を渡し（<code>USING</code>）、税額を受け取る（<code>CHANGING</code>）
                </li>
                <li>
                  <code>FORM calc_tax USING ... CHANGING ...</code> … 部品の定義開始。<code>p_price</code> は受け取るだけ、<code>p_tax</code> は計算結果を返す
                </li>
                <li>
                  <code>p_tax = p_price / 10.</code> … 部品の中身（税額＝単価÷10）
                </li>
                <li>
                  <code>ENDFORM.</code> … 部品の定義終了。呼び出し元に戻る
                </li>
              </ul>
              <Figure
                src="image/10-usingvs-changing.png"
                alt="サブルーチンを箱で表現。USINGは箱へ入る一方向の矢印（渡すだけ）、CHANGINGは箱へ入って加工され戻ってくる双方向の矢印（渡して結果も受け取る）。2つの引数の向きの違いを図示。"
                caption="USING＝一方向（渡すだけ）／CHANGING＝往復（渡して加工後を受け取る）"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                <code>USING</code>＝「材料を渡す」、<code>CHANGING</code>＝「材料を渡して、加工後を返してもらう」。役割で使い分けます。
              </Dialog>
              <Dialog speaker="a">
                入口だけ（USING）か、入口かつ出口（CHANGING）か、という矢印の向きの違いですね。
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
            "グローバル と ローカル\nグローバル変数：プログラム全体のどこからでも見える（共有の掲示板）\nローカル変数：その部品の中だけで使える（手元のメモ）\nつまずき：何でもグローバルにするとどこで値が変わったか追えなくなる。→ できるだけローカルに閉じ込めるのが安全。\nAくん：スコープを狭く保つと影響範囲が読めて安心ですね。\n先生：そう。手元のメモで済むなら掲示板に貼らない、が基本です。",
          content: (
            <>
              <h2>グローバル と ローカル</h2>
              <ul>
                <li><strong>グローバル変数</strong>：プログラム全体のどこからでも見える（共有の掲示板）</li>
                <li><strong>ローカル変数</strong>：その部品の中だけで使える（手元のメモ）</li>
              </ul>
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
          title: "図解：メインと部品",
          plainText:
            "図で見る：メインから部品を呼ぶ\nflowchart：メイン処理 → PERFORM 入力チェック／データ取得／整形／出力・ダウンロード\nこの章のABAPキーワード：FORM / PERFORM / USING / CHANGING / グローバル・ローカル。",
          content: (
            <>
              <h2>図で見る：メインから部品を呼ぶ</h2>
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
            "画面・イベント・ダウンロード処理も「部品」に\n実務では画面の表示・ボタンが押されたときの処理（イベント）・ファイルのダウンロードなども、それぞれ部品に分けて整理する。機能が増えるほどこの分ける力が効いてくる。\n先生：今は役割ごとに分けるという発想だけ持てれば十分。詳しい書き方は使うときに覚えれば大丈夫。",
          content: (
            <>
              <h2>画面・イベント・ダウンロード処理も「部品」に</h2>
              <p>実務では、画面の表示・ボタンが押されたときの処理（イベント）・ファイルのダウンロードなども、それぞれ部品に分けて整理します。機能が増えるほど、この“分ける力”が効いてきます。</p>
              <Dialog speaker="teacher">
                今は「役割ごとに分ける」という発想だけ持てれば十分。詳しい書き方は使うときに覚えれば大丈夫です。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：要点は、処理を役割単位で部品化して読む人が流れを追える構造にすること。FORMで定義しPERFORMで呼び、USINGとCHANGINGでデータの出入りを明確にする。\nAくん：引数の向きを明示すると副作用が見えやすい。ローカル変数中心にすればどこで値が変わるか追跡しやすく、修正時の影響範囲も限定できる。\nBちゃん：長いコードを章立てして読む感覚で、部品ごとに意味がまとまっていると安心。機能追加のときもどこを触るか判断しやすい。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の要点は、処理を役割単位で部品化して、読む人が流れを追える構造にすることです。FORMで定義しPERFORMで呼び、USINGとCHANGINGでデータの出入りを明確にします。
              </Dialog>
              <Dialog speaker="a">
                引数の向きを明示すると副作用が見えやすくなりますね。さらにローカル変数中心にすれば、どこで値が変わるか追跡しやすく、修正時の影響範囲も限定できる。
              </Dialog>
              <Dialog speaker="b">
                長いコードを章立てして読む感覚で、部品ごとに意味がまとまっていると安心です。後で機能追加するときも、どこを触るか判断しやすくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 処理をサブルーチンに分ける利点は？→ 読みやすく・直しやすく・再利用しやすくなる\nQ2 部品に値を渡し加工後の結果も受け取りたいときは？→ CHANGING\nQ3 保守性を高める変数設計は？→ 可能な限りローカル変数に閉じ込める\n今日のひとこと：分けることは未来の自分と仲間への親切。整理されたコードはそれだけで価値があります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="処理を部品に分けると「読みやすい・直しやすい・再利用できる」。どこを直せばよいか分かりやすくなります。結果として、仕様変更時に修正対象を局所化でき、レビューやテストの負担も軽減されます。"
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
                question={<strong>部品に値を渡し、加工後の結果も受け取りたいときに使うのは？</strong>}
                options={["WRITE", "USING", "CHANGING"]}
              />
              <Quiz
                answer={1}
                explanation="ローカル変数はその部品内でのみ有効なため、値の変更範囲を閉じ込められます。グローバル変数を乱用すると、どこで値が変わったか追いにくくなり保守性が低下します。"
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
