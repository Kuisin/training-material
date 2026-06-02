import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Figure,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "ショートカット集 — 覚えると速くなるキー操作",
  meta: "初学者 · 20分",
};

export default function ShortcutsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "07-shortcuts", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "ショートカット集\n全部覚える必要はありません。まずは「毎日使う5つ」から始めましょう。\n⏱ 20分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章の進め方\n・まず「最低限の5つ」を体に入れる\n・次に「画面全体・コマンド欄」を追加\n・ABAP 開発者向けのエディタキーも紹介\n・覚え方のコツ",
          content: (
            <>
              <hgroup>
                <h1>ショートカット集</h1>
                <p>覚えると作業が速くなるキー操作を、用途別にまとめます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP GUI 基礎" },
                ]}
              />
              <h3>この章の進め方</h3>
              <ul>
                <li>まず「最低限の5つ」を体に入れる</li>
                <li>次に「画面全体・コマンド欄」を追加</li>
                <li>ABAP 開発者向けのエディタキーも紹介</li>
                <li>印刷してデスクに貼っても OK（社内ポリシーに従ってください）</li>
              </ul>
            </>
          ),
        },
        {
          title: "まず覚える5つ",
          plainText:
            "まず覚える5つ\nF1: ヘルプ（項目の説明）\nF3: 前の画面に戻る\nF4: 検索ヘルプ（値の一覧）\nF8: 実行（照会・レポートの起動など）\nEnter: 確定・次へ進む\nBちゃん：F1 と F8 だけでも、最初のうちはかなり楽になりそうです。\n先生：この5つだけで操作の8割はカバーできます。まずここから始めましょう。",
          content: (
            <>
              <h2>まず覚える 5 つ</h2>
              <Figure
                src="image/07-top5-keys.webp"
                alt="キーボードのイラスト。F1・F3・F4・F8・Enterの5つのキーが他より大きく目立つよう強調されている。各キーの下に「ヘルプ」「戻る」「検索」「実行」「確定」とラベルが付いている。残りのキーはグレーアウト。"
                caption="この5つだけで SAP 操作の8割はカバーできる"
                kind="diagram"
              />
              <InfoPanel title="毎日使うキー" variant="reference" lead="この5つだけでも、操作の8割はカバーできます。">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>F1</code></td>
                      <td>ヘルプ（カーソル位置の項目説明）</td>
                    </tr>
                    <tr>
                      <td><code>F3</code></td>
                      <td>前の画面に戻る</td>
                    </tr>
                    <tr>
                      <td><code>F4</code></td>
                      <td>検索ヘルプ（値の一覧を開く）</td>
                    </tr>
                    <tr>
                      <td><code>F8</code></td>
                      <td>実行（照会・レポートの起動など）</td>
                    </tr>
                    <tr>
                      <td><kbd>Enter</kbd></td>
                      <td>確定・次へ進む</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                F1 と F8 だけでも、最初のうちはかなり楽になりそうです。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。まずこの5つを意識的に使ってみましょう。繰り返すうちに自然と指が覚えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "画面全体のショートカット",
          plainText:
            "画面全体のショートカット\nCtrl+S: 保存（編集画面）\nCtrl+P: 印刷ダイアログ\nCtrl+F: 画面内検索\nF5: 一覧の更新（画面による）\nF6: 次の画面領域へ\nF7: 前の画面領域へ\nAくん：Ctrl+S は保存操作として汎用的に使えますね。忘れても困らないよう、こまめに保存する習慣が大事。\n先生：環境や画面タイプによって効くキーが異なることがあります。効かないときは F1 でその画面のヘルプを確認しましょう。",
          content: (
            <>
              <h2>画面全体のショートカット</h2>
              <InfoPanel title="ナビゲーション・共通" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Ctrl + S</code></td>
                      <td>保存（編集画面）</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + P</code></td>
                      <td>印刷ダイアログ</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + F</code></td>
                      <td>画面内検索（利用可能な画面）</td>
                    </tr>
                    <tr>
                      <td><code>F5</code></td>
                      <td>一覧の更新（画面による）</td>
                    </tr>
                    <tr>
                      <td><code>F6</code> / <code>F7</code></td>
                      <td>次の画面領域 / 前の画面領域へ移動</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                <code>Ctrl + S</code> は保存操作として汎用的に使えますね。忘れても困らないよう、こまめに保存する習慣が大事。
              </Dialog>
              <Callout variant="tip">
                環境や画面タイプ（Dynpro / ALV / Web GUI）によって効くキーが異なることがあります。効かないときは <kbd>F1</kbd> でその画面のヘルプを確認しましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "コマンド欄のコマンド",
          plainText:
            "コマンド欄で覚える入力\n/n+T-code: 現在の画面を終了して指定画面へ（例: /nSE38）\n/o: 新しいセッションを開く\n/i: 現在のセッションを終了\n/h: デバッグモードの切替（開発時）\n注意：/nex など強制終了系は未保存データを失う。通常は使わない。\nAくん：/nSE38 のようにコードと組み合わせると、一発で画面が切り替えられる。かなり効率的。\n先生：よく使うコードをこのコマンドで叩けると、お気に入りがなくても素早く移動できます。",
          content: (
            <>
              <h2>コマンド欄で覚える入力</h2>
              <InfoPanel title="コマンド欄（先頭に / を付ける）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>入力</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>/n</code>＋T-code</td>
                      <td>現在の画面を終了してから指定画面へ（例: <code>/nSE38</code>）</td>
                    </tr>
                    <tr>
                      <td><code>/o</code></td>
                      <td>新しいセッションを開く（現在の作業はそのまま）</td>
                    </tr>
                    <tr>
                      <td><code>/i</code></td>
                      <td>現在のセッションを終了</td>
                    </tr>
                    <tr>
                      <td><code>/h</code></td>
                      <td>デバッグモードの切替（開発時のみ）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                <code>/nSE38</code> のようにコードと組み合わせると、一発で画面が切り替えられる。かなり効率的です。
              </Dialog>
              <Dialog speaker="teacher">
                よく使うコードをこのコマンドで叩けると、お気に入りがなくても素早く移動できます。
              </Dialog>
              <Callout variant="warning">
                <code>/nex</code> など<strong>強制終了系</strong>は未保存データを失うことがあります。研修・実務とも、通常は使わないでください。担当者の指示がある場合のみ。
              </Callout>
            </>
          ),
        },
        {
          title: "ABAP 開発向けショートカット",
          plainText:
            "ABAP 開発でよく使うキー（SE38 など）\nCtrl+S: 保存\nCtrl+F2: 構文チェック\nCtrl+F3: 有効化\nF8: 実行\nデバッガ: F5=ステップ実行 F6=サブルーチン飛ばし F7=呼び出し元へ戻る F8=続行\nAくん：SE38 の Ctrl+F2・Ctrl+F3・F8 の3点セットが「コーディングのルーティン」になりそうです。\n先生：保存→構文チェック→有効化→実行、この順番を体に入れると開発がスムーズになります。",
          content: (
            <>
              <h2>ABAP 開発でよく使うキー（SE38 など）</h2>
              <InfoPanel title="エディタ・デバッガ" variant="reference" lead="ABAP 研修に進む人は、ここもセットで覚えるとスムーズです。">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Ctrl + S</code></td>
                      <td>保存</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + F2</code></td>
                      <td>構文チェック</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + F3</code></td>
                      <td>有効化</td>
                    </tr>
                    <tr>
                      <td><code>F8</code></td>
                      <td>実行</td>
                    </tr>
                    <tr>
                      <td><code>F5</code> / <code>F6</code> / <code>F7</code> / <code>F8</code></td>
                      <td>デバッガ: ステップ / サブルーチン飛ばし / 呼出元へ戻る / 続行</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                SE38 の <code>Ctrl+F2</code>・<code>Ctrl+F3</code>・<code>F8</code> の3点セットが「コーディングのルーティン」になりそうです。
              </Dialog>
              <Dialog speaker="teacher">
                保存 → 構文チェック → 有効化 → 実行、この順番を体に入れると開発がスムーズになります。保存だけでは古いプログラムが動くことがあるので、<strong>有効化まで</strong>が大事です。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="14-sap-development-tools"
                slide={3}
                label="ABAP研修: エディタとショートカットの詳細"
                variant="forward"
              />
            </>
          ),
        },
        {
          title: "覚え方のコツ",
          plainText:
            "覚え方のコツ\n1週間に1〜2個ずつ増やす（一度に全部は不要）。よく使う画面で意識的にキーを使う。付箋に「自分用の10個」だけ書く。効かない・違う動きをしたら F1 で確認。\nBちゃん：ショートカットは「使いながら覚える」のが一番早そうです。\n先生：ショートカットは「早くなる道具」です。間違えて押しても F3 で戻れる。焦らず慣らしましょう。",
          content: (
            <>
              <h2>覚え方のコツ</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A[1週間目\\nF1・F3・F4] --> B[2週間目\\nF8・Enter・Ctrl+S]
  B --> C[3週間目\\n/n・/o コマンド]
  C --> D[1ヶ月後\\n自分の10個が定着]`}
              />
              <ul>
                <li>
                  <strong>1週間に1〜2個</strong>だけ増やす（一度に全部は不要）
                </li>
                <li>よく使う画面（ログイン直後のメニュー、<code>SE38</code>）で<strong>意識的にキーを使う</strong></li>
                <li>付箋や社内チートシートに「<strong>自分用の10個</strong>」だけ書く</li>
                <li>効かない・違う動きをしたら <kbd>F1</kbd> でその画面の説明を確認</li>
              </ul>
              <Dialog speaker="b">
                ショートカットは「使いながら覚える」のが一番早そうです。毎日少しずつ試してみます。
              </Dialog>
              <Dialog speaker="teacher">
                ショートカットは「早くなる道具」です。間違えて押したら、<kbd>F3</kbd> で戻って大丈夫。焦らず慣らしましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 照会画面で「実行」するのに使うキーは？→ F8\nQ2 新しいセッションを開くコマンドは？→ /o\nQ3 SE38 で「有効化」のショートカットは？→ Ctrl + F3\n今日のひとこと：ショートカットは「全部覚えてから使う」より「使いながら1つずつ増やす」が正解。まず F1・F3・F4・F8 から始めましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="F8 は照会やレポートの「実行」、多くの画面で「進む」操作に使われます。F3 は戻る、F4 は検索ヘルプと混同しないよう注意。"
                question={<strong>照会画面で「実行」するのに使うキーは？</strong>}
                options={["F3", "F4", "F8"]}
              />
              <Quiz
                answer={1}
                explanation="/o は新しいセッションを開くコマンドです。現在の作業をそのままに、別のセッションで並行作業できます。/n は画面を終了して別の画面を開く、/i はセッション終了、との違いを覚えましょう。"
                question={<strong>新しいセッションを開くコマンドは？</strong>}
                options={["/n", "/o", "/h"]}
              />
              <Quiz
                answer={0}
                explanation="SE38 では Ctrl+F3 が有効化です。保存（Ctrl+S）だけでは実行時に古いプログラムが動くことがあります。「保存 → 構文チェック（Ctrl+F2）→ 有効化（Ctrl+F3）→ 実行（F8）」の流れが開発の基本です。"
                question={<strong>SE38 で「有効化」のショートカットは？</strong>}
                options={["Ctrl + F3", "Ctrl + F8", "F3"]}
              />
              <Dialog speaker="closing">
                ショートカットは「全部覚えてから使う」より「使いながら1つずつ増やす」が正解。まず <kbd>F1</kbd>・<kbd>F3</kbd>・<kbd>F4</kbd>・<kbd>F8</kbd> から始めましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ShortcutsLesson);
