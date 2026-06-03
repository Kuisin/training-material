import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Figure,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  CodeBlock,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "Kai Swimlane フロー制御 — コース概要",
  meta: "中級 · 15分",
};

export default function IntroductionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "09-flow-introduction", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "Kai Swimlane フロー制御 — コース概要\nスイムレーン DSL の /line/ セクションで使えるフロー制御構文を体系的に学ぶコースです。\n⏱ 15分 / 📶 中級 / 🏷 Swimlane DSL\nこの章で学ぶこと\n・フロー制御とは何か、なぜ必要か\n・6つの構文（if / loop / fork / section / branch / merge）の全体像\n・排他分岐（ひとつだけ）と並行処理（全部）の違い\n・枠（section）と支線（branch）の違い\n・ネストの規則と制約",
          content: (
            <>
              <hgroup>
                <h1>Kai Swimlane フロー制御</h1>
                <p>
                  スイムレーン DSL の <code>/line/</code> セクションで使えるフロー制御構文を体系的に学ぶコースです。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "Swimlane DSL" },
                ]}
              />
              <h3>このコースで学ぶこと</h3>
              <ul>
                <li>フロー制御とは何か、なぜ必要か</li>
                <li>6つの構文（<code>if</code> / <code>loop</code> / <code>fork</code> / <code>section</code> / <code>branch</code> / <code>merge</code>）の全体像</li>
                <li>排他分岐（ひとつだけ）と並行処理（全部）の違い</li>
                <li>枠（<code>section</code>）と支線（<code>branch</code>）の違い</li>
                <li>ネストの規則と制約</li>
              </ul>
            </>
          ),
        },
        {
          title: "フロー制御とは",
          plainText:
            "フロー制御とは\nフロー制御がないと、/line/ はただのステップの直線リスト。フロー制御を加えることで「条件によって経路が変わる」「複数の処理が同時に走る」「特定ステップをひとかたまりとして示す」「途中で別経路に飛ぶ」といった複雑な業務フローを表現できます。\n先生：たとえば注文処理フローを考えると、「在庫あり→出荷処理、在庫なし→取り寄せ」という分岐が必ず出てきます。これを if で表現します。\nAくん：プログラミング言語の if 文と概念は同じで、それを図として描く言語が DSL だというわけですね。\nBちゃん：業務の流れには必ず「場合によって違う処理」があるから、それを表せないと本物の業務フローが描けないんですね。",
          content: (
            <>
              <h2>フロー制御とは</h2>
              <p>
                フロー制御がないと、<code>/line/</code> はただのステップの<strong>直線リスト</strong>です。
                フロー制御を加えると以下が表現できます：
              </p>
              <ul>
                <li>条件によって<strong>経路が変わる</strong>（排他分岐）</li>
                <li>複数の処理が<strong>同時に走る</strong>（並行処理）</li>
                <li>特定ステップを<strong>ひとかたまりとして示す</strong>（視覚グループ）</li>
                <li>途中で<strong>側道に分岐して合流する</strong>（支線）</li>
                <li>条件によって<strong>遠くの地点に飛ぶ</strong>（途中合流）</li>
              </ul>
              <Figure
                src="image/00-flow-overview.webp"
                alt="左側に直線リストの単純フロー図、右側に分岐・並行・グループ・支線を組み合わせた複雑なスイムレーン図。フロー制御の有無による表現力の差を示す概念図。"
                caption="フロー制御がないと直線リスト — 制御を加えると複雑な業務フローを表現できる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                たとえば注文処理フローには「在庫あり→出荷処理、在庫なし→取り寄せ」という分岐が必ず出てきます。これを <code>if</code> で表現します。
              </Dialog>
              <Dialog speaker="a">
                プログラミング言語の if 文と概念は同じで、それを「図として描く言語」が DSL だというわけですね。
              </Dialog>
              <Dialog speaker="b">
                業務の流れには必ず「場合によって違う処理」があるから、表せないと本物の業務フローが描けないんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "6つの構文の全体像",
          plainText:
            "6つの構文の全体像\nif/elseif/else/endif: 排他分岐。条件によってひとつのケースだけが実行される。デシジョンダイヤモンド＋マージダイヤモンドで描画。\nloop: リトライ。if のケース末尾で同じ if デシジョンに戻る。if 内でのみ使用可。\nfork/and/endfork: 並行処理。全パスが同時実行される。スプリットバー＋ジョインバーで描画。\nsection/end-section: 視覚グループ。フローには影響せず、ステップを点線ボックスで囲む。\nbranch/end-branch: 支線。先頭ステップに入矢なし、末尾が end-branch 直後に合流する側道。\nmerge: 途中合流。if ケース内から id: 指定のステップに前方ジャンプ。\n先生：6つをすべて同時に覚える必要はありません。まず if と fork が「最重要」で、残りはそこに追加できるオプションです。\nAくん：if は「どれか一つ」、fork は「全部同時」というのが最大の違いですね。\nBちゃん：section が「見た目だけ」という点が面白いですね。フローの動きは変わらないのに枠が付く。",
          content: (
            <>
              <h2>6つの構文の全体像</h2>
              <InfoPanel title="フロー制御構文一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>構文</th>
                      <th>意味</th>
                      <th>描画形状</th>
                      <th>主な用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>if / elseif / else / endif</code></td>
                      <td>排他分岐（1つだけ実行）</td>
                      <td>デシジョン◇ + マージ◇</td>
                      <td>条件による経路切り替え</td>
                    </tr>
                    <tr>
                      <td><code>[loop]</code></td>
                      <td>リトライ（同じ if に戻る）</td>
                      <td>ループバック矢印</td>
                      <td>再試行・繰り返し処理</td>
                    </tr>
                    <tr>
                      <td><code>fork / and / endfork</code></td>
                      <td>並行処理（全パス実行）</td>
                      <td>スプリットバー + ジョインバー</td>
                      <td>同時並行で走る複数処理</td>
                    </tr>
                    <tr>
                      <td><code>section / end-section</code></td>
                      <td>視覚グループ（流れ不変）</td>
                      <td>点線ボックス</td>
                      <td>監査ブロック・通知群の可視化</td>
                    </tr>
                    <tr>
                      <td><code>branch / end-branch</code></td>
                      <td>支線（合流あり）</td>
                      <td>入矢なし → end-branch 後に合流</td>
                      <td>メインフローに並走する副処理</td>
                    </tr>
                    <tr>
                      <td><code>merge: id;</code></td>
                      <td>途中合流（前方ジャンプ）</td>
                      <td>id: 指定ステップへの矢印</td>
                      <td>キャンセルパス・早期終了</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Figure
                src="image/00-flow-types.webp"
                alt="6種類のフロー制御構文をそれぞれ小さなスイムレーン図で示した俯瞰図。if のデシジョンダイヤモンド、fork のスプリットバー、section の点線ボックス、branch の側道、merge の前方ジャンプ矢印が並ぶ。"
                caption="6つの構文と対応する描画形状の全体マップ"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                6つをすべて同時に覚える必要はありません。まず <code>if</code> と <code>fork</code> が「最重要」で、残りはそこに追加できるオプションです。
              </Dialog>
              <Dialog speaker="a">
                <code>if</code> は「どれか一つ」、<code>fork</code> は「全部同時」というのが最大の違いですね。
              </Dialog>
              <Dialog speaker="b">
                <code>section</code> が「見た目だけ」という点が面白いです。フローの動きは変わらないのに枠が付く。
              </Dialog>
            </>
          ),
        },
        {
          title: "排他 vs 並行",
          plainText:
            "排他分岐 vs 並行処理\nif = 条件を評価して、一致するケースだけが実行される。デシジョンダイヤモンドで分岐し、マージダイヤモンドで合流。\nfork = 全パスが同時に実行される。スプリットバーで分かれ、ジョインバーで合流。\n先生：注文確認の「審査あり/なし」はどちらか一方しか実行されないので if。メール送信・台帳更新・ログ保存は全部同時に走るので fork。\nAくん：diagram で見ると if はひし形（◇）、fork は横棒（─）で形が全然違うんですね。\nBちゃん：「どれか一つ実行」か「全部実行」かで使う構文が変わる、というのが直感的で分かりやすいです。",
          content: (
            <>
              <h2>排他分岐 vs 並行処理</h2>
              <MermaidDiagram
                chart={`flowchart TD
  subgraph IF["if — 排他分岐（ひとつだけ）"]
    D{{"条件判定◇"}} -->|ケースA| A1[処理A]
    D -->|ケースB| B1[処理B]
    D -->|ケースC| C1[処理C]
    A1 --> M{{"マージ◇"}}
    B1 --> M
    C1 --> M
  end
  subgraph FORK["fork — 並行処理（全部同時）"]
    S["スプリットバー ━"] --> P1[パス1]
    S --> P2[パス2]
    S --> P3[パス3]
    P1 --> J["ジョインバー ━"]
    P2 --> J
    P3 --> J
  end`}
              />
              <Dialog speaker="teacher">
                注文確認の「審査あり/なし」はどちらか一方しか実行されないので <code>if</code>。メール送信・台帳更新・ログ保存は全部同時に走るので <code>fork</code> です。
              </Dialog>
              <Dialog speaker="a">
                図で見ると <code>if</code> はひし形（◇）、<code>fork</code> は横棒（━）で、形が全然違うんですね。視覚的に一目で分かる。
              </Dialog>
              <Dialog speaker="b">
                「どれか一つ実行」か「全部実行」かで使う構文が変わる、というのが直感的で分かりやすいです！
              </Dialog>
              <Callout variant="tip">
                迷ったら自問してください：「これらの処理は<strong>同時に走る</strong>か？」→ YES なら <code>fork</code>、「条件によって<strong>どれか一つ</strong>しか実行されないか？」→ YES なら <code>if</code>。
              </Callout>
            </>
          ),
        },
        {
          title: "枠 vs 支線",
          plainText:
            "section（枠）vs branch（支線）\nsection: 視覚グループ。フローはそのまま流れ続ける。ステップが点線ボックスで囲まれるだけ。例：監査ブロック・通知ステップ群をまとめて示す。\nbranch: 支線。先頭ステップに入力矢印がない（side path であることを示す）。最後のステップが end-branch 直後のブロックに合流する。例：ピッキング・追跡ID通知という配送処理の支線。\n先生：section は「このステップたちは関連している」という注釈のための枠。流れは変わりません。branch は「メインフローとは独立した側道」で、必ず合流します。\nAくん：section は目印で、branch は構造上の経路、ということですね。\nBちゃん：なるほど、枠を見ても「フローが分かれてる」とは思わなくていいんですね。section は本当に見た目だけ。",
          content: (
            <>
              <h2>section（枠）vs branch（支線）</h2>
              <MermaidDiagram
                chart={`flowchart TD
  subgraph SEC["section — 視覚グループ（フロー不変）"]
    S1[ステップ1] --> S2
    subgraph BOX["section (監査ブロック) — 点線ボックス"]
      S2[ステップ2] --> S3[ステップ3]
    end
    S3 --> S4[ステップ4]
  end
  subgraph BR["branch — 支線（合流あり）"]
    M1[メインステップA] --> GATE(("end-branch 後の合流"))
    M1 --> |"branch (支線) — 入矢なし"| B1[支線ステップ1]
    B1 --> B2[支線ステップ2]
    B2 --> GATE
    GATE --> M2[メインステップB]
  end`}
              />
              <Dialog speaker="teacher">
                <code>section</code> は「このステップたちは関連している」という注釈のための枠です。流れは変わりません。<code>branch</code> は「メインフローとは独立した側道」で、必ず合流します。
              </Dialog>
              <Dialog speaker="a">
                <code>section</code> は目印、<code>branch</code> は構造上の経路、ということですね。
              </Dialog>
              <Dialog speaker="b">
                枠を見ても「フローが分かれてる」とは思わなくていいんですね。<code>section</code> は本当に見た目だけ。
              </Dialog>
              <Callout variant="note">
                <code>section</code> はフローの意味を変えません。図を読む人のための<strong>コメント的な役割</strong>です。対して <code>branch</code> は実際に経路が増えます。
              </Callout>
            </>
          ),
        },
        {
          title: "ネストの規則",
          plainText:
            "ネストの規則\nブロック同士は互いのケース/パス内にネストできますが、インターリーブ（交差）は禁止です。\n有効：if のケース内に fork を入れる。fork のパス内に if を入れる。\n無効：if と fork が交差する（if で開いて fork の中に endif を置くなど）。\n先生：必ず「開いたら同じ深さで閉じる」ルールです。プログラミングの括弧と同じ考え方。\nAくん：HTMLタグのネストルールと同じで、<div>を開いたら</div>で閉じて、内側のタグを外に出してはいけない、というのと一緒ですね。\nBちゃん：入れ子の人形（マトリョーシカ）みたいに、小さいものは大きいものの中にある、というイメージで理解できます。",
          content: (
            <>
              <h2>ネストの規則</h2>
              <p>ブロック同士は互いのケース/パス内に<strong>ネスト（入れ子）</strong>できます。ただし<strong>インターリーブ（交差）は禁止</strong>です。</p>
              <CodeBlock
                code={`// ✅ 有効：if ケース内に fork
if (審査結果) is (承認) than #green
  fork
    [role01: メール送信]
  and
    [role02: 台帳更新]
  endfork
elseif (却下) than #red
  [role01: 却下通知]
endif

// ✅ 有効：fork パス内に if
fork
  if (在庫) is (あり) than
    [role01: 出荷処理]
  else
    [role01: 取り寄せ]
  endif
and
  [role02: ログ保存]
endfork

// ❌ 無効：if と fork が交差（インターリーブ）
if (条件) is (ケースA) than
  fork              // ← if の中で fork を開始
    [role01: 処理]
endif              // ← fork を閉じる前に if を閉じている → エラー
  endfork`}
              />
              <Callout variant="warning">
                ブロックのインターリーブは<strong>エラー</strong>になります。必ず「開いたら同じ階層で閉じる」ルールを守ってください。深くネストするほど可読性が下がるため、<strong>3階層以内</strong>を目安にしましょう。
              </Callout>
              <Dialog speaker="teacher">
                必ず「開いたら同じ深さで閉じる」ルールです。プログラミングの括弧と同じ考え方ですよ。
              </Dialog>
              <Dialog speaker="a">
                HTML タグのネストルールと同じですね。<code>&lt;div&gt;</code> を開いたら <code>&lt;/div&gt;</code> で閉じる、内側のタグを外に出してはいけない、と一緒。
              </Dialog>
              <Dialog speaker="b">
                マトリョーシカ人形みたいに、小さいものは大きいものの<strong>中に完全に収まっている</strong>、というイメージで理解できます！
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：ここまでで6つの構文の概要を見ました。もう一度整理すると、if は排他分岐でひとつだけ実行、fork は並行処理で全部実行、section は視覚グループで流れ不変、branch は側道で合流あり、loop はリトライ、merge は前方ジャンプです。\nAくん：if と fork を混同しないことが大事ですね。「同時実行かどうか」が判断基準になる。\nBちゃん：section は見た目だけ、branch は実際の経路変化、というのが個人的には一番引っかかりそうなポイントです。\n先生：その2点を押さえていれば、次章以降の詳細も理解しやすいです。コードを実際に書きながら覚えていきましょう。\nAくん：loop と merge は if の中でしか使えない制約があるんですよね。それも忘れないようにします。\nBちゃん：ネストも「交差しない」というルールだけ守れば大丈夫ですね。確認テストで確かめます！",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                ここまでで6つの構文の概要を見ました。整理すると：<code>if</code> は排他分岐でひとつだけ実行、<code>fork</code> は並行処理で全部実行、<code>section</code> は視覚グループで流れ不変、<code>branch</code> は側道で合流あり、<code>loop</code> はリトライ、<code>merge</code> は前方ジャンプです。
              </Dialog>
              <Dialog speaker="a">
                <code>if</code> と <code>fork</code> を混同しないことが大事ですね。「同時実行かどうか」が判断基準になる。
              </Dialog>
              <Dialog speaker="b">
                <code>section</code> は見た目だけ、<code>branch</code> は実際の経路変化、というのが個人的には一番引っかかりそうなポイントです。
              </Dialog>
              <Dialog speaker="teacher">
                その2点を押さえていれば、次章以降の詳細も理解しやすいです。コードを実際に書きながら覚えていきましょう。
              </Dialog>
              <Dialog speaker="a">
                <code>loop</code> と <code>merge</code> は <code>if</code> の中でしか使えない制約があるんですよね。それも忘れないようにします。
              </Dialog>
              <Dialog speaker="b">
                ネストも「交差しない」というルールだけ守れば大丈夫ですね。確認テストで確かめます！
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 if と fork の最大の違いは？→ if はひとつのケースだけ実行、fork はすべてのパスが同時に実行される\nQ2 section と branch の違いとして正しいのは？→ section はフローを変えない視覚グループ、branch は合流のある側道経路\n今日のひとこと：まず if と fork の違いを体に刻んでください。残りの構文もその応用として理解できます。",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={1}
                explanation="if は条件を評価して一致するひとつのケースだけが実行され、残りのケースはスキップされます（排他分岐）。fork はすべてのパスが並行して実行されます（並行処理）。形状も if はデシジョンダイヤモンド、fork はスプリット/ジョインバーで異なります。"
                question={<strong><code>if</code> と <code>fork</code> の最大の違いは？</strong>}
                options={[
                  "if は色指定ができるが、fork はできない",
                  "if はひとつのケースだけ実行、fork はすべてのパスが同時に実行される",
                  "if はネストできるが、fork はネストできない",
                ]}
              />
              <Quiz
                answer={2}
                explanation="section はフローの実行順序を変えない視覚グループ（点線ボックス）です。ステップを囲むだけで、流れはそのまま続きます。branch はメインフローから分岐する側道経路で、end-branch の直後のブロックに合流します。"
                question={<strong><code>section</code> と <code>branch</code> の違いとして正しいのは？</strong>}
                options={[
                  "section は合流ありの側道、branch は視覚グループ",
                  "section も branch もフローを変えない",
                  "section はフローを変えない視覚グループ、branch は合流のある側道経路",
                ]}
              />
              <Dialog speaker="closing">
                まず <code>if</code> と <code>fork</code> の違いを体に刻んでください。残りの構文もその応用として自然に理解できます。次章から各構文を深く学んでいきましょう！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
