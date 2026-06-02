import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第3章 — メガベンダーERPの「出自」が紐解く構造的強みと課題",
  meta: "中級 · 30分",
};

export default function ErpVendorsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-history-compare", "02-erp-vendors", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第3章 — メガベンダーERPの「出自」が紐解く構造的強みと課題\nSAP・Oracle・Microsoftの3社は、全く異なる歴史と市場から生まれました。その「出自」を知ることで、なぜ各社が特定の領域で強く、別の領域で弱いのかが見えてきます。\n⏱ 30分 / 📶 中級 / 🏷 ERP比較\nこの章で学ぶこと\n・SAP S/4HANA：ドイツ製造業モデルから生まれたプロセス至上主義とSingle Source of Truthの強み\n・Oracle ERP Cloud：DBベンダーの買収戦略とHyperion統合による管理会計・EPMの覇権\n・Microsoft Dynamics 365：Office生態系とローコード（Power Platform）による圧倒的ユーザー接点\n・3社の強み・課題を整理した比較フレームワーク",
          content: (
            <>
              <hgroup>
                <h1>メガベンダーERPの「出自」が紐解く構造的強みと課題</h1>
                <p>
                  機能リストの暗記より、製品の歴史から「なぜ強いか」の根拠を語れるようになることが目標です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "ERP比較" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>SAP S/4HANA：ドイツ製造業モデルから生まれたプロセス至上主義と強みの根拠</li>
                <li>Oracle ERP Cloud：DBベンダーの買収戦略とHyperion統合による管理会計の覇権</li>
                <li>Microsoft Dynamics 365：Office生態系とPower Platformによる圧倒的ユーザー接点</li>
                <li>3社の強み・課題を整理した比較フレームワーク</li>
              </ul>
            </>
          ),
        },
        {
          title: "「出自」という視点",
          plainText:
            "出自を知ると、強みの根拠が分かる\n3社のERPはそれぞれ全く異なる出発点を持っています。SAPはドイツの製造業課題から、OracleはDBソフトウェアの販売から、MicrosoftはPC向け業務ソフトウェアから生まれました。\nこの出発点の違いが、今日の製品設計に色濃く反映されています。SAPが「業務プロセスの一気通貫」に強く、Oracleが「経営数値の深掘り分析」に強く、Microsoftが「現場ユーザーの使いやすさ」に強いのは、全て出自から説明できます。\n先生：「なぜSAPは製造業やグローバル統合会計に強いのか」と聞かれたとき、ドイツ製造業モデルから生まれた歴史を知っていれば、機能リストを持ち出さずに答えられます。\nAくん：DBベンダーのOracleがERP業界に参入したのは、DBのお客様がERPを求めていたから、という流れですね。自然な拡張戦略だ。\nBちゃん：Microsoftが「使いやすさ」に強いのは、ExcelやWordなど一般ユーザー向け製品から出発したからなんですね。",
          content: (
            <>
              <h2>出自を知ると、強みの根拠が分かる</h2>
              <Figure
                src="image/02-vendor-origins.webp"
                alt="3社の出自を示す比較図。左：SAPのロゴ（ドイツ・マンハイム、1972年設立、ドイツ製造業5社の元IBMエンジニアが創業）。中央：Oracleのロゴ（米国、1977年設立、リレーショナルDB商業化から出発、PeopleSoft・Hyperion等を買収）。右：Microsoftのロゴ（米国、1975年設立、PC OS・Office生態系から出発、CRM領域とERP買収で拡張）。各社の主要な転換点が時系列で示されている。"
                caption="3社のERPは全く異なる出発点を持ち、その「出自」が今日の強みと課題を決めている"
                kind="concept"
              />
              <Dialog speaker="teacher">
                「なぜSAPは製造業やグローバル統合会計に強いのか」と聞かれたとき、ドイツ製造業モデルから生まれた歴史を知っていれば、機能リストを持ち出さずに答えられます。
              </Dialog>
              <Dialog speaker="a">
                DBベンダーのOracleがERP業界に参入したのは、DBのお客様がERPを求めていたから、という流れですね。自然な拡張戦略です。
              </Dialog>
              <Dialog speaker="b">
                Microsoftが「使いやすさ」に強いのは、ExcelやWordなど一般ユーザー向け製品から出発したからなんですね。原点が製品の性格を作っている。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP の出自と歴史",
          plainText:
            "SAP：ドイツ製造業の課題から生まれたプロセス至上主義\n1972年、旧IBMのドイツ人エンジニア5名が設立。当初は大手化学メーカー向けに、各業務システムをリアルタイムで統合するソフトウェアを開発。「リアルタイム処理（Realtime）」がSAP社名の由来の一つです（Systeme, Anwendungen und Produkte in der Datenverarbeitung）。\nSAP R/1（1972）→ R/2（1979）→ R/3（1992）→ ERP ECC（2000年代）→ S/4HANA（2015〜）\nドイツ製造業の特性：複雑なサプライチェーン・厳格な原価管理・グローバル統合会計が最初から設計に組み込まれた。\n先生：SAPの設計思想の根本にあるのは「業務プロセスの一気通貫」です。受注から入金・出荷から請求・購買から支払いまで、全業務が単一システムで完結することへのこだわりは、ドイツ製造業の複雑なオペレーションを効率化するという原点から来ています。\nAくん：だからFit to Standard（標準に合わせる）という戦略が生まれた。製造業のベストプラクティスが標準の中に詰まっているから。",
          content: (
            <>
              <h2>SAP：ドイツ製造業の課題から生まれたプロセス至上主義</h2>
              <p>
                1972年、旧IBMのドイツ人エンジニア5名が設立。大手化学メーカーの業務統合課題を解くために生まれたSAPは、最初から「全業務の一気通貫」を設計思想の中心に置いていました。
              </p>
              <InfoPanel
                title="SAPの歴史的マイルストーン"
                variant="reference"
              >
                <ul>
                  <li><strong>1972年</strong>：SAP設立（ドイツ・マンハイム）。R/1リリース。バッチ処理時代</li>
                  <li><strong>1979年</strong>：R/2リリース。メインフレーム対応の本格的ERPへ</li>
                  <li><strong>1992年</strong>：R/3リリース。クライアント/サーバー対応。世界規模で爆発的普及</li>
                  <li><strong>2004年</strong>：mySAP ERP（後のECC）。モジュール型ERPの完成形</li>
                  <li><strong>2010年</strong>：HANA DB発表。インメモリDB革命の始まり</li>
                  <li><strong>2015年</strong>：S/4HANA発表。Universal Journal・HTAP・Fioriで全面刷新</li>
                  <li><strong>2023年〜</strong>：RISE with SAP でクラウドERP移行の標準化推進</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAPの設計思想の根本にあるのは「業務プロセスの一気通貫」です。受注から入金・購買から支払いまで、全業務が単一システムで完結することへのこだわりは、ドイツ製造業の複雑なオペレーションを効率化するという原点から来ています。
              </Dialog>
              <Dialog speaker="a">
                だからFit to Standard（標準に合わせる）という戦略が生まれたんですね。製造業のベストプラクティスが標準の中に詰まっているから、標準に合わせることが最適解になる。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP の強みと課題",
          plainText:
            "SAP S/4HANA の強みと課題\n強み①：Single Source of Truth（SSOT）の実現。全モジュールが単一のHANA DBで動く。購買から会計への仕訳がタイムラグゼロ。グローバル統合会計でSAPの右に出る製品はない。\n強み②：Fit to Standard における圧倒的な業務網羅性。製造業・金融業・公共機関など多岐にわたる業種向けテンプレートが充実。\n課題①：Clean Coreのジレンマ。コアのカスタマイズはバージョンアップを困難にする。周辺開発はSAP BTP等へ逃がす必要があり、設計判断が難しい。\n課題②：HANA維持コスト。データ肥大化に伴いインメモリに乗せるデータ量が増加し、高価なメモリの増設が必要になる。温冷データ管理が不可欠。\n課題③：移行の複雑さ。ECC→S/4HANA移行プロジェクトは大規模で長期間になることが多い。\n先生：SAPの課題は「強みの裏返し」でもあります。完全統合は強みですが、それゆえカスタマイズの自由度が制限され、運用コストも高くなります。",
          content: (
            <>
              <h2>SAP S/4HANA の強みと課題</h2>
              <InfoPanel
                title="SAP S/4HANA：強みと課題"
                variant="reference"
                lead="強みの多くは「単一HANADBでの完全統合」という設計思想から生まれています。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>強み</th>
                      <th>課題</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>全モジュールが単一HANA DBで稼働。購買→会計のタイムラグゼロ</td>
                      <td>Clean Coreのジレンマ：コアカスタマイズがバージョンアップを阻害</td>
                    </tr>
                    <tr>
                      <td>グローバル統合会計の業務網羅性は業界最高水準</td>
                      <td>HANA維持コスト：データ肥大化でメモリ増設コストが急増するリスク</td>
                    </tr>
                    <tr>
                      <td>Fit to Standardにおける製造業・公共機関テンプレートの充実</td>
                      <td>ECC→S/4HANA移行が大規模長期プロジェクトになりやすい</td>
                    </tr>
                    <tr>
                      <td>Universal Journal（ACDOCA）によるリアルタイム財務集計</td>
                      <td>ライセンスコストが高く、中小企業には過剰スペックになりやすい</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAPの課題は「強みの裏返し」でもあります。完全統合は強みですが、それゆえカスタマイズの自由度が制限され、運用コストも高くなります。
              </Dialog>
              <Dialog speaker="a">
                Clean CoreはBTP（Business Technology Platform）に周辺機能を逃がすことで実現するんですね。コアをクリーンに保つための「出口設計」が必要。
              </Dialog>
              <Dialog speaker="b">
                SAPは「豪華な本社ビル（完全統合ERP）」で、内装変更（カスタマイズ）は物件の規約で制限がある感じですね。快適だけど自由に改造はできない。
              </Dialog>
            </>
          ),
        },
        {
          title: "Oracle の出自と歴史",
          plainText:
            "Oracle：DBベンダーの買収戦略と管理会計の覇権\n1977年、ラリー・エリソンらがリレーショナルDBの商業化を目的に設立。1980〜90年代にOracleデータベースが企業の標準DBとなり、顧客の「その上で動くビジネスアプリケーション」需要が生まれた。\n2000年代以降、Oracleは大規模買収戦略に転換。PeopleSoft（HRM/財務）・Siebel（CRM）・Hyperion（EPM/管理会計）・Sun Microsystems（ハードウェア）などを買収し、フルスタックの企業向けITプロバイダーへと変貌。\nHyperion買収（2007年）は管理会計・連結決算・予実管理の分野でOracleに圧倒的な地位をもたらしました。\n先生：OracleがERP市場に参入したのは、DBのお客様がERPを求めていたからです。最強のDBを持つ会社がビジネスアプリケーションを作れば強い、という戦略は合理的でした。そして足りない機能は買収で補う、という戦略を一貫して続けています。\nAくん：Hyperionの強みは管理会計・予実シミュレーション・連結決算ですね。SAPの制度会計（制度への準拠）に対して、Oracleの管理会計（経営判断のための数字）という棲み分けが分かります。",
          content: (
            <>
              <h2>Oracle：DBベンダーの買収戦略と管理会計の覇権</h2>
              <p>
                OracleはリレーショナルDBの商業化から出発し、2000年代以降の大規模買収戦略でERPのフルスタックプロバイダーへと変貌しました。
              </p>
              <InfoPanel
                title="Oracleの主要買収と戦略的意図"
                variant="reference"
                lead="Oracleの強みは多くが「買収」によって獲得されています。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>買収企業</th>
                      <th>年</th>
                      <th>獲得した強み</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PeopleSoft</td>
                      <td>2005年</td>
                      <td>HRM（人事管理）・財務会計。ERPフルスタック化の起点</td>
                    </tr>
                    <tr>
                      <td>Siebel Systems</td>
                      <td>2006年</td>
                      <td>CRM（顧客管理）。当時CRM市場でトップ製品</td>
                    </tr>
                    <tr>
                      <td>Hyperion Solutions</td>
                      <td>2007年</td>
                      <td>EPM（経営管理・予実管理・連結決算）。現Oracle EPMの基盤</td>
                    </tr>
                    <tr>
                      <td>Sun Microsystems</td>
                      <td>2010年</td>
                      <td>ハードウェア（サーバー）。Oracle Exadataなどのインテグレーション</td>
                    </tr>
                    <tr>
                      <td>NetSuite</td>
                      <td>2016年</td>
                      <td>クラウドERP（中堅企業向け）。SaaS型ERPラインナップを拡充</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                OracleがERP市場に参入したのは、DBのお客様がERPを求めていたからです。最強のDBを持つ会社がビジネスアプリを作れば強い、という戦略は合理的でした。そして足りない機能は買収で補う、という方針を一貫して続けています。
              </Dialog>
              <Dialog speaker="a">
                Hyperionの強みは管理会計・予実シミュレーション・連結決算。SAPの制度会計（法令準拠の数字）に対して、Oracleの管理会計（経営判断のための数字）という棲み分けが見えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "Oracle の強みと課題",
          plainText:
            "Oracle ERP Cloud の強みと課題\n強み①：Oracle EPMによる管理会計・予実シミュレーションは業界最強クラス。将来予測・連結決算・予算策定・差異分析のツールとしてCFO部門に絶大な支持を持つ。\n強み②：OracleDBの技術的優位性をERPに活かした高速クエリとスケーラビリティ。\n強み③：NetSuite買収により中堅企業向けクラウドERP（SaaS）でも強固な地位を持つ。\n課題①：モジュールのサイロ化。PeopleSoft・Siebel・Hyperionをそれぞれ買収した歴史のため、裏側のDBやデータ構造がモジュールごとに異なる。マスタ統合やリアルタイム同期の設計難易度がSAPより高い傾向。\n課題②：UIの一貫性。複数の買収製品が統合された影響でUIの操作感が製品間でばらつく。\n先生：SAPが「同じ家に全室完備で引っ越してきた状態（設計が一貫）」なのに対し、Oracleは「隣のビルを買収して渡り廊下でつないだ状態（各製品の個性が残る）」に近いです。それが統合の設計難易度の違いになります。",
          content: (
            <>
              <h2>Oracle ERP Cloud の強みと課題</h2>
              <InfoPanel
                title="Oracle ERP Cloud：強みと課題"
                variant="reference"
                lead="管理会計・予実管理の深さはOracle最大の差別化ポイントです。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>強み</th>
                      <th>課題</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Oracle EPMによる予実管理・シナリオ分析が業界最強クラス</td>
                      <td>買収製品間でDBやデータ構造が分散。マスタ統合の設計難易度が高い</td>
                    </tr>
                    <tr>
                      <td>CFO部門での管理会計・連結決算の実績が厚い</td>
                      <td>UIの一貫性がモジュール間でばらつく</td>
                    </tr>
                    <tr>
                      <td>NetSuiteで中堅企業向けSaaS ERPも網羅</td>
                      <td>グローバル製造業の生産管理ではSAPに実績で劣る</td>
                    </tr>
                    <tr>
                      <td>Oracle DB技術を活かした高速クエリとスケーラビリティ</td>
                      <td>ベンダーロックインのリスク（DB・ERP・ハードウェアの全Oracle化）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAPが「同じ家に全室完備で引っ越してきた状態（設計が一貫）」なのに対し、Oracleは「隣のビルを買収して渡り廊下でつないだ状態（各製品の個性が残る）」に近いです。
              </Dialog>
              <Dialog speaker="b">
                でも渡り廊下でつないだビルでも、特定の部屋（Oracle EPM）は世界一豪華、という感じなんですね。部屋ごとの品質にばらつきがある。
              </Dialog>
              <Dialog speaker="a">
                Oracle EPMが「CFO向け最強ツール」として選ばれるケースでは、SAPのFCOとは全く異なる評価軸で選ぶということですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Microsoft Dynamics 365 の出自と強み",
          plainText:
            "Microsoft Dynamics 365：ユーザー接点の覇者とローコードの革命\nMicrosoftはPC用OSとOffice（Word・Excel・PowerPoint）で世界の企業デスクトップを制覇した後、CRMとERP市場に参入。2000年代にGreat Plains・Navision・Axaptaなどを買収してDynamicsシリーズを構築。2018年にDynamics 365として統合。\nMicrosoftの最大の差別化はOffice 365・Teams・Power Platformとの深い統合です。Excelで慣れ親しんだ操作感でERPを使える、TeamsのチャットからERPデータを参照できる、という「現場ユーザーの接点」の豊かさは他社の追随を許しません。\nPower Platform（Power BI・Power Apps・Power Automate）によるローコード開発は、ITエンジニアを必要とせず現場担当者がカスタマイズできる独自の価値です。\n先生：Microsoftの強さは「すでに全員が使っているOffice・TeamsにERPを溶け込ませた」点です。ユーザー教育コストが劇的に下がります。\nBちゃん：Excelで見慣れた操作感でERPが使えるなら、現場の人たちの抵抗感が全然違いますね。",
          content: (
            <>
              <h2>Microsoft Dynamics 365：ユーザー接点の覇者とローコードの革命</h2>
              <p>
                MicrosoftはOffice・Teams・Power Platformとの深い統合によって「現場ユーザーの接点」という他社にない価値を持ちます。
              </p>
              <Callout variant="tip">
                <strong>Microsoft Dynamics 365 の構成（主要製品）</strong>
                <ul>
                  <li><strong>D365 Finance</strong>：財務・会計管理（旧Axapta/AX）</li>
                  <li><strong>D365 Supply Chain Management</strong>：購買・在庫・製造（旧AX）</li>
                  <li><strong>D365 Sales・Customer Service</strong>：CRM。旧Siebel対抗</li>
                  <li><strong>D365 Business Central</strong>：中小企業向け統合ERP（旧Navision）</li>
                  <li><strong>Power Platform</strong>：Power BI（分析）・Power Apps（ローコード開発）・Power Automate（業務自動化）</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                Microsoftの強さは「すでに全員が使っているOffice・TeamsにERPを溶け込ませた」点です。ユーザー教育コストが劇的に下がります。
              </Dialog>
              <Dialog speaker="b">
                Excelで見慣れた操作感でERPが使えるなら、現場の人たちの抵抗感が全然違いますね。ERPの最大の障壁はUI・UXなので。
              </Dialog>
              <Dialog speaker="a">
                Power Platformのローコードは「IT部門を待たずに現場が動ける」という独自価値ですね。SAPのABAPとは対極の思想です。
              </Dialog>
            </>
          ),
        },
        {
          title: "Microsoft の強みと課題",
          plainText:
            "Microsoft Dynamics 365 の強みと課題\n強み①：Office 365・Teams・SharePointとのネイティブ統合。現場ユーザーのUXと採用率が3社中最高。\n強み②：Power Platformによるローコード開発。現場担当者がコードなしでワークフローとアプリを作れる。AIアシスタント（Copilot）との統合も先行。\n強み③：CRM・カスタマーサービス・フィールドサービスなどフロントオフィス領域の強さ。\n課題①：大規模グローバル製造業での実績。超大企業の複雑な生産管理（MRP・APO相当）や、グローバル統合会計基盤としての堅牢性ではSAP・Oracleに実績差がある。\n課題②：D365 FinanceとD365 SCMの統合が歴史的に複雑で、SAP S/4HANAのような「一枚岩の統合」を実現するまでには課題が残る。\n先生：Microsoftが圧倒的に強い顧客像は「Office・Teams を既に全社利用しており、ERP導入での現場定着を最優先とする中堅〜大企業」です。フロントオフィスとバックオフィスを統合したいCRMニーズも強い。",
          content: (
            <>
              <h2>Microsoft Dynamics 365 の強みと課題</h2>
              <InfoPanel
                title="Microsoft Dynamics 365：強みと課題"
                variant="reference"
                lead="「現場のユーザー接点」という他社が真似しにくい差別化ポイントを持ちます。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>強み</th>
                      <th>課題</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Office 365・Teams・SharePointとのネイティブ統合。UXと採用率が高い</td>
                      <td>超大規模製造業の複雑な生産管理・MRP でSAP・Oracleに実績差</td>
                    </tr>
                    <tr>
                      <td>Power Platformによるローコード開発。IT部門不要でカスタマイズ可能</td>
                      <td>D365 Finance と SCM の統合が歴史的に複雑で一枚岩ではない</td>
                    </tr>
                    <tr>
                      <td>Microsoft Copilot（AI）との先行統合。業務AIアシストが最先端</td>
                      <td>グローバル統合会計基盤としての制度対応の深さでSAP に劣る場面あり</td>
                    </tr>
                    <tr>
                      <td>CRM・フロントオフィス・フィールドサービスの強さ</td>
                      <td>ライセンスモデルが複雑で、使用するD365モジュールによりコストが変動</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                Microsoftが圧倒的に強い顧客像は「Office・Teamsを既に全社利用しており、ERP導入での現場定着を最優先とする中堅〜大企業」です。フロントオフィスとバックオフィスを統合したいCRMニーズも強い。
              </Dialog>
              <Dialog speaker="b">
                Microsoftは「現場の人が毎日使うツール（Excel・Teams）でERP操作できる」という、他社が真似できないホームグラウンドがありますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "3社比較：選択の判断軸",
          plainText:
            "3社比較：どの製品が「どんな顧客」に向くか\n3社それぞれの出自と強みを踏まえると、製品選択は「機能の有無」ではなく「顧客のビジネス特性との合致度」で判断すべきことが分かります。\nSAPが向く顧客：グローバル製造業・複雑な生産管理・Fit to Standard重視・制度会計基盤として確実性を求める企業\nOracleが向く顧客：CFO主導の管理会計改革・予実シミュレーション・連結決算強化を優先する企業。中堅企業はNetSuiteも選択肢。\nMicrosoftが向く顧客：フロントオフィス統合（CRM）・現場定着を最優先・Office/Teams既活用企業・Power Platformによるローコード展開を重視する企業\n先生：重要なのは、これらが相互排他ではないことです。SAPをSoR（バックオフィス）に、SalesforceをCRMに、SnowflakeをSoI（分析）に使う「コンポーザブル構成」も現実の最適解です。",
          content: (
            <>
              <h2>3社比較：どの製品が「どんな顧客」に向くか</h2>
              <Figure
                src="image/02-vendor-comparison.webp"
                alt="3社を3つの軸で比較したレーダーチャート（三角形の比較図）。3つの頂点：①プロセス統合（バックオフィスの一気通貫）②管理会計・予実の深さ③フロントオフィス・UX。SAP（青）は①が最高、Oracleは②が最高、Microsoftは③が最高。各社の強み領域が一目で分かる配置。"
                caption="3社のERPは「出自」が異なるため、強みの頂点も異なる。選択は顧客特性との合致度で判断する"
                kind="diagram"
              />
              <InfoPanel
                title="製品選択の判断マトリクス"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>顧客特性</th>
                      <th>推奨傾向</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>グローバル製造業・複雑な生産管理・Fit to Standard重視</td>
                      <td>SAP S/4HANA</td>
                    </tr>
                    <tr>
                      <td>CFO主導の管理会計改革・予実シミュレーション・連結決算強化</td>
                      <td>Oracle ERP Cloud + EPM</td>
                    </tr>
                    <tr>
                      <td>フロントオフィス統合・現場定着最優先・Office/Teams既活用</td>
                      <td>Microsoft Dynamics 365</td>
                    </tr>
                    <tr>
                      <td>中堅企業でクラウドERPを素早く立ち上げたい</td>
                      <td>Oracle NetSuite または D365 Business Central</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                重要なのは、これらが相互排他ではないことです。SAPをSoR（バックオフィス）に、SalesforceをCRMに、SnowflakeをSoI（分析）に使う「コンポーザブル構成」も現実の最適解です。
              </Dialog>
              <Dialog speaker="a">
                つまり「SAP vs Oracle vs Microsoft」という問いの立て方自体が間違っていて、「何を軸に選ぶか」を定めてから比較する、ということですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：3社の比較の核心は「出自が設計思想を決める」というシンプルな法則です。SAPはドイツ製造業の業務統合課題から生まれたプロセス至上主義、Oracleは強力なDB基盤に管理会計（Hyperion）を統合したCFO向け最強ツール、Microsoftは現場ユーザーのOffice・Teams接点という真似できないホームグラウンドを持ちます。\nAくん：機能の優劣ではなく、顧客のどの課題を解くかで最適解が変わる、ということが整理できました。グローバル製造業の生産管理にMicrosoftを選ぶのが必ずしも間違いではないですが、実績とリスクを考えると説明が難しい。\nBちゃん：3社それぞれ「自分の庭（出自）」で最強、という感じですね。自分の庭を外れると途端に制約が出てくる。だから顧客の「庭」がどこにあるかを先に把握することが大事なんだ。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                3社の比較の核心は「出自が設計思想を決める」というシンプルな法則です。SAPはドイツ製造業の業務統合課題から生まれたプロセス至上主義、Oracleは強力なDB基盤に管理会計（Hyperion）を統合したCFO向け最強ツール、Microsoftは現場ユーザーのOffice・Teams接点という真似できないホームグラウンドを持ちます。
              </Dialog>
              <Dialog speaker="a">
                機能の優劣ではなく、顧客のどの課題を解くかで最適解が変わる、ということが整理できました。グローバル製造業の生産管理にMicrosoftを選ぶのが必ずしも間違いではないですが、実績とリスクを考えると説明が難しい。
              </Dialog>
              <Dialog speaker="b">
                3社それぞれ「自分の庭（出自）」で最強、という感じですね。自分の庭を外れると途端に制約が出てくる。だから顧客の「庭」がどこにあるかを先に把握することが大事なんだ。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 Oracle EPMが管理会計・予実シミュレーションで業界トップクラスの強みを持つ歴史的理由として正しいのは？→ 2007年にHyperion Solutionsを買収し、EPM市場のトップ製品を統合したから\nQ2 Microsoft Dynamics 365がUXと現場定着で他社ERPより優位に立つ最大の根拠は？→ Office 365・Teams・SharePointとネイティブ統合されており、現場ユーザーが慣れ親しんだ操作環境でERPを使えるから\n今日のひとこと：製品の強みを「出自から説明できる人材」は、機能リストを暗記した人材より10倍提案力があります。歴史は現在の最強の解説書です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="2007年のHyperion Solutions買収がOracle EPMの原点です。Hyperionは当時EPM（Enterprise Performance Management）市場のトップ製品で、管理会計・連結決算・予算策定・シナリオ分析の機能を持っていました。この買収によりOracleはCFO部門に向けた管理会計・予実管理の分野で業界最強クラスの地位を獲得しました。"
                question={<strong>Oracle EPMが管理会計・予実シミュレーションで業界トップクラスの強みを持つ歴史的理由として最も正しいのは？</strong>}
                options={[
                  "Oracleが1970年代からERPとして開発してきたコア製品だから",
                  "2007年にHyperion Solutionsを買収し、EPM市場のトップ製品を統合したから",
                  "OracleのデータベースがSAPのHANAより高速だから",
                ]}
              />
              <Quiz
                answer={2}
                explanation="MicrosoftはすでにOffice 365・Teams・SharePointで企業の現場ユーザーの日常業務環境を制覇しています。Dynamics 365はこれらとネイティブ統合されているため、ユーザーが慣れ親しんだ操作感でERPを使えます。これは他社が真似できない「ホームグラウンドの優位性」です。"
                question={<strong>Microsoft Dynamics 365がUXと現場定着で他社ERPより優位に立つ最大の根拠は？</strong>}
                options={[
                  "Dynamics 365のUIが3社中最も美しいと評価されているから",
                  "Microsoftのサポート体制が最も充実しているから",
                  "Office 365・Teams・SharePointとネイティブ統合されており、現場ユーザーが慣れ親しんだ環境でERPを使えるから",
                ]}
              />
              <Dialog speaker="closing">
                製品の強みを「出自から説明できる人材」は、機能リストを暗記した人材より10倍の提案力があります。歴史は現在の最強の解説書です。次章ではモダンなハイブリッドアーキテクチャの全体設計を学びます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ErpVendorsLesson);
