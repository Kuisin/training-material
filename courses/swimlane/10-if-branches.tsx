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
  title: "第1章 — 排他分岐（if / elseif / else / endif）",
  meta: "中級 · 25分",
};

export default function IfBranchesLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "10-if-branches", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第1章 — 排他分岐（if / elseif / else / endif）\n条件によってひとつのケースだけが実行される排他分岐の完全ガイド。\n⏱ 25分 / 📶 中級 / 🏷 Swimlane DSL\nこの章で学ぶこと\n・if / is / than / endif の基本構文\n・than #color で色を指定する方法\n・elseif と else で複数ケースを扱う\n・ケース内のステップとレーン変更\n・[loop] でリトライを表現する\n・if を入れ子にする方法と注意点",
          content: (
            <>
              <hgroup>
                <h1>排他分岐</h1>
                <p>
                  条件によって<strong>ひとつのケースだけ</strong>が実行される排他分岐の完全ガイドです。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "Swimlane DSL" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li><code>if</code> / <code>is</code> / <code>than</code> / <code>endif</code> の基本構文</li>
                <li><code>than #color</code> でケースに色を指定する方法</li>
                <li><code>elseif</code> と <code>else</code> で複数ケースを扱う</li>
                <li>ケース内のステップとレーン変更の自由度</li>
                <li><code>[loop]</code> でリトライを表現する</li>
                <li><code>if</code> を入れ子にする方法と注意点</li>
              </ul>
            </>
          ),
        },
        {
          title: "基本構文",
          plainText:
            "if の基本構文\nif (条件ラベル) is (ケースA) than\n  [role: ステップ]\nelseif (ケースB) than\n  [role: ステップ]\nelse\n  [role: ステップ]\nendif\n条件はデシジョンダイヤモンド（◇）として描画される。各ケースが分岐路になり、endif のマージダイヤモンド（◇）で合流する。\n先生：if の後の括弧にデシジョンの「見出し」、is の後に「ケース名」を書きます。ケース名が菱形から出るラベルになります。\nAくん：（条件）と（ケース名）が分かれているのは、ひとつのデシジョンに複数のケースが生えるからですね。\nBちゃん：「もし請求結果が承認なら処理A」という日本語に直接対応している構文なので読みやすいです。",
          content: (
            <>
              <h2>基本構文</h2>
              <CodeBlock
                code={`/line/
[role01: 請求書発行]
if (審査結果) is (承認) than
  [role02: 支払処理]
elseif (保留) than
  [role01: 追加確認依頼]
else
  [role01: 却下通知]
endif
[role01: 完了記録]`}
              />
              <Figure
                src="image/01-if-basic.webp"
                alt="スイムレーン図。「審査結果」デシジョンダイヤモンドから「承認」「保留」「その他」の3本の矢印が出て、それぞれのケースのステップを経てマージダイヤモンドに戻ってくる構造図。"
                caption="if の基本構造 — デシジョン◇ で分岐し、endif の マージ◇ で合流"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                <code>if</code> の後の括弧にデシジョンの「見出し」、<code>is</code> の後に「ケース名」を書きます。ケース名が菱形から出るラベルになります。
              </Dialog>
              <Dialog speaker="a">
                （条件）と（ケース名）が分かれているのは、ひとつのデシジョンに複数のケースが生えるからですね。
              </Dialog>
              <Dialog speaker="b">
                「もし審査結果が承認なら支払処理」という日本語に直接対応している構文なので読みやすいです！
              </Dialog>
            </>
          ),
        },
        {
          title: "than と色指定",
          plainText:
            "than #color による色指定\nthan の後に #color を付けると、そのケースの経路を色付きで描画できる。\n利用可能な色：blue、green、red、orange、purple、gray、black\n色なしの場合はテーマデフォルト色が使われる。\n先生：承認パスを #green、却下パスを #red にするだけで、図を見た人が直感的にパスの意味を理解できます。\nAくん：プログラムのログレベル（INFO/WARN/ERROR）に色を割り当てるのと似た感覚ですね。\nBちゃん：赤が危険・緑が安全という既存の認識を活かして色を選べるから、説明なしでも伝わりやすい。",
          content: (
            <>
              <h2><code>than #color</code> による色指定</h2>
              <CodeBlock
                code={`/line/
if (与信審査) is (通過) than #green
  [role02: 注文確定]
elseif (警告) than #orange
  [role01: 上長確認]
elseif (否決) than #red
  [role01: 却下メール送信]
else
  [role01: 手動判定]
endif`}
              />
              <InfoPanel title="利用可能な色" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>キーワード</th>
                      <th>主な用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><code>#blue</code></td><td>標準・情報</td></tr>
                    <tr><td><code>#green</code></td><td>成功・承認・正常</td></tr>
                    <tr><td><code>#red</code></td><td>エラー・却下・警告</td></tr>
                    <tr><td><code>#orange</code></td><td>注意・保留</td></tr>
                    <tr><td><code>#purple</code></td><td>特殊・管理フロー</td></tr>
                    <tr><td><code>#gray</code></td><td>無効・スキップ</td></tr>
                    <tr><td><code>#black</code></td><td>強調・最終</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                承認パスを <code>#green</code>、却下パスを <code>#red</code> にするだけで、図を見た人が直感的にパスの意味を理解できます。
              </Dialog>
              <Dialog speaker="a">
                プログラムのログレベル（INFO/WARN/ERROR）に色を割り当てるのと似た感覚ですね。
              </Dialog>
              <Dialog speaker="b">
                赤が危険・緑が安全という既存の認識を活かして色を選べるから、説明なしでも伝わりやすいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "elseif と else",
          plainText:
            "elseif と else による複数ケース\nelseif は追加のケース判定。else は「それ以外」のキャッチオールケース。\nelseif は何個でも追加できる。else は最大1つ（なくてもよい）。\n先生：else はすべての elseif に当てはまらなかった場合のフォールバックです。業務的には「想定外」のケースをここで拾うことが多いです。\nAくん：プログラムの switch / case の default 節と同じ役割ですね。\nBちゃん：else がないとすべてのケースが明示的に書かれていることになるので、見た目に「抜け漏れがない」という安心感がありますね。",
          content: (
            <>
              <h2><code>elseif</code> と <code>else</code> による複数ケース</h2>
              <CodeBlock
                code={`/line/
[role01: 在庫確認]
if (在庫状況) is (十分) than #green
  [role02: 即時出荷指示]
elseif (少量) than #orange
  [role01: 緊急発注]
  [role02: 保留出荷]
elseif (ゼロ) than #red
  [role01: 欠品連絡]
  [role03: 代替品検索]
else
  [role01: システム確認依頼]
endif
[role02: 出荷ステータス更新]`}
              />
              <Figure
                src="image/01-if-multi.webp"
                alt="スイムレーン図。在庫状況デシジョンから「十分（緑）」「少量（橙）」「ゼロ（赤）」「その他」の4ケースが分岐し、各ケースに複数ステップがある。全パスがマージダイヤモンドで合流する。"
                caption="elseif を使った多ケース分岐 — 4つの経路が並ぶスイムレーン図"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                <code>else</code> はすべての <code>elseif</code> に当てはまらなかった場合のフォールバックです。業務的には「想定外」のケースをここで拾うことが多いです。
              </Dialog>
              <Dialog speaker="a">
                プログラムの <code>switch / case</code> の <code>default</code> 節と同じ役割ですね。
              </Dialog>
              <Dialog speaker="b">
                <code>else</code> があると「想定外も拾ってる」という安心感があります。抜け漏れがない設計に見えますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ケース内のステップ",
          plainText:
            "ケース内のステップとレーン変更\nケース内のステップは何個でも書ける。各ステップのロール（レーン）は自由に変更可。\n先生：ケースをまたいでロールが変わっても構いません。「承認ケースはrole02が処理して、却下ケースはrole01が処理する」という表現が自然にできます。\nAくん：各ケースが独立したサブフローのように動作するので、業務分担をそのまま表現できますね。\nBちゃん：承認ルートと却下ルートで担当者が違う場合、それをそのまま書けるのは便利です。",
          content: (
            <>
              <h2>ケース内のステップとレーン変更</h2>
              <CodeBlock
                code={`/line/
[role01: 申請受付]
if (申請内容) is (通常申請) than #blue
  // role01 → role02 → role03 とレーンをまたぐ
  [role01: 申請データ検証]
  [role02: 承認者へ転送]
  [role03: 承認入力]
  [role01: 申請完了通知]
elseif (緊急申請) than #red
  // 緊急は役員レーンへ直行
  [role04: 役員承認]
  [role01: 即時完了処理]
else
  // その他は role01 のみで完結
  [role01: 窓口対応]
endif
[role01: 結果記録]`}
              />
              <Dialog speaker="teacher">
                ケースをまたいでロールが変わっても構いません。「承認ケースは role02 が処理して、却下ケースは role01 が処理する」という表現が自然にできます。
              </Dialog>
              <Dialog speaker="a">
                各ケースが独立したサブフローのように動作するので、業務分担をそのまま表現できますね。
              </Dialog>
              <Dialog speaker="b">
                承認ルートと却下ルートで担当者が違う場合、それをそのまま書けるのは便利です！
              </Dialog>
              <Callout variant="tip">
                ケース内のロール変更に制限はありません。ただし、あまりレーンが行き来すると図が見づらくなるため、業務上必要な範囲に絞ることを推奨します。
              </Callout>
            </>
          ),
        },
        {
          title: "ケースが空のとき",
          plainText:
            "空ケースの扱い\nケースの中にステップが0個でも有効。デシジョンダイヤモンドからマージダイヤモンドへ直接矢印が引かれる。\n先生：「このケースでは何もしない」という業務上の意図を明示的に表現できます。空ケースがあることで「検討して意図的に何もしない」という設計が伝わります。\nAくん：コードの空の case ブロックのように、意図的に空にすることで「考慮済み」を示せますね。\nBちゃん：空ケースがあると「ここ書き忘れてる？」と思いそうですが、コメントを入れておけば安心ですね。",
          content: (
            <>
              <h2>空ケースの扱い</h2>
              <CodeBlock
                code={`/line/
[role01: 通知判定]
if (通知設定) is (メールあり) than #blue
  [role02: メール送信]
elseif (SMS) than #green
  [role02: SMS送信]
elseif (通知不要) than #gray
  // このケースでは何もしない（意図的に空）
else
  [role01: デフォルト通知]
endif
[role01: 完了]`}
              />
              <Callout variant="note">
                空ケースはエラーになりません。ただし、コメント（<code>//</code>）を使って「意図的に空である理由」を記載しておくと、図を見たチームメンバーが混乱しません。
              </Callout>
              <Dialog speaker="teacher">
                「このケースでは何もしない」という業務上の意図を明示的に表現できます。空ケースがあることで「検討して意図的に何もしない」という設計が伝わります。
              </Dialog>
              <Dialog speaker="a">
                コードの空の <code>case</code> ブロックのように、意図的に空にすることで「考慮済み」を示せますね。
              </Dialog>
              <Dialog speaker="b">
                空ケースに <code>// 意図的に空</code> とコメントを入れれば安心ですね。書き忘れかどうかがすぐ分かる。
              </Dialog>
            </>
          ),
        },
        {
          title: "ループ（[loop]）",
          plainText:
            "ループ構文 [loop]\nif のケース末尾に [loop] を置くと、そのケースの実行後に同じ if のデシジョンダイヤモンドに戻る矢印が引かれる。リトライ・繰り返し処理の表現に使う。\n制約：if ケース内でのみ使用可。if の外では使えない。\n先生：外部APIへの呼び出しで失敗した場合に再試行するパターンがよくあります。[loop] を使えばそれをそのままフローで表現できます。\nAくん：while(error) { retry(); } のような再試行ループをフロー図で表現するための専用構文なんですね。\nBちゃん：ループが図で分かると、「何回繰り返す可能性があるのか」という設計意図が一目で伝わりますね。",
          content: (
            <>
              <h2><code>[loop]</code> — リトライを表現する</h2>
              <CodeBlock
                code={`/line/
[role01: 外部API呼び出し]
if (API結果) is (成功) than #green
  [role02: 結果処理]
  [role01: 完了フラグ設定]
elseif (タイムアウト) than #orange
  [role01: 待機（5秒）]
  [loop]            // ← デシジョンに戻る（再試行）
elseif (サーバーエラー) than #red
  [role01: エラーログ記録]
  [loop]            // ← こちらも再試行
else
  [role01: 致命的エラー通知]
endif
[role01: 後処理]`}
              />
              <Figure
                src="image/01-loop.webp"
                alt="スイムレーン図。「API結果」デシジョンダイヤモンドから「成功」「タイムアウト」「サーバーエラー」の3ケースが分岐。タイムアウトとサーバーエラーのケース末尾からデシジョンダイヤモンドへループバック矢印が引かれている。"
                caption="[loop] の描画 — ケース末尾からデシジョンダイヤモンドへループバック矢印"
                kind="diagram"
              />
              <Callout variant="warning">
                <code>[loop]</code> は <strong><code>if</code> のケース内でのみ</strong>使用できます。<code>fork</code> のパス内や <code>if</code> の外では使えません。
              </Callout>
              <Dialog speaker="teacher">
                外部 API 呼び出しで失敗した場合に再試行するパターンによく使います。<code>[loop]</code> を使えばそれをそのままフローで表現できます。
              </Dialog>
              <Dialog speaker="a">
                <code>{"while(error) { retry(); }"}</code> のような再試行ループをフロー図で表現するための専用構文なんですね。
              </Dialog>
              <Dialog speaker="b">
                ループが図で分かると、「何回繰り返す可能性があるのか」という設計意図が一目で伝わりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ネストされたif",
          plainText:
            "if の入れ子\nif のケース内に別の if を入れることができる。内側の if も完全に自分の endif を持つ必要がある（インターリーブ禁止）。\n先生：入れ子は業務的には「大分類→小分類」の分岐を表現するときに有用です。ただし深くなりすぎると図が見にくくなるので注意。\nAくん：if の中に if が3階層以上になると、一目で読めなくなりますね。可読性を優先するなら分割も検討すべき。\nBちゃん：なんとなく「あまり深くしない」という経験則で書くのが正解なんでしょうね。2階層くらいまでなら許容範囲かな。",
          content: (
            <>
              <h2><code>if</code> の入れ子</h2>
              <CodeBlock
                code={`/line/
[role01: 注文受付]
if (顧客ランク) is (プレミアム) than #purple
  // プレミアム顧客：さらに注文金額で分岐
  [role01: VIP確認]
  if (注文金額) is (10万円以上) than #green
    [role02: 専任担当割り当て]
    [role03: 特急処理]
  else
    [role02: 通常VIP処理]
  endif
  [role01: VIP完了通知]
elseif (一般) than #blue
  [role02: 標準処理]
else
  [role01: 新規顧客登録]
  [role02: 初回案内送付]
endif
[role01: 受注確定]`}
              />
              <Callout variant="warning">
                入れ子の <code>if</code> は<strong>2階層以内</strong>を強く推奨します。3階層以上になると図の幅が広がり可読性が著しく低下します。深い場合は別フロー図に分割を検討してください。
              </Callout>
              <Dialog speaker="teacher">
                入れ子は「大分類→小分類」の分岐を表現するときに有用です。ただし深くなりすぎると図が見にくくなるので注意が必要です。
              </Dialog>
              <Dialog speaker="a">
                <code>if</code> の中に <code>if</code> が3階層以上になると、一目で読めなくなりますね。可読性を優先するなら分割も検討すべき。
              </Dialog>
              <Dialog speaker="b">
                2階層くらいまでなら許容範囲、それ以上は別の図に分けた方がいいという経験則は分かりやすいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：排他分岐の全パターン",
          plainText:
            "排他分岐の全パターン総まとめ\nif + elseif + else + loop を組み合わせた典型例を確認します。\n先生：一枚の図の中にif・elseif・else・loopが全部入っています。実際の業務フローに近い複雑さです。\nAくん：これを見ると各構文の役割分担が一目で分かりますね。コードと図を対照しながら読むと理解が深まります。\nBちゃん：ここまで来るとDSLで書ける業務フローの幅がかなり広がっている気がします。",
          content: (
            <>
              <h2>排他分岐の全パターン</h2>
              <CodeBlock
                code={`/line/
// 受発注処理フロー（全パターン使用例）
[role01: 受注データ受信]

if (データ検証) is (正常) than #green
  [role01: 受注登録]
  if (在庫) is (十分) than #blue
    [role02: 即時出荷指示]
    [role03: 伝票発行]
  else
    [role01: 入荷待ち登録]
    [role02: 仕入れ発注]
  endif
  [role01: 顧客通知送信]

elseif (一部エラー) than #orange
  [role01: エラー詳細確認]
  [role04: 担当者エスカレーション]
  [loop]            // ← 担当者が修正して再検証

elseif (致命的エラー) than #red
  [role01: エラーログ保存]
  [role04: 緊急アラート送信]

else
  [role01: 不明エラー記録]
endif

[role01: 処理完了記録]`}
              />
              <MermaidDiagram
                chart={`flowchart TD
  A[受注データ受信] --> D{{"データ検証◇"}}
  D -->|正常 🟢| B[受注登録]
  B --> D2{{"在庫◇"}}
  D2 -->|十分 🔵| C[即時出荷指示]
  D2 -->|その他| E[入荷待ち登録]
  C --> M2{{"マージ◇"}}
  E --> M2
  M2 --> N[顧客通知送信]
  N --> M{{"マージ◇"}}
  D -->|一部エラー 🟠| F[エラー詳細確認]
  F --> G[エスカレーション]
  G -->|ループバック| D
  D -->|致命的 🔴| H[エラーログ保存]
  H --> M
  D -->|その他| I[不明エラー記録]
  I --> M
  M --> Z[処理完了記録]`}
              />
              <Callout variant="tip">
                <strong>まとめ</strong>：<code>if</code> はデシジョン◇で分岐 → <code>elseif</code> で追加ケース → <code>else</code> でフォールバック → <code>endif</code> のマージ◇で合流。<code>[loop]</code> はケース末尾でデシジョンに戻るリトライ専用。
              </Callout>
              <Dialog speaker="teacher">
                一枚の図の中に if・elseif・else・loop が全部入っています。実際の業務フローに近い複雑さです。
              </Dialog>
              <Dialog speaker="a">
                コードと図を対照しながら読むと、各構文の役割分担が一目で分かりますね。
              </Dialog>
              <Dialog speaker="b">
                ここまで来ると、DSL で書ける業務フローの幅がかなり広がっている気がします！
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章では if の完全な構文を学びました。基本は if/is/than/endif の4キーワード。色は than #color で指定。複数ケースは elseif、フォールバックは else、リトライは [loop]、入れ子も可能です。\nAくん：[loop] が if の中でしか使えないという制約は重要ですね。fork のパス内では使えない。\nBちゃん：色の使い分け（#green で成功、#red で失敗）というパターンを覚えれば、自然と意味の伝わる図が書けそうです。\n先生：その通りです。色は任意なので使わなくてもいいですが、使うと可読性が上がります。入れ子は2階層以内を守れば複雑な業務フローも表現できます。\nAくん：次章の fork（並行処理）との組み合わせが楽しみです。fork の中に if を入れるパターンは実業務でよく出てきそう。\nBちゃん：まずこの章の内容を自分でコードを書いて確かめてみます！",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章では <code>if</code> の完全な構文を学びました。基本は <code>if/is/than/endif</code> の4キーワード。色は <code>than #color</code> で指定。複数ケースは <code>elseif</code>、フォールバックは <code>else</code>、リトライは <code>[loop]</code>、入れ子も可能です。
              </Dialog>
              <Dialog speaker="a">
                <code>[loop]</code> が <code>if</code> の中でしか使えないという制約は重要ですね。<code>fork</code> のパス内では使えない。
              </Dialog>
              <Dialog speaker="b">
                色の使い分け（<code>#green</code> で成功、<code>#red</code> で失敗）というパターンを覚えれば、自然と意味の伝わる図が書けそうです。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。色は任意なので使わなくてもいいですが、使うと可読性が上がります。入れ子は2階層以内を守れば複雑な業務フローも表現できます。
              </Dialog>
              <Dialog speaker="a">
                次章の <code>fork</code>（並行処理）との組み合わせが楽しみです。<code>fork</code> の中に <code>if</code> を入れるパターンは実業務でよく出てきそう。
              </Dialog>
              <Dialog speaker="b">
                まずこの章の内容を自分でコードを書いて確かめてみます！
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 [loop] を使える場所は？→ if のケース内のみ（if の外や fork のパス内では使えない）\nQ2 elseif (ケースB) than #red の意味は？→ ケースBに一致するときこのパスを赤色で実行する\n今日のひとこと：if は排他分岐の基本です。than #color で意味を色で伝え、[loop] でリトライを表現しましょう。",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={1}
                explanation="[loop] は if のケース内でのみ使用できます。if の外や fork のパス内に書くとエラーになります。ケース末尾に置くと、そのケース実行後に同じ if のデシジョンダイヤモンドへループバックします。"
                question={<strong><code>[loop]</code> を使える場所として正しいのは？</strong>}
                options={[
                  "fork のパス内（andブロック内）",
                  "if のケース内のみ（if の外や fork のパス内では使えない）",
                  "どこでも使える（if の外でも有効）",
                ]}
              />
              <Quiz
                answer={0}
                explanation="elseif (ケースB) than #red は「条件がケースBに一致するとき、そのパスを赤色で実行する」という意味です。than の後の #color はそのケースの経路色を指定します。色を省略するとテーマデフォルト色が使われます。"
                question={<strong><code>elseif (ケースB) than #red</code> の意味として正しいのは？</strong>}
                options={[
                  "ケースBに一致するとき、このパスを赤色で実行する",
                  "ケースBに一致するとき、エラーとして処理を停止する",
                  "ケースBは必ずスキップされる",
                ]}
              />
              <Dialog speaker="closing">
                <code>if</code> は排他分岐の基本です。<code>than #color</code> で意味を色で伝え、<code>[loop]</code> でリトライを表現しましょう。次章では全パスが同時実行される <code>fork</code> を学びます！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IfBranchesLesson);
