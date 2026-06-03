import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Figure,
  Quiz,
  LessonMeta,
  InfoPanel,
  CodeBlock,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第4章 — 設定・テーマ・エクスポート",
  meta: "初学者 · 15分",
};

export default function SettingsExportLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "04-settings-export", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第4章 — 設定・テーマ・エクスポート\nKai Swimlane GUIエディタの仕上げとして、設定ダイアログ・表示オプション・テーマ切り替え・エクスポート・Templatesパネルを学びます。\n⏱ 15分 / 📶 初学者 / 🏷 Kai Swimlane GUI\nこの章で学ぶこと\n・設定ダイアログ（/page/ — description・header・footer）\n・表示オプション（/option/ — ガター・ヘッダー・フッターの表示制御）\n・左右カラムの見出し（left-title/subtitle・right-title/subtitle）\n・テーマ切り替え（basic/washi/ink/mono）\n・エクスポート（SVG・PNG・.txt）\n・Templatesパネルの使い方",
          content: (
            <>
              <hgroup>
                <h1>第4章 — 設定・テーマ・エクスポート</h1>
                <p>
                  図の仕上げとして、<strong>ページ設定・表示オプション・テーマ・エクスポート</strong>の使い方を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane GUI" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>設定ダイアログ（/page/ — description・header・footer）</li>
                <li>表示オプション（/option/ — ガター・ヘッダー等の表示制御）</li>
                <li>左右カラムの見出し設定</li>
                <li>テーマ切り替え（basic/washi/ink/mono）</li>
                <li>エクスポート（SVG・PNG・.txt）とTemplatesパネル</li>
              </ul>
            </>
          ),
        },
        {
          title: "設定ダイアログ（/page/ 編集）",
          plainText:
            "設定ダイアログ：/page/ の編集\nGUIエディタのタイトル横にある設定ボタン（歯車アイコン）をクリックすると、/page/ 設定ダイアログが開きます。\n設定できる項目：\n・description（図の説明文。図の上部に表示）\n・header-left / header-center / header-right（ヘッダーの左・中・右テキスト）\n・footer-left / footer-center / footer-right（フッターの左・中・右テキスト）\n先生：ヘッダーには「文書名・バージョン・作成日」、フッターには「部署名・承認者」などを入れるのが典型的な使い方です。\nAくん：descriptionに図全体の背景や目的を書けば、図を単体で配布しても分かりやすい資料になりますね。",
          content: (
            <>
              <h2>設定ダイアログ — /page/ の編集</h2>
              <Figure
                src="image/04-settings-dialog.webp"
                alt="Kai Swimlane GUIエディタの設定ダイアログのスクリーンショット模式図。タイトル横の歯車アイコンがクリックされており、中央にポップアップが開いている。ポップアップ内にdescription（テキストエリア）、header-left/center/right（3つの入力欄が横に並ぶ）、footer-left/center/right（同様の3欄）が表示されている。各欄にサンプルテキストが入力されている。"
                caption="タイトル横の設定ボタン → /page/ 設定ダイアログが開く"
                kind="diagram"
              />
              <p>設定できる <strong>/page/</strong> の項目：</p>
              <CodeBlock language="text">{`/page/
  description: この図は受注から出荷までの業務フローを示します。
  header-left: 業務フロー仕様書
  header-center: 受注〜出荷フロー
  header-right: Ver.1.2 / 2025-06-01
  footer-left: 営業部・物流部
  footer-center: 作成：山田
  footer-right: 承認：鈴木`}</CodeBlock>
              <Dialog speaker="teacher">
                ヘッダーには「文書名・バージョン・作成日」、フッターには「部署名・承認者」などを入れるのが典型的な使い方です。
              </Dialog>
              <Dialog speaker="a">
                descriptionに図全体の背景や目的を書けば、図を単体で配布しても分かりやすい資料になりますね。
              </Dialog>
              <Dialog speaker="b">
                ヘッダー・フッターを左・中・右の3欄に分けて指定できるのは、正式な業務文書のフォーマットに合わせやすくて便利です。
              </Dialog>
            </>
          ),
        },
        {
          title: "表示オプション（/option/ 編集）",
          plainText:
            "表示オプション：/option/ の編集\n設定ダイアログからは/option/（表示制御オプション）も編集できます。\n主なオプション：\nshow-left-gutter: true/false（左ガター列の表示）\nshow-right-gutter: true/false（右ガター列の表示）\nshow-header: true/false（ヘッダーの表示）\nshow-footer: true/false（フッターの表示）\nshow-description: true/false（descriptionテキストの表示）\nshow-step-block-captions: true/false（ステップのブロックラベル表示）\nmerge-at-previous-block: true/false（直前のブロックにmergeする挙動）\n先生：プレゼン用には不要な情報を非表示にしてスッキリさせるのがコツです。show-left-gutter: falseとshow-right-gutter: falseを組み合わせると図だけが残ります。",
          content: (
            <>
              <h2>表示オプション — /option/ の編集</h2>
              <InfoPanel title="/option/ の主なキー一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>オプションキー</th>
                      <th>デフォルト</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>show-left-gutter</code></td>
                      <td>true</td>
                      <td>左ガター列（label/desc）の表示</td>
                    </tr>
                    <tr>
                      <td><code>show-right-gutter</code></td>
                      <td>true</td>
                      <td>右ガター列（remark）の表示</td>
                    </tr>
                    <tr>
                      <td><code>show-header</code></td>
                      <td>true</td>
                      <td>ヘッダー（header-left/center/right）の表示</td>
                    </tr>
                    <tr>
                      <td><code>show-footer</code></td>
                      <td>true</td>
                      <td>フッター（footer-left/center/right）の表示</td>
                    </tr>
                    <tr>
                      <td><code>show-description</code></td>
                      <td>true</td>
                      <td>descriptionテキストの表示</td>
                    </tr>
                    <tr>
                      <td><code>show-step-block-captions</code></td>
                      <td>true</td>
                      <td>ステップのブロックラベルの表示</td>
                    </tr>
                    <tr>
                      <td><code>merge-at-previous-block</code></td>
                      <td>false</td>
                      <td>直前のブロックにmergeする挙動の切り替え</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                プレゼン用に図を使う場合は、不要な情報を非表示にしてスッキリさせるのがコツです。<code>show-left-gutter: false</code> と <code>show-right-gutter: false</code> を組み合わせると、フロー図だけが残ります。
              </Dialog>
              <Dialog speaker="a">
                用途に応じて「手順書モード」（ガター表示あり）と「プレゼンモード」（ガター非表示）を切り替えられる設計ですね。
              </Dialog>
              <Dialog speaker="b">
                ヘッダーとフッターだけ非表示にして図だけを印刷したいときにも使えそうですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "左右カラムの見出し",
          plainText:
            "左右カラムの見出し設定\nleft-title / left-subtitle で左ガター列の見出しと副見出しを設定できます。同様にright-title / right-subtitleで右ガター列の見出しを設定できます。\nDSL例：\n/option/\n  left-title: 作業手順\n  left-subtitle: （詳細説明）\n  right-title: 関連資料\n  right-subtitle: 帳票・システム\n実用例：業務フロー仕様書では左に「作業内容」、右に「使用帳票・システム」という見出しを付けると、読み手にとって情報の種別が一目で分かります。\nAくん：カラム見出しがあると「この列には何が書いてあるか」が一目で分かって可読性が上がりますね。",
          content: (
            <>
              <h2>左右カラムの見出し設定</h2>
              <p>
                <code>left-title</code> / <code>left-subtitle</code> と <code>right-title</code> / <code>right-subtitle</code> で左右ガター列の見出しを設定できます。
              </p>
              <CodeBlock language="text">{`/option/
  left-title: 作業手順
  left-subtitle: （詳細説明）
  right-title: 関連資料
  right-subtitle: 帳票・システム画面`}</CodeBlock>
              <InfoPanel title="見出し設定の実用例" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>用途</th>
                      <th>left-title</th>
                      <th>right-title</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>業務フロー仕様書</td>
                      <td>作業内容</td>
                      <td>使用帳票・システム</td>
                    </tr>
                    <tr>
                      <td>システム設計書</td>
                      <td>処理詳細</td>
                      <td>参照テーブル・API</td>
                    </tr>
                    <tr>
                      <td>作業手順書</td>
                      <td>手順説明</td>
                      <td>注意事項・確認ポイント</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                カラム見出しがあると「この列には何が書いてあるか」が一目で分かって可読性が上がりますね。読み手への親切な設計です。
              </Dialog>
              <Dialog speaker="b">
                「作業内容」「関連資料」という見出し付きの図は、初めて見る人でも迷わず読めそうです。業務引き継ぎ資料に最適ですね。
              </Dialog>
              <Dialog speaker="teacher">
                left-subtitleとright-subtitleは見出しの補足説明として使えます。例えば「作業手順」の下に「（担当者が実施する作業）」という注釈を入れると親切です。
              </Dialog>
            </>
          ),
        },
        {
          title: "テーマの切り替え",
          plainText:
            "テーマの切り替え\nToolbarのThemeアイコンをクリックするとテーマドロップダウンが表示されます。選択した瞬間にプレビューへ即反映されます。\n4つのテーマ：\nbasic：デフォルト。明るい彩色でシンプル。汎用的で迷ったらこれ。\nwashi：和風の落ち着いた色彩。和の雰囲気を出したいドキュメントに。\nink：インク風のモノクロ線画。シンプルで見やすく、カラー印刷を避けたいときに。\nmono：グレースケール。白黒印刷・PDF向き。\n先生：テーマはエクスポートした画像にも反映されます。用途に合わせてエクスポート直前にテーマを変えるのも良い手です。",
          content: (
            <>
              <h2>テーマの切り替え</h2>
              <Figure
                src="image/04-themes.webp"
                alt="Kai Swimlaneの4つのテーマを並べたコンセプト比較図。2×2のグリッドに4つの小さなスイムレーン図が配置されている。左上がbasic（明るいカラフルな彩色）、右上がwashi（くすんだ和風の色彩、茶・緑系）、左下がink（黒のインク線画、背景白）、右下がmono（グレースケール、レーンが灰色のグラデーション）。各テーマ名が下に表示されている。"
                caption="4つのテーマ — basic / washi / ink / mono"
                kind="concept"
              />
              <InfoPanel title="テーマの選び方ガイド" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>テーマ</th>
                      <th>雰囲気</th>
                      <th>向いている用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>basic</strong></td>
                      <td>明るい・カラフル</td>
                      <td>社内プレゼン・汎用ドキュメント</td>
                    </tr>
                    <tr>
                      <td><strong>washi</strong></td>
                      <td>和風・落ち着いた色</td>
                      <td>顧客向け提案書・格式のある文書</td>
                    </tr>
                    <tr>
                      <td><strong>ink</strong></td>
                      <td>シンプル・白黒線画</td>
                      <td>技術文書・シンプルなフロー</td>
                    </tr>
                    <tr>
                      <td><strong>mono</strong></td>
                      <td>グレースケール</td>
                      <td>白黒印刷・PDF・コピー機出力</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                テーマはエクスポートした画像にも反映されます。用途に合わせてエクスポート直前にテーマを変えるのも良い手です。
              </Dialog>
              <Dialog speaker="a">
                白黒印刷が必要な場面ではmonoを選べばOKですね。テーマを変えるだけで印刷対応できるのは便利です。
              </Dialog>
              <Dialog speaker="b">
                washiテーマは顧客向けの提案書に使うと印象が良さそうです。和のテイストは日本のビジネス文書に合いますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "エクスポート",
          plainText:
            "エクスポートの使い方\nToolbarのExportボタンをクリックするとエクスポートメニューが開きます。3つの形式から選択できます。\nSVG：ベクター形式。ファイルサイズが小さく、どんなサイズでも劣化しない。Webページへの埋め込みや印刷に最適。\nPNG：ラスター形式。PowerPoint・Excel・Wordへの貼り付けに向いている。ラスターなので拡大すると荒くなる。\n.txt（DSLテキスト）：図の設計データ（DSL）をテキストファイルとして保存。VS Codeなどのエディタで編集可能。Gitでバージョン管理もできる。\n先生：用途別には、プレゼンはPNG、システム仕様書のWebドキュメントはSVG、チームでの共同編集は.txtが最適です。",
          content: (
            <>
              <h2>エクスポート</h2>
              <InfoPanel title="エクスポート形式の比較" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>形式</th>
                      <th>種別</th>
                      <th>得意な用途</th>
                      <th>注意点</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>SVG</strong></td>
                      <td>ベクター</td>
                      <td>Web埋め込み・高品位印刷</td>
                      <td>IE非対応（現代はほぼ問題なし）</td>
                    </tr>
                    <tr>
                      <td><strong>PNG</strong></td>
                      <td>ラスター</td>
                      <td>PowerPoint・Excel・Word貼り付け</td>
                      <td>拡大すると荒れる</td>
                    </tr>
                    <tr>
                      <td><strong>.txt</strong></td>
                      <td>DSLテキスト</td>
                      <td>Git管理・VS Codeで編集</td>
                      <td>図そのものではなく設計データ</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                <strong>用途別おすすめ：</strong>
                プレゼン → PNG、
                Webドキュメント → SVG、
                チーム共同編集・バージョン管理 → .txt（DSL）。
                .txtをGitで管理すれば、図の変更履歴をdiffで確認できます。
              </Callout>
              <Dialog speaker="teacher">
                用途によって使い分けましょう。プレゼンにはPNG、Webシステムのドキュメントにはテキスト挿入が可能なSVG、チームでの共同編集には.txtが最適です。
              </Dialog>
              <Dialog speaker="a">
                .txtをGitで管理すれば、図の変更履歴をdiffで確認できるのが最大のメリットですね。設計ドキュメントをバージョン管理できる。
              </Dialog>
              <Dialog speaker="b">
                PowerPoint用にはPNGが一番使いやすいですね。貼り付けて終わりなので手間がかからない。
              </Dialog>
            </>
          ),
        },
        {
          title: "テンプレートパネル",
          plainText:
            "Templatesパネルの使い方\nGUIモード専用の機能として、ToolbarのSyntaxボタンから開くTemplatesパネルがあります。role/block/propの3カテゴリのスニペットカタログです。\n使い方：\n1. ToolbarのSyntaxボタンをクリック\n2. Templatesタブをクリック\n3. 使いたいカテゴリ（role/block/prop）を開く\n4. スニペットカードの「クリップボードにコピー」ボタンをクリック\n5. テキストモードに切り替えてDSLの適切な位置に貼り付け\n先生：Templatesパネルは「よく使うDSLパターンのカタログ」です。一から書かなくても良いので、GUIモードのままDSLの雛形を取得できます。\nBちゃん：DSLを覚えなくてもTemplatesパネルから必要なものをコピーして使えるなら、GUIモードで完結できますね。",
          content: (
            <>
              <h2>Templatesパネルの使い方</h2>
              <p>
                GUIモード専用の <strong>Templatesパネル</strong> は、よく使うDSLスニペットのカタログです。ToolbarのSyntaxボタンから開けます。
              </p>
              <ol>
                <li>Toolbar の <strong>Syntax</strong> ボタンをクリック</li>
                <li><strong>Templates</strong> タブをクリック</li>
                <li>使いたいカテゴリ（<code>/role/</code> / <code>/block/</code> / <code>/prop/</code>）を開く</li>
                <li>スニペットカードの <strong>クリップボードにコピー</strong> ボタンをクリック</li>
                <li>テキストモードに切り替えて、DSLの適切な位置に貼り付け</li>
                <li>GUIモードに戻ると反映されている</li>
              </ol>
              <InfoPanel title="Templatesパネルの3カテゴリ" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>カテゴリ</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>/role/</code></td>
                      <td>レーン（役割）定義のスニペット集</td>
                    </tr>
                    <tr>
                      <td><code>/block/</code></td>
                      <td>ステップ形状・色のブロック定義スニペット集</td>
                    </tr>
                    <tr>
                      <td><code>/prop/</code></td>
                      <td>文書チップ（帳票・資料）定義のスニペット集</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                Templatesパネルは「よく使うDSLパターンのカタログ」です。一から書かなくても雛形を取得できるので、GUIモードからほとんど離れずに作業できます。
              </Dialog>
              <Dialog speaker="b">
                DSLを覚えなくてもTemplatesパネルからコピーして使えるなら、GUIモードだけで完結できますね。安心です。
              </Dialog>
              <Dialog speaker="a">
                Templatesパネルのスニペットをコピーして、テキストモードで軽く編集してGUIモードに戻る — このワークフローが一番効率的そうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理：第4章のまとめ\n先生：第4章の内容を整理しましょう。\nAくん：設定ダイアログはタイトル横の歯車アイコンから開く。/page/（description・header・footer）と/option/（表示制御）を編集できる。\nBちゃん：/option/のshow-left-gutterやshow-right-gutterで左右ガター列の表示を制御できる。プレゼン用には非表示にするのがコツ。\nAくん：left-title/right-titleで左右ガター列の見出しを設定できる。「作業手順」「関連資料」のような見出しをつけると可読性が上がる。\nBちゃん：テーマはbasic/washi/ink/monoの4種類。エクスポートした画像にも反映される。\nAくん：エクスポートはSVG（ベクター）・PNG（ラスター）・.txt（DSL）の3形式。用途で使い分ける。\n先生：完璧です。これでコース全体の内容を学びきりました。\nBちゃん：Templatesパネルを使えばDSLをほとんど書かなくてもGUIで図が作れる点がKai Swimlaneの強みですね。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第4章の内容を整理しましょう。
              </Dialog>
              <Dialog speaker="a">
                設定ダイアログはタイトル横の歯車アイコンから開く。<code>/page/</code>（description・header・footer）と <code>/option/</code>（表示制御）を編集できます。
              </Dialog>
              <Dialog speaker="b">
                <code>/option/</code> の <code>show-left-gutter</code> や <code>show-right-gutter</code> で左右ガター列の表示を制御できる。プレゼン用には非表示にするのがコツですね。
              </Dialog>
              <Dialog speaker="a">
                <code>left-title</code> / <code>right-title</code> で左右ガター列の見出しを設定できる。「作業手順」「関連資料」のような見出しをつけると可読性が上がります。
              </Dialog>
              <Dialog speaker="b">
                テーマはbasic/washi/ink/monoの4種類。エクスポートした画像にも反映されるから、出力前にテーマを確認する習慣をつけます。
              </Dialog>
              <Dialog speaker="a">
                エクスポートはSVG（ベクター）・PNG（ラスター）・.txt（DSL）の3形式。プレゼンはPNG、Web埋め込みはSVG、Git管理は.txt。
              </Dialog>
              <Dialog speaker="teacher">
                完璧です。これでKai Swimlane GUIエディタコース全体の内容を学びきりました。おめでとうございます！
              </Dialog>
              <Dialog speaker="b">
                Templatesパネルを使えばDSLをほとんど書かなくてもGUIで図が作れる点が、Kai Swimlaneの最大の強みですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 Kai Swimlaneでエクスポートできる形式として存在しないのはどれか → PDF\nQ2 /option/のshow-left-gutter: falseを設定するとどうなるか → 左ガター列（label/desc列）が図に表示されなくなる\n今日のひとこと：設定・テーマ・エクスポートを使いこなすと、Kai Swimlaneで作った図をプレゼン・印刷・Webドキュメント・Git管理のすべてに対応させられます。ツールの「仕上げの力」を使い切りましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                question={<strong>Kai SwimlaneのExportボタンから直接エクスポートできない形式はどれですか？</strong>}
                options={[
                  "SVG（ベクター形式）",
                  ".txt（DSLテキスト）",
                  "PDF（Adobe PDF形式）",
                ]}
                explanation="Kai SwimlaneのExportボタンからエクスポートできるのはSVG・PNG・.txt（DSLテキスト）の3形式です。PDFは直接エクスポートできませんが、SVGをブラウザで印刷してPDF保存するか、PNGをWord/PowerPointに貼ってPDF出力する方法で対応できます。"
              />
              <Quiz
                answer={1}
                question={<strong>/option/ に show-left-gutter: false を設定するとどうなりますか？</strong>}
                options={[
                  "左側のレーンパネルが非表示になる",
                  "左ガター列（label/descが表示される列）が図に表示されなくなる",
                  "左側のガターがデフォルト値にリセットされる",
                ]}
                explanation="show-left-gutter: false は図の左側にあるlabel/descのガター列を非表示にするオプションです。レーンパネルはGUIエディタのUIなので、このオプションの影響は受けません。プレゼン用にフロー図だけをシンプルに見せたいときに使います。"
              />
              <Dialog speaker="closing">
                設定・テーマ・エクスポートを使いこなすことで、Kai Swimlaneで作った図をプレゼン・印刷・Webドキュメント・Git管理のすべての用途に対応させられます。コース全体を通してお疲れさまでした。ぜひ実際に図を作って、このツールの力を体感してください！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SettingsExportLesson);
