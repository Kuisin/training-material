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
  title: "第3章 — ステップ詳細（インスペクター）の活用",
  meta: "初学者 · 20分",
};

export default function StepInspectorLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "03-step-inspector", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第3章 — ステップ詳細（インスペクター）の活用\nステップをクリックすると開くインスペクターポップアップの各フィールドを学びます。label/desc/remark/block/props/id/arrowなど、図をより情報豊かにする設定を習得します。\n⏱ 20分 / 📶 初学者 / 🏷 Kai Swimlane GUI\nこの章で学ぶこと\n・インスペクターの開き方と全体像\n・label と desc（左ガター列への表示）\n・remark と remark-desc（右ガター列への表示）\n・ブロック指定（shape/color のカスタマイズ）\n・プロップ（文書チップ）の設定\n・id と merge（合流先の指定）\n・arrow（矢印の線種変更）",
          content: (
            <>
              <hgroup>
                <h1>第3章 — ステップインスペクターの活用</h1>
                <p>
                  ステップをクリックすると開く<strong>インスペクターポップアップ</strong>で、図をより情報豊かに仕上げる方法を学びます。
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
                <li>インスペクターの開き方と全体像</li>
                <li>label / desc（左ガター列）</li>
                <li>remark / remark-desc（右ガター列）</li>
                <li>ブロック指定・プロップ（文書チップ）</li>
                <li>id / merge（合流先）・arrow（線種）</li>
              </ul>
            </>
          ),
        },
        {
          title: "インスペクターを開く",
          plainText:
            "インスペクターの開き方\nGUIエディタのレーンパネルでステップ名をクリックすると、そのステップのインスペクターポップアップが開きます。\nインスペクターには次のフィールドが含まれます：lane（担当レーン）、text（ステップ本文）、block（ブロックid）、label（左ガター）、desc（左ガター詳細）、remark（右ガター）、remark-desc（右ガター詳細）、props（文書チップ）、id（自身のid）、arrow（矢印線種）。\n先生：インスペクターを閉じるには、ポップアップ外をクリックするか、閉じるボタンを押します。変更はリアルタイムでプレビューに反映されます。\nAくん：変更がリアルタイムで反映されるなら、試行錯誤しながら設定を調整できますね。",
          content: (
            <>
              <h2>インスペクターの開き方</h2>
              <Figure
                src="image/03-inspector-overview.webp"
                alt="Kai Swimlane GUIエディタのインスペクターポップアップの全体図。レーンパネルのステップ名がクリックされており、画面中央にポップアップが開いている。ポップアップ内にlane/text/block/label/desc/remark/remark-desc/props/id/arrowの各フィールドがラベル付きで並んでいる。各フィールドには入力欄があり、いくつかにはサンプル値が入っている。"
                caption="ステップをクリック → インスペクターポップアップが開く"
                kind="diagram"
              />
              <p>インスペクターに含まれる主なフィールド：</p>
              <InfoPanel title="インスペクターのフィールド一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>フィールド</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>lane</strong></td>
                      <td>このステップの担当レーン</td>
                    </tr>
                    <tr>
                      <td><strong>text</strong></td>
                      <td>ステップ本文（ボックス内に表示）</td>
                    </tr>
                    <tr>
                      <td><strong>block</strong></td>
                      <td>形状・色のカスタマイズ用ブロックid</td>
                    </tr>
                    <tr>
                      <td><strong>label / desc</strong></td>
                      <td>左ガター列への追加情報</td>
                    </tr>
                    <tr>
                      <td><strong>remark / remark-desc</strong></td>
                      <td>右ガター列への追加情報</td>
                    </tr>
                    <tr>
                      <td><strong>props</strong></td>
                      <td>文書チップ（関連書類・資料）</td>
                    </tr>
                    <tr>
                      <td><strong>id / merge</strong></td>
                      <td>合流先指定（branch/merge連携）</td>
                    </tr>
                    <tr>
                      <td><strong>arrow</strong></td>
                      <td>このステップ後の矢印の線種</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                インスペクターを閉じるにはポップアップ外をクリックするか閉じるボタンを押します。変更はリアルタイムでプレビューに反映されます。
              </Dialog>
              <Dialog speaker="a">
                変更がリアルタイムで反映されるなら、設定値を変えながら視覚的に確認できますね。試行錯誤がしやすい。
              </Dialog>
            </>
          ),
        },
        {
          title: "label と desc",
          plainText:
            "label と desc：左ガター列への情報追加\nlabelはステップの「短い補足名」です。図の左側に「ガター列」として表示されます。descはlabelの続きとして使える、より長い説明文です。\n表示条件：少なくとも1つのステップにlabelが設定されていると、左ガター列が図全体に表示されます。\nDSL例：\nstep label: 申請書類提出 desc: ``` 申請者は様式A-1に記入して提出する。添付書類3点が必要 ```\n先生：labelはそのステップの「タスク番号」や「作業名の短縮形」として使うと効果的です。\nBちゃん：descで詳細な手順説明を入れられるんですね。図を見るだけで作業手順書になる。",
          content: (
            <>
              <h2>label と desc — 左ガター列</h2>
              <Figure
                src="image/03-label-desc.webp"
                alt="Kai Swimlane 図の左ガター列のアップ図。スイムレーン図の左側に細い列があり、各ステップの行にlabelテキストとdescテキストが縦に並んで表示されている。labelは太字の短いテキスト、descは細字の複数行テキストで下に続く。右側のメイン図のステップボックスと高さが対応している。"
                caption="label（短い補足名）と desc（詳細説明）が図の左側ガター列に表示される"
                kind="diagram"
              />
              <p>
                <strong>label</strong> と <strong>desc</strong> はステップの「左側の補足列（左ガター）」に表示される追加情報です。
              </p>
              <CodeBlock language="text">{`step label: 申請書類提出 desc: \`\`\`
様式A-1に記入して提出。
添付書類3点（身分証・在職証明・申請理由書）が必要。
\`\`\``}</CodeBlock>
              <Callout variant="note">
                descは <code>```</code>（バッククォート3つ）で囲むことで<strong>複数行</strong>を記述できます。インスペクターの入力欄で改行すると自動的に複数行として保存されます。
              </Callout>
              <Dialog speaker="teacher">
                labelはステップの「タスク番号」や「作業名の短縮形」として使うと効果的です。例えば「1-2. 書類受領」のような番号付き名称を入れると手順書として使いやすくなります。
              </Dialog>
              <Dialog speaker="b">
                descで詳細な手順説明を入れられるんですね。図を見るだけで作業手順書として機能するのは便利です。
              </Dialog>
              <Dialog speaker="a">
                左ガター列は「少なくとも1つのステップにlabelがある」と図全体に表示されるんですね。1つだけlabelを設定しても、その列が全ステップ分表示される。
              </Dialog>
            </>
          ),
        },
        {
          title: "remark と remark-desc",
          plainText:
            "remark と remark-desc：右ガター列への情報追加\nremarkはステップの「右側の補足情報」です。図の右側に「右ガター列」として表示されます。remark-descはremarkの続きとなる詳細説明文です。\n表示条件：少なくとも1つのステップにremarkが設定されているときだけ、右ガター列が図全体に表示されます。\n典型的な使い方：関連システム名、使用する帳票・画面名、補足注意事項の記載。\n先生：左ガター（label/desc）を作業手順に、右ガター（remark/remark-desc）を関連情報に使い分けると図が整理されます。\nAくん：左に「何をするか」、右に「何を使うか・何に注意するか」を書く設計ですね。\nBちゃん：業務フローに帳票名や使用するシステム画面を書き込めると、実務担当者への説明が楽になります。",
          content: (
            <>
              <h2>remark と remark-desc — 右ガター列</h2>
              <p>
                <strong>remark</strong> と <strong>remark-desc</strong> はステップの「右側の補足列（右ガター）」に表示される追加情報です。
              </p>
              <InfoPanel title="左右ガターの使い分け" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>列</th>
                      <th>フィールド</th>
                      <th>よく書く内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>左ガター</td>
                      <td>label / desc</td>
                      <td>作業名・手順の詳細説明</td>
                    </tr>
                    <tr>
                      <td>右ガター</td>
                      <td>remark / remark-desc</td>
                      <td>関連システム・帳票名・注意事項</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                右ガターは「少なくとも1つのステップにremarkがある」ときだけ図に表示されます。逆に言えば、不要なら remark を1つも設定しなければ右ガターは表示されません。
              </Callout>
              <Dialog speaker="teacher">
                左ガター（label/desc）を「何をするか」の作業手順に、右ガター（remark/remark-desc）を「何を使うか・何に注意するか」の補足情報に使い分けると、図が整理されます。
              </Dialog>
              <Dialog speaker="a">
                左に「何をするか」、右に「何を使うか・何に注意するか」。この使い分けを習慣にすれば読む人も分かりやすいですね。
              </Dialog>
              <Dialog speaker="b">
                業務フローに帳票名や使用するシステム画面名を書き込めると、実務担当者への説明がとても楽になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "ブロック指定",
          plainText:
            "インスペクターからのブロック指定\nステップインスペクターの「block」フィールドに/block/で定義したブロックのidを入力すると、そのステップの形状・色・フォントが変わります。\nブロックの定義方法：テキストモードで/block/をDSLに記述する、またはGUIのTemplatesパネルから/block/スニペットをコピーして貼り付ける。\nよく使うパターン：開始・終了ステップをellipseにする、判断ステップをhexにする、注意ステップをnoteにする。\n先生：同じブロック定義を複数のステップに適用できるので、スタイルの統一が簡単です。\nAくん：CSSのクラスと同じ発想ですね。スタイルを1カ所で定義して複数要素に適用する。",
          content: (
            <>
              <h2>インスペクターからのブロック指定</h2>
              <p>
                ステップインスペクターの <strong>block</strong> フィールドに <code>/block/</code> のidを入力することで、そのステップの形状・色・フォントをカスタマイズします。
              </p>
              <ol>
                <li>テキストモードまたはTemplatesパネルで <strong>/block/</strong> を定義する</li>
                <li>ステップのインスペクターを開く</li>
                <li><strong>block</strong> フィールドに定義したブロックのidを入力</li>
                <li>プレビューにスタイルが即反映される</li>
              </ol>
              <InfoPanel title="よく使うブロックパターン" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>ステップの種類</th>
                      <th>推奨shape</th>
                      <th>推奨bg色</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>開始・終了</td>
                      <td><code>ellipse</code></td>
                      <td>#D5F5E3（緑系）</td>
                    </tr>
                    <tr>
                      <td>判断・決定</td>
                      <td><code>hex</code></td>
                      <td>#FFF9C4（黄系）</td>
                    </tr>
                    <tr>
                      <td>注意・補足</td>
                      <td><code>note</code></td>
                      <td>#FFF3E0（オレンジ系）</td>
                    </tr>
                    <tr>
                      <td>外部システム</td>
                      <td><code>cloud</code></td>
                      <td>#E3F2FD（青系）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                同じブロック定義を複数のステップに適用できるので、スタイルの統一が簡単です。「開始・終了はすべてellipse」のようなルールを決めておくと図が読みやすくなります。
              </Dialog>
              <Dialog speaker="a">
                CSSのクラスと同じ発想ですね。スタイルを1カ所で定義して複数要素に適用する。保守性が高い設計です。
              </Dialog>
            </>
          ),
        },
        {
          title: "プロップ（文書チップ）",
          plainText:
            "プロップ（文書チップ）の設定\npropsフィールドには「A,B,C」のようにカンマ区切りで/prop/のidを指定します。指定したpropsはステップの左側または右側に「文書チップ」として小さなタグ状のUIで表示されます。\n/prop/の定義例：\n/prop/ id: form-a label: 様式A-1 side: left\n/prop/ id: manual label: マニュアル side: right\nstepでの使用例：step props: form-a, manual;\n先生：propsは「そのステップで参照・使用する帳票・書類・マニュアル」を明示するためのチップです。\nBちゃん：帳票や資料の名前をチップとして図に載せられると、作業者が何を使えばいいか一目で分かりますね。",
          content: (
            <>
              <h2>プロップ（文書チップ）</h2>
              <p>
                <strong>props</strong> フィールドには <code>/prop/</code> で定義した文書・書類のidをカンマ区切りで指定します。ステップの左右に「文書チップ」として表示されます。
              </p>
              <CodeBlock language="text">{`/prop/ id: form-a   label: 様式A-1       side: left
/prop/ id: manual   label: 操作マニュアル side: right
/prop/ id: checklist label: チェックリスト side: left

step text: 申請書類の提出 props: form-a, checklist;`}</CodeBlock>
              <InfoPanel title="propsのsideオプション" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>side値</th>
                      <th>表示位置</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>left</code></td>
                      <td>ステップボックスの左側</td>
                    </tr>
                    <tr>
                      <td><code>right</code></td>
                      <td>ステップボックスの右側</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                <code>/prop/</code> の定義はTemplatesパネルの <strong>/prop/カテゴリ</strong> からスニペットをコピーして使えます。
              </Callout>
              <Dialog speaker="teacher">
                propsは「そのステップで参照・使用する帳票・書類・マニュアル」を明示するためのチップです。業務フロー図を作業手順書として使うときに特に効果を発揮します。
              </Dialog>
              <Dialog speaker="b">
                帳票や資料の名前をチップとして図に載せられると、作業者が何を使えばいいか一目で分かりますね。業務設計の場面でかなり役立ちそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "id と merge",
          plainText:
            "id と merge：合流先の指定\nidフィールドにはそのステップの一意な識別子を設定します。英数字・ハイフン・アンダースコアのみ使用可。\nmergeフィールドには「merge: target-id;」という形式で合流先ステップのidを指定します。branchの終端ステップにmergeを設定することで、branchがメインフローの特定ステップに矢印でつながります。\n典型的な使い方：キャンセル処理パスの最後に「merge: end-step;」を設定して完了ステップに合流させる。\n先生：idはKai Swimlane内で一意である必要があります。同じidを2つのステップに付けると、意図しない挙動になります。\nAくん：HTMLのid属性と同じ感覚ですね。ページ内（図内）で一意でなければならない。",
          content: (
            <>
              <h2>id と merge — 合流先の指定</h2>
              <p>
                <strong>id</strong> フィールドでステップを識別し、<strong>merge</strong> フィールドで合流先のステップを指定します。
              </p>
              <CodeBlock language="text">{`step text: 注文確定
  id: order-complete

branch
  step text: 注文キャンセル処理
  step text: キャンセル完了通知
    merge: order-complete;`}</CodeBlock>
              <Callout variant="warning">
                <strong>idは図全体で一意</strong>でなければなりません。同じidを複数のステップに設定すると、mergeの参照先が意図せず変わる可能性があります。idには具体的で分かりやすい名前を付けましょう。
              </Callout>
              <Dialog speaker="teacher">
                idはKai Swimlane内で一意である必要があります。「cancel-end」や「order-done」のような具体的な名前を付けると、後でDSLを読んだときに意図が分かりやすいです。
              </Dialog>
              <Dialog speaker="a">
                HTMLのid属性と同じ感覚ですね。ページ内（図内）で一意でなければならない。CSSのidセレクターと同じルール。
              </Dialog>
              <Dialog speaker="b">
                branchの「キャンセル処理の最後」にmergeを付けて、メインフローの「完了ステップ」に合流させるパターン、とても実用的だと思います。
              </Dialog>
            </>
          ),
        },
        {
          title: "arrow の線種",
          plainText:
            "arrow：矢印の線種変更\narrowフィールドには、そのステップの後の矢印の線種を指定します。\n指定できる値：solid（実線・デフォルト）、dashed（破線）、dotted（点線）\n典型的な使い方：\nsolid：通常の処理フロー（デフォルト）\ndashed：オプショナルな処理・推奨されるが任意\ndotted：参照・戻り先・非同期の戻り\n先生：arrowの設定はDSLではstep arrow: dashed; のように書きます。インスペクターではドロップダウンで選択できます。\nBちゃん：線種を変えるだけで「必須のフロー」と「任意のフロー」を区別できるのは設計図として有用ですね。",
          content: (
            <>
              <h2>arrow — 矢印の線種変更</h2>
              <p>
                <strong>arrow</strong> フィールドで、そのステップから出る矢印の線種を指定できます。
              </p>
              <InfoPanel title="arrowの線種" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>値</th>
                      <th>見た目</th>
                      <th>よく使う場面</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>solid</code></td>
                      <td>実線（デフォルト）</td>
                      <td>通常の必須フロー</td>
                    </tr>
                    <tr>
                      <td><code>dashed</code></td>
                      <td>破線</td>
                      <td>任意・オプショナルなフロー</td>
                    </tr>
                    <tr>
                      <td><code>dotted</code></td>
                      <td>点線</td>
                      <td>参照・非同期戻り・情報の流れ</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="note">
                arrowの設定はDSLでは <code>step arrow: dashed;</code> のように記述します。インスペクターではドロップダウンから選択できるため、DSLを直接書く必要はありません。
              </Callout>
              <Dialog speaker="teacher">
                arrowの設定はDSLでは <code>arrow: dashed;</code> と書き、インスペクターではドロップダウンで選択できます。デフォルトはsolidなので、変更が必要な箇所だけ設定すれば十分です。
              </Dialog>
              <Dialog speaker="b">
                線種を変えるだけで「必須のフロー」と「任意のフロー」を区別できるのは、設計図として非常に有用ですね。
              </Dialog>
              <Dialog speaker="a">
                dottedを「情報の流れ（データの参照）」に使うのも分かりやすい使い方ですね。処理フローとデータフローを視覚的に区別できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理：第3章のまとめ\n先生：第3章のインスペクターフィールドを整理しましょう。\nAくん：ステップをクリックするとインスペクターが開く。lane/text/block/label/desc/remark/remark-desc/props/id/arrowの各フィールドがある。\nBちゃん：labelとdescは左ガター列、remarkとremark-descは右ガター列。少なくとも1つのステップに設定するとその列が図全体に表示される。\nAくん：propsは/prop/のidをカンマ区切りで指定する。ステップに「文書チップ」として表示される。\nBちゃん：idはステップの一意な識別子。mergeはbranchから合流先のステップを指定するとき使う。\nAくん：arrowでステップ後の矢印線種（solid/dashed/dotted）を変えられる。\n先生：完璧です。インスペクターを使いこなすと、図が手順書・設計書として機能するようになります。\nつまずき：「propsを設定したのに図に表示されない」場合は、/prop/のid設定が正確かどうかと、DSLで/prop/が定義されているかテキストモードで確認しましょう。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第3章のインスペクターフィールドを整理しましょう。
              </Dialog>
              <Dialog speaker="a">
                ステップをクリックするとインスペクターが開く。lane/text/block/label/desc/remark/remark-desc/props/id/arrowの各フィールドがあります。
              </Dialog>
              <Dialog speaker="b">
                labelとdescは左ガター列、remarkとremark-descは右ガター列。少なくとも1つのステップに設定するとその列が図全体に表示されるんですね。
              </Dialog>
              <Dialog speaker="a">
                propsは <code>/prop/</code> のidをカンマ区切りで指定する。ステップに「文書チップ」として表示されるから、関連資料が一目で分かる。
              </Dialog>
              <Dialog speaker="b">
                idはステップの一意な識別子。mergeはbranchから合流先のステップを指定するとき使う。idの命名は分かりやすい名前を付けるのが大事。
              </Dialog>
              <Dialog speaker="a">
                arrowでステップ後の矢印線種（solid/dashed/dotted）を変えられる。必須フローは実線、任意フローは破線、参照は点線という使い分けが実用的ですね。
              </Dialog>
              <Dialog speaker="teacher">
                完璧です。インスペクターを使いこなすと、図が手順書・設計書として機能するようになります。
              </Dialog>
              <Dialog speaker="stumble">
                「propsを設定したのに図に表示されない」場合は、<code>/prop/</code> のidが正確かどうかと、DSLで <code>/prop/</code> が定義されているかをテキストモードで確認しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 左ガター列を図に表示するために必要な設定はどれか → 少なくとも1つのステップにlabelフィールドを設定する\nQ2 branchの終端ステップをメインフローの特定ステップに合流させるには何を使うか → mergeフィールドに合流先ステップのidを指定する\n今日のひとこと：インスペクターは「設定できるから全部使わないといけない」ではありません。必要な情報だけを選んで設定することで、読みやすく実用的な図になります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                question={<strong>左ガター列（label/desc列）を図に表示するために必要な設定はどれですか？</strong>}
                options={[
                  "少なくとも1つのステップにlabelフィールドを設定する",
                  "/option/ でshow-left-gutter: trueを設定する",
                  "すべてのステップにlabelとdescの両方を設定する",
                ]}
                explanation="左ガター列はいずれか1つでもステップにlabelが設定されると、図全体に表示されます。すべてのステップにlabelを設定する必要はありません。/option/のshow-left-gutterでも制御できますが、labelが設定されていることが前提です。"
              />
              <Quiz
                answer={1}
                question={<strong>branch（支線）の終端ステップをメインフローの特定ステップに合流させるには何を使いますか？</strong>}
                options={[
                  "idフィールドに合流先ステップの名前を入力する",
                  "mergeフィールドに「merge: 合流先id;」と設定する",
                  "arrowフィールドをdottedにしてターゲットを指定する",
                ]}
                explanation="branchの終端ステップには mergeフィールドに「merge: target-id;」と設定します。合流先のステップには idフィールドにそのidを設定しておく必要があります。arrowは矢印の線種変更のみで、合流先の指定には使いません。"
              />
              <Dialog speaker="closing">
                インスペクターは「使えるから全部設定しないといけない」わけではありません。必要な情報だけを選んで設定することで、読みやすく実用的な図になります。シンプルさは設計の美徳です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(StepInspectorLesson);
