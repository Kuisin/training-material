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
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "プログラムの直し方（デバッグ）— 非エンジニア向けの手順とよくあるエラー",
  meta: "初学者 · 25分",
};

export default function HowToDebugProgramLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "a5-how-to-debug-program", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "プログラムの直し方（デバッグ）\nコーディング経験がなくても使える、困ったときの進め方。手順・ベストプラクティス・よくあるエラーと直し方を、たとえ話中心で学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修（追加コンテンツ）\nこの章で学ぶこと\n・デバッグとは何か（探偵のように原因を絞る）\n・困ったときの8ステップ\n・初心者向けベストプラクティス\n・よくあるエラー7種と修正例\n・詳しい画面操作は「SAP開発ツール」へ",
          content: (
            <>
              <hgroup>
                <h1>プログラムの直し方（デバッグ）</h1>
                <p>
                  プログラミング未経験でも使える、<strong>「動かない・おかしい」ときの進め方</strong>です。
                  画面の細かい操作は別章に任せ、この章では<strong>考え方と手順</strong>を身につけます。
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
                <li>デバッグとは何か（<strong>探偵のように原因を絞る</strong>作業）</li>
                <li>困ったときの<strong>8ステップ</strong>（再現 → 記録 → 範囲を狭める）</li>
                <li>初心者向けの<strong>ベストプラクティス</strong></li>
                <li><strong>よくあるエラー7種</strong>と、修正の具体例</li>
                <li>ブレークポイントや <code>/h</code> などの<strong>画面操作</strong>は追加コンテンツ「SAP開発ツール」</li>
              </ul>
              <Callout variant="note">
                この章は<strong>コードを書けなくても読める</strong>内容です。
                「何を確認すべきか」が分かれば、先輩や講師に相談するときも会話が速くなります。
              </Callout>
              <Dialog speaker="b">
                エラー画面が英語だらけで、何から手をつければいいか分かりません…。
              </Dialog>
              <Dialog speaker="teacher">
                大丈夫です。まずは<strong>順番</strong>を覚えましょう。
                プロは「天才のひらめき」より、<strong>決まった手順で範囲を狭める</strong>ほうが多いです。
              </Dialog>
            </>
          ),
        },
        {
          title: "デバッグとは",
          plainText:
            "デバッグ＝探偵ごっこ\nプログラムにバグ（虫）がいる、というたとえから。デバッグは「虫を取り除く＝原因を見つけて直す」作業。\n病院の検査と同じ：症状（画面のエラー）→ どこで起きたか（行番号）→ その時の状態（変数の値）→ 治療（修正）。\nデバッグの道具：止める（ブレークポイント）、一歩ずつ進める（ステップ）、記録を見る（ST22）。操作の詳細は第14章（SAP開発ツール）。",
          content: (
            <>
              <h2>デバッグとは何か</h2>
              <p>
                <strong>デバッグ（debug）</strong>は、昔コンピュータの中に本物の虫が入って故障した話から来た言葉です。
                今は<strong>「プログラムの不具合（バグ）の原因を探して直す」</strong>という意味で使います。
              </p>
              <InfoPanel
                title="たとえ：病院の検査"
                variant="reference"
                lead="コードが分からなくても、この流れは同じです。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>病院</th>
                      <th>プログラム</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>症状（熱・痛み）</td>
                      <td>画面のエラーメッセージ・真っ白な帳票</td>
                    </tr>
                    <tr>
                      <td>どの臓器か</td>
                      <td>どの処理か（入力・取得・出力のどこか）</td>
                    </tr>
                    <tr>
                      <td>検査結果（数値）</td>
                      <td>変数の値（件数・日付・会社コードなど）</td>
                    </tr>
                    <tr>
                      <td>治療</td>
                      <td>ソースを直して、もう一度実行して確認</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                つまりデバッグは、<strong>当てずっぽうで直すのではなく、証拠を集めて原因を1つに絞る</strong>作業なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。SAP では「止めて中身を見る」「異常終了の記録（<code>ST22</code>）を読む」が代表的な道具です。
                キー操作の一覧は<strong>追加コンテンツ「SAP開発ツール」</strong>にまとめてあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "3つの困りごと",
          plainText:
            "困りごとは大きく3種類\n①動かない … 構文エラー・有効化忘れ。実行の前に止まる。\n②動くが結果がおかしい … 0件のまま進む、条件の取り違え、表示漏れ。\n③途中で落ちる（ダンプ） … 存在しない行を読む、ゼロ除算など。ST22に記録。\nまずどの種類か分類すると、次に見る場所が決まる。",
          content: (
            <>
              <h2>困りごとは、大きく3種類</h2>
              <p>最初に「どのタイプか」を分けると、次に何を見るかがはっきりします。</p>
              <InfoPanel title="3つのタイプ" variant="breakdown" lead="症状で分類するだけで、調査の入口が決まります。">
                <ul>
                  <li>
                    <strong>① 動かない</strong> … 実行ボタンを押しても進まない、赤いエラーがエディタに出る。
                    多くは<strong>書き方のミス</strong>や<strong>有効化忘れ</strong>
                  </li>
                  <li>
                    <strong>② 動くが、結果がおかしい</strong> … エラーは出ないのに、帳票が空・件数が違う・値が変。
                    多くは<strong>データが取れていない</strong>・<strong>条件の取り違え</strong>
                  </li>
                  <li>
                    <strong>③ 途中で落ちる（ダンプ）</strong> … 突然エラー画面で止まる。
                    <code>ST22</code> に「いつ・どの行で」が残る
                  </li>
                </ul>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart TD
  S[困った] --> T{どのタイプ?}
  T -->|①| A[構文チェック・有効化]
  T -->|②| B[入力→取得→出力を順に確認]
  T -->|③| C[ST22で行番号を特定]`}
              />
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="a1-sap-development-tools"
                slide={7}
                label="追加: ST22（実行エラー）の見方"
                variant="back"
                className="mt-4"
              />
            </>
          ),
        },
        {
          title: "8ステップ",
          plainText:
            "困ったときの8ステップ\n①同じ条件で再現する ②何をしたかメモ（日付・会社・件数）③直前に変えた行を思い出す ④入力→取得→加工→出力のどこか当てる ⑤最後に成功した処理の直後を疑う（sy-subrc）⑥小さく直してすぐ再実行 ⑦直ったら別条件でも試す ⑧分からなければメモを添えて相談。\n探偵の順番：現場→証拠→容疑者を絞る→1つずつ確認。",
          content: (
            <>
              <h2>困ったときの8ステップ</h2>
              <p>
                次の順番は、<strong>コーディング未経験でも</strong>使えるチェックリストです。
                毎回ゼロから悩まず、上から順に進めてください。
              </p>
              <InfoPanel title="8ステップ（チェックリスト）" variant="reference">
                <ol>
                  <li>
                    <strong>再現する</strong> … 同じ入力（会社コード・日付など）でもう一度実行する。
                    「たまに」は後回しにし、まず「毎回」を掴む
                  </li>
                  <li>
                    <strong>メモする</strong> … 日時・ユーザー・入力値・画面に出たメッセージ（そのままコピー）
                  </li>
                  <li>
                    <strong>直前の変更を思い出す</strong> … 今日直した行・コピペした行は最優先で疑う
                  </li>
                  <li>
                    <strong>パイプラインで場所を当てる</strong> … 入力 → 取得 → 加工 → 出力の<strong>どこか</strong>（第1章の地図）
                  </li>
                  <li>
                    <strong>「最後に成功した処理」の直後を見る</strong> … <code>SELECT</code> や <code>READ TABLE</code> のあとは
                    <code>SY-SUBRC</code>（成功かどうか）を確認したか
                  </li>
                  <li>
                    <strong>小さく直して、すぐ試す</strong> … 一度に10行変えない。1か所直したら再実行
                  </li>
                  <li>
                    <strong>別の条件でも試す</strong> … 日付を変える・件数が多いデータ・0件のデータ
                  </li>
                  <li>
                    <strong>それでも分からなければ相談</strong> … ①〜⑦のメモを添えると、助けてもらいやすい
                  </li>
                </ol>
              </InfoPanel>
              <Callout variant="tip">
                <strong>ベストプラクティス①</strong> … 「直したつもり」で終わらせず、
                <strong>同じ手順でもう一度実行</strong>して確認する。再現と確認はセットです。
              </Callout>
              <Dialog speaker="teacher">
                プロは最初から正解を当てません。<strong>範囲を半分ずつ狭める</strong>のが仕事です。
                8ステップは、そのための型です。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="01-overview"
                slide={2}
                label="第1章: 入力→取得→加工→出力の地図"
                variant="back"
                className="mt-4"
              />
            </>
          ),
        },
        {
          title: "ベストプラクティス",
          plainText:
            "初心者向けベストプラクティス\n・一度に大きく変えない（1か所直す→実行）\n・エラーメッセージをそのままコピーしてメモ\n・動いた直前の処理を疑う（SELECTの直後はsy-subrc）\n・WRITEで値を出すより、止めて見る（デバッガ）\n・本番の大量データの前に、少ない条件で試す\n・直ったら「なぜ直ったか」を一言で言えるようにする\n・人に聞く前に、再現手順とメモを用意する",
          content: (
            <>
              <h2>初心者向けベストプラクティス</h2>
              <ul>
                <li>
                  <strong>一度に大きく変えない</strong> … 複数行を直すと、どれが効いたか分からなくなる
                </li>
                <li>
                  <strong>エラーメッセージはコピーして残す</strong> … 英語でも、そのままが一番の手がかり
                </li>
                <li>
                  <strong>「直前の1行」に注目</strong> … 止まった行より、<strong>その1つ前</strong>で何が起きたか
                </li>
                <li>
                  <strong>データ取得のあとは必ず成功確認</strong> … <code>SELECT</code> の直後に
                  <code>IF sy-subrc &lt;&gt; 0</code> があるか（第6章）
                </li>
                <li>
                  <strong>少ないデータで試す</strong> … 日付を1日だけ・会社を1つだけ。原因が見えやすい
                </li>
                <li>
                  <strong>直ったら理由を言葉にする</strong> … 「日付条件が抜けていた」など。次に同じミスを防げる
                </li>
                <li>
                  <strong>相談するときはメモ付き</strong> … 再現手順・入力値・エラー全文・直前に変えた行
                </li>
              </ul>
              <Callout variant="warning">
                <strong>やりがちな落とし穴</strong> … 「とりあえず別の書き方に全部書き換える」
                は、原因が分からないまま別の不具合を生むことがあります。<strong>小さく直す</strong>を守りましょう。
              </Callout>
              <Dialog speaker="b">
                分からないときは、コードをいじるより<strong>メモを増やす</strong>ほうが良さそうですね。
              </Dialog>
              <Dialog speaker="teacher">
                その感覚、とても大事です。メモは未来の自分と、助けてくれる人へのギフトです。
              </Dialog>
            </>
          ),
        },
        {
          title: "小さく分けて疑う",
          plainText:
            "小さく分けて疑う（分割統治）\n「プログラム全体が壊れた」ではなく、「取得だけ」「出力だけ」と分ける。\n例：帳票が空→取得（SELECT）か出力（WRITE）か。取得なら条件か0件か。\nデバッガも、止める位置を1か所に絞ると効く。詳細は追加コンテンツ「分割統治」「SAP開発ツール」。",
          content: (
            <>
              <h2>小さく分けて疑う</h2>
              <p>
                大きな問題は、<strong>小さな疑い</strong>に分けると動けます（分割統治の考え方）。
                「全部おかしい」ではなく、「<strong>どの段だけ</strong>おかしいか」を決めます。
              </p>
              <InfoPanel title="帳票が空のときの分け方（例）" variant="breakdown">
                <ol>
                  <li>選択画面の値は、意図どおり入っているか（<strong>入力</strong>）</li>
                  <li>
                    <code>SELECT</code> のあと <code>sy-subrc</code> は 0 か（<strong>取得</strong> … 0 ならデータあり）
                  </li>
                  <li>
                    内部テーブルに行はあるか（<strong>加工</strong> … <code>SORT</code> や <code>DELETE</code> で消していないか）
                  </li>
                  <li>
                    <code>LOOP</code> と <code>WRITE</code> は実行されているか（<strong>出力</strong>）
                  </li>
                </ol>
              </InfoPanel>
              <div className="mt-4 flex flex-wrap gap-2">
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="a3-divide-and-conquer"
                  slide={2}
                  label="追加: 分割統治の考え方"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="a1-sap-development-tools"
                  slide={5}
                  label="追加: デバッガの基本操作"
                  variant="back"
                />
              </div>
            </>
          ),
        },
        {
          title: "エラー①有効化忘れ",
          plainText:
            "よくあるエラー① 有効化忘れ\n症状：保存したのに古い動きのまま、直したはずのメッセージが出ない。\n原因：SE38で保存だけして有効化（Ctrl+F3）していない。\n直し方：構文チェック→有効化→実行。テキストシンボルも別画面で有効化が必要なことがある。",
          content: (
            <>
              <h2>よくあるエラー ① 有効化を忘れた</h2>
              <InfoPanel title="症状" variant="reference">
                <ul>
                  <li>ソースは直したのに、実行結果が<strong>変わらない</strong></li>
                  <li>「さっき直したメッセージ」が出ない</li>
                </ul>
              </InfoPanel>
              <p>
                <strong>原因</strong> … SAP では保存と<strong>有効化（Activate）</strong>が別です。
                保存だけでは、実行時に使われるプログラムは更新されません。
              </p>
              <InfoPanel title="直し方" variant="reference">
                <ol>
                  <li>構文チェック（<code>Ctrl + F2</code>）で赤いエラーがないか確認</li>
                  <li>有効化（<code>Ctrl + F3</code>）</li>
                  <li>実行（<code>F8</code>）して再確認</li>
                </ol>
              </InfoPanel>
              <Callout variant="tip">
                テキストシンボル（画面の文言）を直したときは、<strong>テキスト側の有効化</strong>のあと、
                プログラム本体も有効化が必要です（第4章・第14章）。
              </Callout>
            </>
          ),
        },
        {
          title: "エラー②構文",
          plainText:
            "よくあるエラー② 構文エラー（書き方のミス）\n症状：実行前にエディタに赤線、構文チェックで止まる。\n原因：ピリオド忘れ、引用符の閉じ忘れ、タイポ（SELCTなど）。\n直し方：エラーをダブルクリックして行へ。直前に追加した行を重点確認。1行ずつ直して再チェック。",
          content: (
            <>
              <h2>よくあるエラー ② 構文エラー（書き方のミス）</h2>
              <InfoPanel title="症状" variant="reference">
                <ul>
                  <li>実行前に<strong>構文チェック</strong>で止まる</li>
                  <li>エディタに赤い表示・エラーメッセージ一覧</li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 悪い例：SELECT のスペルミス
SELCT * FROM bkpf INTO TABLE lt_bkpf.

" ❌ 悪い例：文末のピリオド忘れ
DATA lv_count TYPE i

" ✅ 直し方
SELECT * FROM bkpf INTO TABLE lt_bkpf.
DATA lv_count TYPE i.`}
              />
              <p>
                <strong>直し方</strong> … エラー一覧の行をダブルクリック → 該当行を直す → もう一度構文チェック。
                今日追加した行付近を<strong>最優先</strong>で見ます。
              </p>
            </>
          ),
        },
        {
          title: "エラー③0件のまま進む",
          plainText:
            "よくあるエラー③ データ0件なのにそのまま進む\n症状：エラーは出ないが帳票が空、またはおかしい集計。\n原因：SELECTの直後にsy-subrcを確認していない。\n直し方：SELECTの直後にIF sy-subrc <> 0でメッセージ＋処理終了。0件は異常ではないが、利用者に伝える必要がある。",
          content: (
            <>
              <h2>よくあるエラー ③ データが0件なのに、そのまま進む</h2>
              <InfoPanel title="症状" variant="reference">
                <ul>
                  <li>エラーは出ないが、<strong>帳票が真っ白</strong></li>
                  <li>「データがあるはず」なのに何も出ない</li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 悪い例：取得結果を確認せず LOOP
SELECT * FROM bkpf INTO TABLE lt_bkpf
  WHERE budat IN s_budat.
LOOP AT lt_bkpf INTO ls_bkpf.
  WRITE: / ls_bkpf-belnr.
ENDLOOP.

" ✅ 良い例：0件ならメッセージして終了
SELECT * FROM bkpf INTO TABLE lt_bkpf
  WHERE budat IN s_budat.
IF sy-subrc <> 0.
  MESSAGE '対象データはありません' TYPE 'S'.
  LEAVE LIST-PROCESSING.
ENDIF.`}
              />
              <p>
                <code>sy-subrc = 0</code> は「1件以上取れた」、<code>4</code> は「該当なし」です（第6章）。
                0件はバグではないこともありますが、<strong>利用者に伝える</strong>処理が必要です。
              </p>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="06-select-from-db"
                slide={5}
                label="第6章: SY-SUBRC の確認"
                variant="back"
                className="mt-4"
              />
            </>
          ),
        },
        {
          title: "エラー④入力と取得の不一致",
          plainText:
            "よくあるエラー④ 入力欄を足したがSELECTに反映していない\n症状：選択画面に会社コード欄があるのに絞られない、常に全部出る／常に0件。\n原因：PARAMETERSは追加したがWHEREに条件がない、または項目名のタイポ。\n直し方：入力・取得・出力の3か所をセットで確認（第12章の地図）。",
          content: (
            <>
              <h2>よくあるエラー ④ 入力はあるが、取得条件に反映していない</h2>
              <InfoPanel title="症状" variant="reference">
                <ul>
                  <li>画面に入力欄があるのに、<strong>絞り込みが効かない</strong></li>
                  <li>逆に、いつも0件になる</li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`" 選択画面には会社コードがある
PARAMETERS p_bukrs TYPE bkpf-bukrs.

" ❌ 悪い例：WHERE に bukrs がない → 入力しても無視される
SELECT * FROM bkpf INTO TABLE lt_bkpf
  WHERE budat IN s_budat.

" ✅ 良い例：入力と SELECT をセットで直す
SELECT * FROM bkpf INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs
    AND budat IN s_budat.`}
              />
              <Callout variant="note">
                第12章の<strong>「入力 → 取得 → 出力」3か所セット</strong>の考え方が、そのまま直し方になります。
              </Callout>
            </>
          ),
        },
        {
          title: "エラー⑤項目名ミス",
          plainText:
            "よくあるエラー⑤ 項目名のタイポ\n症状：構文は通るが値が空、ダンプ、または別項目の値が出る。\n原因：belnrとbelnrの混同、大文字小文字、テーブル名の間違い。\n直し方：F1で公式名を確認。コピペで項目名を揃える。止まった行の変数ウィンドウで実際の値を見る。",
          content: (
            <>
              <h2>よくあるエラー ⑤ 項目名のタイポ（スペルミス）</h2>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 悪い例：項目名が1文字違う
WRITE: / ls_bkpf-belnr.   " 正しい
WRITE: / ls_bkpf-belnrr.  " 余分な r → エラーまたは想定外

" ❌ 悪い例：ワーク領域とテーブル行の取り違え
READ TABLE lt_bkpf INTO ls_bkpf WITH KEY belnr = lv_belnr.
WRITE: / lt_bkpf-belnr.   " 構造体ではなくテーブル全体を参照してしまう

" ✅ 良い例
WRITE: / ls_bkpf-belnr.`}
              />
              <p>
                <strong>直し方</strong> … カーソルを項目に置いて <code>F1</code> で正式名称を確認。
                デバッガで止まったら、<strong>変数ウィンドウの実際の値</strong>と照合します。
              </p>
            </>
          ),
        },
        {
          title: "エラー⑥メッセージだけ",
          plainText:
            "よくあるエラー⑥ メッセージだけ出して処理が続く\n症状：『データなし』と表示されるのに、そのあと空の帳票やおかしい続きが出る。\n原因：MESSAGEのあとにLEAVE LIST-PROCESSINGがない。\n直し方：メッセージのあとでレポート処理を終了させる。",
          content: (
            <>
              <h2>よくあるエラー ⑥ メッセージだけ出して、処理が続く</h2>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 悪い例：メッセージのあとも LOOP が走る
IF sy-subrc <> 0.
  MESSAGE '対象データはありません' TYPE 'S'.
ENDIF.
LOOP AT lt_bkpf INTO ls_bkpf.  " 空テーブルでも後続が動く
  WRITE: / ls_bkpf-belnr.
ENDLOOP.

" ✅ 良い例：伝えたら処理を終える
IF sy-subrc <> 0.
  MESSAGE '対象データはありません' TYPE 'S'.
  LEAVE LIST-PROCESSING.
ENDIF.`}
              />
              <p>
                利用者にはメッセージが見えても、プログラムは<strong>まだ先に進む</strong>ことがあります。
                「伝えたら止める」がセットです（特別演習②でも扱います）。
              </p>
            </>
          ),
        },
        {
          title: "エラー⑦ダンプ",
          plainText:
            "よくあるエラー⑦ 途中で落ちる（ダンプ）\n症状：突然エラー画面、トランザクションが終了。\n原因例：存在しない行をREAD TABLE、内部テーブルが空なのに行番号アクセス、型の不一致。\n直し方：ST22でプログラム名と行番号をメモ→SE38で該当行→sy-subrcや件数を確認してからアクセス。",
          content: (
            <>
              <h2>よくあるエラー ⑦ 途中で落ちる（ダンプ）</h2>
              <InfoPanel title="症状" variant="reference">
                <ul>
                  <li>実行中に<strong>突然</strong>エラー画面</li>
                  <li>「ランタイムエラー」「ダンプ」などの文言</li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 悪い例：READ 失敗を確認せず項目参照
READ TABLE lt_bseg INTO ls_bseg WITH KEY buzei = '001'.
WRITE: / ls_bseg-dmbtr.  " sy-subrc <> 0 だと ls_bseg は空のまま

" ✅ 良い例：見つかったときだけ使う
READ TABLE lt_bseg INTO ls_bseg WITH KEY buzei = '001'.
IF sy-subrc = 0.
  WRITE: / ls_bseg-dmbtr.
ENDIF.`}
              />
              <InfoPanel title="直し方（2段構え）" variant="reference">
                <ol>
                  <li>
                    <code>ST22</code> で<strong>プログラム名・行番号</strong>をメモ（追加コンテンツ「SAP開発ツール」）
                  </li>
                  <li>
                    <code>SE38</code> で該当行を開き、「その行の<strong>直前</strong>でデータは取れているか」を確認
                  </li>
                  <li>必要ならブレークポイントを置き、同じ条件で再実行</li>
                </ol>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "早見表",
          plainText:
            "困りごと早見表\n動かない→構文チェック・有効化。結果がおかしい→sy-subrc・入力とSELECTの一致・LOOP/WRITE。落ちる→ST22。直し方の型：小さく直す・再現・メモ・パイプラインで場所を当てる。",
          content: (
            <>
              <h2>困りごと早見表</h2>
              <table>
                <thead>
                  <tr>
                    <th>タイプ</th>
                    <th>まず疑うこと</th>
                    <th>最初の一手</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>① 動かない</td>
                    <td>構文ミス・有効化忘れ</td>
                    <td>
                      構文チェック → 有効化 → 再実行
                    </td>
                  </tr>
                  <tr>
                    <td>② 結果がおかしい</td>
                    <td>0件のまま進行・条件不一致</td>
                    <td>
                      <code>sy-subrc</code>・入力と <code>SELECT</code> の対応
                    </td>
                  </tr>
                  <tr>
                    <td>③ 落ちる</td>
                    <td>存在しないデータへのアクセス</td>
                    <td>
                      <code>ST22</code> → 行番号 → 直前の取得確認
                    </td>
                  </tr>
                </tbody>
              </table>
              <Callout variant="tip">
                画面操作の詳細（<code>/h</code>・<code>F5</code>・<code>ST22</code> の手順）は、
                <strong>追加コンテンツ「SAP開発ツール」</strong>に集約しています。ここでは<strong>判断の順番</strong>を優先して覚えてください。
              </Callout>
            </>
          ),
        },
        {
          title: "相談のしかた",
          plainText:
            "人に聞くときのメモ例\n①プログラム名 ②いつ・誰が実行 ③入力値（会社・日付）④期待した結果と実際 ⑤エラー全文（コピー）⑥直前に変えた行 ⑦自分で試したこと（再現・sy-subrc確認など）。\nこのメモがあると、15分の会話が5分になることもある。",
          content: (
            <>
              <h2>人に聞くときのメモ（テンプレート）</h2>
              <p>次をコピーして埋めると、相談がスムーズです。</p>
              <InfoPanel title="メモ例" variant="reference">
                <ul>
                  <li>プログラム名：</li>
                  <li>実行日時・ユーザー：</li>
                  <li>入力した条件（会社・日付など）：</li>
                  <li>期待した結果 / 実際の結果：</li>
                  <li>エラーメッセージ（全文コピー）：</li>
                  <li>直前に変更した行・目的：</li>
                  <li>自分で試したこと（再現・構文チェック・<code>sy-subrc</code> など）：</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                恥ずかしがらずに聞いてください。ただし<strong>メモ付き</strong>だと、教える側も助かります。
                デバッグはチームプレイです。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 デバッグの意味は？→ 不具合の原因を探して直す\nQ2 帳票が空でエラーが出ないとき最初に疑うは？→ データ取得（sy-subrc）\nQ3 保存したのに動きが変わらないときは？→ 有効化忘れ\nQ4 困ったときの型として正しいのは？→ 小さく直してすぐ再実行\n今日のひとこと：探偵の順番—再現・メモ・範囲を狭める・小さく直す。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="デバッグは、プログラムの不具合（バグ）の原因を探し、修正して動作を確認することです。当てずっぽうではなく、証拠を集めて範囲を狭めます。"
                question={<strong>「デバッグ」の意味として正しいのは？</strong>}
                options={[
                  "プログラムを削除すること",
                  "不具合の原因を探して直すこと",
                  "新しい機能を追加すること",
                ]}
              />
              <Quiz
                answer={2}
                explanation="エラーが出ずに帳票が空のときは、多くの場合 SELECT で0件なのにそのまま進んでいます。SELECT の直後の sy-subrc を確認する習慣が効きます。"
                question={
                  <strong>
                    実行は成功するが帳票が空のとき、<strong>最初に疑う場所</strong>として適切なのは？
                  </strong>
                }
                options={[
                  "GUIステータスの定義だけ",
                  "WRITE のフォントだけ",
                  "データ取得（SELECT）と sy-subrc の確認",
                ]}
              />
              <Quiz
                answer={1}
                explanation="SAP では保存と有効化が別です。保存だけでは実行時のプログラムは更新されません。構文チェック → 有効化 → 実行の順が定番です。"
                question={<strong>ソースを直したのに実行結果が変わらないとき、よくある原因は？</strong>}
                options={["有効化を忘れている", "SAP を再起動していない", "パソコンの日付がずれている"]}
              />
              <Quiz
                answer={2}
                explanation="一度に大きく変えると、どの修正が効いたか分からなくなります。1か所直す → 再実行 → 確認、を繰り返すのが初心者向けのベストプラクティスです。"
                question={<strong>初心者向けデバッグのベストプラクティスとして正しいのは？</strong>}
                options={[
                  "関連しそうな行をまとめて全部書き換える",
                  "エラーメッセージは見ずに感覚で直す",
                  "小さく直して、すぐ同じ条件で再実行する",
                ]}
              />
              <Dialog speaker="closing">
                困ったら<strong>再現 → メモ → パイプラインで場所を当てる → 小さく直す</strong>。
                この順番が、非エンジニアでも使える最強の型です。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="a1-sap-development-tools"
                slide={5}
                label="次: SAP開発ツール（画面操作の詳細）"
                variant="forward"
                className="mt-6"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(HowToDebugProgramLesson);
