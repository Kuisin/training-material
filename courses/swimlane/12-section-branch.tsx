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
  title: "第3章 — 枠（section）と支線（branch）",
  meta: "中級 · 20分",
};

export default function SectionBranchLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "12-section-branch", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第3章 — 枠（section）と支線（branch）\nフローに影響を与えない視覚グループ（section）と、合流ありの側道経路（branch）を学ぶ章です。\n⏱ 20分 / 📶 中級 / 🏷 Swimlane DSL\nこの章で学ぶこと\n・section とは何か（視覚グループ — フロー不変）\n・section の構文と name/color オプション\n・section の活用例（監査ブロック・通知群など）\n・branch とは何か（側道経路 — 合流あり）\n・branch の構文と合流の仕組み\n・branch の合流先のルール\n・section vs branch の違いと使い分け",
          content: (
            <>
              <hgroup>
                <h1>枠と支線</h1>
                <p>
                  フローに影響を与えない<strong>視覚グループ（section）</strong>と、合流ありの<strong>側道経路（branch）</strong>を学ぶ章です。
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
                <li><code>section</code> とは何か（視覚グループ — フロー不変）</li>
                <li><code>section</code> の構文と name/color オプション</li>
                <li><code>section</code> の活用例（監査ブロック・通知群など）</li>
                <li><code>branch</code> とは何か（側道経路 — 合流あり）</li>
                <li><code>branch</code> の構文と合流の仕組み</li>
                <li><code>branch</code> の合流先のルール</li>
                <li><code>section</code> vs <code>branch</code> の違いと使い分け</li>
              </ul>
            </>
          ),
        },
        {
          title: "sectionとは",
          plainText:
            "section とは — 視覚グループ（フロー不変）\nsection はフローの実行順序を変えない。ステップを点線ボックスで囲む視覚的なグループ化のみ。\n先生：section を付けても付けなくても、フローの実行は同じです。ただし「この3ステップは監査要件に紐づく」という意図を図上で明示できます。\nAくん：コードのコメントブロックのように、「ここは関連するステップのかたまり」という注釈的な役割ですね。\nBちゃん：図を見る人のための注釈であって、実行には影響しない。それが section の核心。",
          content: (
            <>
              <h2><code>section</code> とは — 視覚グループ（フロー不変）</h2>
              <p>
                <code>section</code> はフローの実行順序を<strong>変えません</strong>。ステップを<strong>点線ボックスで囲む</strong>視覚的なグループ化のみを行います。
              </p>
              <Figure
                src="image/03-section-concept.webp"
                alt="スイムレーン図。メインフローが直線的に流れ、3ステップが点線の青いボックス（section）で囲まれている。ボックスの前後でフローが変わっていないことを示す矢印の流れが見える。"
                caption="section は点線ボックスで囲むだけ — フローの流れは変わらない"
                kind="diagram"
              />
              <CodeBlock
                code={`/line/
[role01: 注文確定]
section (監査ブロック) #blue
  [role02: 監査ログ保存]
  [role03: 分析キュー送信]
  [role02: コンプライアンス記録]
end-section
[role01: 確認画面表示]`}
              />
              <Dialog speaker="teacher">
                <code>section</code> を付けても付けなくても、フローの実行は同じです。ただし「この3ステップは監査要件に紐づく」という意図を図上で明示できます。
              </Dialog>
              <Dialog speaker="a">
                コードのコメントブロックのように、「ここは関連するステップのかたまり」という注釈的な役割ですね。
              </Dialog>
              <Dialog speaker="b">
                図を見る人のための注釈であって、実行には影響しない。それが <code>section</code> の核心。
              </Dialog>
            </>
          ),
        },
        {
          title: "section の構文",
          plainText:
            "section の構文オプション\nsection (名前) #color … end-section。名前も色も省略可能。\n省略例：section のみ（名前なし色なし）。section #blue（名前なし色あり）。\n先生：名前を書くと点線ボックスのヘッダーに表示されます。省略するとデフォルト「Section」になります。色も省略するとテーマデフォルト。\nAくん：名前を業務的な用語にしておくと、図を見た非技術者にも何の目的のステップかが伝わりやすいですね。\nBちゃん：使い方が柔軟で、「とりあえず枠を付けたい」なら section だけでもいいし、名前と色を付ければ意味が明確になる。",
          content: (
            <>
              <h2><code>section</code> の構文オプション</h2>
              <CodeBlock
                code={`// パターン1：名前あり・色あり
section (コンプライアンス処理) #blue
  [role02: 規制チェック]
  [role03: 記録保存]
end-section

// パターン2：名前なし・色あり
section #orange
  [role01: 緊急アラート送信]
  [role02: エスカレーション通知]
end-section

// パターン3：名前あり・色なし
section (通知ステップ群)
  [role02: メール送信]
  [role02: SMS送信]
end-section

// パターン4：最小構成（名前なし・色なし）
section
  [role01: 後処理]
end-section`}
              />
              <Dialog speaker="teacher">
                名前を書くと点線ボックスのヘッダーに表示されます。省略するとデフォルト「Section」になります。色も省略するとテーマデフォルト色です。
              </Dialog>
              <Dialog speaker="a">
                名前を業務的な用語にしておくと、図を見た非技術者にも何の目的のステップかが伝わりやすいですね。
              </Dialog>
              <Dialog speaker="b">
                使い方が柔軟で、「とりあえず枠を付けたい」なら <code>section</code> だけでもいいし、名前と色を付ければ意味が明確になる。
              </Dialog>
              <Callout variant="tip">
                名前は短く、目的が伝わる業務用語を使いましょう。例：「監査ブロック」「通知処理」「コンプライアンス対応」など。
              </Callout>
            </>
          ),
        },
        {
          title: "section の活用例",
          plainText:
            "section の活用例\n監査ブロック・通知ステップ群・コンプライアンス処理などをまとめる。if や fork の内部でも使用可能。\n先生：特に「このステップ群は監査要件に対応しています」というドキュメント性を図に持たせたい場合に section が有効です。\nAくん：fork のパス内に section を入れて、「この並行パスの中の特定ステップ群は規制対応」というマーキングができるんですね。\nBちゃん：仕様書や説明会で図を見せる場面で、section の枠があると「ここを特に見てください」という誘導にもなりますね。",
          content: (
            <>
              <h2><code>section</code> の活用例</h2>
              <CodeBlock
                code={`/line/
[role01: 取引承認]

// if のケース内に section
if (取引種別) is (海外送金) than #blue
  section (外為規制チェック) #orange
    [role02: KYC確認]
    [role02: OFAC照合]
    [role02: 取引報告提出]
  end-section
  [role01: 海外送金実行]
elseif (国内振込) than
  [role01: 国内振込実行]
endif

// fork のパス内に section
fork
  section (財務監査ログ) #gray
    [role04: 仕訳記録]
    [role04: 監査証跡保存]
  end-section
and
  [role03: 顧客通知]
endfork

[role01: 完了]`}
              />
              <Dialog speaker="teacher">
                特に「このステップ群は監査要件に対応しています」というドキュメント性を図に持たせたい場合に <code>section</code> が有効です。
              </Dialog>
              <Dialog speaker="a">
                <code>fork</code> のパス内に <code>section</code> を入れて、「この並行パスの中の特定ステップ群は規制対応」というマーキングができるんですね。
              </Dialog>
              <Dialog speaker="b">
                仕様書や説明会で図を見せる場面で、<code>section</code> の枠があると「ここを特に見てください」という誘導にもなりますね！
              </Dialog>
            </>
          ),
        },
        {
          title: "branchとは",
          plainText:
            "branch とは — 側道経路（合流あり）\nbranch はメインフローから分岐する側道。先頭ステップに入力矢印がない（side path であることを示す）。最後のステップが end-branch の直後のブロックに合流する。\nbranch はフローを実際に変える（section とは異なる）。\n先生：注文確定後に「配送支線」を走らせて、その処理が終わったら次のメインステップに合流する、という表現です。\nAくん：branch の先頭ステップに入矢がないことで「ここはメインの流れの直接の続きではなく、側道から出てきた」と視覚的に示せるんですね。\nBちゃん：高速道路の側道のイメージ。本線とは別に走って、また合流する。",
          content: (
            <>
              <h2><code>branch</code> とは — 側道経路（合流あり）</h2>
              <p>
                <code>branch</code> はメインフローから分岐する<strong>側道経路</strong>です。
              </p>
              <ul>
                <li>先頭ステップに<strong>入力矢印がない</strong>（side path であることを示す）</li>
                <li>最後のステップが <code>end-branch</code> の<strong>直後のブロックに合流</strong>する</li>
                <li><code>section</code> とは異なり、フローの構造を<strong>実際に変える</strong></li>
              </ul>
              <Figure
                src="image/03-branch-concept.webp"
                alt="スイムレーン図。メインフローが上から下に流れる中、branch ブロックが側道として描かれ、先頭ステップには入力矢印がなく（支線入口）、末尾ステップがend-branch直後のメインステップに矢印で合流している。"
                caption="branch の構造 — 先頭は入矢なし、末尾は end-branch 直後に合流"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                注文確定後に「配送支線」を走らせて、その処理が終わったら次のメインステップに合流する、という表現です。
              </Dialog>
              <Dialog speaker="a">
                <code>branch</code> の先頭ステップに入矢がないことで「ここはメインの流れの直接の続きではなく、側道から出てきた」と視覚的に示せるんですね。
              </Dialog>
              <Dialog speaker="b">
                高速道路の側道のイメージ。本線とは別に走って、また合流する。分かりやすい！
              </Dialog>
            </>
          ),
        },
        {
          title: "branch の構文",
          plainText:
            "branch の構文\nbranch (名前) #color … end-branch。名前と色はオプション。\n先頭ステップには入力矢印が付かない（branch の仕様）。末尾ステップから end-branch 直後のブロックへの合流矢印が自動で付く。\n先生：branch の名前はメインフローのどのステップに関連する側道かが分かる名前を付けると読みやすくなります。\nAくん：end-branch の直後が if や fork の場合は、そのゲートウェイ（デシジョン◇またはスプリットバー）に合流するんですよね。\nBちゃん：名前と色も省略できるということは、最小構成は branch / end-branch だけでいいということですね。",
          content: (
            <>
              <h2><code>branch</code> の構文</h2>
              <CodeBlock
                code={`/line/
[role01: 注文確定]

branch (配送支線) #green
  [role02: ピッキング記録]
  [role03: 追跡ID発行]
  [role02: 追跡ID通知]
end-branch

// end-branch の直後のステップが合流先
[role01: 確認画面表示]
[role01: 完了通知]`}
              />
              <CodeBlock
                code={`// end-branch の直後が if の場合：if のデシジョン◇に合流
[role01: 発注確定]

branch (倉庫連携支線)
  [role03: 倉庫システム更新]
  [role03: ロケーション記録]
end-branch

if (在庫通知) is (必要) than  // ← branch がここに合流
  [role02: 在庫アラート送信]
else
  [role01: 通知スキップ]
endif`}
              />
              <Dialog speaker="teacher">
                <code>branch</code> の名前はメインフローのどの段階に関連する側道かが分かる名前を付けると読みやすくなります。
              </Dialog>
              <Dialog speaker="a">
                <code>end-branch</code> の直後が <code>if</code> や <code>fork</code> の場合は、そのゲートウェイに合流するんですよね。
              </Dialog>
              <Dialog speaker="b">
                名前と色も省略できるということは、最小構成は <code>branch</code> / <code>end-branch</code> だけでいいということですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "branch の合流先",
          plainText:
            "branch の合流先のルール\n基本：end-branch 直後のステップに合流。\n特殊ケース1：end-branch 直後が if → if のデシジョンダイヤモンドに合流。\n特殊ケース2：end-branch 直後が fork → fork のスプリットバーに合流。\n特殊ケース3：フローの先頭が branch → フロー開始ターミナルに付く。\n特殊ケース4：フローの末尾が branch → フロー終了ターミナルに付く。\n先生：branch の合流先は「end-branch の直後に何があるか」で決まります。ゲートウェイ（if/fork）が続く場合はそのゲートウェイが合流点になります。\nAくん：これは直感的にも正しい。「side path が終わったら、次に来るものに入る」というシンプルなルール。\nBちゃん：フローの最初か最後に branch がある場合の特殊ルールは、頭の片隅に置いておく必要がありますね。",
          content: (
            <>
              <h2><code>branch</code> の合流先のルール</h2>
              <InfoPanel title="branch の合流先パターン" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>end-branch の直後</th>
                      <th>合流先</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>通常のステップ</td><td>そのステップ（入矢として合流）</td></tr>
                    <tr><td><code>if</code> ブロック</td><td><code>if</code> のデシジョンダイヤモンド</td></tr>
                    <tr><td><code>fork</code> ブロック</td><td><code>fork</code> のスプリットバー</td></tr>
                    <tr><td>フロー末尾（何もない）</td><td>終了ターミナルに付く</td></tr>
                    <tr><td>フロー先頭（branch が最初）</td><td>開始ターミナルに付く</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <CodeBlock
                code={`// end-branch 直後が fork の例
[role01: 承認完了]

branch (コンプライアンス支線) #gray
  [role04: 規制当局への報告]
  [role04: 内部監査記録]
end-branch

fork #blue              // ← branch がここのスプリットバーに合流
  [role02: 顧客通知]
and #green
  [role03: 台帳更新]
endfork`}
              />
              <Dialog speaker="teacher">
                <code>branch</code> の合流先は「<code>end-branch</code> の直後に何があるか」で決まります。ゲートウェイ（<code>if</code>/<code>fork</code>）が続く場合はそのゲートウェイが合流点になります。
              </Dialog>
              <Dialog speaker="a">
                直感的にも正しい。「side path が終わったら、次に来るものに入る」というシンプルなルール。
              </Dialog>
              <Dialog speaker="b">
                フローの最初か最後に <code>branch</code> がある場合の特殊ルールは、頭の片隅に置いておく必要がありますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "section vs branch 比較",
          plainText:
            "section と branch の比較\nsection: フロー変更なし。点線ボックス。ステップを囲む視覚グループ。コメント的役割。\nbranch: フロー変更あり。側道経路。先頭入矢なし・末尾合流あり。経路の構造を変える。\n先生：迷ったら「フローを変えたいか？」と自問してください。変えたいなら branch、見た目だけなら section です。\nAくん：「監査ステップをまとめて見せたい → section」「配送処理を側道として扱いたい → branch」というのが実践的な基準ですね。\nBちゃん：最初は混同しやすいけど、「section は見た目・branch は構造」というキーワードで覚えます！",
          content: (
            <>
              <h2><code>section</code> vs <code>branch</code> 比較</h2>
              <InfoPanel title="section と branch の主な違い" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th><code>section</code></th>
                      <th><code>branch</code></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>フローへの影響</td><td>なし（実行順序不変）</td><td>あり（側道経路を追加）</td></tr>
                    <tr><td>描画形状</td><td>点線ボックス（囲む）</td><td>先頭入矢なし → 末尾合流</td></tr>
                    <tr><td>合流の有無</td><td>なし</td><td>あり（end-branch 直後）</td></tr>
                    <tr><td>主な役割</td><td>視覚的グループ化（注釈）</td><td>経路の構造的追加</td></tr>
                    <tr><td>主な用途</td><td>監査ブロック・通知群の可視化</td><td>配送処理・補助業務の側道</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Figure
                src="image/03-section-vs-branch.webp"
                alt="左側に section（点線ボックスがステップを囲み、フローが直線のまま続く）、右側に branch（側道経路が分岐して入矢なし先頭から始まり、end-branch で合流する）を並べた比較図。"
                caption="section（視覚グループ）vs branch（側道経路）の並列比較"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                迷ったら「フローを変えたいか？」と自問してください。変えたいなら <code>branch</code>、見た目だけなら <code>section</code> です。
              </Dialog>
              <Dialog speaker="a">
                「監査ステップをまとめて見せたい → <code>section</code>」「配送処理を側道として扱いたい → <code>branch</code>」というのが実践的な基準ですね。
              </Dialog>
              <Dialog speaker="b">
                最初は混同しやすいけど、「<code>section</code> は見た目・<code>branch</code> は構造」というキーワードで覚えます！
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：複合構成例",
          plainText:
            "複合構成例 — section と branch を同時に使う\nsection で監査ブロックをまとめ、branch で配送支線を追加した受発注処理フロー。\n先生：実際の業務フローでは section と branch が同時に出てくることもよくあります。section が「見た目」、branch が「構造」という役割分担を意識しながら読んでください。\nAくん：フローを読む人にとっても「点線枠の中は関連するステップのかたまり」「入矢なしで始まるのは側道」という視覚ルールが分かれば読みやすいですね。\nBちゃん：この複合例を見ると、DSLで書けるフローの表現力の高さが実感できます。",
          content: (
            <>
              <h2>複合構成例 — <code>section</code> と <code>branch</code> の共存</h2>
              <CodeBlock
                code={`/line/
[role01: 受注データ受信]
[role01: データ検証]

// section：監査ブロック（フロー不変）
section (コンプライアンス監査) #gray
  [role04: 受注監査ログ保存]
  [role04: 規制チェック実行]
  [role04: 監査証跡記録]
end-section

[role01: 在庫確認]

// branch：配送支線（側道・合流あり）
branch (配送業者連携)
  [role03: 配送予約作成]
  [role03: 追跡番号発行]
  [role03: 追跡URL生成]
end-branch

// branch の合流先（このステップに合流）
[role01: 出荷確定]

fork #blue
  [role02: 出荷確認メール送信]
and #green
  section (財務処理) #orange
    [role05: 請求書発行]
    [role05: 売上仕訳登録]
  end-section
and #gray
  [role04: 完了監査ログ]
endfork

[role01: 処理完了]`}
              />
              <MermaidDiagram
                chart={`flowchart TD
  A[受注データ受信] --> B[データ検証]
  subgraph SEC["--- section: コンプライアンス監査 ---"]
    B --> C[受注監査ログ保存]
    C --> D[規制チェック]
    D --> E[監査証跡記録]
  end
  E --> F[在庫確認]
  F --> G[出荷確定]
  H["branch: 配送業者連携 (入矢なし)"]
  H --> I[配送予約]
  I --> J[追跡番号発行]
  J --> G
  G --> SP["━ スプリット ━"]
  SP --> K[メール送信]
  SP --> L[請求書発行]
  SP --> M[監査ログ]
  K --> JN["━ ジョイン ━"]
  L --> JN
  M --> JN
  JN --> Z[処理完了]`}
              />
              <Dialog speaker="teacher">
                実際の業務フローでは <code>section</code> と <code>branch</code> が同時に出てくることもよくあります。「点線枠は関連するかたまり」「入矢なしで始まるのは側道」という視覚ルールを意識して読んでください。
              </Dialog>
              <Dialog speaker="a">
                フローを読む人にとっても、この視覚ルールが分かれば読みやすいですね。設計意図が図から読み取れる。
              </Dialog>
              <Dialog speaker="b">
                この複合例を見ると、DSL で書けるフローの表現力の高さが実感できます！
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章では section と branch を学びました。section は点線ボックスの視覚グループで、フローの実行を変えません。branch は側道経路で、先頭が入矢なし・末尾が end-branch 直後に合流します。\nAくん：「section は見た目・branch は構造」というキーワードで整理できます。使い分けの基準は「フローを変えたいか」ですね。\nBちゃん：section の名前と色のオプションも使いこなせると、図のドキュメント性が上がりますね。\n先生：次章では merge（途中合流）と応用パターンを学びます。merge は if のケース内で使う前方ジャンプで、今まで学んだ全構文を組み合わせる複合フローも扱います。\nAくん：merge は「早期脱出」のような機能ですね。キャンセルパスで使われるイメージ。\nBちゃん：全部を組み合わせた複雑なフロー例が楽しみです！確認テストをクリアして次章に進みます。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章では <code>section</code> と <code>branch</code> を学びました。<code>section</code> は点線ボックスの視覚グループで、フローの実行を変えません。<code>branch</code> は側道経路で、先頭が入矢なし・末尾が <code>end-branch</code> 直後に合流します。
              </Dialog>
              <Dialog speaker="a">
                「<code>section</code> は見た目・<code>branch</code> は構造」というキーワードで整理できます。使い分けの基準は「フローを変えたいか？」ですね。
              </Dialog>
              <Dialog speaker="b">
                <code>section</code> の名前と色のオプションも使いこなせると、図のドキュメント性が上がりますね。
              </Dialog>
              <Dialog speaker="teacher">
                次章では <code>merge</code>（途中合流）と応用パターンを学びます。<code>merge</code> は <code>if</code> のケース内で使う前方ジャンプで、今まで学んだ全構文を組み合わせる複合フローも扱います。
              </Dialog>
              <Dialog speaker="a">
                <code>merge</code> は「早期脱出」のような機能ですね。キャンセルパスで使われるイメージ。
              </Dialog>
              <Dialog speaker="b">
                全部を組み合わせた複雑なフロー例が楽しみです！確認テストをクリアして次章に進みます。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 section がフローに与える影響は？→ フローの実行順序を変えない。ステップを点線ボックスで囲む視覚グループのみ\nQ2 branch の合流先として正しいのは？→ end-branch の直後のステップ（直後が if/fork の場合はそのゲートウェイ）\n今日のひとこと：section は見た目、branch は構造。この違いを忘れずに！",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={1}
                explanation="section はフローの実行順序を変えません。ステップを点線ボックスで囲むだけの視覚グループです。section を付けても付けなくても、ステップの実行順序はまったく同じです。これが branch との最大の違いです。"
                question={<strong><code>section</code> がフローに与える影響として正しいのは？</strong>}
                options={[
                  "ステップを並行して実行させる（fork と同じ）",
                  "フローの実行順序を変えない。ステップを点線ボックスで囲む視覚グループのみ",
                  "ステップを一つのケースとして分岐させる（if と同じ）",
                ]}
              />
              <Quiz
                answer={2}
                explanation="branch の合流先は end-branch の直後に書かれたブロックです。通常はそのステップに合流しますが、直後が if の場合はデシジョンダイヤモンドに、直後が fork の場合はスプリットバーに合流します。フロー末尾に branch がある場合は終了ターミナルに付きます。"
                question={<strong><code>branch</code> の合流先として正しいのは？</strong>}
                options={[
                  "branch ブロックの先頭ステップ（ループバック）",
                  "フロー全体の最初のステップ",
                  "end-branch の直後のステップ（直後が if/fork の場合はそのゲートウェイ）",
                ]}
              />
              <Dialog speaker="closing">
                <code>section</code> は見た目、<code>branch</code> は構造。この違いを忘れずに！次章では <code>merge</code> による途中合流と、全構文を組み合わせた複合フロー例を学びます！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SectionBranchLesson);
