import {
  Lesson,
  lessonChrome,
  Callout,
  InfoPanel,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "最初のABAP — レポートプログラム・変数・定数・コメント",
  meta: "初学者 · 20分",
};

export default function AbapMinimumUnitLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "03-abap-minimum-unit", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "はじめてのレポートプログラム\nABAPの最小単位「レポートプログラム」を作り、変数・定数・コメントの意味を知ります。\n⏱ 20分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・レポートプログラムとは何か（作る→実行する→結果を見る）\n・変数と定数の違い、それぞれ「何のために」あるのか\n・コメントを書く理由（未来の自分と仲間のため）",
          content: (
            <>
              <hgroup>
                <h1>はじめてのレポートプログラム</h1>
                <p>ABAPの最小単位「レポートプログラム」を作り、変数・定数・コメントの意味を知ります。</p>
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
                <li>レポートプログラムとは何か（作る→実行する→結果を見る）</li>
                <li>変数と定数の違い、それぞれ「何のために」あるのか</li>
                <li>コメントを書く理由（未来の自分と仲間のため）</li>
              </ul>
            </>
          ),
        },
        {
          title: "レポートとは",
          plainText:
            "レポートプログラム＝「自動の作業手順書」\nコンピュータに「この順番でこれをやって」と書いた手順書。書いて実行すると上から順に処理して結果を画面に出してくれる。\n先生：まずは画面に文字を出すだけの小さなプログラムから始めます。最初の一歩はこれで十分。\nBちゃん：手順書なら家電の説明書みたいなものですね。順番に書けばいいならできそう。\n先生：その通り。上から順に、が基本です。",
          content: (
            <>
              <h2>レポートプログラム＝「自動の作業手順書」</h2>
              <p>レポートプログラムは、コンピュータに「この順番でこれをやって」と書いた手順書です。書いて実行すると、上から順に処理して、結果を画面に出してくれます。</p>
              <Dialog speaker="teacher">
                まずは「画面に文字を出す」だけの小さなプログラムから始めます。最初の一歩はこれで十分です。
              </Dialog>
              <Dialog speaker="b">
                手順書なら家電の説明書みたいなものですね。順番に書けばいいなら、できそう。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。「上から順に実行される」——これだけ掴めば、最初のプログラムは読めます。
              </Dialog>
            </>
          ),
        },
        {
          title: "作る→実行→結果",
          plainText:
            "3つのステップで動かす\n作る：エディタにプログラムを書く／実行する：実行ボタンを押す／結果を見る：画面に出た結果を確認する。直したらまた作るへ戻る。\nflowchart：作る → 実行する → 結果を見る →(直す)作る\nAくん：小さく書いて動かして直す、の繰り返しなんですね。",
          content: (
            <>
              <h2>3つのステップで動かす</h2>
              <p>ABAP開発は、いつもこのリズムです。</p>
              <ol>
                <li><strong>作る</strong>：エディタにプログラムを書く</li>
                <li><strong>実行する</strong>：実行ボタンを押す</li>
                <li><strong>結果を見る</strong>：画面に出た結果を確認する</li>
              </ol>
              <MermaidDiagram
                chart={`flowchart LR
  A[作る] --> B[実行する]
  B --> C[結果を見る]
  C -->|直す| A`}
              />
              <Dialog speaker="a">
                小さく書いて動かして直す、の繰り返しなんですね。一気に完成させなくていいのは気が楽です。
              </Dialog>
            </>
          ),
        },
        {
          title: "最小のコード",
          plainText:
            "いちばん小さなプログラム\n最初の行 REPORT は「これはレポートプログラムです」という宣言。WRITE は「画面に書く」命令。\nREPORT z_hello.\nWRITE 'こんにちは、ABAP'.\nAくん：REPORT がプログラムの名札、WRITE が出力命令、と読めば素直ですね。\n先生：英語の意味そのまま。write＝書く。記号に身構えず「英単語の命令文」として読みましょう。",
          content: (
            <>
              <h2>いちばん小さなプログラム</h2>
              <p>
                最初の行 <code>REPORT</code> は「これはレポートプログラムです」という宣言。
                <code>WRITE</code> は「画面に書く」命令です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`REPORT z_hello.

WRITE 'こんにちは、ABAP'.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>REPORT z_hello.</code> … プログラムの名札。「これは <code>z_hello</code> という名前のレポートプログラムです」という宣言
                </li>
                <li>
                  <code>WRITE &apos;こんにちは、ABAP&apos;.</code> … 画面に文字を書く命令。<code>&apos;</code> で囲んだ部分がそのまま表示される
                </li>
                <li>
                  文末の <code>.</code> … 1命令の終わり。ABAPでは命令の末尾に必ず付ける
                </li>
              </ul>
              <Dialog speaker="a">
                <code>REPORT</code> がプログラムの名札、<code>WRITE</code> が出力命令、と読めば素直ですね。
              </Dialog>
              <Dialog speaker="teacher">
                英語の意味そのままです。<code>write</code>＝書く。記号に身構えず「英単語の命令文」として読みましょう。文末のピリオド（<code>.</code>）が「1命令の終わり」の合図、というのも覚えておいてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "変数",
          plainText:
            "変数 ＝ 中身を入れ替えられる箱\nDATA で箱を用意する。箱には名前を付け、あとから値を入れたり替えたりできる。\nDATA lv_name TYPE string.\nlv_name = '田中'.\nWRITE lv_name.\nAくん：数学の文字 x のようなもの。x にいろいろな値を代入できる、あの感覚。\nBちゃん：ラベルを貼ったタッパー。中身は入れ替えられるけど容器の名前は同じ。\n先生：その2つのたとえ、どちらも正解です。",
          content: (
            <>
              <h2>変数 ＝ 中身を入れ替えられる箱</h2>
              <p><code>DATA</code> で「箱」を用意します。箱には名前を付け、あとから値を入れたり替えたりできます。</p>
              <Figure
                src="image/03-variable-box.png"
                alt="『lv_name』というラベルを貼った箱（タッパー）。中身が『田中』から別の名前へ入れ替わる様子を矢印で示す。容器（名前）は同じで中身だけ変わることを表現。"
                caption="変数＝ラベル（名前）を貼った箱。名前はそのまま、中身は入れ替えられる"
                kind="concept"
              />
              <CodeBlock
                language="ABAP"
                code={`DATA lv_name TYPE string.
lv_name = '田中'.
WRITE lv_name.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>DATA lv_name TYPE string.</code> … 変数 <code>lv_name</code> を用意。<code>lv_</code> は「変数（local variable）」、<code>TYPE string</code> は文字列型
                </li>
                <li>
                  <code>lv_name = &apos;田中&apos;.</code> … 箱に値を入れる（代入）。あとから別の名前に入れ替え可能
                </li>
                <li>
                  <code>WRITE lv_name.</code> … 箱の中身（いまは「田中」）を画面に表示
                </li>
              </ul>
              <Dialog speaker="a">
                数学の文字 x のようなもの。x にいろいろな値を代入できる、あの感覚です。
              </Dialog>
              <Dialog speaker="b">
                ラベルを貼った“タッパー”。中身は入れ替えられるけど、容器の名前は同じ、という感じですね。
              </Dialog>
              <Dialog speaker="teacher">
                その2つのたとえ、どちらも正解です。理屈派は「x への代入」、生活派は「タッパーの中身替え」で覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "定数",
          plainText:
            "定数 ＝ 中身を変えない箱\nCONSTANTS は一度決めたら変えない値。消費税率や会社コードのように途中で勝手に変わると困るものに使う。\nCONSTANTS lc_tax_rate TYPE p DECIMALS 2 VALUE '0.10'.\nDATA lv_price TYPE p DECIMALS 2 VALUE '1000'.\nlv_tax = lv_price * lc_tax_rate.\n1行ずつ読む：CONSTANTS＝定数宣言／lc_tax_rate＝名前（lc＝定数、tax_rate＝消費税率）／TYPE p DECIMALS 2＝小数2桁の数値型／VALUE '0.10'＝10%という初期値（宣言時に必ず指定）。\n先生：変えていい箱（変数）と変えない箱（定数）を区別すると事故が減る。固定の値に名前を付けると読みやすさも上がる。\nAくん：マジックナンバー（0.10 のような裸の数字）に名前を付ける、ということですね。\nBちゃん：lv_tax = lv_price * 0.10 より lc_tax_rate を使う方が、何の計算か一目で分かる。",
          content: (
            <>
              <h2>定数 ＝ 中身を変えない箱</h2>
              <p>
                <code>CONSTANTS</code> は、一度決めたら変えない値です。「消費税率」「会社コード」のように、途中で勝手に変わると困るものに使います。
              </p>
              <Figure
                src="image/03-var-vs-const.png"
                alt="左：フタが開いて中身を入れ替えられる箱（変数 DATA）。右：フタに鍵がかかって中身を変えられない箱（定数 CONSTANTS）。役割の対比を並べて示す。"
                caption="変数＝中身を入れ替えられる箱／定数＝鍵をかけた箱（変えない値）"
                kind="diagram"
              />
              <CodeBlock
                language="ABAP"
                code={`CONSTANTS lc_tax_rate TYPE p DECIMALS 2 VALUE '0.10'.

DATA lv_price TYPE p DECIMALS 2 VALUE '1000'.
DATA lv_tax    TYPE p DECIMALS 2.

lv_tax = lv_price * lc_tax_rate.
WRITE: / '税額:', lv_tax.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>CONSTANTS</code> … 「定数を宣言する」合図（変数の <code>DATA</code> に相当）
                </li>
                <li>
                  <code>lc_tax_rate</code> … 定数の名前。<code>lc_</code> は「定数（local constant）」、<code>tax_rate</code> は「消費税率」の意味
                </li>
                <li>
                  <code>TYPE p DECIMALS 2</code> … 小数第2位まで扱える数値型（金額・税率向け）
                </li>
                <li>
                  <code>VALUE &apos;0.10&apos;</code> … 初期値 10%。定数は宣言時に値を必ず指定する（あとから代入できない）
                </li>
                <li>
                  <code>lv_tax = lv_price * lc_tax_rate</code> … 定数を計算式で使う例。<code>0.10</code> と直接書くより意図が伝わる
                </li>
              </ul>
              <Callout variant="note">
                変数（<code>DATA</code>）との違い：変数は <code>lv_tax = ...</code> のようにあとから値を入れ替えられる。定数は <code>VALUE</code> で決めた値が固定され、再代入しようとするとエラーになる。
              </Callout>
              <Dialog speaker="teacher">
                「変えていい箱（変数）」と「変えない箱（定数）」を区別すると、事故が減ります。固定の値に名前を付けておくと、読みやすさも上がります。
              </Dialog>
              <Dialog speaker="a">
                コードに直接書いた裸の数字（0.10 など）に名前を付ける、ということですね。後で税率が変わっても1か所直せばいい。
              </Dialog>
              <Dialog speaker="b">
                <code>lv_tax = lv_price * 0.10</code> より <code>lc_tax_rate</code> を使う方が、「消費税の計算だ」と一目で分かりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "コメント",
          plainText:
            "コメント ＝ 未来の自分へのメモ\n行の先頭に * 、または \" を書くと、その部分は実行されないメモになる。何のための処理かを残すためのもの。\n* 税込金額を計算する（社内ルール: 端数切り捨て）\nDATA lv_total TYPE i.\nlv_total = lv_price + lv_tax.   \" ここで合算\nよく使う型：string＝文字列／i＝整数／p DECIMALS 2＝金額・税率／d＝日付／c＝固定長文字／flag＝はい・いいえ／TYPE bkpf-bukrs＝テーブル項目参照\nつまずき：自分が書いたコードは覚えていると思いがち。でも3ヶ月後の自分は他人同然。理由をメモしておく。\nこの章のABAPキーワード：REPORT / DATA / CONSTANTS / WRITE / コメント（*・\"）。",
          content: (
            <>
              <h2>コメント ＝ 未来の自分へのメモ</h2>
              <p>
                行の先頭に <code>*</code>、または <code>"</code> を書くと、その部分は「実行されないメモ」になります。何のための処理かを残しておくためのものです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`* 税込金額を計算する（社内ルール: 端数切り捨て）
DATA lv_total TYPE i.
lv_total = lv_price + lv_tax.   " ここで合算`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>*</code> で始まる行 … 行全体がコメント。実行されない「処理の説明メモ」
                </li>
                <li>
                  <code>DATA lv_total TYPE i.</code> … 整数型（<code>i</code>）の変数を用意。合計金額を入れる箱
                </li>
                <li>
                  <code>lv_total = lv_price + lv_tax.</code> … 税抜＋税額を合算して <code>lv_total</code> に入れる
                </li>
                <li>
                  <code>&quot; ここで合算</code> … 行末コメント。命令の右側に書く短いメモ（ここから先は実行されない）
                </li>
              </ul>
              <Callout variant="note">
                コメントの2種類：<code>*</code> は行全体、<code>&quot;</code> は行末。どちらもコンパイラは無視するが、読む人への説明として残す。
              </Callout>
              <Dialog speaker="teacher">
                全部覚える必要はありません。「文字なら <code>string</code>、整数なら <code>i</code>、金額なら <code>p</code>」——この3つが最初の柱です。SAPの項目をそのまま使うときは <code>TYPE [テーブル]-[項目]</code> と書けば型を自分で考えなくて済みます。
              </Dialog>
              <Dialog speaker="stumble">
                「自分が書いたコードは覚えている」と思いがち。でも3ヶ月後の自分は他人同然です。理由をメモしておきましょう。
              </Dialog>
              <Callout variant="tip">
                この章のABAPキーワード：<code>REPORT</code> / <code>DATA</code> / <code>CONSTANTS</code> / <code>WRITE</code> / コメント（<code>*</code>・<code>"</code>）。
              </Callout>
            </>
          ),
        },
        {
          title: "よく使う型（TYPE）",
          plainText:
            "よく使う型（TYPE）\n変数・定数を宣言するとき <code>TYPE</code> で「箱の形」を決めます。丸暗記不要、「何を入れるか」で選びます。\nstring＝文字列／i＝整数／p DECIMALS 2＝金額・税率／d＝日付／c LENGTH 4＝固定長文字／flag＝はい・いいえ／TYPE bkpf-bukrs＝テーブル項目参照",
          content: (
            <>
              <InfoPanel
                title="よく使う型（TYPE）"
                variant="reference"
                lead={
                  <>
                    変数・定数を宣言するとき <code>TYPE</code> で「箱の形」を決めます。丸暗記不要、「何を入れるか」で選びます。
                  </>
                }
              >
                <ul>
                  <li>
                    <code>string</code> … 文字列（名前・メッセージなど）— この章の変数で使用
                  </li>
                  <li>
                    <code>i</code> … 整数（件数・カウンタ）— この章の合計で使用
                  </li>
                  <li>
                    <code>p DECIMALS 2</code> … 小数付き数値（金額・税率向け）— この章の定数で使用
                  </li>
                  <li>
                    <code>d</code> … 日付（<code>20240401</code> 形式）。伝票日付など
                  </li>
                  <li>
                    <code>c LENGTH 4</code> … 固定長文字（会社コードなど、桁数が決まっているもの）
                  </li>
                  <li>
                    <code>flag</code> … フラグ（<code>&apos;X&apos;</code> ＝ はい、空 ＝ いいえ）
                  </li>
                  <li>
                    <code>TYPE bkpf-bukrs</code> … テーブル項目と同じ型・桁
                  </li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：到達点は、最小のレポートを読んで意図を説明できる状態。REPORTで始まり、DATAやCONSTANTSで値を準備し、WRITEで結果を出す流れが基本。\nAくん：変数は途中で値が変わる箱、定数は固定値の箱、コメントは処理意図を残すメモという役割分担。単語の意味を押さえるとコードが命令文として読める。\nBちゃん：英語が怖かったけど、箱にラベルを貼る感覚で考えると理解しやすい。コメントが未来の自分への手紙だと思うと、書く意味がちゃんとある。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の到達点は、最小のレポートを「読んで意図を説明できる」状態になることです。<code>REPORT</code> で始まり、<code>DATA</code> や <code>CONSTANTS</code> で値を準備し、<code>WRITE</code> で結果を出す流れが基本になります。
              </Dialog>
              <Dialog speaker="a">
                変数は途中で値が変わる箱、定数は固定値の箱、コメントは処理意図を残すメモという役割分担ですね。単語の意味を押さえるとコードが命令文として読めます。
              </Dialog>
              <Dialog speaker="b">
                英語が怖かったけど、箱にラベルを貼る感覚で考えると理解しやすいです。特にコメントが「未来の自分への手紙」だと思うと、書く意味がちゃんとあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 途中で中身を入れ替えられる箱は？→ DATA（変数）\nQ2 コメントを書く一番の目的は？→ 処理の意図を後で読む人に伝えるため\nQ3 REPORT を最初に書く主な理由は？→ レポートプログラムであることを宣言するため\n今日のひとこと：最初のプログラムは数行で十分。動いた瞬間の「できた！」を大切に。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="変数(DATA)は途中で中身を入れ替えられる箱。定数(CONSTANTS)は決めたら変えない値です。用途を分けることで、意図せず重要値を書き換える事故を防ぎ、コードの読み手にも意図が伝わりやすくなります。"
                question={<strong>「途中で中身を入れ替えられる箱」はどれ？</strong>}
                options={["CONSTANTS（定数）", "DATA（変数）", "REPORT"]}
              />
              <Quiz
                answer={2}
                explanation="コメントは実行されないメモ。処理の意図を未来の自分や仲間に伝えるために書きます。特に業務ルールや判断理由を補足しておくと、修正時に「なぜこの実装か」を再調査する手間を減らせます。"
                question={<strong>コメントを書く一番の目的は？</strong>}
                options={[
                  "プログラムを速くするため",
                  "画面にきれいに表示するため",
                  "処理の意図を後で読む人に伝えるため",
                ]}
              />
              <Quiz
                answer={0}
                explanation="REPORTはプログラムの種別を宣言する入口で、実行可能なレポートとして扱う前提になります。最初の宣言が明確だと、後続のDATA定義やWRITE出力も一貫した文脈で読めます。"
                question={<strong>最小レポートコードで <code>REPORT</code> を最初に書く主な理由は？</strong>}
                options={[
                  "レポートプログラムであることを宣言するため",
                  "画面の色を変更するため",
                  "変数を自動的に初期化するため",
                ]}
              />
              <Dialog speaker="closing">
                最初のプログラムは数行で十分。動いた瞬間の「できた！」を大切に。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(AbapMinimumUnitLesson);
