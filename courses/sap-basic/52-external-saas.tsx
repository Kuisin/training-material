import {
  Lesson,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  Figure,
  LessonMeta,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "補足 — コース中に登場する主要外部SaaSツール解説",
  meta: "補足 · 20分",
};

export default function ExternalSaasLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "52-external-saas", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "補足 — コース中に登場する主要外部SaaSツール解説\n第4章（Best of Breed）などで名前が出てきたSalesforce・Workday・NetSuiteなどの外部SaaSについて、それぞれが何をするものか解説します。\n⏱ 20分 / 📶 初学者 / 🏷 外部ツール補足\nこの補足で学ぶこと\n・Salesforce（CRM）とは何か\n・Workday（HCM/ERP）とは何か\n・NetSuite（中堅向けERP）とは何か\n・これらとSAP S/4HANAの関係（競合 or 補完）",
          content: (
            <>
              <hgroup>
                <h1>補足 — コース中に登場する主要外部SaaSツール</h1>
                <p>第4章「Best of Breed」で登場したSaaSの実態を詳しく見ます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "外部ツール補足" },
                ]}
              />
              <h3>この補足で学ぶこと</h3>
              <ul>
                <li>Salesforce（CRM）とは何か、SAP SDとどう違うか</li>
                <li>Workday（HCM/財務）とは何か</li>
                <li>NetSuite（中堅向けクラウドERP）とは何か</li>
                <li>ServiceNow・MuleSoftなどの統合ツール</li>
              </ul>
            </>
          ),
        },
        {
          title: "Salesforceとは",
          plainText:
            "Salesforce（セールスフォース）とは何か\nSalesforceは1999年創業、米国サンフランシスコのSaaS企業です。主力製品はCRM（Customer Relationship Management：顧客関係管理）ツールです。\n主な機能：商談管理（案件の進捗トラッキング）、顧客データベース（連絡先・企業情報）、営業活動の記録・分析、カスタマーサポート（Service Cloud）。\nSAPとの関係：SAPのSDモジュール（Sales & Distribution）が受注から請求までの業務処理を担うのに対し、Salesforceは受注前の営業活動（案件発掘〜商談成立）に強みを持ちます。多くの大企業でSalesforce + SAP S/4HANAを組み合わせて使います。\n先生：SalesforceとSAPはよく「競合」と言われますが、実際は役割が異なる「補完関係」で使われることが多いです。\nAくん：フロントエンド（営業活動）はSalesforce、バックエンド（受注処理・在庫・財務）はSAPという分担ですね。",
          content: (
            <>
              <h2>Salesforce（セールスフォース）とは何か</h2>
              <p>
                Salesforceは<strong>CRM（Customer Relationship Management）</strong>の世界最大手SaaSです。
                1999年創業、SaaS型ビジネスモデルのパイオニアとして知られています。
              </p>
              <InfoPanel title="Salesforce の主要製品群" variant="reference">
                <table>
                  <thead>
                    <tr><th>製品名</th><th>用途</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Sales Cloud</td><td>営業支援・商談管理・顧客DB</td></tr>
                    <tr><td>Service Cloud</td><td>カスタマーサポート・問い合わせ管理</td></tr>
                    <tr><td>Marketing Cloud</td><td>マーケティング自動化・メール配信</td></tr>
                    <tr><td>Commerce Cloud</td><td>EC・オンライン販売</td></tr>
                    <tr><td>Salesforce Platform</td><td>カスタムアプリ開発（PaaS）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                <strong>SalesforceとSAP SDの使い分け</strong>
                <ul>
                  <li><strong>Salesforce（受注前）</strong>：リード発掘 → 商談 → 見積提案 → 受注確定まで</li>
                  <li><strong>SAP SD（受注後）</strong>：受注登録 → 出荷指示 → 請求書発行 → 売上計上まで</li>
                </ul>
                多くの大企業で両システムをAPIで連携して使用。
              </Callout>
              <Dialog speaker="teacher">
                SalesforceとSAPはよく「競合」と言われますが、実際は役割が異なる「補完関係」で使われることが多いです。
              </Dialog>
              <Dialog speaker="a">
                フロントエンド（営業活動）はSalesforce、バックエンド（受注処理・在庫・財務）はSAPという分担ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Workdayとは",
          plainText:
            "Workday（ワークデイ）とは何か\nWorkdayは2005年創業、米国カリフォルニアのSaaS企業です。HCM（Human Capital Management：人材管理）と財務管理（Financial Management）に特化したクラウドERPです。\n主な機能：人事管理（採用・評価・給与・退職）、財務会計・予算管理、調達管理。\nSAPとの関係：Workdayは大企業の人事・財務領域でSAPと直接競合します。特に人事（HR）モジュールでWorkdayを選択し、基幹ERPはSAPという構成も珍しくありません。Fortune500の50%以上がWorkdayを使用しているとされます。\nBちゃん：人事系はWorkday、財務・製造・在庫はSAP、という会社も多いんですね。\n先生：そうです。これが第4章で学んだ「Best of Breed」の実際の姿の一例です。",
          content: (
            <>
              <h2>Workday（ワークデイ）とは何か</h2>
              <p>
                WorkdayはHCM（Human Capital Management）と財務管理に特化した<strong>クラウドERPのSaaS</strong>です。
                2005年創業。大企業の人事・財務領域でSAPと競合します。
              </p>
              <InfoPanel title="Workday の主要機能" variant="reference">
                <table>
                  <thead>
                    <tr><th>領域</th><th>機能</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>HCM（人材管理）</td><td>採用・オンボーディング・評価・給与・退職管理</td></tr>
                    <tr><td>財務管理</td><td>財務会計・予算管理・費用精算</td></tr>
                    <tr><td>調達管理</td><td>購買・サプライヤー管理</td></tr>
                    <tr><td>分析</td><td>ピープルアナリティクス・財務ダッシュボード</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                人事系はWorkday、財務・製造・在庫はSAP、という会社も多いんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。これが第4章で学んだ「Best of Breed」の実際の姿の一例です。ただし、Workdayはグローバル展開の標準化に強いため、SAP HRモジュールを置き換えて全社統一するケースも増えています。
              </Dialog>
              <Dialog speaker="a">
                BoBのメリット（各領域で最強）とデメリット（システム間連携の複雑さ）のトレードオフが、Workday + SAP S/4HANAという組み合わせにも当てはまるんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "NetSuiteとは",
          plainText:
            "NetSuite（ネットスイート）とは何か\nNetSuiteはOracle（オラクル）が買収したクラウドERPです。中堅〜中規模企業向けに設計されており、財務・在庫・受発注・CRMを1つのクラウドシステムで提供します。\nSAPとの関係：NetSuiteとSAPは直接競合しますが、対象規模が異なります。NetSuiteは中堅企業（売上数十〜数百億円規模）向け、SAP S/4HANAは大企業（売上数百億〜数千億円以上）向けが中心。\n先生：企業規模や複雑さに応じてERPを選ぶ、という視点が重要です。SAP S/4HANAは強力ですが、導入コストも大きいため、小〜中規模企業にはオーバースペックになることもあります。\nAくん：エンタープライズITの世界では「最強≠最適」というケースが多いわけですね。",
          content: (
            <>
              <h2>NetSuite（ネットスイート）とは何か</h2>
              <p>
                NetSuiteはOracleが2016年に買収したクラウドERPです。
                <strong>中堅〜中規模企業向け</strong>に財務・在庫・受発注・CRMを1つのシステムで提供します。
              </p>
              <Callout variant="note">
                <strong>ERP市場の規模別マップ</strong>
                <ul>
                  <li><strong>大企業（グローバル）</strong>：SAP S/4HANA、Oracle ERP Cloud</li>
                  <li><strong>中堅企業</strong>：NetSuite、Microsoft Dynamics 365</li>
                  <li><strong>中小企業</strong>：freee、マネーフォワード、弥生</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                企業規模や複雑さに応じてERPを選ぶ視点が重要です。SAP S/4HANAは強力ですが導入コストも大きいため、中小企業にはオーバースペックになることもあります。
              </Dialog>
              <Dialog speaker="a">
                エンタープライズITの世界では「最強≠最適」というケースが多いわけですね。要件に合ったシステムを選ぶことが最も重要。
              </Dialog>
              <Dialog speaker="b">
                NetSuiteの名前はよく聞きますが、「Oracleが親会社のクラウドERP」という位置づけだったんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ServiceNow / MuleSoftとは",
          plainText:
            "統合ツール：ServiceNow と MuleSoft\nBest of Breed環境では、複数のSaaSを統合するミドルウェアも重要な役割を果たします。\nServiceNow（サービスナウ）：ITサービス管理（ITSM）のSaaS。ヘルプデスク、インシデント管理、変更管理などIT運用プロセスを自動化・標準化します。近年はERPとも連携し、業務ワークフローの自動化にも使用されます。\nMuleSoft（ミュールソフト）：Salesforceが買収したAPIインテグレーション（システム間連携）プラットフォーム。SAP・Salesforce・Workdayなど異なるシステムをAPIで橋渡しします。第4章で学んだ「Best of Breedの連携課題」を解決するためのツールの一つです。\n先生：SAPも自社の統合プラットフォーム（SAP Integration Suite）を持っており、外部システムとのAPI連携を担います。\nAくん：統合ツールはBoBアーキテクチャの「のり」の役割ですね。バラバラなSaaSをつなぎ留めるもの。",
          content: (
            <>
              <h2>統合ツール：ServiceNow と MuleSoft</h2>
              <p>
                Best of Breed環境では、複数のSaaSを統合するミドルウェアも重要な役割を担います。
              </p>
              <InfoPanel title="主要な統合・ITサービス管理ツール" variant="reference">
                <table>
                  <thead>
                    <tr><th>ツール</th><th>カテゴリ</th><th>主な用途</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>ServiceNow</td><td>ITSM / ワークフロー自動化</td><td>ヘルプデスク・インシデント・変更管理</td></tr>
                    <tr><td>MuleSoft</td><td>APIインテグレーション</td><td>SaaS間のAPIによるデータ連携</td></tr>
                    <tr><td>SAP Integration Suite</td><td>SAP製統合プラットフォーム</td><td>SAP-外部システム間のAPI/EDI連携</td></tr>
                    <tr><td>Boomi（Dell）</td><td>iPaaS（統合PaaS）</td><td>クラウド間・クラウド-オンプレ間の統合</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAPも自社の統合プラットフォーム（SAP Integration Suite）を持っており、外部システムとのAPI連携を担います。MuleSoftはSalesforceが買収したため、Salesforce環境との親和性が高い。
              </Dialog>
              <Dialog speaker="a">
                統合ツールはBoBアーキテクチャの「のり」の役割ですね。バラバラなSaaSをつなぎ留めるもの。でもこの「のり」が複雑になりすぎることが、第4章で学んだBoBの限界でもある。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP との関係まとめ",
          plainText:
            "各外部ツールとSAP S/4HANAの関係まとめ\n競合（同じ機能をカバー）：Workday（HR・財務）、NetSuite（中規模ERP）、Oracle ERP Cloud（大企業向けERP）。\n補完（役割分担で共存）：Salesforce（受注前の営業管理）、ServiceNow（IT運用管理）、各種BIツール（分析）。\n連携ツール：MuleSoft、SAP Integration Suite（複数SaaSをAPIで接続）。\n先生：「競合か補完か」は時代とともに変化します。SAPはCRMやHRの機能も取り込んでいますし、Salesforceもバックオフィス機能を追加しています。企業はこの動きを常に観察しながらシステム構成を見直す必要があります。",
          content: (
            <>
              <h2>各外部ツールとSAP S/4HANAの関係まとめ</h2>
              <Figure
                src="image/52-saas-ecosystem.webp"
                alt="中央にSAP S/4HANAのボックス。左側に「競合」ゾーン（Workday・NetSuite・Oracle ERP Cloud）が赤枠で表示。右側に「補完」ゾーン（Salesforce・ServiceNow・Tableau・Power BI）が緑枠で表示。下部に「統合ツール」ゾーン（MuleSoft・SAP Integration Suite）が青枠で表示。各ツールのロゴアイコン付き。"
                caption="SAP S/4HANAと外部SaaSの関係：競合・補完・統合の3カテゴリ"
                kind="diagram"
              />
              <InfoPanel title="SAP S/4HANAとの関係分類" variant="reference">
                <table>
                  <thead>
                    <tr><th>関係</th><th>ツール名</th><th>主な競合/補完領域</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>競合</td><td>Workday, NetSuite, Oracle ERP Cloud</td><td>HR・財務・ERP機能全般</td></tr>
                    <tr><td>補完</td><td>Salesforce, ServiceNow, Tableau, Power BI</td><td>CRM・ITSM・BI分析</td></tr>
                    <tr><td>統合ツール</td><td>MuleSoft, SAP Integration Suite</td><td>システム間API連携</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                「競合か補完か」は時代とともに変化します。SAPはCRM・HRの機能も取り込んでいるし、SalesforceもERP的な機能を追加しています。この動きを常に観察しながらシステム構成を見直すことが大切です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 Salesforceの主な用途と、SAPとの役割の違いは？→ Salesforceは受注前の営業管理（CRM）に強く、SAPは受注後の業務処理（在庫・出荷・財務）を担う。補完関係で共存するケースが多い\nQ2 Workdayが得意な業務領域は？→ HCM（人材管理：採用・評価・給与）と財務管理\n今日のひとこと：外部SaaSの役割が分かると、「SAPだけで全てを解決する」のではなく、適切なシステムを組み合わせるアーキテクチャの視点が身につきます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="SalesforceはCRM（顧客関係管理）ツールで、受注前の営業活動（リード管理・商談・見積）に強みを持ちます。SAP SDモジュールは受注後（受注登録・出荷・請求）を担うため、両者は補完関係で共存することが多く、APIで連携して使われます。"
                question={<strong>SalesforceとSAP SDモジュールの関係として最も適切なのは？</strong>}
                options={[
                  "Salesforceは受注前の営業管理、SAP SDは受注後の業務処理を担い、補完関係で共存する",
                  "SalesforceはSAP SDを完全に置き換えることができ、どちらか一方を選べばよい",
                  "Salesforceは財務会計専門のツールである",
                ]}
              />
              <Quiz
                answer={2}
                explanation="WorkdayはHCM（Human Capital Management：人材管理）と財務管理に特化したクラウドERPです。採用・評価・給与・退職管理などHR領域で特に強みを持ち、SAP HRモジュールと競合することが多い。Fortune500の50%以上が採用しているとされています。"
                question={<strong>Workdayが最も得意とする業務領域はどれ？</strong>}
                options={[
                  "製造管理（MRP・BOM）と在庫管理",
                  "BI分析とデータウェアハウス構築",
                  "人材管理（HCM）と財務管理",
                ]}
              />
              <Dialog speaker="closing">
                外部SaaSの役割が分かると、「SAPだけで全て解決」ではなく、適切なシステムを組み合わせるアーキテクチャの視点が身につきます。これが現代のエンタープライズITの現場で最も重要なスキルの一つです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExternalSaasLesson);
