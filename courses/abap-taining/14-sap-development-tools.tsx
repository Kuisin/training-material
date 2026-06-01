import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "SAP開発ツール — SE38・ショートカット・デバッグ・トランザクション",
  meta: "初学者 · 25分",
};

export default function SapDevelopmentToolsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "14-sap-development-tools", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "SAP開発ツール\n日々の開発で使う画面操作・デバッグ・主要トランザクションを、演習課題に依存しない形で整理します。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・SE38での作成〜構文チェック〜有効化〜実行のサイクル\n・エディタ・ショートカット・ヘルプの使い方\n・デバッガの基本操作\n・よく使うトランザクションと汎用モジュールの位置づけ",
          content: (
            <>
              <hgroup>
                <h1>SAP開発ツール</h1>
                <p>
                  日々の開発で使う画面操作・デバッグ・主要トランザクションを、
                  <strong>演習課題に依存しない</strong>形で整理します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
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
                <li>デバッガの基本操作（ブレークポイント・ステップ実行）</li>
                <li>よく使うトランザクションと汎用モジュールの位置づけ</li>
                <li>アドオンテーブル（ドメイン → データエレメント → テーブル）と DB 更新の基本</li>
              </ul>
              <Callout variant="note">
                具体的な課題の手順・プログラム名は<strong>別資料（演習）</strong>で進めます。ここでは「どの道具を、何のために使うか」だけを押さえます。
              </Callout>
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
                演習の答えをそのまま探すのではなく、「<strong>なぜそのエラーか</strong>」を理解する調べ方を身につけることが、研修後の独力につながります。
              </Callout>
            </>
          ),
        },
        {
          title: "デバッグ",
          plainText:
            "デバッグの基本\nデバッグ＝プログラムの動きを一時停止して、変数の値や処理の流れを確認すること。\n手順：ブレークポイント → コマンド欄に /h でデバッガ起動 → ステップ実行 → 値確認\nF5ステップ F6サブルーチン飛ばし F7戻る F8続行",
          content: (
            <>
              <h2>デバッグの基本</h2>
              <p>
                <strong>デバッグ</strong>とは、プログラムの実行を一時停止し、
                変数の値や処理の流れを確認してバグを特定・修正することです。
              </p>
              <ol>
                <li>止めたい行に<strong>ブレークポイント</strong>を設定</li>
                <li>
                  実行前にコマンド欄へ <code>/h</code> と入力して<strong>デバッガを起動</strong>（次の実行からデバッグモード）
                </li>
                <li>ステップ実行で1行ずつ進め、変数ウィンドウで値を確認</li>
              </ol>
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
              <Dialog speaker="a">
                <code>WRITE</code> で値を出すより、ブレークポイントのほうがループの途中などでも正確に追えますね。
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
            "主要トランザクション\n開発：SE38プログラム SE37 Function SE11データ定義 SE16Nテーブル参照\nファイル：AL11サーバ参照 CG3Yダウンロード CG3Zアップロード\n次章で論理ファイル・ジョブ・BDCを扱う。",
          content: (
            <>
              <h2>主要トランザクション</h2>
              <p>開発とファイル連携で、まず名前だけ押さえておく一覧です。詳細は次章（ファイル・ジョブ）でも触れます。</p>
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
            "データ辞書の作成順\nアドオンテーブルは SE11 で、ドメイン→データエレメント→テーブルの順が基本。ドメイン＝型と桁、DE＝項目定義、テーブル＝データ保持。主キー・拡張不可など技術設定もここで決める。演習の具体名は別資料。",
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
              <Callout variant="note">
                演習で作るテーブル名・項目名は<strong>別資料</strong>に従います。
                ここでは「何を、どの順で作るか」だけを押さえます。
              </Callout>
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
            "対話で整理\n先生：SE38の保存→チェック→有効化→実行、F1とデバッガ、トランザクション一覧——道具の地図。\nBちゃん：演習は別資料、ここは辞書みたいで助かる。\nAくん：FILE_GET_NAMEはファイル連携、ALVは一覧表示、と用途で束ねる。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章は「道具の地図」です。<code>SE38</code> のサイクル、ショートカット、<code>F1</code>、デバッガ、主要トランザクション——迷ったらここに戻ってください。
              </Dialog>
              <Dialog speaker="b">
                演習の手順は別資料なので、ここは辞書として使えそうです。
              </Dialog>
              <Dialog speaker="a">
                汎用モジュールも、名前より<strong>用途</strong>（数値チェック・パス取得・ALV）で束ねて覚えると実務で探しやすいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 実行直前に忘れがちな操作は？→ 有効化\nQ2 F6の意味は？→ サブルーチンの中に入らず飛ばす\nQ3 汎用モジュールの呼び方は？→ CALL FUNCTION\n今日のひとこと：道具は増えても、SE38のサイクルとF1があれば怖くない。",
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
                answer={0}
                explanation="汎用モジュールは CALL FUNCTION で呼び出します。第11章の BAPI 呼び出しも同じ形です。"
                question={<strong>汎用モジュールをプログラムから呼び出す命令は？</strong>}
                options={["CALL FUNCTION", "SELECT", "WRITE"]}
              />
              <Dialog speaker="closing">
                道具は増えても、<code>SE38</code> のサイクルと <code>F1</code> があれば怖くない。演習ではここで学んだ地図を手元に置いて進みましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(SapDevelopmentToolsLesson);
