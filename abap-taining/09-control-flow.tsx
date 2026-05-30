import { renderLesson } from "../src/render-lesson";
import { Callout } from "../src/components/callout";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";

const chrome = {
  title: "制御の考え方",
  prevHref: "08-combine-data.html",
  nextHref: "10-modularization.html",
  indexHref: "../index.html",
};

const slides = [
  {
    title: "概要",
    plainText: "制御の考え方\n同じ見出しを繰り返さない「サプレス」、キーの変わり目で処理を分ける制御を学びます。\n⏱ 30分📶 初学者🏷 ABAP研修\nこの章で学ぶこと\nサプレス（＝同じ表示を繰り返さないこと）の考え方\n並びの「変わり目」で処理する制御（AT FIRST / AT LAST / AT NEW / AT END OF）\nフラグ（旗）を使った状態の管理と、多重ネストを避ける意識",
    content: (
      <>
        <hgroup>          <h1>制御の考え方</h1>          <p>同じ見出しを繰り返さない「サプレス」、キーの変わり目で処理を分ける制御を学びます。</p></hgroup>
        <LessonMeta items={[{ icon: "⏱", text: "30分" }, { icon: "📶", text: "初学者" }, { icon: "🏷", text: "ABAP研修" }]} />
        <h3>この章で学ぶこと</h3>
        <ul>          <li>サプレス（＝同じ表示を繰り返さないこと）の考え方</li>          <li>並びの「変わり目」で処理する制御（            <code>AT FIRST</code>/            <code>AT LAST</code>/            <code>AT NEW</code>/            <code>AT END OF</code>）</li>          <li>フラグ（旗）を使った状態の管理と、多重ネストを避ける意識</li></ul>
      </>
    ),
  },
  {
    title: "サプレスのたとえ",
    plainText: "同じ見出しを何度も書かない\n名簿で「東京都　田中」「東京都　佐藤」「東京都　鈴木」と毎行「東京都」を書くより、最初の1回だけ「東京都」と出して、あとは省くほうが見やすいですよね。これがサプレス＝同じ表示を繰り返さないことです。\n先生：用語は難しそうでも、中身は「重複する見出しを省いて見やすくする」だけ。日常でも自然にやっていることです。\nBちゃん：時刻表で「9時台」とまとめて、分だけ並べるのと同じですね。あれなら分かります！",
    content: (
      <>
        <h2>同じ見出しを何度も書かない</h2>
        <p>名簿で「東京都 田中」「東京都 佐藤」「東京都 鈴木」と毎行「東京都」を書くより、最初の1回だけ「東京都」と出して、あとは省くほうが見やすいですよね。これが          <strong>サプレス＝同じ表示を繰り返さないこと</strong>です。</p>
        <Callout variant="note">
先生：用語は難しそうでも、中身は「重複する見出しを省いて見やすくする」だけ。日常でも自然にやっていることです。
        </Callout>
        <Callout variant="warning">
Bちゃん：時刻表で「9時台」とまとめて、分だけ並べるのと同じですね。あれなら分かります！
        </Callout>
      </>
    ),
  },
  {
    title: "変わり目で処理する",
    plainText: "「変わり目」をきっかけに処理する\n並べ替えたデータを上から見ていくと、グループの「変わり目」があります。そこで小計を出したり、見出しを出したりします。\nAT FIRST：いちばん最初に1回（全体の見出しなど）\nAT NEW 項目：その項目が変わった最初の行（グループ見出し）\nAT END OF 項目：その項目が変わる直前の行（小計など）\nAT LAST：いちばん最後に1回（総合計など）\nつまずき：これらは事前に SORT してあることが前提。並んでいないと「変わり目」が正しく取れません。",
    content: (
      <>
        <h2>「変わり目」をきっかけに処理する</h2>
        <p>並べ替えたデータを上から見ていくと、グループの「変わり目」があります。そこで小計を出したり、見出しを出したりします。</p>
        <ul>          <li>            <code>AT FIRST</code>：いちばん最初に1回（全体の見出しなど）</li>          <li>            <code>AT NEW 項目</code>：その項目が変わった最初の行（グループ見出し）</li>          <li>            <code>AT END OF 項目</code>：その項目が変わる直前の行（小計など）</li>          <li>            <code>AT LAST</code>：いちばん最後に1回（総合計など）</li></ul>
        <Callout variant="warning">
つまずき：これらは
          <strong>事前に SORT してある</strong>
ことが前提。並んでいないと「変わり目」が正しく取れません。
        </Callout>
      </>
    ),
  },
  {
    title: "制御のコード例",
    plainText: "LOOP の中に制御ブロックを置く\n<code>SORT lt_out BY bukrs.\nLOOP AT lt_out INTO ls_out.\nAT FIRST.        WRITE: / '会社別 一覧'.        ENDAT.\nAT NEW bukrs.    WRITE: / '■ 会社:', ls_out-bukrs. ENDAT.\nWRITE: / ls_out-belnr, ls_out-amount.\nAT END OF bukrs. WRITE: / '  小計 …'.          ENDAT.\nAT LAST.         WRITE: / '== 総合計 ==' .       ENDAT.\nENDLOOP.</code>\nAくん：LOOP を回しながら「最初／グループ頭／グループ末／最後」にフックを掛けるんですね。構造がきれい。",
    content: (
      <>
        <h2>LOOP の中に制御ブロックを置く</h2>
        <CodeBlock code={`<code>SORT lt_out BY bukrs.
LOOP AT lt_out INTO ls_out.
  AT FIRST.        WRITE: / '会社別 一覧'.        ENDAT.
  AT NEW bukrs.    WRITE: / '■ 会社:', ls_out-bukrs. ENDAT.

  WRITE: / ls_out-belnr, ls_out-amount.

  AT END OF bukrs. WRITE: / '  小計 …'.          ENDAT.
  AT LAST.         WRITE: / '== 総合計 ==' .       ENDAT.
ENDLOOP.</code>`} />
        <Callout variant="tip">
Aくん：LOOP を回しながら「最初／グループ頭／グループ末／最後」にフックを掛けるんですね。構造がきれい。
        </Callout>
      </>
    ),
  },
  {
    title: "図解：キーの変わり目",
    plainText: "図で見る：キーが変わると分岐する\nflowchart TD\nS[次の行を読む] --> F{最初の行?}\nF -->|はい| H1[AT FIRST: 全体見出し]\nF -->|いいえ| N{会社が変わった?}\nH1 --> N\nN -->|はい| H2[AT NEW: グループ見出し]\nN -->|いいえ| W[明細を出力]\nH2 --> W\nW --> E{会社の最終行?}\nE -->|はい| H3[AT END OF: 小計]\nE -->|いいえ| S\nH3 --> S",
    content: (
      <>
        <h2>図で見る：キーが変わると分岐する</h2>
        <MermaidDiagram chart={`flowchart TD
  S[次の行を読む] --> F{最初の行?}
  F -->|はい| H1[AT FIRST: 全体見出し]
  F -->|いいえ| N{会社が変わった?}
  H1 --> N
  N -->|はい| H2[AT NEW: グループ見出し]
  N -->|いいえ| W[明細を出力]
  H2 --> W
  W --> E{会社の最終行?}
  E -->|はい| H3[AT END OF: 小計]
  E -->|いいえ| S
  H3 --> S`} />
      </>
    ),
  },
  {
    title: "フラグ（旗）",
    plainText: "フラグ ＝ 状態を覚えておく旗\nフラグは「ある状態が起きたか」を覚えておく小さな箱（多くは 'X' か空）。例：「1件でもエラーがあったか」を覚えておき、最後にまとめて判断します。\n<code>DATA lv_error TYPE flag.        \" 旗（'X' で立てる）\nLOOP AT lt_in INTO ls_in.\nIF ls_in-amount < 0.\nlv_error = 'X'.            \" エラーの旗を立てる\nENDIF.\nENDLOOP.\nIF lv_error = 'X'.\nMESSAGE 'エラーが含まれています' TYPE 'I'.\nENDIF.</code>\nBちゃん：「あとで思い出すための付箋」みたいなものですね。立てておいて、最後に見る。",
    content: (
      <>
        <h2>フラグ ＝ 状態を覚えておく旗</h2>
        <p>フラグは「ある状態が起きたか」を覚えておく小さな箱（多くは          <code>'X'</code>か空）。例：「1件でもエラーがあったか」を覚えておき、最後にまとめて判断します。</p>
        <CodeBlock code={`<code>DATA lv_error TYPE flag.        " 旗（'X' で立てる）

LOOP AT lt_in INTO ls_in.
  IF ls_in-amount < 0.
    lv_error = 'X'.            " エラーの旗を立てる
  ENDIF.
ENDLOOP.

IF lv_error = 'X'.
  MESSAGE 'エラーが含まれています' TYPE 'I'.
ENDIF.</code>`} />
        <Callout variant="warning">
Bちゃん：「あとで思い出すための付箋」みたいなものですね。立てておいて、最後に見る。
        </Callout>
      </>
    ),
  },
  {
    title: "SY-SUBRCだけでは足りない時",
    plainText: "「取れた／取れない」だけでは足りない場面\nSY-SUBRC は1回の処理の成否を表すだけ。「全体を通して見たときの状態（複数件のうち1件でも問題があったか等）」は、自分でフラグを使って覚えておく必要があります。\n先生：1回ごとの成否＝SY-SUBRC、流れ全体の状態＝フラグ。役割が違うので両方使います。\nこの章のABAPキーワード：AT FIRST / AT NEW / AT END OF / AT LAST / フラグ。",
    content: (
      <>
        <h2>「取れた／取れない」だけでは足りない場面</h2>
        <p>          <code>SY-SUBRC</code>は1回の処理の成否を表すだけ。「全体を通して見たときの状態（複数件のうち1件でも問題があったか等）」は、自分でフラグを使って覚えておく必要があります。</p>
        <Callout variant="note">
先生：1回ごとの成否＝
          <code>SY-SUBRC</code>
、流れ全体の状態＝
          <strong>フラグ</strong>
。役割が違うので両方使います。
        </Callout>
        <Callout variant="tip">
この章のABAPキーワード：
          <code>AT FIRST</code>
/
          <code>AT NEW</code>
/
          <code>AT END OF</code>
/
          <code>AT LAST</code>
/ フラグ。
        </Callout>
      </>
    ),
  },
  {
    title: "多重ネストを避ける",
    plainText: "入れ子を深くしすぎない\nIF の中に IF、さらにその中に IF…と深くなると、読めなくなります。条件を整理したり、早めに CONTINUE で抜けたりして、浅く保ちましょう。\nつまずき：「とりあえず IF を足す」を繰り返すと、3ヶ月後に誰も読めないコードに。→ 深くなったら「分け方を見直すサイン」です。\nAくん：ネストの深さは“複雑さのメーター”だと思えば良いんですね。浅いほど健全。",
    content: (
      <>
        <h2>入れ子を深くしすぎない</h2>
        <p>          <code>IF</code>の中に          <code>IF</code>、さらにその中に          <code>IF</code>…と深くなると、読めなくなります。条件を整理したり、早めに          <code>CONTINUE</code>で抜けたりして、浅く保ちましょう。</p>
        <Callout variant="warning">
つまずき：「とりあえず IF を足す」を繰り返すと、3ヶ月後に誰も読めないコードに。→ 深くなったら「分け方を見直すサイン」です。
        </Callout>
        <Callout variant="tip">
Aくん：ネストの深さは“複雑さのメーター”だと思えば良いんですね。浅いほど健全。
        </Callout>
      </>
    ),
  },
  {
    title: "対話で整理",
    plainText: "対話で整理\n先生：この章は、LOOP中の「変わり目」を捕まえて表示や集計を制御する考え方を身につける章です。AT FIRST / AT NEW / AT END OF / AT LASTは、並び順が正しいときに初めて意味を持ちます。\nAくん：つまり制御文の理解だけでは不十分で、事前SORTを含めて1セットの設計なんですね。さらに1回ごとの成否はSY-SUBRC、全体状態はフラグで管理すると責務分離ができる。\nBちゃん：サプレスは難しい言葉に見えたけど、同じ見出しを省いて見やすくする工夫だと分かりました。条件を増やしすぎてネストが深くなったら、処理の分け方を見直します。",
    content: (
      <>
        <h2>対話で整理</h2>
        <Callout variant="note">
先生：この章は、LOOP中の「変わり目」を捕まえて表示や集計を制御する考え方を身につける章です。AT FIRST / AT NEW / AT END OF / AT LASTは、並び順が正しいときに初めて意味を持ちます。
        </Callout>
        <Callout variant="tip">
Aくん：つまり制御文の理解だけでは不十分で、事前SORTを含めて1セットの設計なんですね。さらに1回ごとの成否はSY-SUBRC、全体状態はフラグで管理すると責務分離ができる。
        </Callout>
        <Callout variant="warning">
Bちゃん：サプレスは難しい言葉に見えたけど、同じ見出しを省いて見やすくする工夫だと分かりました。条件を増やしすぎてネストが深くなったら、処理の分け方を見直します。
        </Callout>
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック\n「サプレス」の意味として正しいのは？\n同じ表示を繰り返さず省くこと\nデータを並べ替えること\nエラーを記録すること\nAT NEW・AT END OF を正しく使うための前提は？\nNEW-PAGE を入れること\nフラグを必ず立てること\n事前にキー項目で SORT しておくこと\n「複数件のうち1件でもエラーがあったか」を覚えておくのに向くのは？\nSY-SUBRC を見るだけ\nフラグ（旗）を使う\nULINE を引く\n今日のひとこと：制御は“難しい呪文”ではなく「見やすく・正しく並べる工夫」。比喩に戻せば必ず分かります。",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={0}
          explanation={"サプレスは「同じ表示を繰り返さない」こと。見出しの重複を省いて見やすくします。単なる省略ではなく、読み手がグループ構造を素早く把握するための表示設計という位置づけです。"}
          question={<>            <strong>「サプレス」の意味として正しいのは？</strong></>}
          options={["同じ表示を繰り返さず省くこと", "データを並べ替えること", "エラーを記録すること"]}
        />
        <Quiz
          answer={2}
          explanation={"AT NEW/AT END OF などの制御は、事前に SORT してグループが並んでいることが前提です。並びが崩れていると変わり目判定がずれ、見出しや小計の位置が不正になって帳票の信頼性を落とします。"}
          question={<>            <strong>AT NEW・AT END OF を正しく使うための前提は？</strong></>}
          options={["NEW-PAGE を入れること", "フラグを必ず立てること", "事前にキー項目で SORT しておくこと"]}
        />
        <Quiz
          answer={1}
          explanation={"フラグは流れ全体の状態（1件でも問題があったか等）を覚えておく旗。1回ごとの成否を表す SY-SUBRC とは役割が違います。"}
          question={<>            <strong>「複数件のうち1件でもエラーがあったか」を覚えておくのに向くのは？</strong></>}
          options={["SY-SUBRC を見るだけ", "フラグ（旗）を使う", "ULINE を引く"]}
        />
        <Quiz
          answer={0}
          explanation={"AT FIRSTはLOOP開始時に1回だけ実行されるため、全体見出しや初期化処理の配置先として適しています。毎行実行される明細出力と分離しておくことで、出力の重複や可読性低下を防げます。"}
          question={<>            <strong>全体見出しを「最初の1回だけ」出したい場合に適切なのは？</strong></>}
          options={["AT FIRST を使う", "AT END OF を使う", "LOOPの外でSY-SUBRCを確認する"]}
        />
        <Callout variant="note">
今日のひとこと：制御は“難しい呪文”ではなく「見やすく・正しく並べる工夫」。比喩に戻せば必ず分かります。
        </Callout>
      </>
    ),
  }
];

renderLesson(chrome, slides);
