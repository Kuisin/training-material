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
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第2章 — 分岐・並行処理・枠・支線の追加",
  meta: "初学者 · 25分",
};

export default function FlowControlGuiLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "02-flow-control-gui", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第2章 — 分岐・並行処理・枠・支線の追加\n単純なステップの羅列だけでなく、条件分岐・並行処理・視覚グループ・支線といったフロー制御要素を追加する方法を学びます。\n⏱ 25分 / 📶 初学者 / 🏷 Kai Swimlane GUI\nこの章で学ぶこと\n・if（条件分岐）の追加とelseif/else\n・loop（ループ）の追加\n・fork（並行処理）とand（並行パス）の追加\n・section（枠・視覚グループ）の追加\n・branch（支線）とmerge（合流）の追加",
          content: (
            <>
              <hgroup>
                <h1>第2章 — 分岐・並行処理・枠・支線</h1>
                <p>
                  単純なステップの羅列から一歩進んで、<strong>条件分岐・並行処理・枠組み・支線</strong>を追加する方法を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane GUI" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>if（条件分岐）の追加とelseif/else</li>
                <li>loop（ループ）の追加</li>
                <li>fork（並行処理）とand（並行パス）</li>
                <li>section（枠・視覚グループ）の追加</li>
                <li>branch（支線）とmerge（合流）の追加</li>
              </ul>
            </>
          ),
        },
        {
          title: "フロー制御の種類",
          plainText:
            "フロー制御の4種類\n1. if（条件分岐）：排他的な分岐。条件によってフローが分かれる。elseif/elseで複数ケースを表現。\n2. fork（並行処理）：複数のパスが同時に進む並行処理。andで並行パスを追加。\n3. section（枠）：ステップを視覚的にグループ化する枠。フロー構造は変えない。\n4. branch（支線）：メインフローから外れる支線。キャンセルパス・例外処理などに使用。\n先生：4種類すべてを+ボタンのポップアップから追加できます。GUIなので選ぶだけです。\nAくん：UMLのアクティビティ図と対応付けると理解しやすそうですね。ifが排他分岐、forkが並行処理分岐。\nBちゃん：sectionは「囲み」みたいな感じですか？フローを変えずに見た目でグループ化する。",
          content: (
            <>
              <h2>フロー制御の4種類</h2>
              <Figure
                src="image/02-flow-types.webp"
                alt="Kai Swimlaneのフロー制御4種類を示すダイアグラム図。左から右に4つのミニ図が並ぶ。1つ目はif（菱形から2本の矢印が分岐）、2つ目はfork（バー記号から2本の矢印が並行に出発）、3つ目はsection（破線の枠でステップを囲む）、4つ目はbranch（メインラインの横に支線が伸びる）。各図の下にラベルが付いている。"
                caption="if（排他分岐）・fork（並行処理）・section（視覚グループ）・branch（支線）の4種類"
                kind="diagram"
              />
              <InfoPanel title="フロー制御要素の比較" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>要素</th>
                      <th>意味</th>
                      <th>典型的な使い方</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>if</strong></td>
                      <td>排他的条件分岐</td>
                      <td>承認/否認、成功/失敗</td>
                    </tr>
                    <tr>
                      <td><strong>fork</strong></td>
                      <td>並行処理（同時実行）</td>
                      <td>並行タスク、非同期処理</td>
                    </tr>
                    <tr>
                      <td><strong>section</strong></td>
                      <td>視覚グループ（フロー変化なし）</td>
                      <td>フェーズ分け、まとめ括弧</td>
                    </tr>
                    <tr>
                      <td><strong>branch</strong></td>
                      <td>支線（メインフローから外れる）</td>
                      <td>キャンセル処理、例外パス</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                4種類すべて、レーンパネルの <strong>+</strong> ボタンのポップアップメニューから追加できます。GUIなので選ぶだけです。
              </Dialog>
              <Dialog speaker="a">
                UMLのアクティビティ図と対応付けると理解しやすいですね。ifが排他分岐ゲートウェイ、forkが並行分岐ゲートウェイに相当する。
              </Dialog>
              <Dialog speaker="b">
                sectionは「囲み線」みたいな感じですか？フローを変えずに視覚的にグループ化するだけ。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。sectionはフローの構造には影響せず、「このステップたちはこのフェーズに属する」という視覚的な整理に使います。
              </Dialog>
            </>
          ),
        },
        {
          title: "条件分岐（if）の追加",
          plainText:
            "条件分岐（if）の追加\n+ボタン → 条件分岐を選択すると、ifブロックが追加されます。ifブロックには最初のケース（case）が1つ作られます。\nelseifの追加：ifブロックの+ボタン → 「elseifを追加」\nelseの追加：ifブロックの+ボタン → 「elseを追加」\n各ケースにはラベルテキストと色を設定できます。ケースの内側に通常のステップを追加できます。\n先生：条件分岐はルートの+ボタンからだけでなく、既存のifブロック内からも追加できます。ネストした分岐も作れます。\nAくん：elseifをいくつでも追加できますか？\n先生：はい。ただし図が複雑になるので、3〜4ケース程度に抑えるのが見やすさのコツです。",
          content: (
            <>
              <h2>条件分岐（if）の追加</h2>
              <Figure
                src="image/02-if-branch-gui.webp"
                alt="Kai Swimlane GUIエディタでの条件分岐追加操作図。左のレーンパネルに+ボタンのポップアップが出ており「条件分岐」が選択されている。右のプレビューにはif/elseif/elseの3ケースがカラーバー付きで表示されたスイムレーン図が示されている。各ケースの中にステップが配置されている。"
                caption="+ → 条件分岐 → ケースを追加 → 各ケースにステップを追加"
                kind="diagram"
              />
              <ol>
                <li><strong>+</strong> ボタン → <strong>条件分岐</strong> を選択</li>
                <li>最初のケース（if case）が自動追加される</li>
                <li>ifブロック内の <strong>+</strong> → <strong>elseifを追加</strong> でケースを増やす</li>
                <li>ifブロック内の <strong>+</strong> → <strong>elseを追加</strong> でデフォルトケースを追加</li>
                <li>各ケース内で通常の <strong>+→手順を追加</strong> でステップを追加</li>
              </ol>
              <Callout variant="tip">
                各ケースには<strong>ラベル</strong>（例：「承認」「差し戻し」）と<strong>色</strong>を設定できます。インスペクターでケースのlabelプロパティを変更します。
              </Callout>
              <Dialog speaker="teacher">
                条件分岐は入れ子（ネスト）にもできます。ただし図が複雑になるので、3〜4ケース程度に抑えるのが見やすさのコツです。
              </Dialog>
              <Dialog speaker="a">
                elseifをいくつでも追加できるんですね。複雑なビジネスルールも表現できそうです。
              </Dialog>
              <Dialog speaker="b">
                ケースごとに色が変えられると、「どのパスに今いるか」が一目で分かって見やすくなりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ループ（[loop]）の追加",
          plainText:
            "ループの追加\n+ボタン → ループを選択するとloopブロックが追加されます。loopブロックの内側にステップや分岐を配置することで、繰り返し処理を表現できます。\n典型的なパターン：入力検証のリトライ（入力 → 検証 → エラー時に入力に戻る）\nloopのラベル：ループ条件や繰り返し条件をラベルとして設定できます（例：「最大3回」）。\n先生：ループはifの内側に置くことも、ifをループの内側に置くこともできます。\nBちゃん：リトライ処理や承認の差し戻しループを表現するのに使えますね。\nAくん：loop内のステップも通常の+ボタンから追加するんですよね。",
          content: (
            <>
              <h2>ループ（loop）の追加</h2>
              <p>
                <strong>ループ</strong>はフロー内の繰り返し処理を表現します。ループブロックの内側にステップを配置することで、条件を満たすまで繰り返すパターンを示せます。
              </p>
              <InfoPanel title="ループの典型的な使い方" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>場面</th>
                      <th>例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>入力検証のリトライ</td>
                      <td>入力 → バリデーション → エラー時に再入力へ戻る</td>
                    </tr>
                    <tr>
                      <td>承認フローの差し戻し</td>
                      <td>申請 → 審査 → 否認時に修正・再申請へ</td>
                    </tr>
                    <tr>
                      <td>バッチ処理の繰り返し</td>
                      <td>データ取得 → 処理 → 全件完了まで繰り返し</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="note">
                ループのラベルには繰り返し条件を記述するのが推奨です（例：「承認されるまで」「最大3回まで」）。インスペクターのlabelフィールドで設定します。
              </Callout>
              <Dialog speaker="teacher">
                ループブロックの内側には通常のステップだけでなく、if分岐を置くこともできます。「条件を満たさなければループ継続」のパターンは、loopの中にifを入れて表現します。
              </Dialog>
              <Dialog speaker="b">
                承認フローの差し戻しループが図で表現できると、業務設計の説明にすごく役立ちそうです。
              </Dialog>
              <Dialog speaker="a">
                loop内のステップも通常の+ボタンから追加するんですよね。操作方法が統一されているのは学習しやすいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "並行処理（fork）の追加",
          plainText:
            "並行処理（fork）の追加\n+ボタン → 並行処理を選択すると、forkブロックが追加されます。forkブロックには最初の並行パス（and）が1つ作られます。\n並行パスの追加：forkブロックの+ボタン → 「並行パスを追加（and）」\n各並行パスには通常のステップを追加できます。すべてのパスが完了した時点で処理が合流します。\n先生：forkはすべてのパスが完了するまで次のステップに進まない「AND結合」です。\nAくん：UMLの並行分岐バーに相当しますね。すべてが終わって初めて合流する。\nBちゃん：「書類作成と並行してシステム設定を進める」という業務フローに使えますね。",
          content: (
            <>
              <h2>並行処理（fork）の追加</h2>
              <Figure
                src="image/02-fork-gui.webp"
                alt="Kai Swimlane GUIエディタでの並行処理追加操作図。レーンパネルにforkブロックが表示されており、2本の並行パス（and）が上下に並んでいる。右のSVGプレビューには並行処理バー（太い水平線）から2本の矢印が下に分岐し、それぞれのパスにステップが配置され、下部の合流バーで1本に戻る様子が示されている。"
                caption="+ → 並行処理 → 並行パス（and）を追加 → 各パスにステップを配置"
                kind="diagram"
              />
              <ol>
                <li><strong>+</strong> ボタン → <strong>並行処理</strong> を選択</li>
                <li>最初の並行パスが自動追加される</li>
                <li>forkブロック内の <strong>+</strong> → <strong>並行パスを追加（and）</strong> でパスを増やす</li>
                <li>各パス内で <strong>+→手順を追加</strong> でステップを追加</li>
              </ol>
              <Callout variant="tip">
                forkは<strong>AND結合</strong>です。すべての並行パスが完了してから次のステップへ進みます。途中でキャンセルされるパスがある場合は branch + merge の組み合わせを検討してください。
              </Callout>
              <Dialog speaker="teacher">
                forkはすべてのパスが完了するまで次のステップに進まない「AND結合」です。並行して実行が必要な業務や処理を表現するのに最適です。
              </Dialog>
              <Dialog speaker="a">
                UMLの並行分岐バーに相当しますね。すべての処理が終わって初めて合流する。
              </Dialog>
              <Dialog speaker="b">
                「書類作成と並行してシステム設定を進める」という業務フローに使えますね。会社の実務でよく見るパターンです。
              </Dialog>
            </>
          ),
        },
        {
          title: "枠（section）の追加",
          plainText:
            "枠（section）の追加\n+ボタン → 枠を選択すると、sectionブロックが追加されます。sectionはフロー構造を変えずに、ステップを視覚的なグループ（枠線付きのエリア）で囲みます。\nsectionのプロパティ：label（枠のタイトル）、color（枠線・背景色）\n典型的な使い方：フェーズ分け（準備フェーズ・実行フェーズ・完了フェーズ）、複数ステップのまとめ表示。\n先生：sectionはフローへの影響がゼロです。純粋に「見た目の整理」のための要素です。\nAくん：コードのコメントブロックみたいな存在ですね。処理には影響しないが可読性を上げる。\nBちゃん：フェーズ名を図に入れられると、誰が読んでもどの段階か分かりやすくなりますね。",
          content: (
            <>
              <h2>枠（section）の追加</h2>
              <p>
                <strong>section</strong>は、ステップを視覚的にグループ化する「枠線エリア」です。フロー（矢印の接続）には一切影響しません。
              </p>
              <ol>
                <li><strong>+</strong> ボタン → <strong>枠</strong> を選択</li>
                <li>sectionブロックが追加される</li>
                <li>インスペクターで <strong>label</strong>（枠タイトル）と <strong>color</strong>（枠色）を設定</li>
                <li>section内で通常の <strong>+→手順を追加</strong> でステップを追加</li>
              </ol>
              <InfoPanel title="sectionの用途" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>用途</th>
                      <th>例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>フェーズ分け</td>
                      <td>「準備フェーズ」「実行フェーズ」「クロージング」</td>
                    </tr>
                    <tr>
                      <td>システム境界の可視化</td>
                      <td>「外部システム処理」「内部処理」</td>
                    </tr>
                    <tr>
                      <td>担当グループのまとめ</td>
                      <td>「バックオフィス作業」「フロントオフィス作業」</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                sectionはフロー構造には影響しません。純粋に「見た目の整理」のための要素です。プレゼン用に見やすくしたいときに活用しましょう。
              </Dialog>
              <Dialog speaker="a">
                コードのコメントブロックみたいな存在ですね。処理には影響しないが可読性を上げる。
              </Dialog>
              <Dialog speaker="b">
                フェーズ名を図に入れられると、読む人がどの段階の話か一目で分かりますね。議事録に添付するときに便利そうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "支線（branch）の追加",
          plainText:
            "支線（branch）の追加\n+ボタン → 支線を選択すると、branchブロックが追加されます。支線はメインフローから外れる「サイドパス」です。\nbranch内のステップはメインフローには合流しません（mergeを使わない限り）。\nmergeとの組み合わせ：branchの終端でmergeを使うと、指定したid（merge: id;）のステップまでジャンプできます。\n典型的な使い方：キャンセルパス（途中でキャンセルされた場合の処理）、エラーハンドリングパス（例外処理）。\n先生：branchはforkの「途中でキャンセルされるかもしれないパス」を表現するときに特に有用です。\nAくん：mergeのジャンプ先はidで指定するんですね。merge: cancel-end; のように書く。",
          content: (
            <>
              <h2>支線（branch）の追加</h2>
              <p>
                <strong>branch</strong>はメインフローから外れる「サイドパス」です。キャンセル処理・例外パスなど、主フローとは独立して流れる処理に使います。
              </p>
              <ol>
                <li><strong>+</strong> ボタン → <strong>支線</strong> を選択</li>
                <li>branchブロックが追加される</li>
                <li>branch内で通常の <strong>+→手順を追加</strong> でステップを追加</li>
                <li>必要に応じてステップのインスペクターで <strong>merge</strong> フィールドに合流先のidを指定</li>
              </ol>
              <Callout variant="note">
                branchの終端ステップに <strong>merge: target-id;</strong> を設定すると、そのステップからtarget-idのステップまでジャンプします（矢印が描画されます）。合流点のステップには <strong>id</strong> フィールドにそのidを設定しておく必要があります。
              </Callout>
              <Dialog speaker="teacher">
                branchはforkの「途中でキャンセルされるかもしれないパス」を表現するときに特に有用です。merge: id; で任意のステップに合流できます。
              </Dialog>
              <Dialog speaker="a">
                mergeのジャンプ先はidで指定するんですね。idの設定はステップインスペクターの「id」フィールドですね。次の章で詳しく学ぶ部分です。
              </Dialog>
              <Dialog speaker="b">
                キャンセル処理をメインフローから分離して図に描ける点が、業務フローの説明に役立ちそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：複合フローの構造",
          plainText:
            "複合フローの構造（if + fork）\n条件分岐と並行処理を組み合わせた典型的なフロー例：\n「承認」ケース → forkで「ステップA」と「ステップB」を並行実行 → 合流 → 完了\n「否認」ケース → 「差し戻し処理」のみ\nネストのルール：ifの内側にforkを置くことはできる。forkの内側にifを置くことも可能。ただし3段以上のネストは図が読みにくくなるため推奨しない。\n先生：複合フローは構造を文章で整理してから図に落とし込むと、ネストの深さを抑えられます。\nAくん：先にMermaidやテキストで構造を書いてから、GUIで作り始めると迷わないですね。",
          content: (
            <>
              <h2>複合フローの構造（if + fork）</h2>
              <MermaidDiagram
                chart={`flowchart TD
  S[申請] --> IF{承認審査}
  IF -->|承認| FORK_START[並行処理開始]
  IF -->|否認| REJ[差し戻し処理]
  FORK_START --> A[ステップA\\nシステム登録]
  FORK_START --> B[ステップB\\n通知送信]
  A --> FORK_END[並行処理合流]
  B --> FORK_END
  FORK_END --> DONE[完了]
  REJ --> END2[申請者へ通知]`}
              />
              <Callout variant="warning">
                <strong>ネストの深さに注意：</strong>if → fork → if のような3段ネストは図が複雑になりすぎて読みにくくなります。2段程度に抑えるか、内側のフローを別図に切り出すことを検討してください。
              </Callout>
              <Dialog speaker="teacher">
                複合フローを作る前に、まず構造を箇条書きで整理してから図に落とし込むと、ネストが深くなりすぎるのを防げます。
              </Dialog>
              <Dialog speaker="a">
                先にテキストや箇条書きで構造を書いてから、GUIで作り始めると迷いにくいですね。設計先行のアプローチが大事。
              </Dialog>
              <Dialog speaker="b">
                承認/否認のフローは実際の業務で頻繁に登場するパターンですね。このテンプレートを覚えておけばすぐ使えそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理：第2章のまとめ\n先生：第2章で学んだフロー制御要素を整理しましょう。\nAくん：if（条件分岐）は+ボタン → 条件分岐から追加。elseif/elseも同じブロック内の+ボタンから追加できる。\nBちゃん：fork（並行処理）は複数のパスが同時に進む「AND結合」。すべてのパスが完了してから次へ進む。\nAくん：section（枠）はフローに影響しない視覚グループ。フェーズ分けに便利。\nBちゃん：branch（支線）はメインフローから外れるサイドパス。merge: id; でジャンプ先を指定できる。\n先生：完璧です。ネストが深くなりすぎないよう、2段程度に抑えるのがポイントでしたね。\nつまずき：「forkを追加したのに並行パスが1つしかない」場合は、forkブロック内の+ボタン → 並行パスを追加（and）を押す必要があります。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第2章で学んだフロー制御要素を整理しましょう。
              </Dialog>
              <Dialog speaker="a">
                if（条件分岐）は + ボタン → 条件分岐から追加。elseif/elseも同じブロック内の+ボタンから追加できます。
              </Dialog>
              <Dialog speaker="b">
                fork（並行処理）は複数のパスが同時に進む「AND結合」。すべてのパスが完了してから次のステップへ進む。
              </Dialog>
              <Dialog speaker="a">
                section（枠）はフロー構造に影響しない視覚グループ。フェーズ分けやシステム境界の可視化に便利ですね。
              </Dialog>
              <Dialog speaker="b">
                branch（支線）はメインフローから外れるサイドパス。<code>merge: id;</code> で合流先のステップにジャンプできる。
              </Dialog>
              <Dialog speaker="teacher">
                完璧です。ネストが深くなりすぎないように2段程度に抑えるのがポイントでしたね。複雑になる場合は別図に分けることも選択肢です。
              </Dialog>
              <Dialog speaker="stumble">
                「forkを追加したのに並行パスが1つしかない」場合は、forkブロック内の+ボタン → 「並行パスを追加（and）」を押す必要があります。最初は見落としやすいポイントです。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 fork（並行処理）の合流のしくみとして正しいのはどれか → すべての並行パスが完了してから次のステップへ進む（AND結合）\nQ2 sectionの特徴として正しいのはどれか → フロー構造を変えずにステップを視覚的にグループ化する\n今日のひとこと：フロー制御要素はすべて+ボタンの同じポップアップから追加できます。まず「どの要素が必要か」を決めてから操作すると迷いません。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                question={<strong>fork（並行処理）の合流のしくみとして正しいのはどれですか？</strong>}
                options={[
                  "最初に完了したパスの結果だけが採用され、他は破棄される（OR結合）",
                  "すべての並行パスが完了してから次のステップへ進む（AND結合）",
                  "いずれかのパスが完了した時点でただちに次のステップへ進む",
                ]}
                explanation="forkはAND結合です。すべての並行パスが完了して初めて次のステップへ進みます。途中でキャンセルされる可能性があるパスを含む場合は、branchとmergeの組み合わせを検討してください。"
              />
              <Quiz
                answer={2}
                question={<strong>section（枠）の特徴として正しいのはどれですか？</strong>}
                options={[
                  "sectionの内側と外側でフローが分岐し、どちらか一方に進む",
                  "sectionの内側のステップは並行して実行される",
                  "フロー構造を変えずにステップを視覚的にグループ化するだけ",
                ]}
                explanation="sectionはフロー（矢印の接続構造）に一切影響を与えません。ステップを破線の枠で囲んで視覚的にグループ化するだけで、矢印の流れは変わりません。フェーズ分けやシステム境界の表示に使います。"
              />
              <Dialog speaker="closing">
                フロー制御要素はすべて+ボタンの同じポップアップから追加できます。「どの要素が必要か」を先に決めてから操作すると、迷わずサクサク作れますよ。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FlowControlGuiLesson);
