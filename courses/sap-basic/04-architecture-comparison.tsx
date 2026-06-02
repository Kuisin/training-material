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
  title: "第4章 — 全体最適 vs 個別最適：SaaSとERPのアーキテクチャ比較",
  meta: "初学者 · 20分",
};

export default function ArchitectureComparisonLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "04-architecture-comparison", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第4章 — 全体最適 vs 個別最適：SaaSとERPのアーキテクチャ比較\n各業務に最高の専門SaaSを組み合わせる「Best of Breed」と、1つのERPで全業務を統合する「S/4HANA」を比較します。\n⏱ 20分 / 📶 初学者 / 🏷 SAP Basic\nこの章で学ぶこと\n・Best of Breedアプローチとは何か\n・Best of Breedのメリットと限界（API連携の落とし穴）\n・S/4HANAによるグローバルガバナンスの意味\n・どちらを選ぶかの判断基準",
          content: (
            <>
              <hgroup>
                <h1>全体最適 vs 個別最適</h1>
                <p>
                  各業務領域で最高の専門 SaaS を組み合わせる<strong>Best of Breed</strong>と、
                  1つの ERP で全業務を統合する<strong>SAP S/4HANA</strong>——
                  それぞれのアーキテクチャの強みと限界を比較します。
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
                <li>Best of Breed アプローチとは何か</li>
                <li>Best of Breed のメリットと限界（API 連携の落とし穴）</li>
                <li>S/4HANA によるグローバルガバナンスの意味</li>
                <li>ERP と Best of Breed のどちらを選ぶかの判断基準</li>
              </ul>
              <Dialog speaker="a">
                Salesforce や Workday が使いやすいなら、それを組み合わせればいいのでは？なぜわざわざ SAP を使うんでしょうか。
              </Dialog>
              <Dialog speaker="teacher">
                良い疑問です。どちらにも理由があります。今日はその選択の論理を整理しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "Best of Breedとは何か",
          plainText:
            "Best of Breedとは何か\n各業務領域で最高の専門SaaSを選んで組み合わせるアプローチ。例：Salesforce（営業管理）+ Workday（人事）+ NetSuite（会計）。\n「それぞれの分野で一番のものを使う」という考え方。\nSaaS（Software as a Service）：ソフトウェアをインターネット経由でサービスとして利用する形態。\nBちゃん：スポーツチームで各ポジションに専門の名手を起用するイメージですね。\n先生：その通りです。ただし、チームとして連携するには別途コーディネーションが必要になります。",
          content: (
            <>
              <h2>Best of Breed とは何か</h2>
              <p>
                <strong>Best of Breed（ベスト・オブ・ブリード）</strong>とは、
                各業務領域で最高の専門 SaaS を選んで組み合わせるアプローチです。
              </p>
              <ul>
                <li><strong>Salesforce</strong> … 営業管理（CRM）</li>
                <li><strong>Workday</strong> … 人事・給与管理（HCM）</li>
                <li><strong>NetSuite</strong> … 会計・財務管理</li>
              </ul>
              <InfoPanel title="用語解説" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>用語</th>
                      <th>意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>SaaS</strong></td>
                      <td>Software as a Service。ソフトウェアをインターネット経由でサービスとして利用する形態。自社サーバーへのインストール不要</td>
                    </tr>
                    <tr>
                      <td><strong>API</strong></td>
                      <td>Application Programming Interface。異なるシステム間でデータや機能をやり取りするための接続口</td>
                    </tr>
                    <tr>
                      <td><strong>レイテンシ</strong></td>
                      <td>データが送受信される際の遅延時間</td>
                    </tr>
                    <tr>
                      <td><strong>マスタデータ</strong></td>
                      <td>業務の基本情報（顧客・品目・仕入先など）であまり変わらないデータ</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                スポーツチームで各ポジションに専門の名手を起用するイメージですね。
              </Dialog>
              <Dialog speaker="teacher">
                よいたとえです。ただしチームとして連携するには、別途コーディネーションが必要になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "Best of Breedのメリット",
          plainText:
            "Best of Breedのメリット\n1. 各領域で最強の機能を利用できる（SFAなら Salesforce が最高峰）\n2. 継続的な機能改善（SaaS ベンダーが専門領域に集中して開発）\n3. 導入スピード（ERP の全社導入より短期間で立ち上がる）\n4. コスト効率（使う機能・人数だけ課金するサブスクリプションモデル）\nAくん：新機能がどんどん追加されてくるのは確かに魅力的ですね。SalesforceのAI機能は毎年進化が速い。\n先生：専門特化しているからこそ、その領域でのイノベーション速度はERPより速いことが多いです。",
          content: (
            <>
              <h2>Best of Breed のメリット</h2>
              <Figure
                src="image/04-best-of-breed.webp"
                alt="左：Best of Breedアプローチ。Salesforce・Workday・NetSuiteの3つのSaaSボックスがAPIで細い矢印でつながっている。つながりが複雑で途中に「？」マークがある。右：ERPアプローチ。1つの大きなSAP S/4HANAボックスから全モジュールが内包されている。シンプルなアーキテクチャ対比図。"
                caption="Best of Breed vs ERP アーキテクチャの対比"
                kind="diagram"
              />
              <ul>
                <li>
                  <strong>各領域で最強の機能</strong> …
                  営業管理なら Salesforce、人事なら Workday など、専門領域のトップ製品を活用できる
                </li>
                <li>
                  <strong>継続的な機能改善</strong> …
                  SaaS ベンダーが専門領域に集中して開発するため、新機能の追加が速い
                </li>
                <li>
                  <strong>導入スピード</strong> …
                  全社一括の ERP 導入より短期間で立ち上げられる
                </li>
                <li>
                  <strong>コスト効率</strong> …
                  使う機能・ユーザー数に応じたサブスクリプション課金で無駄が出にくい
                </li>
              </ul>
              <Dialog speaker="a">
                新機能がどんどん追加されてくるのは確かに魅力的ですね。Salesforce の AI 機能は毎年進化が速い。
              </Dialog>
              <Dialog speaker="teacher">
                専門特化しているからこそ、その領域でのイノベーション速度は ERP より速いことが多いです。これは Best of Breed の強みです。
              </Dialog>
            </>
          ),
        },
        {
          title: "Best of Breedの限界",
          plainText:
            "Best of Breedの限界\n1. API連携時のレイテンシ（遅延）：システム間のデータ受け渡しに時間がかかる\n2. トランザクションエラー時のロールバック困難：複数システムにまたがる処理が途中で失敗したとき、全部を元に戻すのが難しい\n3. マスタデータの不整合：顧客マスタや品目マスタが各SaaSで微妙に違う状態になりやすい\nBちゃん：「受注は成功したのに在庫が引き落とされなかった」みたいな事態が起きうるということですか？\n先生：そうです。ERPなら1つのDBなので整合性が保たれますが、別々のSaaSでは難しい。",
          content: (
            <>
              <h2>Best of Breed の限界</h2>
              <ul>
                <li>
                  <strong>API 連携時のレイテンシ（遅延）</strong> …
                  システム間でデータを受け渡す際にリアルタイム性が損なわれることがある
                </li>
                <li>
                  <strong>トランザクションエラー時のロールバック困難</strong> …
                  複数の SaaS にまたがる処理が途中で失敗した場合、すべてを整合性ある状態に戻す（ロールバック）のが技術的に困難
                </li>
                <li>
                  <strong>マスタデータの不整合</strong> …
                  顧客名・品目コードなどが SaaS ごとに微妙に異なる状態になりやすく、レポートの信頼性が低下する
                </li>
              </ul>
              <Callout variant="warning">
                複数 SaaS の連携が増えるほど、障害点も増えます。1つの API が止まっただけで業務全体に影響が波及するリスクがあります。
              </Callout>
              <Dialog speaker="b">
                「受注は成功したのに在庫が引き落とされなかった」みたいな事態が起きうるということですか？
              </Dialog>
              <Dialog speaker="teacher">
                そうです。ERP なら1つのデータベースなので整合性が保たれますが、別々の SaaS をまたぐと整合性の保証が難しくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "API連携の落とし穴",
          plainText:
            "図解：API連携の落とし穴\n複数SaaSの連携フローで失敗ポイントが複数存在する。Salesforce（受注）→ API →NetSuite（売上仕訳）→ API → Workday（コスト配賦）の流れで、どこかのAPIが落ちると連鎖的に問題が生じる。\nAくん：連携経路の数が増えるほど「どこで失敗したか」のデバッグも大変になりますね。\n先生：その通りです。ITチームのメンテナンスコストが見えないところで積み上がっていきます。",
          content: (
            <>
              <h2>API 連携の落とし穴（図解）</h2>
              <MermaidDiagram
                chart={`flowchart LR
  SF["Salesforce\\n受注"]
  NS["NetSuite\\n売上仕訳"]
  WD["Workday\\nコスト配賦"]
  DW["分析ツール\\nレポート"]
  SF -->|"API①\\n⚠ レイテンシ"| NS
  NS -->|"API②\\n⚠ ロールバック困難"| WD
  WD -->|"API③\\n⚠ マスタ不整合"| DW`}
              />
              <p>
                各 API（接続口）が<strong>失敗ポイント</strong>になり得ます。
              </p>
              <ul>
                <li><strong>API①</strong> … 受注データが NetSuite に届くまで遅延が生じることがある</li>
                <li><strong>API②</strong> … NetSuite 側でエラーが発生しても Salesforce の受注を取り消せない</li>
                <li><strong>API③</strong> … Workday の顧客コードと NetSuite の顧客コードが微妙に違うと集計がずれる</li>
              </ul>
              <Dialog speaker="a">
                連携経路の数が増えるほど「どこで失敗したか」のデバッグも大変になりますね。システム担当者の夜間対応も増えそう。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。IT チームのメンテナンスコストが見えないところで積み上がっていきます。表面上の導入コストだけでは判断できない部分です。
              </Dialog>
            </>
          ),
        },
        {
          title: "S/4HANAによるグローバルガバナンス",
          plainText:
            "S/4HANAによるグローバルガバナンス\n多国籍企業が世界の子会社に同一のマスタデータと業務プロセスを強制適用するアプローチ。\n本社が定義した顧客マスタ・品目マスタ・仕入先マスタが、米国・ドイツ・中国・インドの全拠点で同一の状態を保つ。\n先生：100ヵ国展開の多国籍企業が、全拠点の財務データをリアルタイムで連結するには、共通のデータ構造が前提になります。\nBちゃん：バラバラなシステムで同じことをやろうとすると、集計だけで何百時間もかかりそうですね。",
          content: (
            <>
              <h2>S/4HANA によるグローバルガバナンス</h2>
              <Figure
                src="image/04-global-governance.webp"
                alt="世界地図上に本社（日本）と複数の海外子会社（米国・ドイツ・中国・インド）が点として表示され、すべて中央のSAP S/4HANAに接続している。共通のマスタデータ（顧客・品目）が全拠点で統一されていることを示す図。"
                caption="S/4HANA によるグローバルガバナンス。全拠点が共通マスタで統一される"
                kind="diagram"
              />
              <ul>
                <li>
                  本社が定義した<strong>マスタデータ（顧客・品目・仕入先）</strong>が全世界の拠点で統一される
                </li>
                <li>
                  全拠点の業務プロセス（受注フロー・承認ルールなど）を<strong>標準化・強制適用</strong>できる
                </li>
                <li>
                  各国の会計データをリアルタイムで<strong>連結財務諸表</strong>に集約できる
                </li>
              </ul>
              <Callout variant="tip">
                グローバルガバナンスとは「世界中どこの子会社も同じルールで動く」状態を作ることです。ERP がその基盤を提供します。
              </Callout>
              <Dialog speaker="teacher">
                100ヵ国展開の多国籍企業が全拠点の財務データをリアルタイム連結するには、<strong>共通のデータ構造</strong>が前提になります。
              </Dialog>
              <Dialog speaker="b">
                バラバラなシステムで同じことをやろうとすると、集計だけで何百時間もかかりそうですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "マスタデータとは",
          plainText:
            "マスタデータとは\n顧客マスタ・品目マスタ・仕入先マスタの説明。グローバルで統一することの価値。\n顧客マスタ：顧客の名前・住所・支払い条件など。品目マスタ：製品の品番・単位・価格。仕入先マスタ：サプライヤの情報。\nAくん：マスタデータが各拠点でバラバラだと、「同じ顧客が国ごとに違うコードになっている」という事態が起きて、グローバル集計が不可能になりますよね。\n先生：実際によくある問題です。M&Aで会社を買収したときに「顧客データが3つのシステムで全部違う形式になっていた」というケースは珍しくありません。",
          content: (
            <>
              <h2>マスタデータとは</h2>
              <p>
                <strong>マスタデータ</strong>とは、業務の基本情報であまり変化しないデータです。
                取引のたびに変わる伝票データ（トランザクションデータ）とは区別されます。
              </p>
              <InfoPanel title="主要なマスタデータの種類" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>マスタ名</th>
                      <th>含まれる主な情報</th>
                      <th>影響するモジュール</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>顧客マスタ</strong></td>
                      <td>顧客名・住所・支払条件・与信枠</td>
                      <td>SD・FI</td>
                    </tr>
                    <tr>
                      <td><strong>品目マスタ</strong></td>
                      <td>品番・品名・単位・価格・在庫管理区分</td>
                      <td>SD・MM・PP</td>
                    </tr>
                    <tr>
                      <td><strong>仕入先マスタ</strong></td>
                      <td>仕入先名・住所・支払条件・銀行口座</td>
                      <td>MM・FI</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                マスタデータが各拠点でバラバラだと、「同じ顧客が国ごとに違うコードになっている」という事態が起きてグローバル集計が不可能になりますよね。
              </Dialog>
              <Dialog speaker="teacher">
                実際によくある問題です。M&amp;A で会社を買収したときに「顧客データが3つのシステムで全部違う形式になっていた」というケースは珍しくありません。
              </Dialog>
            </>
          ),
        },
        {
          title: "多言語・多通貨・複数法人対応",
          plainText:
            "多言語・多通貨・複数法人対応\nSAP S/4HANAが持つグローバル対応の基本機能。\n多言語：同じ画面を日本語でも英語でも独語でも表示できる（ユーザー設定で切替）\n多通貨：円・ドル・ユーロなど複数通貨で伝票を記録し、換算レートを自動管理\n複数法人（会社コード）：日本本社・米国子会社・ドイツ子会社を1つのシステムで管理しながら法人ごとの財務諸表を作成\nBちゃん：海外出張中に現地通貨で入力しても、本社では円で集計できるんですね。\n先生：そうです。為替換算も設定したレートで自動処理されます。",
          content: (
            <>
              <h2>多言語・多通貨・複数法人対応</h2>
              <p>
                SAP S/4HANA はグローバル展開を前提として設計されており、次の機能を標準で備えています。
              </p>
              <ul>
                <li>
                  <strong>多言語対応</strong> …
                  同じ画面を日本語・英語・ドイツ語など40以上の言語で表示できる。
                  ユーザーごとに表示言語を設定可能
                </li>
                <li>
                  <strong>多通貨対応</strong> …
                  円・ドル・ユーロなど複数通貨で伝票を記録し、設定した為替換算レートで自動変換
                </li>
                <li>
                  <strong>複数法人（会社コード）</strong> …
                  日本本社・米国子会社・ドイツ子会社を1つのシステムで管理しながら、
                  法人ごとに独立した財務諸表を作成できる
                </li>
              </ul>
              <Callout variant="note">
                これらは SAP が多国籍企業向けに長年最適化してきた機能です。新興 SaaS が同等の対応を揃えるには時間がかかります。
              </Callout>
              <Dialog speaker="b">
                海外拠点が現地通貨で入力しても、本社では円で集計できるんですね。手動で換算表を作る必要がない。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。為替換算は設定した換算レートで自動処理されます。月次決算の集計作業が大幅に楽になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "どちらを選ぶか",
          plainText:
            "どちらを選ぶか — Best of Breed vs ERP\nどちらが優れているかはビジネス要件次第で一概には言えない。\nBest of Breedが向く場合：スタートアップ・中小企業・単一業務の高度化・スピード重視\nERPが向く場合：大企業・グローバル展開・複数部門の統合管理・ガバナンス要件が高い\nAくん：ビジネスが拡大してグローバル展開するにつれ、ERPに移行するケースもあるということですね。\n先生：「まずBest of Breedで素早く立ち上げて、規模が拡大したらERPに統合」という進化の道筋を辿る企業も少なくありません。",
          content: (
            <>
              <h2>どちらを選ぶか — Best of Breed vs ERP</h2>
              <p>
                どちらのアーキテクチャが優れているかは、<strong>ビジネス要件次第</strong>です。
                一概に「ERP の方が良い」とは言えません。
              </p>
              <MermaidDiagram
                chart={`flowchart TB
  Q{"どのアーキテクチャを選ぶか？"}
  BOB["Best of Breed\\nが向く場合"]
  ERP["ERP（S/4HANA）\\nが向く場合"]
  B1["・スタートアップ/中小企業\\n・単一業務の高度化\\n・スピード重視\\n・グローバル展開が少ない"]
  E1["・大企業・多国籍展開\\n・複数部門の統合管理\\n・高いガバナンス要件\\n・リアルタイム連結決算"]
  Q --> BOB
  Q --> ERP
  BOB --> B1
  ERP --> E1`}
              />
              <Callout variant="note">
                「Best of Breed か ERP か」は二択ではなく、<strong>ERP をコアに置きながら特定領域だけ Best of Breed の SaaS を組み合わせる</strong>ハイブリッドアプローチも一般的です。
              </Callout>
              <Dialog speaker="a">
                ビジネスが拡大してグローバル展開するにつれ、ERP に移行するケースもあるということですね。
              </Dialog>
              <Dialog speaker="teacher">
                「まず Best of Breed で素早く立ち上げて、規模が拡大したら ERP に統合」という進化の道筋を辿る企業も少なくありません。
              </Dialog>
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきポイント：ERPが全部最高という誤解\n「ERPがあれば全部解決」「SaaSはおもちゃ」という誤解がある一方で、「SaaSで十分、ERPは不要」という逆の誤解もある。\nつまずき：「SAP は高くて重くて古い、Salesforce のほうが絶対いい」という意見を聞いたことがあります。これは正しいですか？\n先生：どちらが優れているかはユースケース次第です。Salesforceは営業管理では世界最高峰ですが、工場の生産管理や多国籍連結決算はERPの領域です。「目的が違うもの」を比較しないことが大事。\nAくん：ハンマーとメスを比較して「どちらが優れた道具か」と議論するようなものですね。",
          content: (
            <>
              <h2>つまずきポイント：「ERP が全部最高」という誤解</h2>
              <Dialog speaker="stumble">
                「SAP は高くて重くて古い。Salesforce の方が絶対いい」という意見を聞いたことがあります。これは正しいですか？
              </Dialog>
              <p>
                どちらが優れているかは<strong>ユースケース（使い道）次第</strong>です。
                異なる目的のツールを「どちらが優れているか」で比較することには意味がありません。
              </p>
              <InfoPanel title="ケースによる使い分け" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>判断軸</th>
                      <th>Best of Breed 向き</th>
                      <th>ERP 向き</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>企業規模</td><td>スタートアップ・中小</td><td>大企業・多国籍</td></tr>
                    <tr><td>グローバル展開</td><td>国内または単一地域</td><td>多国籍・多法人</td></tr>
                    <tr><td>ガバナンス要件</td><td>低〜中</td><td>高（上場・規制業種）</td></tr>
                    <tr><td>統合の深さ</td><td>API で十分な場合</td><td>リアルタイム整合性が必要</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                Salesforce は営業管理では世界最高峰ですが、工場の生産管理や多国籍連結決算は ERP の領域です。<strong>目的が違うもの</strong>を比較しないことが大事です。
              </Dialog>
              <Dialog speaker="a">
                ハンマーとメスを比較して「どちらが優れた道具か」と議論するようなものですね。目的によって答えが変わる。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章のポイントは3点。Best of Breedは個別最適で強みがある一方、API連携の複雑さとデータ整合性に課題がある。S/4HANAのグローバルガバナンスはマスタデータと業務プロセスの全世界統一を実現する。そしてどちらが優れているかはビジネス要件次第で一概には言えない。\nAくん：Best of Breedの「API連携の限界」が腹落ちしました。受注と在庫が別システムにあると、一方が失敗したときのロールバックが難しいというのは、設計の観点でも重要なポイントです。\nBちゃん：マスタデータの統一が「グローバルガバナンスの核心」だというのが分かりました。国ごとに品目コードが違ったら集計が成り立たないですし、それをSAPが標準機能で解決しているわけですね。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章のポイントは3点です。①Best of Breed は個別最適で強みがある一方、API 連携の複雑さとデータ整合性に課題がある。②S/4HANA のグローバルガバナンスはマスタデータと業務プロセスの全世界統一を実現する。③どちらが優れているかはビジネス要件次第で一概には言えない。
              </Dialog>
              <Dialog speaker="a">
                Best of Breed の「API 連携の限界」が腹落ちしました。受注と在庫が別システムにあると、一方が失敗したときのロールバックが難しい——これは設計の観点でも重要なポイントです。ERP なら1つの DB なので、原子性が保証される。
              </Dialog>
              <Dialog speaker="b">
                マスタデータの統一が「グローバルガバナンスの核心」だと分かりました。国ごとに品目コードが違ったら集計が成り立たないですし、それを SAP が標準機能で解決しているわけですね。
              </Dialog>
              <Callout variant="tip">
                ERP か Best of Breed かは二択ではありません。ERP をコアに置きつつ、特定領域は専門 SaaS を組み合わせるハイブリッドが現在のトレンドです。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 Best of Breedの主な弱点は？→ API連携の複雑さとトランザクション整合性の確保が難しいこと\nQ2 SAPのグローバルガバナンスの核心は？→ 世界の子会社で同一のマスタデータと業務プロセスを強制統一すること\nQ3 ERPとBest of Breedのどちらが常に優れているか？→ どちらが優れているかはビジネス要件次第で一概には言えない\n今日のひとこと：Best of BreedとERPは競合ではなく「目的が違う道具」。要件に合わせた選択が重要です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="Best of Breed の主な弱点は API 連携の複雑さとトランザクション整合性の確保です。複数の SaaS をまたぐ処理が途中で失敗した場合のロールバックが難しく、マスタデータの不整合も生じやすくなります。各 SaaS の API が失敗ポイントになるため、システム全体の可用性も複雑になります。"
                question={<strong>Best of Breed アプローチの主な弱点は？</strong>}
                options={[
                  "各領域で最高の機能を使えないこと",
                  "API 連携の複雑さとトランザクション整合性の確保が難しいこと",
                  "導入に数年かかること",
                ]}
              />
              <Quiz
                answer={2}
                explanation="SAP S/4HANA によるグローバルガバナンスの核心は、世界中の子会社が同一のマスタデータ（顧客・品目・仕入先）と業務プロセスを共有することです。これにより、全世界のデータをリアルタイムに連結財務諸表として集約できます。"
                question={<strong>SAP によるグローバルガバナンスの核心は？</strong>}
                options={[
                  "各国ごとに異なるシステムを導入すること",
                  "本社のみで全データを手動管理すること",
                  "世界の子会社で同一のマスタデータと業務プロセスを強制統一すること",
                ]}
              />
              <Quiz
                answer={1}
                explanation="ERP と Best of Breed のどちらが優れているかはビジネス要件次第です。スタートアップや単一業務の高度化には Best of Breed が向き、大企業のグローバル展開や高いガバナンス要件には ERP が向きます。ERP をコアに置きながら一部 SaaS を組み合わせるハイブリッドも一般的です。"
                question={<strong>ERP と Best of Breed のどちらが常に優れているか？</strong>}
                options={[
                  "ERP は常に Best of Breed より優れている",
                  "どちらが優れているかはビジネス要件次第で一概には言えない",
                  "Best of Breed は常に ERP より優れている",
                ]}
              />
              <Dialog speaker="closing">
                Best of Breed と ERP は競合ではなく「目的が違う道具」です。要件に合わせた選択ができることが、システム設計の基礎力になります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ArchitectureComparisonLesson);
