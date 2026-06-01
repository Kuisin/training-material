import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "差別化と拡張 — Clean Core と BTP",
  meta: "初学者 · 20分",
};

export default function ExtensionsCleanCoreLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "06-extensions-clean-core", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "Clean Core と拡張\nS/4HANA コアは標準のまま（Clean Core）に保ち、In-App または BTP（Side-by-Side）で差別化する。",
          content: (
            <>
              <hgroup>
                <h1>差別化と拡張</h1>
                <p>
                  独自要件は必要ですが、コアを改変しすぎると更新が困難になります。
                  <strong>Clean Core</strong> 戦略のもと、拡張は<strong>In-App</strong>と<strong>Side-by-Side（BTP）</strong>に分けて設計します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>Clean Core とは何か</li>
                <li>In-App 拡張でできること</li>
                <li>Side-by-Side（BTP）でできること</li>
              </ul>
            </>
          ),
        },
        {
          title: "Clean Core",
          plainText: "コア（S/4HANA）は標準のまま。拡張は外側で行う。",
          content: (
            <>
              <h2>Clean Core 戦略</h2>
              <p>
                <strong>Clean Core</strong> とは、<strong>S/4HANA のコアを標準のまま保つ</strong>ことです。
                独自ロジックや外部連携は、可能な限り<strong>コアの外</strong>（BTP や SaaS）で実装し、
                アップグレードやクラウド移行の障害を減らします。
              </p>
              <Callout variant="tip">
                「昔ながらの大量 ABAP 改修」から、「標準 ＋ きちんと設計した拡張」へ、という方向性の話です。
              </Callout>
            </>
          ),
        },
        {
          title: "拡張の2種類",
          plainText:
            "In-App: UI・帳票・フィールド・カスタムオブジェクト。Side-by-Side: 外部連携・RPA・AI・マルチ言語アプリ。",
          content: (
            <>
              <h2>拡張の2種類</h2>
              <MermaidDiagram
                chart={`flowchart TB
  CORE["S/4HANA & SAP HANA\n（Clean Core）"]
  CORE --> IN["In-App 拡張"]
  CORE --> SIDE["Side-by-Side 拡張\n（BTP）"]
  IN --> IN1[UI カスタマイズ]
  IN --> IN2[帳票・項目の拡張]
  IN --> IN3[カスタムビジネスオブジェクト]
  SIDE --> S1[外部システム連携]
  SIDE --> S2[RPA・業務自動化]
  SIDE --> S3[高度分析・Business AI]
  SIDE --> S4[マルチ言語アプリ開発]`}
              />
              <table className="w-full text-sm mt-4">
                <thead>
                  <tr>
                    <th className="text-left pr-3">種類</th>
                    <th className="text-left">主な用途</th>
                    <th className="text-left">例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>In-App</strong>
                    </td>
                    <td>コアに近い軽い拡張</td>
                    <td>画面レイアウト、追加項目、カスタム帳票</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Side-by-Side（BTP）</strong>
                    </td>
                    <td>コア外の本格拡張</td>
                    <td>API 連携、AI、独自 Web アプリ、RPA</td>
                  </tr>
                </tbody>
              </table>
              <Dialog speaker="b">
                小さな変更は In-App、大きな連携は BTP、と覚えると選びやすそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "具体例",
          plainText:
            "In-App: 画面・帳票・項目の追加。Side-by-Side: 外部連携・RPA・AI・独自アプリ。両方は併用可。",
          content: (
            <>
              <h2>拡張の具体例</h2>
              <p>
                差別化は <strong>S/4HANA と HANA のコア（Clean Core）</strong> を標準のまま保ち、
                その外側またはコアに近い範囲で行います。In-App と Side-by-Side は<strong>併用</strong>できます。
              </p>
              <h3>In-App 拡張の例</h3>
              <ul>
                <li>エンドユーザーによる UI のカスタマイズ</li>
                <li>帳票・テーブル項目の追加、カスタムフォーム</li>
                <li>カスタムビジネスオブジェクトの作成</li>
              </ul>
              <h3>Side-by-Side（BTP）の例</h3>
              <ul>
                <li>外部システムとの API 連携</li>
                <li>RPA による業務フロー自動化</li>
                <li>高度なデータ分析、Business AI の活用</li>
                <li>マルチ言語対応の独自アプリ・SaaS の開発</li>
              </ul>
              <Callout variant="warning">
                コアに大量の独自 ABAP を書き込む方式は、アップグレードの障害になりやすい——Clean Core が避けたいパターンです。
              </Callout>
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
                explanation="Clean Core は S/4HANA のコアを標準のまま保ち、拡張は外側で行う戦略です。"
                question={<strong>Clean Core の目的として正しいのは？</strong>}
                options={[
                  "コアを標準のまま保ち、更新しやすくする",
                  "すべての処理を ABAP でコアに書き込む",
                  "データベースを Excel に置き換える",
                ]}
              />
              <Quiz
                answer={2}
                explanation="外部システム連携や AI、独自アプリは Side-by-Side（BTP）が向いています。UI の軽い変更は In-App が典型です。"
                question={<strong>外部システム連携や AI 活用は主にどちら？</strong>}
                options={["In-App のみ", "どちらも不可", "Side-by-Side（BTP）"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExtensionsCleanCoreLesson);
