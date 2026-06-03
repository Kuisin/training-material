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
  title: "第2章 — 並行処理（fork / and / endfork）",
  meta: "中級 · 20分",
};

export default function ForkParallelLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "11-fork-parallel", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第2章 — 並行処理（fork / and / endfork）\n全パスが同時に実行される並行処理の構文を学ぶ章です。\n⏱ 20分 / 📶 中級 / 🏷 Swimlane DSL\nこの章で学ぶこと\n・fork とは何か（if との対比）\n・fork / and / endfork の基本構文\n・fork と and での色指定\n・3本以上の並行パスの扱い\n・fork パス内でのレーン変更と if のネスト\n・ERP受発注処理の実例（メール・在庫・配送の並行）",
          content: (
            <>
              <hgroup>
                <h1>並行処理</h1>
                <p>
                  全パスが<strong>同時に実行される</strong>並行処理の構文を学ぶ章です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "Swimlane DSL" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li><code>fork</code> とは何か（<code>if</code> との対比）</li>
                <li><code>fork</code> / <code>and</code> / <code>endfork</code> の基本構文</li>
                <li><code>fork #color</code> と <code>and #color</code> での色指定</li>
                <li>3本以上の並行パスの扱いと幅への影響</li>
                <li><code>fork</code> パス内でのレーン変更と <code>if</code> のネスト</li>
                <li>ERP受発注処理の実例</li>
              </ul>
            </>
          ),
        },
        {
          title: "forkとは",
          plainText:
            "fork とは — 全パスが同時実行\nif は条件によってひとつのケースだけが実行される（排他）。fork はすべてのパスが同時に実行される（並行）。\n描画：fork = スプリットバー（━）、endfork = ジョインバー（━）。if のデシジョンダイヤモンド（◇）とは形が異なる。\n先生：「注文確定後にメール送信・在庫引き当て・配送指示を同時に実行する」という業務フローは fork で表現します。\nAくん：OSのマルチスレッド処理のように、複数の処理を並行して走らせるという概念と同じですね。\nBちゃん：「全員同時に走るマラソン」と「一人だけ走るリレー」の違いのイメージ。fork が前者、if が後者。",
          content: (
            <>
              <h2><code>fork</code> とは — 全パスが同時実行</h2>
              <p>
                <code>if</code> は条件によって<strong>ひとつのケースだけ</strong>が実行されます（排他）。
                <code>fork</code> は<strong>すべてのパスが同時に実行</strong>されます（並行）。
              </p>
              <Figure
                src="image/02-fork-concept.webp"
                alt="左側に if の排他分岐（デシジョンダイヤモンドから3本のうち1本だけ色付き矢印が出る）、右側に fork の並行処理（スプリットバーから3本すべてに色付き矢印が出る）を対比した概念図。"
                caption="if（排他 — 1本だけ） vs fork（並行 — 全本同時）の対比"
                kind="concept"
              />
              <Dialog speaker="teacher">
                「注文確定後にメール送信・在庫引き当て・配送指示を同時に実行する」という業務フローは <code>fork</code> で表現します。
              </Dialog>
              <Dialog speaker="a">
                OS のマルチスレッド処理のように、複数の処理を並行して走らせるという概念と同じですね。
              </Dialog>
              <Dialog speaker="b">
                「全員同時に走るマラソン」と「一人だけ走るリレー」の違いのイメージ。<code>fork</code> が前者、<code>if</code> が後者。
              </Dialog>
            </>
          ),
        },
        {
          title: "基本構文",
          plainText:
            "fork / and / endfork の基本構文\nfork で最初のパス開始、and で追加パス、endfork で全パスを合流（ジョインバー）。\n先生：fork の後に最初のパスのステップを書いて、and で次のパスに切り替える。endfork でスプリットバーとジョインバーが描画される。\nAくん：and は「かつ」という接続詞のイメージですね。「メール送信、かつ、在庫更新、かつ、ログ保存」。\nBちゃん：構文がシンプルで読みやすい。fork で始まって endfork で終わる、その間は and で区切る。",
          content: (
            <>
              <h2>基本構文</h2>
              <CodeBlock
                code={`/line/
[role01: 注文確定]
fork
  [role02: メール送信]
  [role02: 確認PDFアーカイブ]
and
  [role03: 在庫引き当て]
  [role03: 在庫更新]
and
  [role04: ログ保存]
endfork
[role01: 完了通知]`}
              />
              <MermaidDiagram
                chart={`flowchart TD
  A[注文確定] --> S["━ スプリットバー ━"]
  S --> P1[メール送信\n確認PDFアーカイブ]
  S --> P2[在庫引き当て\n在庫更新]
  S --> P3[ログ保存]
  P1 --> J["━ ジョインバー ━"]
  P2 --> J
  P3 --> J
  J --> Z[完了通知]`}
              />
              <Dialog speaker="teacher">
                <code>fork</code> の後に最初のパスのステップを書いて、<code>and</code> で次のパスに切り替える。<code>endfork</code> でスプリットバーとジョインバーが描画されます。
              </Dialog>
              <Dialog speaker="a">
                <code>and</code> は「かつ」という接続詞のイメージですね。「メール送信、かつ、在庫更新、かつ、ログ保存」。
              </Dialog>
              <Dialog speaker="b">
                構文がシンプルで読みやすい。<code>fork</code> で始まって <code>endfork</code> で終わる、その間は <code>and</code> で区切る。
              </Dialog>
            </>
          ),
        },
        {
          title: "forkの色指定",
          plainText:
            "fork と and の色指定\nfork #color で最初のパスの色を指定。and #color で各パスの色を個別に指定できる。\n先生：メール送信パスを #blue、在庫処理を #green、財務処理を #orange のように色分けすると、担当部門ごとに視覚的に区別しやすくなります。\nAくん：if の than #color と同じ発想で、各パスに意味的な色を割り当てる。\nBちゃん：パスごとに色が違うと、複数のパスが並ぶ広い図でも「今どのパスを見てるか」が分かりやすいです。",
          content: (
            <>
              <h2><code>fork #color</code> と <code>and #color</code></h2>
              <CodeBlock
                code={`/line/
[role01: 受注確定]
fork #blue
  // 顧客通知パス（青）
  [role02: 注文確認メール]
  [role02: SMS通知]
and #green
  // 在庫・配送パス（緑）
  [role03: 在庫引き当て]
  [role03: 配送依頼作成]
and #orange
  // 財務処理パス（橙）
  [role04: 請求書発行]
  [role04: 台帳更新]
and #gray
  // ログ・監査パス（グレー）
  [role05: 操作ログ記録]
endfork
[role01: 全処理完了]`}
              />
              <Figure
                src="image/02-fork-colored.webp"
                alt="スイムレーン図。スプリットバーから4本のパスが出て、青（通知）・緑（在庫）・橙（財務）・グレー（ログ）に色分けされている。各パスに複数ステップがあり、ジョインバーで合流する。"
                caption="パスごとに色を割り当てた fork の例 — 担当部門ごとの視覚的区別"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                メール送信パスを <code>#blue</code>、在庫処理を <code>#green</code>、財務処理を <code>#orange</code> のように色分けすると、担当部門ごとに視覚的に区別しやすくなります。
              </Dialog>
              <Dialog speaker="a">
                <code>if</code> の <code>than #color</code> と同じ発想で、各パスに意味的な色を割り当てる。統一した色ルールを決めておくといいですね。
              </Dialog>
              <Dialog speaker="b">
                パスごとに色が違うと、複数のパスが並ぶ広い図でも「今どのパスを見てるか」が分かりやすいです！
              </Dialog>
            </>
          ),
        },
        {
          title: "複数パス",
          plainText:
            "複数の並行パス（3本以上）\nand を増やすことで何本でも並行パスを追加できる。ただし本数が増えると図の幅が広がる。\n先生：パスが多いほど図が横に広がります。4本・5本になると印刷・表示が難しくなることがあるので、本当に全部並行か確認しましょう。\nAくん：表示幅の制約があるなら、本当に並行な処理だけを fork にして、そうでないものは別の構文に切り替えるべきですね。\nBちゃん：多すぎる場合は fork を分割して、「前半の並行処理 endfork → 後半の並行処理 fork → endfork」という構成もアリですか？",
          content: (
            <>
              <h2>複数の並行パス（3本以上）</h2>
              <CodeBlock
                code={`/line/
[role01: 月次決算確定]
fork #blue
  [role02: 売上集計レポート生成]
and #green
  [role03: 仕入高集計]
and #orange
  [role04: 経費精算チェック]
and #purple
  [role05: 固定資産評価]
and #gray
  [role06: 監査ログ出力]
endfork
[role01: 決算書ドラフト作成]`}
              />
              <InfoPanel title="パス数と図の幅" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>パス数</th>
                      <th>幅の目安</th>
                      <th>推奨アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>2〜3本</td><td>標準幅に収まる</td><td>問題なし</td></tr>
                    <tr><td>4〜5本</td><td>やや広くなる</td><td>本当に並行か確認</td></tr>
                    <tr><td>6本以上</td><td>非常に広い</td><td>分割を強く推奨</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                パスが多いほど図が横に広がります。4〜5本以上になると印刷・表示が難しくなることがあるので、本当に全部並行か確認しましょう。
              </Dialog>
              <Dialog speaker="a">
                表示幅の制約があるなら、本当に並行な処理だけを <code>fork</code> にして、そうでないものは別の構文に切り替えるべきですね。
              </Dialog>
              <Dialog speaker="b">
                多すぎる場合は <code>fork</code> を分割して、前半と後半に分けることはできますか？
              </Dialog>
              <Dialog speaker="teacher">
                できます。<code>endfork</code> の後に新しい <code>fork</code> を始めることで、時系列の並行グループを分割できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "fork内のステップ",
          plainText:
            "fork パス内のステップとレーン変更\nfork の各パス内もステップを複数書けて、ロール（レーン）を自由に変更できる。\n先生：並行処理でも「メール送信はrole02、その後の内容確認はrole01」のようにレーンをまたぐことが普通にあります。\nAくん：各パスが独立して動くので、パス内でのレーン変更は他のパスに影響しないんですね。\nBちゃん：「同時に走っているそれぞれのパス内で、担当者が変わる場合もある」というのは業務的に当然ですね。",
          content: (
            <>
              <h2><code>fork</code> パス内のステップとレーン変更</h2>
              <CodeBlock
                code={`/line/
[role01: 受注完了]
fork #blue
  // 通知パス：role02 → role01 → role02 とレーン移動
  [role02: 顧客メール下書き]
  [role01: 内容最終確認]
  [role02: メール送信実行]
and #green
  // 在庫パス：role03 → role04 と引き継ぎ
  [role03: 在庫システム更新]
  [role04: 配送センター通知]
  [role03: 配送番号払い出し]
and #orange
  // 財務パス：role05 のみ
  [role05: 売上仕訳入力]
  [role05: 請求書発行]
endfork
[role01: 後処理完了]`}
              />
              <Dialog speaker="teacher">
                並行処理でも「メール送信は role02、その後の内容確認は role01」のようにレーンをまたぐことが普通にあります。
              </Dialog>
              <Dialog speaker="a">
                各パスが独立して動くので、パス内でのレーン変更は他のパスに影響しないんですね。
              </Dialog>
              <Dialog speaker="b">
                「同時に走っているそれぞれのパス内で、担当者が変わる場合もある」というのは業務的に当然ですね。分かりやすいです。
              </Dialog>
              <Callout variant="tip">
                <code>fork</code> の各パスは完全に独立したサブフローとして扱われます。パス内でのロール変更、ステップ数の違い、すべて自由です。
              </Callout>
            </>
          ),
        },
        {
          title: "fork内のif",
          plainText:
            "fork パス内に if をネスト\nfork の各パス内に if を入れることが完全に有効。「並行処理の中に条件分岐」という実業務でよく出るパターン。\n先生：「メール送信パスの中で、メール設定がある場合は本文送信、ない場合はSMS送信」というパターンです。\nAくん：fork の中に if は合法で、if の中に fork も合法。ただし必ず対応するキーワードで閉じる必要がある。\nBちゃん：現実の業務フローを考えると、並行処理の中にも条件分岐があるのは当然ですね。これが表現できると本格的な図が書けます。",
          content: (
            <>
              <h2><code>fork</code> パス内に <code>if</code> をネスト</h2>
              <CodeBlock
                code={`/line/
[role01: 出荷確定]
fork #blue
  // 通知パス：設定によってメールかSMSかを切り替え
  if (通知設定) is (メール) than
    [role02: 確認メール送信]
  elseif (SMS) than
    [role02: SMS送信]
  else
    [role02: アプリ通知]
  endif
and #green
  // 在庫パス：残数によって発注トリガー
  [role03: 在庫デクリメント]
  if (在庫残数) is (閾値以下) than #orange
    [role03: 自動発注リクエスト]
    [role04: 発注承認依頼]
  else
    // 問題なし — 何もしない
  endif
and #orange
  [role05: 出荷実績記録]
  [role06: 物流会社API連携]
endfork
[role01: 完了サマリ出力]`}
              />
              <Figure
                src="image/02-fork-with-if.webp"
                alt="スイムレーン図。スプリットバーから3本のパスが出て、青パスと緑パスの内部にそれぞれデシジョンダイヤモンドがある。各パス内でさらに分岐が起きて、全パスがジョインバーで合流する。"
                caption="fork パス内に if をネストした構造 — 並行処理の中の条件分岐"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                「メール送信パスの中で、設定がある場合は本文送信、ない場合はSMS送信」というパターンです。<code>fork</code> 内の <code>if</code> は完全に有効です。
              </Dialog>
              <Dialog speaker="a">
                <code>fork</code> の中に <code>if</code> は合法で、<code>if</code> の中に <code>fork</code> も合法。ただし必ず対応するキーワードで閉じる必要がある。
              </Dialog>
              <Dialog speaker="b">
                現実の業務フローを考えると、並行処理の中にも条件分岐があるのは当然ですね。これが表現できると本格的な図が書けます！
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：並行処理の典型例",
          plainText:
            "並行処理の典型例 — ERP受発注フロー\nメール・在庫・配送・財務の4パスが並行して走る受発注完了後の処理フロー。\n先生：ERP の受発注処理はこのパターンが多い。注文確定と同時に、複数の部門が並行して後処理を進める。\nAくん：これが fork なしで直線に書かれていたら、ひとつひとつ順番に実行しているように見えてしまって意味が変わりますね。\nBちゃん：同時に走ることが図で見えるのが fork の価値ですね。チームの誰が何を担当するかも一覧できる。",
          content: (
            <>
              <h2>並行処理の典型例 — ERP 受発注フロー</h2>
              <CodeBlock
                code={`/line/
// 受発注完了後の並行後処理
[role01: 注文確定]
fork #blue
  // 顧客通知（役割：カスタマーサービス）
  [role02: 注文確認メール送信]
  [role02: 追跡番号発行]
and #green
  // 在庫・倉庫処理（役割：倉庫担当）
  [role03: 在庫引き当て]
  [role03: ピッキング指示書発行]
  [role03: 配送ラベル印刷]
and #orange
  // 財務処理（役割：経理担当）
  [role04: 売上仕訳登録]
  [role04: 請求書発行]
  [role04: 消費税計算]
and #gray
  // 監査・ログ（役割：システム）
  [role05: 操作ログ記録]
  [role05: 監査証跡保存]
endfork
[role01: 全完了確認]
[role01: ダッシュボード更新]`}
              />
              <MermaidDiagram
                chart={`flowchart TD
  A[注文確定] --> S["━ スプリット ━"]
  S --> B["🔵 顧客通知\nメール送信\n追跡番号発行"]
  S --> C["🟢 在庫・倉庫\n在庫引き当て\nピッキング指示"]
  S --> D["🟠 財務処理\n売上仕訳\n請求書発行"]
  S --> E["⬜ 監査・ログ\nログ記録\n監査証跡"]
  B --> J["━ ジョイン ━"]
  C --> J
  D --> J
  E --> J
  J --> Z[全完了確認]`}
              />
              <Callout variant="tip">
                <strong>fork の典型パターン</strong>：注文確定・取引完了・月次締めなど「１つのイベントが複数部門を同時に動かす」場面で <code>fork</code> を使います。
              </Callout>
              <Dialog speaker="teacher">
                ERP の受発注処理はこのパターンが多い。注文確定と同時に、複数の部門が並行して後処理を進めます。
              </Dialog>
              <Dialog speaker="a">
                これが <code>fork</code> なしで直線に書かれていたら、ひとつひとつ順番に実行しているように見えてしまって意味が変わりますね。
              </Dialog>
              <Dialog speaker="b">
                同時に走ることが図で見えるのが <code>fork</code> の価値ですね。チームの誰が何を担当するかも一覧できる。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章では fork の完全な構文を学びました。fork で最初のパス、and で追加パス、endfork で全合流。色は fork #color と and #color で指定。パス内のレーン変更も自由、if のネストも可能です。\nAくん：fork と if の最大の違いは「全部実行 vs 一つだけ実行」。これを常に意識するだけで使い間違えが防げますね。\nBちゃん：パスが多くなりすぎると図が広くなるという制約も覚えておきます。4本以上になったら本当に必要か確認する。\n先生：その通りです。次章では section と branch を学びます。どちらも fork/if とは全く別の役割を持っています。\nAくん：section が「視覚グループのみ」、branch が「合流ありの側道」でしたね。if や fork との組み合わせも考えながら学べるのが楽しみです。\nBちゃん：この章の内容はかなり頭に入ってきました！確認テストで腕試しします。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章では <code>fork</code> の完全な構文を学びました。<code>fork</code> で最初のパス、<code>and</code> で追加パス、<code>endfork</code> で全合流。色は <code>fork #color</code> と <code>and #color</code> で指定。パス内のレーン変更も自由、<code>if</code> のネストも可能です。
              </Dialog>
              <Dialog speaker="a">
                <code>fork</code> と <code>if</code> の最大の違いは「全部実行 vs 一つだけ実行」。これを常に意識するだけで使い間違えが防げますね。
              </Dialog>
              <Dialog speaker="b">
                パスが多くなりすぎると図が広くなるという制約も覚えておきます。4本以上になったら本当に必要か確認する。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。次章では <code>section</code> と <code>branch</code> を学びます。どちらも <code>fork</code>/<code>if</code> とは全く別の役割を持っています。
              </Dialog>
              <Dialog speaker="a">
                <code>section</code> が「視覚グループのみ」、<code>branch</code> が「合流ありの側道」でしたね。<code>if</code> や <code>fork</code> との組み合わせも考えながら学べるのが楽しみです。
              </Dialog>
              <Dialog speaker="b">
                この章の内容はかなり頭に入ってきました！確認テストで腕試しします。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 fork と if の最大の違いは？→ fork は全パスが同時実行、if はひとつのケースだけが実行される\nQ2 fork のパス内で if をネストすることは？→ 完全に有効。fork パス内に if を入れて、そのケース内でさらに処理を分岐できる\n今日のひとこと：fork は「全員同時スタート」。if との違いを常に意識して使い分けましょう。",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={0}
                explanation="fork は全パスが同時に（並行して）実行されます。if は条件を評価して一致するひとつのケースだけが実行されます。形状もforkはスプリット/ジョインバー（━）、ifはデシジョン/マージダイヤモンド（◇）と異なります。"
                question={<strong><code>fork</code> と <code>if</code> の最大の違いとして正しいのは？</strong>}
                options={[
                  "fork は全パスが同時実行、if はひとつのケースだけが実行される",
                  "fork は色指定できるが、if はできない",
                  "fork は if の中でしか使えない",
                ]}
              />
              <Quiz
                answer={1}
                explanation="fork のパス内に if をネストすることは完全に有効です。ネストの規則（インターリーブ禁止）を守る限り、fork パス内に if を入れて条件分岐することができます。逆に if のケース内に fork を入れることも有効です。"
                question={<strong><code>fork</code> のパス内で <code>if</code> をネストすることについて正しいのは？</strong>}
                options={[
                  "エラーになる — fork パス内に if は書けない",
                  "完全に有効 — fork パス内に if を入れて条件分岐できる",
                  "有効だが、色指定はできなくなる",
                ]}
              />
              <Dialog speaker="closing">
                <code>fork</code> は「全員同時スタート」。<code>if</code> との違いを常に意識して使い分けましょう。次章では <code>section</code>（枠）と <code>branch</code>（支線）という、フロー構造を補完する2つの構文を学びます！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ForkParallelLesson);
