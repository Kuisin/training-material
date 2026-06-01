import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Figure,
  Quiz,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "実務のコツ — 設定・トラブル対処・確認テスト",
  meta: "初学者 · 15分",
};

export default function TipsAndPracticeLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "08-tips-and-practice", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "実務のコツ\n画面が遅い・文字が小さい・レイアウトが崩れる…。よくある困りごとと、安全に作業するコツをまとめます。\n⏱ 15分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・表示・フォント・テーマの調整\n・安全に作業するための習慣\n・よくあるトラブルと対処\n・コース全体の確認テスト",
          content: (
            <>
              <hgroup>
                <h1>実務のコツ</h1>
                <p>設定のヒント、トラブル時の型、コースの総仕上げです。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP GUI 基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>表示・フォント・テーマの調整</li>
                <li>安全に作業するための習慣</li>
                <li>よくあるトラブルと対処</li>
                <li>コース全体の確認テスト</li>
              </ul>
            </>
          ),
        },
        {
          title: "見やすくする設定",
          plainText:
            "見やすくする設定\nフォントサイズ・配色テーマ・解像度スケール。SAP GUI のオプションや Windows の表示設定から調整できます。\n高 DPI ディスプレイ：文字が小さい場合は Windows の表示スケールも確認。\nBちゃん：文字が小さくて読みにくいと集中力が切れるので、最初に設定しておきたいです。\n先生：自分の目に合う設定にして、長時間の作業で疲れないようにしましょう。研修では隣の人と同じ見え方でなくても問題ありません。",
          content: (
            <>
              <h2>見やすくする設定</h2>
              <ul>
                <li>
                  <strong>SAP GUI のオプション</strong> … メニュー「ヘルプ」→「設定」などからフォント・テーマを変更（バージョンにより場所が異なります）
                </li>
                <li>
                  <strong>高 DPI ディスプレイ</strong> … 文字が小さい場合は Windows の表示スケールも確認
                </li>
                <li>
                  <strong>フルスクリーン／レイアウト</strong> … 作業領域を広げるレイアウトプリセットがある場合あり
                </li>
              </ul>
              <Dialog speaker="b">
                文字が小さくて読みにくいと集中力が切れるので、最初に設定しておきたいです。
              </Dialog>
              <Dialog speaker="teacher">
                自分の目に合う設定にして、<strong>長時間の作業で疲れない</strong>ようにしましょう。研修では隣の人と同じ見え方でなくても問題ありません。
              </Dialog>
              <Callout variant="tip">
                研修では隣の人と同じ見え方でなくても問題ありません。<strong>自分の目に合う設定</strong>を優先してください。
              </Callout>
            </>
          ),
        },
        {
          title: "安全に作業する習慣",
          plainText:
            "安全に作業する習慣\n1. ログイン時に接続先・クライアントを声に出して確認\n2. 本番環境では「試しに実行」しない\n3. 権限のないトランザクションは無理に回避しない\n4. 離席時はログオフ\n5. パスワードや個人情報を画面共有しない\n先生：操作スピードより、正しい環境で正しい操作が先です。ショートカットはそのあとで効いてきます。\nAくん：「本番で試し押し」だけは絶対にやってはいけないということですね。",
          content: (
            <>
              <h2>安全に作業する習慣</h2>
              <Figure
                src="image/08-safety-habits.webp"
                alt="チェックリスト形式の安全確認図。左に「ログイン時：接続先とクライアントを確認」「本番で試し実行しない」「離席時はログオフ」の3つのチェック項目。右に各項目が守られている場面のミニイラスト（正しい接続先を指差し確認する人、キーボードから離れてログオフするボタン）。"
                caption="毎回のログイン時にこの3つを確認するだけでリスクは大きく減る"
                kind="concept"
              />
              <ul>
                <li>ログイン時に<strong>接続先とクライアント</strong>を声に出して確認</li>
                <li>本番環境では「<strong>試しに実行</strong>」しない。検証環境で手順を確認してから</li>
                <li>権限のないトランザクションは開けない（無理に回避しない）</li>
                <li>離席時は<strong>ログオフ</strong>（セッション放置に注意）</li>
                <li>パスワードや個人情報を画面共有しない</li>
              </ul>
              <Dialog speaker="teacher">
                操作スピードより、<strong>正しい環境で正しい操作</strong>が先です。ショートカットはそのあとで効いてきます。
              </Dialog>
              <Dialog speaker="a">
                「本番で試し押し」だけは絶対にやってはいけないということですね。取り消せないデータ操作が走ってしまうことがある。
              </Dialog>
            </>
          ),
        },
        {
          title: "よくあるトラブルと対処",
          plainText:
            "よくあるトラブル\n画面が固まった：しばらく待つ→別セッションで作業→担当者へ。強制終了は最終手段。\n極端に遅い：照会条件（期間・件数）を狭める・業務ピーク時間を避ける。\n文字が重なる・切れる：解像度・テーマ・フォント設定を見直す。\n接続できない：VPN・社内LAN・SAP Logon の接続先設定。\n「権限がない」：正しいロール付与を管理者に依頼。自分で回避しない。\nBちゃん：「画面が固まった」ときは焦らず待つ、が大事なんですね。\nつまずき：エラーのように見えても、SAP が単に処理中のことがあります。カーソルが砂時計なら完了を待ちましょう。",
          content: (
            <>
              <h2>よくあるトラブルと対処</h2>
              <InfoPanel title="症状とまず試すこと" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>症状</th>
                      <th>まず試すこと</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>画面が固まった</td>
                      <td>しばらく待つ → 別セッションで作業 → 改善しなければ担当者へ（強制終了は最終手段）</td>
                    </tr>
                    <tr>
                      <td>極端に遅い</td>
                      <td>照会条件（期間・件数）を狭める・業務ピーク時間を避ける</td>
                    </tr>
                    <tr>
                      <td>文字が重なる・切れる</td>
                      <td>解像度・SAP GUI テーマ・フォント設定を見直す</td>
                    </tr>
                    <tr>
                      <td>接続できない</td>
                      <td>VPN・社内 LAN・SAP Logon の接続先設定を確認</td>
                    </tr>
                    <tr>
                      <td>「権限がない」</td>
                      <td>正しいロール付与を管理者に依頼（自分で回避しない）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                「画面が固まった」ときは焦らず待つ、が大事なんですね。慌てて強制終了するとデータが消えることもある。
              </Dialog>
              <Dialog speaker="stumble">
                エラーのように見えても、SAP が単に処理中のことがあります。カーソルが砂時計なら<strong>完了を待つ</strong>のが正解です。
              </Dialog>
            </>
          ),
        },
        {
          title: "次のステップ",
          plainText:
            "次のステップ\n1. お気に入りに研修で使う T-code を登録する\n2. 第7章のショートカットを1週間に2個ずつ実践する\n3. ABAP や業務研修に進む場合は、同じ GUI 操作を前提に学習を続ける\n先生：SAP GUI の基本はこれで一通りです。迷ったら第1章・第7章に戻ってください。操作に慣れるほど、後の学習が楽になります。",
          content: (
            <>
              <h2>次のステップ</h2>
              <ol>
                <li>お気に入りに研修で使う T-code を<strong>今すぐ登録</strong>する</li>
                <li>第7章のショートカットを、<strong>1週間に2個ずつ</strong>実践する</li>
                <li>ABAP や業務研修に進む場合は、同じ GUI 操作を前提に学習を続ける</li>
              </ol>
              <Dialog speaker="teacher">
                SAP GUI の基本はこれで一通りです。迷ったら第1章・第7章に戻ってください。操作に慣れるほど、後の学習が楽になります。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="00-introduction"
                slide={0}
                label="ABAP研修を始める"
                variant="forward"
              />
              <Dialog speaker="closing">
                SAP GUI の基本はこれで一通りです。迷ったら第1章・第7章に戻ってください。操作に慣れるほど、後の学習が楽になります。お疲れ様でした！
              </Dialog>
            </>
          ),
        },
        {
          title: "総合テスト",
          plainText:
            "コース総合テスト\nログイン・T-code・F4・F3・ショートカット・安全習慣の確認。\nQ1 ログイン時の「クライアント」とは？→ SAP 内のデータ環境を分ける3桁の番号\nQ2 SE38 のようなコードの呼び名は？→ トランザクションコード（T-code）\nQ3 勘定科目などを一覧から選ぶキーは？→ F4\nQ4 前の画面に戻るキーは？→ F3\nQ5 本番での誤操作を防ぐために最重要な習慣は？→ ログイン時に接続先・クライアントを確認する",
          content: (
            <>
              <h2>コース総合テスト</h2>
              <Quiz
                answer={1}
                explanation="クライアントは SAP サーバー内のデータ・設定の区切りを表す3桁の番号です。同じサーバーでも番号が違えばデータは完全に分離されます。マンションの部屋番号のイメージです。"
                question={<strong>ログイン時の「クライアント」とは？</strong>}
                options={[
                  "Windows のユーザー名",
                  "SAP 内のデータ環境を分ける3桁の番号",
                  "SAP GUI のバージョン",
                ]}
              />
              <Quiz
                answer={0}
                explanation="トランザクションコード（T-code）は SAP の各機能画面を開くための短い識別子です。SE38 なら ABAP エディタ、SE16N ならテーブル表示のように1対1で対応しています。"
                question={<strong>SE38 のようなコードの呼び名は？</strong>}
                options={["トランザクションコード（T-code）", "クライアント番号", "パッチ番号"]}
              />
              <Quiz
                answer={2}
                explanation="F4 は検索ヘルプで、入力候補の一覧から値を選びます。F1 はフィールドヘルプ（項目説明）、F3 は戻る、F8 は実行です。混同しやすいので確認しておきましょう。"
                question={<strong>勘定科目などを一覧から選ぶキーは？</strong>}
                options={["F1", "F3", "F4"]}
              />
              <Quiz
                answer={1}
                explanation="F3 は前の画面に戻る操作です。SAP GUI で最もよく使うキーのひとつです。F8 は実行、Ctrl+S は保存です。"
                question={<strong>前の画面に戻るキーは？</strong>}
                options={["F8", "F3", "Ctrl + S"]}
              />
              <Quiz
                answer={0}
                explanation="接続先（開発/本番）とクライアントの確認が、誤操作防止の第一歩です。間違った環境で実行すると取り消せない操作が走ることがあります。ショートカット暗記より先に確認する習慣が大切です。"
                question={<strong>本番での誤操作を防ぐために最重要な習慣は？</strong>}
                options={[
                  "ログイン時に接続先・クライアントを確認する",
                  "ショートカットをすべて暗記する",
                  "画面の色をランダムに変える",
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(TipsAndPracticeLesson);
