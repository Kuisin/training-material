import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "分割統治（ディバイド・アンド・コンカー）— 大きな問題を小さく分けて解く",
  meta: "初学者 · 15分",
};

export default function DivideAndConquerLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "a3-divide-and-conquer", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "大きな問題は、小さく分けて解く\n「分割統治（ディバイド・アンド・コンカー）」は、難しい大問題を、解ける大きさの小問題に分けて片付ける考え方。プログラミングでサブルーチンに処理を分けるのも、この発想の実践です。\n⏱ 15分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・分割統治とは何か（分割→処理→統合の3ステップ）\n・身近なたとえと、古典的な具体例（辞書引き＝二分探索、トランプ並べ＝マージソート）\n・第10章のサブルーチン（FORM/PERFORM）が分割統治の実践であること",
          content: (
            <>
              <hgroup>
                <h1>大きな問題は、小さく分けて解く</h1>
                <p>
                  <strong>分割統治（ディバイド・アンド・コンカー）</strong>は、
                  そのままでは難しい大きな問題を、解ける大きさの小さな問題に<strong>分けて</strong>片付ける考え方です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>分割統治とは何か（<strong>分割 → 処理 → 統合</strong> の3ステップ）</li>
                <li>身近なたとえと、古典的な具体例（辞書引き＝二分探索、トランプ並べ＝マージソート）</li>
                <li>第10章の<strong>サブルーチン（<code>FORM</code> / <code>PERFORM</code>）</strong>が、分割統治の実践であること</li>
              </ul>
              <Callout variant="note">
                「Divide（分ける）and Conquer（攻略する）」＝<strong>分けて、勝つ</strong>。
                もとは「大きな敵を、小さく分けてから各個撃破する」という戦略の言葉です。
              </Callout>
            </>
          ),
        },
        {
          title: "身近なたとえ",
          plainText:
            "大掃除は、一気にやろうとすると動けない\n「家中を掃除する」は大きすぎて手が止まる。でも「玄関」「台所」「お風呂」に分ければ、1つずつ片付けられる。終わった部屋を合わせれば家全体が片付く。これが分割統治。\nBちゃん：テスト勉強も「全科目やる」じゃ無理でも、「今日は数学の2章だけ」なら進みます。\n先生：そう。大きい塊は、手がつけられる大きさに割るのがコツ。小さくすれば、難しさそのものが下がります。",
          content: (
            <>
              <h2>大掃除は、一気にやろうとすると動けない</h2>
              <p>
                「家中を掃除する」は大きすぎて、どこから手をつけるか迷って止まりがちです。
                でも「玄関」「台所」「お風呂」と<strong>場所ごとに分ければ</strong>、1つずつ片付けられます。
                終わった部屋を合わせれば、結果として家全体がきれいになります。
              </p>
              <Callout variant="tip">
                ポイントは「<strong>小さくすると、難しさそのものが下がる</strong>」こと。
                大きい塊は、手がつけられる大きさに割るのがコツです。
              </Callout>
              <Dialog speaker="b">
                テスト勉強も「全科目やる」だと無理でも、「今日は数学の2章だけ」なら進められます。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれが分割統治です。大きな目標を、今すぐ取りかかれる小さな単位に割る。
                プログラムも同じで、長い処理を意味のかたまりに分けると、ぐっと扱いやすくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "3つのステップ",
          plainText:
            "分割統治は「分割→処理→統合」の3ステップ\n①分割：大きな問題を小さな問題に分ける ②処理：小さな問題をそれぞれ解く ③統合：解いた結果を合わせて答えにする。\nflowchart：大きな問題→（分割）3つの小問題→（それぞれ処理）→（統合）→答え。\nAくん：分けるだけじゃなく、最後に合わせるのが大事なんですね。\n先生：そう。分割統治は「分けて終わり」ではなく、小さな答えを集めて全体の答えにするところまでが1セットです。",
          content: (
            <>
              <h2>分割統治は「分割 → 処理 → 統合」の3ステップ</h2>
              <InfoPanel
                title="3つのステップ"
                variant="breakdown"
                lead="どんな分割統治も、この3段階に整理できます。"
              >
                <ul>
                  <li><strong>① 分割（Divide）</strong> … 大きな問題を、小さな問題に分ける</li>
                  <li><strong>② 処理（Conquer）</strong> … 小さな問題を、それぞれ解く</li>
                  <li><strong>③ 統合（Combine）</strong> … 解いた結果を合わせて、全体の答えにする</li>
                </ul>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart TD
  P["大きな問題"] -->|① 分割| A["小問題A"]
  P -->|① 分割| B["小問題B"]
  P -->|① 分割| C["小問題C"]
  A -->|② 処理| A2["答えA"]
  B -->|② 処理| B2["答えB"]
  C -->|② 処理| C2["答えC"]
  A2 -->|③ 統合| R["全体の答え"]
  B2 -->|③ 統合| R
  C2 -->|③ 統合| R`}
              />
              <Dialog speaker="a">
                分けるだけじゃなく、最後に<strong>合わせる</strong>のが大事なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そこが肝心です。分割統治は「分けて終わり」ではなく、
                小さな答えを集めて全体の答えにするところまでが1セットです。
              </Dialog>
            </>
          ),
        },
        {
          title: "具体例①：辞書引き",
          plainText:
            "具体例①：辞書で言葉を探す（二分探索）\n分厚い辞書で「さ行」を探すとき、1ページ目からめくらない。真ん中を開いて、探す語が前半か後半かを見て、いらない半分を捨てる。残り半分でまた真ん中…と繰り返すと一気に絞れる。\n先生：1000ページでも、半分ずつ捨てれば約10回で1ページに行き着きます。これが分割統治の威力。\nBちゃん：1ページずつなら最悪1000回。半分ずつなら10回。けた違いですね。",
          content: (
            <>
              <h2>具体例①：辞書で言葉を探す（二分探索）</h2>
              <p>
                分厚い辞書で言葉を探すとき、1ページ目から順にめくる人はいません。
                だいたい真ん中を開いて、探す語が<strong>前半か後半か</strong>を見て、
                <strong>いらない半分を捨てる</strong>。残った半分でまた真ん中を開く…を繰り返すと、一気に絞り込めます。
              </p>
              <InfoPanel
                title="半分ずつ捨てると、どれだけ速い？"
                variant="reference"
                lead="1000ページの辞書を例に、1ページずつ探す場合と比べます。"
              >
                <ul>
                  <li><strong>1ページずつ</strong> … 運が悪いと最大 1000 回めくる</li>
                  <li><strong>半分ずつ捨てる</strong> … 1000 → 500 → 250 → 125 …と減り、<strong>約10回</strong>で1ページに到達</li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                「探す範囲を半分に分け、いらない方を捨てる」を繰り返す探し方を<strong>二分探索</strong>といいます。
                毎回問題を半分に割っていく、分割統治の代表例です。
              </Callout>
              <Dialog speaker="b">
                1ページずつなら最悪1000回、半分ずつなら約10回…。同じ「探す」でも、けた違いに少ないんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そう、ここが分割統治の威力です。問題を毎回半分に割れると、回数が一気に少なくて済みます。
              </Dialog>
            </>
          ),
        },
        {
          title: "具体例②：トランプ並べ",
          plainText:
            "具体例②：トランプを並べ替える（マージソート）\nバラバラのカードの山を、半分・また半分…と1枚になるまで分ける。次に、2つの小さな並んだ山を「小さい方から取って合体」していくと、最後に全部が並んだ1つの山になる。\n先生：分割は「並べやすい大きさまで割る」、統合は「並んだ同士を正しい順で合体」。\nAくん：分けるのは簡単、合わせるところに工夫がある。これも分割→処理→統合ですね。",
          content: (
            <>
              <h2>具体例②：トランプを並べ替える（マージソート）</h2>
              <p>
                バラバラのカードの山を、いきなり全部並べるのは大変です。そこで——
              </p>
              <ol>
                <li><strong>分割</strong> … 山を半分、また半分…と、1枚になるまで分ける</li>
                <li><strong>処理</strong> … 1枚の山は、それだけで「並んでいる」とみなせる</li>
                <li><strong>統合</strong> … 2つの並んだ山を「小さい方から取って合体」を繰り返し、1つの並んだ山にする</li>
              </ol>
              <MermaidDiagram
                chart={`flowchart TD
  S["8 3 5 1"] --> L["8 3"]
  S --> R["5 1"]
  L --> L1["8"]
  L --> L2["3"]
  R --> R1["5"]
  R --> R2["1"]
  L1 --> M1["3 8"]
  L2 --> M1
  R1 --> M2["1 5"]
  R2 --> M2
  M1 --> F["1 3 5 8"]
  M2 --> F`}
              />
              <Callout variant="tip">
                この並べ替え方を<strong>マージソート</strong>といいます。
                「分けるのは簡単、<strong>合体（統合）のしかたに工夫</strong>がある」のが特徴です。
              </Callout>
              <Dialog speaker="a">
                分けるところより、正しい順で合わせるところが本番なんですね。これも「分割 → 処理 → 統合」だ。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。例①の二分探索は「いらない半分を捨てる」、例②のマージソートは「分けて並べて合わせる」。
                どちらも大きな問題を小さく割って攻略する、同じ発想です。
              </Dialog>
            </>
          ),
        },
        {
          title: "サブルーチンとの関係",
          plainText:
            "プログラムでの分割統治＝サブルーチン\n第10章で学んだ FORM/PERFORM は、まさに分割統治の実践。大きな処理を「入力チェック」「データ取得」「整形」「出力」のサブルーチンに分割し、それぞれが自分の小問題を処理し、メイン処理が順に呼んで（統合して）全体の答えを作る。\nコード例：PERFORM check_input / get_data / build_rows / output_report をメインから順に呼ぶ。\nAくん：サブルーチンに分けることが、分割統治そのものだったんですね。\n先生：そう。だから「処理を意味のかたまりに分ける」と読みやすく・直しやすく・再利用しやすくなる。第10章の3つの良いことは、分割統治の恩恵です。",
          content: (
            <>
              <h2>プログラムでの分割統治 ＝ サブルーチン</h2>
              <p>
                第10章で学んだ <code>FORM</code> / <code>PERFORM</code> は、まさに分割統治の実践です。
                大きな処理を役割ごとのサブルーチンに<strong>分割</strong>し、各サブルーチンが自分の小問題を
                <strong>処理</strong>し、メイン処理がそれらを順に呼んで<strong>統合</strong>します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" メイン処理 ＝ 小問題を順に呼んで統合する“司令塔”
START-OF-SELECTION.
  PERFORM check_input.    " ① 入力チェック（小問題1）
  PERFORM get_data.       " ② データ取得（小問題2）
  PERFORM build_rows.     " ③ 一覧へ整形（小問題3）
  PERFORM output_report.  " ④ 出力（小問題4）

" 各 FORM は、自分の小問題だけに集中する
FORM get_data.
  " … BKPF / BSEG から伝票を読むことだけを担当 …
ENDFORM.`}
              />
              <InfoPanel
                title="分割統治の3ステップと、サブルーチンの対応"
                variant="breakdown"
                lead="第10章のやり方を、分割統治の言葉で言い換えると次のとおりです。"
              >
                <ul>
                  <li><strong>① 分割</strong> … 大きな処理を <code>FORM</code> 単位（入力チェック・取得・整形・出力）に分ける</li>
                  <li><strong>② 処理</strong> … 各 <code>FORM</code> が、自分の担当だけを解く</li>
                  <li><strong>③ 統合</strong> … メイン処理が <code>PERFORM</code> で順に呼び、全体の答え（帳票）に組み上げる</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                サブルーチンに分けることが、分割統治そのものだったんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。だから「処理を意味のかたまりに分ける」と、読みやすく・直しやすく・再利用しやすくなる。
                第10章で挙げた3つの良いことは、分割統治がもたらす恩恵なのです。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="10-modularization"
                slide={4}
                label="第10章: モジュール化（FORM/PERFORM）に戻る"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 分割統治の3ステップは？→ 分割→処理→統合\nQ2 辞書を半分ずつ絞って探すやり方は？→ 二分探索（分割統治の例）\nQ3 プログラムで分割統治を実践する仕組みは？→ サブルーチン（FORM/PERFORM）に処理を分ける\n今日のひとこと：大きすぎて動けないときは、まず小さく分ける。分けた瞬間、半分は解けている。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="分割統治は「分割（小さく分ける）→処理（それぞれ解く）→統合（結果を合わせる）」の3ステップ。分けて終わりではなく、最後に合わせて全体の答えにするところまでが1セットです。"
                question={<strong>分割統治の3ステップとして正しいのは？</strong>}
                options={[
                  "入力 → 出力 → 保存",
                  "分割 → 処理 → 統合",
                  "宣言 → 代入 → 表示",
                ]}
              />
              <Quiz
                answer={1}
                explanation="探す範囲を半分に分け、いらない方を捨てる、を繰り返すのが二分探索。毎回問題を半分に割る、分割統治の代表例です。1000ページでも約10回で絞り込めます。"
                question={<strong>辞書を「真ん中を開いて半分ずつ絞る」探し方の名前は？</strong>}
                options={["線形探索（1件ずつ）", "二分探索", "総当たり"]}
              />
              <Quiz
                answer={2}
                explanation="ABAP では FORM/PERFORM で処理を役割ごとのサブルーチンに分割し、メイン処理が順に呼んで統合します。これがプログラムにおける分割統治の実践です。"
                question={<strong>ABAPプログラムで分割統治を実践する仕組みは？</strong>}
                options={[
                  "変数をすべてグローバルにする",
                  "1つのFORMに全処理を書く",
                  "サブルーチン（FORM/PERFORM）に処理を分ける",
                ]}
              />
              <Dialog speaker="closing">
                大きすぎて動けないときは、まず小さく分ける。分けた瞬間、もう半分は解けています。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(DivideAndConquerLesson);
