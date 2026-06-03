import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Figure,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  CodeBlock,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第4章 — 途中合流（merge）と応用パターン",
  meta: "中級 · 25分",
};

export default function MergeAdvancedLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "13-merge-advanced", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第4章 — 途中合流（merge）と応用パターン\nif ケース内から前方の特定ステップにジャンプする merge 構文と、全構文を組み合わせた応用パターンを学ぶ章です。\n⏱ 25分 / 📶 中級 / 🏷 Swimlane DSL\nこの章で学ぶこと\n・merge とは何か（前方ジャンプ）\n・id: の設定方法とユニーク制約\n・merge: の構文とキャンセルパスへの応用\n・arrow: との組み合わせ（dashed connector）\n・merge の制約と注意事項\n・コメント（// と ***）の活用\n・全構文を組み合わせた複合フロー例\n・フロー制御の選択指針",
          content: (
            <>
              <hgroup>
                <h1>途中合流と応用パターン</h1>
                <p>
                  <code>if</code> ケース内から前方の特定ステップにジャンプする <strong>merge 構文</strong>と、全構文を組み合わせた応用パターンを学ぶ章です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "Swimlane DSL" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li><code>merge</code> とは何か（前方ジャンプ）</li>
                <li><code>id:</code> の設定方法とファイル全体のユニーク制約</li>
                <li><code>merge: id;</code> の構文とキャンセルパスへの応用</li>
                <li><code>arrow: dashed;</code> との組み合わせ</li>
                <li><code>merge</code> の制約と注意事項</li>
                <li>コメント（<code>//</code> と <code>***</code>）の活用</li>
                <li>全構文を組み合わせた複合フロー例</li>
                <li>フロー制御の選択指針</li>
              </ul>
            </>
          ),
        },
        {
          title: "mergeとは",
          plainText:
            "merge とは — if ケース内の前方ジャンプ\nmerge は if のケース内から、endif のマージダイヤモンドをスキップして、後方にある id: 指定のステップに直接ジャンプする構文。\n主な用途：キャンセルパス（早期終了）・エラー後の直接完了への飛び越し。\n先生：キャンセル処理のケースでは、「キャンセル受付後すぐに取引完了ステップに飛ぶ」という場面が典型です。通常の endif では途中の処理を経由してしまうので merge を使います。\nAくん：goto 文に近い感覚ですが、「前方に限定・if の中限定」という制約でスコープが絞られているから安全ですね。\nBちゃん：キャンセルボタンを押したら中間のステップを全部スキップして最後の確認画面に飛ぶ、というイメージかな。",
          content: (
            <>
              <h2><code>merge</code> とは — 前方ジャンプ</h2>
              <p>
                <code>merge</code> は <strong><code>if</code> のケース内</strong>から、<code>endif</code> のマージダイヤモンドをスキップして、後方にある <code>id:</code> 指定のステップに直接ジャンプする構文です。
              </p>
              <Figure
                src="image/04-merge-concept.webp"
                alt="スイムレーン図。if のデシジョンダイヤモンドからキャンセルケースが分岐し、「キャンセル受付」ステップの後、merge の矢印がendifをスキップして直接「取引完了」ステップ（id: done）に飛ぶ。通常ケースはendifを経由して取引完了に来る。"
                caption="merge の動作 — キャンセルケースが endif をスキップして id: done に直接ジャンプ"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                キャンセル処理のケースでは「キャンセル受付後すぐに取引完了ステップに飛ぶ」という場面が典型です。通常の <code>endif</code> では途中の処理を経由してしまうので <code>merge</code> を使います。
              </Dialog>
              <Dialog speaker="a">
                <code>goto</code> 文に近い感覚ですが、「前方限定・<code>if</code> の中限定」という制約でスコープが絞られているから安全ですね。
              </Dialog>
              <Dialog speaker="b">
                キャンセルボタンを押したら中間のステップを全部スキップして最後の確認画面に飛ぶ、というイメージかな。
              </Dialog>
            </>
          ),
        },
        {
          title: "id: の設定",
          plainText:
            "id: の設定 — マージ先の指定\nmerge の飛び先はステップに id: プロパティで設定。id: はファイル全体でユニーク。label: はマージ先として使えない（id: のみ有効）。\nid: の記法：ステップの直後に id: <値>; を記述（または同行に書く）。\n先生：id: の値はファイル全体で重複してはいけません。複数の merge が同じ id に飛ぶことは可能ですが、id: の定義は1箇所だけです。\nAくん：label: がマージ先に使えないのは重要ですね。label はフロー図上の表示名であって、内部識別子ではないからですか。\nBちゃん：id: の名前は分かりやすい英語か日本語ローマ字にしておくと、コードを読んだときに飛び先が分かりやすいですね。",
          content: (
            <>
              <h2><code>id:</code> の設定</h2>
              <CodeBlock
                code={`/line/
if (キャンセル？) is (あり) than #red
  [role01: キャンセル受付]
  merge: done;           // ← id: done に前方ジャンプ

elseif (保留) than #orange
  [role01: 保留処理]
  merge: done;           // ← 同じ id: done に飛ぶことも可能

else
  [role02: 通常処理]
  [role03: 審査完了]
endif

// ▼ merge の飛び先（id: done が設定されたステップ）
[role01: 取引完了]
id: done;
label: 完了;`}
              />
              <Callout variant="warning">
                <code>id:</code> はファイル全体でユニークでなければなりません。同じ <code>id:</code> 値を複数のステップに設定するとエラーになります。また <strong><code>label:</code> は <code>merge:</code> の飛び先として使えません</strong>（<code>id:</code> のみ有効）。
              </Callout>
              <Dialog speaker="teacher">
                <code>id:</code> の値はファイル全体で重複してはいけません。複数の <code>merge</code> が同じ <code>id</code> に飛ぶことは可能ですが、<code>id:</code> の定義は1箇所だけです。
              </Dialog>
              <Dialog speaker="a">
                <code>label:</code> がマージ先に使えないのは重要ですね。<code>label</code> はフロー図上の表示名であって、内部識別子ではないからですか。
              </Dialog>
              <Dialog speaker="b">
                <code>id:</code> の名前は分かりやすい英語か日本語ローマ字にしておくと、コードを読んだときに飛び先が分かりやすいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "merge: の構文",
          plainText:
            "merge: の構文 — キャンセルパスの典型例\nmerge: <id>; を if のケース末尾に書く。その前に arrow: dashed; を書くと破線矢印になる。\n先生：arrow: dashed; は merge のコネクタスタイルを破線にします。「通常とは異なる経路」を視覚的に示すのに有効です。\nAくん：破線矢印があると「ここはイレギュラーな経路」という意図が読む側に伝わりやすいですね。\nBちゃん：merge を使うパターンはキャンセル・エラー後の完了・緊急終了など、例外ケースが多そうですね。",
          content: (
            <>
              <h2><code>merge:</code> の構文</h2>
              <CodeBlock
                code={`/line/
[role01: 取引開始]
[role01: 本人確認]

if (本人確認) is (OK) than #green
  [role02: 取引処理]
  [role03: 決済実行]
  [role02: 完了データ作成]

elseif (失敗) than #orange
  [role01: 本人確認失敗記録]
  [role01: 再試行案内]
  [loop]

elseif (キャンセル) than #red
  [role01: キャンセル受付]
  [role01: キャンセル通知]
  arrow: dashed;         // ← 直後の merge を破線矢印に
  merge: txn-complete;   // ← id: txn-complete へジャンプ

else
  [role01: 不明エラー処理]
  merge: txn-complete;
endif

[role01: 取引完了]
id: txn-complete;
label: 取引完了;
[role04: 完了ログ記録]`}
              />
              <Dialog speaker="teacher">
                <code>arrow: dashed;</code> は merge のコネクタスタイルを破線にします。「通常とは異なる経路」を視覚的に示すのに有効です。
              </Dialog>
              <Dialog speaker="a">
                破線矢印があると「ここはイレギュラーな経路」という意図が読む側に伝わりやすいですね。
              </Dialog>
              <Dialog speaker="b">
                <code>merge</code> を使うパターンはキャンセル・エラー後の完了・緊急終了など、例外ケースが多そうですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "arrowとmergeの組み合わせ",
          plainText:
            "arrow: dashed; と merge: の組み合わせ\narrow: dashed; を merge の直前に置くと、merge の矢印が破線になる。\narrow と merge の組み合わせで「例外的・イレギュラーな飛び越し」を視覚的に強調できる。\n先生：arrow: の設定は merge だけでなく通常のステップの矢印にも使えますが、特に merge との組み合わせで効果を発揮します。\nAくん：arrow: dashed; がないと実線矢印になる。実線は「通常の流れ」、破線は「特殊な飛び越し」という視覚ルールを統一すると図が読みやすくなりますね。\nBちゃん：コード上で arrow: dashed; が merge の直前にある場合のみ効果がある、ということですね。順番が大事。",
          content: (
            <>
              <h2><code>arrow: dashed;</code> と <code>merge:</code> の組み合わせ</h2>
              <CodeBlock
                code={`// arrow: dashed; → merge: で破線の前方ジャンプ矢印
if (緊急停止) is (発動) than #red
  [role01: 緊急停止記録]
  [role04: アラート送信]
  arrow: dashed;
  merge: emergency-end;    // 破線矢印で emergency-end に飛ぶ

elseif (正常終了) than #green
  [role02: 正常完了処理]
  [role01: 成功ログ記録]
  // ← 通常の endif マージへ

else
  [role01: 標準エラー処理]
  arrow: dashed;
  merge: emergency-end;    // こちらも破線で同じ id に
endif

[role01: 後処理（通常終了のみ経由）]

[role01: システム終了]
id: emergency-end;
label: システム終了;`}
              />
              <Figure
                src="image/04-merge-arrow.webp"
                alt="スイムレーン図。if の緊急停止ケースとその他ケースから破線の矢印がid:emergency-endに飛んでいる。通常終了ケースは実線でendifを経由する。破線と実線の使い分けが視覚的に明確。"
                caption="arrow: dashed; + merge: の組み合わせ — 実線（通常経路）と破線（例外飛び越し）の使い分け"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                <code>arrow: dashed;</code> を <code>merge</code> の直前に置くと、その <code>merge</code> の矢印が破線になります。arrow の効果は直後の merge のみに適用されます。
              </Dialog>
              <Dialog speaker="a">
                実線は「通常の流れ」、破線は「特殊な飛び越し」という視覚ルールを統一すると図が読みやすくなりますね。
              </Dialog>
              <Dialog speaker="b">
                <code>arrow: dashed;</code> が <code>merge</code> の直前にある場合のみ効果がある、ということですね。順番が大事。
              </Dialog>
            </>
          ),
        },
        {
          title: "mergeの制約",
          plainText:
            "merge の制約\n1. if ケース内でのみ使用可（fork パス内・if の外は不可）\n2. 飛び先（id:）は必ず前方（下流側）に存在しなければならない\n3. id: のない場所を merge: で指定するとエラー\n4. label: は merge の飛び先として使用不可（id: のみ）\n5. id: はファイル全体でユニーク\n先生：merge はとても便利ですが、乱用すると「スパゲッティフロー」になります。本当に必要な例外ケースのみに使いましょう。\nAくん：全ての制約を一言でまとめると「if の中で前方の id: 指定ステップへ飛ぶ専用構文」ですね。\nBちゃん：スパゲッティになりやすいという点は注意が必要ですね。merge を使うたびに「本当に必要か」と問い直す習慣が大事。",
          content: (
            <>
              <h2><code>merge</code> の制約</h2>
              <InfoPanel title="merge の使用制約一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>制約</th>
                      <th>詳細</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>使用可能な場所</td><td><code>if</code> のケース内のみ。<code>fork</code> パス内・<code>if</code> の外は不可</td></tr>
                    <tr><td>飛び先の方向</td><td>前方（下流）のみ。後方（上流）への指定は不可</td></tr>
                    <tr><td>飛び先の指定</td><td><code>id:</code> のみ有効。<code>label:</code> は使用不可</td></tr>
                    <tr><td><code>id:</code> の存在</td><td>指定した <code>id:</code> がファイル内に存在しないとエラー</td></tr>
                    <tr><td><code>id:</code> のユニーク性</td><td>同じ <code>id:</code> 値を複数ステップに付けるとエラー</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                <code>merge</code> は <strong><code>if</code> のケース内でのみ</strong>使用できます。<code>fork</code> のパス内や <code>if</code> の外で使用するとエラーになります。また、<code>merge</code> の乱用はフローを読みにくくします。
              </Callout>
              <Dialog speaker="teacher">
                <code>merge</code> はとても便利ですが、乱用すると「スパゲッティフロー」になります。本当に必要な例外ケースのみに使いましょう。
              </Dialog>
              <Dialog speaker="a">
                全ての制約を一言でまとめると「<code>if</code> の中で前方の <code>id:</code> 指定ステップへ飛ぶ専用構文」ですね。
              </Dialog>
              <Dialog speaker="b">
                スパゲッティになりやすいという点は注意が必要ですね。<code>merge</code> を使うたびに「本当に必要か」と問い直す習慣が大事。
              </Dialog>
            </>
          ),
        },
        {
          title: "典型パターン：キャンセルパス",
          plainText:
            "典型パターン：キャンセルパス\nmerge の最もよく使われる例：注文キャンセル処理。通常フローと並列して処理できる最終ステップに直接ジャンプする。\n先生：取引完了ステップは「通常処理のあとも」「キャンセルのあとも」「エラーのあとも」必ず通る共通ステップです。merge でそこに飛ばすのが典型パターン。\nAくん：「全パスが合流する共通ステップ」にid:を付けて、例外パスからはmergeでそこに飛ぶ。シンプルかつ強力なパターンですね。\nBちゃん：キャンセルパスに arrow: dashed を使うとさらに「これはイレギュラー経路」という意図が視覚化できますね。",
          content: (
            <>
              <h2>典型パターン：キャンセルパス</h2>
              <CodeBlock
                code={`/line/
[role01: 注文受付]
[role01: 在庫確認]
[role02: 支払い処理]

if (注文ステータス) is (正常) than #green
  [role02: 発送指示]
  [role03: 追跡番号発行]
  [role02: 完了通知送付]

elseif (在庫不足) than #orange
  [role01: 在庫不足通知]
  [role01: 再入荷待ち登録]
  arrow: dashed;
  merge: order-complete;   // 共通の完了ステップへ

elseif (キャンセル) than #red
  [role01: キャンセル受付]
  [role04: 返金処理]
  [role01: キャンセル通知]
  arrow: dashed;
  merge: order-complete;   // 同じ共通完了ステップへ

else
  [role01: エラー記録]
  [role04: 手動対応依頼]
  arrow: dashed;
  merge: order-complete;
endif

// ▼ すべてのパスが合流する共通ステップ
[role01: 注文完了記録]
id: order-complete;
label: 注文完了;
[role04: 操作ログ保存]
[role01: ダッシュボード更新]`}
              />
              <MermaidDiagram
                chart={`flowchart TD
  A[注文受付] --> B[在庫確認] --> C[支払い処理]
  C --> D{{"注文ステータス◇"}}
  D -->|正常🟢| E[発送指示]
  E --> F[追跡番号発行]
  F --> G[完了通知]
  G --> M{{"マージ◇"}}
  M --> DONE[注文完了記録]
  D -->|在庫不足🟠| H[在庫不足通知]
  H --> DONE
  D -->|キャンセル🔴| I[キャンセル受付]
  I --> J[返金処理]
  J --> DONE
  D -->|その他| K[エラー記録]
  K --> DONE
  DONE --> L[操作ログ保存]`}
              />
              <Dialog speaker="teacher">
                「全パスが合流する共通ステップ」に <code>id:</code> を付けて、例外パスからは <code>merge</code> でそこに飛ばすのが典型パターンです。
              </Dialog>
              <Dialog speaker="a">
                シンプルかつ強力なパターンですね。通常フローは <code>endif</code> を経由し、例外フローは直接完了ステップに飛ぶ。
              </Dialog>
              <Dialog speaker="b">
                キャンセルパスに <code>arrow: dashed;</code> を使うとさらに「これはイレギュラー経路」という意図が視覚化できますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "コメントの活用",
          plainText:
            "コメントの活用 — // と ***\n// をライン先頭に書くと、/line/ セクション内でコメント行として扱われる（無視されるが Format で次の行に紐付けられる）。\n*** をライン先頭に書くと、セクションを問わず完全に無視される。\n先生：// のコメントはデシジョンの背景・ケースの意図・例外パスの理由などをフロー定義の近くに書いておくのに使います。\nAくん：// コメントが次の行に紐付けられるというのは、例えば // キャンセル → [キャンセル受付] の並び順を保持するということですね。\nBちゃん：複雑なフローほどコメントが大事。特に merge の飛び先の id がどこにあるかを // で説明しておくと後で読み返しやすそう。",
          content: (
            <>
              <h2>コメントの活用</h2>
              <CodeBlock
                code={`/line/
// ===================================
// 受発注完了処理フロー（v2.1）
// 更新：2025-06-01 / 担当：田中
// ===================================

[role01: 受注確認]

// 与信チェック：3回失敗で自動キャンセル
if (与信チェック) is (通過) than #green
  [role02: 注文確定処理]

elseif (要確認) than #orange
  // 担当者による手動確認フロー
  [role01: 手動確認依頼]
  [role04: 上長確認入力]
  [loop]               // 確認完了まで繰り返し

elseif (キャンセル自動) than #red
  // 3回失敗による自動キャンセル — id: cancel-end にジャンプ
  [role01: 自動キャンセル登録]
  arrow: dashed;
  merge: cancel-end;   // ← 下の id: cancel-end に飛ぶ
endif

[role01: 確定完了]

// キャンセルケースはここに合流
[role01: 処理終了記録]
id: cancel-end;
label: 処理終了;

*** 以下は廃止済みのコード例 — 完全無視される
*** [role01: 旧キャンセルフロー]`}
              />
              <Dialog speaker="teacher">
                <code>//</code> のコメントはデシジョンの背景・ケースの意図・例外パスの理由などをフロー定義の近くに書いておくのに使います。
              </Dialog>
              <Dialog speaker="a">
                <code>//</code> コメントが次の行に紐付けられるというのは、Format が並び順を保持するということですね。
              </Dialog>
              <Dialog speaker="b">
                複雑なフローほどコメントが大事。特に <code>merge</code> の飛び先 <code>id</code> がどこにあるかを <code>//</code> で説明しておくと後で読み返しやすそう。
              </Dialog>
              <Callout variant="tip">
                <code>***</code> はセクションを問わず完全に無視されます。廃止したコード例・作業中メモなどを残したい場合は <code>***</code> でコメントアウトしましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "複合フロー例",
          plainText:
            "複合フロー例 — 全構文を組み合わせる\nif + fork + section + branch + merge を全部使った本格的な受発注処理フロー。\n先生：これが実際の業務フローに近い複雑さです。各構文の役割を意識しながら読んでください。\nAくん：if で注文種別を分岐、fork で並行後処理、section で監査ブロックをグループ化、branch で配送支線、merge でキャンセル早期終了。全部が出てきますね。\nBちゃん：最初見ると複雑に感じますが、各構文の役割を知っていれば「この枠は視覚グループ」「この入矢なしは支線」と読み解けますね。",
          content: (
            <>
              <h2>複合フロー例 — 全構文の組み合わせ</h2>
              <CodeBlock
                code={`/line/
// 受発注処理フロー（全構文使用例）
[role01: 受注データ受信]

// STEP1: データ検証 + キャンセルの早期終了
if (データ検証) is (正常) than #green
  [role01: 受注登録]

elseif (キャンセル要求) is (あり) than #red
  [role01: キャンセル受付]
  [role04: キャンセル通知]
  arrow: dashed;
  merge: order-done;        // 完了ステップに前方ジャンプ

else
  [role01: エラーアラート]
  merge: order-done;
endif

// STEP2: 在庫確認（セクションでまとめる）
section (在庫・発注処理) #blue
  [role03: 在庫引き当て]
  if (在庫) is (不足) than #orange
    [role03: 緊急発注]
    [role04: 仕入れ承認依頼]
    [loop]                  // 承認待ちで再確認
  else
    [role03: 在庫確定]
  endif
end-section

// STEP3: 配送支線（branch）
branch (配送業者連携支線)
  [role05: 配送予約]
  [role05: 追跡番号発行]
end-branch

// STEP4: 並行後処理（fork）
fork #blue
  // 通知パス
  [role02: 注文確認メール]
  [role02: SMS通知]
and #green
  // 財務パス（sectionでまとめる）
  section (財務処理) #orange
    [role06: 請求書発行]
    [role06: 売上仕訳登録]
  end-section
and #gray
  // 監査パス
  [role04: 操作ログ記録]
  [role04: 監査証跡保存]
endfork

// STEP5: 全パスの共通完了（mergeの着地点）
[role01: 注文完了確定]
id: order-done;
label: 注文完了;
[role01: ダッシュボード更新]`}
              />
              <Figure
                src="image/04-complex-flow.webp"
                alt="全構文（if・merge・section・branch・fork）を組み合わせた複合受発注処理スイムレーン図。キャンセルケースの破線merge矢印、在庫処理の点線sectionボックス、配送支線のbranch（入矢なし）、並行後処理のforkスプリット/ジョインバーが全て見えている。"
                caption="全構文を組み合わせた複合フロー — if・merge・section・branch・fork の実装例"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                これが実際の業務フローに近い複雑さです。各構文の役割を意識しながら読んでください。
              </Dialog>
              <Dialog speaker="a">
                <code>if</code> で注文種別を分岐、<code>fork</code> で並行後処理、<code>section</code> で監査ブロックをグループ化、<code>branch</code> で配送支線、<code>merge</code> でキャンセル早期終了。全部出てきますね。
              </Dialog>
              <Dialog speaker="b">
                最初見ると複雑に感じますが、各構文の役割を知っていれば「この枠は視覚グループ」「この入矢なしは支線」と読み解けますね！
              </Dialog>
            </>
          ),
        },
        {
          title: "フロー制御の選択指針",
          plainText:
            "フロー制御の選択指針\nどの構文を選ぶかの判断基準をまとめます。\n「条件によってひとつだけ実行したい」→ if\n「すべてのパスを同時に実行したい」→ fork\n「ステップを視覚的にグループ化したい（流れは変えない）」→ section\n「メインフローに側道を追加して後で合流したい」→ branch\n「例外パスでendifをスキップして遠くに飛びたい」→ merge\n「同じケースを繰り返したい」→ [loop]\n先生：迷ったら「この処理は何がやりたいのか」という目的から考えてください。\nAくん：目的が決まれば構文が決まる、という発想で整理されていますね。覚えやすい。\nBちゃん：これを印刷して手元に置いておきたいくらい便利な一覧です！",
          content: (
            <>
              <h2>フロー制御の選択指針</h2>
              <InfoPanel title="構文の選択チャート" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>やりたいこと</th>
                      <th>使う構文</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>条件によってひとつのパスだけ実行したい</td><td><code>if / elseif / else / endif</code></td></tr>
                    <tr><td>すべてのパスを同時に実行したい</td><td><code>fork / and / endfork</code></td></tr>
                    <tr><td>ステップをグループ化（流れは変えない）</td><td><code>section / end-section</code></td></tr>
                    <tr><td>メインフローに側道を追加して合流</td><td><code>branch / end-branch</code></td></tr>
                    <tr><td>例外パスで遠くのステップに飛びたい</td><td><code>merge: id;</code>（if 内のみ）</td></tr>
                    <tr><td>同じケースをリトライしたい</td><td><code>[loop]</code>（if 内のみ）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                <strong>深いネストは避ける</strong>：3階層以上のネストは図の可読性を著しく下げます。複雑になったら<strong>フローを分割</strong>して別の図にすることを検討しましょう。<br />
                <strong>merge は最小限に</strong>：<code>merge</code> は便利ですが多用するとフローが追いにくくなります。「本当に例外か」を確認してから使いましょう。
              </Callout>
              <Dialog speaker="teacher">
                迷ったら「この処理は何がやりたいのか」という目的から考えてください。目的が決まれば構文が自然に決まります。
              </Dialog>
              <Dialog speaker="a">
                目的が決まれば構文が決まる、という発想で整理されていますね。覚えやすいです。
              </Dialog>
              <Dialog speaker="b">
                これを印刷して手元に置いておきたいくらい便利な一覧です！
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章では merge の完全な構文を学びました。merge は if ケース内から id: 指定の前方ステップへジャンプする専用構文。arrow: dashed; と組み合わせると破線矢印になります。制約は「if 内のみ・id: のみ指定可能・label: は不可」です。\nAくん：コース全体を通じて6つの構文を学びました。if・fork・section・branch・loop・merge のそれぞれの役割が明確になりました。\nBちゃん：最初は「こんなにたくさん覚えられるか」と思いましたが、各構文が「何をやりたいか」という目的から選べると分かって安心しました。\n先生：その通りです。完璧に覚えようとせず、実際にコードを書きながら「これはどの構文が適切か」を考える習慣が最大の習得法です。\nAくん：複合フロー例を自分で書き直してみることで、理解が定着しそうです。\nBちゃん：確認テストをクリアして、コース修了を目指します！",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章では <code>merge</code> の完全な構文を学びました。<code>merge</code> は <code>if</code> ケース内から <code>id:</code> 指定の前方ステップへジャンプする専用構文。<code>arrow: dashed;</code> と組み合わせると破線矢印になります。
              </Dialog>
              <Dialog speaker="a">
                コース全体を通じて6つの構文を学びました。<code>if</code>・<code>fork</code>・<code>section</code>・<code>branch</code>・<code>loop</code>・<code>merge</code> のそれぞれの役割が明確になりました。
              </Dialog>
              <Dialog speaker="b">
                最初は「こんなにたくさん覚えられるか」と思いましたが、各構文が「何をやりたいか」という目的から選べると分かって安心しました！
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。完璧に覚えようとせず、実際にコードを書きながら「これはどの構文が適切か」を考える習慣が最大の習得法です。
              </Dialog>
              <Dialog speaker="a">
                複合フロー例を自分で書き直してみることで、理解が定着しそうです。
              </Dialog>
              <Dialog speaker="b">
                確認テストをクリアして、コース修了を目指します！
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 merge: id; が使える場所として正しいのは？→ if のケース内のみ。fork パス内や if の外では使えない\nQ2 merge: の飛び先の指定方法として正しいのは？→ id: で設定した値のみ指定可能。label: は使用不可\n今日のひとこと：merge は if の中だけで使える前方ジャンプ。id: で飛び先を指定し、label: は使えないことを覚えておきましょう。",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={1}
                explanation="merge: id; は if のケース内でのみ使用できます。fork のパス内（and ブロック内）や if の外に書くとエラーになります。if のケース内から endif をスキップして前方の id: 指定ステップに飛ぶための専用構文です。"
                question={<strong><code>merge: id;</code> が使える場所として正しいのは？</strong>}
                options={[
                  "どこでも使える（if の外・fork パス内でも有効）",
                  "if のケース内のみ。fork パス内や if の外では使えない",
                  "fork のパス内のみ（and ブロック内）",
                ]}
              />
              <Quiz
                answer={2}
                explanation="merge: の飛び先は id: で設定した値のみ指定できます。label: はフロー図上の表示名であり、内部識別子ではないため merge: の飛び先として使用できません。id: はファイル全体でユニークである必要があります。"
                question={<strong><code>merge:</code> の飛び先の指定方法として正しいのは？</strong>}
                options={[
                  "label: で設定した値を指定する",
                  "ステップのインデックス番号で指定する",
                  "id: で設定した値のみ指定可能。label: は使用不可",
                ]}
              />
              <Dialog speaker="closing">
                <code>merge</code> は <code>if</code> の中だけで使える前方ジャンプ。<code>id:</code> で飛び先を指定し、<code>label:</code> は使えないことを覚えておきましょう。これでコース全5章の学習が完了です！6つのフロー制御構文を組み合わせて、表現力豊かなスイムレーン図を描いてみてください！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(MergeAdvancedLesson);
