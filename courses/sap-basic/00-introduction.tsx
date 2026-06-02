import {
  Lesson,
  Callout,
  Dialog,
  CharacterIntro,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "はじめに — ERPとSAP S/4HANAを学ぶ旅のはじまり",
  meta: "初学者 · 10分",
};

export default function IntroductionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "00-introduction", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "はじめに — ERPとSAP S/4HANAを学ぶ旅のはじまり\nこのコースでは、世界中の大企業が使うERPの全体像と、その最先端製品「SAP S/4HANA」の仕組みをゼロから学びます。\n⏱ 10分 / 📶 初学者 / 🏷 SAP基礎\nこの章で学ぶこと\n・ERPとは何か、なぜ企業に必要なのかの基本イメージ\n・SAPという会社とS/4HANAという製品の位置づけ\n・このコース全7章のロードマップ",
          content: (
            <>
              <hgroup>
                <h1>はじめに — ERPとSAP S/4HANAを学ぶ旅のはじまり</h1>
                <p>世界中の大企業が使うERPの全体像と、最先端製品「SAP S/4HANA」の仕組みをゼロから学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "10分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>ERPとは何か、なぜ企業に必要なのかの基本イメージ</li>
                <li>SAPという会社とS/4HANAという製品の位置づけ</li>
                <li>このコース全7章のロードマップ</li>
              </ul>
            </>
          ),
        },
        {
          title: "登場人物",
          plainText:
            "このコースの登場人物\n先生・Aくん・Bちゃんの3人がERPの世界を一緒に旅します。\n先生：ERPとSAPを長年扱ってきた講師。業務とシステムの両面から丁寧に解説します。\nAくん：理系の新入社員。仕組みや理屈を深く理解したいタイプです。\nBちゃん：IT経験の少ない文系社員。例え話があると素早く理解できます。",
          content: (
            <>
              <h2>このコースの登場人物</h2>
              <p>3人がERPとSAP S/4HANAの世界を一緒に旅します。あなたに近い視点の言葉を特に拾ってください。</p>
              <CharacterIntro speaker="teacher">
                ERPとSAPを長年の現場で扱ってきた講師です。業務の視点とシステムの視点を行き来しながら、丁寧に解説していきます。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                IT系の大学を出た新入社員です。仕組みや理屈を深掘りして、「なぜそうなるのか」を理解したいタイプです。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                経営学部出身でITはあまり得意ではありません。でも例え話があれば素早く理解できます。一緒に頑張りましょう！
              </CharacterIntro>
              <Dialog speaker="teacher">
                完璧に覚えようとしなくて大丈夫です。まずは「こういう世界があるんだ」という全体像を持つことがゴールです。
              </Dialog>
            </>
          ),
        },
        {
          title: "ERPとは何か",
          plainText:
            "ERP（Enterprise Resource Planning）とは何か\nERPは企業のヒト・モノ・カネ・情報を1つのデータベースで統合管理するシステムです。各部門がバラバラに持っていたデータを「1か所」に集め、全社でリアルタイムに共有できるようにします。\n先生：ERPのEはEnterprise（企業）、RはResource（資源：ヒト・モノ・カネ）、PはPlanning（計画・管理）。つまり「企業の資源を統合的に計画・管理するシステム」です。\nAくん：単なる会計ソフトではなく、営業・製造・購買・人事まで全部つながっているんですね。\nBちゃん：バラバラだった部署の帳簿を、1冊の大きな帳簿にまとめたイメージでしょうか？\n先生：まさにその通りです。そしてその帳簿は全員がリアルタイムで見られる。",
          content: (
            <>
              <h2>ERP（Enterprise Resource Planning）とは何か</h2>
              <p>
                ERPは企業の<strong>ヒト・モノ・カネ・情報</strong>を1つのデータベースで統合管理するシステムです。
                各部門がバラバラに持っていたデータを「1か所」に集め、全社でリアルタイムに共有できるようにします。
              </p>
              <Figure
                src="image/00-erp-overview.webp"
                alt="企業の各部門（営業・工場・経理・人事）がそれぞれ独立したサイロ状のデータベースを持つ左側の図から、中央の1つのERP DBに全部門が接続された右側の図へ変化する対比。左：孤立したサイロ群。右：中心のERPコアから各部門へ双方向矢印。"
                caption="ERPで全部門のデータが1つのデータベースに統合される"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                ERPのEはEnterprise（企業）、RはResource（ヒト・モノ・カネ）、PはPlanning（管理・計画）。企業の資源を統合的に管理するシステムです。
              </Dialog>
              <Dialog speaker="a">
                単なる会計ソフトではなく、営業・製造・購買・人事まで全部つながっているんですね。
              </Dialog>
              <Dialog speaker="b">
                バラバラだった部署の帳簿を、1冊の大きな帳簿にまとめたイメージでしょうか？
              </Dialog>
              <Dialog speaker="teacher">
                まさにその通りです。そしてその帳簿を全員がリアルタイムで見られる—それがERPの価値です。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAPとは何か",
          plainText:
            "SAPとは何か\nSAPはドイツ生まれのソフトウェア企業で、世界最大のERPベンダーです。1972年創業、現在はFortune500企業の80%以上がSAP製品を使用しています。コア製品は「SAP S/4HANA」。製造・流通・金融・小売・公共など幅広い業種に対応したERPパッケージです。\n先生：SAPはソフトウェア会社の名前であり、製品名でもあります。現在のフラッグシップ製品がSAP S/4HANA（エスフォーハナ）です。\nAくん：S/4HANAの「HANA」は独自開発のデータベースエンジンの名前ですね。\n先生：その通り。HANAについては第2章で詳しく扱います。まずは「世界で最も使われているERPがSAP」と覚えてください。",
          content: (
            <>
              <h2>SAPとは何か</h2>
              <p>
                SAPはドイツ生まれのソフトウェア企業で、<strong>世界最大のERPベンダー</strong>です。
                1972年創業。Fortune500企業の80%以上がSAP製品を使用しています。
              </p>
              <Figure
                src="image/00-sap-world.webp"
                alt="世界地図の上にSAPのロゴが浮かび、Fortune500の80%以上のラベルが表示されている。製造・金融・小売・医療・公共のアイコンが地図上に散りばめられ、SAPがグローバルな基盤であることを示す概念図。"
                caption="SAPはFortune500の80%以上が採用する世界最大のERPベンダー"
                kind="concept"
              />
              <Callout variant="tip">
                <strong>SAPの製品ラインナップ（名前だけ確認）</strong>
                <ul>
                  <li><strong>SAP S/4HANA</strong> — 現行フラッグシップERP（このコースの主役）</li>
                  <li><strong>SAP BTP</strong> — クラウド拡張プラットフォーム（第6章）</li>
                  <li><strong>SAP Fiori</strong> — 次世代UIフレームワーク（第7章）</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                SAPはソフトウェア会社の名前であり、製品ブランド名でもあります。現在のフラッグシップが「SAP S/4HANA」です。
              </Dialog>
              <Dialog speaker="a">
                S/4HANAの「HANA」は独自開発のデータベースエンジンの名前でもありますよね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。HANAが速さの秘密です。第2章で詳しく扱います。今は「世界で最も使われているERPがSAP」と覚えておいてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：ERP統合のフロー",
          plainText:
            "ERPの中でデータはどう流れるか\n一本の受注をきっかけに、営業・製造・購買・経理のデータが自動的に連鎖する様子をフローで確認します。\nflowchart：顧客から受注 → 営業：受注登録 → 製造：生産指示 → 購買：原材料発注 → 経理：自動仕訳 → 管理職：リアルタイム損益確認\nBちゃん：1つの注文が入るだけで、こんなにいろんな部門に自動で伝わるんですね。\n先生：これが「統合」の力です。以前は各部門が電話やメールで連絡していた動きが、すべて自動になります。",
          content: (
            <>
              <h2>ERPの中でデータはどう流れるか</h2>
              <p>一本の受注をきっかけに、複数部門のデータが自動的に連鎖する様子を確認します。</p>
              <MermaidDiagram
                chart={`flowchart LR
  A["顧客から受注"] --> B["営業：受注登録"]
  B --> C["製造：生産指示"]
  B --> D["購買：原材料発注"]
  C --> E["経理：自動仕訳"]
  D --> E
  E --> F["管理職：リアルタイム損益"]`}
              />
              <Dialog speaker="b">
                1つの注文が入るだけで、こんなにいろんな部門に自動で伝わるんですね。
              </Dialog>
              <Dialog speaker="teacher">
                これが「統合」の力です。以前は各部門が電話・メールで連絡していた動きが、すべて自動になります。そして会計データもリアルタイムで更新されます。
              </Dialog>
              <Dialog speaker="a">
                人手による転記ミスもなくなるし、情報の遅延もなくなる。二重のメリットですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "コースのロードマップ",
          plainText:
            "このコースで学ぶ7つのテーマ\n第1章：なぜERPが必要か（データのサイロ化と統合の価値）\n第2章：HANAデータベースの革新（インメモリ・カラム型・HTAP）\n第3章：コアモジュールとデータ連動（SD・MM・PP・FI・CO）\n第4章：SaaSとERPのアーキテクチャ比較（Best of Breed vs 全体最適）\n第5章：ERP導入・移行プロジェクトの実態（Fit to Standard・Green/Brownfield・ETL）\n第6章：クリーンコア戦略と次世代拡張開発（SAP BTP）\n第7章：SAP FioriとEmbedded Analytics\n先生：どの章も「前の章の知識があると深く理解できる」設計になっています。",
          content: (
            <>
              <h2>このコースで学ぶ7つのテーマ</h2>
              <InfoPanel title="コース全体マップ" variant="reference">
                <ol>
                  <li><strong>第1章</strong>：なぜERPが必要か — データのサイロ化と統合の価値</li>
                  <li><strong>第2章</strong>：SAPの進化とHANAデータベースの革新</li>
                  <li><strong>第3章</strong>：コアモジュールとデータ連動の仕組み</li>
                  <li><strong>第4章</strong>：全体最適 vs 個別最適：SaaSとのアーキテクチャ比較</li>
                  <li><strong>第5章</strong>：ERP導入・移行プロジェクトの実態</li>
                  <li><strong>第6章</strong>：クリーンコア戦略と次世代拡張開発</li>
                  <li><strong>第7章</strong>：SAP FioriとEmbedded Analyticsの世界</li>
                </ol>
              </InfoPanel>
              <Dialog speaker="teacher">
                どの章も「前の章の知識があると深く理解できる」設計になっています。順番に進むのが一番の近道です。
              </Dialog>
              <Dialog speaker="b">
                第1章でERPの必要性を理解して、第2章でその技術的な強みを知る、という流れですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。「なぜ」から始めて「どうやって」へ進む。まず問題を感じてから、解決策の技術を学ぶ順番です。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：このコースのゴールは「ERPとSAP S/4HANAを、同僚や上司に説明できるレベルで理解する」こと。技術者でなくてもビジネスの文脈でERPを語れる言語を持つことが大切です。\nAくん：ERPは「企業の全データを1つのDBで統合管理する仕組み」。SAPはその世界最大のベンダー。S/4HANAが現行の主力製品。この3つを軸に知識を積み上げていけばいい。\nBちゃん：バラバラな帳簿を1冊にまとめて、全員がリアルタイムで見られるようにする、そのための仕組みがERP。SAP S/4HANAはその最高峰のシステム。こう理解しました。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                このコースのゴールは「ERPとSAP S/4HANAを、同僚や上司に説明できるレベルで理解する」ことです。技術者でなくてもビジネスの文脈でERPを語れる言語を持つことが大切です。
              </Dialog>
              <Dialog speaker="a">
                ERPは「企業の全データを1つのDBで統合管理する仕組み」。SAPはその世界最大のベンダー。S/4HANAが現行の主力製品。この3つを軸に知識を積み上げていけばいいですね。
              </Dialog>
              <Dialog speaker="b">
                バラバラな帳簿を1冊にまとめて、全員がリアルタイムで見られるようにする—そのための仕組みがERP。SAP S/4HANAはその最高峰のシステム。こう理解しました。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 ERPとは何の略か？→ Enterprise Resource Planning（企業の資源を統合的に管理・計画するシステム）\nQ2 SAP S/4HANAにおける「HANA」とは？→ SAPが独自開発した高速インメモリデータベースエンジンの名前\n今日のひとこと：ERPとSAPの全体像はつかめました。この地図を持って、第1章から深掘りしていきましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="ERPはEnterprise Resource Planningの略です。企業のヒト・モノ・カネ・情報を1つのシステムで統合管理する仕組みを指します。単なる会計ソフトではなく、営業・製造・購買・人事など全部門を横断するシステムです。"
                question={<strong>ERP（Enterprise Resource Planning）の正しい説明はどれ？</strong>}
                options={[
                  "経理部門専用の会計管理ソフトウェア",
                  "メールと文書管理に特化したオフィスツール",
                  "企業のヒト・モノ・カネ・情報を1つのシステムで統合管理する仕組み",
                ]}
              />
              <Quiz
                answer={1}
                explanation="SAP S/4HANAの「HANA」はSAPが独自開発した高速インメモリデータベースエンジンです。従来のディスクベースのデータベースと異なり、データをRAM上で処理することで圧倒的な速度を実現します。第2章で詳しく学びます。"
                question={<strong>「SAP S/4HANA」における「HANA」とは何を指すか？</strong>}
                options={[
                  "SAPの創業者の名前",
                  "SAPが独自開発した高速インメモリデータベースエンジン",
                  "ドイツ語でシステムを意味する言葉",
                ]}
              />
              <Dialog speaker="closing">
                ERPとSAPの全体像はつかめました。この地図を持って、第1章から深掘りしていきましょう。最初の一歩が一番大事です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
