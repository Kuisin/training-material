import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
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
            "ショートカット集\n全部覚える必要はありません。まずは「毎日使う10個」から始めましょう。",
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
                <li>次に「開発でよく使う」を追加</li>
                <li>印刷してデスクに貼っても OK（社内ポリシーに従ってください）</li>
              </ul>
            </>
          ),
        },
        {
          title: "最低限の5つ",
          plainText:
            "まず覚える5つ\nF1ヘルプ F3戻る F4検索 F8実行 Enter確定",
          content: (
            <>
              <h2>まず覚える 5 つ</h2>
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
                      <td>
                        <code>F1</code>
                      </td>
                      <td>ヘルプ（項目の説明）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F3</code>
                      </td>
                      <td>前の画面に戻る</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F4</code>
                      </td>
                      <td>検索ヘルプ（値の一覧）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F8</code>
                      </td>
                      <td>実行（照会・レポートの起動など）</td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>Enter</kbd>
                      </td>
                      <td>確定・次へ進む</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                F1 と F8 だけでも、最初のうちはかなり楽になりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "画面全体",
          plainText:
            "画面全体のショートカット\nF5更新 F6次の画面ブロック F7前のブロック Ctrl+S保存 Ctrl+P印刷",
          content: (
            <>
              <h2>画面全体</h2>
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
                      <td>
                        <code>F5</code>
                      </td>
                      <td>一覧の更新（画面による）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F6</code>
                      </td>
                      <td>次の画面領域へ（タブ的な移動）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F7</code>
                      </td>
                      <td>前の画面領域へ</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Ctrl + S</code>
                      </td>
                      <td>保存（編集画面）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Ctrl + P</code>
                      </td>
                      <td>印刷ダイアログ</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Ctrl + F</code>
                      </td>
                      <td>画面内検索（利用可能な画面）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                環境や画面タイプ（Dynpro / ALV / Web GUI）によって効くキーが異なることがあります。効かないときは F1 でその画面のヘルプを確認しましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "コマンド欄",
          plainText:
            "コマンド欄のショートカット\n/n 現在を終了して次 /o 新セッション /i セッション終了 /h デバッグ /nex 強制終了（注意）",
          content: (
            <>
              <h2>コマンド欄で覚える入力</h2>
              <InfoPanel title="コマンド欄（先頭に /）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>入力</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>/n</code>＋T-code
                      </td>
                      <td>現在の画面を終了してから指定画面へ（例: <code>/nSE38</code>）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>/o</code>
                      </td>
                      <td>新しいセッション</td>
                    </tr>
                    <tr>
                      <td>
                        <code>/i</code>
                      </td>
                      <td>現在のセッションを終了</td>
                    </tr>
                    <tr>
                      <td>
                        <code>/h</code>
                      </td>
                      <td>デバッグモードの切替（開発時）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>/n</code>
                      </td>
                      <td>デバッグモード終了（開発時）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                <code>/nex</code> など<strong>強制終了系</strong>は未保存データを失うことがあります。研修・実務とも、通常は使わないでください。担当者の指示がある場合のみ。
              </Callout>
            </>
          ),
        },
        {
          title: "開発向け",
          plainText:
            "ABAP開発でよく使う\nSE38: Ctrl+S Ctrl+F2構文チェック Ctrl+F3有効化 F8実行 デバッグ F5ステップ F6飛ばし",
          content: (
            <>
              <h2>ABAP 開発でよく使う（SE38 など）</h2>
              <InfoPanel title="エディタ" variant="reference" lead="ABAP 研修に進む人は、ここもセットで覚えるとスムーズです。">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>Ctrl + S</code>
                      </td>
                      <td>保存</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Ctrl + F2</code>
                      </td>
                      <td>構文チェック</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Ctrl + F3</code>
                      </td>
                      <td>有効化</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F8</code>
                      </td>
                      <td>実行</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F5</code> / <code>F6</code> / <code>F7</code> / <code>F8</code>
                      </td>
                      <td>デバッガ: ステップ / サブルーチン飛ばし / 戻る / 続行</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <LessonLinkButton
                courseSlug="abap-taining"
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
            "覚え方のコツ\n1週間1つずつ。付箋に書く。実際の画面で毎回キーを使う。効かないときはF1。",
          content: (
            <>
              <h2>覚え方のコツ</h2>
              <ul>
                <li>
                  <strong>1週間に1〜2個</strong>だけ増やす（一度に全部は不要）
                </li>
                <li>よく使う画面（例: ログイン直後のメニュー、<code>SE38</code>）で<strong>意識的にキーを使う</strong></li>
                <li>付箋や社内チートシートに「自分用の10個」だけ書く</li>
                <li>効かない・違う動きをしたら <kbd>F1</kbd> でその画面の説明を確認</li>
              </ul>
              <Dialog speaker="teacher">
                ショートカットは「早くなる道具」です。間違えて押したら、F3 で戻って大丈夫。焦らず慣らしましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText: "理解度チェック",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="F8 は照会やレポートの「実行」、多くの画面で「進む」操作に使われます。"
                question={<strong>照会画面で「実行」するのに使うキーは？</strong>}
                options={["F3", "F4", "F8"]}
              />
              <Quiz
                answer={1}
                explanation="/o は新しいセッションを開くコマンドです。並行作業に便利です。"
                question={<strong>新しいセッションを開くコマンドは？</strong>}
                options={["/n", "/o", "/h"]}
              />
              <Quiz
                answer={0}
                explanation="SE38 では Ctrl+F3 が有効化です。保存だけでは実行時に古いプログラムが動くことがあります。"
                question={<strong>SE38 で「有効化」のショートカットは？</strong>}
                options={["Ctrl + F3", "Ctrl + F8", "F3"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ShortcutsLesson);
