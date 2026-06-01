import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "S/4HANA とモジュール — 業務ロジックの地図",
  meta: "初学者 · 25分",
};

const MODULE_ROWS: { code: string; name: string; desc: string }[] = [
  { code: "FI", name: "財務会計", desc: "仕訳・勘定・決算など" },
  { code: "CO", name: "管理会計", desc: "原価・予算・収益性分析" },
  { code: "SD", name: "販売管理", desc: "受注・出荷・請求" },
  { code: "MM", name: "購買・在庫", desc: "発注・入庫・在庫" },
  { code: "PP", name: "生産管理", desc: "計画・製造オーダ" },
  { code: "QM", name: "品質管理", desc: "検査・品質データ" },
  { code: "EWM", name: "倉庫管理", desc: "高度な倉庫オペレーション" },
  { code: "PS", name: "プロジェクト", desc: "工事・プロジェクト原価" },
  { code: "EAM", name: "設備管理", desc: "保全・設備台帳" },
  { code: "TR", name: "資金管理", desc: "資金繰り・金融取引" },
];

export default function S4hanaModulesLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-products-services", "03-s4hana-modules", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "S/4HANA とモジュール\nS/4HANA は現行の ERP コア。Fiori の UI の下で各モジュールの業務ロジックが動き、HANA にデータが載る。",
          content: (
            <>
              <hgroup>
                <h1>S/4HANA とモジュール</h1>
                <p>
                  <strong>SAP S/4HANA</strong> は現行の ERP コア製品です。ユーザーは主に <strong>SAP Fiori</strong> から操作し、
                  各<strong>モジュール</strong>の業務ロジックが <strong>SAP HANA</strong> 上のデータと連動します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP 構造とサービス" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>S/4HANA を中心としたモジュール地図</li>
                <li>よく出る略語（FI / SD / MM など）の意味</li>
                <li>UI・アプリケーション・DB の三層（システム構造）</li>
              </ul>
            </>
          ),
        },
        {
          title: "モジュール一覧",
          plainText: "主要モジュールの一覧",
          content: (
            <>
              <h2>主要モジュール（業務層）</h2>
              <p>プロジェクトや業界により使うモジュールは異なりますが、次がよく登場します。</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left pr-3">略称</th>
                      <th className="text-left pr-3">名称</th>
                      <th className="text-left">ざっくりした役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULE_ROWS.map((m) => (
                      <tr key={m.code}>
                        <td>
                          <strong>{m.code}</strong>
                        </td>
                        <td>{m.name}</td>
                        <td>{m.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout variant="tip">
                ABAP 研修で扱う会計（伝票・BKPF/BSEG）は <strong>FI</strong> 領域のデータです。
              </Callout>
            </>
          ),
        },
        {
          title: "三層アーキ",
          plainText:
            "システムの三層\nUI＝Fiori（ユーザー操作）／アプリ＝S/4HANA（業務ロジック）／DB＝HANA（データ管理）",
          content: (
            <>
              <h2>システム構造（アーキテクチャ）</h2>
              <p>S/4HANA 環境では、次の<strong>三層</strong>で技術が分かれます。</p>
              <MermaidDiagram
                chart={`flowchart TB
  UI["UI 層\nSAP Fiori\n（ユーザー操作）"]
  APP["アプリケーション層\nSAP S/4HANA\n（業務ロジック）"]
  DB["DB 層\nSAP HANA\n（データ管理）"]
  UI --> APP --> DB`}
              />
              <ul>
                <li>
                  <strong>UI（Fiori）</strong> … ロールベースのモダンな画面。従来の SAP GUI 画面も併用されることがあります。
                </li>
                <li>
                  <strong>アプリケーション（S/4HANA）</strong> … 受注処理や仕訳登録などの<strong>業務ロジック</strong>
                </li>
                <li>
                  <strong>DB（HANA）</strong> … インメモリ DB による<strong>高速なデータ管理・分析</strong>
                </li>
              </ul>
              <Dialog speaker="a">
                「画面でボタンを押す」＝UI、「裏でルールチェック」＝アプリ、「結果が残る」＝DB、と分けるとよさそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "製造・その他",
          plainText:
            "PP・PEO・QM・EWM・PS・EAM・TR など。クラウド SaaS は S/4 の外側で専門領域を補完する。",
          content: (
            <>
              <h2>その他のモジュールとクラウド SaaS</h2>
              <p>S/4HANA には、前章の表以外にも次のようなモジュールがあります（案件により導入範囲は異なります）。</p>
              <ul>
                <li>
                  <strong>PEO</strong> … 製造実行（Production Engineering and Operations）
                </li>
                <li>
                  <strong>QM</strong> … 品質管理、<strong>EWM</strong> … 倉庫の高度運用
                </li>
                <li>
                  <strong>PS</strong> … 工事・プロジェクト、<strong>EAM</strong> … 設備・保全
                </li>
                <li>
                  <strong>TR</strong> … 資金・金融取引
                </li>
              </ul>
              <p>
                一方、<strong>SAP Cloud SaaS</strong> は S/4 の“外”で専門機能を担います。例:
              </p>
              <ul>
                <li>Ariba（調達）、Concur（経費）、SuccessFactors（人事）</li>
                <li>Fieldglass、Customer Experience、Integrated Business Planning、Digital Manufacturing</li>
                <li>SAP Analytics Cloud（分析・計画）</li>
              </ul>
              <Callout variant="tip">
                <strong>S/4 ＝ 社内の業務コア</strong>、<strong>SaaS ＝ 周辺の専門クラウド</strong>、と覚えると製品地図が整理しやすいです。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText: "理解度チェック",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="MM は Materials Management（購買・在庫）の略です。"
                question={<strong>「購買・在庫管理」に対応するモジュールは？</strong>}
                options={["SD", "MM", "TR"]}
              />
              <Quiz
                answer={0}
                explanation="Fiori は UI 層。業務ロジックは S/4HANA、アプリの下で HANA DB がデータを保持します。"
                question={<strong>ユーザーが日常操作するモダン UI として説明されるのは？</strong>}
                options={["SAP Fiori", "SAP HANA のみ", "SAP Cloud Connector のみ"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(S4hanaModulesLesson);
