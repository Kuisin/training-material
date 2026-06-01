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
            "実務のコツ\n画面が遅い・文字が小さい・レイアウトが崩れる…。よくある困りごとと、安全に作業するコツをまとめます。",
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
          title: "見やすくする",
          plainText:
            "見やすくする設定\nフォントサイズ・配色テーマ・解像度スケール。SAP GUI のオプションや Windows の表示設定から調整。",
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
              <Callout variant="tip">
                研修では隣の人と同じ見え方でなくても問題ありません。<strong>自分の目に合う設定</strong>にして、長時間の作業で疲れないようにしましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "安全の習慣",
          plainText:
            "安全に作業する習慣\n接続先・クライアントの再確認。本番では試し押ししない。権限のない T-code は開かない。ログオフ。",
          content: (
            <>
              <h2>安全に作業する習慣</h2>
              <ul>
                <li>ログイン時に<strong>接続先とクライアント</strong>を声に出して確認</li>
                <li>本番環境では「試しに実行」しない。検証環境で手順を確認してから</li>
                <li>権限のないトランザクションは開けない（無理に回避しない）</li>
                <li>離席時は<strong>ログオフ</strong>（セッション放置に注意）</li>
                <li>パスワードや個人情報を画面共有しない</li>
              </ul>
              <Dialog speaker="teacher">
                操作スピードより、<strong>正しい環境で正しい操作</strong>が先です。ショートカットはそのあとで効いてきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "トラブル対処",
          plainText:
            "よくあるトラブル\n画面が固まった→待つ/別セッション。遅い→件数・時間帯。変な表示→解像度・テーマ。接続切れ→VPN・ネットワーク。",
          content: (
            <>
              <h2>よくあるトラブル</h2>
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
                      <td>照会条件（期間・件数）を狭める・業務のピーク時間を避ける</td>
                    </tr>
                    <tr>
                      <td>文字が重なる・切れる</td>
                      <td>解像度・SAP GUI テーマ・フォント設定を見直す</td>
                    </tr>
                    <tr>
                      <td>接続できない</td>
                      <td>VPN・社内 LAN・SAP Logon の接続先設定</td>
                    </tr>
                    <tr>
                      <td>「権限がない」</td>
                      <td>正しいロール付与を管理者に依頼（自分で回避しない）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "次のステップ",
          plainText:
            "次のステップ\nABAP研修・業務トレーニングへ。お気に入りを自分用に整える。第7章のショートカットを1週間実践。",
          content: (
            <>
              <h2>次のステップ</h2>
              <ol>
                <li>お気に入りに研修で使う T-code を登録する</li>
                <li>第7章のショートカットを、1週間に2個ずつ実践する</li>
                <li>ABAP や業務研修に進む場合は、同じ GUI 操作を前提に学習を続ける</li>
              </ol>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="00-introduction"
                slide={0}
                label="ABAP研修を始める"
                variant="forward"
              />
              <Dialog speaker="closing">
                SAP GUI の基本はこれで一通りです。迷ったら第1章・第7章に戻ってください。操作に慣れるほど、後の学習が楽になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "総合テスト",
          plainText:
            "コース総合テスト\nログイン・T-code・F4・F3・ショートカットの確認",
          content: (
            <>
              <h2>コース総合テスト</h2>
              <Quiz
                answer={1}
                explanation="クライアントは SAP サーバー内のデータ・設定の区切りを表す3桁の番号です。"
                question={<strong>ログイン時の「クライアント」とは？</strong>}
                options={[
                  "Windows のユーザー名",
                  "SAP 内のデータ環境を分ける3桁の番号",
                  "SAP GUI のバージョン",
                ]}
              />
              <Quiz
                answer={0}
                explanation="トランザクションコードは画面を開くための短い識別子です。SE38 など。"
                question={<strong>SE38 のようなコードの呼び名は？</strong>}
                options={["トランザクションコード（T-code）", "クライアント番号", "パッチ番号"]}
              />
              <Quiz
                answer={2}
                explanation="F4 は検索ヘルプで、入力候補の一覧から値を選びます。"
                question={<strong>勘定科目などを一覧から選ぶキーは？</strong>}
                options={["F1", "F3", "F4"]}
              />
              <Quiz
                answer={1}
                explanation="F3 は前の画面に戻る操作です。"
                question={<strong>前の画面に戻るキーは？</strong>}
                options={["F8", "F3", "Ctrl + S"]}
              />
              <Quiz
                answer={0}
                explanation="接続先（開発/本番）とクライアントの確認が、誤操作防止の第一歩です。"
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
