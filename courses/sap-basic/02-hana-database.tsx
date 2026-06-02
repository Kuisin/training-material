import {
  Lesson,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第2章 — SAPの進化とHANAデータベースの革新",
  meta: "初学者 · 20分",
};

export default function HanaDatabaseLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "02-hana-database", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第2章 — SAPの進化とHANAデータベースの革新\n第1章でERPの「なぜ」を理解しました。この章ではSAPの歴史と、SAP S/4HANAを超高速にしているHANAデータベースの技術的な革新を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 SAP基礎\nこの章で学ぶこと\n・SAPの3世代の歴史（メインフレーム → R/3 → S/4HANA）\n・インメモリコンピューティングとは何か、なぜ速いのか\n・カラム型（列指向）とロー型（行指向）データベースの違い\n・HTAPとUniversal Journalという革新的なコンセプト",
          content: (
            <>
              <hgroup>
                <h1>第2章 — SAPの進化とHANAデータベースの革新</h1>
                <p>HANAがなぜ桁違いに速いのか、技術的な核心を理解します。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>SAPの3世代の歴史（メインフレーム → R/3 → S/4HANA）</li>
                <li>インメモリコンピューティングとは何か、なぜ速いのか</li>
                <li>カラム型（列指向）とロー型（行指向）データベースの違い</li>
                <li>HTAPとUniversal Journalという革新的なコンセプト</li>
              </ul>
            </>
          ),
        },
        {
          title: "SAPの3世代の歴史",
          plainText:
            "SAPの歴史：3つの世代\n第1世代（1972〜1992）：R/1・R/2。メインフレームという大型汎用コンピュータ上で動作。高価で大企業のみが利用可能。\n第2世代（1992〜2015）：R/3（後のECC）。クライアント/サーバー型アーキテクチャ。PCの普及とともに中規模企業にも広がる。\n第3世代（2015〜現在）：S/4HANA。HANAインメモリデータベース上で動作。クラウドにも対応した完全に新しいアーキテクチャ。\n先生：SAPはこの50年間で3回の大きな世代交代をしています。S/4HANAはゼロから設計し直した全く新しいERPです。\nAくん：R/3からS/4HANAへの移行が「Brownfield移行」と呼ばれる大規模プロジェクトになる理由が分かってきました。",
          content: (
            <>
              <h2>SAPの歴史：3つの世代</h2>
              <MermaidDiagram
                chart={`timeline
  title SAPの3世代の進化
  1972 : R/1創業
       : メインフレーム時代
  1992 : R/3リリース
       : クライアント/サーバー時代
  2015 : S/4HANAリリース
       : インメモリ・クラウド時代`}
              />
              <InfoPanel title="3世代の比較" variant="reference">
                <table>
                  <thead>
                    <tr><th>世代</th><th>製品</th><th>時期</th><th>アーキテクチャ</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>第1世代</td><td>R/1, R/2</td><td>1972〜1992</td><td>メインフレーム</td></tr>
                    <tr><td>第2世代</td><td>R/3（ECC）</td><td>1992〜2015</td><td>クライアント/サーバー</td></tr>
                    <tr><td>第3世代</td><td>S/4HANA</td><td>2015〜現在</td><td>インメモリ・クラウド対応</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAPはこの50年で3回の大きな世代交代をしています。S/4HANAはゼロから設計し直した全く新しいERPです。
              </Dialog>
              <Dialog speaker="a">
                R/3からS/4HANAへの移行が大規模プロジェクトになる理由が分かってきました。アーキテクチャそのものが違うんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "従来DBのボトルネック",
          plainText:
            "なぜ従来のデータベースは遅かったのか\n従来のRDBMS（Oracle・PostgreSQL等）はデータをHDD/SSDに保存しています。データが必要なたびにディスクからRAMへ読み込む「ディスクI/O」が発生します。このディスクI/Oこそが速度のボトルネックでした。\n先生：比喩で考えましょう。あなたが図書館で調べ物をするとき、本を棚から取ってきて机に持ってくる時間がかかりますよね。それがディスクI/Oです。HANAは最初から全ての本が机の上に広げてある状態です。\nBちゃん：全部の本が机の上にある状態なら、読みたいページを瞬時に開けますね！\nAくん：RAMはHDDより数十〜数百倍速いですから、理屈として速くなるのは当然ですね。",
          content: (
            <>
              <h2>なぜ従来のデータベースは遅かったのか</h2>
              <p>
                従来のRDBMS（関係データベース管理システム、例：Oracle・PostgreSQL）はデータをHDD/SSDに保存しています。
                データが必要なたびに<strong>ディスクI/O</strong>（ストレージ読み書き）が発生し、これが速度のボトルネックでした。
              </p>
              <Callout variant="note">
                <strong>RDBMSとは（IT用語解説）</strong>：Relational Database Management System（関係データベース管理システム）。表（テーブル）でデータを管理し、SQLで操作するシステムの総称。Oracle・PostgreSQL・MySQL・SQL Serverなどが代表例。SAPも従来はOracleやMS SQL Serverの上で動いていた。
              </Callout>
              <Dialog speaker="teacher">
                比喩で考えましょう。図書館で調べ物をするとき、本を棚から取ってきて机に持ってくる時間がかかりますよね。それがディスクI/Oです。HANAは最初から全ての本が机の上に広げてある状態です。
              </Dialog>
              <Dialog speaker="b">
                全部の本が机の上にある状態なら、読みたいページを瞬時に開けますね！
              </Dialog>
              <Dialog speaker="a">
                RAMはHDDより数十〜数百倍速いですから、理屈として速くなるのは当然ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "インメモリコンピューティング",
          plainText:
            "インメモリコンピューティング：HANAの核心\nHANAはデータをすべてRAM（主記憶装置）上に保持して処理します。これをインメモリコンピューティングと呼びます。ディスクへのアクセスを最小化することで、従来DBより数桁速い処理を実現しています。\n先生：ただし「電源を切ったらデータが消える」という誤解があります。HANAは定期的にディスクへスナップショットを保存しています。永続性は保証されています。\nAくん：RAMは揮発性なので、障害時のデータ保護のためにディスクへの書き込みは定期的に行っているということですね。\nBちゃん：机の上にあるメモは後でノートに清書する、というイメージでしょうか。",
          content: (
            <>
              <h2>インメモリコンピューティング：HANAの核心</h2>
              <p>
                HANAはデータをすべて<strong>RAM（主記憶装置）上に保持</strong>して処理します。
                ディスクへのアクセスを最小化することで、従来DBより数桁速い処理を実現しています。
              </p>
              <Figure
                src="image/02-inmemory-computing.webp"
                alt="左側：従来型DB（HDD/SSDアイコン）からRAMへデータを読み込む長い矢印と亀のアイコン（遅い）。右側：HANAのRAM上で直接データを処理するロケットのアイコン（速い）。スピードの対比を示す概念図。"
                caption="インメモリ処理：ディスクI/Oを排除してRAM上で処理することで桁違いの速度を実現"
                kind="concept"
              />
              <Dialog speaker="stumble">
                「電源を切ったらデータが消える」という誤解があります。→ HANAは定期的にディスクへスナップショットを保存しているため、データの永続性は保証されています。
              </Dialog>
              <Dialog speaker="a">
                RAMは揮発性なので、障害時のデータ保護のためにディスクへの書き込みは定期的に行っているということですね。
              </Dialog>
              <Dialog speaker="b">
                机の上にあるメモは後でノートに清書する、というイメージでしょうか。机の上で作業するから速い、ノートに保存するから消えない。
              </Dialog>
            </>
          ),
        },
        {
          title: "カラム型とロー型の違い",
          plainText:
            "カラム型（列指向）とロー型（行指向）の違い\n従来のRDBMSはロー型（行指向）です。1行ごとに全列のデータをまとめて保存します。レコードの追加・更新は得意ですが、特定列の集計（全売上の合計など）には全行を読む必要があります。\nHANAのカラム型（列指向）は、同じ列のデータをまとめて保存します。売上列だけを読めば売上合計が計算できる。列単位での圧縮も効くので、ストレージ効率も大幅向上。\n先生：ロー型は「個別の取引を素早く登録・更新する」のが得意（OLTP）。カラム型は「大量データの集計・分析」が得意（OLAP）。\nAくん：HANAがカラム型を採用しているから、数億件の明細から売上合計を一瞬で出せるわけですね。",
          content: (
            <>
              <h2>カラム型（列指向）とロー型（行指向）の違い</h2>
              <p>
                データの<strong>保存方式の違い</strong>が、集計処理速度に大きな差を生みます。
              </p>
              <Figure
                src="image/02-column-vs-row.webp"
                alt="左：行指向DB（PostgreSQL等）。表が行単位で保存される様子。集計時に全行を読む必要があり、読み取り範囲が広い（薄い強調）。右：列指向DB（HANA）。表が列単位で保存される様子。売上列だけを縦に読むことで高速集計。読み取り範囲が狭い（濃い強調）。"
                caption="ロー型：行単位保存（更新に強い）／カラム型：列単位保存（集計に強い）"
                kind="diagram"
              />
              <InfoPanel title="ロー型 vs カラム型" variant="reference">
                <table>
                  <thead>
                    <tr><th>項目</th><th>ロー型（行指向）</th><th>カラム型（列指向）</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>得意な処理</td><td>レコードの挿入・更新（OLTP）</td><td>集計・分析クエリ（OLAP）</td></tr>
                    <tr><td>代表例</td><td>Oracle, PostgreSQL, MySQL</td><td>SAP HANA, Amazon Redshift</td></tr>
                    <tr><td>圧縮効率</td><td>低い</td><td>高い（同列は値が似るため）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                ロー型は「個別の取引を素早く登録・更新する（OLTP）」が得意。カラム型は「大量データの集計・分析（OLAP）」が得意です。
              </Dialog>
              <Dialog speaker="a">
                HANAがカラム型を採用しているから、数億件の明細から売上合計を一瞬で出せるわけですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "HTAPとは",
          plainText:
            "HTAP：トランザクションと分析の同時処理\nHTAP（Hybrid Transactional/Analytical Processing）は、OLTPとOLAPを1つのデータベースで同時に処理する仕組みです。\n従来のアーキテクチャでは、日次バッチでERPからDWH（データウェアハウス）にデータを転送し、BIツールで分析していました。このため分析データは常に「昨日のデータ」でした。HANAのHTAPにより、今この瞬間の取引データをリアルタイムで分析できます。\n先生：DWHとは分析専用のデータ倉庫です。以前はERPと分析システムを分離する必要がありましたが、HANAはその壁を取り除きました。\nBちゃん：取引の記録と分析が同じ場所で同時にできるなら、「昨日のデータで判断する」問題がなくなりますね。",
          content: (
            <>
              <h2>HTAP：トランザクションと分析の同時処理</h2>
              <p>
                <strong>HTAP（Hybrid Transactional/Analytical Processing）</strong>は、
                OLTPとOLAPを1つのデータベースで同時に処理する仕組みです。
              </p>
              <Callout variant="tip">
                <strong>OLTP vs OLAP（IT用語解説）</strong>
                <ul>
                  <li><strong>OLTP</strong>（Online Transaction Processing）：日々の業務取引処理。注文・支払い・在庫更新など個別レコードの追加・更新。</li>
                  <li><strong>OLAP</strong>（Online Analytical Processing）：大量データの集計・分析。売上合計・前年比・トレンド分析など。</li>
                  <li><strong>DWH</strong>（Data Warehouse）：OLAP専用の分析データ倉庫。ERPから別途データを転送して使う。</li>
                </ul>
              </Callout>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph "従来のアーキテクチャ"
    A["ERP（OLTP）"] -->|"夜間バッチ転送"| B["DWH"]
    B --> C["BIツール（分析）"]
  end
  subgraph "HANAのHTAP"
    D["SAP S/4HANA（OLTP + OLAP同時処理）"]
    D --> E["リアルタイム分析"]
  end`}
              />
              <Dialog speaker="teacher">
                DWHとは分析専用のデータ倉庫です。以前はERPと分析システムを分離する必要がありましたが、HANAはその壁を取り除きました。
              </Dialog>
              <Dialog speaker="b">
                取引の記録と分析が同じ場所で同時にできるなら、「昨日のデータで判断する」問題がなくなりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Universal Journal（ACDOCA）",
          plainText:
            "Universal Journal：データモデルの究極のシンプル化\n旧SAP（ECC）には財務関連テーブルだけで数千個ありました。FI・CO・AA・MLなど各モジュールが独自のサマリーテーブルを持ち、同じデータが複数の場所に重複保存されていました。\nS/4HANAはこれを「ACDOCA（Universal Journal）」という1つの巨大明細テーブルに統合しました。全ての財務トランザクションが1テーブルに記録されるため、財務報告も管理会計もリアルタイムで直接クエリできます。\nAくん：正規化の観点で言えば、冗長なサマリーテーブルを排除して単一ソースにしたわけですね。HANAが速いから、サマリーなしでも生データから即時集計できる。\n先生：まさに。HANAの速度があって初めて、このシンプルなデータモデルが成立するんです。",
          content: (
            <>
              <h2>Universal Journal：データモデルの究極のシンプル化</h2>
              <p>
                旧SAP（ECC）には財務関連テーブルだけで数千個ありました。
                S/4HANAはこれを<strong>ACDOCA（Universal Journal）</strong>という1つの巨大明細テーブルに統合しました。
              </p>
              <InfoPanel title="Universal Journalの革新" variant="reference">
                <table>
                  <thead>
                    <tr><th>項目</th><th>旧SAP（ECC）</th><th>S/4HANA</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>財務テーブル数</td><td>数千個（各モジュール別）</td><td>1つ（ACDOCA）</td></tr>
                    <tr><td>データ重複</td><td>あり（各テーブルでサマリー保存）</td><td>なし（単一明細テーブル）</td></tr>
                    <tr><td>財務分析速度</td><td>集計済みデータを参照</td><td>生データから即時集計</td></tr>
                    <tr><td>調整作業</td><td>テーブル間の整合性チェック必要</td><td>不要（単一ソース）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                正規化の観点で言えば、冗長なサマリーテーブルを排除して単一ソースにしたわけですね。HANAが速いから、サマリーなしでも生データから即時集計できる。
              </Dialog>
              <Dialog speaker="teacher">
                まさにその通りです。HANAの速度があって初めて、このシンプルなデータモデルが成立するんです。速度と設計思想が一体になっています。
              </Dialog>
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきやすいところ\nつまずき：「インメモリDB＝電源OFFでデータが消える」という誤解。→ HANAは定期的にディスクへスナップショットを書き込むため、データの永続性は保証されています。\nつまずき2：「カラム型だからOLTPには使えない」という誤解。→ HANAはカラム型を基本としながらも、ロー型テーブルも持てます。HTAP対応で両方の処理が可能です。\nAくん：HANAはピュアなカラム型ではなく、ハイブリッドなんですね。\n先生：そうです。実際にはトランザクションの多い一部のテーブルはロー型で保存しています。アーキテクチャは常にトレードオフを考慮しています。",
          content: (
            <>
              <h2>つまずきやすいところ</h2>
              <Dialog speaker="stumble">
                「インメモリDB＝電源OFFでデータが消える」という誤解。→ HANAは定期的にディスクへスナップショットを書き込むため、データの永続性は保証されています。障害発生時もログから復元できます。
              </Dialog>
              <Dialog speaker="stumble">
                「カラム型だからOLTPには使えない」という誤解。→ HANAはカラム型を基本としながらも、ロー型テーブルも持てます。HTAP対応で両方の処理が可能です。
              </Dialog>
              <Dialog speaker="a">
                HANAはピュアなカラム型ではなく、ハイブリッドなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。実際にはトランザクションの多い一部のテーブルはロー型で保存しています。アーキテクチャは常にトレードオフを考慮しています。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：HANAの革新は3層で理解できます。①インメモリ（RAM上処理でI/Oを排除）、②カラム型（列単位保存で集計を高速化）、③HTAP（OLTPとOLAPの統合）。この3つが組み合わさって、Universal Journalというシンプルで強力なデータモデルが実現できました。\nAくん：技術的には、高速メモリの価格低下（2010年代以降）がHANA開発の現実的な前提でした。テクノロジーのコスト曲線の変化がビジネスアーキテクチャを変えた例ですね。\nBちゃん：難しい話でしたが、要するに「全部を一番速い棚（RAM）に置いて、列ごとにまとめて整理する」ことで、計算が劇的に速くなったと理解しました。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                HANAの革新は3層で理解できます。①インメモリ（RAM上処理でI/Oを排除）、②カラム型（列単位保存で集計を高速化）、③HTAP（OLTPとOLAPの統合）。この3つが組み合わさって、Universal Journalというシンプルで強力なデータモデルが実現できました。
              </Dialog>
              <Dialog speaker="a">
                技術的には、高速メモリの価格低下（2010年代以降）がHANA開発の現実的な前提でした。テクノロジーのコスト曲線の変化がビジネスアーキテクチャを変えた例ですね。
              </Dialog>
              <Dialog speaker="b">
                難しい話でしたが、要するに「全部を一番速い棚（RAM）に置いて、列ごとにまとめて整理する」ことで、計算が劇的に速くなったと理解しました。DWHとERPを別々に管理する手間もなくなる。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 HANAがディスクDBより速い最大の理由は？→ すべてのデータをRAM（主記憶）上で処理し、ディスクI/Oのボトルネックを排除するから\nQ2 カラム型DBが集計処理に優れている理由は？→ 集計に必要な特定の列だけを読み取れるため、行指向より読み取りデータ量が少なくて済む\nQ3 HTAPが解決した課題は？→ OLTPとOLAPを別々のシステムで管理する必要がなくなり、リアルタイム分析が可能になった\n今日のひとこと：HANAの速さの秘密が分かりました。次章ではこの速さを使って何ができるか、コアモジュールとデータ連動を学びます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="HANAがディスクDBより速い最大の理由は、すべてのデータをRAM（主記憶装置）上に保持して処理するからです。ディスクI/O（ストレージの読み書き）はRAMアクセスより数十〜数百倍遅いため、I/Oを排除することで劇的な速度向上を実現しています。"
                question={<strong>HANAがディスクベースのデータベースより速い最大の理由はどれ？</strong>}
                options={[
                  "データを圧縮して保存しているから",
                  "データを複数のサーバーに分散しているから",
                  "すべてのデータをRAM（主記憶）上に保持して処理し、ディスクI/Oを排除しているから",
                ]}
              />
              <Quiz
                answer={0}
                explanation="カラム型（列指向）DBは同じ列のデータをまとめて保存するため、売上合計のような集計クエリでは売上列だけを読めばよく、行指向より読み取るデータ量が大幅に少なくなります。また同一列は値の種類が限られるため圧縮効率も高い。"
                question={<strong>カラム型（列指向）DBが集計処理に優れている理由として正しいのは？</strong>}
                options={[
                  "集計に必要な特定の列だけを読み取ればよいため、読み取りデータ量が少ない",
                  "行ごとにまとめて処理するため更新が高速",
                  "インターネット経由でデータにアクセスできるから",
                ]}
              />
              <Quiz
                answer={1}
                explanation="HTAP（Hybrid Transactional/Analytical Processing）は、従来は別々のシステム（ERP+DWH）が必要だったOLTPとOLAPを、1つのデータベースで同時に処理できるようにしました。これによりデータ転送の時間ラグがなくなり、リアルタイム分析が実現しました。"
                question={<strong>HTAPが解決した課題として最も適切なのは？</strong>}
                options={[
                  "データのバックアップが難しい問題",
                  "OLTPとOLAPを別々のシステム（ERP+DWH）で管理する必要があり、分析データが常に遅延していた問題",
                  "ユーザーインターフェースが使いにくい問題",
                ]}
              />
              <Dialog speaker="closing">
                HANAの速さの秘密が分かりました。次章ではこの速さを活かしたコアモジュールとデータ連動の仕組みを学びましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(HanaDatabaseLesson);
