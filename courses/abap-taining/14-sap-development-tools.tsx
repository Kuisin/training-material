import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  InfoPanel,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "SAP開発ツール — SE38・デバッグ・履歴確認・トランザクション",
  meta: "初学者 · 35分",
};

export default function SapDevelopmentToolsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "14-sap-development-tools", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "SAP開発ツール\n日々の開発で使う画面操作・デバッグ・履歴確認・主要トランザクションを整理します。\n⏱ 35分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・SE38での作成〜構文チェック〜有効化〜実行のサイクル\n・エディタ・ショートカット・ヘルプの使い方\n・デバッガの基本操作と sy-subrc などの追い方（GUI操作手順付き）\n・SE16N・ST22・バージョン管理による履歴確認\n・よく使うトランザクションと汎用モジュールの位置づけ",
          content: (
            <>
              <hgroup>
                <h1>SAP開発ツール</h1>
                <p>
                  日々の開発で使う画面操作・デバッグ・<strong>履歴確認</strong>・主要トランザクションを整理します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "35分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>
                  <code>SE38</code> での作成 → 構文チェック → 有効化 → 実行のサイクル
                </li>
                <li>エディタ・ショートカット・ヘルプ（<code>F1</code>）の使い方</li>
                <li>デバッガの基本操作（ブレークポイント・ステップ実行・<code>sy-subrc</code> の確認）</li>
                <li>
                  <strong>履歴確認</strong> … 登録結果（<code>SE16N</code>）、実行エラー（<code>ST22</code>）、プログラム変更（バージョン管理）の<strong>GUI操作手順</strong>
                </li>
                <li>よく使うトランザクションと汎用モジュールの位置づけ</li>
                <li>アドオンテーブル（ドメイン → データエレメント → テーブル）と DB 更新の基本</li>
              </ul>
            </>
          ),
        },
        {
          title: "SE38の開発サイクル",
          plainText:
            "SE38での開発サイクル\nレポートプログラムは SE38 で作成・保守する。保存→構文チェック→有効化→実行の順を習慣にする。\n属性：実行可能プログラム／テスト用は $TMP パッケージもよく使う\nflowchart：編集・保存 → 構文チェック → 有効化 → 実行(F8) → 結果確認",
          content: (
            <>
              <h2>
                <code>SE38</code> での開発サイクル
              </h2>
              <p>
                レポートプログラムはトランザクション <code>SE38</code>（ABAPエディタ）で作成・保守します。
                第3章の「作る → 実行する → 結果を見る」に、SAPでは次の<strong>公式な手順</strong>が対応します。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  A[編集・保存] --> B[構文チェック]
  B --> C[有効化]
  C --> D[実行 F8]
  D --> E[結果確認]
  E -->|修正| A`}
              />
              <InfoPanel
                title="新規プログラムの属性（よく使う設定）"
                variant="reference"
                lead="名前の付け方はプロジェクトの命名規則に従います（例: Z または Y で始まるカスタムオブジェクト）。"
              >
                <ul>
                  <li>
                    <strong>タイプ</strong> … 実行可能プログラム（レポート）
                  </li>
                  <li>
                    <strong>ステータス</strong> … テストプログラム（学習・検証用）
                  </li>
                  <li>
                    <strong>パッケージ</strong> … 一時保存なら <code>$TMP</code>（ローカルオブジェクト）を使うことが多い
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                「保存したのに動かない」は、多くの場合<strong>有効化を忘れた</strong>パターンです。実行の直前に構文チェックと有効化をセットで覚えましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "エディタとショートカット",
          plainText:
            "エディタとショートカット\nABAPエディタには新旧2種類あり、新版が推奨。切替は SE38 → ユーティリティ → 設定。\nGUI: F1ヘルプ F3戻る F4検索 F8実行\nエディタ: Ctrl+S保存 Ctrl+F2構文チェック Ctrl+F3有効化",
          content: (
            <>
              <h2>エディタとショートカット</h2>
              <p>
                ABAPエディタには新旧2種類あり、<strong>新版エディタ</strong>が推奨されます。
                切り替えは <code>SE38</code> → ユーティリティ → 設定 から行えます。
              </p>
              <InfoPanel title="GUI（画面全体）" variant="reference" lead="迷ったら F1 と F8 を覚えるところからで十分です。">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>F1</code>
                      </td>
                      <td>ヘルプ（カーソル位置の項目説明）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F3</code>
                      </td>
                      <td>戻る</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F4</code>
                      </td>
                      <td>検索（入力補助・値の一覧）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F8</code>
                      </td>
                      <td>実行</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="エディタ" variant="reference" lead="保存・チェック・有効化はキー操作に慣れると速いです。">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>内容</th>
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
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                ショートカットは最初は覚えきれなくても、<code>F1</code> と <code>F8</code> だけでもかなり助かりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "問題解決とヘルプ",
          plainText:
            "問題解決とヘルプ\nF1で構文・項目の公式ヘルプ。それでも分からなければメッセージ番号や英語キーワードで検索（英語の方が情報が多いことが多い）。\n先生：エラーをそのままコピーして調べる習慣が、独力で伸びるコツ。",
          content: (
            <>
              <h2>問題解決とヘルプ</h2>
              <p>
                エラーや未知の構文にぶつかったときは、次の順で調べると効率的です。
              </p>
              <ol>
                <li>
                  <code>F1</code> … カーソル位置の構文・項目の公式ヘルプ
                </li>
                <li>
                  メッセージの<strong>番号</strong>（例: <code>E</code> や <code>S</code> で始まるコード）で検索
                </li>
                <li>
                  社内ナレッジ・インターネット検索（<strong>英語キーワード</strong>のほうが情報が多いことが多い）
                </li>
              </ol>
              <Dialog speaker="teacher">
                「エラーメッセージをそのままコピーして調べる」——地味ですが、実務でいちばん効く習慣です。最初は時間がかかっても、2回目以降が速くなります。
              </Dialog>
              <Callout variant="warning">
                答えをそのまま探すのではなく、「<strong>なぜそのエラーか</strong>」を理解する調べ方を身につけましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "デバッグ",
          plainText:
            "デバッグの基本\nデバッグ＝プログラムの動きを一時停止して、変数の値や処理の流れを確認すること。\n手順：ブレークポイント → コマンド欄に /h でデバッガ起動 → ステップ実行 → 値確認\n/h で開始、/n で終了。F5ステップ F6サブルーチン飛ばし F7戻る F8続行",
          content: (
            <>
              <h2>デバッグの基本</h2>
              <p>
                <strong>デバッグ</strong>とは、プログラムの実行を一時停止し、
                変数の値や処理の流れを確認してバグを特定・修正することです。
              </p>
              <Figure
                src="image/14-debug-flow.webp"
                alt="SE38でブレークポイントを置き、/h でデバッガ起動、F5/F6でステップ実行し、変数ウィンドウで値を確認する一連の流れ。"
                caption="止める → 起動(/h) → ステップ → 値を見る"
                kind="diagram"
              />
              <ol>
                <li>
                  <code>SE38</code> で止めたい行の行番号をクリックして<strong>ブレークポイント</strong>を設定
                </li>
                <li>
                  実行前にコマンド欄へ <code>/h</code> と入力して<strong>デバッガを起動</strong>（次の実行からデバッグモード）
                </li>
                <li>ステップ実行で1行ずつ進め、変数ウィンドウで値を確認</li>
                <li>
                  終わったら <code>/n</code> でデバッグモードを<strong>終了</strong>（次回は通常実行に戻る）
                </li>
              </ol>
              <InfoPanel title="操作手順（SE38 → デバッガ）" variant="reference">
                <ol>
                  <li>
                    コマンド欄に <code>SE38</code> と入力 → <kbd>Enter</kbd>
                  </li>
                  <li>
                    プログラム名を入力 → <strong>表示</strong>（または <strong>変更</strong>）
                  </li>
                  <li>
                    止めたい行の<strong>行番号の左</strong>をクリック → 赤い丸（ブレークポイント）。もう一度クリックで解除
                  </li>
                  <li>
                    コマンド欄に <code>/h</code> と入力 → <kbd>Enter</kbd>（デバッグモード ON）
                  </li>
                  <li>
                    <strong>実行</strong>（<code>F8</code>）… 選択画面が出たら条件を入力して再実行
                  </li>
                  <li>
                    ブレークポイントで停止 → デバッガ画面が開く → <code>F5</code> / <code>F6</code> でステップ実行
                  </li>
                  <li>
                    左ペインの <strong>Variables</strong>（変数）で <code>sy-subrc</code> や作業領域の値を確認
                  </li>
                  <li>
                    終了時 … デバッガを閉じるか <code>F8</code> で続行。デバッグモードを切るときはコマンド欄に <code>/n</code> → <kbd>Enter</kbd>
                  </li>
                </ol>
              </InfoPanel>
              <InfoPanel title="デバッガのステップ操作" variant="reference" lead="F5 と F6 の違いだけ先に押さえれば十分です。">
                <table>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>F5</code>
                      </td>
                      <td>ステップ実行（1行ずつ）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F6</code>
                      </td>
                      <td>サブルーチン・関数の<strong>中に入らず</strong>飛ばす</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F7</code>
                      </td>
                      <td>呼び出し元へ戻る</td>
                    </tr>
                    <tr>
                      <td>
                        <code>F8</code>
                      </td>
                      <td>続行（次のブレークポイントまで）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="note">
                実行中の画面からデバッグに入る場合も、コマンド欄に <code>/h</code> を入力してから再実行します。
                バッチジョブのデバッグは別の手順（次章で概要）ですが、考え方は同じです。
              </Callout>
              <Dialog speaker="a">
                <code>WRITE</code> で値を出すより、ブレークポイントのほうがループの途中などでも正確に追えますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "デバッグで見るポイント",
          plainText:
            "デバッグで見るポイント\nSELECT・CALL FUNCTION・READ TABLE の直後は sy-subrc を確認（0=成功）。\n内部テーブルは変数ウィンドウでダブルクリックして中身を展開。\nBAPI 後は RETURN テーブルと sy-subrc の両方を見る（第11章）。\n先生：止まった行の前後3行と、直前の sy-subrc が最初のチェックポイント。",
          content: (
            <>
              <h2>デバッグで見るポイント</h2>
              <p>
                ブレークポイントで止まったら、<strong>どの変数を見るか</strong>を決めると調査が速くなります。
                このコースでよく使う確認ポイントを整理します。
              </p>
              <InfoPanel title="まず見るもの" variant="reference" lead="「止まった行の直前で何が起きたか」を sy-subrc から読む習慣をつけましょう。">
                <table>
                  <thead>
                    <tr>
                      <th>タイミング</th>
                      <th>見るもの</th>
                      <th>意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>SELECT</code> の直後
                      </td>
                      <td>
                        <code>sy-subrc</code>
                      </td>
                      <td>
                        <code>0</code> … 1件以上取得／<code>4</code> … 該当なし（第6章）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>READ TABLE</code> の直後
                      </td>
                      <td>
                        <code>sy-subrc</code> / <code>sy-tabix</code>
                      </td>
                      <td>見つかったか、何行目か</td>
                    </tr>
                    <tr>
                      <td>
                        <code>CALL FUNCTION</code> の直後
                      </td>
                      <td>
                        <code>sy-subrc</code> / <code>RETURN</code>
                      </td>
                      <td>例外番号と BAPI のメッセージ（第11章）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>LOOP</code> 中
                      </td>
                      <td>
                        <code>sy-tabix</code> / 作業領域
                      </td>
                      <td>何行目を処理中か、行の中身</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <p>
                内部テーブル（<code>lt_*</code>）は、デバッガの変数一覧で<strong>ダブルクリック</strong>すると
                行ごとの中身を展開できます。<code>WRITE</code> では見えにくい「ループの3行目だけ」もここで確認できます。
              </p>
              <InfoPanel title="操作手順（デバッガ画面）" variant="reference" lead="止まったあと、画面のどこを触るか。">
                <ol>
                  <li>
                    左ペイン <strong>Variables</strong> … 変数名の横の値を読む（<code>sy-subrc</code> は一覧をスクロールするか、名前で探す）
                  </li>
                  <li>
                    内部テーブル（例: <code>LT_BSEG</code>）を<strong>ダブルクリック</strong> → 行一覧ウィンドウが開く
                  </li>
                  <li>
                    行一覧で行番号を選ぶ → その行の各項目の値を確認
                  </li>
                  <li>
                    BAPI 後 … <code>LT_RETURN</code> を展開し、<code>TYPE</code> が <code>E</code> の行がないか見る（第11章）
                  </li>
                  <li>
                    次の行へ … <code>F5</code>（1行ずつ）または <code>F6</code>（<code>PERFORM</code> / Function の中を飛ばす）
                  </li>
                  <li>
                    呼び出し元に戻る … <code>F7</code>（<code>FORM</code> や Function から抜けたあと）
                  </li>
                </ol>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`" ブレークポイントをこの行に置く例
SELECT SINGLE * FROM bkpf INTO ls_bkpf WHERE belnr = p_belnr.
" → sy-subrc が 4 なら「伝票が見つからない」

READ TABLE lt_bseg INTO ls_bseg WITH KEY buzei = lv_buzei.
" → sy-subrc <> 0 なら「明細行がない」

CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'
  ...
" → sy-subrc と lt_return の TYPE を確認`}
              />
              <Dialog speaker="teacher">
                実務では「止まった行の前後3行」と「直前の <code>sy-subrc</code>」を最初に見る——
                この習慣だけで、原因の8割はここで絞れます。
              </Dialog>
            </>
          ),
        },
        {
          title: "実行エラーの確認",
          plainText:
            "実行エラーの確認（ST22）\nプログラムが異常終了（ダンプ）したときは ST22 で履歴を見る。\nいつ・誰が・どのプログラムで・どの行で止まったかが残る。\nダンプ詳細：エラー種別、変数の値、呼び出し経路（スタック）。\n先生：ユーザーから止まったと言われたら、まず ST22 で自分のユーザーIDを絞る。",
          content: (
            <>
              <h2>実行エラーの確認（<code>ST22</code>）</h2>
              <p>
                プログラムが<strong>異常終了（ダンプ）</strong>したとき、SAP はエラー情報を自動で記録します。
                トランザクション <code>ST22</code>（ABAP ランタイムエラー）で、<strong>いつ・誰が・どのプログラムの何行目</strong>で止まったかを確認できます。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  A[プログラム異常終了] --> B[ST22 に記録]
  B --> C[日時・ユーザー・プログラム名]
  C --> D[ダンプ詳細を開く]
  D --> E[エラー行と変数を確認]`}
              />
              <InfoPanel title="ST22 で見る項目" variant="reference">
                <ul>
                  <li>
                    <strong>Runtime Errors</strong> … エラー種別（例: ゼロ除算、テーブル範囲外）
                  </li>
                  <li>
                    <strong>Program / Line</strong> … 止まったプログラム名と行番号 → <code>SE38</code> で該当行へ
                  </li>
                  <li>
                    <strong>Variables</strong> … 異常発生時点の変数値（デバッグと同様に中身を追える）
                  </li>
                  <li>
                    <strong>Call stack</strong> … どの <code>FORM</code> / Function から呼ばれたか（呼び出し経路）
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel title="操作手順（ST22）" variant="reference" lead="ダンプが出た直後に試す流れです。">
                <ol>
                  <li>
                    コマンド欄に <code>ST22</code> と入力 → <kbd>Enter</kbd>
                  </li>
                  <li>
                    一覧で <strong>自分のユーザー</strong>・<strong>今日の日付</strong>あたりから直近の行を探す（環境により絞込欄あり）
                  </li>
                  <li>
                    該当行を<strong>ダブルクリック</strong> → ダンプ詳細（Short Dump）画面
                  </li>
                  <li>
                    <strong>Program</strong>（プログラム名）と <strong>Line</strong>（行番号）をメモ → <code>SE38</code> で同じ行を開く
                  </li>
                  <li>
                    詳細画面の <strong>Variables</strong> / <strong>Active Variables</strong> で、異常時の変数値を確認
                  </li>
                  <li>
                    <strong>Call stack</strong>（呼び出しスタック）で、どの <code>FORM</code> から来たかをたどる
                  </li>
                  <li>
                    原因が分かったら … 該当行にブレークポイント → <code>/h</code> → 同じ条件で再実行してデバッグ
                  </li>
                </ol>
              </InfoPanel>
              <Callout variant="warning">
                ダンプは<strong>再現の手がかり</strong>です。ST22 で行番号を特定したら、同じ条件で
                ブレークポイントを置いてデバッグする——この2段構えが定番の調査手順です。
              </Callout>
              <Dialog speaker="teacher">
                「プログラムが止まった」と連絡が来たら、まず <code>ST22</code> で自分のユーザー ID を絞り込み、
                直近のダンプを開く。これだけで「再現前に何が起きたか」の9割は掴めます。
              </Dialog>
            </>
          ),
        },
        {
          title: "履歴の確認",
          plainText:
            "履歴の確認\n登録結果：SE16N でアドオンテーブル（ZIFLOG等）に OK/NG・伝票番号が残っているか。\n伝票本体：SE16N で BKPF/BSEG をキーで検索（第6・11章）。\nプログラム変更：SE38 → ユーティリティ → バージョン管理。\nバッチ結果：SM37（次章）。\nBちゃん：動いたかどうかをDBで確かめるのが履歴確認なんですね。",
          content: (
            <>
              <h2>履歴の確認</h2>
              <p>
                「プログラムを動かした<strong>あと</strong>」に、結果が正しく残っているかを確かめる操作も開発の基本です。
                第11章の登録フロー（取込 → BAPI → 履歴）とつながる確認方法を整理します。
              </p>
              <Figure
                src="image/14-history-check.webp"
                alt="履歴確認の3つの入口。SE16Nで取込履歴テーブルとBKPF/BSEGを照会、ST22で実行エラー、SE38のバージョン管理でプログラム変更履歴。"
                caption="結果の確認（SE16N）・エラーの確認（ST22）・変更の確認（バージョン管理）"
                kind="diagram"
              />
              <InfoPanel title="何を確認したいか → どこを見るか" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>確認したいこと</th>
                      <th>ツール</th>
                      <th>例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>取込・登録の<strong>結果</strong></td>
                      <td>
                        <code>SE16N</code>
                      </td>
                      <td>
                        アドオンテーブル（<code>ZIFLOG</code> 等）… OK/NG・伝票番号・エラー内容
                      </td>
                    </tr>
                    <tr>
                      <td>会計伝票<strong>本体</strong></td>
                      <td>
                        <code>SE16N</code>
                      </td>
                      <td>
                        <code>BKPF</code> / <code>BSEG</code> … 会社コード・伝票番号で検索（第6章）
                      </td>
                    </tr>
                    <tr>
                      <td>プログラムの<strong>変更履歴</strong></td>
                      <td>
                        <code>SE38</code> → ユーティリティ → バージョン管理
                      </td>
                      <td>いつ・誰が・どの版を有効化したか</td>
                    </tr>
                    <tr>
                      <td>実行<strong>エラー</strong></td>
                      <td>
                        <code>ST22</code>
                      </td>
                      <td>ダンプの日時・行番号・変数（前スライド）</td>
                    </tr>
                    <tr>
                      <td>バッチ<strong>ジョブ</strong>の結果</td>
                      <td>
                        <code>SM37</code>
                      </td>
                      <td>完了/エラー・スプール出力（次章で詳述）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <p>
                <code>SE16N</code> では、テーブル名を入力し、キー項目（ファイル ID・伝票番号など）で絞り込みます。
                登録プログラムのテスト後は、<strong>履歴テーブルに1行増えているか</strong>、
                成功時は <code>BKPF</code> に伝票が見えるか——この2点をセットで確認する習慣をつけましょう。
              </p>
              <InfoPanel title="操作手順（SE16N … 取込履歴の確認）" variant="reference" lead="第11章の ZIFLOG 等を見る例。">
                <ol>
                  <li>
                    コマンド欄に <code>SE16N</code> と入力 → <kbd>Enter</kbd>
                  </li>
                  <li>
                    初回のみ … 警告画面が出たら内容を確認し、チェックボックスにチェック → <strong>続行</strong>（環境により表示）
                  </li>
                  <li>
                    <strong>テーブル名</strong>欄に <code>ZIFLOG</code>（第11章の履歴表の例）を入力 → <strong>実行</strong> または <kbd>Enter</kbd>
                  </li>
                  <li>
                    フィールド選択 … 確認したい列（<code>STATUS</code>・<code>BELNR</code> 等）にチェック → <strong>実行</strong>
                  </li>
                  <li>
                    データ選択画面 … ファイル ID・会社コードなど<strong>キー項目</strong>に値を入力 → <strong>実行</strong>
                  </li>
                  <li>
                    結果一覧 … 行が増えているか、<code>STATUS</code> が OK/NG どちらか、伝票番号が入っているかを確認
                  </li>
                </ol>
              </InfoPanel>
              <InfoPanel title="操作手順（SE16N … 伝票本体の確認）" variant="reference" lead="登録成功後、BKPF に伝票があるか見る例。">
                <ol>
                  <li>
                    <code>SE16N</code> → テーブル名 <code>BKPF</code> → <strong>実行</strong>
                  </li>
                  <li>
                    選択画面 … <code>BUKRS</code>（会社コード）・<code>BELNR</code>（伝票番号）・<code>GJAHR</code>（会計年度）を入力 → <strong>実行</strong>
                  </li>
                  <li>
                    1行表示されればヘッダ存在。明細は同様に <code>BSEG</code> で <code>BELNR</code> 等を指定
                  </li>
                </ol>
              </InfoPanel>
              <InfoPanel title="操作手順（SE38 … プログラム変更履歴）" variant="reference">
                <ol>
                  <li>
                    <code>SE38</code> で対象プログラムを <strong>表示</strong>
                  </li>
                  <li>
                    メニュー <strong>ユーティリティ</strong> → <strong>バージョン管理</strong> → <strong>バージョン</strong>
                  </li>
                  <li>
                    版の一覧 … 版番号・<strong>変更者</strong>・<strong>日付/時刻</strong>を確認
                  </li>
                  <li>
                    行を選んで <strong>表示</strong> … その版のソースを読む（2版選んで <strong>比較</strong> も可能）
                  </li>
                </ol>
              </InfoPanel>
              <Callout variant="note">
                プログラム先頭の<strong>変更履歴コメント</strong>（第12・13章）は「なぜ変えたか」のメモ、
                <code>SE38</code> のバージョン管理は「いつ誰が有効化したか」の<strong>システム記録</strong>です。両方使い分けます。
              </Callout>
              <Dialog speaker="b">
                「動いた気がする」を<strong>DB で確かめる</strong>のが履歴確認なんですね。
                二重登録の調査も、まず <code>SE16N</code> で履歴キーを見るところから始まりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "操作チェックリスト",
          plainText:
            "操作チェックリスト\nデバッグ：SE38→行番号クリック→/h→F8→F5/F6→Variables→/n\nST22：ST22→行ダブルクリック→Program/Line→SE38で再デバッグ\nSE16N：テーブル名→実行→キー入力→結果一覧\n版管理：SE38→ユーティリティ→バージョン管理→バージョン",
          content: (
            <>
              <h2>操作チェックリスト</h2>
              <p>
                画面操作で迷ったとき用の<strong>最短手順</strong>です。詳細は前のスライドの InfoPanel を参照してください。
              </p>
              <InfoPanel title="デバッグ（最初の1回）" variant="reference">
                <p>
                  <code>SE38</code> → 行番号クリック（BP）→ <code>/h</code> → <code>F8</code> → 停止したら <code>F5</code>/<code>F6</code> → Variables → 終わったら <code>/n</code>
                </p>
              </InfoPanel>
              <InfoPanel title="異常終了後の調査" variant="reference">
                <p>
                  <code>ST22</code> → 直近行ダブルクリック → Program / Line をメモ → <code>SE38</code> で BP → <code>/h</code> → 再実行
                </p>
              </InfoPanel>
              <InfoPanel title="登録テスト後の確認" variant="reference">
                <p>
                  <code>SE16N</code> → <code>ZIFLOG</code> → キー入力 → STATUS/BELNR 確認 → 必要なら <code>BKPF</code> も同様
                </p>
              </InfoPanel>
              <InfoPanel title="誰がいつ直したか" variant="reference">
                <p>
                  <code>SE38</code> → ユーティリティ → バージョン管理 → バージョン → 変更者・日時を確認
                </p>
              </InfoPanel>
              <Callout variant="note">
                メニュー名やボタンラベルは SAP GUI の言語設定（日本語/英語）で多少異なります。
                見つからないときは <code>F1</code> でカーソル位置の項目名を確認してください。
              </Callout>
              <Dialog speaker="teacher">
                手順は最初はメモを見ながらで構いません。3回繰り返すと、<code>/h</code> と <code>SE16N</code> への入り方は体で覚えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "コーディングの進め方",
          plainText:
            "コーディングの進め方\n最重要：設計書・仕様を理解してから書く。小さく作って動かし、テストを繰り返す（第3章・第12章と同じリズム）。\n先生：一気に完成させようとすると、どこで壊れたか分からなくなる。",
          content: (
            <>
              <h2>コーディングの進め方</h2>
              <p>ツールの使い方とセットで、次の2つを習慣にします。</p>
              <ul>
                <li>
                  <strong>設計書・仕様を理解する</strong> … 何を入力し、何を取得し、何を出力するか（第1章のパイプライン）を先に整理する
                </li>
                <li>
                  <strong>小さく作ってテストを繰り返す</strong> … 一度に全部書かず、動く単位で確認する（第3章・第12章と同じリズム）
                </li>
              </ul>
              <Dialog speaker="teacher">
                一気に完成させようとすると、「どこで壊れたか」が分からなくなります。デバッガも、小さな単位で使うほうが効きます。
              </Dialog>
            </>
          ),
        },
        {
          title: "主要トランザクション",
          plainText:
            "主要トランザクション\n開発：SE38 SE37 SE11 SE16N SM30 SE80\n調査：ST22実行エラー SM37ジョブ\nファイル：AL11 CG3Y CG3Z\n次章で論理ファイル・ジョブ・BDCを扱う。",
          content: (
            <>
              <h2>主要トランザクション</h2>
              <p>開発・調査・ファイル連携で、まず名前だけ押さえておく一覧です。詳細は次章（ファイル・ジョブ）でも触れます。</p>
              <InfoPanel title="開発" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>Tr-cd</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>SE38</code>
                      </td>
                      <td>ABAPプログラム（レポートなど）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SE37</code>
                      </td>
                      <td>Function Module（汎用モジュール）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SE11</code>
                      </td>
                      <td>データ定義（テーブル・構造など）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SE16N</code>
                      </td>
                      <td>テーブル内容の参照（データブラウズ）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SM30</code>
                      </td>
                      <td>テーブルメンテナンス（マスタの手入力・確認）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SE80</code>
                      </td>
                      <td>オブジェクトナビゲータ（汎用グループなどの作成）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="調査・履歴確認" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>Tr-cd</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>ST22</code>
                      </td>
                      <td>ABAP ランタイムエラー（ダンプ）の一覧・詳細</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SM37</code>
                      </td>
                      <td>バックグラウンドジョブの実行履歴・ログ</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="ファイル（GUI）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>Tr-cd</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>AL11</code>
                      </td>
                      <td>アプリケーションサーバ上のディレクトリ・ファイル参照</td>
                    </tr>
                    <tr>
                      <td>
                        <code>CG3Y</code>
                      </td>
                      <td>サーバ → ローカル PC へダウンロード</td>
                    </tr>
                    <tr>
                      <td>
                        <code>CG3Z</code>
                      </td>
                      <td>ローカル PC → サーバへアップロード（バイナリモードが一般的）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "データ辞書の作成順",
          plainText:
            "データ辞書の作成順\nアドオンテーブルは SE11 で、ドメイン→データエレメント→テーブルの順が基本。ドメイン＝型と桁、DE＝項目定義、テーブル＝データ保持。主キー・拡張不可など技術設定もここで決める。",
          content: (
            <>
              <h2>データ辞書（<code>SE11</code>）の作成順</h2>
              <p>
                取込履歴や重複防止用の<strong>アドオンテーブル</strong>は、ABAP Dictionary で定義します。
                作成順を守ると、あとから項目を足し直す手間が減ります。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  D[ドメイン] --> E[データエレメント]
  E --> T[テーブル]`}
              />
              <InfoPanel title="オブジェクトの役割" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>オブジェクト</th>
                      <th>役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ドメイン</td>
                      <td>データ型・桁数・値の範囲</td>
                    </tr>
                    <tr>
                      <td>データエレメント</td>
                      <td>項目の意味・ラベル（画面・帳票の表示名）</td>
                    </tr>
                    <tr>
                      <td>テーブル</td>
                      <td>実際のデータを保持（主キー・技術設定を定義）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <p>
                テーブル定義では、<strong>主キー</strong>（重複を防ぐ組み合わせ）と、
                必要に応じて「拡張不可」などの技術設定を決めます。
                マスタのメンテナンスは <code>SM30</code>（テーブル更新ダイアログ）で行うことがありますが、
                連携プログラムからは <code>INSERT</code> 等で更新するのが一般的です。
              </p>
            </>
          ),
        },
        {
          title: "アドオンテーブルとDB更新",
          plainText:
            "アドオンテーブルとDB更新\n履歴用Z表へのINSERT/UPDATE/MODIFY/DELETE。更新後はCOMMIT WORKで確定、失敗時はROLLBACK。標準伝票テーブルへの直接INSERTはNG（第11章）。自社履歴だけ直接更新するイメージ。",
          content: (
            <>
              <h2>アドオンテーブルへの DB 更新</h2>
              <p>
                会計伝票<strong>本体</strong>は BAPI 経由（第11章）ですが、
                <strong>取込履歴・エラー記録</strong>など標準にない情報は、自社のアドオンテーブルに保存します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 履歴1件を追加
INSERT zif_hist FROM ls_hist.

" 既存行を更新
UPDATE zif_hist FROM ls_hist.

" あれば更新、なければ追加
MODIFY zif_hist FROM ls_hist.

" 条件に合う行を削除
DELETE FROM zif_hist WHERE file_id = lv_file_id.

" 更新を DB に反映（履歴だけの更新でも明示する）
COMMIT WORK.

" まとめて取り消すとき
ROLLBACK WORK.`}
              />
              <Dialog speaker="teacher">
                <code>zif_hist</code> は架空の履歴テーブル名です。実プロジェクトでは設計書の表名を使います。
                伝票登録の確定は BAPI 側のコミットとセットで考え、履歴の書き込みタイミングは
                「登録結果が分かってから」と第11章で整理しました。
              </Dialog>
            </>
          ),
        },
        {
          title: "自社汎用モジュール",
          plainText:
            "自社汎用モジュール\nSE80で汎用グループ、SE37でFunction Module。パラメータはIMPORT/EXPORT/CHANGING/EXCEPTIONS。TABLESは新規では非推奨。例外はRAISEまたはMESSAGE … RAISING。履歴登録・検証の共通化に使う。",
          content: (
            <>
              <h2>自社の汎用モジュール（<code>SE37</code>）</h2>
              <p>
                SAP 標準の Function に加え、プロジェクトでは<strong>自社の汎用モジュール</strong>を作り、
                履歴登録・行検証・重複チェックなどを <code>CALL FUNCTION</code> で共通化します。
                第10章の <code>FORM</code> より、<strong>プログラムをまたいで</strong>使える点が違います。
              </p>
              <InfoPanel title="パラメータの種別" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>種別</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>IMPORT</code>
                      </td>
                      <td>呼び出し側 → モジュールへ渡す（入力）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>EXPORT</code>
                      </td>
                      <td>モジュール → 呼び出し側へ返す（出力）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>CHANGING</code>
                      </td>
                      <td>入出力（渡した値を書き換えて返す）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>EXCEPTIONS</code>
                      </td>
                      <td>エラー種別（呼び出し側で <code>sy-subrc</code> を見る）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                パラメータ種別 <code>TABLES</code> はレガシーです。新規設計では
                <code>IMPORT</code> に内部テーブルを渡す形が一般的です（詳細はプロジェクト標準に従う）。
              </Callout>
              <CodeBlock
                language="ABAP"
                code={`" 呼び出し例（履歴登録を共通化）
CALL FUNCTION 'Z_LOG_INTERFACE_RESULT'
  EXPORTING
    is_key    = ls_key
    iv_status = 'OK'
    iv_belnr  = lv_belnr
  EXCEPTIONS
    duplicate = 1
    OTHERS    = 2.

IF sy-subrc <> 0.
  " 重複や更新失敗の処理
ENDIF.`}
              />
              <p>モジュール内部では、異常時に <code>RAISE</code> やメッセージ＋<code>RAISING</code> で呼び出し元に知らせます。</p>
            </>
          ),
        },
        {
          title: "汎用モジュールとチェーン",
          plainText:
            "汎用モジュールとチェーン\n汎用モジュール＝SAPが用意した共通処理。CALL FUNCTIONで呼ぶ（第11章）。\n例：NUMERIC_CHECK FILE_GET_NAME CONVERT_TO_LOCAL_CURRENCY REUSE_ALV_GRID_DISPLAY\nチェーン：CONSTANTSやDATAで共通部分をまとめて宣言できる。",
          content: (
            <>
              <h2>SAP 標準の汎用モジュール</h2>
              <p>
                <strong>汎用モジュール</strong>は、SAPが用意した再利用可能な処理です。
                第10・11章の <code>CALL FUNCTION</code> で呼び出します。すべて暗記する必要はなく、
                「こういう用途の道具がある」と知っておけば、設計書や既存コードから名前を辿れます。
              </p>
              <InfoPanel title="よく見る例（用途で覚える）" variant="reference">
                <ul>
                  <li>
                    <code>NUMERIC_CHECK</code> … 数値チェック
                  </li>
                  <li>
                    <code>FILE_GET_NAME</code> … 論理ファイル名から物理パスを取得（次章）
                  </li>
                  <li>
                    <code>CONVERT_TO_LOCAL_CURRENCY</code> … 為替・通貨換算
                  </li>
                  <li>
                    <code>REUSE_ALV_GRID_DISPLAY</code> … ALV 形式の一覧表示
                  </li>
                </ul>
              </InfoPanel>
              <h2>チェーン命令</h2>
              <p>
                同じキーワード（<code>TYPE</code> や <code>VALUE</code> など）を繰り返す宣言は、
                <strong>チェーン</strong>でまとめて書けます。読みやすさと入力の手間削減が目的です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`CONSTANTS:
  lc_flag_ok   TYPE c VALUE 'X',
  lc_flag_skip TYPE c VALUE space.

DATA:
  lv_count TYPE i,
  lv_name  TYPE string.`}
              />
              <Dialog speaker="a">
                チェーンは「共通の接頭辞を1回だけ書く」構文 sugar ですね。意味は通常の複数行宣言と同じです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：SE38のサイクル、F1、デバッガ、ST22/SE16Nでの履歴確認——道具の地図。\nBちゃん：トランザクション名は多いけど、用途で束ねると覚えやすい。\nAくん：止まったらST22、動いたかはSE16N、と用途で束ねる。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章は「道具の地図」です。<code>SE38</code> のサイクル、ショートカット、<code>F1</code>、デバッガ、
                <code>ST22</code> / <code>SE16N</code> での履歴確認——迷ったらここに戻ってください。
              </Dialog>
              <Dialog speaker="b">
                トランザクション名は多いですが、用途で束ねると辞書みたいに使えそうです。
              </Dialog>
              <Dialog speaker="a">
                調査も用途で束ねられますね。<strong>止まった</strong> → <code>ST22</code>、
                <strong>動いたか確認</strong> → <code>SE16N</code>、<strong>中身を追う</strong> → デバッガ。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 実行直前に忘れがちな操作は？→ 有効化\nQ2 F6の意味は？→ サブルーチンの中に入らず飛ばす\nQ3 取込結果の履歴確認は？→ SE16N\nQ4 汎用モジュールの呼び方は？→ CALL FUNCTION\n今日のひとこと：止まったらST22、結果はSE16N、中身はデバッガ。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="保存だけでは実行時のオブジェクトは更新されません。構文チェックのあと有効化（Activate）して、実行可能な状態にする必要があります。"
                question={<strong>SE38 でプログラムを保存したあと、実行する直前に忘れがちな操作は？</strong>}
                options={["ダウンロード", "テーブル削除", "有効化"]}
              />
              <Quiz
                answer={1}
                explanation="F6 はサブルーチンや Function の内部に入らず、1行で処理を終えた扱いにします。F5 は内部までステップ実行します。"
                question={<strong>デバッガで F6 の意味として正しいのは？</strong>}
                options={["1行ずつステップ実行する", "サブルーチンの中に入らず飛ばす", "プログラムを終了する"]}
              />
              <Quiz
                answer={1}
                explanation="取込・登録の結果（OK/NG・伝票番号など）はアドオンテーブルに保存されます。SE16N でテーブル内容を参照して確認します。ST22 は実行エラー（ダンプ）の確認用です。"
                question={<strong>第11章の取込履歴テーブルに、登録結果が残っているか確認するのに使うのは？</strong>}
                options={["ST22", "SE16N", "SM30"]}
              />
              <Quiz
                answer={0}
                explanation="汎用モジュールは CALL FUNCTION で呼び出します。第11章の BAPI 呼び出しも同じ形です。"
                question={<strong>汎用モジュールをプログラムから呼び出す命令は？</strong>}
                options={["CALL FUNCTION", "SELECT", "WRITE"]}
              />
              <Dialog speaker="closing">
                道具は増えても、<code>SE38</code> のサイクルと <code>F1</code> があれば怖くない。
                <strong>止まったら ST22、結果は SE16N、中身はデバッガ</strong>——この3つを手元に置いておきましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SapDevelopmentToolsLesson);
