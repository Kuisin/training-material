import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Quiz,
  MermaidDiagram,
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
            "クラウド製品\nオンプレの S/4 に加え、RISE・各種 SaaS・Analytics Cloud・BTP が連携してエコシステムを構成する。",
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
            </>
          ),
        },
        {
          title: "RISEと基盤",
          plainText:
            "RISE with SAP\nハイパースケーラ上のプライベートクラウドで S/4 を運用。BASIS・モジュール・HANA を含む。",
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
              <Callout variant="note">
                <strong>GROW with SAP</strong> は、より SaaS 中心の成長企業向けのクラウド移行オファーとして覚えておくとよいです（詳細は案件により異なります）。
              </Callout>
            </>
          ),
        },
        {
          title: "SaaSとBTP",
          plainText:
            "SaaS: Ariba, Concur, SuccessFactors 等。BTP: 拡張・連携・AI。SAC: 分析・ダッシュボード。",
          content: (
            <>
              <h2>SaaS・Analytics・BTP</h2>
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
                <li>
                  <strong>Ariba</strong> … 調達・サプライヤネットワーク
                </li>
                <li>
                  <strong>Concur</strong> … 経費・出張管理
                </li>
                <li>
                  <strong>SuccessFactors</strong> … 人事・タレント管理
                </li>
                <li>
                  <strong>SAP Analytics Cloud（SAC）</strong> … 分析・計画・ダッシュボード
                </li>
                <li>
                  <strong>BTP</strong> … カスタムアプリ、連携、AI、Side-by-Side 拡張の基盤
                </li>
              </ul>
              <p className="text-sm opacity-80">
                その他の例: Fieldglass、Customer Experience、Integrated Business Planning、Digital Manufacturing など
              </p>
            </>
          ),
        },
        {
          title: "接続の仕組み",
          plainText:
            "RISE 上の S/4 は Cloud Connector 経由で BTP・SaaS とセキュアに接続。ハイパースケーラ上に VM・OS・HANA まで含む。",
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
                Analytics Cloud では、外部データ連携やカスタムプロセス、テンプレート分析も可能です。
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
              <Dialog speaker="teacher">
                すべてを一度に導入するわけではありません。<strong>コア S/4 ＋ 必要な SaaS ＋ BTP で拡張</strong>、が典型です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText: "理解度チェック",
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
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CloudLandscapeLesson);
