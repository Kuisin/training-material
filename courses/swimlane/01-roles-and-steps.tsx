import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Figure,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  InfoPanel,
  CodeBlock,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第1章 — レーン（役割）とステップの作成",
  meta: "初学者 · 20分",
};

export default function RolesAndStepsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "01-roles-and-steps", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第1章 — レーン（役割）とステップの作成\nKai Swimlane GUIエディタでの最初の一歩として、レーン（役割）とステップを追加する方法を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 Kai Swimlane GUI\nこの章で学ぶこと\n・スイムレーン図における「レーン」の概念（担当者・部署・システムを分ける列）\n・GUIでのレーン追加手順（Syntaxダイアログ → Templatesパネル → /role/スニペット）\n・ステップの追加（+ボタン → 手順を追加）\n・ステップの並べ替えと「ブロック指定」による形状変更",
          content: (
            <>
              <hgroup>
                <h1>第1章 — レーンとステップの作成</h1>
                <p>
                  GUIエディタでの<strong>最初の一歩</strong>を学びます。レーン（担当者・部署）を追加してステップを並べれば、すぐに業務フロー図ができ上がります。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane GUI" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>スイムレーン図における「レーン」の概念</li>
                <li>GUIでのレーン追加手順（Templatesパネル活用）</li>
                <li>ステップの追加（+ボタン → 手順を追加）</li>
                <li>ステップの並べ替えとブロック指定</li>
              </ul>
            </>
          ),
        },
        {
          title: "レーンとは何か",
          plainText:
            "レーンとは何か\nスイムレーン図において「レーン」は担当者・部署・システムなど、フローの「主体」を表す列です。プールに描かれたレーンのように、各主体の担当領域を視覚的に分離します。\n例：発注プロセスなら「購買担当者」「承認者」「仕入先システム」の3レーンになる。\n先生：レーンは英語では「role（役割）」と呼ばれます。Kai SwimlaneのDSLでも /role/ という記法で定義します。\nAくん：UMLのアクターに近い概念ですね。誰が何をするかが一目で分かるのがスイムレーン図の強みです。\nBちゃん：レーンを見れば「このステップは誰の担当か」がすぐ分かるんですね。",
          content: (
            <>
              <h2>レーンとは何か</h2>
              <Figure
                src="image/01-lanes-concept.webp"
                alt="スイムレーン図のコンセプト図。プールを上から見た図のように3本の水平レーンが並んでいる。左から「購買担当者」「承認者」「仕入先システム」とラベルが付き、各レーンに丸角四角のステップが配置されている。矢印がレーンをまたいで流れを示している。フラットベクターイラスト、ライトブルー背景。"
                caption="レーン＝担当者・部署・システムの「担当領域」を視覚的に分離する列"
                kind="concept"
              />
              <p>
                スイムレーン図の「レーン」は、プールのコースのように<strong>各主体の担当領域</strong>を縦または横に分けて示します。
              </p>
              <ul>
                <li>業務フロー例：「申請者」「上長」「総務部」</li>
                <li>システム設計例：「フロントエンド」「API」「データベース」</li>
                <li>Kai SwimlaneではDSLで <code>/role/</code> として定義</li>
              </ul>
              <Dialog speaker="teacher">
                レーンはKai Swimlaneの用語では「role（役割）」です。GUIでは Syntaxダイアログ内のTemplatesパネルから /role/ スニペットをコピーしてDSLに貼り付けることで追加します。
              </Dialog>
              <Dialog speaker="a">
                UMLのアクターに近い概念ですね。誰が何をするかが一目で分かるのがスイムレーン図の強みだと思います。
              </Dialog>
              <Dialog speaker="b">
                レーンを見れば「このステップは誰の担当か」がすぐ分かるんですね。会議の議事録を作るときにも使えそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "レーンの追加",
          plainText:
            "レーンの追加方法\nGUIエディタでレーンを追加するには、ToolbarのSyntaxボタンを開いてTemplatesパネルを参照し、/role/スニペットをコピーしてDSLに貼り付けます。または、テキストモードで直接DSLを入力してGUIモードに戻ることもできます。\n/role/ DSLの例：\n/role/ id: customer label: 顧客 color: #4A90E2 icon: 👤\n主なプロパティ：label（表示名）、color（レーン色）、icon（絵文字アイコン）\n先生：GUIモードではTemplatesパネルが/role/スニペットの「カタログ」として機能します。\nAくん：idは英数字にする必要がありますか？\n先生：はい。idは他のDSL要素からレーンを参照するために使います。英数字とハイフンを推奨します。",
          content: (
            <>
              <h2>レーンの追加</h2>
              <Figure
                src="image/01-role-creation.webp"
                alt="Kai Swimlane GUIエディタのレーン追加操作図。ツールバーのSyntaxボタンを押すとTemplatesパネルが開き、role/block/propのカテゴリが並ぶ。/role/スニペットのカードが選択されており「クリップボードにコピー」ボタンが強調表示されている。その右にはGUIのレーンパネルが表示されており新しいレーンが追加された状態が示されている。"
                caption="Syntaxダイアログ → Templatesパネル → /role/ スニペットをコピーしてDSLに貼り付け"
                kind="diagram"
              />
              <p>GUIモードでのレーン追加の流れ：</p>
              <ol>
                <li>ツールバーの <strong>Syntax</strong> ボタンをクリック</li>
                <li>Templatesパネルで <strong>/role/</strong> カテゴリを開く</li>
                <li>使いたいスニペットを<strong>クリップボードにコピー</strong></li>
                <li>テキストモードに切り替えてDSLの先頭付近に<strong>貼り付け</strong></li>
                <li>GUIモードに戻るとレーンパネルに反映される</li>
              </ol>
              <CodeBlock language="text">{`/role/ id: customer label: 顧客 color: #4A90E2 icon: 👤
/role/ id: staff   label: 担当者 color: #7ED321 icon: 🧑‍💼
/role/ id: system  label: システム color: #9B59B6 icon: 💻`}</CodeBlock>
              <Callout variant="tip">
                <strong>id</strong>は他のステップからレーンを参照するキーです。英数字・ハイフン・アンダースコアのみ使用可。スペースや日本語は使えません。
              </Callout>
              <Dialog speaker="teacher">
                GUIモードのTemplatesパネルは、/role/・/block/・/prop/ の3カテゴリのスニペットをカタログ形式で提供しています。コピーしてテキストモードに貼るだけでDSLに追加できます。
              </Dialog>
              <Dialog speaker="a">
                idは英数字推奨ということですね。ステップで <code>lane: customer</code> のように参照するわけですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ステップの追加",
          plainText:
            "ステップの追加\nレーンを作ったら、次はステップ（処理や手順）を追加します。GUIでのステップ追加は+ボタンから行います。\n手順：\n1. レーンパネル内の+ボタンをクリック\n2. ポップアップメニューから「手順を追加」を選択\n3. テキスト入力欄にステップの名前を入力\n4. レーン（担当者）をドロップダウンで選択\n5. 確定するとレーンパネルとプレビューに即反映\n先生：ステップを追加するたびに右のSVGプレビューがリアルタイムで更新されます。\nBちゃん：フォームみたいに入力するだけでいいんですね。DSLを書かなくていいのが嬉しいです。",
          content: (
            <>
              <h2>ステップの追加</h2>
              <Figure
                src="image/01-step-add.webp"
                alt="Kai Swimlane GUIエディタのステップ追加操作図。レーンパネルの+ボタンをクリックするとポップアップメニューが出現し「手順を追加」「条件分岐」「並行処理」などの選択肢が並ぶ。「手順を追加」が選択されており、右側にテキスト入力欄とレーン選択ドロップダウンを含むフォームが表示されている。"
                caption="レーンパネルの + ボタン → 「手順を追加」→ テキスト入力とレーン選択"
                kind="diagram"
              />
              <ol>
                <li>レーンパネル内の <strong>+</strong> ボタンをクリック</li>
                <li>ポップアップから <strong>手順を追加</strong> を選択</li>
                <li>ステップの<strong>テキスト</strong>（処理名）を入力</li>
                <li><strong>レーン</strong>（担当者）をドロップダウンで選択</li>
                <li>確定 → レーンパネルとプレビューに即反映</li>
              </ol>
              <Callout variant="note">
                ステップのテキストは複数行入力できます。改行は <code>\\n</code> またはフォームでの改行入力で表現します。
              </Callout>
              <Dialog speaker="teacher">
                ステップを追加するたびに、右のSVGプレビューがリアルタイムで更新されます。追加した内容がどう見えるかをすぐ確認しながら作業できます。
              </Dialog>
              <Dialog speaker="b">
                フォームみたいに入力するだけでいいんですね。DSLを書かなくていいのが嬉しいです！
              </Dialog>
              <Dialog speaker="a">
                ステップのテキストを入力してレーンを選ぶだけなら、ドキュメントを作る感覚でフロー図が作れますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ステップの並べ替え",
          plainText:
            "ステップの並べ替え\nレーンパネルに追加されたステップは、ドラッグアンドドロップまたは上下矢印ボタンで順序を変更できます。\nドラッグ：ステップの左端のハンドルをつかんで上下にドラッグ\n上下ボタン：ステップ行の右側にある▲▼ボタンをクリック\nskipフラグ：ステップのプロパティでskip: trueを設定すると、そのステップは「見出しステップ」として扱われ、接続矢印が省略されます。\n先生：並べ替えは直感的に操作できます。ドラッグで一気に移動するのが最も速いです。\nAくん：間違えて順番を変えても、すぐに戻せるのは安心ですね。",
          content: (
            <>
              <h2>ステップの並べ替え</h2>
              <p>レーンパネルに追加したステップは、2つの方法で順序を変更できます。</p>
              <InfoPanel title="並べ替えの方法" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>方法</th>
                      <th>操作</th>
                      <th>向いている場面</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>ドラッグ</strong></td>
                      <td>左端のハンドルをつかんで上下にドラッグ</td>
                      <td>大きく移動させたいとき</td>
                    </tr>
                    <tr>
                      <td><strong>▲▼ボタン</strong></td>
                      <td>ステップ行右端の矢印ボタンをクリック</td>
                      <td>1つずつ丁寧に移動させたいとき</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                <strong>skip: true</strong> を設定したステップは「見出しステップ」として扱われ、矢印の接続線が省略されます。フローの区切り・フェーズ名を入れたいときに便利です。
              </Callout>
              <Dialog speaker="teacher">
                並べ替えは直感的に操作できます。ドラッグで一気に移動するのが最も速いですよ。
              </Dialog>
              <Dialog speaker="a">
                間違えて順番を変えてしまっても、すぐ元に戻せるのは安心ですね。
              </Dialog>
              <Dialog speaker="b">
                skipフラグで「フェーズ1」「フェーズ2」みたいな見出しを入れられるんですね。レイアウトに動かないステップが欲しい場面で使えそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "ステップのブロック指定",
          plainText:
            "ブロック指定：形状と色のカスタマイズ\nKai Swimlaneでは、ステップの見た目（形状・色・フォント）を「ブロック（/block/）」で定義します。ステップインスペクターでblockプロパティに/block/のidを指定することで適用されます。\n主なブロック形状：rect（四角）、rounded（丸角）、hex（六角形）、ellipse（楕円）、cloud（雲）、note（付箋）、subroutine（サブルーチン）\n/block/ DSLの例：\n/block/ id: decision label: 判断 shape: hex bg: #FFF0CC\n先生：ブロックはTemplatesパネルの/block/カテゴリからスニペットをコピーできます。\nBちゃん：形状で意味を区別できるんですね。六角形を判断ステップに使うのはフローチャートの慣習に近い。",
          content: (
            <>
              <h2>ステップのブロック指定</h2>
              <p>
                <strong>ブロック（/block/）</strong>を定義してステップに割り当てることで、形状・背景色・フォントをカスタマイズできます。
              </p>
              <CodeBlock language="text">{`/block/ id: decision label: 判断 shape: hex bg: #FFF0CC
/block/ id: start    label: 開始 shape: ellipse bg: #D5F5E3
/block/ id: note     label: メモ shape: note   bg: #FDEBD0`}</CodeBlock>
              <InfoPanel title="主なブロック形状" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>shape値</th>
                      <th>形状</th>
                      <th>よく使う場面</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>rect</code></td>
                      <td>四角形（デフォルト）</td>
                      <td>通常の処理ステップ</td>
                    </tr>
                    <tr>
                      <td><code>rounded</code></td>
                      <td>丸角四角形</td>
                      <td>柔らかい印象の処理</td>
                    </tr>
                    <tr>
                      <td><code>hex</code></td>
                      <td>六角形</td>
                      <td>判断・条件ステップ</td>
                    </tr>
                    <tr>
                      <td><code>ellipse</code></td>
                      <td>楕円</td>
                      <td>開始・終了</td>
                    </tr>
                    <tr>
                      <td><code>cloud</code></td>
                      <td>雲形</td>
                      <td>外部サービス・クラウド</td>
                    </tr>
                    <tr>
                      <td><code>note</code></td>
                      <td>付箋風</td>
                      <td>メモ・補足</td>
                    </tr>
                    <tr>
                      <td><code>subroutine</code></td>
                      <td>サブルーチン</td>
                      <td>別フローの呼び出し</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                ブロックはTemplatesパネルの <code>/block/</code> カテゴリからスニペットをコピーして使えます。ステップインスペクターの <strong>block</strong> フィールドにブロックのidを入力して割り当てます。
              </Dialog>
              <Dialog speaker="b">
                形状で意味を区別できるんですね。六角形を判断ステップに使うのは、フローチャートの慣習に近くて直感的です。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：最初の図を作る流れ",
          plainText:
            "最初のスイムレーン図を作る流れ\n1. /role/ を定義してレーンを追加\n2. + ボタン → 手順を追加でステップを追加\n3. ステップをドラッグで並べ替え\n4. 必要に応じてブロックを定義してステップに割り当て\n5. プレビューで確認してエクスポート\n先生：この5ステップが基本の流れです。まずレーンを作ってからステップを追加する順序を覚えてください。\nAくん：コードを書くときの「まず型を定義してから処理を書く」に似た感覚ですね。\nBちゃん：順序が明確だと迷わずに作業できます。",
          content: (
            <>
              <h2>最初の図を作る流れ</h2>
              <MermaidDiagram
                chart={`flowchart TD
  A[1. レーンを定義\\n/role/ をDSLに追加] --> B[2. ステップを追加\\n+ボタン → 手順を追加]
  B --> C[3. ステップを並べ替え\\nドラッグ or ▲▼ボタン]
  C --> D[4. ブロック指定\\nインスペクターでblock割り当て]
  D --> E[5. プレビュー確認\\n→ エクスポート]
  style A fill:#D5F5E3
  style E fill:#D6EAF8`}
              />
              <Callout variant="tip">
                まず<strong>レーン（役割）を先に決める</strong>と、ステップを追加するときに「誰のステップか」を迷わず選べます。最初に登場人物を整理する感覚です。
              </Callout>
              <Dialog speaker="teacher">
                この5ステップが基本の流れです。まずレーンを定義してからステップを追加する順序を覚えておきましょう。
              </Dialog>
              <Dialog speaker="a">
                コードを書くときの「まず型やインターフェースを定義してから実装を書く」感覚に似ていますね。
              </Dialog>
              <Dialog speaker="b">
                手順が番号で示されていると、迷わず進めます。最初はこの5ステップを繰り返して慣れていきたいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理：第1章のまとめ\n先生：第1章のポイントを整理しましょう。\nAくん：レーンはDSLの/role/で定義します。GUIではTemplatesパネルからスニペットをコピーして使うのが基本。\nBちゃん：ステップはレーンパネルの+ボタンから追加します。テキストとレーン（担当者）を選ぶだけでOK。\nAくん：並べ替えはドラッグか▲▼ボタン。skipフラグで見出しステップも作れる。\nBちゃん：ブロックを定義することで、ステップの形状や色を変えられる。六角形は判断ステップに向いている。\n先生：完璧です。次の章では分岐・並行処理・枠・支線といったフロー制御要素の追加方法を学びます。\nつまずき：「レーンが表示されない」場合は、DSLの/role/構文が正しいかテキストモードで確認しましょう。idやlabelのスペルミスが多い原因です。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第1章のポイントを整理しましょう。
              </Dialog>
              <Dialog speaker="a">
                レーンはDSLの <code>/role/</code> で定義します。GUIではTemplatesパネルからスニペットをコピーして使うのが基本的なやり方ですね。
              </Dialog>
              <Dialog speaker="b">
                ステップはレーンパネルの <strong>+</strong> ボタンから追加します。テキストとレーン（担当者）を選ぶだけなので簡単でした！
              </Dialog>
              <Dialog speaker="a">
                並べ替えはドラッグか▲▼ボタン。<code>skip: true</code> フラグで見出しステップも作れる点が便利ですね。
              </Dialog>
              <Dialog speaker="b">
                ブロックを定義することで、ステップの形状や色を変えられます。六角形は判断ステップに向いていると覚えました。
              </Dialog>
              <Dialog speaker="teacher">
                完璧です。次の章では分岐・並行処理・枠・支線といったフロー制御要素の追加方法を学びます。
              </Dialog>
              <Dialog speaker="stumble">
                「レーンが表示されない」場合は、DSLの <code>/role/</code> 構文が正しいかテキストモードで確認しましょう。idやlabelのスペルミス・引用符の付け忘れが多い原因です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 GUIモードでレーンを追加するとき、スニペットの参照元として正しいのはどれか → ToolbarのSyntaxボタン → Templatesパネル\nQ2 ステップの形状を六角形にするにはshapeをどう指定するか → hex\n今日のひとこと：まずレーンを作ってからステップを追加する。この順序を身体で覚えると、次の章の分岐や並行処理もスムーズに理解できます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                question={<strong>GUIモードでレーンを追加するとき、スニペット（/role/ 記法の雛形）を参照する場所はどこですか？</strong>}
                options={[
                  "ファイルメニュー（File）内のテンプレート一覧",
                  "ToolbarのSyntaxボタン → Templatesパネル",
                  "プレビューエリアを右クリックしたコンテキストメニュー",
                ]}
                explanation="GUIモードではToolbar上の「Syntax」ボタンを押すとヘルプダイアログが開き、その中のTemplatesパネルに/role/・/block/・/prop/のスニペットカタログが表示されます。スニペットをコピーしてテキストモードに貼り付けることでレーンを追加します。"
              />
              <Quiz
                answer={2}
                question={<strong>ステップの形状を六角形にするには、/block/ のshapeプロパティにどの値を指定しますか？</strong>}
                options={[
                  "hexagon",
                  "diamond",
                  "hex",
                ]}
                explanation="Kai Swimlaneでは六角形の形状は shape: hex で指定します。判断・条件分岐を表すステップに六角形を使うのが一般的なフローチャートの慣習に近い使い方です。"
              />
              <Dialog speaker="closing">
                まずレーンを作ってからステップを追加する。この順序を身体で覚えると、次の章の分岐や並行処理もスムーズに理解できます。「誰が・何をする」の枠組みを先に決める習慣を大切にしてください。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(RolesAndStepsLesson);
