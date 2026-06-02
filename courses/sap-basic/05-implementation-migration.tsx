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
  title: "第5章 — ERP導入・移行プロジェクトの実態",
  meta: "初学者 · 20分",
};

export default function ImplementationMigrationLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "05-implementation-migration", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "ERP導入・移行プロジェクトの実態\nSAPを導入するとき、どうやって設計するか・既存システムをどう移行するか・データをどう引き継ぐかを学びます。\n⏱ 20分 / 📶 初学者 / 🏷 SAP Basic\nこの章で学ぶこと\n・スクラッチ開発の罠とFit to Standardの考え方\n・技術的負債とは何か（アドオン開発のコスト増）\n・GreenfieldとBrownfieldの違い\n・データマイグレーションとETLプロセス\nBちゃん：「SAPを導入する」って、単純に買ってきてインストールするだけじゃないんですか？\n先生：大企業の場合、1年〜3年かかるプロジェクトになることも珍しくありません。設計の選択が数年後の維持コストを大きく左右します。",
          content: (
            <>
              <hgroup>
                <h1>ERP導入・移行プロジェクトの実態</h1>
                <p>
                  SAP を導入するとき、<strong>どう設計し・どう移行し・どうデータを引き継ぐか</strong>を整理します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP Basic" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>スクラッチ開発の罠と Fit to Standard の考え方</li>
                <li>技術的負債とは何か（アドオン開発のコスト増）</li>
                <li>Greenfield と Brownfield の違い</li>
                <li>データマイグレーションと ETL プロセス</li>
              </ul>
              <Dialog speaker="b">
                「SAP を導入する」って、単純に買ってきてインストールするだけじゃないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                大企業の場合、1年〜3年かかる大規模プロジェクトになることも珍しくありません。
                設計の選択が、<strong>数年後の維持コストを大きく左右</strong>します。
              </Dialog>
            </>
          ),
        },
        {
          title: "スクラッチ開発とは何か",
          plainText:
            "スクラッチ開発とは\nゼロからシステムを自社向けに作り込むこと。「うちの業務は特殊だから、標準機能では無理」という発想から始まりがちです。\n先生：スクラッチ開発の罠は「自社の業務は特殊だ」という思い込みです。多くの場合、SAP標準機能でカバーできることがほとんどです。\nAくん：「うちだけは特殊」と言いたくなる気持ちは分かりますが、世界中の優良企業が同じ標準機能で動いている事実を考えると、本当に特殊かどうか疑うべきですね。\n先生：その通りです。「特殊」と思っていた業務が実は非効率なだけで、標準に合わせることで改善するケースも多くあります。",
          content: (
            <>
              <h2>スクラッチ開発の罠</h2>
              <p>
                <strong>スクラッチ開発</strong>とは、ゼロからシステムを自社向けに作り込むことです。
                「うちの業務は特殊だから、SAP の標準機能では無理」という発想から生まれがちです。
              </p>
              <Callout variant="warning">
                「自社の業務は特殊」という思い込みが、長期的なコスト増の入り口になることがあります。
                世界中の優良企業が同じ SAP 標準機能で動いていることを思い出しましょう。
              </Callout>
              <Dialog speaker="teacher">
                スクラッチ開発の最大の問題は、<strong>バージョンアップのたびにその作り込みを修正しなければならない</strong>点です。
                SAP が新バージョンを出すたびに、独自改造が壊れる可能性があります。
              </Dialog>
              <Dialog speaker="a">
                「うちだけは特殊」と言いたくなる気持ちは分かりますが、世界の優良企業が同じ標準機能で動いている事実を考えると、
                本当に特殊かどうか疑うべきですね。
              </Dialog>
              <Dialog speaker="teacher">
                「特殊」と思っていた業務が実は非効率なだけで、標準に合わせることで<strong>業務そのものが改善する</strong>ケースも多くあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "Fit to Standardとは",
          plainText:
            "Fit to Standardとは\n業務プロセスをSAPの標準機能（ベストプラクティス）に合わせるアプローチ。スクラッチ開発とは逆の発想です。\nFit to Standardの考え方: SAPの標準機能が「型」であり、自社の業務をその型に合わせていく。\nメリット: 開発コスト削減・バージョンアップしやすい・ベストプラクティスを採用できる。\nBちゃん：業務側が変わらないといけないのは大変そう…。\n先生：「変わる」ことへの抵抗は当然ですが、その変化が将来の競争力になります。コンサルタントの仕事は、現場を説得してその変化を導くことでもあります。",
          content: (
            <>
              <h2>Fit to Standard：逆転の発想</h2>
              <Figure
                src="image/05-fit-to-standard.webp"
                alt="左：業務プロセス（会社の形）が複雑な独自形状で、システム（SAP）を無理やりその形に合わせようとしている図（アドオン開発の状態）。右：シンプルな正方形のSAP標準プロセスに合わせて業務プロセスも整理されている図（Fit to Standardの状態）。変換の方向を示す矢印付き。"
                caption="Fit to Standard：業務プロセスをSAPの「型」に合わせる発想の転換"
                kind="concept"
              />
              <p>
                <strong>Fit to Standard</strong>とは、「システムを業務に合わせる」のではなく、
                <strong>「業務をSAPの標準機能に合わせる」</strong>アプローチです。
                スクラッチ開発とは真逆の発想です。
              </p>
              <InfoPanel title="Fit to Standard のメリット" variant="reference">
                <ul>
                  <li><strong>開発コスト削減</strong> … 独自の ABAP 改修が減る</li>
                  <li><strong>バージョンアップしやすい</strong> … カスタムが少ないほど新バージョンの取り込みが容易</li>
                  <li><strong>ベストプラクティス採用</strong> … 業界で実績のあるプロセスをそのまま活用できる</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                業務側が変わらないといけないのは大変そう…。現場が反発しませんか？
              </Dialog>
              <Dialog speaker="teacher">
                「変わる」ことへの抵抗は当然です。ただ、その変化が将来の競争力になります。
                コンサルタントの重要な仕事の一つは、<strong>現場を説得してその変化を導くこと</strong>でもあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "アドオン開発の技術的負債",
          plainText:
            "アドオン開発の技術的負債\n独自改造を重ねると、バージョンアップのたびにコストが膨らんでいく仕組みです。\n技術的負債：短期的な便宜のために行った実装が、将来の変更コストを増やしてしまうこと。\n比喩：リフォームを重ねすぎた家は、建て替えより高くつく。\nAくん：最初は小さな改修でも、積み重なると巨大な負債になる。長期的な視点が大事ですね。\n先生：「今だけ対応」の積み重ねが、10年後に「もう手が付けられない」システムを生み出します。",
          content: (
            <>
              <h2>アドオン開発の技術的負債</h2>
              <MermaidDiagram
                chart={`flowchart TD
  A[アドオン開発で\n独自改造] --> B[SAP バージョンアップ]
  B --> C[独自改造が壊れる]
  C --> D[修正コスト発生]
  D --> E[さらに別の改造で対応]
  E --> B`}
              />
              <InfoPanel title="用語解説：技術的負債" variant="breakdown">
                <p>
                  <strong>技術的負債</strong>とは、短期的な便宜のために行った実装が、
                  将来の変更や維持にかかるコストを増大させてしまうことです。
                  借金と同じように、放置すれば利子（余分なコスト）が積み上がっていきます。
                </p>
              </InfoPanel>
              <Callout variant="warning">
                リフォームを重ねすぎた家は、最終的に建て替えより高くつく——アドオン開発も同じです。
                「今だけ対応」の積み重ねが、将来の巨大な負債になります。
              </Callout>
              <Dialog speaker="a">
                最初は小さな改修でも、毎年のバージョンアップのたびに修正が増えていく。長期的な視点が大事ですね。
              </Dialog>
              <Dialog speaker="teacher">
                「今だけ対応」の積み重ねが、10年後には「もう手が付けられない」システムを生み出します。
                プロジェクト初期の設計判断が、将来のコストを決定づけるのです。
              </Dialog>
            </>
          ),
        },
        {
          title: "Greenfieldとは",
          plainText:
            "Greenfieldとは\n新規導入：既存システムを一切引き継がず、SAP S/4HANAをゼロから構築するアプローチ。\nメリット：クリーンなスタート。過去の負債を持ち込まない。業務プロセスを抜本的に見直せる。\nデメリット：移行コストが大きい。既存データの移行作業が膨大。現場への影響も大きい。\nBちゃん：更地から建てるようなイメージですね。きれいにできるけど時間もお金もかかる。\n先生：「きれいにやり直したい」という気持ちと「リスクを最小化したい」という現実のバランスを取るのが移行戦略です。",
          content: (
            <>
              <h2>Greenfield：ゼロからの新規構築</h2>
              <p>
                <strong>Greenfield</strong>とは、既存のシステムや業務プロセスを引き継がず、
                SAP S/4HANA を<strong>ゼロから構築する</strong>アプローチです。
                建設の世界でいう「更地から建てる」イメージです。
              </p>
              <InfoPanel title="Greenfield のメリットとデメリット" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>区分</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>メリット</strong></td>
                      <td>過去の負債を持ち込まない・業務プロセスを抜本的に見直せる・クリーンな構成</td>
                    </tr>
                    <tr>
                      <td><strong>デメリット</strong></td>
                      <td>移行コストが大きい・既存データの移行作業が膨大・現場への影響が大きい</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                更地から建てるようなイメージですね。きれいにできるけど、時間もお金も多くかかる。
              </Dialog>
              <Dialog speaker="teacher">
                「きれいにやり直したい」という気持ちと、「リスクを最小化したい」という現実のバランスを取るのが移行戦略です。
                Greenfield は<strong>本当にやり直せる環境と予算がある場合</strong>に選ばれます。
              </Dialog>
            </>
          ),
        },
        {
          title: "Brownfieldとは",
          plainText:
            "Brownfieldとは\n既存SAPからの変換移行。既存のカスタマイズや設定を引き継ぎながらS/4HANAへ移行するアプローチ。\nメリット：移行リスクが低い。既存の業務継続性を保ちやすい。Greenfieldより期間・コストが少ない。\nデメリット：過去のアドオンや負債も引き継ぐ。「きれいにできない」もどかしさ。\nAくん：既存の汚れた部分も含めて引き継ぐわけですね。改装工事みたいな感じ。\n先生：「負債も引き継ぐが、リスクも小さい」のがBrownfield。どちらが正解かは企業の状況次第です。",
          content: (
            <>
              <h2>Brownfield：既存システムからの変換移行</h2>
              <p>
                <strong>Brownfield</strong>とは、既存のSAPシステム（主にECC/R3）のカスタマイズや設定を引き継ぎながら、
                <strong>S/4HANAへ変換移行する</strong>アプローチです。
                「建物を内部から改装する」イメージです。
              </p>
              <InfoPanel title="Brownfield のメリットとデメリット" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>区分</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>メリット</strong></td>
                      <td>移行リスクが低い・業務継続性を保ちやすい・期間とコストがGreenfieldより少ない</td>
                    </tr>
                    <tr>
                      <td><strong>デメリット</strong></td>
                      <td>過去のアドオンや技術的負債も引き継ぐ・設計の抜本的な見直しがしにくい</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                既存の汚れた部分も含めて引き継ぐわけですね。改装工事みたいな感じで、古い壁の問題が残ることも。
              </Dialog>
              <Dialog speaker="teacher">
                「負債も引き継ぐが、リスクも小さい」のが Brownfield の特徴です。
                どちらが正解かは<strong>企業の状況・予算・スケジュール</strong>次第で、一概には言えません。
              </Dialog>
            </>
          ),
        },
        {
          title: "GreenfieldとBrownfieldの比較",
          plainText:
            "GreenfieldとBrownfieldの比較\nGreenfieldは新規構築（更地から）、Brownfieldは既存からの変換移行（改装）。\nGreenfield: 移行期間長い・コスト大・リスク大・クリーンさ高い\nBrownfield: 移行期間短い・コスト小・リスク小・クリーンさ低い\n先生：どちらを選ぶかは「きれいさ」と「リスク・コスト」のトレードオフです。\nAくん：GreenfieldとBrownfieldは対立するものではなく、企業の状況に応じて選ぶものなんですね。",
          content: (
            <>
              <h2>Greenfield と Brownfield の比較</h2>
              <Figure
                src="image/05-greenfield-brownfield.webp"
                alt="左：Greenfield移行。更地に新しいSAP S/4HANAビルが建設されている。右：Brownfield移行。既存のSAP R/3のビルを内部から改装してS/4HANAに変える作業中。建設現場のイメージで新規vs改装を対比。"
                caption="Greenfield（更地から新築）vs Brownfield（既存ビルの改装）"
                kind="concept"
              />
              <MermaidDiagram
                chart={`flowchart LR
  subgraph GF["Greenfield（新規構築）"]
    A[旧システム] -->|使わない| B[SAP S/4HANA\n新規構築]
  end
  subgraph BF["Brownfield（変換移行）"]
    C[SAP ECC/R3] -->|変換| D[SAP S/4HANA\nコンバージョン]
  end`}
              />
              <InfoPanel title="どちらを選ぶ？" variant="breakdown">
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>Greenfield</th>
                      <th>Brownfield</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>移行期間</td>
                      <td>長い</td>
                      <td>比較的短い</td>
                    </tr>
                    <tr>
                      <td>コスト</td>
                      <td>大きい</td>
                      <td>比較的小さい</td>
                    </tr>
                    <tr>
                      <td>クリーンさ</td>
                      <td>高い（ゼロスタート）</td>
                      <td>低い（負債引き継ぎ）</td>
                    </tr>
                    <tr>
                      <td>リスク</td>
                      <td>大きい</td>
                      <td>比較的小さい</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                Greenfield と Brownfield は対立するものではなく、企業の状況に応じて選ぶものなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                正確にはハイブリッドなアプローチを採る企業もあります。「きれいさ」と「リスク・コスト」の
                <strong>トレードオフを経営判断として決める</strong>のがプロジェクトの出発点です。
              </Dialog>
            </>
          ),
        },
        {
          title: "データマイグレーションとは",
          plainText:
            "データマイグレーションとは\nレガシーシステムの既存データを新システムへ移す作業。単純そうに見えて、実務では非常に難しい工程です。\n先生：データは20年分の「ゴミ」がたまっていることがあります。不完全・重複・矛盾したデータを新システムに移すと、システムが壊れるわけではなく、業務に混乱が生じます。\nBちゃん：引越しのとき、いらないものをそのまま新居に持ち込むと部屋が散らかりますよね。それと同じ？\n先生：まさにその通りです。引越し前に「断捨離」をするのが、データクレンジングです。",
          content: (
            <>
              <h2>データマイグレーションとは</h2>
              <p>
                <strong>データマイグレーション</strong>とは、旧システム（レガシーシステム）に蓄積された
                データを新システム（SAP S/4HANA）へ移行する作業です。
              </p>
              <Callout variant="warning">
                数万〜数百万件のデータには、20年分の「ゴミ」が混入していることがあります。
                不完全・重複・矛盾したデータを新システムに持ち込むと、<strong>業務運用に深刻な混乱</strong>が生じます。
              </Callout>
              <Dialog speaker="b">
                引越しのとき、いらないものをそのまま新居に持ち込むと部屋が散らかりますよね。それと同じ感じですか？
              </Dialog>
              <Dialog speaker="teacher">
                まさにその通りです。引越し前に「断捨離」をするのが、<strong>データクレンジング</strong>です。
                データ移行は「技術的な作業」であると同時に、<strong>業務部門との緊密な連携が必要な作業</strong>でもあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "ETLプロセス",
          plainText:
            "ETLプロセス\nETLとはExtract（抽出）→ Transform（変換）→ Load（投入）の3ステップ。データ統合の基本プロセスです。\nExtract: 旧システムからデータを抽出する\nTransform: データを新システムの形式に変換・クレンジングする\nLoad: 変換済みデータをSAPに投入する\nデータクレンジング: 移行前にデータの誤り・重複・不整合を修正する作業。最も時間がかかる。\nAくん：Transformの段階が一番大変そうですね。旧システムと新システムでデータの意味が微妙に違うことも多い。\n先生：例えば旧システムで「未処理」と記録されていたものが、SAPではどのステータスに相当するのか、業務部門に一件一件確認することになります。",
          content: (
            <>
              <h2>ETL プロセス：データ移行の3ステップ</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A["Extract（抽出）\n旧システムから\nデータを取り出す"] --> B["Transform（変換）\nデータのクレンジング・\nマッピング・変換"]
  B --> C["Load（投入）\n変換済みデータを\nSAPへ投入"]`}
              />
              <InfoPanel title="用語解説" variant="reference">
                <dl>
                  <dt><strong>ETL（Extract, Transform, Load）</strong></dt>
                  <dd>データ統合の基本プロセス。抽出・変換・投入の3ステップでデータを移行します。</dd>
                  <dt><strong>データクレンジング</strong></dt>
                  <dd>移行前にデータの誤り・重複・不整合を発見し修正する作業。ETL の Transform に含まれ、最も時間と労力がかかります。</dd>
                </dl>
              </InfoPanel>
              <Dialog speaker="a">
                Transform の段階が一番大変そうですね。旧システムと新システムでデータの意味が微妙に違うことも多い。
              </Dialog>
              <Dialog speaker="teacher">
                例えば旧システムで「未処理」と記録されていたものが、SAP ではどのステータスに相当するのか、
                <strong>業務部門に一件一件確認する</strong>ことになります。これを「マッピング作業」と呼びます。
              </Dialog>
            </>
          ),
        },
        {
          title: "データマイグレーションの難しさ",
          plainText:
            "データマイグレーションの難しさ\n数万件の旧データの品質問題・マッピング作業・業務部門との確認作業が重なります。\n主な課題: データ品質の問題（欠損・重複・矛盾）、データ形式の不一致（旧システムと新システムで違う）、業務知識の必要性（データの意味を理解できる担当者が必要）\n先生：データ移行は「IT プロジェクト」ではなく「業務プロジェクト」です。IT部門だけで完結しません。\nBちゃん：現場の人が協力しないとできない作業なんですね。それがプロジェクトの遅延原因になりそう…。\n先生：おっしゃる通りです。データ品質の確認は業務部門でないとできない判断が多く、スケジュール管理が特に重要です。",
          content: (
            <>
              <h2>データマイグレーションの難しさ</h2>
              <p>
                データ移行は、技術的な困難と<strong>業務的な困難</strong>が両方重なる工程です。
              </p>
              <InfoPanel title="主な課題" variant="reference">
                <ul>
                  <li><strong>データ品質の問題</strong> … 欠損値・重複レコード・矛盾したデータ</li>
                  <li><strong>データ形式の不一致</strong> … 旧システムと SAP でフィールドの定義が異なる</li>
                  <li><strong>マッピング作業</strong> … 旧システムの値を SAP の値に対応付ける地道な作業</li>
                  <li><strong>業務知識の必要性</strong> … データの意味を理解できる業務担当者が不可欠</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                データ移行は「IT プロジェクト」ではなく<strong>「業務プロジェクト」</strong>です。
                IT 部門だけで完結することはありません。
              </Dialog>
              <Dialog speaker="b">
                現場の人が協力しないとできない作業なんですね。それがプロジェクトの遅延原因になりそう…。
              </Dialog>
              <Dialog speaker="teacher">
                おっしゃる通りです。データ品質の判断は業務部門でないとできないことが多く、
                <strong>スケジュール管理と現場との信頼関係構築</strong>が特に重要になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきポイント\n「標準機能に合わせるとうちの業務ができない」という誤解。多くの場合は業務を変えるべき場面です。\nつまずき：「SAP標準機能では今のやり方ができない」と言われたら、本当にできないのか、ただ変えたくないだけなのかを区別することが大切。\n先生：「できない」には2種類あります。「本当に標準機能が対応していない」場合と、「変えたくないだけ」の場合です。後者のほうがはるかに多いのが実態です。\nAくん：「標準でできない」と言う前に、SAPのベストプラクティスに業務を合わせる可能性を真剣に検討することが先決ですね。\n先生：コンサルタントとして求められるのは、その判断を正しく行い、現場を適切な方向に導く力です。",
          content: (
            <>
              <h2>つまずきポイント：「標準ではできない」という誤解</h2>
              <Dialog speaker="stumble">
                「SAP の標準機能では今のやり方ができない」と言われたとき、
                <strong>本当にできないのか、ただ変えたくないだけなのか</strong>を区別することが大切です。
              </Dialog>
              <Callout variant="warning">
                「できない」には2種類あります。①本当に標準機能が対応していない場合、
                ②現在のやり方を変えたくないだけの場合。
                実態として<strong>②のほうがはるかに多い</strong>のです。
              </Callout>
              <Dialog speaker="a">
                「標準でできない」と言う前に、SAP のベストプラクティスに業務を合わせる可能性を
                真剣に検討することが先決ですね。
              </Dialog>
              <Dialog speaker="teacher">
                コンサルタントとして求められるのは、その判断を正しく行い、
                <strong>現場を適切な方向に導く力</strong>です。「お客様の言う通りにするだけ」では、
                長期的に見てお客様のためになりません。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n今章のポイントをキャラクターの対話で振り返ります。\n先生：この章で最も大切なことは、「スクラッチ開発 vs Fit to Standard」「Greenfield vs Brownfield」どちらも、正解が一つではなく企業の状況に応じた判断が必要だということです。\nAくん：Fit to Standardを採用することで開発コストと技術的負債を減らし、将来のバージョンアップをしやすくする。でも業務側の変革を伴うから、変革管理（チェンジマネジメント）も重要なんですね。\nBちゃん：データマイグレーションは地味に見えるけど、プロジェクトの成否を左右する大事な工程なんですね。ETLのTransformで品質を確保することが肝心。\n先生：そうです。どんなに美しいシステムを作っても、データが汚ければ業務は回りません。「ゴミを入れればゴミが出る（Garbage In, Garbage Out）」という言葉があります。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章で最も大切なことは、「スクラッチ開発 vs Fit to Standard」「Greenfield vs Brownfield」
                どちらも<strong>正解が一つではなく、企業の状況に応じた判断が必要</strong>だということです。
              </Dialog>
              <Dialog speaker="a">
                Fit to Standard を採用することで開発コストと技術的負債を減らし、将来のバージョンアップをしやすくする。
                でも業務側の変革を伴うから、<strong>変革管理（チェンジマネジメント）</strong>も重要なんですね。
              </Dialog>
              <Dialog speaker="b">
                データマイグレーションは地味に見えるけど、プロジェクトの成否を左右する大事な工程なんですね。
                ETL の Transform で品質を確保することが肝心。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。どんなに美しいシステムを作っても、データが汚ければ業務は回りません。
                「ゴミを入れればゴミが出る（Garbage In, Garbage Out）」という格言がありますが、
                <strong>データ品質への投資は惜しまない</strong>ことが重要です。
              </Dialog>
              <Callout variant="tip">
                プロジェクトの成功は「技術」だけでなく、<strong>設計の判断・変革管理・データ品質</strong>の三つが揃って初めて実現します。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 Fit to Standardの考え方は？→ 自社業務をSAPの標準機能に合わせてプロセスを見直すアプローチ\nQ2 GreenfieldとBrownfieldの違いは？→ Greenfieldは新規導入でゼロから構築、Brownfieldは既存SAPからの変換移行\nQ3 データマイグレーションで最も重要な作業は？→ データクレンジング（品質確保）と正確なETLプロセス\n今日のひとこと：導入プロジェクトは「技術」だけではありません。設計判断・変革管理・データ品質の三本柱で成否が決まります。",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={1}
                explanation="Fit to Standardは「システムを業務に合わせる」のではなく「業務をSAPの標準機能（ベストプラクティス）に合わせる」考え方です。開発コストを削減し、バージョンアップをしやすくする効果があります。"
                question={<strong>Fit to Standard の考え方として正しいのは？</strong>}
                options={[
                  "自社業務に合わせて SAP をゼロから作り直す",
                  "自社業務を SAP の標準機能に合わせてプロセスを見直す",
                  "SAP を使わず Excel で業務を管理する",
                ]}
              />
              <Quiz
                answer={2}
                explanation="Greenfieldは既存システムを引き継がずSAP S/4HANAをゼロから構築する新規導入です。Brownfieldは既存SAPのカスタマイズを引き継ぎながらS/4HANAへ変換移行するアプローチです。コスト・リスク・クリーンさのトレードオフがあります。"
                question={<strong>Greenfield と Brownfield の違いとして正しいのは？</strong>}
                options={[
                  "Greenfield は既存を引き継ぐ。Brownfield は新規構築",
                  "どちらも同じ意味で使われる業界用語",
                  "Greenfield は新規構築でゼロから開始。Brownfield は既存 SAP からの変換移行",
                ]}
              />
              <Quiz
                answer={0}
                explanation="データマイグレーションで最も重要かつ時間がかかる作業は、データクレンジング（誤り・重複・不整合の修正）とETLのTransform工程です。「ゴミを入れればゴミが出る」という格言通り、データ品質の確保がシステム稼働後の業務品質を決めます。"
                question={<strong>データマイグレーションで最も重要な作業は？</strong>}
                options={[
                  "データクレンジング（品質確保）と正確な ETL プロセス",
                  "できるだけ多くのデータをそのまま移行すること",
                  "新しいデータをゼロから手入力すること",
                ]}
              />
              <Dialog speaker="closing">
                導入プロジェクトは「技術」だけではありません。設計判断・変革管理・データ品質の三本柱で成否が決まります。
                コンサルタントとしての視野を広く持ちましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ImplementationMigrationLesson);
