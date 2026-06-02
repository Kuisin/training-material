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
  title: "第3章 — コアモジュールとデータ連動の仕組み",
  meta: "初学者 · 25分",
};

export default function CoreModulesLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "03-core-modules", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第3章 — コアモジュールとデータ連動の仕組み\nSAP S/4HANA はモジュールの集合体。業務領域ごとに役割が分かれ、すべてが1つのデータベースで連動します。\n⏱ 25分 / 📶 初学者 / 🏷 SAP Basic\nこの章で学ぶこと\n・SAPのモジュール全体像（SD・MM・PP・FI・CO）\n・各モジュールの主な業務範囲\n・自動仕訳：モノの動きがカネの動きを自動生成するメカニズム\n・統合システムならではのデータ連鎖の価値",
          content: (
            <>
              <hgroup>
                <h1>コアモジュールとデータ連動の仕組み</h1>
                <p>
                  SAP S/4HANA は業務領域ごとのモジュールが一体化した統合システムです。
                  この章では主要5モジュールの役割と、<strong>「モノの動きがカネの動きを自動生成する」</strong>
                  統合の核心を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP Basic" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>SAP のモジュール全体像（SD・MM・PP・FI・CO）</li>
                <li>各モジュールの主な業務範囲</li>
                <li>自動仕訳のメカニズム（モノの動き → カネの動き）</li>
                <li>統合システムならではのデータ連鎖の価値</li>
              </ul>
              <Dialog speaker="b">
                FI、CO、SD… 略語がたくさんあって、どれが何の担当か頭に入りません。
              </Dialog>
              <Dialog speaker="teacher">
                全部を一度に覚えなくて大丈夫です。今日は「どの業務領域の話か」を地図として眺めることがゴールです。
              </Dialog>
            </>
          ),
        },
        {
          title: "モジュール構成の全体像",
          plainText:
            "モジュール構成の全体像\nSAPは業務領域ごとのモジュールの集合体。すべてが中央のS/4HANAコアDBで連動している。\nSD=受注〜請求 / MM=購買〜在庫 / PP=生産計画〜製造 / FI=財務諸表 / CO=原価管理\n先生：どのモジュールも独立した島ではなく、同じデータベースの上で動いています。それがERPの本質です。\nAくん：モジュールが分かれているのは「担当業務の違い」であって、データは一本につながっているんですね。",
          content: (
            <>
              <h2>モジュール構成の全体像</h2>
              <p>
                SAP S/4HANA は業務領域ごとの<strong>モジュール</strong>の集合体です。
                各モジュールはそれぞれ専門の業務を担いながら、中央の共通データベース上で連動しています。
              </p>
              <Figure
                src="image/03-module-overview.webp"
                alt="SAPのモジュール構成全体図。中央にSAP S/4HANAのコアDBがあり、周囲にSD（販売管理）・MM（在庫購買）・PP（生産管理）・FI（財務会計）・CO（管理会計）・HR（人事管理）の各モジュールがアイコンと共に配置。各モジュールから中央DBへ双方向の矢印。"
                caption="SAP S/4HANA のモジュール構成。すべてが共通DBで連動する"
                kind="diagram"
              />
              <InfoPanel title="主要モジュール一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>モジュール</th>
                      <th>正式名称</th>
                      <th>主な役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>SD</strong></td>
                      <td>Sales &amp; Distribution</td>
                      <td>受注〜請求</td>
                    </tr>
                    <tr>
                      <td><strong>MM</strong></td>
                      <td>Materials Management</td>
                      <td>購買〜在庫</td>
                    </tr>
                    <tr>
                      <td><strong>PP</strong></td>
                      <td>Production Planning</td>
                      <td>生産計画〜製造</td>
                    </tr>
                    <tr>
                      <td><strong>FI</strong></td>
                      <td>Financial Accounting</td>
                      <td>財務諸表作成</td>
                    </tr>
                    <tr>
                      <td><strong>CO</strong></td>
                      <td>Controlling</td>
                      <td>原価管理・部門採算</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                モジュールが分かれているのは「担当業務の違い」であって、データは一本につながっているんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。それが ERP の本質——<strong>Single Source of Truth（単一の真実の情報源）</strong>です。
              </Dialog>
            </>
          ),
        },
        {
          title: "SD（販売管理）",
          plainText:
            "SD — Sales & Distribution（販売管理）\n見積 → 受注 → 出荷 → 請求書発行の流れを一気通貫で管理するモジュール。\n受注伝票が起点となり、在庫の引当（MM）・売上計上（FI）へ自動連鎖する。\nBちゃん：「受注する」だけで、在庫が減って売上が立つんですか？\n先生：そうです。受注伝票に入力すれば、在庫引当と売上計上が自動で動き始めます。画面は1つの入力でも、裏では複数モジュールが連携しているんです。",
          content: (
            <>
              <h2>SD — 販売管理（Sales &amp; Distribution）</h2>
              <p>
                <strong>SD</strong> は、商品の<strong>見積から請求書発行まで</strong>を一気通貫で管理するモジュールです。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  Q["見積\\n(Quotation)"]
  O["受注\\n(Sales Order)"]
  D["出荷\\n(Delivery)"]
  I["請求書\\n(Invoice)"]
  Q --> O --> D --> I`}
              />
              <ul>
                <li><strong>見積</strong> … 顧客からの問い合わせに対して価格・納期を提示</li>
                <li><strong>受注</strong> … 顧客の注文を正式に受け付け、在庫引当（MM）を連動</li>
                <li><strong>出荷</strong> … 倉庫から商品を発送し、在庫を減少させる</li>
                <li><strong>請求書発行</strong> … 出荷完了後に請求書を作成し、売上計上（FI）を自動生成</li>
              </ul>
              <Callout variant="tip">
                SD の受注伝票1件を入力するだけで、<strong>在庫引当（MM）・売上仕訳（FI）</strong>が自動で連鎖します。
              </Callout>
              <Dialog speaker="b">
                「受注する」だけで在庫が減って売上が立つんですか？入力が一回で済むんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。画面の入力は1回でも、裏では複数のモジュールが連携して動いています。それが統合の強みです。
              </Dialog>
            </>
          ),
        },
        {
          title: "MM（在庫購買管理）",
          plainText:
            "MM — Materials Management（在庫購買管理）\n発注 → 入庫 → 請求書照合（3-way matching）。在庫の数量と金額を同時管理する。\n3-way matchingとは：発注書・入庫実績・仕入先請求書の3つを自動照合して差異を検出する仕組み。\nAくん：3-way matchingが自動化されることで、手作業チェックによるミスや時間を大幅に削減できるわけですね。\n先生：購買の不正防止にもなります。3つの数字が一致して初めて支払いが承認されるからです。",
          content: (
            <>
              <h2>MM — 在庫購買管理（Materials Management）</h2>
              <p>
                <strong>MM</strong> は、外部サプライヤへの発注から入庫・請求書照合までを管理するモジュールです。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  PO["発注\\n(Purchase Order)"]
  GR["入庫\\n(Goods Receipt)"]
  IV["請求書受領\\n(Invoice)"]
  PM["支払承認\\n(Payment)"]
  PO --> GR --> IV --> PM`}
              />
              <InfoPanel title="3-way matching（3点照合）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>照合する書類</th>
                      <th>確認する内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>発注書（Purchase Order）</td>
                      <td>発注数量・単価</td>
                    </tr>
                    <tr>
                      <td>入庫実績（Goods Receipt）</td>
                      <td>実際に受け取った数量</td>
                    </tr>
                    <tr>
                      <td>仕入先請求書（Invoice）</td>
                      <td>請求金額・数量</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                3-way matching が自動化されることで、手作業チェックのミスや時間を大幅に削減できるわけですね。
              </Dialog>
              <Dialog speaker="teacher">
                さらに購買の不正防止にもなります。3つの数字が一致して初めて支払いが承認されるからです。
              </Dialog>
            </>
          ),
        },
        {
          title: "PP（生産管理）",
          plainText:
            "PP — Production Planning（生産管理）\nBOM（部品表）とルーティング（作業手順）を元に、MRP（資材所要量計画）で発注・製造計画を自動算出する。\nBOM：製品を作るために必要な部品・原材料のリスト。\nルーティング：どの工程でどの機械を何時間使うかの手順書。\nMRP：需要計画とBOM・在庫量を突き合わせて、いつ何をどれだけ調達・製造すべきかを算出する計算プロセス。\nBちゃん：レシートと調理手順書があれば、あとは自動で買い物リストを作ってくれるイメージですね！",
          content: (
            <>
              <h2>PP — 生産管理（Production Planning）</h2>
              <p>
                <strong>PP</strong> は、製品の生産計画から製造実績管理までを担うモジュールです。
              </p>
              <ul>
                <li>
                  <strong>BOM（Bill of Materials／部品表）</strong> …
                  製品を作るために必要な部品・原材料とその数量のリスト
                </li>
                <li>
                  <strong>ルーティング（Routing）</strong> …
                  どの工程でどの機械を何時間使うかを定義した作業手順書
                </li>
                <li>
                  <strong>MRP（資材所要量計画）</strong> …
                  需要計画とBOM・在庫量を突き合わせ、調達・製造計画を自動算出する仕組み
                </li>
              </ul>
              <Callout variant="tip">
                MRP は「いつ・何を・どれだけ」作るかを自動計算します。BOM と在庫データが正確であることが前提です。
              </Callout>
              <Dialog speaker="b">
                レシート（BOM）と調理手順書（ルーティング）があれば、あとは自動で買い物リスト（MRP）を作ってくれるイメージですね！
              </Dialog>
              <Dialog speaker="teacher">
                よいたとえです。ただし「冷蔵庫に何が残っているか（在庫）」のデータが正確でないと、買い物リストもズレるので注意が必要です。
              </Dialog>
            </>
          ),
        },
        {
          title: "FI（財務会計）",
          plainText:
            "FI — Financial Accounting（財務会計）\n外部報告のためのB/S（貸借対照表）とP/L（損益計算書）を作成するモジュール。株主・税務署・金融機関への報告が主な目的。\n会計伝票（仕訳）が積み重なり、期末にB/SとP/Lが生成される。\nAくん：FIは「外部に見せるための数字」を作る領域で、COは「社内の経営判断に使う数字」を作る領域という棲み分けですね。\n先生：その通り。同じ数字でも目的が違うので、モジュールが分かれているんです。",
          content: (
            <>
              <h2>FI — 財務会計（Financial Accounting）</h2>
              <p>
                <strong>FI</strong> は、外部ステークホルダー（株主・税務署・金融機関）への報告を目的とした財務諸表を作成するモジュールです。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  TX["日々の取引\\n（仕訳伝票）"]
  GL["総勘定元帳\\n(General Ledger)"]
  BS["貸借対照表\\n(B/S)"]
  PL["損益計算書\\n(P/L)"]
  TX --> GL --> BS
  GL --> PL`}
              />
              <ul>
                <li><strong>仕訳伝票</strong> … 取引のたびに借方・貸方が自動または手動で記録される</li>
                <li><strong>総勘定元帳（GL）</strong> … すべての仕訳を勘定科目別に集計した帳簿</li>
                <li><strong>B/S（貸借対照表）</strong> … 資産・負債・資本のバランスを示す</li>
                <li><strong>P/L（損益計算書）</strong> … 一定期間の収益と費用から利益を示す</li>
              </ul>
              <Dialog speaker="a">
                FI は「外部に見せる数字」を作る領域で、CO は「社内の経営判断に使う数字」を作る領域という棲み分けですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。同じ取引データでも目的が違うため、モジュールが分かれています。
              </Dialog>
            </>
          ),
        },
        {
          title: "CO（管理会計）",
          plainText:
            "CO — Controlling（管理会計）\n内部経営判断のための製品原価計算・部門別採算管理を担うモジュール。\n製品1個あたりのコスト（製品原価）や、部門ごとの収益・費用を把握し、価格設定や予算管理に活用する。\nBちゃん：同じ売上1,000万円でも、どの製品でどの部門が稼いだか分からないと意思決定できないですよね。\n先生：そのためにCOがあります。どの製品が儲かっているか、どの部門が費用超過かをリアルタイムに見えるようにする。",
          content: (
            <>
              <h2>CO — 管理会計（Controlling）</h2>
              <p>
                <strong>CO</strong> は、<strong>社内の経営判断</strong>を支えるための原価・採算データを管理するモジュールです。
                FI が外部報告なら、CO は<strong>内部経営</strong>のための数字を扱います。
              </p>
              <ul>
                <li>
                  <strong>製品原価計算（Product Costing）</strong> …
                  製品1個を作るためにかかる材料費・労務費・間接費を積み上げて原価を算出
                </li>
                <li>
                  <strong>部門別採算管理（Profit Center Accounting）</strong> …
                  事業部・拠点・製品群ごとに収益と費用を切り分けて採算を見える化
                </li>
                <li>
                  <strong>予算管理</strong> …
                  予算（計画）と実績を比較して差異を分析
                </li>
              </ul>
              <Callout variant="note">
                FI ＝ 外部報告（財務諸表）、CO ＝ 内部経営判断（原価・採算）。目的が異なるため2つのモジュールが存在します。
              </Callout>
              <Dialog speaker="b">
                同じ売上1,000万円でも、どの製品でどの部門が稼いだか分からないと意思決定できないですよね。
              </Dialog>
              <Dialog speaker="teacher">
                そのために CO があります。どの製品が儲かっているか、どの部門が費用超過かをリアルタイムに把握できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "自動仕訳のメカニズム",
          plainText:
            "【核心】自動仕訳のメカニズム\n工場で原材料を消費した瞬間に自動で会計伝票が生成される仕組み。モノの動きがカネの動きを自動生成する。\n例：倉庫から原材料100kgを取り出した → MM側で「在庫を100kg減らす」記録が入る → 同時にFI側で「借方：材料費 / 貸方：原材料在庫」の仕訳伝票が自動生成される。\nAくん：会計の人が手入力しなくても、工場のオペレーターが入庫・出庫を記録するだけで仕訳が自動的に飛ぶんですね。\n先生：その通りです。人が会計システムに手入力する作業が不要になり、タイムラグもミスもなくなります。",
          content: (
            <>
              <h2>【核心】自動仕訳のメカニズム</h2>
              <p>
                SAP 統合の最も重要な特徴が<strong>自動仕訳</strong>です。
                工場や倉庫での<strong>モノの動き</strong>が、その瞬間に<strong>カネの動き（会計伝票）</strong>を自動生成します。
              </p>
              <Figure
                src="image/03-automatic-journal.webp"
                alt="工場での原材料消費（物理的な動き：倉庫から原材料を取り出す作業員）と、同時に右側のSAP画面に自動生成される会計伝票（借方：材料費、貸方：原材料在庫）が表示される対比図。「モノが動くとカネも動く」という統合の核心を表現。"
                caption="モノが動くとカネも動く — 自動仕訳が統合ERPの心臓部"
                kind="diagram"
              />
              <MermaidDiagram
                chart={`flowchart LR
  GI["倉庫から原材料を出庫\\n（MM: 在庫移動伝票）"]
  FI["会計伝票が自動生成\\n（FI: 借方 材料費\\n　　貸方 原材料在庫）"]
  CO["原価集計に反映\\n（CO: 製品原価）"]
  GI -->|"自動連鎖"| FI -->|"自動連鎖"| CO`}
              />
              <Callout variant="tip">
                会計担当者が手入力しなくても、工場のオペレーターが出庫を記録するだけで仕訳が自動的に生成されます。<strong>タイムラグなし・入力ミスなし</strong>。
              </Callout>
              <Dialog speaker="a">
                工場のオペレーターが出庫を記録するだけで仕訳が自動的に飛ぶんですね。会計の人が後から手入力する必要がない。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。人による二重入力が不要になり、タイムラグもミスもなくなります。これが統合 ERP の最大の価値の1つです。
              </Dialog>
            </>
          ),
        },
        {
          title: "統合の価値を実感する例",
          plainText:
            "統合の価値を実感する例\n受注から売上計上まで、部門をまたいでデータが自動連鎖する。\nステップ1: 営業がSDで受注伝票を登録\nステップ2: 倉庫でMMを使って出荷処理（在庫減少）\nステップ3: FIで売上仕訳が自動生成\nステップ4: COで製品別の収益が即時更新される\nBちゃん：1つの受注入力が、在庫・売上・原価まで全部動かすんですね。これを手作業で連携していたら、絶対ミスが出ますよ。\n先生：その通りです。サイロ化したシステムでは部門間の受け渡しに確認コスト・ミス・遅延が生まれます。統合ERPではそれがなくなる。",
          content: (
            <>
              <h2>統合の価値を実感する例</h2>
              <p>
                受注から売上計上まで、<strong>部門をまたいでデータが自動連鎖</strong>する流れを見てみましょう。
              </p>
              <MermaidDiagram
                chart={`flowchart TB
  S1["① 営業部門\\nSD：受注伝票を登録"]
  S2["② 倉庫部門\\nMM：出荷処理（在庫減少）"]
  S3["③ 会計部門\\nFI：売上仕訳が自動生成"]
  S4["④ 経営管理\\nCO：製品別収益が即時更新"]
  S1 -->|"在庫引当"| S2 -->|"自動仕訳"| S3 -->|"自動連鎖"| S4`}
              />
              <ul>
                <li>各ステップで<strong>別の担当者・部門</strong>が動いているが、データは一本でつながっている</li>
                <li>部門間の「メールで連絡・手入力・確認待ち」が不要</li>
                <li>経営陣は月次決算を待たずに<strong>リアルタイムで収益を把握</strong>できる</li>
              </ul>
              <Dialog speaker="b">
                1つの受注入力が在庫・売上・原価まで全部動かすんですね。これを手作業で連携していたら絶対ミスが出ますよ。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。サイロ化したシステムでは部門間の受け渡しに確認コスト・ミス・遅延が生まれます。統合 ERP ではそれがなくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきポイント：略語と混乱\nモジュール名の略語が多くて混乱する。FI=Financial Accountingなのに「ファイナンスアイ」と読まれたり、COをCOBOLと混同したりするケースがある。\nつまずき：「SD・MM・PP・FI・CO 全部一気に覚えろと言われたら混乱します…」\n先生：業務の担当領域で分けて考えると整理しやすいです。モノを売る=SD、モノを買う=MM、モノを作る=PP、カネを記録する=FI、カネを分析する=CO、と覚えましょう。\nBちゃん：「売る・買う・作る・記録する・分析する」の5動詞に紐付けると覚えやすい！",
          content: (
            <>
              <h2>つまずきポイント：略語の多さと混乱</h2>
              <Dialog speaker="stumble">
                SD・MM・PP・FI・CO… 略語が多すぎて、どれが何の担当か混乱してしまいます。一気に覚えろと言われると頭が真っ白に…。
              </Dialog>
              <p>
                モジュールの略語は、<strong>業務の「動詞」と紐付ける</strong>と記憶に定着しやすくなります。
              </p>
              <InfoPanel title="5動詞でモジュールを整理" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>業務の動詞</th>
                      <th>モジュール</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>モノを <strong>売る</strong></td><td>SD（Sales &amp; Distribution）</td></tr>
                    <tr><td>モノを <strong>買う</strong></td><td>MM（Materials Management）</td></tr>
                    <tr><td>モノを <strong>作る</strong></td><td>PP（Production Planning）</td></tr>
                    <tr><td>カネを <strong>記録する</strong></td><td>FI（Financial Accounting）</td></tr>
                    <tr><td>カネを <strong>分析する</strong></td><td>CO（Controlling）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                「売る・買う・作る・記録する・分析する」の5動詞に紐付けると整理しやすいです。全部同時に覚えなくて大丈夫。
              </Dialog>
              <Dialog speaker="b">
                5動詞に紐付けると覚えやすい！まずこれで頭に入れます。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章の核心は2点。1つ目はモジュールが業務領域ごとに分かれていること。2つ目はモノの動きがカネの動きを自動生成する「自動仕訳」が統合ERPの心臓部であること。\nAくん：自動仕訳のメカニズムがあるから、工場の出庫処理1回で在庫・会計・原価が一斉に更新される。部門をまたいだリアルタイム連携がSAPの強みですね。\nBちゃん：モジュールを5動詞（売る・買う・作る・記録する・分析する）で覚えると整理できました。特にFIとCOの違い——外部報告か内部判断かという目的の違い——が一番のポイントだと思います。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の核心は2点です。1つ目はモジュールが業務領域ごとに分かれていること。2つ目は<strong>モノの動きがカネの動きを自動生成する</strong>「自動仕訳」が統合 ERP の心臓部であること。これさえ押さえれば十分です。
              </Dialog>
              <Dialog speaker="a">
                自動仕訳のメカニズムがあるから、工場の出庫処理1回で在庫・会計・原価が一斉に更新される。部門をまたいだリアルタイム連携が SAP の強みですね。手作業の二重入力や確認待ちが根本からなくなる。
              </Dialog>
              <Dialog speaker="b">
                モジュールを5動詞（売る・買う・作る・記録する・分析する）で覚えると整理できました。特に FI と CO の違い——外部報告か内部判断かという目的の違い——が一番のポイントだと思います。
              </Dialog>
              <Callout variant="tip">
                略語が多くて混乱したら「5動詞」に戻る。自動仕訳の仕組みが理解できれば、SAP の統合価値の核心を掴んでいます。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SDモジュールの業務範囲は？→ 見積から請求書発行まで（受注〜出荷〜請求）\nQ2 自動仕訳とは何か？→ 業務トランザクション（モノの動き）が発生した瞬間に自動で会計伝票が生成される仕組み\nQ3 FIとCOの違いは？→ FIは外部報告（財務諸表）用、COは内部経営判断（原価・採算）用\n今日のひとこと：モジュールは地図、自動仕訳はその地図をつなぐ血管。統合の価値はここにあります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="SD（Sales &amp; Distribution）は見積・受注・出荷・請求書発行までの販売プロセス全体を管理します。受注伝票が起点となり、在庫引当（MM）と売上仕訳（FI）へ自動連鎖します。"
                question={<strong>SD モジュールの主な業務範囲は？</strong>}
                options={[
                  "発注・入庫・請求書照合",
                  "見積から請求書発行まで（受注〜出荷〜請求）",
                  "財務諸表（B/S・P/L）の作成",
                ]}
              />
              <Quiz
                answer={2}
                explanation="自動仕訳とは、在庫移動や出荷などの業務トランザクション（モノの動き）が発生した瞬間に、SAP が自動で会計伝票を生成する仕組みです。会計担当者が手入力しなくても、タイムラグなしにカネの動きが記録されます。"
                question={<strong>「自動仕訳」とは何か？</strong>}
                options={[
                  "会計担当者が月次で一括入力する伝票登録作業",
                  "ABAP プログラムで手動作成する仕訳ファイル",
                  "業務トランザクション（モノの動き）が発生した瞬間に自動で会計伝票が生成される仕組み",
                ]}
              />
              <Quiz
                answer={0}
                explanation="FI（Financial Accounting）は株主・税務署・金融機関への外部報告用の財務諸表（B/S・P/L）を作成します。CO（Controlling）は同じ取引データを使いながら、社内の経営判断のために製品原価計算や部門別採算を管理します。目的が異なるため2つのモジュールが存在しています。"
                question={<strong>FI と CO の最大の違いは？</strong>}
                options={[
                  "FI は外部報告（財務諸表）用、CO は内部経営判断（原価・採算）用",
                  "FI は生産管理、CO は購買管理を担う",
                  "FI と CO は同じモジュールの別名である",
                ]}
              />
              <Dialog speaker="closing">
                モジュールは業務の地図、自動仕訳はその地図をつなぐ血管です。この2つが頭に入れば、SAP 統合の価値を説明できます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CoreModulesLesson);
