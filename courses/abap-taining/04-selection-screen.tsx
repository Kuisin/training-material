import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  Reveal,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "入力を受け取る",
  meta: "初学者 · 20分",
};

export default function SelectionScreenLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "04-selection-screen", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "入力を受け取る\n選択画面＝検索フォーム。利用者からの入力を受け取り、後の処理の「条件」にする方法を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・選択画面とは何か（プログラムの入口にある検索フォーム）\n・PARAMETERS（単一指定）と SELECT-OPTIONS（範囲指定）の違い\n・入力した値が、後続の取得処理の「絞り込み条件」になる流れ",
          content: (
            <>
              <hgroup>
                <h1>入力を受け取る</h1>
                <p>選択画面＝検索フォーム。利用者からの入力を受け取り、後の処理の「条件」にする方法を学びます。</p>
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
                <li>選択画面とは何か（プログラムの入口にある検索フォーム）</li>
                <li><code>PARAMETERS</code>（単一指定）と <code>SELECT-OPTIONS</code>（範囲指定）の違い</li>
                <li>入力した値が、後続の取得処理の「絞り込み条件」になる流れ</li>
              </ul>
            </>
          ),
        },
        {
          title: "検索フォームのたとえ",
          plainText:
            "選択画面 ＝ 通販サイトの検索フォーム\n通販で「価格1000〜3000円」「ブランド○○」と入れて検索する、あれと同じ。プログラムの最初に「どのデータが欲しいか」を入力してもらう画面が選択画面。\n先生：プログラムは入力された条件を読み取り、その条件に合うデータだけを後で取りに行く。入口の設計がとても大事。\nBちゃん：検索フォームならいつも使ってます。条件を入れて検索ボタン、ですね。\n先生：その感覚でOK。条件＝ほしいものの注文票、と思ってください。",
          content: (
            <>
              <h2>選択画面 ＝ 通販サイトの検索フォーム</h2>
              <p>通販サイトで「価格 1000円〜3000円」「ブランド: ○○」と入れて検索しますよね。あれと同じで、プログラムの最初に「どのデータが欲しいか」を入力してもらう画面が選択画面です。</p>
              <Figure
                src="image/04-search-form.png"
                alt="通販サイト風の検索フォームのイラスト。『会社コード』の単一入力欄、『日付 From〜To』の範囲入力欄、検索ボタン。プログラムの入口にある検索フォームのイメージ。"
                caption="選択画面＝プログラムの入口にある検索フォーム（ほしいデータの注文票）"
                kind="concept"
              />
              <Dialog speaker="teacher">
                プログラムは入力された条件を読み取り、「その条件に合うデータだけ」を後で取りに行きます。入口の設計がとても大事です。
              </Dialog>
              <Dialog speaker="b">
                検索フォームならいつも使ってます。条件を入れて「検索」ボタン、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚でOKです。条件は「ほしいものの注文票」だと思ってください。注文が雑だと、要らない物まで届いてしまいます。
              </Dialog>
            </>
          ),
        },
        {
          title: "PARAMETERS（単一）",
          plainText:
            "PARAMETERS ＝ 1つだけ入れる欄\nPARAMETERS は「会社コードは1000」のように値を1つだけ受け取る欄を作る。\nPARAMETERS p_bukrs TYPE bkpf-bukrs.\nこれで会社コードを入力する欄が1つ画面に出る。\nAくん：1変数に1値。ピンポイントで指定したいときの形ですね。\n先生：TYPE bkpf-bukrs と書くと、その項目と同じ型・桁になります。型を自分で考えなくて済むのが利点。",
          content: (
            <>
              <h2>PARAMETERS ＝ 1つだけ入れる欄</h2>
              <p><code>PARAMETERS</code> は「会社コードは1000」のように、値を<strong>1つだけ</strong>受け取る欄を作ります。</p>
              <CodeBlock language="ABAP" code={`PARAMETERS p_bukrs TYPE bkpf-bukrs.`} />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>PARAMETERS</code> … 選択画面に「入力欄を1つ作る」合図
                </li>
                <li>
                  <code>p_bukrs</code> … 入力欄の名前。<code>p_</code> は「パラメータ（単一入力）」、<code>bukrs</code> は会社コード
                </li>
                <li>
                  <code>TYPE bkpf-bukrs</code> … 伝票ヘッダ（<code>bkpf</code>）の会社コード項目と同じ型・桁にする
                </li>
              </ul>
              <p>これで「会社コードを入力してください」という入力欄が1つ、画面に出ます。</p>
              <Dialog speaker="a">
                1変数に1値。ピンポイントで指定したいときの形ですね。
              </Dialog>
              <Dialog speaker="teacher">
                補足すると、<code>TYPE bkpf-bukrs</code> と書くと「その項目（会社コード）と同じ型・桁」になります。型を自分で考えなくて済むのが利点です。
              </Dialog>
            </>
          ),
        },
        {
          title: "SELECT-OPTIONS（範囲）",
          plainText:
            "SELECT-OPTIONS ＝ 範囲や複数を入れる欄\nSELECT-OPTIONS は「日付 4/1〜4/30」「伝票番号これとこれ」のように範囲や複数を受け取れる欄。\nSELECT-OPTIONS s_budat FOR bkpf-budat.\nFrom（から）To（まで）の2つの欄が出て期間で絞り込める。\nBちゃん：宿の予約でチェックイン〜チェックアウトを選ぶのと同じ感じ。\n先生：1点を指すなら PARAMETERS、幅で指すなら SELECT-OPTIONS。これが使い分けの軸。",
          content: (
            <>
              <h2>SELECT-OPTIONS ＝ 範囲や複数を入れる欄</h2>
              <p><code>SELECT-OPTIONS</code> は「日付 4/1〜4/30」「伝票番号 これとこれ」のように、<strong>範囲や複数</strong>を受け取れる欄です。</p>
              <CodeBlock language="ABAP" code={`SELECT-OPTIONS s_budat FOR bkpf-budat.`} />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SELECT-OPTIONS</code> … 範囲や複数値を受け取る入力欄を作る合図
                </li>
                <li>
                  <code>s_budat</code> … 入力欄の名前。<code>s_</code> は「選択オプション（範囲入力）」、<code>budat</code> は転記日
                </li>
                <li>
                  <code>FOR bkpf-budat</code> … どの項目に対する範囲かを指定。画面には From（から）と To（まで）の2欄が出る
                </li>
              </ul>
              <Callout variant="note">
                <code>PARAMETERS</code>＝1点を指す／<code>SELECT-OPTIONS</code>＝幅（From〜To）で指す。後続の <code>WHERE ... IN s_budat</code> にそのまま渡せる。
              </Callout>
              <Figure
                src="image/04-param-vs-selopt.png"
                alt="左：単一の入力欄1つ（PARAMETERS、1点を指す）。右：From と To の2つの入力欄（SELECT-OPTIONS、範囲を指す）。点 vs 区間の対比を図示。"
                caption="PARAMETERS＝1点を指す／SELECT-OPTIONS＝From〜Toで幅を指す"
                kind="diagram"
              />
              <Dialog speaker="b">
                宿の予約で「チェックイン〜チェックアウト」を選ぶのと同じ感じですね。
              </Dialog>
              <Dialog speaker="teacher">
                1点を指すなら <code>PARAMETERS</code>、幅で指すなら <code>SELECT-OPTIONS</code>。これが使い分けの軸です。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：入力→条件→取得",
          plainText:
            "入力した値は「絞り込み条件」になる\n入力された値はデータを取りに行くときの WHERE（〜という条件で）に渡される。入口の入力が出口のデータ量を決める。\nflowchart：選択画面で入力 → 条件に変換(WHERE) → 条件に合うデータだけ取得 → 出力\nこの章のABAPキーワード：PARAMETERS / SELECT-OPTIONS / WHERE（次章で本格的に）。\nAくん：入口で絞るほど、後ろが速く軽くなるんですね。",
          content: (
            <>
              <h2>入力した値は「絞り込み条件」になる</h2>
              <p>入力された値は、データを取りに行くときの <code>WHERE</code>（〜という条件で）に渡されます。入口の入力が、出口のデータ量を決めるのです。</p>
              <MermaidDiagram
                chart={`flowchart LR
  A[選択画面で入力] --> B["条件に変換<br/>(WHERE)"]
  B --> C[条件に合うデータだけ取得]
  C --> D[出力]`}
              />
              <Dialog speaker="a">
                入口で絞るほど、後ろの取得や加工が速く軽くなるんですね。性能の話にも直結しそう。
              </Dialog>
              <Callout variant="tip">
                この章のABAPキーワード：<code>PARAMETERS</code> / <code>SELECT-OPTIONS</code> / <code>WHERE</code>（次章で本格的に）。
              </Callout>
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきやすいところ（入力条件の設計）\nつまずき：条件を入れずに実行 → 全データを取得してとても重くなる。→ 必要な分だけ取るために条件設計は超重要。\nつまずき：1点で十分なのに範囲指定にする／逆もある。→ ピンポイント？幅？を最初に決める。\nAくん：入口を絞れば後ろの処理が軽くなる。性能の話にも直結しますね。",
          content: (
            <>
              <h2>つまずきやすいところ（入力条件の設計）</h2>
              <Dialog speaker="stumble">
                条件を入れずに実行 → 全データを取得してしまい、とても重くなる。→ 「必要な分だけ取る」ために条件設計は超重要です。
              </Dialog>
              <Dialog speaker="stumble">
                1点で十分なのに範囲指定にする／逆もある。→ 「ピンポイント？ 幅？」を最初に決めましょう。
              </Dialog>
              <Dialog speaker="a">
                入口を絞れば、後ろの処理が軽くなる。性能の話にも直結しますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ミニ演習",
          plainText:
            "確認質問＆ミニ演習\n先生の問い：特定の1社の、ある1ヶ月分の伝票を見たい。会社コードと日付、それぞれどちらの入力欄が向いている？\nAくん：会社コードは1社だから PARAMETERS、日付は期間だから SELECT-OPTIONS。\n先生：その通り。1つに決まるもの＝PARAMETERS、幅があるもの＝SELECT-OPTIONS で考えれば大丈夫。",
          content: (
            <>
              <h2>確認質問＆ミニ演習</h2>
              <p><strong>先生の問い：</strong>「特定の1社の、ある1ヶ月分の伝票を見たい」。会社コードと日付、それぞれどちらの入力欄が向いている？</p>
              <Reveal>
                <Dialog speaker="a">
                  会社コードは1社だから <code>PARAMETERS</code>、日付は期間だから <code>SELECT-OPTIONS</code> です。
                </Dialog>
                <Dialog speaker="b">
                  「1社」と「1月」で言葉が違うから、欄も違う、と考えると選びやすいですね。
                </Dialog>
                <Dialog speaker="teacher">
                  その通り！「1つに決まるもの＝PARAMETERS／幅があるもの＝SELECT-OPTIONS」で考えれば大丈夫。迷っても、この問いに戻れば選べます。
                </Dialog>
              </Reveal>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：核心は、選択画面を後続処理の品質を決める入口として設計すること。PARAMETERSで単一値、SELECT-OPTIONSで範囲や複数値を受け取りWHEREに正しく渡す。\nAくん：入力方式を誤ると必要以上のデータ取得につながり性能も可読性も落ちる。だから1点指定か幅指定かを先に決めるのが設計上の判断。\nBちゃん：検索フォームの作り方で結果の見やすさも速度も変わると分かりました。条件を入れず全件取得しないよう実行前に入力内容を確認する習慣も大事そう。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の核心は、選択画面を「後続処理の品質を決める入口」として設計することです。<code>PARAMETERS</code> で単一値、<code>SELECT-OPTIONS</code> で範囲や複数値を受け取り、<code>WHERE</code> に正しく渡します。
              </Dialog>
              <Dialog speaker="a">
                入力方式を誤ると、必要以上のデータ取得につながって性能も可読性も落ちますね。だから「1点指定か、幅指定か」を先に決めるのが設計上の判断になる。
              </Dialog>
              <Dialog speaker="b">
                検索フォームの作り方で結果の見やすさも速度も変わると分かりました。条件を入れずに全件取得しないように、実行前に入力内容を確認する習慣も大事そうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 範囲入力に向いているのは？→ SELECT-OPTIONS\nQ2 選択画面で入力した値は後でどう使われる？→ データ取得の絞り込み条件（WHERE）になる\nQ3 会社コードを1社だけ指定したい設計は？→ PARAMETERSで単一入力にする\n今日のひとこと：良い入口は、良いプログラムの第一歩。条件設計はこれからずっと役立ちます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="範囲や複数を受け取りたいときは SELECT-OPTIONS（From/To）。1つだけなら PARAMETERS です。入力の性質に合った部品を選ぶことで、画面の使いやすさと後続処理の明確さを同時に確保できます。"
                question={<strong>「日付 4/1〜4/30」のような範囲入力に向いているのは？</strong>}
                options={["PARAMETERS", "SELECT-OPTIONS", "WRITE"]}
              />
              <Quiz
                answer={0}
                explanation="入力した値は WHERE 条件に渡され、取得するデータの絞り込みに使われます。だから入口の設計が重要です。条件が曖昧だと不要データまで取得して処理が重くなるため、検索条件の粒度は性能にも直結します。"
                question={<strong>選択画面で入力した値は、後でどう使われる？</strong>}
                options={[
                  "データ取得の絞り込み条件（WHERE）になる",
                  "画面の色を変えるのに使われる",
                  "特に使われず捨てられる",
                ]}
              />
              <Quiz
                answer={2}
                explanation="会社コードのように必ず1つに決まる条件はPARAMETERSで受けると、利用者の入力が明確になりバリデーションもしやすくなります。範囲指定が不要な項目をSELECT-OPTIONSにすると、意図しない幅検索を招くことがあります。"
                question={<strong>「会社コードを1社だけ指定したい」条件設計として適切なのは？</strong>}
                options={[
                  "SELECT-OPTIONSで必ずFrom/Toを入力させる",
                  "入力欄を作らず全件取得して後で絞る",
                  "PARAMETERSで単一入力にする",
                ]}
              />
              <Dialog speaker="closing">
                良い入口は、良いプログラムの第一歩。条件設計はこれからずっと役立ちます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SelectionScreenLesson);
