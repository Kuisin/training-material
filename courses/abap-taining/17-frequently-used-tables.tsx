import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  SapErdDiagram,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "よく使うテーブルと項目（列）早見表 — 会計で頻出のテーブル・カラム集",
  meta: "初学者 · 30分",
};

export default function FrequentlyUsedTablesLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "17-frequently-used-tables", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "よく使うテーブルと項目（列）早見表\nABAP（FI/会計）の開発・調査でよく出会うテーブルと、その代表的な項目（列）名・意味をまとめた早見表です。\n⏱ 30分 / 📶 初学者 / 🏷 ABAP研修\nこの章で見るもの\n・ERD（テーブル関連図）でキー・項目・つながりを視覚化\n・伝票系：BKPF（ヘッダ）/ BSEG（明細）/ ACDOCA（統合）\n・マスタ・辞書系：T001 / T003T / SKA1 / SKAT / SKB1\n・取引先・残高系：KNA1 / LFA1 / BSID / BSIK\n・覚えておきたい値：SHKZG（貸借）/ BLART（伝票タイプ）/ BSCHL（転記キー）\n各テーブルは ERD（項目名は『日本語名（列コード）』）と項目一覧表の2通りで確認できます。\n使い方：丸暗記ではなく、設計書やデバッガで項目名が出たときに引く辞書として使う。",
          content: (
            <>
              <hgroup>
                <h1>よく使うテーブルと項目（列）早見表</h1>
                <p>
                  ABAP（FI / 会計）の開発・調査で<strong>よく出会うテーブル</strong>と、その代表的な
                  <strong>項目（列）名・意味</strong>をまとめた早見表です。第6章「会計テーブル（BKPF/BSEG）」の続きとして、手元に置いて引く資料を目指します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で見るもの</h3>
              <ul>
                <li>
                  <strong>ERD（テーブル関連図）</strong>でキー・項目・つながりを視覚化（項目は<strong>「日本語名（列コード）」</strong>で表示）
                </li>
                <li>
                  伝票系 … <code>BKPF</code>（ヘッダ）/ <code>BSEG</code>（明細）/ <code>ACDOCA</code>（統合会計）
                </li>
                <li>
                  マスタ・辞書系 … <code>T001</code> / <code>T003T</code> / <code>SKA1</code> / <code>SKAT</code> / <code>SKB1</code>
                </li>
                <li>
                  取引先・残高系 … <code>KNA1</code> / <code>LFA1</code> / <code>BSID</code> / <code>BSIK</code>
                </li>
                <li>
                  覚えておきたい値 … <code>SHKZG</code>（貸借）/ <code>BLART</code>（伝票タイプ）/ <code>BSCHL</code>（転記キー）
                </li>
              </ul>
              <Callout variant="tip">
                すべてを暗記する必要はありません。<strong>「設計書やデバッガで見かけた項目名の意味を引く辞書」</strong>として使うのがおすすめです。
              </Callout>
            </>
          ),
        },
        {
          title: "テーブルの全体像",
          plainText:
            "テーブルの全体像\n会計伝票は BKPF（ヘッダ：1件1行）と BSEG（明細：1件で複数行）に分かれ、会社コード＋伝票番号＋会計年度の3つで結びつく。\nS/4HANA では ACDOCA（Universal Journal）に統合され、BKPF/BSEG は互換ビュー経由で見えることが多い。\nコード値（会社・伝票タイプ・勘定）の意味は T001 / T003T / SKAT などの辞書テーブルで名前に変換する。\n先生：伝票（取引データ）→ マスタ・辞書（意味づけ）の2層で覚えると整理しやすい。",
          content: (
            <>
              <h2>テーブルの全体像</h2>
              <p>
                会計テーブルは大きく<strong>「取引データ（伝票）」</strong>と<strong>「マスタ・辞書（意味づけ）」</strong>の2層に分かれます。
                伝票は<code>BKPF</code>（ヘッダ）と<code>BSEG</code>（明細）に分かれ、
                <strong>会社コード（BUKRS）＋伝票番号（BELNR）＋会計年度（GJAHR）</strong>の3つで1件に結びつきます。
              </p>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph tx [取引データ 伝票]
    BKPF["BKPF<br/>伝票ヘッダ 1件1行"]
    BSEG["BSEG<br/>伝票明細 1件で複数行"]
    ACDOCA["ACDOCA<br/>Universal Journal 統合"]
    BKPF -->|BUKRS+BELNR+GJAHR| BSEG
    BKPF -.->|S/4 で統合| ACDOCA
  end
  subgraph md [マスタ・辞書 意味づけ]
    T001["T001<br/>会社コード"]
    T003T["T003T<br/>伝票タイプ名称"]
    SKAT["SKA1/SKAT<br/>勘定科目"]
    KNA1["KNA1 / LFA1<br/>得意先・仕入先"]
  end
  BKPF -->|BUKRS| T001
  BKPF -->|BLART| T003T
  BSEG -->|HKONT| SKAT
  BSEG -->|KUNNR / LIFNR| KNA1`}
              />
              <Dialog speaker="teacher">
                まず<strong>伝票（BKPF / BSEG）</strong>を軸に覚え、コード値の意味は<strong>辞書（T001 / T003T / SKAT …）</strong>で引く——この2層のイメージを持つと、どのテーブルを見ればよいか迷いません。
              </Dialog>
              <Dialog speaker="b">
                取引の記録が伝票、コードを名前に直すのが辞書、ですね。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="06-select-from-db"
                slide={2}
                label="第6章: 会計の主な表を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "ERD（テーブル関連図）",
          plainText:
            "ERD（テーブル関連図）\n主要テーブルとそのキー項目・つながりを1枚で見る。各項目は『コード＋日本語名（コメント）』で表示。\n関連：BKPF 1 ―― 多 BSEG（BUKRS+BELNR+GJAHR）／T001 1―多 BKPF（BUKRS）／T003T 1―多 BKPF（BLART）／SKA1 1―多 BSEG（HKONT）／KNA1・LFA1 1―多 BSEG（KUNNR・LIFNR）\nPK＝主キー（その表で行を一意にする項目）。読み方：1つの伝票ヘッダ(BKPF)に複数の明細(BSEG)がぶら下がり、コード項目はマスタ・辞書で意味を引く。\n先生：線の『1―多』を追うと、どのキーで結合すればよいかが分かる。",
          content: (
            <>
              <h2>ERD（テーブル関連図）</h2>
              <p>
                主要テーブルの<strong>キー項目</strong>と<strong>つながり（外部キー線）</strong>を1枚にまとめた ER 図です。
                各列は<strong>日本語名（列コード）</strong>で表示し、鍵アイコン付きの列が主キーです。
                ドラッグ・ズームで全体をたどれます。見づらいときは図右上の<strong>「全画面」</strong>ボタンで拡大できます。
              </p>
              <SapErdDiagram variant="overview" height={520} />
              <Callout variant="note">
                記号の意味・操作の詳細は、図の下の<strong>「ER図の見方・記号の説明」</strong>（折りたたみ）を開いて確認してください。
                次のスライドからは、テーブルごとに項目をすべて並べた ER 図と一覧表を見ていきます。
              </Callout>
              <Dialog speaker="a">
                線の「1 ―― 多」をたどると、<strong>どのキーで結合すればよいか</strong>が一目で分かりますね。
              </Dialog>
              <Dialog speaker="b">
                1枚の伝票ヘッダ（<code>BKPF</code>）に複数の明細（<code>BSEG</code>）がぶら下がっている、という形が見えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "BKPF（伝票ヘッダ）",
          plainText:
            "BKPF 会計伝票ヘッダ（1件1行）\nBUKRS 会社コード（キー）／BELNR 伝票番号（キー）／GJAHR 会計年度（キー）\nBLART 伝票タイプ／BLDAT 証憑日付／BUDAT 転記日付／MONAT 会計期間\nWAERS 伝票通貨／XBLNR 参照伝票番号／BKTXT ヘッダテキスト\nCPUDT 入力日付／USNAM 登録ユーザ／TCODE トランザクションコード／STBLG 反対伝票番号\n先生：BKPF は『いつ・どの会社・どの種類の伝票か』という見出し情報。",
          content: (
            <>
              <h2>
                <code>BKPF</code> — 会計伝票ヘッダ（1件1行）
              </h2>
              <p>1枚の伝票につき1行。「いつ・どの会社・どの種類の伝票か」という<strong>見出し情報</strong>を持ちます。</p>
              <SapErdDiagram variant="bkpf" height={440} />
              <InfoPanel title="BKPF の主な項目" variant="reference" lead="★ はキー項目（この3つで伝票が一意に決まる）。">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>名称</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><code>BUKRS</code> ★</td><td>会社コード</td><td>どの会社の伝票か（例: 1000）</td></tr>
                    <tr><td><code>BELNR</code> ★</td><td>会計伝票番号</td><td>伝票を識別する番号</td></tr>
                    <tr><td><code>GJAHR</code> ★</td><td>会計年度</td><td>伝票番号は年度内で採番されるため年度も必要</td></tr>
                    <tr><td><code>BLART</code></td><td>伝票タイプ</td><td>SA / KR / DR など（意味は T003T で引く）</td></tr>
                    <tr><td><code>BLDAT</code></td><td>証憑日付</td><td>請求書など原票の日付</td></tr>
                    <tr><td><code>BUDAT</code></td><td>転記日付</td><td>帳簿に計上する日付（会計期間を決める）</td></tr>
                    <tr><td><code>MONAT</code></td><td>会計期間</td><td>転記月（01〜12 ＋特別期間）</td></tr>
                    <tr><td><code>WAERS</code></td><td>伝票通貨</td><td>伝票が入力された通貨（例: JPY）</td></tr>
                    <tr><td><code>XBLNR</code></td><td>参照伝票番号</td><td>外部の伝票番号・請求書番号など</td></tr>
                    <tr><td><code>BKTXT</code></td><td>ヘッダテキスト</td><td>伝票全体に対するメモ</td></tr>
                    <tr><td><code>CPUDT</code></td><td>入力日付</td><td>実際にシステムへ登録した日</td></tr>
                    <tr><td><code>USNAM</code></td><td>登録ユーザ</td><td>誰が登録したか</td></tr>
                    <tr><td><code>TCODE</code></td><td>T-code</td><td>登録に使ったトランザクション（例: FB01）</td></tr>
                    <tr><td><code>STBLG</code></td><td>反対伝票番号</td><td>逆仕訳（取消）された伝票の番号</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                日付が <code>BLDAT</code> / <code>BUDAT</code> / <code>CPUDT</code> と3つあるんですね。
              </Dialog>
              <Dialog speaker="teacher">
                はい。<strong>証憑（原票）の日付・帳簿に載せる日付・入力した日付</strong>はそれぞれ別物です。会計では <code>BUDAT</code>（転記日付）が期間を決めるので特に重要です。
              </Dialog>
            </>
          ),
        },
        {
          title: "BSEG（伝票明細）",
          plainText:
            "BSEG 会計伝票明細（1件で複数行）\nBUKRS／BELNR／GJAHR はヘッダと同じキー＋BUZEI 明細番号（キー）\nBSCHL 転記キー／SHKZG 貸借区分（S=借方 H=貸方）\nDMBTR 現地通貨額／WRBTR 伝票通貨額／HKONT 総勘定元帳勘定\nKUNNR 得意先／LIFNR 仕入先／KOSTL 原価センタ／MWSKZ 税コード／ZUONR 割当番号／SGTXT 明細テキスト\n先生：1伝票の借方合計と貸方合計は必ず一致する（貸借平均）。",
          content: (
            <>
              <h2>
                <code>BSEG</code> — 会計伝票明細（1件で複数行）
              </h2>
              <p>
                同じ伝票キー（BUKRS+BELNR+GJAHR）に<strong>明細番号 BUZEI</strong> を足して1行を特定します。「いくらを・どの科目に・借方か貸方か」を持ちます。
              </p>
              <SapErdDiagram variant="bseg" height={480} />
              <InfoPanel title="BSEG の主な項目" variant="reference" lead="★ はキー項目。BUZEI でヘッダの下の各行を区別する。">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>名称</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><code>BUKRS</code> ★</td><td>会社コード</td><td>ヘッダと同じ</td></tr>
                    <tr><td><code>BELNR</code> ★</td><td>伝票番号</td><td>ヘッダと同じ</td></tr>
                    <tr><td><code>GJAHR</code> ★</td><td>会計年度</td><td>ヘッダと同じ</td></tr>
                    <tr><td><code>BUZEI</code> ★</td><td>明細番号</td><td>伝票内の行番号（001, 002, …）</td></tr>
                    <tr><td><code>BSCHL</code></td><td>転記キー</td><td>借方/貸方や勘定種別を決める（40/50/01/31 など）</td></tr>
                    <tr><td><code>SHKZG</code></td><td>貸借区分</td><td><code>S</code>=借方（Soll）/ <code>H</code>=貸方（Haben）</td></tr>
                    <tr><td><code>DMBTR</code></td><td>現地通貨額</td><td>会社コードの現地通貨での金額</td></tr>
                    <tr><td><code>WRBTR</code></td><td>伝票通貨額</td><td>伝票通貨（WAERS）での金額</td></tr>
                    <tr><td><code>HKONT</code></td><td>総勘定元帳勘定</td><td>G/L 勘定番号（意味は SKAT で引く）</td></tr>
                    <tr><td><code>KUNNR</code></td><td>得意先コード</td><td>売掛側の取引先（KNA1 で引く）</td></tr>
                    <tr><td><code>LIFNR</code></td><td>仕入先コード</td><td>買掛側の取引先（LFA1 で引く）</td></tr>
                    <tr><td><code>KOSTL</code></td><td>原価センタ</td><td>管理会計上の費用の負担先</td></tr>
                    <tr><td><code>MWSKZ</code></td><td>税コード</td><td>消費税などの税区分</td></tr>
                    <tr><td><code>ZUONR</code></td><td>割当番号</td><td>消込・並べ替え用の任意キー</td></tr>
                    <tr><td><code>SGTXT</code></td><td>明細テキスト</td><td>その行に対するメモ</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                1枚の伝票では、<strong>借方（S）の合計と貸方（H）の合計が必ず一致</strong>します（貸借平均の原則）。金額を集計するときは <code>SHKZG</code> を必ず見ます。
              </Dialog>
              <Dialog speaker="stumble">
                <code>DMBTR</code> と <code>WRBTR</code> を混同しがちです。外貨伝票では値が異なるので、「現地通貨か・伝票通貨か」を設計書で確認します。
              </Dialog>
            </>
          ),
        },
        {
          title: "ACDOCA（統合会計）",
          plainText:
            "ACDOCA Universal Journal（S/4HANA 以降）\nFI と CO などを1テーブルに統合した明細レベルの会計テーブル。BKPF/BSEG は互換ビュー経由で見えることが多い。\nRBUKRS 会社コード／GJAHR 会計年度／BELNR 伝票番号／DOCLN 明細番号／RLDNR 元帳\nRACCT 勘定／DRCRK 貸借区分／HSL 現地通貨額／TSL 取引通貨額／RHCUR 現地通貨／BUDAT 転記日付\n先生：列名は BSEG と似ているが少し違う。S/4 案件では ACDOCA を見る場面が増える。",
          content: (
            <>
              <h2>
                <code>ACDOCA</code> — Universal Journal（S/4HANA 以降）
              </h2>
              <p>
                S/4HANA では、FI（財務会計）や CO（管理会計）などが<strong>1つの明細テーブル ACDOCA に統合</strong>されました。
                従来の <code>BKPF</code> / <code>BSEG</code> は互換ビュー経由で参照できることが多く、新規開発では ACDOCA を直接見る場面が増えています。
              </p>
              <SapErdDiagram variant="acdoca" height={400} />
              <InfoPanel title="ACDOCA の主な項目（BSEG と対応づけて覚える）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>名称</th>
                      <th>BSEG での近い項目</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><code>RLDNR</code></td><td>元帳</td><td>（元帳の概念。例: 0L）</td></tr>
                    <tr><td><code>RBUKRS</code></td><td>会社コード</td><td><code>BUKRS</code></td></tr>
                    <tr><td><code>GJAHR</code></td><td>会計年度</td><td><code>GJAHR</code></td></tr>
                    <tr><td><code>BELNR</code></td><td>伝票番号</td><td><code>BELNR</code></td></tr>
                    <tr><td><code>DOCLN</code></td><td>明細番号</td><td><code>BUZEI</code></td></tr>
                    <tr><td><code>RACCT</code></td><td>勘定コード</td><td><code>HKONT</code></td></tr>
                    <tr><td><code>DRCRK</code></td><td>貸借区分</td><td><code>SHKZG</code></td></tr>
                    <tr><td><code>HSL</code></td><td>現地通貨額</td><td><code>DMBTR</code></td></tr>
                    <tr><td><code>TSL</code></td><td>取引通貨額</td><td><code>WRBTR</code></td></tr>
                    <tr><td><code>RHCUR</code></td><td>現地通貨</td><td>（会社コードの通貨）</td></tr>
                    <tr><td><code>BUDAT</code></td><td>転記日付</td><td><code>BKPF-BUDAT</code></td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="note">
                <code>ACDOCA</code> は列数が非常に多い大きなテーブルです。本コースでは<strong>まず BKPF / BSEG を基本</strong>に押さえ、ACDOCA は「S/4 では統合版がある」と知っておけば十分です。
              </Callout>
              <Dialog speaker="a">
                列名は変わっても、「会社・年度・伝票・明細・勘定・貸借・金額」という<strong>役割は同じ</strong>なんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "マスタ・辞書テーブル",
          plainText:
            "マスタ・辞書テーブル（コードを名前に変える）\nT001 会社コードマスタ：BUKRS 会社コード／BUTXT 会社名／LAND1 国／WAERS 通貨／KTOPL 勘定表\nT003T 伝票タイプ名称：SPRAS 言語／BLART 伝票タイプ／LTEXT 名称\nSKA1 勘定マスタ(勘定表)：KTOPL 勘定表／SAKNR 勘定番号\nSKAT 勘定名称：SPRAS 言語／KTOPL／SAKNR／TXT20・TXT50 名称\nSKB1 勘定マスタ(会社コード)：BUKRS／SAKNR／FDGRV 計画グループ 等\n先生：名称テーブルは言語(SPRAS)で絞るのを忘れない（例 'J' 日本語）。",
          content: (
            <>
              <h2>マスタ・辞書テーブル（コード → 名前）</h2>
              <p>
                伝票に入っているのは<strong>コード（番号）</strong>です。レポートに名前を出すときは、辞書テーブルで引いて変換します。
              </p>
              <SapErdDiagram variant="master" height={360} />
              <InfoPanel title="会社・伝票タイプ" variant="reference">
                <table>
                  <thead>
                    <tr><th>テーブル</th><th>内容</th><th>主な項目</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>T001</code></td>
                      <td>会社コードマスタ</td>
                      <td><code>BUKRS</code> 会社コード / <code>BUTXT</code> 会社名 / <code>LAND1</code> 国 / <code>WAERS</code> 通貨 / <code>KTOPL</code> 勘定表</td>
                    </tr>
                    <tr>
                      <td><code>T003T</code></td>
                      <td>伝票タイプ名称</td>
                      <td><code>SPRAS</code> 言語 / <code>BLART</code> 伝票タイプ / <code>LTEXT</code> 名称</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="勘定科目（G/L）" variant="reference" lead="勘定は『勘定表レベル』『会社コードレベル』『名称』の3つに分かれる。">
                <table>
                  <thead>
                    <tr><th>テーブル</th><th>内容</th><th>主な項目</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>SKA1</code></td>
                      <td>勘定マスタ（勘定表レベル）</td>
                      <td><code>KTOPL</code> 勘定表 / <code>SAKNR</code> 勘定番号</td>
                    </tr>
                    <tr>
                      <td><code>SKAT</code></td>
                      <td>勘定名称</td>
                      <td><code>SPRAS</code> 言語 / <code>KTOPL</code> / <code>SAKNR</code> / <code>TXT20</code>・<code>TXT50</code> 名称</td>
                    </tr>
                    <tr>
                      <td><code>SKB1</code></td>
                      <td>勘定マスタ（会社コードレベル）</td>
                      <td><code>BUKRS</code> / <code>SAKNR</code> / <code>FDGRV</code> 計画グループ など</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`" 伝票タイプ名称を日本語で引く例
SELECT SINGLE ltext
  FROM t003t
  INTO lv_blart_name
  WHERE spras = 'J'        " 言語キー（日本語）
    AND blart = ls_bkpf-blart.`}
              />
              <Dialog speaker="teacher">
                名称テーブル（<code>T003T</code> / <code>SKAT</code> など）は<strong>言語キー <code>SPRAS</code> で絞る</strong>のを忘れずに。これを抜くと全言語の行が返ってしまいます。
              </Dialog>
              <Dialog speaker="b">
                コードのままだと読めないから、辞書で名前に直すんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "取引先・残高テーブル",
          plainText:
            "取引先マスタと未消込/消込明細\nKNA1 得意先マスタ(一般)：KUNNR 得意先／NAME1 名称／LAND1 国／ORT01 所在地\nLFA1 仕入先マスタ(一般)：LIFNR 仕入先／NAME1 名称／LAND1／ORT01\nBSID 得意先・未消込明細／BSAD 得意先・消込済明細\nBSIK 仕入先・未消込明細／BSAK 仕入先・消込済明細\n先生：BSID 等は『未消込(I=open)/消込済(A=cleared)』『得意先(D)/仕入先(K)』の組み合わせ。S/4 では CDS ビュー経由のことも多い。",
          content: (
            <>
              <h2>取引先マスタ・残高（未消込/消込）テーブル</h2>
              <InfoPanel title="取引先マスタ（一般データ）" variant="reference">
                <table>
                  <thead>
                    <tr><th>テーブル</th><th>内容</th><th>主な項目</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>KNA1</code></td>
                      <td>得意先マスタ（一般）</td>
                      <td><code>KUNNR</code> 得意先 / <code>NAME1</code> 名称 / <code>LAND1</code> 国 / <code>ORT01</code> 所在地</td>
                    </tr>
                    <tr>
                      <td><code>LFA1</code></td>
                      <td>仕入先マスタ（一般）</td>
                      <td><code>LIFNR</code> 仕入先 / <code>NAME1</code> 名称 / <code>LAND1</code> 国 / <code>ORT01</code> 所在地</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel
                title="未消込・消込済 明細（古典テーブル）"
                variant="reference"
                lead="頭文字 BS ＋ I/A（未消込/消込済）＋ D/K（得意先/仕入先）で覚える。"
              >
                <table>
                  <thead>
                    <tr><th>テーブル</th><th>対象</th><th>状態</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>BSID</code></td><td>得意先（D）</td><td>未消込（Open）</td></tr>
                    <tr><td><code>BSAD</code></td><td>得意先（D）</td><td>消込済（Cleared）</td></tr>
                    <tr><td><code>BSIK</code></td><td>仕入先（K）</td><td>未消込（Open）</td></tr>
                    <tr><td><code>BSAK</code></td><td>仕入先（K）</td><td>消込済（Cleared）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  BS["BS_ _"] --> I["I = 未消込 Open"]
  BS --> A["A = 消込済 Cleared"]
  I --> D1["...D 得意先"]
  I --> K1["...K 仕入先"]
  A --> D2["...D 得意先"]
  A --> K2["...K 仕入先"]`}
              />
              <Callout variant="warning">
                <code>BSID</code> などの古典的な明細テーブルは、S/4HANA では<strong>CDS ビュー経由で参照する</strong>ことが推奨される場合があります。直接読む前にプロジェクト標準を確認してください。
              </Callout>
              <Dialog speaker="a">
                テーブル名の文字に意味があるんですね。<code>BSIK</code> なら「未消込（I）の仕入先（K）」。
              </Dialog>
            </>
          ),
        },
        {
          title: "覚えておきたい値",
          plainText:
            "覚えておきたいコード値\nSHKZG 貸借区分：S=借方(Soll)／H=貸方(Haben)\nBLART 伝票タイプ（例）：SA 総勘定元帳／KR 仕入先請求／KZ 仕入先支払／DR 得意先請求／DZ 得意先入金／AB 一般\nBSCHL 転記キー（例）：40 G/L借方／50 G/L貸方／01 得意先請求／11 得意先貸方／31 仕入先請求／21 仕入先借方\n先生：これらはカスタマイズで変わり得る代表値。自プロジェクトの設定を必ず確認。",
          content: (
            <>
              <h2>覚えておきたいコード値</h2>
              <p>項目名と並んで、よく出てくる<strong>代表的なコード値</strong>も知っておくと、デバッガや SE16 でデータを読むのが速くなります。</p>
              <InfoPanel title="SHKZG（貸借区分）" variant="reference">
                <table>
                  <thead><tr><th>値</th><th>意味</th></tr></thead>
                  <tbody>
                    <tr><td><code>S</code></td><td>借方（Soll）</td></tr>
                    <tr><td><code>H</code></td><td>貸方（Haben）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="BLART（伝票タイプ・代表例）" variant="reference">
                <table>
                  <thead><tr><th>値</th><th>意味</th></tr></thead>
                  <tbody>
                    <tr><td><code>SA</code></td><td>総勘定元帳（G/L）伝票</td></tr>
                    <tr><td><code>KR</code></td><td>仕入先請求</td></tr>
                    <tr><td><code>KZ</code></td><td>仕入先支払</td></tr>
                    <tr><td><code>DR</code></td><td>得意先請求</td></tr>
                    <tr><td><code>DZ</code></td><td>得意先入金</td></tr>
                    <tr><td><code>AB</code></td><td>一般伝票</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="BSCHL（転記キー・代表例）" variant="reference">
                <table>
                  <thead><tr><th>値</th><th>意味</th></tr></thead>
                  <tbody>
                    <tr><td><code>40</code></td><td>G/L 勘定・借方</td></tr>
                    <tr><td><code>50</code></td><td>G/L 勘定・貸方</td></tr>
                    <tr><td><code>01</code></td><td>得意先・請求（借方）</td></tr>
                    <tr><td><code>11</code></td><td>得意先・貸方</td></tr>
                    <tr><td><code>31</code></td><td>仕入先・請求（貸方）</td></tr>
                    <tr><td><code>21</code></td><td>仕入先・借方</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                <code>BLART</code> や <code>BSCHL</code> は<strong>カスタマイズで追加・変更され得る</strong>値です。ここに挙げたのは標準の代表例なので、実装では必ず自プロジェクトの設定を確認してください。
              </Callout>
              <Dialog speaker="teacher">
                値の暗記より、<strong>「これはコードだから辞書やカスタマイズで意味が決まる」</strong>と意識するのが大切です。迷ったら <code>T003T</code> などで名称を引きましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 伝票を一意に決めるキーは？→ 会社コード＋伝票番号＋会計年度（＋明細は BUZEI）\nQ2 貸借区分 SHKZG の S は？→ 借方（Soll）\nQ3 伝票タイプの名称を引くテーブルは？→ T003T（SPRAS で言語を絞る）\nQ4 S/4HANA の統合会計テーブルは？→ ACDOCA\n締め：項目名は『役割』で覚え、意味は辞書で引く。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="BKPF/BSEG は会社コード（BUKRS）＋伝票番号（BELNR）＋会計年度（GJAHR）で1伝票が決まり、明細はさらに BUZEI を足して1行を特定します。伝票番号だけでは年度をまたいで重複するため一意になりません。"
                question={<strong>会計伝票を一意に特定するキーの組み合わせは？</strong>}
                options={[
                  "伝票番号（BELNR）だけ",
                  "会社コード（BUKRS）と伝票番号（BELNR）だけ",
                  "会社コード＋伝票番号＋会計年度（＋明細は BUZEI）",
                ]}
              />
              <Quiz
                answer={0}
                explanation="SHKZG は貸借区分で、S=借方（Soll）、H=貸方（Haben）です。金額を集計するときはこの値を見て借方・貸方を分ける必要があります。1伝票では借方合計と貸方合計が必ず一致します。"
                question={<strong>BSEG の SHKZG が「S」のとき、その明細は？</strong>}
                options={["借方", "貸方", "未消込"]}
              />
              <Quiz
                answer={1}
                explanation="伝票タイプ（BLART）の名称は T003T で引きます。名称テーブルなので言語キー SPRAS（例: 'J'）で絞らないと全言語の行が返ります。T001 は会社コード、SKAT は勘定科目の名称です。"
                question={<strong>伝票タイプ（BLART）のコードを名称に変換するテーブルは？</strong>}
                options={["T001", "T003T", "SKB1"]}
              />
              <Quiz
                answer={1}
                explanation="ACDOCA は S/4HANA の Universal Journal（統合会計テーブル）で、FI/CO などを明細レベルで1つにまとめています。従来の BKPF/BSEG は互換ビュー経由で参照できることが多いです。"
                question={<strong>S/4HANA で FI/CO を統合した明細会計テーブルは？</strong>}
                options={["BSEG", "ACDOCA", "BSID"]}
              />
              <Dialog speaker="closing">
                項目名は<strong>「役割（会社・年度・伝票・明細・勘定・貸借・金額）」</strong>で覚え、コードの意味は辞書で引く——この2点を押さえれば、初見のテーブルでも読み解けます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FrequentlyUsedTablesLesson);
