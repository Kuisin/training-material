import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  Figure,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "補足C — データガバナンス・MDM用語集",
  meta: "補足 · 15分",
};

export default function DataGovernanceTermsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-history-compare", "52-data-governance-terms", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "補足C — データガバナンス・MDM用語集\nこの補足では本編の第6章で登場したデータガバナンス・MDM（マスターデータ管理）領域の用語を体系的に解説します。「データ品質」「データリネージ」「データスチュワードシップ」「GDPR対応」などの概念をSAPの実務文脈と合わせて整理します。\n⏱ 15分 / 📶 補足 / 🏷 データガバナンス\nこの補足で学ぶこと\n・MDM（マスターデータ管理）の概念とゴールデンレコード\n・データ品質の5次元（完全性・正確性・一貫性・適時性・一意性）\n・データカタログとデータリネージ：データの「地図」と「履歴書」\n・データスチュワードシップ：データオーナー・スチュワード・カストディアンの役割\n・GDPR・個人情報保護法とSAPのコンプライアンス機能",
          content: (
            <>
              <hgroup>
                <h1>データガバナンス・MDM用語集</h1>
                <p>
                  ERPの価値はデータの質で決まります。本編第6章の理解をより深めるための用語集です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "補足" },
                  { icon: "🏷", text: "データガバナンス" },
                ]}
              />
              <h3>この補足で学ぶこと</h3>
              <ul>
                <li>MDM（マスターデータ管理）の概念とゴールデンレコード</li>
                <li>データ品質の5次元（完全性・正確性・一貫性・適時性・一意性）</li>
                <li>データカタログとデータリネージ：データの「地図」と「履歴書」</li>
                <li>データスチュワードシップ：役割と組織ガバナンス</li>
                <li>GDPR・個人情報保護法とSAPのコンプライアンス機能</li>
              </ul>
              <Callout variant="note">
                この補足は第6章「アーキテクチャ選定・ガバナンス・コストの観点」の理解を深めるための追加コンテンツです。本編を先に読むことを推奨します。
              </Callout>
              <LessonLinkButton
                courseSlug="sap-history-compare"
                lessonFile="05-governance-cost"
                slide={7}
                label="本編第6章: MDMとデータガバナンス"
                variant="back"
                className="mt-4"
              />
            </>
          ),
        },
        {
          title: "MDM（マスターデータ管理）とは",
          plainText:
            "MDM（Master Data Management）：企業のデータの「正本」を管理する仕組み\nMDMとは、企業全体で共有される重要なデータ（マスターデータ）の定義・品質・ライフサイクルを一元管理する仕組みです。SAPにおける主要マスターデータは①顧客マスタ（BP: Business Partner）、②材料マスタ（Material Master）、③仕入先マスタ（Vendor Master）、④勘定科目マスタ（Chart of Accounts）の4つが代表的です。\nゴールデンレコード（Golden Record）：複数のシステムに存在する同一エンティティ（例：同一顧客）の情報を突合・統合した「正しい唯一の記録」。SAPのBusiness Partnerに登録された顧客情報がゴールデンレコードになると、CRM（Salesforce等）・ERPバックオフィス・SoI（Snowflake等）の全システムがこの情報を参照する。\nMDMが必要になる理由：M&A（合併・買収）で複数のERPシステムを統合する際に同じ顧客が複数のIDで登録されている問題が発生する。MDMがないと分析データが汚染され、誤った経営判断につながる。\n先生：MDMを一言で言えば「データの源泉徴収」です。財務の正本帳簿と同じように、「どのシステムが何のデータの正本（Single Source of Truth）か」を明確に定義し管理することがMDMの本質です。\nAちゃん：SAPのBusiness Partnerに複数の役割（顧客・仕入先の両方）を一つのIDで管理できる機能も、MDMの一環と考えられますね。",
          content: (
            <>
              <h2>MDM（マスターデータ管理）：データの「正本」を守る</h2>
              <Figure
                src="image/52-mdm-golden-record.webp"
                alt="MDMゴールデンレコードの概念図。中央に大きな「MDM Hub（SAP S/4HANA）」のボックスと「ゴールデンレコード」のラベル。左側から「CRM（Salesforce）の顧客ID: A001」「旧ERPの顧客コード: CUST-99」「ECサイトの会員番号: U5521」という3つの矢印がMDM Hubに向かって収束。MDM Hubから右側に「Snowflake（分析用）」「Dynamics 365（サービス管理）」「BIレポート」の3つへ矢印が分岐。中央のHub内に「名寄せ・統合・品質チェック」のラベル。"
                caption="MDM Hubが複数システムの顧客情報を名寄せ・統合してゴールデンレコードを生成し、全システムが参照する"
                kind="diagram"
              />
              <InfoPanel
                title="SAPにおける主要マスターデータ4種"
                variant="reference"
                lead="これら4種が不整合を起こすと、財務報告・在庫管理・与信管理のすべてに影響します。"
              >
                <ul>
                  <li>
                    <strong>顧客マスタ（Business Partner / BP）</strong>：顧客・仕入先・グループ会社を一元管理。S/4HANAではBPが唯一のID
                  </li>
                  <li>
                    <strong>材料マスタ（Material Master）</strong>：製品・仕入品・半製品の属性定義（MRP・購買・販売・会計ビュー）
                  </li>
                  <li>
                    <strong>仕入先マスタ（Vendor Master）</strong>：サプライヤー情報。BP統合後はBPの仕入先役割として管理
                  </li>
                  <li>
                    <strong>勘定科目マスタ（Chart of Accounts）</strong>：財務仕訳の科目定義。ACDOCA（Universal Journal）に直結
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                MDMを一言で言えば「データの源泉」です。財務の正本帳簿と同じように、「どのシステムが何のデータの正本（Single Source of Truth）か」を明確に定義し管理することがMDMの本質です。
              </Dialog>
              <Dialog speaker="a">
                SAPのBusiness Partnerに複数の役割（顧客・仕入先の両方）を一つのIDで管理できる機能も、MDMの一環と考えられますね。M&A後の統合でBPのIDが重複してしまうケースが現実の問題として多いと聞きます。
              </Dialog>
              <Dialog speaker="b">
                ゴールデンレコードって「市民台帳」みたいなものですね。複数の省庁（システム）が同じ人の情報を持っていても、マイナンバーで名寄せして正本を一つ決めるイメージです。
              </Dialog>
            </>
          ),
        },
        {
          title: "データ品質の5次元",
          plainText:
            "データ品質（Data Quality）を評価する5つの次元\nデータ品質とは「データが意図した用途に適切に使えるかどうか」の度合いです。DQ（Data Quality）を測定・改善するためには以下の5つの次元（Dimension）が広く使われます。\n①完全性（Completeness）：必須フィールドが埋まっているか。例：SAPの顧客マスタに与信限度額が未設定 → 自動与信チェックが機能しない。②正確性（Accuracy）：実世界の事実と一致しているか。例：材料マスタの標準原価が実際の調達価格と大幅乖離 → 原価計算が誤る。③一貫性（Consistency）：複数システム間で矛盾がないか。例：SAPの顧客住所とSalesforceの顧客住所が異なる → どちらが正しいかわからない。④適時性（Timeliness）：最新の情報に更新されているか。例：廃止された仕入先マスタが削除されず残留 → 誤発注リスク。⑤一意性（Uniqueness）：重複レコードがないか。例：同一顧客がSAPに3つのBP番号で登録 → 売上集計・与信管理が分散する。\n先生：SAP S/4HANAへのマイグレーション（移行）プロジェクトで最も時間がかかる作業の一つが「データクレンジング」です。このクレンジング作業の質が5つのDQ次元で評価されます。データ品質が低いままS/4HANAを稼働させると、クリーンコアの意味がありません。",
          content: (
            <>
              <h2>データ品質（DQ）の5次元</h2>
              <InfoPanel
                title="データ品質を評価する5つの次元とSAPでの具体例"
                variant="reference"
                lead="S/4HANAへの移行やデータウェアハウスへの連携前に、これら5次元で品質を確認します。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>次元</th>
                      <th>定義</th>
                      <th>SAPでの具体例（問題発生時）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>完全性</strong></td>
                      <td>必須フィールドが埋まっているか</td>
                      <td>顧客マスタに与信限度額が未設定 → 自動与信チェック不動作</td>
                    </tr>
                    <tr>
                      <td><strong>正確性</strong></td>
                      <td>実世界の事実と一致しているか</td>
                      <td>材料マスタの標準原価が実調達価格と乖離 → 原価計算誤り</td>
                    </tr>
                    <tr>
                      <td><strong>一貫性</strong></td>
                      <td>複数システム間で矛盾がないか</td>
                      <td>SAPとSalesforceの顧客住所が不一致 → どちらが正本か不明</td>
                    </tr>
                    <tr>
                      <td><strong>適時性</strong></td>
                      <td>最新情報に更新されているか</td>
                      <td>廃止仕入先マスタが削除されず残留 → 誤発注リスク</td>
                    </tr>
                    <tr>
                      <td><strong>一意性</strong></td>
                      <td>重複レコードがないか</td>
                      <td>同一顧客がBP番号3つで登録 → 売上集計・与信管理が分散</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAP S/4HANAへの移行プロジェクトで最も時間がかかる作業の一つが「データクレンジング」です。このクレンジングの品質がこの5次元で評価されます。データ品質が低いままS/4HANAを稼働させると、Clean Coreの意味がありません。
              </Dialog>
              <Dialog speaker="a">
                「ゴミを入れればゴミが出る（Garbage In, Garbage Out）」ですね。分析用のSnowflakeに連携する前段階でSAP側のデータ品質が担保されていないと、Goldレイヤーのレポートも信頼できなくなる。
              </Dialog>
              <Dialog speaker="b">
                5次元のうち「一貫性」が一番やっかいそうです。SAPとSalesforceで住所が違っても、どちらも「自分が正しい」と思っているから。MDMのゴールデンレコードがないと解決できないですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "データカタログとデータリネージ",
          plainText:
            "データカタログ（Data Catalog）とデータリネージ（Data Lineage）\nデータカタログとは、企業が保有するデータ資産（テーブル・列・レポート・APIなど）のメタデータを収集・検索可能にした「データの地図帳」です。主な機能：①データ発見（Discoverability）：どこに何のデータがあるかを検索できる。②データオーナーシップ：各データ資産のオーナー・スチュワードを記録。③ビジネス用語定義（Business Glossary）：「売上」「顧客」など用語の社内定義を統一する。④データ品質スコアの可視化。代表製品：Alation・Collibra・AWS Glue Data Catalog・Microsoft Purview（旧Azure Purview）・SAP Data Intelligence。\nデータリネージ（Data Lineage）とは、あるデータ項目が「どのシステムで生まれ、どの変換を経て、現在のレポートに至ったか」を追跡する機能です。「このSnowflakeの売上金額はSAP S/4HANAのどのテーブルから来ているか？どのdbtモデルを経たか？」を視覚的に確認できる。GDPR・金融コンプライアンスにおいて「このデータはどこから来たか」を説明する際に必須。\n先生：データカタログがあると「このレポートの数字は信用できるか？」という問いに答えられます。リネージが可視化されていれば「SAP側のどのデータが変更されたか」を遡れるため、監査対応・障害調査の速度が格段に上がります。\nAちゃん：dbtのモデル定義ファイル（SQLと設定）はそれ自体がリネージ情報を内包していますね。dbtとデータカタログを連携させると自動でリネージが生成されます。",
          content: (
            <>
              <h2>データカタログとデータリネージ：データの地図と履歴書</h2>
              <InfoPanel
                title="データカタログの主要機能"
                variant="reference"
                lead="「どこに何のデータがあるか」を組織全体で共有するインフラです。"
              >
                <ul>
                  <li>
                    <strong>データ発見（Discoverability）</strong>：Google検索のようにデータ資産を検索できる。テーブル名・列名・タグで絞り込み
                  </li>
                  <li>
                    <strong>ビジネス用語集（Business Glossary）</strong>：「売上」「顧客」「粗利」などの社内定義を統一。部門間の定義齟齬を解消
                  </li>
                  <li>
                    <strong>データオーナーシップ登録</strong>：各データ資産にオーナーとスチュワードを割り当て。問い合わせ先を明確化
                  </li>
                  <li>
                    <strong>データリネージ可視化</strong>：あるレポート項目がどのシステム・変換を経て生成されたかを図示
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="info">
                代表的なデータカタログ製品：Alation・Collibra・Microsoft Purview（Azure）・AWS Glue Data Catalog・SAP Data Intelligence Catalog（BTP）。dbtと連携することでSnowflake/Databricks上のリネージを自動生成できます。
              </Callout>
              <Dialog speaker="teacher">
                データカタログがあると「このレポートの数字は信用できるか？」という問いに答えられます。リネージが可視化されていれば「SAP側のどのデータが変更されたか」を遡れるため、監査対応・障害調査の速度が格段に上がります。
              </Dialog>
              <Dialog speaker="a">
                dbtのモデル定義ファイル（SQLと設定）は、それ自体がリネージ情報を内包していますね。dbtとデータカタログを連携させると、SnowflakeのGoldレイヤーがSAPのどのテーブルに起源を持つかが自動で生成される。
              </Dialog>
              <Dialog speaker="b">
                「このレポートの売上金額、SAP側で何か変わりましたか？」という質問を手動で調査していたのが、リネージがあれば5分で答えられる。すごく実務的な価値ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "データスチュワードシップ",
          plainText:
            "データスチュワードシップ（Data Stewardship）：データガバナンスの組織設計\nデータをどの部門・担当者が管理・保護・改善する責任を持つかを定義する仕組みです。主な役割の定義：①データオーナー（Data Owner）：ビジネス部門の責任者（例：財務部長、販売部長）。そのデータ資産の「ビジネス上の責任者」。データの定義・アクセスポリシー・品質目標を決定する権限を持つ。②データスチュワード（Data Steward）：データオーナーの指示のもと、日常的なデータ品質の監視・修正・定義管理を行う担当者（例：マスターデータ管理担当）。③データカストディアン（Data Custodian）：ITシステムの管理者。物理的なデータのセキュリティ・バックアップ・アクセス制御を担う（例：SAP Basis担当、Snowflake管理者）。\nDATAオペレーティングモデルの重要性：「誰がSAPの顧客マスタを更新できるか」「Snowflakeの分析テーブルにどのチームがアクセスできるか」というアクセスコントロールポリシーも、データスチュワードシップの一部です。\n先生：データガバナンスの失敗のほとんどは「誰がデータのオーナーか明確でない」ことから起きます。組織が大きくなるほど「みんなのデータ＝誰のデータでもない」状態になりやすい。スチュワードシップの設計は技術だけでなく組織設計の問題です。",
          content: (
            <>
              <h2>データスチュワードシップ：誰がデータの責任を持つか</h2>
              <Figure
                src="image/52-data-governance-roles.webp"
                alt="データガバナンスの役割階層図。上段に「データオーナー（Data Owner）：財務部長・販売部長等のビジネス責任者」のボックス（紺色）。中段に「データスチュワード（Data Steward）：マスターデータ管理担当・DQ改善担当」のボックス（青色）。下段に「データカストディアン（Data Custodian）：SAP Basis・Snowflake管理者・DBAdmin」のボックス（水色）。3つのボックスを囲む点線で「データガバナンス委員会（Data Governance Council）」のラベル。右側に「ビジネス責任 ↕ IT実務責任」の軸。"
                caption="データガバナンスの3役割：オーナー（ビジネス責任）→スチュワード（日常管理）→カストディアン（IT管理）"
                kind="diagram"
              />
              <InfoPanel
                title="データガバナンス3役割の責任分担"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>役割</th>
                      <th>典型的な担当者</th>
                      <th>責任範囲</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>データオーナー</strong></td>
                      <td>財務部長・販売部長</td>
                      <td>データ定義の決定・アクセスポリシー承認・品質目標の設定</td>
                    </tr>
                    <tr>
                      <td><strong>データスチュワード</strong></td>
                      <td>マスターデータ管理担当</td>
                      <td>日常的なDQ監視・重複排除・定義管理・カタログへの登録</td>
                    </tr>
                    <tr>
                      <td><strong>データカストディアン</strong></td>
                      <td>SAP Basis・Snowflake管理者</td>
                      <td>物理的なセキュリティ・バックアップ・アクセス制御の実装</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                データガバナンスの失敗のほとんどは「誰がデータのオーナーか明確でない」ことから起きます。組織が大きくなるほど「みんなのデータ＝誰のデータでもない」状態になりやすい。スチュワードシップの設計は技術だけでなく組織設計の問題です。
              </Dialog>
              <Dialog speaker="a">
                コンサルタントとしてMDM導入を支援する際は、技術構成より先に「このデータのオーナーは誰か」を顧客と合意することが必要ですね。組織政治の問題が技術設計を左右することがある。
              </Dialog>
              <Dialog speaker="b">
                「データスチュワード」って仕事が実際に存在するんですね。大企業ではデータ品質担当として専任が置かれることもあると聞きます。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。特にグローバル展開している企業ではRegional Data Stewardを複数配置して、地域ごとのマスターデータ管理を委任する体制を取ることも多いです。
              </Dialog>
            </>
          ),
        },
        {
          title: "GDPR・個人情報保護とSAP",
          plainText:
            "GDPR（EU一般データ保護規則）とSAPのコンプライアンス機能\nGDPR（General Data Protection Regulation）は2018年5月に施行されたEUの個人情報保護規制です。EU市民の個人データを処理する企業すべてに適用され、違反した場合は最大2000万ユーロまたは全世界売上の4%の制裁金が課されます。SAPを使う日系グローバル企業にも適用されるケースが多いです。\nGDPRの主要原則：①目的制限（Purpose Limitation）：収集した目的以外にデータを使ってはならない。②データ最小化（Data Minimization）：必要最低限のデータのみ収集する。③消去権（Right to Erasure / Right to be Forgotten）：本人が削除を要求できる。④データポータビリティ（Portability）：自分のデータを他サービスに移せる権利。\nSAPのGDPR対応機能：①ILM（Information Lifecycle Management）：データの保存期間を定義し、期間終了後に自動アーカイブ・削除。②SIEM連携（Splunk等）：不正アクセスの検知・ログ管理。③SAP Privacy Governance：同意管理・データ主体リクエスト（削除・開示）の処理。④データレジデンシー（Data Residency）：EU市民データをEUリージョン内のサーバーにのみ保管する設定（RISE with SAPでリージョン選択可能）。\n先生：GDPRで特に注意が必要なのが「消去権」とSAPの組み合わせです。SAPの財務伝票は法的保存義務があるため削除できない場合があります。ILMを使って「個人を特定できなくする（仮名化・匿名化）」ことでGDPRと財務コンプライアンスの両立を図るのが現実的な対応です。",
          content: (
            <>
              <h2>GDPR・個人情報保護法とSAPのコンプライアンス機能</h2>
              <Callout variant="warning">
                GDPRはEU市民の個人データを扱う企業すべてに適用されます。日系グローバル企業がSAPでEU顧客の受注データを処理する場合も対象となります。違反時の制裁金は最大2000万ユーロまたは全世界年間売上の4%です。
              </Callout>
              <InfoPanel
                title="GDPRの主要原則とSAPでの実装方法"
                variant="reference"
                lead="GDPR対応はSAPの設定・プロセス設計・データガバナンス組織の3層で対処します。"
              >
                <ul>
                  <li>
                    <strong>目的制限（Purpose Limitation）</strong>：受注処理のために取得した顧客データをマーケティングに転用しない。SAPではデータ利用目的の同意情報をSAP Privacy Governanceで管理
                  </li>
                  <li>
                    <strong>消去権（Right to Erasure）</strong>：ILM（Information Lifecycle Management）でデータ保存期間を定義。保存期間終了後はアーカイブ・削除または仮名化（Pseudonymization）
                  </li>
                  <li>
                    <strong>データポータビリティ</strong>：本人のデータを構造化形式（CSV・XML）でエクスポートできる仕組みを用意
                  </li>
                  <li>
                    <strong>データレジデンシー</strong>：RISE with SAPのリージョン選択でEU市民データをEU内サーバーに限定
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                GDPRで特に注意が必要なのが「消去権」とSAPの財務データの組み合わせです。財務伝票は法的保存義務があるため削除できません。ILMを使って「個人を特定できなくする（仮名化・匿名化）」ことでGDPRと財務コンプライアンスの両立を図るのが現実的な対応です。
              </Dialog>
              <Dialog speaker="a">
                「消去してください」という要求が来ても財務記録は消せない、でも個人名や連絡先は消さなければならない、という板挟みですね。仮名化（顧客名を「Customer-XXXXX」に置換等）がそのソリューションになる。
              </Dialog>
              <Dialog speaker="b">
                日本の個人情報保護法とGDPRは似ているようで要件が微妙に違う。グローバルSAPを運用する企業はどちらにも対応する必要があって複雑ですね。
              </Dialog>
              <Dialog speaker="teacher">
                そのため大手企業ではGDPRと各国個人情報保護法の要件をマッピングした「データプライバシー要件マトリクス」を作成し、SAP設計に落とし込む作業を移行プロジェクトに含めます。コンサルタントはこの橋渡し役を担うことが多いです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話でこの補足を整理しましょう\n先生：この補足で登場したキーワードを整理します。MDM（マスターデータ管理）・ゴールデンレコード・DQ5次元・データカタログ・データリネージ・データスチュワードシップ・GDPR——これらはすべて「データを正しく管理することで、ERPと分析基盤の価値を最大化する」という目的でつながっています。\nAちゃん：改めて整理すると、「MDMが正しいデータを作り、DQがそれを計測し、カタログ・リネージがどこにあるか・どこから来たかを明示し、スチュワードシップが組織として責任を持ち、GDPRがデータの扱い方のルールを定める」という構造ですね。\nBちゃん：「使えるデータ」を作るための社内インフラが、データガバナンスなんですね。建物で言えば設備（SAP・Snowflake）を作るだけでなく、管理組合（スチュワードシップ）と管理規約（GDPR・ポリシー）が必要だということ。\n先生：まさにその通りです。データガバナンスは「仕組み」「組織」「文化」の3つが揃って初めて機能します。コンサルタントとして顧客を支援するときは、技術の話だけでなく組織とプロセスの設計も提案できることが差別化になります。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この補足のキーワードを整理します。MDM・ゴールデンレコード・DQ5次元・データカタログ・データリネージ・スチュワードシップ・GDPR——これらはすべて「データを正しく管理することで、ERPと分析基盤の価値を最大化する」という目的でつながっています。
              </Dialog>
              <Dialog speaker="a">
                改めて整理すると「MDMが正しいデータを作り → DQがそれを計測し → カタログ・リネージがどこにあるか・どこから来たかを明示し → スチュワードシップが組織として責任を持ち → GDPRがデータの扱い方のルールを定める」という構造ですね。
              </Dialog>
              <Dialog speaker="b">
                「使えるデータ」を作るための社内インフラがデータガバナンスなんですね。建物で言えば設備（SAP・Snowflake）を作るだけでなく、管理組合（スチュワードシップ）と管理規約（GDPRポリシー）が必要だということ。
              </Dialog>
              <Dialog speaker="teacher">
                まさにその通りです。データガバナンスは「仕組み」「組織」「文化」の3つが揃って初めて機能します。コンサルタントとして顧客を支援するときは、技術の話だけでなく組織とプロセスの設計も提案できることが差別化になります。
              </Dialog>
              <Dialog speaker="a">
                本編第6章のMDMとデータガバナンスの説明と合わせて読むと、「なぜSnowflake単体を入れただけでは分析が上手くいかないか」の理由がわかる気がします。ツールだけでなくガバナンスがないと、Goldレイヤーのデータも信頼できない。
              </Dialog>
              <Dialog speaker="teacher">
                良い洞察です。「データ基盤を入れたのにレポートが信用されない」という失敗プロジェクトの多くは、ガバナンスとMDMが後回しになっていたことが原因です。提案段階からデータガバナンスをスコープに入れることがコンサルタントの役割です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 MDMにおける「ゴールデンレコード」の説明として正しいのは？→ 複数システムに存在する同一エンティティ（例：顧客）の情報を名寄せ・統合した、唯一の正しいマスターレコード\nQ2 データ品質（DQ）の5次元のうち「一貫性（Consistency）」の問題の例として正しいのは？→ SAPとSalesforceで同じ顧客の住所が異なり、どちらが正しいか判断できない状態\nQ3 GDPRの「消去権（Right to Erasure）」とSAPの財務データを両立させる実用的な方法は？→ ILMを使って財務データ内の個人識別情報を仮名化（匿名化）し、財務記録の法的保存義務を果たしつつ個人情報を保護する\n今日のひとこと：データガバナンスは「仕組み」「組織」「文化」の三位一体で機能します。SAP・Snowflake・Databricksのような優れた技術基盤を最大限に活かすために、データの管理責任を明確にすることがERPコンサルタントとしての付加価値になります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="ゴールデンレコードとは、複数のシステム（SAP・Salesforce・旧ERP等）に分散して存在する同一エンティティ（顧客・仕入先等）の情報を名寄せ・突合・統合した「唯一の正しいマスターレコード」です。MDM HubがゴールデンレコードをS/4HANAのBusiness Partnerとして管理し、全システムがそれを参照することでデータの一貫性が保たれます。"
                question={<strong>MDMにおける「ゴールデンレコード（Golden Record）」の説明として最も正しいのは？</strong>}
                options={[
                  "品質スコアが最も高いデータレコードのこと",
                  "複数システムに存在する同一エンティティの情報を名寄せ・統合した、唯一の正しいマスターレコード",
                  "最も古くから存在する「原本」レコードのこと",
                ]}
              />
              <Quiz
                answer={3}
                explanation="GDPRの消去権はEU市民が自分の個人データの削除を要求できる権利ですが、財務伝票は各国の法的保存義務（日本では最大10年）があるため単純に削除できません。SAP ILM（Information Lifecycle Management）を使って財務データ内の顧客名・住所等の個人識別情報を仮名化（例：「田中太郎」→「Customer-00012345」）することで、財務記録の保存義務を守りつつGDPRの消去権にも対応できます。"
                question={<strong>GDPRの「消去権」とSAPの財務データ保存義務を両立させる実用的な方法は？</strong>}
                options={[
                  "財務伝票ごと削除する（保存義務より個人の権利が優先されるため）",
                  "EU市民の取引はSAPには記録せず別システムで管理する",
                  "SAP ILMで財務データ内の個人識別情報を仮名化し、財務記録を保存しつつ個人情報を保護する",
                ]}
              />
              <Dialog speaker="closing">
                データガバナンスは「仕組み」「組織」「文化」の三位一体で機能します。SAP・Snowflake・Databricksのような優れた技術基盤を最大限に活かすために、データの管理責任を明確にすることがERPコンサルタントとしての付加価値になります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(DataGovernanceTermsLesson);
