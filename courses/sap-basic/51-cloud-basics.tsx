import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CharacterIntro,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "補足 — クラウドとオンプレミス：エンタープライズシステムの基礎",
  meta: "補足 · 15分",
};

export default function CloudBasicsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "51-cloud-basics", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "クラウドとオンプレミス：エンタープライズシステムの基礎\nSAPをはじめとするエンタープライズシステムを理解するには、クラウドとオンプレミスの違いを押さえることが欠かせません。この補足ではIaaS・PaaS・SaaSの3層、SAP S/4HANAのデプロイ選択肢、ハイブリッドクラウド、コスト構造（CapEx/OpEx）を学びます。\n⏱ 15分 / 📶 補足 / 🏷 クラウド基礎\nこの補足で学ぶこと\n・オンプレミスとクラウドの特徴とメリット・デメリット\n・IaaS・PaaS・SaaSの3層の違いと具体例\n・SAP S/4HANAのデプロイ選択肢（On-Premise／Private Cloud／Public Cloud）\n・ハイブリッドクラウドとは何か\n・CapEx（設備投資）とOpEx（運営費）のコスト比較",
          content: (
            <>
              <hgroup>
                <h1>クラウドとオンプレミス：エンタープライズシステムの基礎</h1>
                <p>
                  SAPシステムの導入形態を理解するため、クラウドとオンプレミスの違い、IaaS・PaaS・SaaSの3層、CapEx／OpExのコスト構造を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "補足" },
                  { icon: "🏷", text: "クラウド基礎" },
                ]}
              />
              <h3>この補足で学ぶこと</h3>
              <ul>
                <li>オンプレミスとクラウドの特徴とメリット・デメリット</li>
                <li>IaaS・PaaS・SaaSの3層の違いと具体例</li>
                <li>SAP S/4HANAのデプロイ選択肢（On-Premise／Private Cloud／Public Cloud）</li>
                <li>ハイブリッドクラウドとは何か</li>
                <li>CapEx（設備投資）とOpEx（運営費）のコスト比較</li>
              </ul>
            </>
          ),
        },
        {
          title: "登場人物の紹介",
          plainText:
            "3人の登場人物から\n先生：今回はクラウドとオンプレミスについて学びます。SAPの導入プロジェクトでは必ず出てくる話題です。\nAくん：クラウドというと「なんとなくインターネットの向こう」というイメージですが、IaaSとPaaSとSaaSの違いが曖昧です。\nBちゃん：クラウドってどこか怖いイメージが…。自社のデータがよその会社のサーバーに行くのが不安で。\n先生：その2つの疑問はどちらも本質を突いています。今日はそこをすっきり整理しましょう。",
          content: (
            <>
              <h2>3人の登場人物から</h2>
              <CharacterIntro speaker="teacher">
                今回はクラウドとオンプレミスについて学びます。SAPの導入プロジェクトでは必ず出てくる話題です。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                クラウドというと「なんとなくインターネットの向こう」というイメージですが、IaaSとPaaSとSaaSの違いが曖昧です。整理したい。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                クラウドってどこか怖いイメージが…。自社のデータがよその会社のサーバーに行くのが不安で。
              </CharacterIntro>
              <Dialog speaker="teacher">
                その2つの疑問はどちらも本質を突いています。今日はそこをすっきり整理しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "オンプレミスとは",
          plainText:
            "自社のデータセンターにサーバーを設置して運用する従来型\nオンプレミス（On-Premises）とは、自社の建物内またはデータセンターに物理的なサーバーを設置して、ITシステムを運用する形態。システムを完全に自社で管理・制御できる。\nメリット：完全な制御（セキュリティポリシー・ネットワーク設計を自由に決められる）、カスタマイズの自由度が高い、インターネット接続に依存しない。\nデメリット：サーバーの購入・設置・保守に多大な初期費用と継続的な運用コストが必要。ハードウェアの老朽化・バージョンアップも自社負担。\n先生：金融機関や官公庁など、データの外部持出しに厳しい制約がある業界ではオンプレミスが選ばれることが多い。\nBちゃん：データが「自社の金庫の中」にある安心感がありますね。費用が高くても。",
          content: (
            <>
              <h2>自社のデータセンターにサーバーを設置して運用する従来型</h2>
              <p>
                <strong>オンプレミス（On-Premises）</strong>とは、自社の建物内またはデータセンターに物理的なサーバーを設置し、ITシステムを運用する形態です。
              </p>
              <InfoPanel
                title="オンプレミスの特徴"
                variant="reference"
                lead="「所有して運用する」モデル。"
              >
                <ul>
                  <li><strong>メリット</strong>：完全な制御（セキュリティ・ネットワーク設計を自由に決められる）、カスタマイズの自由度が高い、インターネット接続に依存しない</li>
                  <li><strong>デメリット</strong>：サーバーの購入・設置・保守に多大な初期費用（CapEx）。ハードウェアの老朽化・バージョンアップも自社負担</li>
                  <li><strong>向いている業界</strong>：金融・官公庁・医療など、データの外部持出しに厳しい制約がある業界</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                データが「自社の金庫の中」にある安心感がありますね。費用が高くても選ぶ理由になる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。金融機関や官公庁など、データを外部に出すことに厳しい規制がある業界では、今でもオンプレミスが主流です。
              </Dialog>
            </>
          ),
        },
        {
          title: "クラウドとは",
          plainText:
            "ITリソースをインターネット越しに借りる形態\nクラウドとは、自社でサーバーを所有・管理する代わりに、クラウドプロバイダー（AWS・Azure・GCP・SAPなど）が持つインフラをインターネット越しに借りる形態。使った分だけ料金を払うOpEx（運営費）モデル。\nメリット：初期費用なし、必要な分だけスケールアップ・ダウンできる、最新のハードウェア・ソフトウェアをプロバイダーが保守する。\nデメリット：インターネット接続に依存する、カスタマイズの自由度が制限される場合がある、データの所在地（法的管轄）への配慮が必要。\nAくん：クラウドは「サーバーを買わず、電気やガスのように使った分だけ払う」モデルですね。\n先生：まさにその例えが一番分かりやすい。",
          content: (
            <>
              <h2>ITリソースをインターネット越しに借りる形態</h2>
              <p>
                クラウドとは、クラウドプロバイダー（AWS・Azure・GCP・SAPなど）が持つインフラをインターネット越しに借りる形態です。使った分だけ料金を払う<strong>OpEx（運営費）モデル</strong>が特徴です。
              </p>
              <Figure
                src="image/51-cloud-vs-onpremise.webp"
                alt="左：オンプレミス環境。自社ビルの地下に物理サーバーラックが並び、IT担当者が管理している。右：クラウド環境。インターネット（雲のアイコン）を経由してデータセンター（クラウドプロバイダー）のサーバーにアクセスする図。左右を「所有」「利用」でラベリング。"
                caption="オンプレミス（所有して管理）vs クラウド（利用して支払い）"
                kind="concept"
              />
              <Dialog speaker="a">
                クラウドは「サーバーを買わず、電気やガスのように使った分だけ払う」モデルですね。インフラの所有から利用への移行。
              </Dialog>
              <Dialog speaker="teacher">
                まさにその例えが一番分かりやすい。クラウドの最大のメリットは「必要なときに必要な分だけ」スケールできることです。
              </Dialog>
              <Dialog speaker="b">
                でも自社データがよその会社のサーバーにある不安は？
              </Dialog>
              <Dialog speaker="teacher">
                大手クラウドプロバイダーは物理的・論理的なセキュリティ対策に莫大な投資をしており、多くの場合、自社データセンターより安全です。ただし規制産業では別途対応が必要です。
              </Dialog>
            </>
          ),
        },
        {
          title: "IaaS（Infrastructure as a Service）",
          plainText:
            "仮想サーバー・ネットワークをクラウドで提供\nIaaS（Infrastructure as a Service）は仮想サーバー・仮想ネットワーク・ストレージなどのインフラをクラウドで提供するサービス。ユーザーはOSから上の層を自分で管理する。\n代表例：Amazon EC2（AWS）、Azure Virtual Machines（Microsoft）、Google Compute Engine（GCP）。\nAくん：IaaSはサーバーのハードウェアをクラウド側が用意して、OSやミドルウェアの管理は自分でやるモデルですね。オンプレミスに近い制御感がある。\n先生：その通りです。自分でOSのパッチ当てや設定をする必要があるため、インフラ管理の知識が求められます。",
          content: (
            <>
              <h2>仮想サーバー・ネットワークをクラウドで提供</h2>
              <p>
                <strong>IaaS（Infrastructure as a Service）</strong>は、仮想サーバー・仮想ネットワーク・ストレージなどのインフラをクラウドで提供するサービスです。
              </p>
              <Callout variant="note">
                <strong>IaaSの特徴</strong>
                <ul>
                  <li>クラウド側が担当：物理サーバー・ネットワーク・ストレージ・仮想化層</li>
                  <li>ユーザー側が担当：OS・ミドルウェア・ランタイム・アプリケーション・データ</li>
                  <li>代表例：Amazon EC2、Azure Virtual Machines、Google Compute Engine</li>
                  <li>SAP例：SAP HANA on AWSはIaaS上にSAP HANAをインストールする構成</li>
                </ul>
              </Callout>
              <Dialog speaker="a">
                IaaSはサーバーのハードウェアをクラウド側が用意して、OSやミドルウェアの管理は自分でやるモデルですね。オンプレミスに近い制御感がある。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。制御の自由度が高い分、インフラ管理の知識が求められます。OSのパッチ当てやセキュリティ設定は自社の責任です。
              </Dialog>
            </>
          ),
        },
        {
          title: "PaaS（Platform as a Service）",
          plainText:
            "アプリ開発・実行環境をクラウドで提供\nPaaS（Platform as a Service）はアプリケーションの開発・実行・管理のための環境をクラウドで提供するサービス。OSやミドルウェアの管理から解放され、アプリケーションの開発に集中できる。\n代表例：SAP BTP（Business Technology Platform）、Heroku、Google App Engine、Microsoft Azure App Service。\n先生：SAPでいうとSAP BTPがPaaSの代表例です。SAPの拡張開発（Clean Core戦略）ではBTP上にアプリを作り、S/4HANAをAPIで呼び出すアーキテクチャを採用します。\nAくん：PaaSはOSやDBの管理から解放される分、開発速度が上がりますね。インフラエンジニアがいなくてもアプリを動かせる。",
          content: (
            <>
              <h2>アプリ開発・実行環境をクラウドで提供</h2>
              <p>
                <strong>PaaS（Platform as a Service）</strong>はアプリケーションの開発・実行・管理のための環境をクラウドで提供するサービスです。OSやミドルウェアの管理から解放されます。
              </p>
              <Callout variant="note">
                <strong>PaaSの特徴</strong>
                <ul>
                  <li>クラウド側が担当：物理サーバー・OS・ミドルウェア・ランタイム</li>
                  <li>ユーザー側が担当：アプリケーションコード・データ</li>
                  <li>代表例：SAP BTP、Heroku、Google App Engine、Azure App Service</li>
                  <li>SAPの活用：Clean Core戦略においてBTP上にExtensionアプリを開発</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                SAPでいうとSAP BTPがPaaSの代表例です。Clean Core戦略ではBTP上にアプリを作り、S/4HANAをAPIで呼び出すアーキテクチャを採用します。
              </Dialog>
              <Dialog speaker="a">
                PaaSはOSやDBの管理から解放される分、開発速度が上がりますね。インフラエンジニアがいなくてもアプリを動かせる。
              </Dialog>
              <Dialog speaker="b">
                IaaSとPaaSの違いが少し分かってきました。IaaSはサーバーだけ、PaaSは開発環境まで用意してくれる、という感じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "SaaS（Software as a Service）",
          plainText:
            "完成したソフトウェアをクラウドで提供\nSaaS（Software as a Service）は完成したソフトウェアをインターネット経由でサービスとして提供する形態。インストール不要でブラウザやアプリからすぐ使える。インフラ・OS・アプリ全てクラウド側が管理する。\n代表例：Salesforce、Microsoft 365（Teams・Outlook）、Gmail、SAP S/4HANA Cloud、SAP Ariba、SAP Concur、SAP SuccessFactors。\n先生：SaaSはエンドユーザーが一番恩恵を受けるクラウドです。「使う」だけに集中できる。\nBちゃん：GmailもTeamsもSaaSだったんですね！知らないうちにSaaSを使っていました。\nAくん：SAP S/4HANA CloudもSaaSになるんですね。ERPをSaaSで使う時代ですか。",
          content: (
            <>
              <h2>完成したソフトウェアをクラウドで提供</h2>
              <p>
                <strong>SaaS（Software as a Service）</strong>は完成したソフトウェアをインターネット経由でサービスとして提供する形態です。インフラ・OS・アプリ全てクラウド側が管理します。
              </p>
              <Figure
                src="image/51-saas-paas-iaas.webp"
                alt="ビルの3フロア構造図。地下：IaaS（物理サーバー・ネットワーク）。1階：PaaS（OS・実行環境・データベース）。2階：SaaS（アプリケーション・ビジネスロジック）。各フロアに「クラウドが提供」「ユーザーが担当」の区分マーク。SAP S/4HANA Cloudが最上階に位置する。"
                caption="ビルの3フロアで理解するIaaS・PaaS・SaaSの違い"
                kind="diagram"
              />
              <Dialog speaker="b">
                GmailもTeamsもSaaSだったんですね！知らないうちにSaaSを使っていました。
              </Dialog>
              <Dialog speaker="a">
                SAP S/4HANA CloudもSaaSになるんですね。ERPをSaaSで使う時代ですか。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。SaaSはエンドユーザーが一番恩恵を受けるクラウドです。インストールもアップデートも不要で「使う」だけに集中できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP S/4HANAのデプロイ選択肢",
          plainText:
            "On-Premise・Private Cloud・Public Cloud（RISE with SAP）の3択\nSAP S/4HANAは導入先の選択肢が複数ある。①On-Premise：自社データセンターにS/4HANAをインストールして運用。最大の制御権、最大のコストと運用負担。②Private Cloud：AWS・Azure・GCP等の専用環境でS/4HANAを動かす。クラウドの柔軟性＋プライベートな分離環境。③Public Cloud（RISE with SAP）：SAPが提供するS/4HANAのパブリッククラウドサービス。Fit to Standardが前提。\n先生：RISE with SAPはSAPが移行から運用まで包括的にサポートするサービスです。クラウド移行を検討する企業にとって有力な選択肢です。\nAくん：選択肢ごとにカスタマイズの自由度と運用負担がトレードオフになっているんですね。",
          content: (
            <>
              <h2>On-Premise・Private Cloud・Public Cloud（RISE with SAP）の3択</h2>
              <MermaidDiagram
                chart={`flowchart LR
  S["SAP S/4HANA<br/>デプロイ選択肢"] --> A["① On-Premise<br/>自社DC・最大制御<br/>コスト大"]
  S --> B["② Private Cloud<br/>クラウド上の専用環境<br/>柔軟性UP・分離維持"]
  S --> C["③ Public Cloud<br/>RISE with SAP<br/>SaaS・Fit to Standard前提"]`}
              />
              <InfoPanel
                title="3つのデプロイ選択肢の比較"
                variant="reference"
                lead="カスタマイズ自由度と運用負担のトレードオフです。"
              >
                <ul>
                  <li><strong>On-Premise</strong>：最大のカスタマイズ自由度。最大の初期費用と運用負担。金融・官公庁など制約の強い業界向け。</li>
                  <li><strong>Private Cloud</strong>：クラウドの柔軟性を活かしつつ、専用の分離環境でセキュリティ・コンプライアンス要件を満たす中間形態。</li>
                  <li><strong>Public Cloud（RISE with SAP）</strong>：SAPが移行から運用まで包括サポート。Fit to Standard（標準機能準拠）が前提。最小の運用負担。</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                RISE with SAPはSAPが移行から運用まで包括的にサポートするサービスです。クラウド移行を検討する企業にとって有力な選択肢です。
              </Dialog>
              <Dialog speaker="a">
                選択肢ごとにカスタマイズの自由度と運用負担がトレードオフになっているんですね。自由にしたいほどコストがかかる。
              </Dialog>
            </>
          ),
        },
        {
          title: "ハイブリッドクラウド",
          plainText:
            "オンプレミスとクラウドを組み合わせるアーキテクチャ\nハイブリッドクラウドとは、オンプレミスのインフラとパブリッククラウド（またはプライベートクラウド）を組み合わせて使うアーキテクチャ。多くの大企業がこの形態を採用している。\n例：コアとなる会計・人事データは自社データセンター（On-Premise）に保持し、分析ワークロードや開発環境はクラウドで処理するケース。\n先生：一夜にして全てをクラウド移行するのは現実的ではありません。多くの企業はハイブリッドクラウドを経由して段階的にクラウドへ移行しています。\nBちゃん：全部一気に変えなくていいんですね。大切なものはオンプレミスに残しながら、新しいものはクラウドで試せる。\nAくん：SAPでいえばS/4HANAはOn-Premiseで動かしつつ、BTPのサービスをクラウドで使う構成が典型的なハイブリッドですね。",
          content: (
            <>
              <h2>オンプレミスとクラウドを組み合わせるアーキテクチャ</h2>
              <p>
                <strong>ハイブリッドクラウド</strong>とは、オンプレミスのインフラとクラウドを組み合わせて使うアーキテクチャです。多くの大企業がこの形態を採用しています。
              </p>
              <Callout variant="note">
                <strong>ハイブリッドクラウドの典型例</strong>
                <ul>
                  <li>コア会計・人事データ → オンプレミスで厳重管理</li>
                  <li>分析ワークロード → クラウドで柔軟に処理</li>
                  <li>開発・テスト環境 → クラウドで必要な時だけ起動</li>
                  <li>SAPの場合：S/4HANA On-Premise ＋ SAP BTP（クラウド）の組み合わせ</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                一夜にして全てをクラウド移行するのは現実的ではありません。多くの企業はハイブリッドクラウドを経由して段階的にクラウドへ移行しています。
              </Dialog>
              <Dialog speaker="b">
                全部一気に変えなくていいんですね。大切なものはオンプレミスに残しながら、新しいものはクラウドで試せる。
              </Dialog>
              <Dialog speaker="a">
                SAPでいえばS/4HANAはOn-Premiseで動かしつつ、BTPのサービスをクラウドで使う構成が典型的なハイブリッドですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "クラウドセキュリティとコンプライアンス",
          plainText:
            "金融・医療業界の規制対応とクラウド利用の両立\nクラウド利用に対して金融・医療などの規制産業は厳格な要件を持つ。データの所在地（データレジデンシー）、暗号化、アクセスログの保存期間、第三者監査（ISO27001・SOC2等）などが求められる。\n大手クラウドプロバイダー（AWS・Azure・GCP）はこれらの規制要件に対応した認定を取得しており、規制産業でもクラウド利用が可能になっている。\n先生：SAPのクラウドサービスも各種規制認定（ISO27001・SOC2・GDPR対応）を取得しています。セキュリティがクラウド選択の障壁になる時代は終わりつつあります。\nAくん：プロバイダーのセキュリティ対策は自社のデータセンターを上回ることも多い、というのが現在のコンセンサスですね。\nBちゃん：信頼できる大きな会社に任せるほうが、むしろ安心なこともあるんですね。",
          content: (
            <>
              <h2>金融・医療業界の規制対応とクラウド利用の両立</h2>
              <p>
                規制産業におけるクラウド利用では、データ所在地・暗号化・監査対応などの要件を満たす必要があります。
              </p>
              <Callout variant="warning">
                <strong>規制産業がクラウド利用で確認すべき要件例</strong>
                <ul>
                  <li><strong>データレジデンシー</strong>：データが保存される国・地域（日本の金融規制では国内保存要件がある場合）</li>
                  <li><strong>暗号化</strong>：保存中（at rest）と転送中（in transit）のデータ暗号化</li>
                  <li><strong>監査証跡</strong>：アクセスログの保存期間と第三者監査（ISO27001・SOC2）</li>
                  <li><strong>GDPR</strong>：EU域内の個人データ保護規則への対応</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                SAPのクラウドサービスも各種規制認定（ISO27001・SOC2・GDPR対応）を取得しています。セキュリティがクラウド選択の障壁になる時代は終わりつつあります。
              </Dialog>
              <Dialog speaker="a">
                大手クラウドプロバイダーのセキュリティ対策は自社のデータセンターを上回ることも多い、というのが現在のコンセンサスですね。
              </Dialog>
              <Dialog speaker="b">
                信頼できる大きな会社に任せるほうが、むしろ安心なこともあるんですね。考え方が変わりました。
              </Dialog>
            </>
          ),
        },
        {
          title: "コスト比較：CapEx vs OpEx",
          plainText:
            "資本的支出（設備投資）vs 運営費—クラウドはOpExモデル\nCapEx（Capital Expenditure・資本的支出）：設備・ハードウェアなどを一括購入する支出。減価償却で費用を分割計上。オンプレミスはCapExモデル。\nOpEx（Operational Expenditure・運営費）：継続的な利用料・サービス費として計上する支出。月額・年額の利用料として計上。クラウドはOpExモデル。\n財務上の違い：CapExは大きな初期投資が必要だが固定資産として計上できる。OpExは初期費用が少ないが継続的な費用が発生する。\n先生：クラウドへの移行検討では「初期コストを抑えて早く始められる」OpExモデルの魅力が大きい。ただし長期で見ると合計コストの比較が必要です。\nAくん：TCO（Total Cost of Ownership：総保有コスト）で比較するのが正しいアプローチですね。",
          content: (
            <>
              <h2>資本的支出（設備投資）vs 運営費—クラウドはOpExモデル</h2>
              <InfoPanel
                title="CapEx vs OpEx"
                variant="reference"
                lead="オンプレミスとクラウドのコスト構造の違いです。"
              >
                <ul>
                  <li>
                    <strong>CapEx（Capital Expenditure）</strong>：設備・ハードウェアを一括購入する資本的支出。減価償却で費用を複数年に分割計上。オンプレミスの特徴。初期投資が大きい。
                  </li>
                  <li>
                    <strong>OpEx（Operational Expenditure）</strong>：継続的な利用料・サービス費として計上する運営費。月額・年額の利用料として都度計上。クラウドの特徴。初期費用が少ない。
                  </li>
                  <li>
                    <strong>TCO（Total Cost of Ownership）</strong>：総保有コスト。初期費用＋運用費＋保守費の合計で長期比較するのが正しいアプローチ。
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                クラウドへの移行検討では「初期コストを抑えて早く始められる」OpExモデルの魅力が大きい。ただし長期で見ると合計コストの比較が必要です。
              </Dialog>
              <Dialog speaker="a">
                TCO（Total Cost of Ownership：総保有コスト）で比較するのが正しいアプローチですね。短期ではクラウドが有利でも、長期では違う場合もある。
              </Dialog>
              <Dialog speaker="b">
                初期費用ゼロで始められるのがクラウドの魅力ですね。でも月々の費用が積み重なることも忘れずに。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章のまとめです。オンプレミスは「所有して完全管理」、クラウドは「利用して費用を払う」モデルです。クラウドにはIaaS・PaaS・SaaSの3層があり、上に行くほど管理が楽になる代わりにカスタマイズ自由度が下がります。SAP S/4HANAはOn-Premise・Private Cloud・Public Cloud（RISE with SAP）の3択で、多くの大企業はハイブリッドクラウドを採用しています。\nAくん：コスト面ではCapEx（一括設備投資）からOpEx（月々の利用料）への移行がクラウドの財務的な魅力ですね。ただし長期では総保有コスト（TCO）で比較すべき。IaaSはインフラ、PaaSは開発環境、SaaSは完成アプリ—3層それぞれで担当範囲が違う点が整理できました。\nBちゃん：最初はクラウドが怖かったけど、大手プロバイダーのセキュリティは自社データセンター以上のこともあると分かって安心しました。「全部一気に移行しなくていい・ハイブリッドでいい」という選択肢があるのも心強いです。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章のまとめです。オンプレミスは「所有して完全管理」、クラウドは「利用して費用を払う」モデルです。クラウドにはIaaS・PaaS・SaaSの3層があり、上に行くほど管理が楽になる代わりにカスタマイズ自由度が下がります。SAP S/4HANAの3つのデプロイ選択肢と、大企業が採るハイブリッドクラウドの概念も覚えておいてください。
              </Dialog>
              <Dialog speaker="a">
                コスト面ではCapEx（一括設備投資）からOpEx（月々の利用料）への移行がクラウドの財務的な魅力ですね。ただし長期ではTCOで比較すべき。IaaSはインフラ、PaaSは開発環境、SaaSは完成アプリ—3層それぞれで担当範囲が違う点が整理できました。
              </Dialog>
              <Dialog speaker="b">
                最初はクラウドが怖かったけど、大手プロバイダーのセキュリティは自社データセンター以上のこともあると分かって安心しました。「全部一気に移行しなくていい・ハイブリッドでいい」という選択肢があるのも心強いです。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 PaaSとSaaSの違いは？→ PaaSは開発環境を提供、SaaSは完成したアプリケーションを提供\nQ2 RISE with SAPとは何か？→ SAPが提供するS/4HANAのパブリッククラウドサービス（包括的な移行・運用サービス）\nQ3 CapExとOpExの違いは？→ CapExは設備投資（一括購入）、OpExは運営費（月額利用料）モデル\n今日のひとこと：クラウドは「使う」モデル、オンプレミスは「所有する」モデル。SAPの導入を検討するときにはこの区別が必ず出てきます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="PaaSはOS・ミドルウェア・ランタイムなどの開発・実行環境を提供し、ユーザーはアプリケーションコードの開発に集中できます。SaaSはインフラからアプリまで全てクラウド側が管理した完成済みのソフトウェアを提供します。SAP BTPがPaaSの代表例、SAP S/4HANA CloudがSaaSの代表例です。"
                question={<strong>PaaSとSaaSの違いとして正しいものはどれですか？</strong>}
                options={[
                  "PaaSは完成したアプリを提供し、SaaSは開発環境を提供する",
                  "PaaSは開発・実行環境を提供し、SaaSは完成したアプリケーションをサービスとして提供する",
                  "PaaSとSaaSは同じ意味で、どちらも物理サーバーをクラウドで提供するサービスである",
                ]}
              />
              <Quiz
                answer={2}
                explanation="RISE with SAPはSAPが提供するS/4HANAのパブリッククラウド向けサービスパッケージです。システム移行から運用・保守・アップグレードまでSAPが包括的にサポートします。Fit to Standard（標準機能準拠）が前提となるため、大規模なカスタマイズは難しいですが、運用負担が最小化されます。"
                question={<strong>RISE with SAPの説明として正しいものはどれですか？</strong>}
                options={[
                  "SAP HANAデータベースをオンプレミスで利用するための専用ハードウェアセット",
                  "ABAPを使った従来型のアドオン開発を支援するSAPのサポートサービス",
                  "SAPが提供するS/4HANAのパブリッククラウドサービス（移行・運用を包括的にサポート）",
                ]}
              />
              <Quiz
                answer={0}
                explanation="CapEx（資本的支出）は設備・ハードウェアを一括購入する形で、減価償却で費用を複数年に分割計上します。オンプレミス導入の特徴です。OpEx（運営費）は月額・年額の利用料として継続的に計上し、初期投資が少ないクラウドの特徴です。長期的な比較にはTCO（総保有コスト）を用います。"
                question={<strong>CapExとOpExの説明として正しいものはどれですか？</strong>}
                options={[
                  "CapExは設備投資（一括購入・減価償却）、OpExは月々の利用料（運営費）モデル",
                  "CapExはクラウドの月額利用料モデル、OpExはオンプレミスの設備投資モデル",
                  "CapExもOpExも同じ意味で、どちらもクラウドの費用計算方式である",
                ]}
              />
              <Dialog speaker="closing">
                クラウドは「使う」モデル、オンプレミスは「所有する」モデル。SAPの導入を検討するときにはこの区別が必ず出てきます。IaaS・PaaS・SaaS・CapEx・OpEx—今日の言葉を自分のものにしてください。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CloudBasicsLesson);
