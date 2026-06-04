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
  title: "オブジェクト指向とクラス・メソッド（SE24）— S/4HANAのモダンABAP入門",
  meta: "初学者 · 30分",
};

export default function OopClassMethodLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "21-oop-class-method", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "オブジェクト指向とクラス・メソッド（SE24）\nS/4HANAでよく使うABAPのオブジェクト指向を、仕訳日記帳の題材で入門します。\n⏱ 30分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・OO（Object-Oriented＝オブジェクト指向）とは何か\n・クラス、オブジェクト（インスタンス）、メソッドの基本\n・FORM/PERFORMとの違いと対応関係\n・SE24（Class Builder）でのグローバルクラス作成手順\n・S/4HANAでOOが重要な理由",
          content: (
            <>
              <hgroup>
                <h1>オブジェクト指向とクラス・メソッド（SE24）</h1>
                <p>
                  難しい用語は<strong>たとえ話と対話</strong>で順に説明します。
                  まず「OOとは何か」から始め、仕訳日記帳の題材でクラスとメソッドにつなげます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Callout variant="tip">
                この章のゴールは「コードを全部暗記する」ことではなく、
                <strong>用語の意味がイメージできること</strong>です。分からない言葉はスライドごとに分解して説明します。
              </Callout>
              <h3>この章で学ぶこと（この順で読むと分かりやすい）</h3>
              <ol>
                <li>
                  <strong>OO</strong>（オブジェクト指向）とは何か
                </li>
                <li>クラス・オブジェクト・メソッドを、たい焼きのたとえで理解する</li>
                <li>
                  既習の <code>FORM</code> / <code>PERFORM</code> と、OOの対応関係
                </li>
                <li>
                  <code>SE24</code> でグローバルクラスを作る流れ
                </li>
                <li>S/4HANAでOOを知っておく理由</li>
              </ol>
              <Callout variant="note">
                略語 <strong>OO</strong> ＝ <strong>O</strong>bject-<strong>O</strong>riented（オブジェクト指向）。発音は「オー・オー」です。
              </Callout>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="10-modularization"
                label="第10章: モジュール化（FORM/PERFORM）を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "OOとは",
          plainText:
            "OOとは何か\nOOはObject-Oriented（オブジェクト指向）の略。\n手続き型は処理の流れを上から書く。OOはデータとその操作をオブジェクトにまとめる。\nBちゃん：OOは何の略？先生：Object-Oriented。日本語ではオブジェクト指向。",
          content: (
            <>
              <h2>
                <code>OO</code> とは？（オブジェクト指向）
              </h2>
              <InfoPanel
                title="まず覚える2点"
                variant="breakdown"
                lead="教材や会話で「OO」と書かれているときは、次の意味です。"
              >
                <ul>
                  <li>
                    <strong>OO</strong> … 英語 <strong>O</strong>bject-<strong>O</strong>riented の略
                  </li>
                  <li>
                    日本語 … <strong>オブジェクト指向</strong>（オブジェクト＝モノ、指向＝そこを中心に考える）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                <code>OO</code> は、英語の何の略語なんですか？
              </Dialog>
              <Dialog speaker="teacher">
                <strong>Object-Oriented</strong> の頭文字です。
                SAP の資料や S/4HANA の話題では「オブジェクト指向で書く ABAP」という文脈で使われます。
              </Dialog>
              <h3>ひとことで言うと</h3>
              <p className="text-lg font-medium">
                <strong>OO ＝「モノごとに、データと操作をセットでまとめる」</strong>考え方です。
              </p>
              <h3>手続き型との違い（料理でたとえる）</h3>
              <p>
                これまでの <code>FORM</code> / <code>PERFORM</code> 中心の書き方は<strong>手続き型</strong>に近いです。
                レシピどおりに「①材料を出す → ②切る → ③炒める」と、<strong>手順の流れ</strong>が主役です。
              </p>
              <p>
                <strong>オブジェクト指向（OO）</strong>は、「仕訳日記帳」という<strong>モノ</strong>を1つ用意し、
                そのモノが<strong>金額を覚える（データ）</strong>し、<strong>合計を返す（操作）</strong>、という形でまとめます。
                データ（属性）と操作（メソッド）を、同じクラスの中に置くのがポイントです。
              </p>
              <InfoPanel
                title="用語の日本語イメージ"
                variant="reference"
                lead="英語が苦手でも、次の日本語だけ押さえれば十分です。"
              >
                <ul>
                  <li>
                    <strong>オブジェクト</strong> … モノ（実体）。例: 会社A用の仕訳日記帳
                  </li>
                  <li>
                    <strong>クラス</strong> … そのモノの設計図
                  </li>
                  <li>
                    <strong>メソッド</strong> … そのモノにできる操作（例: 伝票を足す）
                  </li>
                  <li>
                    <strong>属性</strong> … そのモノが覚えている値（例: 合計金額）
                  </li>
                </ul>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  proc["手続き型のイメージ"] --> step1["手順1"]
  step1 --> step2["手順2"]
  step2 --> step3["手順3"]
  oo["オブジェクト指向のイメージ"] --> obj["Journalオブジェクト"]
  obj --> data["データを保持"]
  obj --> meth["メソッドで操作"]`}
              />
              <Callout variant="tip">
                OOは「新しい言語」ではなく、<strong>設計の考え方</strong>です。
                ABAP でもクラス・メソッドという形で同じ考え方を使えます（<code>SE24</code> でクラスを作るのもそのためです）。
              </Callout>
              <Dialog speaker="a">
                つまり OO ＝「モノごとにデータと処理をセットにする」、と覚えればいいんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そのとおりです。次のスライドから、たい焼きのたとえでクラスとオブジェクトを具体化していきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "たとえで理解",
          plainText:
            "クラスとオブジェクトをたい焼きで考える\nクラスは型、オブジェクトは実体。たい焼きの型がクラス、焼き上がったたい焼きがオブジェクトです。\n仕訳日記帳なら、Journalクラスという設計図から、会社ごとのJournalオブジェクトを作って使う。",
          content: (
            <>
              <h2>クラスとオブジェクトを「たい焼き」で考える</h2>
              <p>
                いきなりコードより、<strong>たとえ</strong>から入ります。
                クラスは「設計図」、オブジェクト（インスタンス）は「実体」です。
              </p>
              <InfoPanel title="たい焼きのたとえ" variant="breakdown" lead="3つだけ覚えればOKです。">
                <ul>
                  <li>
                    <strong>クラス</strong> … たい焼きの<strong>型</strong>（形を決める金型）
                  </li>
                  <li>
                    <strong>オブジェクト</strong> … 型から焼いた<strong>実物のたい焼き</strong>（1匹、2匹…）
                  </li>
                  <li>
                    <strong>メソッド</strong> … そのたい焼きにできる操作（例: 中身を足す、温める）
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel title="仕訳日記帳に置き換えると" variant="breakdown" lead="研修の題材にそのまま当てはめます。">
                <ul>
                  <li>
                    <strong>クラス</strong> … 仕訳日記帳の設計図（例: <code>lcl_journal</code>）
                  </li>
                  <li>
                    <strong>オブジェクト</strong> … 会社A用・会社B用など、実際に動く日記帳（インスタンス）
                  </li>
                  <li>
                    <strong>メソッド</strong> … 「伝票を1件足す」「合計を返す」などの操作
                  </li>
                  <li>
                    <strong>属性</strong> … 日記帳が覚えている合計金額（<code>mv_total</code> など）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                型は1つでも、焼いたたい焼きは何匹でも作れる…。クラスもオブジェクトも、同じ関係なんですね。
              </Dialog>
              <Dialog speaker="a">
                <code>FORM</code> は「手順のかたまり」でしたが、クラスは「データと手順をセットで持つ箱」なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で正解です。オブジェクト指向は「そのデータを扱う手順を、近くに置く」設計です。
                だから「どこを直せばいいか」が分かりやすくなります。
              </Dialog>
              <Callout variant="tip">
                覚え方: <strong>クラス＝型</strong>、<strong>オブジェクト＝焼けた実物</strong>、<strong>メソッド＝その実物への操作</strong>。
              </Callout>
            </>
          ),
        },
        {
          title: "クラスとインスタンス",
          plainText:
            "クラスは1つでも、インスタンスは複数作れる\n同じクラスから会社ごとに別インスタンスを作ると、状態を分けて扱える。\nMermaid図: JournalClassからcompanyAJournalとcompanyBJournalを生成。",
          content: (
            <>
              <h2>クラスは1つ、インスタンスは複数</h2>
              <p>
                設計図（クラス）は1種類でも、そこから作る実物（オブジェクト）は<strong>何個でも</strong>作れます。
                会社ごとに別の日記帳を持たせたいときに便利です。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  journalClass["JournalClass (設計図)"] --> companyAJournal["companyAJournal (会社A実体)"]
  journalClass --> companyBJournal["companyBJournal (会社B実体)"]
  companyAJournal --> aState["Aの集計状態を保持"]
  companyBJournal --> bState["Bの集計状態を保持"]`}
              />
              <CodeBlock
                language="ABAP"
                code={`" 同じクラスから2つのオブジェクトを作る
DATA(lo_journal_a) = NEW lcl_journal( ).
DATA(lo_journal_b) = NEW lcl_journal( ).

lo_journal_a->add_entry( 1000 ).
lo_journal_b->add_entry( 500 ).`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>NEW lcl_journal( )</code> … 設計図 <code>lcl_journal</code> から、新しいオブジェクトを1つ作る
                </li>
                <li>
                  <code>lo_journal_a</code> / <code>lo_journal_b</code> … 作ったオブジェクトを入れる<strong>入れ物（参照変数）</strong>
                </li>
                <li>
                  <code>-&gt;add_entry( )</code> … そのオブジェクトのメソッドを呼ぶ（「この日記帳に、金額を足して」）
                </li>
              </ul>
              <Dialog speaker="b">
                もし入れ物が1つだけだと、会社AとBの合計がごちゃ混ぜになりそう…。だから2つ作るんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そのとおり。インスタンスを分けると、状態（合計金額）が分離され、読みやすく安全になります。
              </Dialog>
              <Callout variant="tip">
                オブジェクトのメソッドを呼ぶ記号は、<code>lo_journal-&gt;add_entry( )</code> のように書きます（手続き型の{" "}
                <code>PERFORM</code> に相当する入口です）。
              </Callout>
            </>
          ),
        },
        {
          title: "属性とメソッド",
          plainText:
            "属性はデータ、メソッドは処理\nFORM/PERFORMの知識をOOに対応づけると理解しやすい。\n属性=保持したい値、メソッド=値を使った処理。",
          content: (
            <>
              <h2>属性はデータ、メソッドは処理</h2>
              <p>
                オブジェクトの中身は、大きく<strong>2種類</strong>だけです。
                「何を覚えているか」（属性）と、「何ができるか」（メソッド）。
              </p>
              <InfoPanel
                title="手続き型とOOの対応（第10章の復習）"
                variant="reference"
                lead="すでに学んだ言葉に置き換えると、怖くなくなります。"
              >
                <ul>
                  <li>
                    <code>FORM</code> / <code>PERFORM</code> の処理の塊 → <strong>メソッド</strong>
                  </li>
                  <li>
                    プログラム全体の <code>DATA</code>（グローバル変数）で持っていた値 → クラスの<strong>属性</strong>
                  </li>
                  <li>
                    長いレポートを章分けした感覚 → クラス単位で「仕訳日記帳まわり」をまとめる
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel
                title="比喩: 共有の掲示板 vs 手元のノート"
                variant="breakdown"
                lead="第10章のスコープの話と同じ発想です。"
              >
                <ul>
                  <li>
                    <strong>属性</strong> … そのオブジェクト専用の手元ノート（合計金額など）
                  </li>
                  <li>
                    <strong>メソッド</strong> … そのノートを使った操作（足す・表示する）
                  </li>
                  <li>
                    何でもグローバル変数にすると、誰が値を変えたか追いにくい → OOではオブジェクトの中に閉じる
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                「どの値を、どの処理が触るか」をクラスの中に寄せると、読みやすくなりそうです。
              </Dialog>
              <Dialog speaker="teacher">
                はい。仕様変更で「合計の計算だけ直したい」とき、クラスの中だけ見れば済みます。
                これが OO を実務で使う一番の理由のひとつです。
              </Dialog>
              <Dialog speaker="a">
                属性＝覚えている値、メソッド＝できる操作。2語セットで覚えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "ABAP OO構文",
          plainText:
            "ABAP OOの最小コード\nCLASS DEFINITION/IMPLEMENTATIONでクラスを定義し、METHODSで操作を宣言する。NEWでオブジェクトを作り、->でメソッドを呼ぶ。",
          content: (
            <>
              <h2>ABAP OOの最小コード（仕訳日記帳ミニ版）</h2>
              <p>
                ここでは<strong>全体像</strong>だけ見ます。細かい構文は暗記不要です。
                「定義（DEFINITION）」「実装（IMPLEMENTATION）」「使う（NEW と <code>-&gt;</code>）」の3段階だと覚えてください。
              </p>
              <CodeBlock
                language="ABAP"
                code={`CLASS lcl_journal DEFINITION.
  PUBLIC SECTION.
    METHODS add_entry IMPORTING iv_amount TYPE i.
    METHODS total RETURNING VALUE(rv_total) TYPE i.
  PRIVATE SECTION.
    DATA mv_total TYPE i.
ENDCLASS.

CLASS lcl_journal IMPLEMENTATION.
  METHOD add_entry.
    mv_total = mv_total + iv_amount.
  ENDMETHOD.

  METHOD total.
    rv_total = mv_total.
  ENDMETHOD.
ENDCLASS.

DATA(lo_journal) = NEW lcl_journal( ).
lo_journal->add_entry( 1000 ).
WRITE: / lo_journal->total( ).`}
              />
              <h3>かたまりごとに読む</h3>
              <ul>
                <li>
                  <code>CLASS ... DEFINITION</code> … 設計図を書く（メソッド名・属性名を宣言）
                </li>
                <li>
                  <code>PRIVATE SECTION</code> … 外から触らせたくない属性（<code>mv_total</code>）を隠す
                </li>
                <li>
                  <code>CLASS ... IMPLEMENTATION</code> … メソッドの中身（実際の計算）を書く
                </li>
                <li>
                  <code>NEW lcl_journal( )</code> … オブジェクトを1つ作る
                </li>
                <li>
                  <code>lo_journal-&gt;add_entry( )</code> … 作ったオブジェクトに操作を頼む
                </li>
              </ul>
              <Dialog speaker="b">
                <code>FORM</code> も「定義」と「呼び出し」が分かれてましたね。似た構造です。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。違いは、<code>FORM</code> だけだとデータが別の場所に散らばりやすいこと。
                クラスはデータ（属性）と処理（メソッド）をセットで持てます。
              </Dialog>
              <Callout variant="note">
                この例は<strong>ローカルクラス</strong>（レポートの中だけで使う）です。学習・検証向け。
                複数プログラムで使うときは次のスライドの <code>SE24</code> でグローバルクラスを作ります。
              </Callout>
            </>
          ),
        },
        {
          title: "SE24の使い方",
          plainText:
            "SE24はグローバルクラスを作る画面\nSE24でクラス名を指定し、属性とメソッドを定義して有効化する。SE38のローカルクラスと使い分ける。",
          content: (
            <>
              <h2>
                <code>SE24</code>（Class Builder）でグローバルクラスを作る
              </h2>
              <p>
                <code>SE38</code> はレポート（手続き型の入り口）でした。
                <code>SE24</code> は<strong>クラス専用の工場</strong>です。ここで作ったクラスは、他のプログラムからも呼べます。
              </p>
              <Dialog speaker="teacher">
                コマンド欄に <code>SE24</code> と入力して Enter。画面タイトルに Class Builder と出ればOKです。
              </Dialog>
              <InfoPanel title="基本手順（GUI）" variant="breakdown" lead="まずは最小の1クラスを作る流れを覚えましょう。">
                <ol>
                  <li>
                    <code>SE24</code> を開き、クラス名（例: <code>ZCL_JOURNAL_SERVICE</code>）を入力して作成
                  </li>
                  <li>
                    <strong>Attributes</strong> で必要な属性を定義
                  </li>
                  <li>
                    <strong>Methods</strong> でメソッドを宣言し、実装にジャンプ
                  </li>
                  <li>保存 → 構文チェック → 有効化</li>
                </ol>
              </InfoPanel>
              <InfoPanel
                title="SE38内ローカルクラスとの使い分け"
                variant="reference"
                lead="どこで再利用したいかで使い分けます。"
              >
                <ul>
                  <li>
                    <strong>ローカルクラス</strong>（SE38内）… そのプログラム専用
                  </li>
                  <li>
                    <strong>グローバルクラス</strong>（SE24）… 複数プログラムから再利用
                  </li>
                  <li>
                    <code>SE80</code> … プログラム・クラス・関数をまとめて探す「開発の倉庫」
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                名前は <code>ZCL_...</code> みたいに Z で始めるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                カスタム開発では Z または Y で始める命名が多いです（プロジェクトの規則に従います）。
                大事なのは名前より、<strong>保存 → 構文チェック → 有効化</strong> の順を守ることです。
              </Dialog>
              <Callout variant="tip">
                覚え方: <code>SE38</code>＝レポート、<code>SE24</code>＝クラス、<code>SE80</code>＝全体を探す。
              </Callout>
            </>
          ),
        },
        {
          title: "S/4HANAでの位置づけ",
          plainText:
            "S/4HANAではオブジェクト指向が重要\n標準APIや拡張の多くがクラスベースで提供される。既存のFORM/PERFORM知識は、メソッド設計に置き換えて活かせる。",
          content: (
            <>
              <h2>S/4HANAでは、なぜOOが重要か</h2>
              <p>
                「難しそうだから後回し」にしがちですが、S/4HANA では<strong>クラスという単位</strong>で機能が提供される場面が増えています。
                用語が分かるだけで、調査や会話が楽になります。
              </p>
              <InfoPanel title="実務で効く3つの場面" variant="breakdown" lead="いま全部できる必要はありません。意味が分かれば十分です。">
                <ul>
                  <li>標準APIや拡張の説明資料に「クラス」「メソッド」が出てくる</li>
                  <li>BAPI や汎用モジュールを、クラス経由で呼ぶコードを読む</li>
                  <li>将来、RAP など新しい開発スタイルを学ぶときの土台になる</li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                手続き型（<code>FORM</code>）で学んだ「処理を分ける」「名前を付ける」は無駄になりません。
                そのまま<strong>メソッド設計</strong>に活かせます。
              </Callout>
              <Dialog speaker="a">
                つまり、OOは別世界ではなく、第10章の延長線上なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。まずは「クラス＝設計図」「オブジェクト＝実体」「メソッド＝操作」だけ持ち帰りましょう。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="14-sap-development-tools"
                slide={1}
                label="追加: SAP開発ツール（SE38/SE80）を確認する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\nOOはモノごとにデータと操作をまとめる考え方。クラスは設計図、オブジェクトは実体、属性は値、メソッドは操作。SE24でクラスを作る。",
          content: (
            <>
              <h2>対話で整理（この章の要点）</h2>
              <Dialog speaker="teacher">
                まとめると4つです。① OO＝モノ単位でデータと操作をまとめる。
                ② クラス＝設計図、オブジェクト＝実体。
                ③ 属性＝覚えている値、メソッド＝できる操作。
                ④ <code>SE24</code> でグローバルクラスを作る。
              </Dialog>
              <Dialog speaker="b">
                <code>OO</code> は Object-Oriented の略で、たい焼きの型と実物で想像できるようになりました。
              </Dialog>
              <Dialog speaker="a">
                <code>PERFORM</code> の代わりに <code>-&gt;</code> でメソッドを呼ぶ。ここだけ違っても、発想は第10章と同じですね。
              </Dialog>
              <InfoPanel title="持ち帰りカード" variant="breakdown" lead="迷ったらこの表を見返してください。">
                <ul>
                  <li>
                    <strong>OO</strong> … オブジェクト指向（Object-Oriented）
                  </li>
                  <li>
                    <strong>クラス / オブジェクト</strong> … 型 / 焼けた実物
                  </li>
                  <li>
                    <strong>属性 / メソッド</strong> … データ / 操作
                  </li>
                  <li>
                    <strong>SE24</strong> … クラスを作るトランザクション
                  </li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 OOの意味は？\nQ2 クラスとオブジェクトの関係は？\nQ3 メソッド呼び出し記法は？\nQ4 SE24は何を作るtcodeか？",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="OOは Object-Oriented（オブジェクト指向）の略です。"
                question={<strong>OO の正しい意味は？</strong>}
                options={[
                  "Online Operation（オンライン処理）の略",
                  "Object-Oriented（オブジェクト指向）の略",
                  "Only Once（1回だけ）の略",
                ]}
              />
              <Quiz
                answer={0}
                explanation="クラスは設計図、オブジェクト（インスタンス）はその設計図から作られた実体です。"
                question={<strong>クラスとオブジェクトの関係として正しいのは？</strong>}
                options={[
                  "クラスは設計図、オブジェクトは実体",
                  "クラスは実体、オブジェクトは設計図",
                  "どちらも同じ意味",
                ]}
              />
              <Quiz
                answer={1}
                explanation="ABAP OOでは `->` でインスタンスメソッドを呼び出します。"
                question={<strong>オブジェクトのメソッド呼び出し記法は？</strong>}
                options={["PERFORM add_entry.", "lo_journal->add_entry( 1000 ).", "CALL METHOD add_entry."]}
              />
              <Quiz
                answer={2}
                explanation="SE24はグローバルクラスを作成・保守するClass Builderです。"
                question={<strong>トランザクション `SE24` の主な用途は？</strong>}
                options={[
                  "テーブルデータを参照する",
                  "ダンプを確認する",
                  "グローバルクラスを作成・保守する",
                ]}
              />
              <Dialog speaker="closing">
                OOは難しい言葉に見えても、「モノごとにまとめる」だけ。
                クラス＝設計図、オブジェクト＝実体、属性＝値、メソッド＝操作。この4つが分かれば、S/4HANAのコードがぐっと読みやすくなります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OopClassMethodLesson);
