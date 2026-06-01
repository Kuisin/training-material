import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "ログインと接続 — クライアント・ユーザー・パスワード",
  meta: "初学者 · 15分",
};

export default function LoginAndConnectionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "02-login-and-connection", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "ログインと接続\nSAP Logon（ログオンパッド）からシステムを選び、クライアント・ユーザー・パスワードで入る手順を学びます。",
          content: (
            <>
              <hgroup>
                <h1>ログインと接続</h1>
                <p>SAP Logon からシステムを選び、クライアント・ユーザー・パスワードで入る手順を学びます。</p>
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
                <li>SAP Logon と SAP GUI の違い</li>
                <li>接続先（システム）の選び方</li>
                <li>クライアント・ユーザー ID・パスワードの意味</li>
                <li>ログインできないときの確認ポイント</li>
              </ul>
            </>
          ),
        },
        {
          title: "LogonとGUI",
          plainText:
            "2段階で入る\n1. SAP Logon … どのサーバー（開発・検証・本番など）に繋ぐか選ぶ\n2. SAP GUI ログイン画面 … クライアント・ユーザー・パスワードを入力",
          content: (
            <>
              <h2>2段階で入る</h2>
              <ol>
                <li>
                  <strong>SAP Logon</strong>（ログオンパッド）… 接続先の一覧から<strong>システム</strong>を選ぶ
                </li>
                <li>
                  <strong>ログイン画面</strong> … <strong>クライアント</strong>・<strong>ユーザー ID</strong>・<strong>パスワード</strong>を入力
                </li>
              </ol>
              <Dialog speaker="b">
                いきなりパスワード画面ではなく、まず“どの環境か”を選ぶんですね。
              </Dialog>
              <Callout variant="warning">
                開発用・検証用・本番用など、<strong>接続先を間違えない</strong>ことが安全の第一歩です。名前や色分けで見分けられるよう、社内ルールを確認しましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "クライアント",
          plainText:
            "クライアントとは\n3桁の番号で、同じ SAP サーバー内の“会社・環境の区切り”を表す。例: 100=本番、200=開発 など（会社ごとに定義が異なる）。",
          content: (
            <>
              <h2>クライアントとは</h2>
              <p>
                <strong>クライアント</strong>は通常<strong>3桁の番号</strong>（例: <code>100</code>、<code>200</code>）で、
                1台の SAP サーバーの中で<strong>データや設定を分ける単位</strong>です。
              </p>
              <InfoPanel title="よくある例（会社により異なる）" variant="reference">
                <ul>
                  <li>
                    <code>100</code> … 本番（実際の業務データ）
                  </li>
                  <li>
                    <code>200</code> … 開発・テスト
                  </li>
                </ul>
                <p className="mt-2 text-sm opacity-90">必ず研修担当者・社内マニュアルで正しい番号を確認してください。</p>
              </InfoPanel>
              <Dialog speaker="teacher">
                クライアントを間違えると、別のデータ環境に入ってしまいます。ログイン前に番号を声に出して確認する習慣をつけましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "ユーザーと言語",
          plainText:
            "ユーザー ID と言語\nユーザー ID は個人に割り当てられた ID。初回はパスワード変更を求められることが多い。ログオン言語は JA（日本語）を選ぶことが多い。",
          content: (
            <>
              <h2>ユーザー ID と言語</h2>
              <ul>
                <li>
                  <strong>ユーザー ID</strong> … 個人に発行された ID（例: <code>YAMADA</code>、<code>A12345</code>）
                </li>
                <li>
                  <strong>パスワード</strong> … 社内ポリシーに従い、定期的に変更することが多い
                </li>
                <li>
                  <strong>ログオン言語</strong> … 日本語なら <code>JA</code> を選択（画面のメニュー言語に影響）
                </li>
              </ul>
              <Callout variant="tip">
                パスワードを何度か間違えるとアカウントがロックされることがあります。その場合は担当者へ連絡し、自己判断で何度も試さないようにしましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "ログインできないとき",
          plainText:
            "ログインできないとき\n接続先・クライアント・ユーザー ID・Caps Lock・VPN・パスワード期限を順に確認。",
          content: (
            <>
              <h2>ログインできないとき</h2>
              <ol>
                <li>接続先（開発／本番）を間違えていないか</li>
                <li>クライアント番号が正しいか</li>
                <li>ユーザー ID のタイプミス、<kbd>Caps Lock</kbd></li>
                <li>VPN や社内ネットワークに接続しているか</li>
                <li>パスワードの有効期限切れ・アカウントロック</li>
              </ol>
              <Dialog speaker="stumble">
                「パスワードが合わない」と出るのに、実はクライアントが違う、というパターンもあります。
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
                answer={0}
                explanation="クライアントは SAP サーバー内でデータや設定を分けるための3桁の番号です。会社・環境ごとに意味が決まっています。"
                question={<strong>「クライアント」とは何を表す？</strong>}
                options={[
                  "同じ SAP サーバー内のデータ・設定の区切り（3桁の番号）",
                  "パソコンのウィンドウの番号",
                  "SAP GUI のバージョン番号",
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(LoginAndConnectionLesson);
