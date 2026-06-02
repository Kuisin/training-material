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
  title: "第7章 — SAP FioriとEmbedded Analyticsの世界",
  meta: "初学者 · 15分",
};

export default function FioriAnalyticsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "07-fiori-analytics", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "SAP FioriとEmbedded Analyticsの世界\n従来の複雑なSAP GUIから、ロールベースの直感的なWebインターフェース（SAP Fiori）へ。さらに、別途BIツールなしでERP上でリアルタイム分析ができるEmbedded Analyticsまでを学びます。\n⏱ 15分 / 📶 初学者 / 🏷 SAP S/4HANA基礎\nこの章で学ぶこと\n・従来のSAP GUIが抱えていたUIの課題\n・SAP Fioriの3つの柱（シンプル・一貫性・役割ベース）\n・Fioriアプリの3種類（Transactional／Analytical／Factsheet）\n・Embedded AnalyticsによるリアルタイムERP内分析の仕組み\n・CDS View（Core Data Services）という技術基盤の概要",
          content: (
            <>
              <hgroup>
                <h1>SAP FioriとEmbedded Analyticsの世界</h1>
                <p>
                  従来の複雑なSAP GUIから、ロールベースの直感的なWebインターフェースへ。さらにERP上でリアルタイム分析ができる仕組みまでを学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP S/4HANA基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>従来のSAP GUIが抱えていたUIの課題</li>
                <li>SAP Fioriの3つの柱（シンプル・一貫性・役割ベース）</li>
                <li>Fioriアプリの3種類（Transactional／Analytical／Factsheet）</li>
                <li>Embedded AnalyticsによるリアルタイムERP内分析の仕組み</li>
                <li>CDS View（Core Data Services）という技術基盤の概要</li>
              </ul>
            </>
          ),
        },
        {
          title: "登場人物の紹介",
          plainText:
            "3人の登場人物から\nこのレッスンには先生・Aくん・Bちゃんの3人が登場します。\n先生：今回はSAPのUI進化とリアルタイム分析について学びます。現場での実務イメージをつかんでもらうのがゴールです。\nAくん：技術的な仕組みが気になります。なぜリアルタイムになるのか、背景を知りたいです。\nBちゃん：SAPの画面が難しそうで…。Fioriになったらどう変わるのか、イメージが欲しいです。\n先生：技術派にも直感派にも答えられる章にします。両方の視点で見ていきましょう。",
          content: (
            <>
              <h2>3人の登場人物から</h2>
              <p>このレッスンには先生・Aくん・Bちゃんの3人が登場します。</p>
              <CharacterIntro speaker="teacher">
                今回はSAPのUI進化とリアルタイム分析について学びます。現場での実務イメージをつかんでもらうのがゴールです。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                技術的な仕組みが気になります。なぜリアルタイムになるのか、背景を知りたいです。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                SAPの画面が難しそうで…。Fioriになったらどう変わるのか、イメージが欲しいです。
              </CharacterIntro>
              <Dialog speaker="teacher">
                技術派にも直感派にも答えられる章にします。両方の視点で見ていきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "従来SAP GUIの課題",
          plainText:
            "SAP GUIの複雑な画面—初心者に厳しい世界\n従来のSAPは取引コード（SE16・FB03など）を暗記しないと何もできない画面設計だった。フォントは小さく、タブは多く、操作体系もWebやスマートフォンとは大きく異なる。\n先生：現場のベテランは使いこなしますが、新入社員にはハードルが高い。画面を見るだけで「自分には無理」と感じてしまうことも多い。\nBちゃん：確かに取引コードって何？って感じですよね。FB03とか覚えるんですか？\n先生：覚えないと何の画面を開けばいいかすら分かりません。それがSAP GUIの設計思想でした。\nAくん：効率性最優先で、UIの学習コストは度外視されていたわけですね。\nつまずき：SAPの画面は「知っている人には速い」が「知らない人には入口がない」設計。",
          content: (
            <>
              <h2>SAP GUIの複雑な画面—初心者に厳しい世界</h2>
              <p>
                従来のSAPは<strong>取引コード</strong>（SE16・FB03など）を暗記しないと何もできない画面設計でした。フォントは小さく、タブは多く、操作体系もWebやスマートフォンとは大きく異なります。
              </p>
              <Dialog speaker="b">
                確かに取引コードって何？って感じですよね。FB03とか覚えるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                覚えないと何の画面を開けばいいかすら分かりません。それがSAP GUIの設計思想でした。業務をとにかく速く回すことが優先され、UIの分かりやすさは後回しだったんです。
              </Dialog>
              <Dialog speaker="a">
                効率性最優先で、UIの学習コストは度外視されていたわけですね。熟練者向けの設計だった。
              </Dialog>
              <Callout variant="warning">
                SAP GUIの課題まとめ：①取引コードの暗記が必須 ②画面が小さいフォントと多数のタブで複雑 ③スマートフォン・タブレット非対応 ④役割（ロール）に関係なく全機能が見える
              </Callout>
            </>
          ),
        },
        {
          title: "SAP Fioriとは",
          plainText:
            "ユーザーのロールに基づいた、直感的なWebインターフェース\nSAP Fioriは2013年にSAPが発表した新UIデザイン。ユーザーの役割（ロール）に基づいて必要な機能だけを表示し、タイル型のカードで構成された直感的な画面を提供する。PC・スマートフォン・タブレットに対応したレスポンシブデザイン。\n先生：Fioriの核心は「その人が使う機能だけを見せる」こと。購買担当が画面を開いたら購買関連のアプリだけが並ぶ。営業担当なら営業関連のアプリだけ。\nBちゃん：それは分かりやすい！自分に関係ないボタンが山積みになっていない画面ですね。\n先生：まさに。スマートフォンのホーム画面に似た感覚です。",
          content: (
            <>
              <h2>ユーザーのロールに基づいた、直感的なWebインターフェース</h2>
              <p>
                SAP Fioriは2013年にSAPが発表した新UIデザインです。ユーザーの<strong>役割（ロール）</strong>に基づいて必要な機能だけを表示し、タイル型のカードで構成された直感的な画面を提供します。PC・スマートフォン・タブレットに対応したレスポンシブデザインが特徴です。
              </p>
              <Figure
                src="image/07-fiori-ui.webp"
                alt="左：従来のSAP GUI画面（複雑な入力フォーム・小さいフォント・多数のタブ）。右：SAP Fioriの現代的なダッシュボード（タイル型のカード、グラフ、スマートフォン画面にも対応）。UIの世代交代を示す対比図。"
                caption="SAP GUI（旧世代）とSAP Fiori（新世代）のUI比較"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                Fioriの核心は「その人が使う機能だけを見せる」ことです。購買担当が画面を開いたら購買関連のアプリだけが並ぶ。営業担当なら営業関連のアプリだけ。
              </Dialog>
              <Dialog speaker="b">
                それは分かりやすい！自分に関係ないボタンが山積みになっていない画面ですね。スマートフォンのアプリ一覧みたい。
              </Dialog>
            </>
          ),
        },
        {
          title: "Fioriの3つの柱",
          plainText:
            "シンプル・一貫性・役割ベース — Fioriデザイン原則\nSAP Fioriのデザイン哲学は3つの原則で支えられている。①シンプル（Simple）：1画面で1つの主要タスクに集中 ②一貫性（Coherent）：どのアプリも同じデザイン言語と操作感 ③役割ベース（Role-based）：ユーザーのロールに合った機能だけを表示\nAくん：ロールベースというのは、SAPのユーザー権限管理と連動しているんですね。\n先生：その通り。ユーザーに割り当てられたロールが、Fioriランチパッドに表示されるアプリを決定します。",
          content: (
            <>
              <h2>シンプル・一貫性・役割ベース — Fioriデザイン原則</h2>
              <MermaidDiagram
                chart={`flowchart TD
  F["SAP Fiori<br/>デザイン原則"] --> S["① シンプル<br/>1画面=1タスク"]
  F --> C["② 一貫性<br/>同じデザイン言語・操作感"]
  F --> R["③ 役割ベース<br/>ロールに合った機能だけ表示"]
  R --> L["Fioriランチパッド<br/>（個人専用ホーム画面）"]`}
              />
              <Dialog speaker="a">
                ロールベースというのは、SAPのユーザー権限管理と連動しているんですね。権限があるアプリだけが表示される。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。ユーザーに割り当てられたロールが、Fioriランチパッドに表示されるアプリを決定します。だから「自分には関係ないボタン」が視界に入らないんです。
              </Dialog>
              <InfoPanel
                title="Fioriの3つの柱"
                variant="reference"
                lead="SAP Fioriのデザイン哲学を支える3原則。"
              >
                <ul>
                  <li><strong>シンプル（Simple）</strong>：1画面に1つの主要タスク。情報過多を避け、迷わない設計</li>
                  <li><strong>一貫性（Coherent）</strong>：すべてのFioriアプリが同じデザイン言語と操作感を共有</li>
                  <li><strong>役割ベース（Role-based）</strong>：ユーザーのロールに合った機能だけをFioriランチパッドに表示</li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "Fioriアプリの3種類",
          plainText:
            "Transactional・Analytical・Factsheet — 3種類のFioriアプリ\nFioriアプリは目的別に3種類に分かれる。①Transactionalアプリ：受注入力・在庫移動など業務処理を行うアプリ ②Analyticalアプリ：KPIタイル・グラフ・ダッシュボードなどデータ分析に特化したアプリ ③Factsheetアプリ：顧客マスタや品目の詳細情報を照会するアプリ\n先生：Transactionalが「する」、Analyticalが「見る（分析）」、Factsheetが「調べる」、と覚えると分かりやすい。\nBちゃん：仕事で使う場面が全部カバーされているんですね。\nAくん：Analyticalアプリがまさに今回のEmbedded Analyticsにつながるわけですね。",
          content: (
            <>
              <h2>Transactional・Analytical・Factsheet — 3種類のFioriアプリ</h2>
              <p>
                Fioriアプリは目的別に3種類に分かれています。
              </p>
              <InfoPanel
                title="Fioriアプリの種類"
                variant="reference"
                lead="目的別に3種類のFioriアプリが存在します。"
              >
                <ul>
                  <li>
                    <strong>Transactionalアプリ</strong>（業務処理）：受注入力・在庫移動・承認など、実際の業務トランザクションを実行するアプリ
                  </li>
                  <li>
                    <strong>Analyticalアプリ</strong>（分析）：KPIタイル・グラフ・ダッシュボードなど、データをリアルタイムに分析・可視化するアプリ
                  </li>
                  <li>
                    <strong>Factsheetアプリ</strong>（情報照会）：顧客マスタ・品目マスタ・仕入先などの詳細情報を確認するアプリ
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                Transactionalが「する」、Analyticalが「見る（分析）」、Factsheetが「調べる」と覚えると分かりやすいです。
              </Dialog>
              <Dialog speaker="a">
                Analyticalアプリがまさに今回のEmbedded Analyticsにつながるわけですね。
              </Dialog>
              <Dialog speaker="b">
                仕事で使う場面が全部カバーされているんですね。処理・分析・確認の3パターン。
              </Dialog>
            </>
          ),
        },
        {
          title: "Embedded Analyticsとは",
          plainText:
            "別途BIツール不要でERP上でリアルタイム分析\nEmbedded Analytics（組み込み分析）とは、SAP S/4HANAのシステム内にデータ分析機能を埋め込んだ仕組み。別途BIツール（Tableau・Power BIなど）やDWH（データウェアハウス）を用意しなくても、ERP画面の上でリアルタイムにデータを分析・可視化できる。HANAのインメモリ・カラム型処理が高速性を支えている。\n先生：従来は「ERPでデータを作る人」と「BIツールでデータを見る人」が別のシステムを使っていた。Embedded Analyticsはその境界をなくします。\nAくん：ERPと分析ツールが一体化しているから、タイムラグがゼロになるんですね。\n用語：BIツール（Business Intelligence）：データを分析・可視化するソフトウェア（例：Tableau、Power BI）\n用語：DWH（Data Warehouse）：分析用に最適化されたデータの倉庫。ERPとは別に構築するのが従来の方法",
          content: (
            <>
              <h2>別途BIツール不要でERP上でリアルタイム分析</h2>
              <p>
                <strong>Embedded Analytics（組み込み分析）</strong>とは、SAP S/4HANAのシステム内にデータ分析機能を埋め込んだ仕組みです。別途BIツールやDWHを用意しなくても、ERP画面の上でリアルタイムにデータを分析・可視化できます。
              </p>
              <Callout variant="tip">
                <strong>用語解説</strong>
                <ul>
                  <li><strong>BIツール（Business Intelligence）</strong>：データを分析・可視化するソフトウェア（例：Tableau、Power BI）</li>
                  <li><strong>DWH（Data Warehouse）</strong>：分析用に最適化されたデータの倉庫。ERPとは別に構築するのが従来の方法</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                従来は「ERPでデータを作る人」と「BIツールでデータを見る人」が別のシステムを使っていました。Embedded Analyticsはその境界をなくします。
              </Dialog>
              <Dialog speaker="a">
                ERPと分析ツールが一体化しているから、タイムラグがゼロになるんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "従来分析フローとの違い",
          plainText:
            "以前と今の分析フローの対比\n従来の分析フロー：ERP → データ抽出バッチ（夜間等） → DWH → BIツール → レポート。各ステップに時間がかかり、今日の朝の数字を見るには前日夜のバッチ処理を待つ必要があった。\nEmbedded Analyticsの現在：S/4HANA（ERP）上でHANAが直接リアルタイム分析 → Fiori画面に即時表示。抽出・転送の待ち時間ゼロ。\nAくん：バッチ処理（夜間一括処理）が不要になるんですね。これはHANAのインメモリ処理が速いからこそ可能。\n先生：HANAのカラム型処理が数億件のデータでも集計を瞬時に行えるため、分析に専用の別システムが要らなくなりました。\nBちゃん：昨日の売上を今日の朝一でリアルタイムに見られる、ということですね。",
          content: (
            <>
              <h2>以前と今の分析フローの対比</h2>
              <Figure
                src="image/07-embedded-analytics.webp"
                alt="左側：従来の分析フロー（ERP → データ抽出バッチ → DWH → BIツール → レポート）、各ステップに時計アイコン（時間ラグ）。右側：Embedded Analytics（ERP内のHANA上でリアルタイム分析、直接グラフを表示）、稲妻アイコン（即時）。速度の対比図。"
                caption="従来の分析フロー（多段階・時間ラグあり）vsEmbedded Analytics（ERP内リアルタイム）"
                kind="diagram"
              />
              <Dialog speaker="a">
                バッチ処理（夜間一括処理）が不要になるんですね。HANAのインメモリ処理が速いからこそ可能。
              </Dialog>
              <Dialog speaker="teacher">
                HANAのカラム型処理が数億件のデータでも集計を瞬時に行えるため、分析専用の別システムが要らなくなりました。
              </Dialog>
              <Dialog speaker="b">
                昨日の売上を今日の朝一でリアルタイムに見られる、ということですね。意思決定が早くなりそう！
              </Dialog>
            </>
          ),
        },
        {
          title: "経営ダッシュボードの例",
          plainText:
            "売上・利益率・在庫回転率をリアルタイムで一画面に\nFioriのAnalyticalアプリとEmbedded Analyticsを組み合わせると、経営者向けのリアルタイムダッシュボードが実現する。売上実績・利益率・在庫回転率・支払条件などを一画面に集約し、地域・製品・担当者などのドリルダウン分析も可能。\n先生：経営者は朝出社した瞬間に「今の全社の利益はいくら？」を画面を開けば確認できます。\nBちゃん：月次決算を待たなくていい！それは確かに経営判断が速くなりますね。\nAくん：しかも同じERPデータを使っているから、経理が入力した数字がそのまま経営ダッシュボードに反映される、二重入力ゼロ。\n先生：まさに。これがSingle Source of Truth（単一の真実の情報源）の威力です。",
          content: (
            <>
              <h2>売上・利益率・在庫回転率をリアルタイムで一画面に</h2>
              <p>
                FioriのAnalyticalアプリとEmbedded Analyticsを組み合わせると、<strong>経営者向けのリアルタイムダッシュボード</strong>が実現します。
              </p>
              <Callout variant="note">
                <strong>経営ダッシュボードで見られるKPI例</strong>
                <ul>
                  <li>売上実績（日次・週次・月次）</li>
                  <li>利益率・粗利額</li>
                  <li>在庫回転率・滞留在庫</li>
                  <li>未収債権（売掛金残高）</li>
                  <li>地域別・製品別・担当者別のドリルダウン分析</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                経営者は朝出社した瞬間に「今の全社の利益はいくら？」を画面を開けば確認できます。月次決算を待つ必要がありません。
              </Dialog>
              <Dialog speaker="b">
                月次決算を待たなくていい！それは確かに経営判断が速くなりますね。
              </Dialog>
              <Dialog speaker="a">
                しかも同じERPデータを使っているから、経理が入力した数字がそのまま経営ダッシュボードに反映される。二重入力ゼロですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "CDS View（Core Data Services）",
          plainText:
            "Embedded Analyticsの技術基盤—データ定義と分析ロジックをDB層で実装\nCDS View（Core Data Services）はSAP S/4HANAのデータモデリング技術。分析に必要なデータの結合・集計・フィルタリングをアプリケーション層ではなくデータベース層（HANA上）で定義する。これによりERP内での高速な分析が可能になる。\nAくん：アプリ層で加工する代わりに、DB層で最初からレポート用の形に整えておくわけですね。\n先生：その通り。CDS ViewはFioriアプリが直接読みに行けるVIEW（仮想表）を定義します。Embedded Analyticsのデータの出元はほぼ全てCDS Viewです。\nBちゃん：難しそうですが、「Embedded Analyticsを陰で支える技術がCDS View」と覚えておけばいいですね。\n用語：CDS View：SAP S/4HANAのデータモデリング技術。DB層で分析ロジックを定義する仮想ビュー。",
          content: (
            <>
              <h2>Embedded Analyticsの技術基盤—データ定義と分析ロジックをDB層で実装</h2>
              <p>
                <strong>CDS View（Core Data Services）</strong>はSAP S/4HANAのデータモデリング技術です。分析に必要なデータの結合・集計・フィルタリングをアプリケーション層ではなくデータベース層（HANA上）で定義します。
              </p>
              <Callout variant="tip">
                <strong>用語：CDS View（Core Data Services）</strong><br />
                SAP S/4HANAのデータモデリング技術。DB層で分析ロジックを定義する仮想ビュー。FioriアプリのAnalytical機能のデータソースとして機能し、Embedded Analyticsの基盤を担う。
              </Callout>
              <Dialog speaker="a">
                アプリ層で加工する代わりに、DB層で最初からレポート用の形に整えておくわけですね。計算をHANA側に任せることで速くなる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。CDS ViewはFioriアプリが直接読みに行けるVIEW（仮想表）を定義します。Embedded Analyticsのデータの出元はほぼ全てCDS Viewです。
              </Dialog>
              <Dialog speaker="b">
                難しそうですが、「Embedded Analyticsを陰で支える技術がCDS View」と覚えておけばいいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章のまとめです。SAP FioriはSAP GUIの複雑さを解消し、ユーザーのロールに合った直感的なWebインターフェースを提供します。3つの柱はシンプル・一貫性・役割ベース。アプリの種類はTransactional（業務処理）・Analytical（分析）・Factsheet（情報照会）の3つです。\nAくん：Embedded Analyticsは従来の「ERP→DWH→BIツール」という多段階フローを一本化した仕組みですね。HANAのインメモリ・カラム型処理が高速性を支え、CDS Viewがデータのソースを定義している。アーキテクチャとして理にかなっています。\nBちゃん：私には「Fioriはスマートフォンのホーム画面みたいで分かりやすい画面設計」「Embedded Analyticsで経営者がリアルタイムで利益を確認できる」この2点が刺さりました。技術の話より「何が便利になるか」のほうが実感しやすい。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章のまとめです。SAP FioriはSAP GUIの複雑さを解消し、ユーザーのロールに合った直感的なWebインターフェースを提供します。3つの柱はシンプル・一貫性・役割ベース。アプリの種類はTransactional・Analytical・Factsheetの3つです。
              </Dialog>
              <Dialog speaker="a">
                Embedded Analyticsは従来の「ERP→DWH→BIツール」という多段階フローを一本化した仕組みですね。HANAのインメモリ・カラム型処理が高速性を支え、CDS Viewがデータのソースを定義している。アーキテクチャとして理にかなっています。
              </Dialog>
              <Dialog speaker="b">
                私には「Fioriはスマートフォンのホーム画面みたいで分かりやすい」「Embedded Analyticsで経営者がリアルタイムで利益を確認できる」この2点が刺さりました。技術の話より「何が便利になるか」のほうが実感しやすいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SAP Fioriの特徴は？→ ユーザーのロール（役割）に基づいた直感的なWebインターフェースで、PC・スマートフォンに対応している\nQ2 Embedded Analyticsが従来の分析と違う点は？→ DWHやBIツールなしでERP上でリアルタイム分析ができる点\nQ3 Embedded Analyticsの速度を支える技術は？→ HANAのインメモリ・カラム型処理\n今日のひとこと：Fioriで「使いやすくなった画面」、Embedded Analyticsで「その場でリアルタイム分析」。SAPは画面とデータ分析の両面で進化しています。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="SAP Fioriはロールベース（役割ベース）の直感的なWebインターフェースです。ユーザーに割り当てられたロールに応じて必要なアプリのみが表示され、PC・スマートフォン・タブレットに対応したレスポンシブデザインを採用しています。取引コードを暗記する必要はありません。"
                question={<strong>SAP Fioriの特徴として正しいのはどれ？</strong>}
                options={[
                  "取引コードを覚えると使いやすくなる旧来型のデスクトップアプリ",
                  "ユーザーのロール（役割）に基づいた直感的なWebインターフェース（PC・スマートフォン対応）",
                  "データウェアハウスとセットで使う専用レポートツール",
                ]}
              />
              <Quiz
                answer={2}
                explanation="従来の分析はERP→データ抽出→DWH→BIツール→レポートと多段階のフローが必要で、夜間バッチ処理などの時間ラグが発生していました。Embedded AnalyticsはS/4HANA内でHANAが直接集計するため、DWHやBIツールなしでリアルタイム分析が可能です。"
                question={<strong>Embedded Analyticsが従来の分析フローと異なる最大のポイントは？</strong>}
                options={[
                  "夜間バッチ処理でデータを一括集計してレポートを生成する点",
                  "外部のBIツール（Tableau・Power BIなど）と組み合わせることが必須な点",
                  "DWHやBIツールなしでERP上でリアルタイム分析ができる点",
                ]}
              />
              <Quiz
                answer={0}
                explanation="HANAのインメモリ（データをRAMに保持）・カラム型（列ごとに集計を最適化）の処理技術が、数億件のデータでも瞬時に集計を実行できる速度を実現しています。これがEmbedded Analyticsのリアルタイム性の根拠です。CDS Viewはデータソースの定義技術ですが、速度の核心はHANA自体にあります。"
                question={<strong>Embedded Analyticsのリアルタイム処理速度を支える技術的な根拠は？</strong>}
                options={[
                  "HANAのインメモリ・カラム型処理",
                  "外部DWHへの高速な夜間データ転送",
                  "FioriのタイルUIによる画面表示の最適化",
                ]}
              />
              <Dialog speaker="closing">
                Fioriで「使いやすくなった画面」、Embedded Analyticsで「その場でリアルタイム分析」。SAPは画面とデータ分析の両面で進化しています。次章へ進む準備はできましたか？
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FioriAnalyticsLesson);
