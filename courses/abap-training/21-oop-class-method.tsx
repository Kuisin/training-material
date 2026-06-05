import {
  Lesson,
  lessonChrome,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "オブジェクト指向とは — 車のたとえで学ぶ",
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
            "オブジェクト指向とは\n先生：この章はコード暗記より、用語の意味をイメージすることがゴールです。\nBちゃん：オブジェクト指向、英語ばっかで不安…\n先生：車のたとえで順に説明します。Step1〜5 → まとめ → なぜOOか → 確認テスト。",
          content: (
            <>
              <hgroup>
                <h1>オブジェクト指向とは</h1>
                <p>
                  難しい用語は<strong>対話と「車」のたとえ</strong>で順に説明します。
                  まずは用語の意味がイメージできることを目標にします。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Dialog speaker="teacher">
                この章のゴールは「コードを全部暗記する」ことではなく、
                <strong>用語の意味がイメージできること</strong>です。分からない言葉は、スライドごとに分解して説明します。
              </Dialog>
              <Dialog speaker="b">
                「オブジェクト指向」って、英語ばっかで難しそう…。プログラムが書けないと意味不明ですよね？
              </Dialog>
              <Dialog speaker="teacher">
                大丈夫です。いきなりコードより、<strong>身近な「車」</strong>から入ります。
                最後には仕訳日記帳（研修の題材）にもつなげます。
              </Dialog>
              <h3>この章の流れ</h3>
              <ol>
                <li>用語の説明（OO・クラス・オブジェクトなど）</li>
                <li>Step 1〜5 … 車の例でクラス・継承・ポリモーフィズムまで</li>
                <li>まとめ … 車と仕訳日記帳の対応表</li>
                <li>なぜ OO が生まれたのか、なぜ重要なのか</li>
                <li>確認テスト</li>
              </ol>
            </>
          ),
        },
        {
          title: "用語の説明",
          plainText:
            "用語の説明\nBちゃん：OOって何の略？\n先生：Object-Oriented。モノごとにデータと操作をまとめる考え方。\nAくん：クラス＝設計図、オブジェクト＝実体、属性＝データ、メソッド＝操作。\n先生：その4つが核。継承とポリモーフィズムはStep4・5で具体化します。",
          content: (
            <>
              <h2>用語の説明</h2>
              <Dialog speaker="b">
                まず <code>OO</code> って、何の略なんですか？
              </Dialog>
              <Dialog speaker="teacher">
                <strong>Object-Oriented</strong>（オブジェクト指向）の略です。発音は「オー・オー」。
                新しい言語ではなく、<strong>プログラムの設計の考え方</strong>です。
              </Dialog>
              <Dialog speaker="teacher">
                ひとことで言うと、<strong>「モノごとに、データと操作をセットでまとめる」</strong>考え方です。
              </Dialog>
              <InfoPanel title="この章で使う用語（辞書）" variant="reference" lead="あとで見返せるよう、一覧にしておきます。">
                <ul>
                  <li>
                    <strong>クラス</strong> … そのモノの設計図
                  </li>
                  <li>
                    <strong>オブジェクト（インスタンス）</strong> … 設計図から作った、実際に動く1つ1つのモノ
                  </li>
                  <li>
                    <strong>属性</strong> … そのモノが覚えている値（データ）。例：金額、走行距離
                  </li>
                  <li>
                    <strong>メソッド</strong> … そのモノが行える操作（処理）。例：足す、走る
                  </li>
                  <li>
                    <strong>継承</strong> … 親クラスの性質を子クラスが引き継ぐ仕組み
                  </li>
                  <li>
                    <strong>ポリモーフィズム</strong> … 同じ操作の呼び方で、実体ごとに違う動きをさせること
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                核は4つですね。<strong>クラス＝設計図</strong>、<strong>オブジェクト＝実体</strong>、
                <strong>属性＝データ</strong>、<strong>メソッド＝操作</strong>。
              </Dialog>
              <Dialog speaker="b">
                継承とポリモーフィズムは、名前だけだとピンときません…。
              </Dialog>
              <Dialog speaker="teacher">
                その2つは Step 4・5 の「車」と「乗り物」の例で、対話しながら具体化していきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "Step 1: 車について",
          plainText:
            "Step1 車について\n先生：まずプログラムの話は置いて、1台の車を想像しましょう。\nBちゃん：色・走行距離は「状態」、走る・止まるは「できること」？\n先生：その通り。データと操作が1台のモノにセット＝OOの出発点。",
          content: (
            <>
              <h2>Step 1: 車について</h2>
              <Dialog speaker="teacher">
                いきなりコードは見ません。まず現実の<strong>1台の車</strong>を想像してください。
              </Dialog>
              <Dialog speaker="b">
                白いセダンで、走行距離 12,000 km…。こういう<strong>状態</strong>がある、ですよね？
              </Dialog>
              <Dialog speaker="teacher">
                はい。ほかに<strong>走る</strong>、<strong>止まる</strong>、<strong>給油する</strong>など、
                その1台にできる<strong>操作</strong>もあります。
              </Dialog>
              <Dialog speaker="a">
                つまり「この車が覚えている値」と「この車ができること」が、<strong>1台のモノにセット</strong>になっている。
                オブジェクト指向は、これをプログラムに持ち込む考え方なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で正解です。OO の出発点は「モノごとにまとめる」です。
              </Dialog>
            </>
          ),
        },
        {
          title: "Step 2: クラスとオブジェクト",
          plainText:
            "Step2 クラスとオブジェクト\nBちゃん：設計図がクラス、工場で出来た1台がオブジェクト？\n先生：その通り。ZCL_CARから社用車・私用車を何台でも。\nAくん：属性＝色や走行距離、メソッド＝走る・止まる。",
          content: (
            <>
              <h2>Step 2: クラスを使って、オブジェクト（実体）を作る</h2>
              <Dialog speaker="teacher">
                メーカーは「この型の車」という<strong>設計・仕様</strong>を持ち、工場で<strong>1台ずつ</strong>作ります。
                プログラムでも同じ関係です。
              </Dialog>
              <Dialog speaker="b">
                設計・仕様が<strong>クラス</strong>で、出来上がった1台が<strong>オブジェクト</strong>…？
                社用の白いセダンと、私用の赤いSUVは、同じ設計図から2台作った感じ？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそのとおり。<strong>クラスは1つ、オブジェクトはたくさん</strong>作れます。
              </Dialog>
              <InfoPanel title="現実とOOの対応" variant="breakdown" lead="車のたとえと用語の対応表です。">
                <table>
                  <thead>
                    <tr>
                      <th>現実のたとえ</th>
                      <th>OOの用語</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>車の設計・仕様</td>
                      <td>
                        <strong>クラス</strong>（例: <code>ZCL_CAR</code>）
                      </td>
                    </tr>
                    <tr>
                      <td>工場で出来上がった1台</td>
                      <td>
                        <strong>オブジェクト</strong>（インスタンス）
                      </td>
                    </tr>
                    <tr>
                      <td>色・走行距離など</td>
                      <td>
                        <strong>属性</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>走る・止まるなど</td>
                      <td>
                        <strong>メソッド</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart TD
  carClass["クラス ZCL_CAR（設計図）"]
  carClass --> companyCar["オブジェクト: 社用の白いセダン"]
  carClass --> privateCar["オブジェクト: 私用の赤いSUV"]`}
              />
              <Dialog speaker="a">
                属性＝その1台が覚えている値、メソッド＝その1台への操作。Step 1 の「状態」と「できること」が、
                設計図の中に名前付きで書かれた形ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Step 3: クラスは分類",
          plainText:
            "Step3 クラスは分類\nBちゃん：「車」って1台のことじゃなく、セダンもSUVもまとめた名前？\n先生：その通り。クラス＝プログラム上の「分類の箱」。\nAくん：Step2は1台を作る話、Step3はグループ名の話。同じクラスの別の見方。",
          content: (
            <>
              <h2>Step 3: クラスは分類である</h2>
              <Dialog speaker="b">
                「車」って、道を走ってる<strong>1台</strong>のことだけじゃないですよね。
                セダンもSUVもトラックも、ざっくり<strong>車</strong>、ですよね？
              </Dialog>
              <Dialog speaker="teacher">
                そのとおり。「車」は<strong>似たものをまとめた名前（分類）</strong>でもあります。
                プログラムでは、このグループの設計を <code>ZCL_CAR</code> クラスとして書きます。
              </Dialog>
              <Dialog speaker="teacher">
                つまり <strong>クラス ＝ プログラム上の「分類の箱」</strong>。
                箱の中に「この分類のモノが持つデータ」と「できる処理」を入れておきます。
              </Dialog>
              <InfoPanel title="分類の例" variant="breakdown" lead="車と研修題材の対応です。">
                <table>
                  <thead>
                    <tr>
                      <th>分類の名前</th>
                      <th>クラスに書くこと</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>車</td>
                      <td>走行距離、燃料、走る、止まる</td>
                    </tr>
                    <tr>
                      <td>仕訳日記帳（研修題材）</td>
                      <td>合計金額、伝票を足す、合計を返す</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                Step 2 は「設計図から1台作る」、Step 3 は「似たモノをまとめる名前」。
                どちらも同じクラスの話で、<strong>見る角度が違う</strong>だけなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。次は、分類を「粗い名前」と「細かい名前」に分けていきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "Step 4: 継承",
          plainText:
            "Step4 継承\nBちゃん：乗り物の中に車・バイク・船？\n先生：粗い分類を親クラス、細かい分類を子クラス。共通の「進む・止まる」は親に1回だけ。\nAくん：粒度を下げる＝大きな分類から具体的なクラスを作る。",
          content: (
            <>
              <h2>Step 4: 粒度を下げて、乗り物を作る（継承）</h2>
              <Dialog speaker="b">
                「乗り物」の中に、車・バイク・船が入る…。生物の分類みたいですね。
              </Dialog>
              <Dialog speaker="teacher">
                分類には<strong>粗い名前</strong>（乗り物）と<strong>細かい名前</strong>（車・バイク・船）があります。
                プログラムでは、粗い方を<strong>親クラス</strong>、細かい方を<strong>子クラス</strong>と呼びます。
              </Dialog>
              <Dialog speaker="teacher">
                子が親の性質を<strong>引き継ぐ</strong>仕組みを <strong>継承</strong> と呼びます。
                共通の「進む・止まる」は親に1回だけ書けば、子では車やバイク<strong>固有の部分だけ</strong>足せます。
              </Dialog>
              <CodeBlock
                language="text"
                code={`乗り物 ZCL_VEHICLE（親クラス）
├── 共通: 名前、速度、進む・止まる
├── 車 ZCL_CAR（子クラス）     … 乗り物 ＋ タイヤ数、給油する
├── バイク ZCL_BIKE（子クラス） … 乗り物 ＋ 二輪用の操作
└── 船 ZCL_BOAT（子クラス）    … 乗り物 ＋ 浮力・錨を下ろす`}
              />
              <Dialog speaker="a">
                <strong>粒度を下げる</strong> ＝ いったん「乗り物」で共通をまとめ、そこから「車」「バイク」と
                より具体的なクラスを作る、という意味ですね。
              </Dialog>
              <Dialog speaker="teacher">
                仕訳日記帳に置き換えると、親は「帳簿」の共通設計（合計を持つ、行を足す）。
                子は仕訳日記帳や、ルールが少し違う別の帳簿、です。
              </Dialog>
            </>
          ),
        },
        {
          title: "Step 5: ポリモーフィズム",
          plainText:
            "Step5 ポリモーフィズム\nBちゃん：「進め！」の合図は同じなのに、車は走って自転車はこぐ？\n先生：それがポリモーフィズム。同じ呼び方、実体ごとに違う動き。\nAくん：継承は受け継ぐ、ポリモーフィズムは動きが変わる。別物。",
          content: (
            <>
              <h2>Step 5: ポリモーフィズム — 同じ呼び方で、動きは実体次第</h2>
              <Dialog speaker="teacher">
                Step 4 で、親「乗り物」に <strong>進む</strong> という操作を置きました。
                車・バイク・船はどれも乗り物なので、呼び出し側は同じ言葉で頼めます。
              </Dialog>
              <Dialog speaker="b">
                交通整理の人が「進め！」って合図したら、前が車なら走る、自転車ならこぐ、船なら進水する…。
                <strong>言葉は同じ</strong>なのに<strong>動き方が違う</strong>。これがポリモーフィズム？
              </Dialog>
              <Dialog speaker="teacher">
                そのとおり。呼ぶ側は「進むを実行して」と<strong>1種類の頼み方</strong>だけ覚えればよく、
                中身の処理は<strong>どのオブジェクトか</strong>で変わります。
              </Dialog>
              <CodeBlock
                language="text"
                code={`呼び出し側: 「進んで！」  （メソッド名はどれも move / 進む）
    │
    ├── 車   → エンジンで道路を走る
    ├── バイク → ペダルをこいで進む
    └── 船   → プロペラや帆で水面を進む`}
              />
              <Dialog speaker="a">
                継承との違いが大事ですね。<strong>継承</strong>＝親の設計を子が受け継ぐ。
                <strong>ポリモーフィズム</strong>＝同じ名前で頼んだとき、実体ごとに動きが変わる。別の話です。
              </Dialog>
              <Dialog speaker="teacher">
                仕訳日記帳では「<strong>行を表示する</strong>」と同じメソッド名で頼んでも、
                仕訳日記帳なら借方・貸方形式、別の帳簿ならその形式、と表示が変わります。
                「車か船か」を <code>IF</code> で分岐しなくてよい場合がある、というメリットもあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "まとめ",
          plainText:
            "まとめ\n先生：Step1〜5を車と仕訳日記帳で対応づけましょう。\nBちゃん：モノ・設計図・分類・親子・同じ呼び方で違う動き、5つ覚えればよさそう。\nAくん：用語がそのままコードに載せ替えられる。",
          content: (
            <>
              <h2>まとめ: 車の例から研修題材へ</h2>
              <Dialog speaker="teacher">
                Step 1〜5 を、車のたとえと仕訳日記帳の対応表で整理しましょう。
              </Dialog>
              <InfoPanel title="Step 1〜5 の対応表" variant="breakdown" lead="迷ったらここを見返してください。">
                <table>
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>車のたとえ</th>
                      <th>仕訳日記帳では</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>1台のモノに状態と操作がセット</td>
                      <td>1冊の日記帳に金額と「足す」操作</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>設計図から実物を複数作る</td>
                      <td>
                        <code>lcl_journal</code> から会社ごとのインスタンス
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>「車」は分類の名前でもある</td>
                      <td>日記帳という種類の設計をクラスで表す</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>乗り物→車と粒度を下げ、共通を継承</td>
                      <td>共通の帳簿設計を親に、日記帳を子に</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>「進む」は同じ合図、動きは実体次第</td>
                      <td>「表示する」は同じ呼び方、内容は帳簿で変わる</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                「モノ・設計図・分類・親子・同じ呼び方で違う動き」——この5つが頭にあれば、用語は怖くなさそうです。
              </Dialog>
              <Dialog speaker="a">
                車のイメージがそのままコードに載せ替えられる。次は「なぜ OO が必要だったのか」を聞きたいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜOOか",
          plainText:
            "なぜOOか\nBちゃん：プログラムが大きくなると、データと処理がバラバラで探せない？\n先生：その困りごとから、モノ単位でまとめるOOが生まれた。\nAくん：直しやすい・再利用・業務の言葉と近い・SAPでも当たり前、の4点。",
          content: (
            <>
              <h2>なぜ OO が生まれたのか</h2>
              <Dialog speaker="b">
                車の例は分かりました。でも、<strong>なぜ</strong>わざわざ OO なんて考え方が生まれたんですか？
              </Dialog>
              <Dialog speaker="teacher">
                プログラムは最初は短い手順書でした。でも業務が複雑になると、数千行・数万行が当たり前になりました。
              </Dialog>
              <Dialog speaker="teacher">
                手続き型だけだと、<strong>データ</strong>（合計金額など）と<strong>処理</strong>（足す、表示する）が
                プログラムのあちこちに<strong>バラバラ</strong>に書かれます。
                「この金額を触っている処理はどこ？」と探すのに時間がかかり、コピペで直す場所も雪だるま式に増えます。
              </Dialog>
              <Dialog speaker="a">
                第10章で「長い手順書は章に分ける」と学びました。OO は、その延長で
                <strong>データも一緒にモノの単位で分ける</strong>、という発想ですね。
              </Dialog>
              <Dialog speaker="teacher">
                そのとおり。「仕訳日記帳」「伝票」のように<strong>業務のモノ単位</strong>でまとめよう、
                という考え方が広がったのがオブジェクト指向です。
                車の例で言えば、走行距離や給油の話を「車の設計図」の中に閉じ込めるイメージです。
              </Dialog>

              <h2>なぜ OO が重要なのか</h2>
              <Dialog speaker="teacher">覚え方は4つです。</Dialog>
              <InfoPanel title="4つの理由" variant="reference" lead="暗記より「こういう場面で効く」とイメージしてください。">
                <ol>
                  <li>
                    <strong>直しやすい</strong> … 変更したい処理が、モノ（クラス）の中に閉じている
                  </li>
                  <li>
                    <strong>再利用しやすい</strong> … 設計図から何台でも作れる（Step 2）。共通は親に1回（Step 4・5）
                  </li>
                  <li>
                    <strong>業務の言葉と近い</strong> … 「日記帳に足す」と現場の会話と形が揃う
                  </li>
                  <li>
                    <strong>SAP でも当たり前</strong> … S/4HANA の標準・API はクラス単位が多い。用語が分かると読みやすい
                  </li>
                </ol>
              </InfoPanel>
              <Dialog speaker="b">
                「難しい新技術」じゃなくて、<strong>大きくなったプログラムを整理する道具</strong>、と思えば安心ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。Step 1〜5 で形を、ここで背景を持ち帰ってください。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 OOの意味は？\nQ2 クラスとオブジェクトの関係は？\nQ3 継承とポリモーフィズムの違いは？",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="OOは Object-Oriented（オブジェクト指向）の略で、「モノごとにデータと操作をまとめる」考え方です。"
                question={<strong>OO の正しい意味は？</strong>}
                options={[
                  "Online Operation（オンライン処理）の略",
                  "Object-Oriented（オブジェクト指向）の略",
                  "Only Once（1回だけ）の略",
                ]}
              />
              <Quiz
                answer={0}
                explanation="クラスは設計図、オブジェクト（インスタンス）はその設計図から作られた実体です。車の例では ZCL_CAR が設計図、社用車・私用車が実体です。"
                question={<strong>クラスとオブジェクトの関係として正しいのは？</strong>}
                options={[
                  "クラスは設計図、オブジェクトは実体",
                  "クラスは実体、オブジェクトは設計図",
                  "どちらも同じ意味",
                ]}
              />
              <Quiz
                answer={1}
                explanation="継承は親の設計を子が受け継ぐこと。ポリモーフィズムは同じ操作名（例: 進む）で頼んだとき、車・バイク・船など実体ごとに動きが変わることです。"
                question={<strong>継承とポリモーフィズムの違いとして正しいのは？</strong>}
                options={[
                  "継承＝同じ呼び方で動きが変わる、ポリモーフィズム＝親の設計を受け継ぐ",
                  "継承＝親の設計を受け継ぐ、ポリモーフィズム＝同じ呼び方で実体ごとに動きが変わる",
                  "どちらも同じ意味",
                ]}
              />
              <Dialog speaker="closing">
                オブジェクト指向は「モノごとにまとめる」考え方から始まります。
                車の Step 1〜5 と「なぜ必要か」が分かれば、SAP の資料もぐっと読みやすくなります。お疲れさまでした。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OopClassMethodLesson);
