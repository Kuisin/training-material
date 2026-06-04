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
            "オブジェクト指向とは\nプログラミング初学者向けに、オブジェクト指向を車のたとえで説明します。\n⏱ 30分 / 📶 初学者 / 🏷 ABAP研修\n用語の説明 → Step1〜5（車・クラス・継承・ポリモーフィズム）→ まとめ",
          content: (
            <>
              <hgroup>
                <h1>オブジェクト指向とは</h1>
                <p>
                  オブジェクト指向を、<strong>身近な「車」のたとえ</strong>で順に説明します。
                  技術的な簡略化や誤解を含む場合がありますが、まずは用語の意味がイメージできることを目標にします。
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
                <strong>用語の意味がイメージできること</strong>です。
              </Callout>
              <h3>この章の流れ</h3>
              <ol>
                <li>用語の説明（OO・クラス・オブジェクトなど）</li>
                <li>Step 1〜5 … 車の例でクラス・継承・ポリモーフィズムまで</li>
                <li>まとめ … 車の例と仕訳日記帳（研修題材）の対応表</li>
              </ol>
            </>
          ),
        },
        {
          title: "用語の説明",
          plainText:
            "用語の説明\nOO＝モノごとにデータと操作をセットでまとめる考え方。\nクラス＝設計図、オブジェクト＝実体、属性＝データ、メソッド＝操作。\n継承＝親子で性質を引き継ぐ。ポリモーフィズム＝同じ呼び方で実体ごとに違う動き。",
          content: (
            <>
              <h2>用語の説明</h2>
              <InfoPanel title="オブジェクト指向の用語" variant="reference" lead="この章で使う言葉の定義です。">
                <ul>
                  <li>
                    <strong>OO（オブジェクト指向）</strong> … 「モノごとに、データと操作をセットでまとめる」考え方。
                    英語 Object-Oriented の略で、新しい言語ではなく<strong>設計の考え方</strong>
                  </li>
                  <li>
                    <strong>クラス</strong> … そのモノの設計図
                  </li>
                  <li>
                    <strong>オブジェクト</strong> … モノ（実体）。設計図から作った、実際に動く1つ1つ
                  </li>
                  <li>
                    <strong>インスタンス（オブジェクト）</strong> … オブジェクトと同じ意味で使われることが多い
                  </li>
                  <li>
                    <strong>属性</strong> … そのオブジェクトが覚えられる値（データ）。例：金額、勘定コード
                  </li>
                  <li>
                    <strong>メソッド</strong> … そのオブジェクトが行える操作（処理）。例: 伝票を1件足す、合計を返す
                  </li>
                  <li>
                    <strong>継承</strong> … クラス同士に親子の関係を持たせ、上位クラスの性質を引き継いで下位クラスを作ること。
                    共通部分をまとめて再利用するための仕組み
                  </li>
                  <li>
                    <strong>ポリモーフィズム</strong> … 同じ操作の呼び方で、実体ごとに違う動きをさせること
                  </li>
                </ul>
              </InfoPanel>
              <p>
                次のスライドから、身近な「車」を例に、上の用語を<strong>Step 1〜5</strong>の順でたどります。
                最後に仕訳日記帳の題材へつなげます。
              </p>
            </>
          ),
        },
        {
          title: "Step 1: 車について",
          plainText:
            "Step1 車について\n1台の車には色・型式・走行距離などの状態がある。\n走る・止まる・給油するなどの操作がある。\nデータと処理がモノごとにセット＝オブジェクト指向の出発点。",
          content: (
            <>
              <h2>Step 1: 車について</h2>
              <p>まずはプログラムの話を置き、現実の<strong>1台の車</strong>を想像します。</p>
              <ul>
                <li>
                  この車には<strong>色</strong>（白）、<strong>型式</strong>（セダン）、<strong>走行距離</strong>（12,000
                  km）など、<strong>状態</strong>がある
                </li>
                <li>
                  この車には<strong>走る</strong>、<strong>止まる</strong>、<strong>給油する</strong>など、
                  <strong>できること</strong>がある
                </li>
              </ul>
              <p>
                ここで大事なのは、「車」という<strong>1台のモノ</strong>について、
                <strong>覚えている値（データ）</strong>と<strong>行える操作（処理）</strong>がセットになっている、という点です。
                オブジェクト指向は、この「モノごとにまとめる」考え方をプログラムに持ち込みます。
              </p>
            </>
          ),
        },
        {
          title: "Step 2: クラスとオブジェクト",
          plainText:
            "Step2 クラスとオブジェクト\n設計・仕様がクラス、工場で出来上がった1台がオブジェクト。\nZCL_CARから社用車・私用車を複数作れる。クラスは1つ、オブジェクトはたくさん。",
          content: (
            <>
              <h2>Step 2: 車の概念（クラス）を使って、実態（オブジェクト）を作る</h2>
              <p>
                現実では、メーカーは「この型の車」という<strong>設計・仕様</strong>を持ち、工場ではその設計どおりに
                <strong>1台ずつ</strong>製造します。プログラムでも同じ関係です。
              </p>
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
                      <td>車の設計・仕様（型式の定義）</td>
                      <td>
                        <strong>クラス</strong>（例: <code>ZCL_CAR</code>）
                      </td>
                    </tr>
                    <tr>
                      <td>工場で出来上がった1台</td>
                      <td>
                        <strong>オブジェクト</strong>（<strong>インスタンス</strong>）
                      </td>
                    </tr>
                    <tr>
                      <td>色・走行距離などその1台の状態</td>
                      <td>
                        <strong>属性</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>走る・止まるなどその1台の操作</td>
                      <td>
                        <strong>メソッド</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <ul>
                <li>
                  <strong>クラス</strong> … 「車」という設計図。属性（色、走行距離）とメソッド（走る、止まる）を
                  <strong>まとめて定義</strong>する
                </li>
                <li>
                  <strong>オブジェクト</strong> … 設計図から作った<strong>実在する1台</strong>。社用車・私用車のように、
                  同じクラスから<strong>何台でも</strong>作れる
                </li>
              </ul>
              <MermaidDiagram
                chart={`flowchart TD
  carClass["クラス ZCL_CAR（設計図）"]
  carClass --> companyCar["オブジェクト: 社用の白いセダン"]
  carClass --> privateCar["オブジェクト: 私用の赤いSUV"]`}
              />
              <Callout variant="tip">
                設計図は1種類でも、実物は複数。だから「クラスは1つ、オブジェクトはたくさん」が自然に理解できます。
              </Callout>
            </>
          ),
        },
        {
          title: "Step 3: クラスは分類",
          plainText:
            "Step3 クラスは分類\n「車」は1台の実物ではなく似たものをまとめた名前。\nクラス＝プログラム上の分類の箱。Step2は1台を作る話、Step3はまとめる名前の話。",
          content: (
            <>
              <h2>Step 3: クラスは分類である</h2>
              <p>
                「車」という言葉は、<strong>1台の実物</strong>ではなく、
                <strong>似たものをまとめた名前（分類）</strong>でもあります。
              </p>
              <ul>
                <li>セダンもSUVもトラックも、ざっくり言えば<strong>車</strong>に入る</li>
                <li>
                  プログラムでは、この「車というグループ」の設計を <code>ZCL_CAR</code> クラスとして書く
                </li>
              </ul>
              <p>
                つまり <strong>クラス ＝ プログラム上の「分類の箱」</strong> です。箱の中に「この分類のモノが持つデータ」と
                「この分類のモノができる処理」を入れておきます。
              </p>
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
              <Callout variant="note">
                Step 2 では「1台を作る」話、Step 3 では「似たモノをひとまとめにする名前」という側面を見ています。
                どちらも同じクラスの話で、見る角度が違うだけです。
              </Callout>
            </>
          ),
        },
        {
          title: "Step 4: 継承",
          plainText:
            "Step4 粒度を下げて乗り物を作る\n粗い分類＝乗り物、細かい分類＝車・バイク・船。\n親クラスと子クラス、継承で共通の進む・止まるを1か所にまとめる。",
          content: (
            <>
              <h2>Step 4: 粒度を下げることで、乗り物を作ることができる</h2>
              <p>分類には<strong>粗い名前</strong>と<strong>細かい名前</strong>があります。</p>
              <ul>
                <li>
                  <strong>粗い分類</strong> … 乗り物（車・バイク・船などをふくむ）
                </li>
                <li>
                  <strong>細かい分類</strong> … 車、バイク、船
                </li>
              </ul>
              <p>
                プログラムでは、粗い分類を<strong>親クラス</strong>、細かい分類を<strong>子クラス</strong>とし、
                親の性質を子が<strong>引き継ぐ</strong>仕組みを <strong>継承</strong> と呼びます。
              </p>
              <CodeBlock
                language="text"
                code={`乗り物 ZCL_VEHICLE（親クラス）
├── 共通: 名前、速度、進む・止まる
├── 車 ZCL_CAR（子クラス）     … 乗り物の性質 ＋ タイヤ数、給油する
├── バイク ZCL_BIKE（子クラス） … 乗り物の性質 ＋ 二輪用の操作
└── 船 ZCL_BOAT（子クラス）    … 乗り物の性質 ＋ 浮力・錨を下ろす`}
              />
              <p>
                <strong>粒度を下げる</strong> ＝ いったん「乗り物」という大きな分類で共通部分をまとめ、
                そこから「車」「バイク」と<strong>より具体的なクラス</strong>を作る、という意味です。
                共通の「進む・止まる」を親に1回だけ書けば、子クラスでは車やバイク固有の部分だけ足せます。
              </p>
              <InfoPanel title="仕訳日記帳に置き換えると" variant="breakdown" lead="研修題材への対応です。">
                <ul>
                  <li>親 … 「帳簿」のような共通の設計（合計を持つ、行を足す）</li>
                  <li>子 … 仕訳日記帳、別の帳簿種別（ルールや表示が少し違う）</li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "Step 5: ポリモーフィズム",
          plainText:
            "Step5 ポリモーフィズム\n親「乗り物」の進むを、車・バイク・船がそれぞれ違う動きで実現。\n同じ呼び方、実体ごとに違う動き。継承は受け継ぐ、ポリモーフィズムは動きが変わる。",
          content: (
            <>
              <h2>Step 5: ポリモーフィズム — 同じ操作の呼び方で、実体ごとに違う動き</h2>
              <p>
                Step 4 で、親クラス「乗り物」に <strong>進む</strong> という操作を置きました。
                車・バイク・船はどれも「乗り物」なので、呼び出し側は同じ言葉で頼めます。
              </p>
              <CodeBlock
                language="text"
                code={`呼び出し側: 「進んで！」  （メソッド名はどれも move / 進む）
    │
    ├── 車のオブジェクト   → エンジンで道路を走る
    ├── バイクのオブジェクト → ペダルをこいで進む
    └── 船のオブジェクト   → プロペラや帆で水面を進む`}
              />
              <p>これが <strong>ポリモーフィズム</strong>（多態性）です。</p>
              <ul>
                <li>
                  <strong>同じ操作の呼び方</strong> … 呼ぶ側は「進むを実行して」と
                  <strong>1種類の頼み方</strong>だけ覚えればよい
                </li>
                <li>
                  <strong>実体ごとに違う動き</strong> … 実際に動くのは車・バイク・船それぞれのオブジェクトで、
                  <strong>中身の処理はクラスごとに違う</strong>
                </li>
              </ul>
              <p>
                現実のたとえ: 交通整理の人が「進め！」と合図すると、前にいるのが車なら走り、自転車ならこぐ、船なら進水する。
                合図の<strong>言葉は同じ</strong>、<strong>動き方はモノによって違う</strong>。
              </p>
              <InfoPanel title="覚えるポイント" variant="reference" lead="車の例とプログラムのイメージです。">
                <table>
                  <thead>
                    <tr>
                      <th>覚えるポイント</th>
                      <th>車の例</th>
                      <th>プログラムのイメージ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>呼び出しは共通</td>
                      <td>乗り物リストのそれぞれに「進む」</td>
                      <td>
                        <code>lo_vehicle-&gt;move( )</code> を同じように書く
                      </td>
                    </tr>
                    <tr>
                      <td>中身は個別</td>
                      <td>車は給油、船は錨など別メソッドも持つ</td>
                      <td>子クラスで <code>move</code> の中身を書き分ける</td>
                    </tr>
                    <tr>
                      <td>呼ぶ側は細部を知らなくてよい</td>
                      <td>「乗り物」として扱えばよい</td>
                      <td>車か船かを <code>IF</code> で分岐しなくてよい場合がある</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="継承との違い（混同しやすい点）" variant="breakdown" lead="2つの用語を分けて覚えます。">
                <ul>
                  <li>
                    <strong>継承</strong> … 親の設計を子が<strong>受け継ぐ</strong>（共通をまとめる）
                  </li>
                  <li>
                    <strong>ポリモーフィズム</strong> … 同じ名前の操作を頼んだとき、
                    <strong>どのオブジェクトかで動きが変わる</strong>（呼び方は1つ、答えは実体次第）
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel title="仕訳日記帳に置き換えると" variant="breakdown" lead="研修題材への対応です。">
                <ul>
                  <li>親の帳簿に <strong>行を表示する</strong> があるとする</li>
                  <li>仕訳日記帳のオブジェクト … 借方・貸方の形式で表示</li>
                  <li>別種類の帳簿のオブジェクト … その帳簿用の形式で表示</li>
                </ul>
                <p className="mt-3 mb-0">
                  利用する側は「表示して」と<strong>同じメソッド名</strong>で頼み、実際の表示内容は
                  <strong>どの帳簿オブジェクトか</strong>で変わります。ポリモーフィズムは「分岐の <code>IF</code> を減らし、モノに任せる」
                  設計の考え方だと捉えるとよいです。
                </p>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "まとめ",
          plainText:
            "まとめ\nStep1〜5を車の例と仕訳日記帳で対応づけ。\nモノ・設計図・分類・親子・同じ呼び方で違う動きが頭にあれば用語をコードに載せ替えられる。",
          content: (
            <>
              <h2>まとめ: 車の例から研修題材へ</h2>
              <InfoPanel title="Step 1〜5 の対応表" variant="breakdown" lead="車のたとえと仕訳日記帳の対応です。">
                <table>
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>車のたとえで覚えること</th>
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
                      <td>設計図（クラス）から実物（オブジェクト）を複数作る</td>
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
                      <td>「進む」は同じ合図、車・バイク・船で動きが違う</td>
                      <td>「表示する」は同じ呼び方、帳簿の種類で内容が違う</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                ここまでの「モノ・設計図・分類・親子・同じ呼び方で違う動き」が頭にあれば、用語はそのままコードに載せ替えられます。
              </Callout>
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
                車の例で Step 1〜5 を追えば、クラス・継承・ポリモーフィズムのイメージがつかめます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OopClassMethodLesson);
