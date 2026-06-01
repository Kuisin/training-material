import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "クラウド製品 — RISE・SaaS・BTP・Analytics",
  meta: "初学者 · 25分",
};

export default function CloudLandscapeLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "04-cloud-landscape", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "クラウド製品\nオンプレの S/4 に加え、RISE・各種 SaaS・Analytics Cloud・BTP が連携してエコシステムを構成する。\n⏱ 25分 / 📶 初学者 / 🏷 SAP 構造とサービス\nこの章で学ぶこと\n・RISE with SAP（S/4HANA Cloud, private edition）の位置づけ\n・代表的な SaaS（Ariba / Concur / SuccessFactors など）\n・BTP と Analytics Cloud の役割\n・Cloud Connector とセキュア接続のイメージ",
          content: (
            <>
              <hgroup>
                <h1>クラウド製品</h1>
                <p>
                  SAP は<strong>オンプレミス / プライベートクラウド</strong>の S/4HANA に加え、
                  <strong>SaaS</strong> や <strong>BTP</strong>、<strong>Analytics Cloud</strong> など多層のクラウド製品を提供しています。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>RISE with SAP（S/4HANA Cloud, private edition）の位置づけ</li>
                <li>代表的な SaaS（Ariba / Concur / SuccessFactors など）</li>
                <li>BTP と Analytics Cloud の役割</li>
                <li>Cloud Connector とセキュア接続のイメージ</li>
              </ul>
              <Dialog speaker="b">
                RISE とか BTP とか、カタカナと略語が多くてついていけるか心配です…。
              </Dialog>
              <Dialog speaker="teacher">
                大丈夫。今日は「どこにどんな製品が置かれているか」の地図を作るだけです。細かい機能は案件ごとに覚えれば十分です。
              </Dialog>
            </>
          ),
        },
        {
          title: "RISEと基盤",
          plainText:
            "RISE with SAP\nハイパースケーラ上のプライベートクラウドで S/4 を運用。BASIS・モジュール・HANA を含む。\nRISEはクラウドへ引っ越しを支援するパッケージ。GROW with SAPは成長企業向けのSaaS中心オファー。\nAくん：RISEはインフラごとSAPに任せて、S/4を動かし続けるための仕組みなんですね。\nBちゃん：自前でサーバーを管理しなくていい、ということかな。",
          content: (
            <>
              <h2>RISE with SAP（プライベートクラウド）</h2>
              <p>
                <strong>RISE with SAP</strong> は、<strong>S/4HANA Cloud, private edition</strong> を中心に、
                インフラ運用を含めたクラウド移行・運用のパッケージです。Azure / AWS / GCP などの
                <strong>ハイパースケーラ</strong>上で VM・OS・カーネルまで含めて S/4 スタックが載ります。
              </p>
              <ul>
                <li>コア: S/4HANA（BASIS、各モジュール、SAP HANA）</li>
                <li>外部連携の入口: <strong>SAP Cloud Connector</strong></li>
                <li>インターネット経由で SaaS や BTP と<strong>セキュアトンネル</strong>で接続</li>
              </ul>
              <Dialog speaker="a">
                RISE はインフラごと SAP に任せて、S/4 を動かし続けるためのパッケージなんですね。
              </Dialog>
              <Dialog speaker="b">
                自前でサーバーを管理しなくていい、ということかな。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。<strong>GROW with SAP</strong> は、より SaaS 中心の成長企業向けのオファーとして覚えておくとよいです。
              </Dialog>
              <Callout variant="note">
                <strong>GROW with SAP</strong> は、より SaaS 中心の成長企業向けのクラウド移行オファーとして覚えておくとよいです（詳細は案件により異なります）。
              </Callout>
            </>
          ),
        },
        {
          title: "SaaSとBTP",
          plainText:
            "SaaS: Ariba（調達）, Concur（経費）, SuccessFactors（人事）等。BTP: 拡張・連携・AI。SAC: 分析・ダッシュボード。\nS/4はCloud Connector経由でBTPや各SaaSとセキュアにつながる。",
          content: (
            <>
              <h2>SaaS・Analytics・BTP の全体像</h2>
              <Figure
                src="image/04-cloud-landscape.webp"
                alt="RISE with SAP S/4HANA Cloud Private Editionの構成図。左ブロック：Cloud Service(Azure/AWS/GCP)→VM(Hyperscaler)→OS/Kernel→S/4 HANA→BASIS→モジュール群→SAP HANAの積み重ね構造。中央にSAP Cloud ConnectorとInternet Secure Tunnel。右ブロック：Ariba/Concur/SuccessFactorsなどSAP Cloud SaaS SolutionsとBusiness Technology Platform(3rd-Party Integration/Custom Processes/Pre-made Templates/SAP Analytics Cloud)、さらにNon-SAP External Services。"
                caption="RISE with SAP のフル構成：プライベートクラウドのS/4スタック → Cloud Connector → Cloud SaaS & BTP"
                kind="diagram"
              />
              <MermaidDiagram
                chart={`flowchart LR
  subgraph core["ERP コア（例）"]
    S4[S/4HANA]
  end
  subgraph saas["SAP Cloud SaaS"]
    AR[Ariba\n調達]
    CO[Concur\n経費]
    SF[SuccessFactors\n人事]
  end
  subgraph plat["プラットフォーム"]
    SAC[SAP Analytics Cloud]
    BTP[Business Technology Platform]
  end
  S4 <-->|Cloud Connector| BTP
  S4 --> saas
  BTP --> SAC
  BTP --> EXT[非 SAP 外部サービス]`}
              />
              <ul>
                <li><strong>Ariba</strong> … 調達・サプライヤネットワーク</li>
                <li><strong>Concur</strong> … 経費・出張管理</li>
                <li><strong>SuccessFactors</strong> … 人事・タレント管理</li>
                <li><strong>SAP Analytics Cloud（SAC）</strong> … 分析・計画・ダッシュボード</li>
                <li><strong>BTP</strong> … カスタムアプリ、連携、AI、Side-by-Side 拡張の基盤</li>
              </ul>
              <Dialog speaker="b">
                調達に Ariba、経費に Concur、人事に SuccessFactors、分析に SAC……それぞれ専門家を別に雇う感じですね。
              </Dialog>
              <Dialog speaker="teacher">
                いいたとえです。S/4 がゼネラリスト（社内全般）で、各 SaaS が専門家（外部委託）、BTP がそれをつなぐ共通基盤、という見方もできます。
              </Dialog>
            </>
          ),
        },
        {
          title: "接続の仕組み",
          plainText:
            "RISE上のS/4はCloud Connector経由でBTP・SaaSとセキュアに接続。IaaS→VM→OS→S4スタックの積み上げ構造。\nAくん：Cloud Connectorがファイアウォールの中から外へのセキュアな出口を作るイメージ。\n先生：S/4単体で全部入れるより、コア＋必要なSaaS＋BTP拡張が典型の構成です。",
          content: (
            <>
              <h2>プライベートクラウドと外部の接続</h2>
              <p>
                <strong>RISE with SAP</strong>（S/4HANA Cloud, private edition）では、Azure / AWS / GCP などの
                クラウド上に、おおまかに次の層が積み上がります。
              </p>
              <ol>
                <li>クラウドサービス（IaaS）</li>
                <li>VM（ハイパースケーラ）</li>
                <li>OS・カーネル</li>
                <li>S/4 スタック（BASIS、モジュール、SAP HANA）</li>
              </ol>
              <p>
                社内やインターネット越しに <strong>SAP Cloud SaaS</strong> や <strong>BTP</strong> とつなぐときは、
                <strong>SAP Cloud Connector</strong> を経由し、<strong>セキュアトンネル</strong>で通信します。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph private["プライベートクラウド"]
    S4[S/4 + HANA]
    CC[Cloud Connector]
    S4 --> CC
  end
  TUN[セキュアトンネル]
  subgraph public["パブリック側"]
    BTP[BTP]
    SAAS[SaaS]
    SAC[Analytics Cloud]
  end
  CC --> TUN --> BTP
  TUN --> SAAS
  BTP --> SAC`}
              />
              <Dialog speaker="a">
                Cloud Connector がファイアウォールの中から外へのセキュアな出口を作るイメージですね。
              </Dialog>
              <Dialog speaker="teacher">
                すべてを一度に導入するわけではありません。<strong>コア S/4 ＋ 必要な SaaS ＋ BTP で拡張</strong>、が典型です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 カスタムアプリや外部連携の拡張基盤は？→ SAP BTP\nQ2 人事・タレント管理のSaaSは？→ SuccessFactors\n今日のひとこと：略語に迷ったら「どの専門家が何を担うか」に戻ると整理できます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="BTP（Business Technology Platform）は拡張開発・連携・AI などのプラットフォームです。"
                question={<strong>カスタムアプリや外部連携の拡張基盤として説明されるのは？</strong>}
                options={["SAP Fiori のみ", "SAP GUI のみ", "SAP BTP"]}
              />
              <Quiz
                answer={1}
                explanation="SuccessFactors は人事・タレント領域の SaaS です。Ariba は調達、Concur は経費が中心です。"
                question={<strong>人事・タレント管理の SaaS として代表的なのは？</strong>}
                options={["Ariba", "SuccessFactors", "Concur"]}
              />
              <Dialog speaker="closing">
                略語に迷ったら「どの専門家が何を担うか」に戻ると整理できます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CloudLandscapeLesson);
