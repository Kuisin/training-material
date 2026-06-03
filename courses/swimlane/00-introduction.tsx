import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CharacterIntro,
  Figure,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  InfoPanel,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "Kai Swimlane GUIエディタ — コース概要",
  meta: "初学者 · 15分",
};

export default function IntroductionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "00-introduction", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "Kai Swimlane GUIエディタ — コース概要\nブラウザだけで動くスイムレーン図エディタ「Kai Swimlane」のGUIモードをゼロから学ぶコースです。DSLを書かなくてもクリック操作だけで本格的なフロー図が作れます。\n⏱ 15分 / 📶 初学者 / 🏷 Kai Swimlane GUI\nこの章で学ぶこと\n・Kai Swimlaneとは何か（ブラウザベースのスイムレーン図エディタ）\n・GUIモードとテキストモードの違い\n・画面の全体構成（ツールバー・レーンパネル・プレビュー）\n・タブとファイル管理（localStorageの活用）\n・テーマとエクスポートの概要",
          content: (
            <>
              <hgroup>
                <h1>Kai Swimlane GUIエディタ</h1>
                <p>
                  ブラウザだけで動くスイムレーン図エディタです。<strong>DSLを書かなくてもクリック操作だけ</strong>で本格的なフロー図が作れます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane GUI" },
                ]}
              />
              <h3>このコースで学ぶこと</h3>
              <ul>
                <li>Kai Swimlaneとは何か（ブラウザベースのスイムレーン図エディタ）</li>
                <li>GUIモードとテキストモードの使い分け</li>
                <li>レーン・ステップ・分岐・並行処理の追加方法</li>
                <li>ステップインスペクターによる詳細設定</li>
                <li>設定・テーマ切り替え・SVG/PNGエクスポート</li>
              </ul>
            </>
          ),
        },
        {
          title: "登場人物",
          plainText:
            "3人で学ぶ\n先生・Aくん・Bちゃんの3人でKai Swimlane GUIを学びます。\n先生：Kai Swimlaneは、業務フローやシステム設計をスイムレーン図で可視化できるブラウザアプリです。GUIモードならDSLを覚えなくてもすぐに使えますよ。\nAくん：フロー図はいつもPowerPointで作っているので、専用ツールを使ってみたいです。コードが書けなくても大丈夫ですか？\nBちゃん：「スイムレーン」という言葉自体が初めてです。図を作るツールということは分かったのですが、何が便利なんでしょう？\n先生：スイムレーン図は、複数の担当者や部署がどのように関わるかを一目で見せる図です。GUIモードなら直感的に作れます。",
          content: (
            <>
              <h2>3人で学ぶ</h2>
              <p>
                このコースには3人が登場します。あなたに近いほうのセリフを特に拾ってください。
              </p>
              <CharacterIntro speaker="teacher">
                Kai Swimlaneは、業務フローやシステム設計をスイムレーン図で可視化できるブラウザアプリです。GUIモードならDSLを覚えなくてもすぐに使えますよ。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                フロー図はいつもPowerPointで作っているので、専用ツールを試してみたいです。コードが書けなくても大丈夫ですか？
              </CharacterIntro>
              <CharacterIntro speaker="b">
                「スイムレーン」という言葉自体が初めてです。図を作るツールということは分かったのですが、何が便利なのか気になります。
              </CharacterIntro>
              <Dialog speaker="teacher">
                スイムレーン図は、複数の担当者・部署・システムがどの順番で何をするかを一目で示せる図です。GUIモードなら設計書感覚でサクサク作れます。
              </Dialog>
              <Dialog speaker="a">
                PowerPointと違ってレイアウトを手動で調整しなくていいなら、かなり楽になりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "Kai Swimlaneとは",
          plainText:
            "Kai Swimlaneとは\nブラウザで動くスイムレーン図エディタです。独自のDSL（テキスト記法）を使って図を定義し、SVGプレビューをリアルタイムで確認できます。インストール不要・ログイン不要でURLを開くだけで使えます。\n先生：テキストモードでDSLを直接書く方法と、GUIモードでクリック操作だけで図を作る方法、2つのモードがあります。\nAくん：URLは https://kuisin.github.io/swimlane-app/ がテキストモード、/gui がGUIモードですね。\nBちゃん：どちらのモードでも同じ図が作れるんですか？\n先生：はい。内部ではどちらも同じDSLが使われています。GUIで作った図はテキストモードで確認・編集することもできます。",
          content: (
            <>
              <h2>Kai Swimlaneとは</h2>
              <Figure
                src="image/00-app-concept.webp"
                alt="Kai Swimlaneアプリのコンセプト図。左側にテキストエディタのアイコンとDSLテキストが書かれたエリア、右側にカラフルなスイムレーン図のSVGが表示されているエリア。両者が双方向の矢印でつながれており、テキストとビジュアルが同期していることを示す。背景はライトグレー、フラットベクターイラスト。"
                caption="テキスト記法（DSL）とビジュアルプレビューがリアルタイムで同期"
                kind="concept"
              />
              <ul>
                <li><strong>ブラウザだけで動く</strong> — インストール・ログイン不要</li>
                <li><strong>独自DSL</strong> — テキストでレーンやステップを定義</li>
                <li><strong>リアルタイムプレビュー</strong> — 編集するたびSVGが即更新</li>
                <li><strong>2つのモード</strong> — テキストモード（DSL直書き）とGUIモード（クリック操作）</li>
              </ul>
              <Dialog speaker="teacher">
                URLは <code>https://kuisin.github.io/swimlane-app/</code> がテキストモード、末尾に <code>/gui</code> を付けるとGUIモードです。
              </Dialog>
              <Dialog speaker="a">
                GUIで作った図をテキストモードで確認したり、逆にテキストで書いたものをGUIで調整したりもできるんですね。
              </Dialog>
              <Dialog speaker="b">
                インストール不要はありがたいです。URLを開くだけなら、チームに共有するのも簡単そう。
              </Dialog>
            </>
          ),
        },
        {
          title: "GUIモードとテキストモード",
          plainText:
            "GUIモードとテキストモード\nKai Swimlaneには2つの操作モードがあります。テキストモードはURL /（ルート）でアクセスし、GUIモードはURL /guiでアクセスします。\nテキストモード：DSLを直接記述。細かい制御が可能。ショートカット・補完に強い。\nGUIモード：クリック操作のみ。DSL知識不要。ステップ追加・インスペクター設定が直感的。\n両モードはツールバーのリンクで切り替え可能。同じタブ・同じDSLが共有されます。\nAくん：最初はGUIモードで慣れて、慣れたらテキストモードに移行するのが良さそうですね。\nBちゃん：切り替えても同じ図が見えるなら、怖くないですね。",
          content: (
            <>
              <h2>GUIモードとテキストモード</h2>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph GUI["GUIモード (/gui)"]
    G1[クリックで\\nステップ追加] --> G2[インスペクターで\\nプロパティ設定]
  end
  subgraph Text["テキストモード (/)"]
    T1[DSLを\\n直接記述] --> T2[補完・\\nショートカット活用]
  end
  GUI <-->|同じDSLを共有| Text`}
              />
              <InfoPanel title="2つのモードの比較" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>GUIモード</th>
                      <th>テキストモード</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>URL</td>
                      <td><code>/gui</code></td>
                      <td><code>/</code>（ルート）</td>
                    </tr>
                    <tr>
                      <td>操作方法</td>
                      <td>クリック・マウス</td>
                      <td>キーボード入力</td>
                    </tr>
                    <tr>
                      <td>DSL知識</td>
                      <td>不要</td>
                      <td>必要</td>
                    </tr>
                    <tr>
                      <td>細かい制御</td>
                      <td>インスペクター経由</td>
                      <td>直接記述</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                最初はGUIモードで慣れて、慣れたらテキストモードに移行するのが良さそうですね。
              </Dialog>
              <Dialog speaker="b">
                切り替えても同じ図が見えるなら、行き来しながら学べるので安心です。
              </Dialog>
            </>
          ),
        },
        {
          title: "インターフェース全体像",
          plainText:
            "GUIエディタの画面構成\nGUIモードの画面は大きく3つのエリアに分かれています。\n1. ツールバー（上部）：テキストモードへのリンク、Syntax（ヘルプ）、テーマ切替、ファイル管理、エクスポート\n2. レーンパネル（左）：レーン（役割）の一覧と各レーン内のステップリスト、+ボタンでステップ追加\n3. プレビュー（右）：リアルタイムSVGプレビュー\n先生：タイトル横の設定ボタンは/page/や/option/を編集するダイアログを開きます。\nAくん：レーンパネルで構造を組み立てて、プレビューで確認するという流れが明確ですね。",
          content: (
            <>
              <h2>GUIエディタの画面構成</h2>
              <Figure
                src="image/00-gui-interface.webp"
                alt="Kai Swimlane GUIエディタの画面全体図。上部にツールバー（テキストモードリンク・Syntaxボタン・テーマ切替・Fileメニュー・Exportボタン）、左側にレーンパネル（役割リストとステップリスト、+ボタン）、右側にカラフルなスイムレーン図のSVGプレビュー。各エリアが色付きの枠で囲まれてラベルが付いている。"
                caption="GUIモードは ツールバー / レーンパネル（左）/ プレビュー（右）の3エリア構成"
                kind="diagram"
              />
              <ul>
                <li><strong>ツールバー</strong> — テキストモードリンク / Syntax / テーマ / File / Export</li>
                <li><strong>レーンパネル（左）</strong> — レーン一覧・ステップリスト・＋ボタン</li>
                <li><strong>プレビュー（右）</strong> — リアルタイムSVGプレビュー</li>
                <li><strong>タイトル横の設定ボタン</strong> — /page/ と /option/ の編集ダイアログ</li>
              </ul>
              <Dialog speaker="teacher">
                タイトル横の歯車アイコン（設定ボタン）は、ページ全体の説明文やヘッダー・フッター、表示オプションを変更するためのダイアログを開きます。
              </Dialog>
              <Dialog speaker="a">
                レーンパネルで構造を組み立てて、右のプレビューで確認する流れが明確ですね。PowerPointで図を作るより断然速そうです。
              </Dialog>
              <Dialog speaker="b">
                ツールバーのボタンが少ないので、最初から迷わずに使えそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "タブとファイル管理",
          plainText:
            "タブとファイル管理\nKai Swimlane GUIエディタはブラウザのlocalStorageにデータを保存します。複数タブ（ドキュメント）を切り替えながら作業できます。\n新規タブ作成：ToolbarのFile → New\nタブ名変更：タブをダブルクリック\nタブ削除：File → Delete\n未保存変更ガード：DSLが変更されているとリロード時に警告が出る\n先生：localStorageに保存されるので、ブラウザを閉じてもデータは残ります。ただし、ブラウザのキャッシュをクリアすると消えるため、重要な図はエクスポートしておきましょう。\nAくん：複数のプロジェクトやフローを別タブで管理できるのは便利ですね。\nBちゃん：リロードしても消えないなら安心して作業できます。",
          content: (
            <>
              <h2>タブとファイル管理</h2>
              <p>
                Kai Swimlaneは<strong>ブラウザのlocalStorage</strong>にデータを保存します。インターネット接続がなくても、同じブラウザを使う限りデータが保持されます。
              </p>
              <InfoPanel title="タブ操作の基本" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>操作</th>
                      <th>方法</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>新規タブ作成</td>
                      <td>Toolbar → File → New</td>
                    </tr>
                    <tr>
                      <td>タブ名変更</td>
                      <td>タブをダブルクリック</td>
                    </tr>
                    <tr>
                      <td>タブ削除</td>
                      <td>Toolbar → File → Delete</td>
                    </tr>
                    <tr>
                      <td>タブ切り替え</td>
                      <td>タブをクリック</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                localStorageに保存されるため、ブラウザのキャッシュ・履歴クリアや別PCでの作業時にデータが消えます。重要な図は必ずSVGまたは.txtでエクスポートしてください。
              </Callout>
              <Dialog speaker="teacher">
                DSLに変更があった状態でページをリロードしようとすると「保存されていない変更があります」という警告が表示されます。安心して作業できますよ。
              </Dialog>
              <Dialog speaker="a">
                複数プロジェクトを別タブで並行管理できるのは、実務でとても役立ちそうです。
              </Dialog>
              <Dialog speaker="b">
                リロードしても消えないなら安心ですが、念のためエクスポートする癖をつけます。
              </Dialog>
            </>
          ),
        },
        {
          title: "テーマとエクスポート",
          plainText:
            "テーマとエクスポート\nKai Swimlaneは4種類のテーマを提供します：basic（デフォルト）、washi（和風）、ink（モノクロインク風）、mono（モノクロ）。\nエクスポート形式は3種類：SVG（ベクター、拡大縮小可能）、PNG（ラスター、プレゼン向き）、.txt（DSLテキスト、テキストエディタ用）。\nテーマ切替：ToolbarのThemeアイコンから選択。プレビューに即反映。\n先生：テーマはプレゼン用途やドキュメントのスタイルに合わせて選びます。washiは和風の彩色、inkはシンプルな黒白線画のイメージです。\nAくん：SVGはベクターなのでどんなサイズでも綺麗に印刷できますね。\nBちゃん：テーマを変えるだけで雰囲気がガラッと変わるのは楽しそうです。",
          content: (
            <>
              <h2>テーマとエクスポート</h2>
              <InfoPanel title="4つのテーマ" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>テーマ名</th>
                      <th>印象・用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>basic</strong></td>
                      <td>デフォルト。明るい彩色でシンプル</td>
                    </tr>
                    <tr>
                      <td><strong>washi</strong></td>
                      <td>和風の落ち着いた色彩。和のドキュメントに</td>
                    </tr>
                    <tr>
                      <td><strong>ink</strong></td>
                      <td>インク風のモノクロ線画。シンプルで見やすい</td>
                    </tr>
                    <tr>
                      <td><strong>mono</strong></td>
                      <td>グレースケール。白黒印刷・PDF向き</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="エクスポート形式" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>形式</th>
                      <th>特徴・用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>SVG</strong></td>
                      <td>ベクター形式。拡大縮小しても劣化しない</td>
                    </tr>
                    <tr>
                      <td><strong>PNG</strong></td>
                      <td>ラスター形式。PowerPoint・スライドに貼りやすい</td>
                    </tr>
                    <tr>
                      <td><strong>.txt</strong></td>
                      <td>DSLテキスト。テキストエディタやVS Codeで編集可能</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                テーマはツールバーのThemeアイコンをクリックするとドロップダウンが現れ、選択した瞬間にプレビューへ即反映されます。
              </Dialog>
              <Dialog speaker="a">
                SVGはベクターなのでどんなサイズでも綺麗です。設計書をWebに埋め込むときにも便利ですね。
              </Dialog>
              <Dialog speaker="b">
                テーマを変えるだけで雰囲気がガラッと変わるのは楽しそうです！選ぶのが迷いそう。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理：コース概要のまとめ\n先生：ここまでKai Swimlane GUIエディタの概要を学びました。整理しましょう。\nAくん：GUIモードはURL /guiでアクセスして、クリックだけでスイムレーン図が作れる。テキストモードとはツールバーで切り替えられる。\nBちゃん：データはlocalStorageに保存されるので、ブラウザを閉じても残る。でも、キャッシュクリアで消えるからエクスポートが大事。\nAくん：テーマはbasic・washi・ink・monoの4種類。エクスポートはSVG・PNG・.txtの3形式。\n先生：完璧です。次の章からはレーンとステップの作り方を実際に学んでいきます。\nBちゃん：GUIモードならDSLを知らなくても図が作れるって聞いて、すごくハードルが下がりました。\nつまずき：最初は画面の左右がごちゃごちゃして見えるかもしれません。でも「左でステップを追加して、右でプレビューを確認する」と覚えれば迷いにくくなります。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                ここまでKai Swimlane GUIエディタの概要を学びました。ポイントを確認しましょう。
              </Dialog>
              <Dialog speaker="a">
                GUIモードはURL <code>/gui</code> でアクセスして、クリックだけでスイムレーン図が作れます。テキストモードとはツールバーのリンクで行き来できる。
              </Dialog>
              <Dialog speaker="b">
                データはlocalStorageに保存されるので、ブラウザを閉じても残ります。でもキャッシュクリアで消えるから、大事な図はエクスポートが必要ですね。
              </Dialog>
              <Dialog speaker="a">
                テーマはbasic・washi・ink・monoの4種類、エクスポートはSVG・PNG・.txtの3形式。SVGはベクターで劣化しない点が便利。
              </Dialog>
              <Dialog speaker="teacher">
                完璧です。次の章からはレーンとステップの追加方法を学んでいきます。実際に手を動かすと理解が深まりますよ。
              </Dialog>
              <Dialog speaker="b">
                GUIモードならDSLを知らなくても図が作れると聞いて、ハードルが下がりました！
              </Dialog>
              <Dialog speaker="stumble">
                最初は画面左右の役割がごちゃごちゃして見えるかもしれません。「左でステップを組み立て、右でプレビューを確認する」と覚えるだけで方向感がつかめます。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 Kai SwimlaneのGUIモードにアクセスするURLは？ → https://kuisin.github.io/swimlane-app/gui\nQ2 Kai Swimlaneのデータはどこにどこににどこにどこにどこにどこにどこにどこにどこに保存されますか？ → ブラウザのlocalStorage\n今日のひとこと：GUIモードとテキストモードは同じDSLを共有しています。まずGUIで慣れて、次第にテキストモードも覗いてみましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                question={<strong>Kai SwimlaneのGUIモードにアクセスするURLはどれですか？</strong>}
                options={[
                  "https://kuisin.github.io/swimlane-app/",
                  "https://kuisin.github.io/swimlane-app/text",
                  "https://kuisin.github.io/swimlane-app/gui",
                ]}
                explanation="GUIモードのURLは /gui です。ルートURL（/）はテキストモードです。ツールバーにもGUI/テキストモードを切り替えるリンクが用意されています。"
              />
              <Quiz
                answer={1}
                question={<strong>Kai SwimlaneのデータはどのようなしくみでPCに保存されますか？</strong>}
                options={[
                  "サーバーのデータベースにアカウントと紐付けて保存される",
                  "ブラウザのlocalStorageに保存される",
                  "ブラウザのセッションストレージに保存され、タブを閉じると消える",
                ]}
                explanation="Kai SwimlaneはブラウザのlocalStorageにデータを保存します。ブラウザを閉じても残りますが、キャッシュクリアや別PCでは参照できないため、重要な図はエクスポートが必要です。"
              />
              <Dialog speaker="closing">
                GUIモードとテキストモードは同じDSLを共有しています。まずはGUIで慣れてから、次第にテキストモードも覗いてみましょう。同じ図がテキストでどう表現されているか、とても勉強になりますよ。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
