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
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第6章 — クリーンコア戦略と次世代拡張開発",
  meta: "初学者 · 20分",
};

export default function CleanCoreLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "06-clean-core", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "クリーンコア戦略と次世代拡張開発\nSAP S/4HANA本体を改造せず、拡張機能を外部に分離する「クリーンコア」戦略と、SAP BTPを使った次世代の拡張開発について学びます。\n⏱ 20分 / 📶 初学者 / 🏷 SAP Basic\nこの章で学ぶこと\n・なぜコアが「汚れる」のか（レガシーABAP開発の問題）\n・クリーンコアとは何か（アーキテクチャ思想）\n・SAP BTPの役割と解決策\n・次世代開発でJava・Node.js開発者も参入できる時代\nBちゃん：「コアが汚れる」って、プログラムにゴミが入るということですか？\n先生：比喩としては近いですね。SAP本体のソースコードを直接改造していくと、バージョンアップのたびに問題が起きる状態になっていきます。",
          content: (
            <>
              <hgroup>
                <h1>クリーンコア戦略と次世代拡張開発</h1>
                <p>
                  SAP S/4HANA 本体を改造せず、<strong>拡張機能を外部に分離する</strong>アーキテクチャ思想と、
                  それを実現する SAP BTP について学びます。
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
                <li>なぜコアが「汚れる」のか（レガシー ABAP 開発の問題）</li>
                <li>クリーンコアとは何か（アーキテクチャ思想）</li>
                <li>SAP BTP の役割と解決策</li>
                <li>次世代開発で Java・Node.js 開発者も参入できる時代</li>
              </ul>
              <Dialog speaker="b">
                「コアが汚れる」って、プログラムにゴミが入るということですか？
              </Dialog>
              <Dialog speaker="teacher">
                比喩としては近いですね。SAP 本体のソースコードを直接改造していくと、
                <strong>バージョンアップのたびに問題が起きる状態</strong>になっていきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜコアが汚れるのか",
          plainText:
            "なぜコアが汚れるのか\n過去のSAP開発：ERP本体のソースコードを直接改造（レガシーABAP開発）する手法が主流でした。\n問題: SAPが提供する標準プログラムのソースコードを直接書き換えてしまうこと。SAP社が意図していない改変が積み重なる。\nAくん：Windowsのシステムファイルを直接書き換えるようなものですね。Windowsがアップデートされると書き換えた部分が上書きされてしまう。\n先生：まさにそのイメージです。SAP社が標準のソースコードを更新した場合、その上に書いた改修部分が消えてしまうか、コンフリクトが起きます。",
          content: (
            <>
              <h2>なぜコアが「汚れる」のか</h2>
              <p>
                過去の SAP 開発では、<strong>ERP 本体（コア）のソースコードを直接改造する</strong>手法が一般的でした。
                これをレガシー ABAP 開発と呼びます。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  A[SAP 標準プログラム\nABAP ソースコード] -->|直接改造| B[カスタム ABAP\n標準コードに混入]
  B --> C[SAP バージョンアップ]
  C --> D[カスタム部分が\n上書き・コンフリクト]
  D --> E[修正・再テストコスト\n年々増大]`}
              />
              <Dialog speaker="a">
                Windows のシステムファイルを直接書き換えるようなものですね。
                Windows がアップデートされると、書き換えた部分が上書きされてしまう。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそのイメージです。SAP 社が標準のソースコードを更新した場合、
                その上に書いた改修部分が消えるか、<strong>コンフリクトが起きて動かなくなる</strong>可能性があります。
              </Dialog>
              <Callout variant="warning">
                レガシー ABAP 開発の最大の問題は、SAP の年間アップデートのたびに
                カスタム修正を再確認・再修正しなければならないことです。企業の IT コストが年々増大する原因の一つです。
              </Callout>
            </>
          ),
        },
        {
          title: "クリーンコアとは何か",
          plainText:
            "クリーンコアとは何か\nSAP S/4HANA本体を改造せず、拡張機能を外部に分離しておくアーキテクチャ思想です。\n「コア」＝SAP S/4HANAのERP本体。「クリーン」＝改造されていない、標準のままの状態。\nBちゃん：部屋で例えると、キッチン（コア）には直接手を加えず、外に増設した物置（BTP）で追加の作業をするようなイメージ？\n先生：素晴らしい例えです。そしてキッチンと物置はドア（API）でつながっています。物置をどんなに改装しても、キッチン自体には影響しません。",
          content: (
            <>
              <h2>クリーンコアとは</h2>
              <Figure
                src="image/06-clean-core-concept.webp"
                alt="中央にピカピカに清潔なSAP S/4HANAコア（ガラス張りのクリーンルームのイメージ）。その外側に拡張機能の箱（BTP）があり、APIという細いパイプでコアと接続されている。コアには直接手を触れない構造を視覚化。コアに×マーク（直接改造禁止）と外部に〇マーク（BTPで拡張）が示されている。"
                caption="クリーンコア：SAP S/4HANAコアは手を加えず、外部（BTP）で拡張する"
                kind="concept"
              />
              <p>
                <strong>クリーンコア</strong>とは、SAP S/4HANA 本体（コア）を<strong>標準のまま維持し、
                拡張機能を外部に分離する</strong>アーキテクチャ思想です。
              </p>
              <InfoPanel title="用語整理" variant="reference">
                <dl>
                  <dt><strong>コア（Core）</strong></dt>
                  <dd>SAP S/4HANA の ERP 本体。財務・在庫・購買などの基幹業務処理を担う。</dd>
                  <dt><strong>クリーン（Clean）</strong></dt>
                  <dd>直接改造されておらず、SAP が提供する標準の状態が保たれていること。</dd>
                </dl>
              </InfoPanel>
              <Dialog speaker="b">
                部屋で例えると、キッチン（コア）には直接手を加えず、外に増設した物置（BTP）で追加作業をするイメージ？
              </Dialog>
              <Dialog speaker="teacher">
                素晴らしい例えです。そしてキッチンと物置は<strong>ドア（API）</strong>でつながっています。
                物置をどんなに改装しても、キッチン自体には影響しません。
              </Dialog>
            </>
          ),
        },
        {
          title: "コア汚染の代償",
          plainText:
            "コア汚染の代償\nバージョンアップのたびにカスタム修正が壊れる。年間アップデートができない企業が続出しています。\n主な問題: SAP社は年間数回のアップデートをリリースする。コアを直接改造している企業はアップデートを適用するたびに改造部分を再確認・再修正する必要がある。最終的に「もうアップデートできない」状態になる企業も。\nAくん：アップデートを数年間スキップしたら、最終的にサポート切れになってしまう。技術的負債が雪だるま式に膨れ上がりますね。\n先生：実際に「ECCのサポートが2027年に終わるのに、コアが汚れすぎてS/4HANAに移行できない」という企業が世界中にあります。",
          content: (
            <>
              <h2>コア汚染の代償</h2>
              <Callout variant="warning">
                SAP 社は年間数回のアップデートをリリースします。コアを直接改造している企業は、
                アップデートを適用するたびに<strong>改造部分を再確認・再修正</strong>しなければなりません。
                最終的に「もうアップデートできない」状態になる企業も実在します。
              </Callout>
              <InfoPanel title="コア汚染が引き起こす問題" variant="reference">
                <ul>
                  <li>SAP バージョンアップのたびにカスタム修正が壊れる</li>
                  <li>修正コストが年々増大し、IT 予算を圧迫する</li>
                  <li>アップデートをスキップし続けた結果、サポート切れになるリスク</li>
                  <li>S/4HANA への移行が困難になり、技術的負債が雪だるま式に増える</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                アップデートを数年間スキップしたら、最終的にサポート切れになってしまう。
                技術的負債が雪だるま式に膨れ上がりますね。
              </Dialog>
              <Dialog speaker="teacher">
                実際に「ECC のサポートが終わるのに、コアが汚れすぎて S/4HANA に移行できない」
                という企業が世界中にあります。これが<strong>クリーンコア戦略が強く推進されている背景</strong>です。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP BTPとは",
          plainText:
            "SAP BTPとは\nSAP Business Technology Platform：クラウドプラットフォーム上に独自機能を構築し、APIでERP本体と連携するサービスです。\nBTPはPaaS（Platform as a Service）の一種。アプリケーションを動かすインフラ・ミドルウェアをクラウドで提供します。\nBTPでできること: カスタムアプリの開発・データ統合・AI/機械学習・業務自動化・APIの管理\nBちゃん：「クラウドプラットフォーム」って、開発したアプリを動かす場所をインターネット上に借りるようなイメージ？\n先生：その理解で十分です。サーバーを自社で用意する必要なく、SAPが用意したクラウド環境にアプリをデプロイして動かせます。",
          content: (
            <>
              <h2>SAP BTP とは</h2>
              <p>
                <strong>SAP BTP（Business Technology Platform）</strong>は、
                SAP が提供するクラウドプラットフォームです。
                ERP 本体の外側で独自機能を開発し、<strong>API 経由で ERP と連携</strong>させます。
              </p>
              <InfoPanel title="用語解説" variant="reference">
                <dl>
                  <dt><strong>API（Application Programming Interface）</strong></dt>
                  <dd>
                    システム間の接続インターフェース。BTP で作ったアプリが SAP S/4HANA のデータを
                    読み書きするための「窓口」です。
                  </dd>
                  <dt><strong>クラウドプラットフォーム（PaaS）</strong></dt>
                  <dd>
                    アプリケーションを動かすインフラやミドルウェアをクラウドで提供するサービス。
                    自社でサーバーを用意せずにアプリを開発・運用できます。
                  </dd>
                </dl>
              </InfoPanel>
              <Dialog speaker="b">
                「クラウドプラットフォーム」って、開発したアプリを動かす場所をインターネット上に借りるようなイメージ？
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。サーバーを自社で用意する必要なく、SAP が用意したクラウド環境に
                <strong>アプリをデプロイして動かせます</strong>。開発者はインフラ管理ではなくアプリ開発に集中できます。
              </Dialog>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="sap-basic"
                  lessonFile="51-cloud-basics"
                  slide={5}
                  label="補足②: IaaS・PaaS・SaaS の3層"
                />
                <LessonLinkButton
                  courseSlug="sap-basic"
                  lessonFile="50-it-glossary"
                  slide={6}
                  label="補足①: API の用語解説"
                />
              </div>
            </>
          ),
        },
        {
          title: "BTPが解決すること",
          plainText:
            "BTPが解決すること\n拡張機能をBTP上に分離することで、ERPコアへの影響なしに機能追加できます。\n旧来の問題: 機能追加のたびにERP本体に直接コードを追加 → コアが汚染される。\nBTPによる解決: 新機能はBTP上で開発 → APIでERPコアに接続 → ERPコアは無改造のまま。\nAくん：機能追加とバージョンアップを独立させられるわけですね。BTPの拡張機能はERPのバージョンアップに影響されない。\n先生：その通りです。ERPのバージョンアップ時に確認が必要なのは「APIのインターフェースが変わっていないか」だけになります。",
          content: (
            <>
              <h2>BTP が解決すること</h2>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph OLD["旧来の方式（コア汚染）"]
    direction TB
    A[機能追加要求] --> B[ERPコアに\n直接ABAP追加]
    B --> C[コアが汚染]
  end
  subgraph NEW["クリーンコア + BTP"]
    direction TB
    D[機能追加要求] --> E[BTP上で\n新機能を開発]
    E -->|API接続| F[ERPコアは\n無改造のまま]
  end`}
              />
              <Callout variant="tip">
                BTP と ERP コアは <strong>API</strong> という標準インターフェースで接続されます。
                BTP 側でどんなに改修しても、ERP コアは影響を受けません。
              </Callout>
              <Dialog speaker="a">
                機能追加とバージョンアップを独立させられるわけですね。BTP の拡張機能は ERP のバージョンアップに影響されない。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。ERP バージョンアップ時に確認が必要なのは
                <strong>「API のインターフェースが変わっていないか」</strong>だけになります。
                修正範囲が劇的に小さくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "クリーンコアのアーキテクチャ",
          plainText:
            "クリーンコアのアーキテクチャ\nERP本体とBTP拡張レイヤーの関係図です。\n3層構造: 最下層はSAP S/4HANAコア。中間層はAPI/OData接続レイヤー。上層はSAP BTPクラウドプラットフォーム（拡張アプリ・Fioriアプリ・データ統合）。\nAくん：コアとBTPが完全に分離されているから、それぞれ独立してバージョン管理できる。マイクロサービスの考え方に近いですね。\n先生：その通りです。疎結合（Loose Coupling）という設計原則で、依存関係を最小化する発想です。",
          content: (
            <>
              <h2>クリーンコアのアーキテクチャ</h2>
              <Figure
                src="image/06-btp-architecture.webp"
                alt="3層のアーキテクチャ図。一番下：SAP S/4HANAコア（オンプレミスまたはクラウド）。中間：API/OData接続レイヤー。一番上：SAP BTPクラウドプラットフォーム（Java/Node.jsで作った拡張アプリ、Fioriアプリ、データ統合パイプライン）。各層を双方向の矢印でつなぐ。"
                caption="クリーンコアの3層アーキテクチャ：コア・API層・BTP拡張層"
                kind="diagram"
              />
              <MermaidDiagram
                chart={`flowchart TB
  BTP["SAP BTP（クラウドプラットフォーム）\nJava / Node.js 拡張アプリ\nFiori アプリ / データ統合"]
  API["API / OData 接続レイヤー\n標準インターフェース"]
  CORE["SAP S/4HANA コア\n財務・在庫・購買・生産（無改造）"]
  BTP <-->|API 呼び出し| API
  API <-->|標準 API| CORE`}
              />
              <Dialog speaker="a">
                コアと BTP が完全に分離されているから、それぞれ独立してバージョン管理できる。
                マイクロサービスの考え方に近いですね。
              </Dialog>
              <Dialog speaker="teacher">
                正確な理解です。<strong>疎結合（Loose Coupling）</strong>という設計原則で、
                コンポーネント間の依存関係を最小化する発想です。IT アーキテクチャの基本原則が SAP にも適用されています。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP Cloud SDKとは",
          plainText:
            "SAP Cloud SDKとは\nJava/Node.jsでエンタープライズ級の拡張アプリを開発するためのツールキットです。\nSAP Cloud SDK: SAP BTP上でカスタムアプリを開発する際に使うライブラリ群。Java版とNode.js版がある。SAP S/4HANAへのAPI呼び出しを簡単に実装できる。\nJava/Node.js: 一般的なプログラミング言語・実行環境。SAP BTPではこれらで拡張アプリを開発可能。\nBちゃん：ABAPを知らなくても、JavaやNode.jsができればSAPの拡張開発に参加できるんですか？！\n先生：BTP上の拡張開発に限れば、そうです。JavaやNode.jsのエンジニアがSAPプロジェクトに参入できる道が広がっています。",
          content: (
            <>
              <h2>SAP Cloud SDK とは</h2>
              <p>
                <strong>SAP Cloud SDK</strong>は、Java や Node.js で SAP BTP 上のカスタムアプリを
                開発するためのライブラリ群（ツールキット）です。
              </p>
              <InfoPanel title="用語解説" variant="reference">
                <dl>
                  <dt><strong>Java</strong></dt>
                  <dd>
                    エンタープライズシステムで広く使われるプログラミング言語。
                    SAP BTP でも Java を使って拡張アプリを開発できます。
                  </dd>
                  <dt><strong>Node.js</strong></dt>
                  <dd>
                    JavaScript を実行するサーバーサイド環境。軽量で高速な API サーバーや
                    拡張アプリの開発に使われます。SAP BTP でも対応しています。
                  </dd>
                </dl>
              </InfoPanel>
              <Dialog speaker="b">
                ABAP を知らなくても、Java や Node.js ができれば SAP の拡張開発に参加できるんですか？！
              </Dialog>
              <Dialog speaker="teacher">
                BTP 上の拡張開発に限れば、そうです。Java や Node.js のエンジニアが
                <strong>SAP プロジェクトに参入できる道</strong>が広がっています。
                これが「次世代」と呼ばれる理由の一つです。
              </Dialog>
            </>
          ),
        },
        {
          title: "開発者へのメッセージ",
          plainText:
            "開発者へのメッセージ\nABAPだけでなく、Java・Node.js・Python開発者もSAP拡張に参加できる時代になりました。\n過去のSAP開発: ABAPの専門家のみが参入できる閉じた世界。\n現在のSAP開発: BTPを使えばJava・Node.js・Pythonなど多様な言語で開発可能。SAPの知識＋一般的なITスキルの組み合わせが活きる。\nAくん：ABAP研修でABAPを学びながら、JavaやNode.jsのスキルも組み合わせることでより幅広くSAPプロジェクトに貢献できますね。\nBちゃん：Pythonもできるなら、データ分析や機械学習をSAPのデータに適用する仕事もできそう！\n先生：その通りです。SAP BTPにはPythonも対応したサービスがあります。データサイエンスの知識とSAPの業務データを組み合わせると、大きな価値が生まれます。",
          content: (
            <>
              <h2>開発者へのメッセージ</h2>
              <Callout variant="tip">
                ABAP だけでなく、<strong>Java・Node.js・Python</strong> 開発者も SAP 拡張に参加できる時代です。
                SAP の知識と一般的な IT スキルの組み合わせが、これからのエンジニアに求められます。
              </Callout>
              <InfoPanel title="SAP 開発の変化" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>時代</th>
                      <th>開発スタイル</th>
                      <th>必要スキル</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>過去</strong></td>
                      <td>ERP コアに直接 ABAP 改修</td>
                      <td>ABAP の深い専門知識</td>
                    </tr>
                    <tr>
                      <td><strong>現在</strong></td>
                      <td>BTP 上で外部拡張アプリを開発</td>
                      <td>ABAP ＋ Java / Node.js / Python</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                ABAP 研修で ABAP を学びながら、Java や Node.js のスキルも組み合わせることで
                より幅広く SAP プロジェクトに貢献できますね。
              </Dialog>
              <Dialog speaker="b">
                Python もできるなら、データ分析や機械学習を SAP のデータに適用する仕事もできそう！
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。SAP BTP には Python も対応したサービスがあります。
                データサイエンスの知識と SAP の業務データを組み合わせると、<strong>大きな価値が生まれます</strong>。
              </Dialog>
            </>
          ),
        },
        {
          title: "Clean Core vs レガシーABAP開発の比較",
          plainText:
            "Clean Core vs レガシーABAP開発の比較\n改造場所・バージョンアップ耐性・使用言語・維持コストを比較します。\nレガシーABAP開発: 改造場所=ERP本体の直接改造、バージョンアップ=修正が壊れやすい、使用言語=ABAP、維持コスト=年々増大\nクリーンコア（BTP）: 改造場所=外部プラットフォーム（BTP）、バージョンアップ=ERP本体に影響なし、使用言語=Java/Node.js/ABAP、維持コスト=分離で管理しやすい\nBちゃん：比較表を見ると、クリーンコアのメリットが明確ですね。レガシーの方は何もいいことがないように見えますが…。\n先生：レガシーが悪とも言えません。コア業務ロジックはABAPが主役であり続けます。重要なのはバランスです。",
          content: (
            <>
              <h2>Clean Core vs レガシー ABAP 開発</h2>
              <InfoPanel title="比較表：開発スタイルの違い" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>レガシー ABAP 開発</th>
                      <th>クリーンコア（BTP）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>改造場所</strong></td>
                      <td>ERP 本体の直接改造</td>
                      <td>外部プラットフォーム（BTP）</td>
                    </tr>
                    <tr>
                      <td><strong>バージョンアップ</strong></td>
                      <td>修正が壊れやすい</td>
                      <td>ERP 本体に影響なし</td>
                    </tr>
                    <tr>
                      <td><strong>使用言語</strong></td>
                      <td>ABAP</td>
                      <td>Java / Node.js / ABAP</td>
                    </tr>
                    <tr>
                      <td><strong>維持コスト</strong></td>
                      <td>年々増大</td>
                      <td>分離で管理しやすい</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                比較表を見ると、クリーンコアのメリットが明確ですね。レガシーの方は何もいいことがないように見えますが…。
              </Dialog>
              <Dialog speaker="teacher">
                レガシーが「悪」とは言い切れません。コア業務ロジック（財務処理など）は
                <strong>ABAP が主役であり続けます</strong>。重要なのは、
                「コアに手を入れるべきか、外部に分離すべきか」の判断バランスです。
              </Dialog>
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきポイント\n「BTPがあればABAPは不要」という誤解。コア業務はABAPが主役のまま続きます。\nつまずき：クリーンコアを学ぶと「もうABAPは時代遅れ」と感じてしまいがちですが、それは誤りです。\n先生：SAP S/4HANAの心臓部（財務会計、原価管理、在庫処理）はABAPで動いています。BTPはその外側を拡張するための層であり、コア自体を置き換えるものではありません。\nAくん：ABAP = コアビジネスロジック、BTP/Java = 外部拡張・連携・分析、という役割分担で理解するといいですね。\n先生：その整理は正確です。ABAPを学ぶことはSAPプロフェッショナルとして今でも非常に価値があります。",
          content: (
            <>
              <h2>つまずきポイント：「ABAP は不要」という誤解</h2>
              <Dialog speaker="stumble">
                クリーンコアを学ぶと「もう ABAP は時代遅れ」と感じてしまいがちです。
                しかし、それは誤りです。
              </Dialog>
              <Callout variant="warning">
                SAP S/4HANA の心臓部（財務会計・原価管理・在庫処理）は ABAP で動いています。
                BTP は<strong>その外側を拡張するための層</strong>であり、コア自体を置き換えるものではありません。
              </Callout>
              <Dialog speaker="a">
                ABAP ＝ コアビジネスロジック、BTP/Java ＝ 外部拡張・連携・分析、という
                <strong>役割分担</strong>で理解するといいですね。
              </Dialog>
              <Dialog speaker="teacher">
                その整理は正確です。ABAP を学ぶことは SAP プロフェッショナルとして今でも非常に価値があります。
                BTP と ABAP は<strong>競合ではなく補完関係</strong>にあると覚えておきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n今章のポイントをキャラクターの対話で振り返ります。\n先生：クリーンコア戦略の核心は「SAP S/4HANA本体（コア）に直接手を加えない」という一点に尽きます。これを守ることで、SAP社のアップデートを妨げずに機能拡張し続けられます。\nAくん：BTPがあることで、JavaやNode.jsのエンジニアもSAPプロジェクトに参入できるようになった。拡張開発の選択肢が広がりましたね。APIで接続するアーキテクチャは、現代的なシステム設計の標準とも言えます。\nBちゃん：「コアは汚さない、拡張は外でやる」この一言で覚えられそうです。ABAPも大事だし、JavaやNode.jsも活かせる。どちらも無駄にならない。\n先生：まとめると、クリーンコアは「将来のアップグレードへの投資」です。今少し手間をかけてコアを守ることが、5年後・10年後のコスト削減に直結します。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                クリーンコア戦略の核心は、「SAP S/4HANA 本体（コア）に直接手を加えない」という一点に尽きます。
                これを守ることで、<strong>SAP 社のアップデートを妨げずに機能拡張し続けられます</strong>。
              </Dialog>
              <Dialog speaker="a">
                BTP があることで、Java や Node.js のエンジニアも SAP プロジェクトに参入できるようになった。
                API で接続するアーキテクチャは、現代的なシステム設計の標準とも言えますね。
              </Dialog>
              <Dialog speaker="b">
                「コアは汚さない、拡張は外でやる」この一言で覚えられそうです。
                ABAP も大事だし、Java や Node.js も活かせる。どちらも無駄にならない。
              </Dialog>
              <Dialog speaker="teacher">
                まとめると、クリーンコアは<strong>「将来のアップグレードへの投資」</strong>です。
                今少し手間をかけてコアを守ることが、5年後・10年後のコスト削減に直結します。
              </Dialog>
              <Callout variant="tip">
                クリーンコアの原則は SAP に限らず、<strong>モダンなエンタープライズ IT 設計の基本原則</strong>でもあります。
                疎結合・API 接続・外部拡張の発想は、どのシステム設計でも価値ある考え方です。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "確認テスト\nQ1 クリーンコアの核心は何か？→ SAP S/4HANA本体を直接改造せず、拡張機能を外部に分離すること\nQ2 SAP BTPの役割は？→ ERPコアの外側でカスタム機能を開発し、APIで接続するクラウドプラットフォーム\nQ3 クリーンコア戦略の最大のメリットは？→ SAP本体のバージョンアップを妨げずに機能拡張できること\n今日のひとこと：コアは守り、拡張は外へ。この原則がSAPエンジニアとしての長期的な価値を守ります。",
          content: (
            <>
              <h2>確認テスト</h2>
              <Quiz
                answer={1}
                explanation="クリーンコアの核心はSAP S/4HANA本体（コア）を直接改造せず、拡張機能を外部（BTP）に分離することです。コアを標準のまま維持することで、SAPのバージョンアップに影響されない拡張開発が可能になります。"
                question={<strong>クリーンコアの核心として正しいのは？</strong>}
                options={[
                  "ABAP のコードをすべて削除して新しく書き直す",
                  "SAP S/4HANA 本体を直接改造せず、拡張機能を外部に分離する",
                  "SAP を使わず自社でシステムを構築する",
                ]}
              />
              <Quiz
                answer={2}
                explanation="SAP BTPはERP コアの外側でカスタム機能を開発し、API経由でERPと接続するクラウドプラットフォーム（PaaS）です。Java・Node.jsなど一般的な言語で拡張アプリを開発でき、コアへの直接改造を避けられます。"
                question={<strong>SAP BTP の役割として正しいのは？</strong>}
                options={[
                  "SAP S/4HANA コアの代替となる新しい ERP システム",
                  "ABAP プログラムを自動でテストするツール",
                  "ERP コアの外側でカスタム機能を開発し、API で接続するクラウドプラットフォーム",
                ]}
              />
              <Quiz
                answer={0}
                explanation="クリーンコア戦略の最大のメリットは、SAP S/4HANA本体のバージョンアップを妨げずに機能拡張できることです。コアが無改造なのでアップデート適用コストが最小化され、長期的な維持コストの削減につながります。"
                question={<strong>クリーンコア戦略の最大のメリットは？</strong>}
                options={[
                  "SAP 本体のバージョンアップを妨げずに機能拡張できること",
                  "ABAP エンジニアが不要になること",
                  "SAP を無料で利用できること",
                ]}
              />
              <Dialog speaker="closing">
                コアは守り、拡張は外へ。この原則が SAP エンジニアとしての長期的な価値を守ります。
                ABAP も BTP も、どちらも大切なスキルです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CleanCoreLesson);
