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
            "ログインと接続\nSAP Logon（ログオンパッド）からシステムを選び、クライアント・ユーザー・パスワードで入る手順を学びます。\n⏱ 15分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・SAP Logon と SAP GUI の違い\n・接続先（システム）の選び方\n・クライアント・ユーザー ID・パスワードの意味\n・ログインできないときの確認ポイント",
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
                <li>SAP Logon と SAP GUI ログイン画面の違い</li>
                <li>接続先（システム）の選び方</li>
                <li>クライアント・ユーザー ID・パスワードの意味</li>
                <li>ログインできないときの確認ポイント</li>
              </ul>
            </>
          ),
        },
        {
          title: "2段階で入る",
          plainText:
            "2段階でログイン\n段階1: SAP Logon（ログオンパッド）でどのサーバーに繋ぐかを選ぶ。\n段階2: SAP GUI ログイン画面でクライアント・ユーザー ID・パスワードを入力する。\nBちゃん：いきなりパスワード画面ではなく、まず「どの環境か」を選ぶんですね。\nAくん：開発環境と本番環境が別になっている、ということですね。間違えると大変そう。\n先生：接続先を間違えないことが安全の第一歩です。名前や色分けで見分けられるよう、社内ルールを確認しましょう。",
          content: (
            <>
              <h2>2段階でログイン</h2>
              <MermaidDiagram
                chart={`flowchart TD
  A[PC を起動] --> B[SAP Logon を開く]
  B --> C[接続先\\n（開発/検証/本番）を選ぶ]
  C --> D[ログイン画面]
  D --> E[クライアント・ID・パスワード入力]
  E --> F[SAP メニュー画面]`}
              />
              <ol>
                <li>
                  <strong>SAP Logon</strong>（ログオンパッド）… 接続先の一覧から<strong>システム</strong>を選ぶ
                </li>
                <li>
                  <strong>ログイン画面</strong> … <strong>クライアント</strong>・<strong>ユーザー ID</strong>・<strong>パスワード</strong>を入力
                </li>
              </ol>
              <Dialog speaker="b">
                いきなりパスワード画面ではなく、まず「どの環境か」を選ぶんですね。ブラウザで言うと、URL を打ち込む前に"どのサーバーに繋ぐか"を決める感じですか？
              </Dialog>
              <Dialog speaker="a">
                開発環境・検証環境・本番環境が SAP Logon で切り替えられる、ということですね。間違えると大変そう。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。接続先を間違えないことが安全の第一歩です。名前や色分けで見分けられるよう、<strong>社内ルールを必ず確認</strong>してください。
              </Dialog>
              <Callout variant="warning">
                開発用・検証用・本番用など、<strong>接続先を間違えない</strong>ことが安全の第一歩です。本番で誤った操作をすると取り消せないことがあります。
              </Callout>
            </>
          ),
        },
        {
          title: "クライアントとは",
          plainText:
            "クライアントとは\n3桁の番号で、同じ SAP サーバー内の「会社・環境の区切り」を表す。例: 100=本番、200=開発（会社ごとに定義が異なる）。\nマンションで例えると、SAP サーバー=マンション全体、クライアント=各部屋番号。同じ建物でも部屋が違えばデータも別。\n先生：クライアントを間違えると、別のデータ環境に入ってしまいます。ログイン前に番号を声に出して確認する習慣をつけましょう。\nBちゃん：マンションの例えが分かりやすい。同じ建物（サーバー）でも部屋（クライアント）が違えば別世界なんですね。",
          content: (
            <>
              <h2>クライアントとは</h2>
              <p>
                <strong>クライアント</strong>は通常<strong>3桁の番号</strong>（例: <code>100</code>、<code>200</code>）で、
                1台の SAP サーバーの中で<strong>データや設定を分ける単位</strong>です。
              </p>
              <Figure
                src="image/02-client-rooms.webp"
                alt="マンションの断面図。建物全体が「SAP サーバー」、各部屋が「クライアント（100・200・300）」。100番室は本番データ、200番室は開発テストデータ、300番室は検証データが入っている。同じ建物でも部屋が違えばデータが完全に分離している構造。"
                caption="SAP サーバー＝マンション全体、クライアント＝各部屋。データは別々。"
                kind="concept"
              />
              <InfoPanel title="よくある例（会社により異なる）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>番号</th>
                      <th>一般的な用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>100</code></td>
                      <td>本番（実際の業務データ）</td>
                    </tr>
                    <tr>
                      <td><code>200</code></td>
                      <td>開発・テスト（プログラム作成）</td>
                    </tr>
                    <tr>
                      <td><code>300</code></td>
                      <td>検証・QA（本番前の確認）</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-sm opacity-90">必ず研修担当者・社内マニュアルで正しい番号を確認してください。</p>
              </InfoPanel>
              <Dialog speaker="b">
                マンションの例えがすごく分かりやすい！同じ建物（サーバー）でも部屋（クライアント）が違えば別のデータ、なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                クライアントを間違えると、別のデータ環境に入ってしまいます。ログイン前に番号を<strong>声に出して確認</strong>する習慣をつけましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "ユーザー ID と言語",
          plainText:
            "ユーザー ID と言語\nユーザー ID は個人に割り当てられた ID。初回はパスワード変更を求められることが多い。ログオン言語は JA（日本語）を選ぶことが多い。\nAくん：ログオン言語を変えると、メニューの表示言語も変わるんですか？\n先生：そうです。JA を選べば画面が日本語、EN なら英語表示になります。研修では JA を使うことが多いです。\nパスワードを何度か間違えるとアカウントがロックされることがあります。ロックされたら自己判断で何度も試さず担当者に連絡を。",
          content: (
            <>
              <h2>ユーザー ID と言語</h2>
              <ul>
                <li>
                  <strong>ユーザー ID</strong> … 個人に発行された ID（例: <code>YAMADA</code>、<code>A12345</code>）
                </li>
                <li>
                  <strong>パスワード</strong> … 社内ポリシーに従い、定期的に変更することが多い。初回ログイン時に変更を求められる場合あり。
                </li>
                <li>
                  <strong>ログオン言語</strong> … 日本語なら <code>JA</code> を選択。画面のメニュー・メッセージ言語に影響する。
                </li>
              </ul>
              <Dialog speaker="a">
                ログオン言語を変えると、メニューの表示言語も変わるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                そうです。<code>JA</code> を選べば画面が日本語、<code>EN</code> なら英語表示になります。研修では <code>JA</code>（日本語）を使うことがほとんどです。
              </Dialog>
              <Callout variant="warning">
                パスワードを何度か間違えるとアカウントが<strong>ロック</strong>されることがあります。ロックされたら自己判断で何度も試さず、<strong>担当者に連絡</strong>しましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "ログインできないとき",
          plainText:
            "ログインできないとき\nチェックリストを順に確認します。\n1. 接続先（開発/本番）を間違えていないか\n2. クライアント番号が正しいか\n3. ユーザー ID のタイプミス・Caps Lock\n4. VPN や社内ネットワークに接続しているか\n5. パスワードの有効期限切れ・アカウントロック\nつまずき：「パスワードが合わない」と出るのに、実はクライアントが違う、というパターンもあります。Aくん：ネットワーク系のエラーは、VPN を確認してから SAP Logon を再起動するのが定番ですね。",
          content: (
            <>
              <h2>ログインできないとき</h2>
              <p>焦らず、このチェックリストを上から順に確認しましょう。</p>
              <ol>
                <li>接続先（開発／本番など）を<strong>間違えていないか</strong></li>
                <li><strong>クライアント番号</strong>が正しいか</li>
                <li>ユーザー ID の<strong>タイプミス</strong>・<kbd>Caps Lock</kbd> がオンになっていないか</li>
                <li><strong>VPN</strong> や社内ネットワークに接続しているか</li>
                <li>パスワードの<strong>有効期限切れ</strong>・アカウントロック</li>
              </ol>
              <Dialog speaker="stumble">
                「パスワードが合わない」というエラーが出るのに、実は<strong>クライアントが違った</strong>というパターンがよくあります。エラーメッセージだけを信じず、上から全部確認する習慣を。
              </Dialog>
              <Dialog speaker="a">
                ネットワーク系のエラーは、VPN の接続状態を確認してから SAP Logon を再起動するのが定番ですね。
              </Dialog>
              <Dialog speaker="teacher">
                担当者への連絡前に、このリストを一通り確認しておくと会話がスムーズです。「どこまで試したか」を伝えると解決が早くなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 「クライアント」とは何を表す？→ 同じ SAP サーバー内のデータ・設定の区切り（3桁の番号）\nQ2 ログオン言語「JA」を選ぶと何が変わる？→ 画面のメニュー・メッセージが日本語になる\n今日のひとこと：ログインは「接続先・クライアント・ID」の3点セットを確認する習慣が全ての基本です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="クライアントは SAP サーバー内でデータや設定を分けるための3桁の番号です。同じサーバーでも番号が違えばデータは完全に分離されています。マンションの部屋番号のイメージです。"
                question={<strong>「クライアント」とは何を表す？</strong>}
                options={[
                  "同じ SAP サーバー内のデータ・設定の区切り（3桁の番号）",
                  "パソコンのウィンドウの番号",
                  "SAP GUI のバージョン番号",
                ]}
              />
              <Quiz
                answer={1}
                explanation="ログオン言語は画面に表示されるメニュー・エラーメッセージ・ボタン名などの言語を決めます。JA を選ぶと日本語表示、EN なら英語表示になります。"
                question={<strong>ログオン言語「JA」を選ぶと何が変わる？</strong>}
                options={[
                  "パスワードが日本語に変わる",
                  "画面のメニュー・メッセージが日本語になる",
                  "接続するクライアント番号が変わる",
                ]}
              />
              <Dialog speaker="closing">
                ログインは「接続先・クライアント・ユーザー ID」の3点セットを確認する習慣が、全ての基本です。これさえ身につけば、つまずきの7割は防げます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(LoginAndConnectionLesson);
