import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  Reveal,
  MermaidDiagram,
  Figure,
  LessonMeta,
  InfoPanel,
  HorizontalLine,
  horizontalLineClasses,
  horizontalLineBorderColor,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";
import type { ReactNode } from "react";
import { cn } from "../../src/lib/cn";

export const lessonMeta = {
  title: "データ結合 — ヘッダと明細をMOVEで一覧に組み立てる",
  meta: "初学者 · 25分",
};

/** 正規化スライド用のサンプルデータ（架空の伝票） */
const DENORM_SAMPLE_ROWS = [
  { belnr: "100001", budat: "2025-04-01", bukrs: "1000", name: "大阪製作所", item: "ノート PC", amount: "158,000" },
  { belnr: "100001", budat: "2025-04-01", bukrs: "1000", name: "大阪製作所", item: "マウス", amount: "2,480" },
  { belnr: "100001", budat: "2025-04-01", bukrs: "1000", name: "大阪製作所", item: "キーボード", amount: "8,900" },
  { belnr: "100002", budat: "2025-04-03", bukrs: "2000", name: "名古屋商事", item: "コピー用紙", amount: "4,200" },
  { belnr: "100002", budat: "2025-04-03", bukrs: "2000", name: "名古屋商事", item: "インク", amount: "6,750" },
] as const;

const NORM_HEADER_ROWS = [
  { belnr: "100001", budat: "2025-04-01", bukrs: "1000", name: "大阪製作所" },
  { belnr: "100002", budat: "2025-04-03", bukrs: "2000", name: "名古屋商事" },
] as const;

const NORM_DETAIL_ROWS = [
  { belnr: "100001", buzei: "1", item: "ノート PC", amount: "158,000" },
  { belnr: "100001", buzei: "2", item: "マウス", amount: "2,480" },
  { belnr: "100001", buzei: "3", item: "キーボード", amount: "8,900" },
  { belnr: "100002", buzei: "1", item: "コピー用紙", amount: "4,200" },
  { belnr: "100002", buzei: "2", item: "インク", amount: "6,750" },
] as const;

/** 1NF 前：1行に繰り返しグループ（スラッシュ区切り） */
const PRE_1NF_ROWS = [
  {
    belnr: "100001",
    budat: "2025-04-01",
    bukrs: "1000",
    name: "大阪製作所",
    items: "ノート PC / マウス / キーボード",
    amounts: "158,000 / 2,480 / 8,900",
  },
  {
    belnr: "100002",
    budat: "2025-04-03",
    bukrs: "2000",
    name: "名古屋商事",
    items: "コピー用紙 / インク",
    amounts: "4,200 / 6,750",
  },
] as const;

/** 3NF 後：ヘッダから会社名をマスタ（T001）へ移した形 */
const NORM3_HEADER_ROWS = [
  { belnr: "100001", budat: "2025-04-01", bukrs: "1000" },
  { belnr: "100002", budat: "2025-04-03", bukrs: "2000" },
] as const;

const T001_MASTER_ROWS = [
  { bukrs: "1000", name: "大阪製作所" },
  { bukrs: "2000", name: "名古屋商事" },
] as const;

/** 3テーブル結合のたとえ用：LOOP 1回目・2回目 */
const LOOP_THREE_TABLE_STEPS = [
  {
    round: 1,
    detailLabel: "明細 1行目",
    detail: "② 明細 … 伝票 100001 · 行 1 · ノート PC · 158,000",
    voucherLookup: "① 伝票 … belnr=100001 → 日付 2025-04-01 · 会社 1000",
    masterLookup: "③ 会社マスタ … bukrs=1000 → 大阪製作所",
    output: "100001 · 2025-04-01 · 大阪製作所 · ノート PC · 158,000",
  },
  {
    round: 2,
    detailLabel: "明細 2行目",
    detail: "② 明細 … 伝票 100001 · 行 2 · マウス · 2,480",
    voucherLookup: "① 伝票 … 同じ 100001（1回目と同じ表紙）",
    masterLookup: "③ 会社マスタ … 同じ 1000 → 大阪製作所",
    output: "100001 · 2025-04-01 · 大阪製作所 · マウス · 2,480",
  },
] as const;

/** 例え話：レシート → 注文品目 → 品目マスタ */
const RECEIPT_ORDER_ROWS = [
  { orderId: "A001", orderDate: "2025-04-01", storeCode: "S001" },
  { orderId: "A002", orderDate: "2025-04-03", storeCode: "S002" },
] as const;

const RECEIPT_LINE_ROWS = [
  { orderId: "A001", line: "1", productCode: "P100", qty: "1", amount: "158,000" },
  { orderId: "A001", line: "2", productCode: "P200", qty: "2", amount: "2,480" },
  { orderId: "A002", line: "1", productCode: "P300", qty: "5", amount: "4,200" },
] as const;

const RECEIPT_ITEM_MASTER_ROWS = [
  { productCode: "P100", productName: "ノート PC", unitPrice: "158,000" },
  { productCode: "P200", productName: "マウス", unitPrice: "1,240" },
  { productCode: "P300", productName: "コピー用紙", unitPrice: "840" },
] as const;

const RECEIPT_OUTPUT_ROWS = [
  { orderId: "A001", orderDate: "2025-04-01", productName: "ノート PC", qty: "1", amount: "158,000" },
  { orderId: "A001", orderDate: "2025-04-01", productName: "マウス", qty: "2", amount: "2,480" },
] as const;

/** 明細から抽出するユニークな伝票（取得イメージ用） */
const UNIQUE_VOUCHER_FROM_DETAIL = [
  { belnr: "100001", detailCount: 3, budat: "2025-04-01" },
  { belnr: "100002", detailCount: 2, budat: "2025-04-03" },
] as const;

/** 3NF 前：ヘッダに会社名を載せると、伝票が増えるほど同じ名称が繰り返される */
const NF3_HEADER_REPEAT_ROWS = [
  { belnr: "100001", budat: "2025-04-01", bukrs: "1000", name: "大阪製作所" },
  { belnr: "100003", budat: "2025-04-05", bukrs: "1000", name: "大阪製作所" },
  { belnr: "100004", budat: "2025-04-07", bukrs: "1000", name: "大阪製作所" },
  { belnr: "100002", budat: "2025-04-03", bukrs: "2000", name: "名古屋商事" },
  { belnr: "100005", budat: "2025-04-10", bukrs: "2000", name: "名古屋商事" },
] as const;

function SampleTable({
  caption,
  variant = "default",
  children,
}: {
  caption: string;
  variant?: "warn" | "ok" | "default";
  children: ReactNode;
}) {
  const captionClass =
    variant === "warn"
      ? "text-amber-800 dark:text-amber-200"
      : variant === "ok"
        ? "text-emerald-800 dark:text-emerald-200"
        : "text-slate-600 dark:text-slate-300";

  return (
    <figure className="not-prose my-4">
      <figcaption className={`mb-2 text-sm font-medium ${captionClass}`}>{caption}</figcaption>
      <div
        className={cn(
          "overflow-x-auto rounded-lg border shadow-sm",
          horizontalLineBorderColor
        )}
      >
        <table className="w-full min-w-lg border-collapse text-left text-sm">{children}</table>
      </div>
    </figure>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      className={cn(
        horizontalLineClasses("strong"),
        "bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  highlight = false,
}: {
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <td
      className={cn(
        horizontalLineClasses("normal"),
        "px-3 py-2",
        highlight && "bg-amber-100/80 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100"
      )}
    >
      {children}
    </td>
  );
}

/** 例え話：3つのバラバラなメモ（レシート・注文品目・品目マスタ） */
function ReceiptAnalogySourcesDiagram() {
  return (
    <figure className="not-prose my-6">
      <figcaption className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        図：バラバラの3つ — レシート（注文）→ 注文品目 → 品目マスタ
      </figcaption>
      <div
        className={cn(
          "overflow-x-auto rounded-xl border p-4 shadow-sm",
          horizontalLineBorderColor,
          "bg-white dark:bg-slate-900/50"
        )}
      >
        <div className="mb-4 flex min-w-[520px] flex-col items-stretch gap-2 md:flex-row md:items-center">
          {[
            { num: "①", title: "レシート（注文）", desc: "注文番号・日付", color: "indigo" },
            { num: "②", title: "注文品目", desc: "内容・個数・金額", color: "sky", highlight: true },
            { num: "③", title: "品目マスタ", desc: "品目コード → 名称", color: "emerald" },
          ].map((box, index) => (
            <div key={box.num} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex-1 rounded-lg border-2 p-3 text-center",
                  box.color === "indigo" && "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10",
                  box.color === "sky" && "border-sky-400 bg-sky-50 dark:border-sky-500 dark:bg-sky-500/10",
                  box.color === "emerald" &&
                    "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-500/10",
                  box.highlight && "ring-2 ring-sky-400 ring-offset-1 dark:ring-offset-slate-900"
                )}
              >
                <div className="text-[10px] font-bold text-slate-500">{box.num}</div>
                <div className="text-sm font-bold">{box.title}</div>
                <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{box.desc}</div>
                {box.highlight && (
                  <div className="mt-2 rounded bg-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-900 dark:bg-sky-500/30 dark:text-sky-100">
                    1行ずつめくる起点
                  </div>
                )}
              </div>
              {index < 2 && (
                <span className="hidden shrink-0 text-xl text-slate-400 md:inline">→</span>
              )}
            </div>
          ))}
        </div>
        <div className="grid min-w-[640px] grid-cols-1 gap-3 [&>figure]:my-0">
          <SampleTable caption="① レシート（注文）" variant="default">
            <thead>
              <tr>
                <Th>注文番号</Th>
                <Th>日付</Th>
              </tr>
            </thead>
            <tbody>
              {RECEIPT_ORDER_ROWS.map((row) => (
                <tr key={row.orderId}>
                  <Td>{row.orderId}</Td>
                  <Td>{row.orderDate}</Td>
                </tr>
              ))}
            </tbody>
          </SampleTable>
          <SampleTable caption="② 注文品目" variant="default">
            <thead>
              <tr>
                <Th>注文番号</Th>
                <Th>明細番号</Th>
                <Th>品目CD</Th>
                <Th>個数</Th>
              </tr>
            </thead>
            <tbody>
              {RECEIPT_LINE_ROWS.map((row, index) => (
                <tr key={`${row.orderId}-${row.line}`}>
                  <Td highlight={index === 0}>{row.orderId}</Td>
                  <Td highlight={index === 0}>{row.line}</Td>
                  <Td highlight={index === 0}>{row.productCode}</Td>
                  <Td highlight={index === 0}>{row.qty}</Td>
                </tr>
              ))}
            </tbody>
          </SampleTable>
          <SampleTable caption="③ 品目マスタ" variant="default">
            <thead>
              <tr>
                <Th>品目CD</Th>
                <Th>名称</Th>
                <Th>単価</Th>
              </tr>
            </thead>
            <tbody>
              {RECEIPT_ITEM_MASTER_ROWS.map((row) => (
                <tr key={row.productCode}>
                  <Td>{row.productCode}</Td>
                  <Td>{row.productName}</Td>
                  <Td>{row.unitPrice}</Td>
                </tr>
              ))}
            </tbody>
          </SampleTable>
        </div>
      </div>
    </figure>
  );
}

/** 例え話：3つをつなげたあとの一覧 */
function ReceiptAnalogyResultDiagram() {
  return (
    <figure className="not-prose my-6">
      <figcaption className="mb-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
        図：つなげたあと — 1品目＝1行の見やすい一覧
      </figcaption>
      <div
        className={cn(
          "rounded-xl border p-4 shadow-sm",
          horizontalLineBorderColor,
          "bg-emerald-50/50 dark:bg-emerald-500/5"
        )}
      >
        <p className="mb-3 text-center text-sm text-slate-600 dark:text-slate-300">
          注文品目1行ごとに → レシートから日付 → 品目マスタから商品名 → <strong>一覧の1行</strong>
        </p>
        <SampleTable caption="✅ 見やすい一覧（1品目＝1行）" variant="ok">
          <thead>
            <tr>
              <Th>注文</Th>
              <Th>日付</Th>
              <Th>商品名</Th>
              <Th>個数</Th>
              <Th>金額</Th>
            </tr>
          </thead>
          <tbody>
            {RECEIPT_OUTPUT_ROWS.map((row) => (
              <tr key={`${row.orderId}-${row.productName}`}>
                <Td>{row.orderId}</Td>
                <Td>{row.orderDate}</Td>
                <Td>{row.productName}</Td>
                <Td>{row.qty}</Td>
                <Td>{row.amount}</Td>
              </tr>
            ))}
          </tbody>
        </SampleTable>
      </div>
    </figure>
  );
}

/** DB から必要分だけ内部テーブルへ載せるイメージ */
function SelectNecessaryDataDiagram() {
  return (
    <figure className="not-prose my-6">
      <figcaption className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        図：明細5行 → 伝票番号は<strong>2種類だけ</strong> → ヘッダも2行だけ取得
      </figcaption>
      <div className="grid grid-cols-1 gap-4">
        <SampleTable caption="② 明細 lt_bseg（先に取得・5行）" variant="default">
          <thead>
            <tr>
              <Th>伝票番号</Th>
              <Th>行</Th>
              <Th>品目</Th>
            </tr>
          </thead>
          <tbody>
            {NORM_DETAIL_ROWS.map((row, index) => {
              const isRepeat = index > 0 && row.belnr === NORM_DETAIL_ROWS[index - 1].belnr;
              return (
                <tr key={`${row.belnr}-${row.buzei}`}>
                  <Td highlight={isRepeat}>{row.belnr}</Td>
                  <Td>{row.buzei}</Td>
                  <Td>{row.item}</Td>
                </tr>
              );
            })}
          </tbody>
        </SampleTable>
        <div className="flex flex-col items-center gap-1 px-2 text-center text-xs font-semibold text-slate-500">
          <span>ユニークな</span>
          <span>伝票番号</span>
          <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-100">
            2件
          </span>
          <span className="text-lg text-indigo-500">↓</span>
        </div>
        <SampleTable caption="① 伝票 lt_bkpf（必要な2行だけ）" variant="ok">
          <thead>
            <tr>
              <Th>伝票番号</Th>
              <Th>日付</Th>
              <Th>明細行数</Th>
            </tr>
          </thead>
          <tbody>
            {UNIQUE_VOUCHER_FROM_DETAIL.map((row) => (
              <tr key={row.belnr}>
                <Td>{row.belnr}</Td>
                <Td>{row.budat}</Td>
                <Td>{row.detailCount} 行</Td>
              </tr>
            ))}
          </tbody>
        </SampleTable>
      </div>
      <p className="mt-3 text-center text-[11px] text-slate-600 dark:text-slate-400">
        同じ伝票番号が明細に何行あっても、ヘッダは<strong>1伝票1行</strong>——DB から取るのもその分だけ
      </p>
    </figure>
  );
}

/** 3テーブル結合：伝票→明細→会社マスタのつながり */
function ThreeTableChainDiagram() {
  return (
    <figure className="not-prose my-6">
      <figcaption className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        図：3テーブル結合 — 伝票 → 明細 → 会社マスタ
      </figcaption>
      <div
        className={cn(
          "overflow-x-auto rounded-xl border p-4 shadow-sm",
          horizontalLineBorderColor,
          "bg-white dark:bg-slate-900/50"
        )}
      >
        <div className="flex min-w-[560px] flex-col items-stretch gap-3 md:flex-row md:items-center">
          <div className="flex-1 rounded-xl border-2 border-indigo-400 bg-indigo-50 p-4 dark:border-indigo-500 dark:bg-indigo-500/10">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
              ① 伝票
            </div>
            <div className="text-sm font-bold text-indigo-950 dark:text-indigo-100">BKPF · lt_bkpf</div>
            <p className="mt-2 text-[11px] text-indigo-900/80 dark:text-indigo-200/80">
              表紙（日付・会社コード）。1枚の伝票に…
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-0.5 px-1 text-center text-[10px] font-semibold text-slate-500">
            <span className="text-lg text-indigo-500">→</span>
            <span>1 : N</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">belnr</span>
          </div>
          <div className="flex-1 rounded-xl border-2 border-sky-400 bg-sky-50 p-4 dark:border-sky-500 dark:bg-sky-500/10">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-300">
              ② 明細
            </div>
            <div className="text-sm font-bold text-sky-950 dark:text-sky-100">BSEG · lt_bseg</div>
            <p className="mt-2 text-[11px] text-sky-900/80 dark:text-sky-200/80">
              品目・金額の行。<strong>LOOP はここ</strong>（1行＝出力1行）
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-0.5 px-1 text-center text-[10px] font-semibold text-slate-500">
            <span className="text-lg text-emerald-500">→</span>
            <span>経由</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">bukrs</span>
          </div>
          <div className="flex-1 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 dark:border-emerald-500 dark:bg-emerald-500/10">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
              ③ 会社マスタ
            </div>
            <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100">T001 · lt_t001</div>
            <p className="mt-2 text-[11px] text-emerald-900/80 dark:text-emerald-200/80">
              会社コード → 会社名（3NF で分けたマスタ）
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-amber-400 bg-amber-50/80 px-3 py-2 text-center text-[11px] text-amber-950 dark:border-amber-500 dark:bg-amber-500/10 dark:text-amber-100">
          <strong>LOOP 1回の結合順：</strong>② 明細1行を机へ →{" "}
          <code>READ TABLE</code> で ① 伝票 → <code>READ TABLE</code> で ③ 会社マスタ → 1行組み立て
        </div>
      </div>
    </figure>
  );
}

/** 3テーブル結合のビジュアル図（伝票→明細→会社マスタ → 机 → 家計簿） */
function JoinFlowDiagram({
  activeDetailIndex = 0,
  loopRound,
  caption,
}: {
  activeDetailIndex?: number;
  loopRound?: number;
  caption: string;
}) {
  const detailRows = NORM_DETAIL_ROWS.slice(0, 3);
  const safeIndex = Math.min(activeDetailIndex, detailRows.length - 1);
  const activeDetail = detailRows[safeIndex];
  const activeHeader = NORM3_HEADER_ROWS.find((row) => row.belnr === activeDetail.belnr);
  const activeMaster = T001_MASTER_ROWS.find((row) => row.bukrs === activeHeader?.bukrs);
  const outputPreview = [
    activeDetail.belnr,
    activeHeader?.budat ?? "—",
    activeMaster?.name ?? "—",
    activeDetail.item,
    activeDetail.amount,
  ].join(" · ");

  const priorOutputRows = detailRows.slice(0, safeIndex).map((row) => {
    const header = NORM3_HEADER_ROWS.find((h) => h.belnr === row.belnr);
    const master = T001_MASTER_ROWS.find((m) => m.bukrs === header?.bukrs);
    return `${row.belnr} · ${header?.budat ?? "—"} · ${master?.name ?? "—"} · ${row.item} · ${row.amount}`;
  });

  return (
    <figure className="not-prose my-6">
      <figcaption className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        {loopRound != null ? `🔄 LOOP ${loopRound} 回目 — ` : ""}
        {caption}
      </figcaption>
      <div
        className={cn(
          "overflow-x-auto rounded-xl border p-4 shadow-sm",
          horizontalLineBorderColor,
          "bg-slate-50/80 dark:bg-slate-900/40"
        )}
      >
        <div className="mb-4 grid grid-cols-1 gap-2 text-center text-[11px] font-semibold sm:grid-cols-3">
          <span className="rounded-md bg-sky-100 px-2 py-1.5 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100">
            ① 取得用フォルダ（触らない）
          </span>
          <span className="rounded-md bg-amber-100 px-2 py-1.5 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100">
            ② 机で1行組み立て
          </span>
          <span className="rounded-md bg-emerald-100 px-2 py-1.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100">
            ③ 家計簿へ追加
          </span>
        </div>

        <div className="mb-3 rounded-md bg-slate-100 px-3 py-2 text-center text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          結合の流れ：① 伝票 ← ② 明細（LOOP） → ③ 会社マスタ（伝票の bukrs 経由）
        </div>

        <div className="grid min-w-[720px] grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-2">
          {/* ① 伝票 */}
          <div className="rounded-lg border-2 border-indigo-400 bg-white p-3 dark:border-indigo-500 dark:bg-slate-800">
            <div className="mb-1 flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-200">① 伝票</span>
              <code className="text-[10px] text-slate-500">lt_bkpf</code>
            </div>
            <div className="mb-2 rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-900 dark:bg-indigo-500/25 dark:text-indigo-100">
              READ TABLE ①
            </div>
            {NORM3_HEADER_ROWS.map((row) => {
              const isMatch = row.belnr === activeDetail.belnr;
              return (
                <div
                  key={row.belnr}
                  className={cn(
                    "mb-1 rounded border px-2 py-1 text-[10px] last:mb-0",
                    isMatch
                      ? "border-indigo-500 bg-indigo-100 font-semibold ring-2 ring-indigo-400 dark:border-indigo-400 dark:bg-indigo-500/20"
                      : "border-slate-200 bg-slate-50 opacity-50 dark:border-slate-600 dark:bg-slate-900"
                  )}
                >
                  {row.belnr} · {row.budat} · {row.bukrs}
                </div>
              );
            })}
            <div className="mt-2 text-[10px] font-bold text-indigo-800 dark:text-indigo-200">鍵：belnr</div>
          </div>

          <div className="flex flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
            <span className="text-base">←</span>
            <span>belnr</span>
          </div>

          {/* ② 明細 */}
          <div className="rounded-lg border-2 border-sky-400 bg-white p-3 dark:border-sky-500 dark:bg-slate-800">
            <div className="mb-1 flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-sky-800 dark:text-sky-200">② 明細</span>
              <code className="text-[10px] text-slate-500">lt_bseg</code>
            </div>
            <div className="mb-2 rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-900 dark:bg-sky-500/25 dark:text-sky-100">
              LOOP（起点）
            </div>
            {detailRows.map((row, index) => (
              <div
                key={`${row.belnr}-${row.buzei}`}
                className={cn(
                  "mb-1 rounded border px-2 py-1 text-[10px] leading-snug last:mb-0",
                  index === safeIndex
                    ? "border-sky-500 bg-sky-100 font-semibold ring-2 ring-sky-400 dark:border-sky-400 dark:bg-sky-500/20"
                    : index < safeIndex
                      ? "border-slate-200 bg-slate-100 text-slate-400 line-through dark:border-slate-600 dark:bg-slate-900"
                      : "border-slate-200 bg-slate-50 opacity-50 dark:border-slate-600 dark:bg-slate-900"
                )}
              >
                {row.belnr}-{row.buzei} {row.item}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            <span className="text-base">→</span>
            <span>bukrs</span>
          </div>

          {/* ③ 会社マスタ */}
          <div className="rounded-lg border-2 border-emerald-400 bg-white p-3 dark:border-emerald-500 dark:bg-slate-800">
            <div className="mb-1 flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">③ 会社マスタ</span>
              <code className="text-[10px] text-slate-500">lt_t001</code>
            </div>
            <div className="mb-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-500/25 dark:text-emerald-100">
              READ TABLE ②
            </div>
            {T001_MASTER_ROWS.map((row) => {
              const isMatch = row.bukrs === activeHeader?.bukrs;
              return (
                <div
                  key={row.bukrs}
                  className={cn(
                    "mb-1 rounded border px-2 py-1 text-[10px] last:mb-0",
                    isMatch
                      ? "border-emerald-500 bg-emerald-100 font-semibold ring-2 ring-emerald-400 dark:border-emerald-400 dark:bg-emerald-500/20"
                      : "border-slate-200 bg-slate-50 opacity-50 dark:border-slate-600 dark:bg-slate-900"
                  )}
                >
                  {row.bukrs} · {row.name}
                </div>
              );
            })}
            <div className="mt-2 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">鍵：bukrs</div>
          </div>
        </div>

        <div className="my-3 flex flex-col items-center gap-0.5 text-center text-[11px] text-slate-600 dark:text-slate-400">
          <span className="text-base leading-none text-slate-400">↓</span>
          <span>3テーブル分を机に並べ、MOVE で1行にまとめる</span>
        </div>

        <div className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50/80 p-3 dark:border-amber-500 dark:bg-amber-500/10">
          <div className="mb-2 text-xs font-bold text-amber-900 dark:text-amber-100">🗃️ 机（作業領域）</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded border border-indigo-300 bg-white p-2 text-[10px] dark:bg-slate-800">
              <code className="text-[9px] text-indigo-700">ls_bkpf</code>
              <div className="mt-0.5 text-[9px] text-indigo-600">① 伝票</div>
              <div className="mt-1 font-medium">{activeHeader?.budat ?? "—"}</div>
              <div>{activeHeader?.bukrs ?? "—"}</div>
            </div>
            <div className="rounded border border-sky-300 bg-white p-2 text-[10px] dark:bg-slate-800">
              <code className="text-[9px] text-sky-700">ls_bseg</code>
              <div className="mt-0.5 text-[9px] text-sky-600">② 明細</div>
              <div className="mt-1 font-medium">{activeDetail.item}</div>
              <div>{activeDetail.amount}</div>
            </div>
            <div className="rounded border border-emerald-300 bg-white p-2 text-[10px] dark:bg-slate-800">
              <code className="text-[9px] text-emerald-700">ls_t001</code>
              <div className="mt-0.5 text-[9px] text-emerald-600">③ 会社マスタ</div>
              <div className="mt-1 font-medium">{activeMaster?.name ?? "—"}</div>
            </div>
          </div>
          <div className="my-2 text-center text-sm text-amber-700 dark:text-amber-300">↓ 組み立て</div>
          <div className="rounded border-2 border-amber-500 bg-white px-3 py-2 text-center text-[11px] font-semibold dark:bg-slate-800">
            <code className="text-[10px]">ls_out</code> → {outputPreview}
          </div>
        </div>

        <div className="my-3 text-center text-[11px] text-slate-600 dark:text-slate-400">
          <span className="text-base leading-none text-emerald-600">↓</span>{" "}
          <strong>APPEND</strong> で家計簿へ1行追加 → <strong>CLEAR</strong> で机を空に → 次の明細へ
        </div>

        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50/80 p-3 dark:border-emerald-600 dark:bg-emerald-500/10">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">📒 家計簿（出力用）</span>
            <code className="text-[10px] text-slate-500">lt_out</code>
          </div>
          {[...priorOutputRows, outputPreview].map((line, index) => (
            <div
              key={line}
              className={cn(
                "mb-1 rounded border px-2 py-1 text-[10px] last:mb-0",
                index === priorOutputRows.length
                  ? "border-emerald-500 bg-emerald-100 font-semibold dark:border-emerald-400 dark:bg-emerald-500/20"
                  : "border-emerald-200 bg-white dark:border-emerald-700 dark:bg-slate-800"
              )}
            >
              {index + 1}. {line}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/** 3テーブル結合の処理順（LOOP + READ×2） */
function ThreeTableJoinOverviewDiagram() {
  return (
    <figure className="not-prose my-6">
      <figcaption className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        図：LOOP 1回あたり — ②明細 → ①伝票 → ③会社マスタ
      </figcaption>
      <div className="space-y-3">
        {[
          {
            step: "LOOP",
            table: "② 明細 lt_bseg",
            action: "1行ずつ机へ（ls_bseg）",
            color: "sky",
          },
          {
            step: "READ ①",
            table: "① 伝票 lt_bkpf",
            action: "明細の belnr で1枚 → ls_bkpf",
            color: "indigo",
          },
          {
            step: "READ ②",
            table: "③ 会社マスタ lt_t001",
            action: "伝票の bukrs で1枚 → ls_t001",
            color: "emerald",
          },
          {
            step: "組み立て",
            table: "①＋②＋③ → ls_out",
            action: "MOVE → APPEND → CLEAR",
            color: "amber",
          },
        ].map((item, index) => (
          <div key={item.step} className="flex items-stretch gap-3">
            <div
              className={cn(
                "flex w-14 shrink-0 flex-col items-center",
                index < 3 && "pb-1"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                  item.color === "sky" && "bg-sky-500",
                  item.color === "indigo" && "bg-indigo-500",
                  item.color === "emerald" && "bg-emerald-500",
                  item.color === "amber" && "bg-amber-500"
                )}
              >
                {index + 1}
              </span>
              {index < 3 && <div className="mt-1 w-0.5 flex-1 bg-slate-300 dark:bg-slate-600" />}
            </div>
            <div
              className={cn(
                "flex-1 rounded-lg border p-3 text-xs",
                item.color === "sky" && "border-sky-300 bg-sky-50 dark:border-sky-600 dark:bg-sky-500/10",
                item.color === "indigo" && "border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-500/10",
                item.color === "emerald" &&
                  "border-emerald-300 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-500/10",
                item.color === "amber" && "border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-500/10"
              )}
            >
              <div className="font-bold">{item.table}</div>
              <div className="mt-1 text-slate-600 dark:text-slate-300">{item.action}</div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function CombineDataLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "08-combine-data", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "複数データをまとめる\nバラバラの情報を1行ずつ見やすい一覧に整える章。\n⏱ 25分 / 初学者\n・取得用と出力用の棚を分ける\n・MOVE / APPEND / CLEAR\n・3テーブル結合（伝票→明細→会社マスタ）\nBちゃん：今回は難しそう。\n先生：3つ＋3テーブル結合。棚を分ける→組み立て→追加→片付け。",
          content: (
            <>
              <hgroup>
                <h1>複数データをまとめる</h1>
                <p>
                  バラバラにある「お店の情報（ヘッダ）」と「買った品物（明細）」を、
                  <strong>1行ずつ見やすい一覧</strong>に整える方法を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>取得用と出力用の「棚」を分ける</li>
                <li>データを移す命令（<code>MOVE</code> / <code>MOVE-CORRESPONDING</code>）</li>
                <li>1行ずつ追加・片付け（<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>）</li>
                <li>
                  <strong>3テーブル結合</strong>（伝票 → 明細 → 会社マスタ）を <code>LOOP</code> で組み立てる
                </li>
              </ul>
              <Dialog speaker="b">
                前の章まででなんとかついてきたけど…「ヘッダと明細を合体」とか、今回は難しそうです。
              </Dialog>
              <Dialog speaker="teacher">
                正直、この章は難易度が上がります。でも覚えることは<strong>3つだけ</strong>です。
                「棚を分ける → 1行を組み立てる → 追加して片付ける」。英語の命令名は後からで大丈夫。
              </Dialog>
              <Callout variant="tip">
                この章の核心：<strong>組み立て → APPEND → CLEAR</strong> のリズム。
                たとえで言えば「通帳コピーのフォルダから1枚取る → 家計簿へ1行追加 → 机を空にする」を繰り返すだけです。
              </Callout>
              <Dialog speaker="b">
                3つだけなら、深呼吸して挑戦します。通帳コピーを見ながら、家計簿に1行ずつ書いていく作業、ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "領収書整理のたとえ",
          plainText:
            "バラバラの情報を、1枚の表にまとめる\nBちゃん：なんで最初から1枚の表じゃない？合体、面倒…\n先生：まずバラバラの状態を図で確認。\n図：ヘッダと明細を突き合わせ1行ずつの一覧に。\n先生：DBは役割ごとに分けて保存。整えるのはプログラムの仕事。\nBちゃん：レシートの日付・店名と商品・金額を1行に？\n先生：その通り。次のスライドで正規化として理由を整理。",
          content: (
            <>
              <h2>バラバラの情報を、1枚の表にまとめる</h2>
              <p>
                「お店の情報（ヘッダ）」と「買った品物（明細）」が別々にあると見づらいですよね。
                これらを突き合わせて、<strong>1行ずつ意味が分かる一覧</strong>にするのが今回のテーマです。
              </p>
              <Dialog speaker="b">
                なんで最初から1枚の表になっていないんですか？わざわざ合体させるの、面倒に感じます…。
              </Dialog>
              <Dialog speaker="teacher">
                いい質問です。まず「バラバラの状態」がどう見えるか、図で確認しましょう。
              </Dialog>
              <Figure
                src="image/08-receipt-organize.webp"
                alt="左：お店情報のカード（ヘッダ）と品物リストのカード（明細）がバラバラに散らばっている。右：それらを突き合わせて1行ずつにまとめた整然とした一覧表。"
                caption="ヘッダ（お店）と明細（品物）を突き合わせ、1行で意味が分かる一覧に整える"
                kind="concept"
              />
              <Dialog speaker="teacher">
                データベースでは「見出し用」と「中身用」に<strong>役割ごとに分けて保存</strong>します。
                会計では伝票ヘッダ（BKPF）と明細（BSEG）が別テーブルです。
                見やすく整えるのは、プログラム側の仕事——今回学ぶことです。
              </Dialog>
              <Dialog speaker="b">
                レシートの「日付・店名」と「商品名・金額」を1行に並べる感じ、ですか？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。1つの伝票に明細が3行あれば、出力は<strong>3行</strong>になります。
                ヘッダの情報（日付・会社など）は各行に繰り返し載せて、バラバラのまま使えない状態から解放します。
              </Dialog>
              <Dialog speaker="b">
                分けて保存する理由…次のスライドで<strong>正規化</strong>として整理するんですね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。理由が分かると、今回の「合体」の意味もはっきりします。
              </Dialog>
            </>
          ),
        },
        {
          title: "正規化：なぜ分けて保存するか",
          plainText:
            "正規化：なぜ分けて保存するか\nBちゃん：正規化って何？\n先生：同じ情報の重複を減らすため、役割ごとに表を分けること。\n表：正規化前は日付・会社が3行重複（黄色）。正規化後はヘッダ2行＋明細5行。\nCallout：正規化＝保存時は分ける／今章＝表示用に合体。\nAくん：別途正規化を勉強中。ヘッダと明細に分けるのは第何正規形？\n先生：ざっくり第二正規形（2NF）。伝票番号だけで決まる情報をヘッダ表へ。\nBちゃん：数字は難しいけど「伝票番号だけで決まるものはヘッダへ」で覚えます。",
          content: (
            <>
              <h2>正規化：なぜ分けて保存するか</h2>
              <Dialog speaker="b">
                前のスライドの続きですけど…<strong>正規化（せいきか）</strong>って、具体的に何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                ひと言で言うと、<strong>同じ情報の重複を減らす</strong>ために、
                役割ごとに表を分けて保存することです。まず「分けないとどうなるか」から見てみましょう。
              </Dialog>

              <h3>1枚の大きな表だと…</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                架空の伝票データです。同じ伝票番号なのに、日付・会社が<strong>行ごとに繰り返し</strong>書かれています（黄色＝重複）。
              </p>
              <SampleTable caption="❌ 正規化前：すべて1枚の表に書く" variant="warn">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                    <Th>商品</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {DENORM_SAMPLE_ROWS.map((row, i) => {
                    const isRepeat = i > 0 && row.belnr === DENORM_SAMPLE_ROWS[i - 1].belnr;
                    return (
                      <tr key={`${row.belnr}-${row.item}`}>
                        <Td highlight={isRepeat}>{row.belnr}</Td>
                        <Td highlight={isRepeat}>{row.budat}</Td>
                        <Td highlight={isRepeat}>{row.bukrs}</Td>
                        <Td highlight={isRepeat}>{row.name}</Td>
                        <Td>{row.item}</Td>
                        <Td>{row.amount}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </SampleTable>
              <Dialog speaker="b">
                黄色のところ、同じ内容が何度もコピーされてますね…。
                伝票 <code>100001</code> だけで日付が3回も！
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。伝票1件に明細3行あると、日付・会社も<strong>3回同じ内容</strong>が並びます。
                会社名を直すときも、同じ伝票の行を<strong>全部</strong>更新しないといけません。
              </Dialog>

              <h3>正規化すると…</h3>
              <Dialog speaker="b">
                じゃあ、どうすればいいんですか？
              </Dialog>
              <Dialog speaker="teacher">
                同じデータを<strong>ヘッダ表</strong>と<strong>明細表</strong>に分けます。
                日付・会社は伝票ごとに1回だけ。商品・金額は明細側だけ——こうするのが正規化です。
              </Dialog>
              <SampleTable caption="✅ 正規化後：ヘッダ表（BKPF イメージ）" variant="ok">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_HEADER_ROWS.map((row) => (
                    <tr key={row.belnr}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.budat}</Td>
                      <Td>{row.bukrs}</Td>
                      <Td>{row.name}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="b">
                ヘッダ表、<strong>2行だけ</strong>！日付も会社名も1回ずつですね。
              </Dialog>
              <SampleTable caption="✅ 正規化後：明細表（BSEG イメージ）" variant="ok">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>行</Th>
                    <Th>商品</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_DETAIL_ROWS.map((row) => (
                    <tr key={`${row.belnr}-${row.buzei}`}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.buzei}</Td>
                      <Td>{row.item}</Td>
                      <Td>{row.amount}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                明細側には商品・金額だけ。会社名を直すときも、ヘッダ表の<strong>1か所</strong>を直せばOKです。
              </Dialog>

              <Callout variant="tip">
                <strong>正規化</strong>＝保存するときは分ける（重複を減らす）。
                <strong>今回の章</strong>＝帳票・一覧用に、プログラムで<strong>一時的に合体</strong>する。
                保存の設計と、表示用の加工は別の話です。
              </Callout>
              <Dialog speaker="a">
                実は今、別途正規化の勉強をしているんですが…
                さっきの「ヘッダ表と明細表に分ける」は、<strong>第何正規形</strong>に当たりますか？
              </Dialog>
              <Dialog speaker="teacher">
                ざっくり言うと<strong>第二正規形（2NF）</strong>です。
                明細の行キー（伝票番号＋行）の<strong>一部だけ</strong>——伝票番号——で決まる情報（日付・会社）は、
                別のヘッダ表へ移します。「部分関数従属を解消する」という整理です。
              </Dialog>
              <Dialog speaker="b">
                第1？第2？…数字はまだピンときませんけど、
                「<strong>伝票番号だけで決まるものはヘッダへ</strong>」——これなら覚えられそうです。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。DBは<strong>正規化して保存</strong>し、帳票ではプログラムで<strong>合体</strong>する——
                今回学ぶのは後半です。第1〜第3正規形の定義は、<strong>次の参考スライド</strong>にまとめてあります。
              </Dialog>
              <Dialog speaker="b">
                だから「面倒に感じる結合（合体）」は、保存をきれいにした<strong>あと</strong>の作業なんですね。
                理由が分かると、少しだけやる気が出てきました。
              </Dialog>
            </>
          ),
        },
        {
          title: "参考：第1〜第3正規形",
          plainText:
            "参考：第1〜第3正規形\nInfoPanel：本コース必須ではない。理解を深めたい人向けの補足。時間がなければスキップ可。\n3NF：会社名はbukrsだけで決まるのにヘッダにコピー→更新漏れ・表記ゆれ。T001に1行だけ。\n先生：社名変更は3NF前はヘッダ全行、3NF後はT001の1行。\nAくん：会社名は伝票の属性ではなく会社コードの属性。",
          content: (
            <>
              <h2>参考：第1〜第3正規形</h2>
              <InfoPanel
                title="このスライドについて"
                variant="reference"
                lead={
                  <>
                    <strong>本コースの必須内容ではありません。</strong>
                    前のスライドで触れた「なぜヘッダと明細が分かれているか」を、
                    理解を深めたい人向けに補足しています。
                  </>
                }
              >
                <ul>
                  <li>第1〜第3正規形の機械的な整理（参考）</li>
                  <li>
                    研修で<strong>必須</strong>なのは、次スライド以降の「合体」（
                    <code>MOVE</code> / <code>APPEND</code> など）です
                  </li>
                  <li>時間がなければ、このスライドは<strong>スキップして大丈夫</strong>です</li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                前のスライドで触れた第1〜第3正規形を、<strong>同じ架空伝票データ</strong>（
                <code>100001</code> / <code>100002</code>）で順番に整理します。
                各段階は Before → After の表で見て、<strong>0NF → 1NF → 2NF → 3NF</strong> と
                機械的に進めていきましょう。
              </Dialog>
              <Dialog speaker="a">
                同じデータが段階ごとに「表の数」と「列の持ち方」が変わっていく、という整理ですね。
                前のスライドの BKPF / BSEG の話が、ここで番号付きのルールとしてつながります。
              </Dialog>

              <h3>第1正規形（1NF）</h3>
              <Dialog speaker="teacher">
                第1正規形の条件は<strong>繰り返しグループがない</strong>こと——1セルに1値です。
                操作は単純で、1セルに並べた複数値を<strong>行に展開</strong>します。
              </Dialog>
              <SampleTable caption="❌ 正規化前（0NF）：1行に繰り返しグループ" variant="warn">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                    <Th>商品（繰り返し）</Th>
                    <Th>金額（繰り返し）</Th>
                  </tr>
                </thead>
                <tbody>
                  {PRE_1NF_ROWS.map((row) => (
                    <tr key={row.belnr}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.budat}</Td>
                      <Td>{row.bukrs}</Td>
                      <Td>{row.name}</Td>
                      <Td highlight>{row.items}</Td>
                      <Td highlight>{row.amounts}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                黄色の列は<strong>繰り返しグループ</strong>です。1つのセルに複数の商品・金額が
                スラッシュ区切りで詰め込まれており、1NF を満たしていません。
              </Dialog>
              <SampleTable caption="✅ 1NF 後：1商品＝1行に展開（まだ1枚の表）" variant="ok">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>行</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                    <Th>商品</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_DETAIL_ROWS.map((row) => {
                    const header = NORM_HEADER_ROWS.find((h) => h.belnr === row.belnr)!;
                    return (
                      <tr key={`${row.belnr}-${row.buzei}`}>
                        <Td>{row.belnr}</Td>
                        <Td>{row.buzei}</Td>
                        <Td>{header.budat}</Td>
                        <Td>{header.bukrs}</Td>
                        <Td>{header.name}</Td>
                        <Td>{row.item}</Td>
                        <Td>{row.amount}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                展開後は1商品＝1行になり、1NF を満たします。ただし日付・会社は行ごとに
                <strong>まだ重複</strong>しています——次の第2正規形で解消します。
              </Dialog>
              <Dialog speaker="a">
                1NF の判定はシンプルで、「1セルに複数値が入っていたら行にばらす」。
                表の行数は増えますが、列の意味は1つに固定されます。重複列はまだ残る——
                それは 2NF の問題、と切り分けられます。
              </Dialog>

              <HorizontalLine spacing="lg" />

              <h3>第2正規形（2NF）</h3>
              <Dialog speaker="teacher">
                第2正規形は、1NF に加えて<strong>部分関数従属がない</strong>状態です。
                複合キー（伝票番号＋行）の<strong>一部だけ</strong>で決まる項目は、別表へ移します。
              </Dialog>
              <SampleTable caption="❌ 2NF 前：日付・会社が行ごとに重複（1NF の1枚表）" variant="warn">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>行</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                    <Th>商品</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_DETAIL_ROWS.map((row, i) => {
                    const header = NORM_HEADER_ROWS.find((h) => h.belnr === row.belnr)!;
                    const prev = i > 0 ? NORM_DETAIL_ROWS[i - 1] : null;
                    const isRepeat = prev?.belnr === row.belnr;
                    return (
                      <tr key={`nf2-before-${row.belnr}-${row.buzei}`}>
                        <Td highlight={isRepeat}>{row.belnr}</Td>
                        <Td>{row.buzei}</Td>
                        <Td highlight={isRepeat}>{header.budat}</Td>
                        <Td highlight={isRepeat}>{header.bukrs}</Td>
                        <Td highlight={isRepeat}>{header.name}</Td>
                        <Td>{row.item}</Td>
                        <Td>{row.amount}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                主キーは「伝票番号＋行」なのに、日付・会社は<strong>伝票番号だけ</strong>で決まります。
                これが<strong>部分関数従属</strong>です。黄色の重複がそのサインです。
              </Dialog>
              <SampleTable caption="✅ 2NF 後：ヘッダ表 BKPF（伝票番号だけで決まる情報）" variant="ok">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_HEADER_ROWS.map((row) => (
                    <tr key={`nf2-h-${row.belnr}`}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.budat}</Td>
                      <Td>{row.bukrs}</Td>
                      <Td>{row.name}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <SampleTable caption="✅ 2NF 後：明細表 BSEG（行ごとの情報のみ）" variant="ok">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>行</Th>
                    <Th>商品</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_DETAIL_ROWS.map((row) => (
                    <tr key={`nf2-d-${row.belnr}-${row.buzei}`}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.buzei}</Td>
                      <Td>{row.item}</Td>
                      <Td>{row.amount}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                伝票番号だけで決まる情報（日付・会社）を<strong>BKPF（ヘッダ）</strong>へ、
                行ごとの情報（商品・金額）を<strong>BSEG（明細）</strong>へ分けました。
                前のスライドで見た分割は、主にこの第2正規形の例です。
              </Dialog>
              <Dialog speaker="a">
                2NF は「主キー＝伝票番号＋行」なのに、日付などが<strong>伝票番号だけ</strong>で決まる列を
                別表へ逃がす操作、と理解しました。黄色の重複は、その列が明細キーに属していないサインです。
              </Dialog>

              <HorizontalLine spacing="lg" />

              <h3>第3正規形（3NF）</h3>
              <Dialog speaker="teacher">
                第3正規形は、2NF に加えて<strong>推移的関数従属がない</strong>状態です。
                「A → B → C」と間接的に決まる項目（C）を、B を主キーとする別表——
                マスタ——へ移します。
              </Dialog>
              <Dialog speaker="teacher">
                ここで重要なのは<strong>「なぜ分けるのか」</strong>です。2NF 後のヘッダに
                会社コード（<code>bukrs</code>）と会社名の<strong>両方</strong>を載せ続けると、
                伝票が増えるほど次の問題が起きやすくなります。
              </Dialog>
              <SampleTable caption="❌ 3NF 前：ヘッダに会社名を載せ続けると…" variant="warn">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                  </tr>
                </thead>
                <tbody>
                  {NF3_HEADER_REPEAT_ROWS.map((row) => (
                      <tr key={`nf3-repeat-${row.belnr}`}>
                        <Td>{row.belnr}</Td>
                        <Td>{row.budat}</Td>
                        <Td>{row.bukrs}</Td>
                        <Td highlight>{row.name}</Td>
                      </tr>
                    ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                会社名（黄色）は、伝票番号ではなく<strong>会社コードだけ</strong>で決まります。
                それなのにヘッダごとにコピーされるため、①<strong>同じ名称の無駄な繰り返し</strong>、
                ②<strong>社名変更のたびに該当伝票を全部更新</strong>、
                ③<strong>表記ゆれ（「大阪製作所」と「大阪製作所　」など）の混在</strong>——
                の3つが起きやすくなります。
              </Dialog>
              <Dialog speaker="teacher">
                例えば <code>1000</code> の会社名を「大阪製作所株式会社」に直すとき、
                3NF 前ならヘッダ<strong>3行すべて</strong>を書き換えます。
                3NF 後なら T001 の<strong>1行だけ</strong>直せば、以降の参照はすべて新しい名称になります。
              </Dialog>
              <SampleTable caption="❌ 3NF 前：1行のヘッダ構造（問題の整理）" variant="warn">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM_HEADER_ROWS.map((row) => (
                    <tr key={`nf3-before-${row.belnr}`}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.budat}</Td>
                      <Td>{row.bukrs}</Td>
                      <Td highlight>{row.name}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                構造としては「伝票番号 → 会社コード → 会社名」という<strong>推移的関数従属</strong>です。
                会社名は伝票の主キーから直接は決まらず、<code>bukrs</code> を経由して決まります。
                だから会社名はヘッダではなく、<code>bukrs</code> を主キーとする<strong>別表</strong>へ移します。
              </Dialog>
              <SampleTable caption="✅ 3NF 後：ヘッダはコードのみ" variant="ok">
                <thead>
                  <tr>
                    <Th>伝票番号</Th>
                    <Th>日付</Th>
                    <Th>会社</Th>
                  </tr>
                </thead>
                <tbody>
                  {NORM3_HEADER_ROWS.map((row) => (
                    <tr key={`nf3-h-${row.belnr}`}>
                      <Td>{row.belnr}</Td>
                      <Td>{row.budat}</Td>
                      <Td>{row.bukrs}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <SampleTable caption="✅ 3NF 後：会社マスタ T001（会社名はここで管理）" variant="ok">
                <thead>
                  <tr>
                    <Th>会社</Th>
                    <Th>会社名</Th>
                  </tr>
                </thead>
                <tbody>
                  {T001_MASTER_ROWS.map((row) => (
                    <tr key={row.bukrs}>
                      <Td>{row.bukrs}</Td>
                      <Td>{row.name}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                会社名を <strong>T001（マスタ）</strong> へ移し、ヘッダは会社コードだけを持ちます。
                明細表（BSEG）は 2NF 後と同じ形です。名前が必要なときは <code>bukrs</code> で T001 を参照します。
              </Dialog>
              <Dialog speaker="a">
                3NF で分ける理由は、「会社名は伝票の属性ではなく、会社コードの属性」だからですね。
                ヘッダに名称を残すと更新箇所が伝票数に比例して増えます。
                T001 に1か所だけ持てば、名称変更・表記統一・重複削減をまとめて扱えます。
              </Dialog>

              <HorizontalLine spacing="lg" />

              <h3>一覧（覚え方）</h3>
              <SampleTable caption="第1〜第3正規形 早見表" variant="default">
                <thead>
                  <tr>
                    <Th>正規形</Th>
                    <Th>満たす条件</Th>
                    <Th>機械的操作（一言）</Th>
                    <Th>会計（SAP）での例</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td><strong>1NF</strong></Td>
                    <Td>繰り返しグループなし</Td>
                    <Td>繰り返しを<strong>行に展開</strong></Td>
                    <Td>品目を BSEG の行として持つ</Td>
                  </tr>
                  <tr>
                    <Td><strong>2NF</strong></Td>
                    <Td>1NF ＋ 部分関数従属なし</Td>
                    <Td>キーの一部だけで決まる項目を<strong>別表へ</strong></Td>
                    <Td>日付・会社を BKPF へ</Td>
                  </tr>
                  <tr>
                    <Td><strong>3NF</strong></Td>
                    <Td>2NF ＋ 推移的関数従属なし</Td>
                    <Td>間接的に決まる項目を<strong>マスタへ</strong></Td>
                    <Td>会社名を T001 へ</Td>
                  </tr>
                </tbody>
              </SampleTable>
              <Dialog speaker="teacher">
                まとめると、同じ伝票データが <strong>0NF → 1NF → 2NF → 3NF</strong> と段階的に
                分かれていきます。SAP では BKPF / BSEG 分割が <strong>2NF</strong>、
                T001 参照が <strong>3NF</strong> に相当します。
                本研修で学ぶ「合体」は、この正規化を<strong>帳票用に一時的に戻す</strong>作業です。
              </Dialog>
              <Dialog speaker="a">
                保存時は「分ける」、帳票では「戻す」——方向が逆なだけで、どちらも同じキー（
                <code>belnr</code> など）でつながります。次のスライド以降の MOVE / APPEND は、
                この 3NF まで分けた表を<strong>読みやすい1行</strong>に再構成する処理、と捉えれば混乱しにくいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "複数テーブルの使い分け",
          plainText:
            "用途ごとに「棚」を分ける\n【解説】取得用と出力用を分ける／DBは最初に一度／Calloutでたとえ\n【例】lt_bkpf・lt_bseg・lt_out と ls_bkpf・ls_bseg・ls_out／ty_out＝型\nBちゃん：lt_が3つも？→取得用2＋出力用1。\nBちゃん：ty_out と lt_out の違いは？→型 vs 内部テーブル。\n先生：取得用は触らない、出力用へAPPEND。",
          content: (
            <>
              <h2>用途ごとに「棚」を分ける</h2>

              <h3>解説</h3>
              <p>
                この章の大きな流れは、<strong>DB からデータを取ってくる</strong> →
                <strong>メモリ上で読む</strong> →
                <strong>加工する</strong> →
                <strong>出力用の表へ順番に書き込む</strong>、です。
              </p>
              <p>
                <strong>取得用（生データ）</strong>と<strong>出力用（整えた一覧）</strong>を分けると、
                頭が整理されるうえ、<strong>DB への読み取り回数も減らせます</strong>。
                第6章の <code>SELECT</code> は<strong>最初に必要な分だけ</strong>実行し、
                そのあとは DB へ行かずメモリ上で読む——明細1件ごとに <code>SELECT</code> し直すより、
                はるかに効率的で安全です。
              </p>
              <Callout variant="note">
                たとえ：<strong>通帳コピーのフォルダ</strong>（そのまま保管・触らない）と
                <strong>家計簿</strong>（<strong>一枚の表</strong>に一行ずつ追加していく）を分けるイメージです。
                フォルダからは<strong>1枚ずつ</strong>机へ取り出し、家計簿へは<strong>1行ずつ</strong>追加します。
              </Callout>
              <Dialog speaker="b">
                つまり、DB から一度取ってきて、読んで、加工して、新しい表に書き込む——
                読みに行く回数を減らすのも、分ける目的のひとつですよね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。取得用は<strong>読むだけ</strong>、出力用は<strong>作るだけ</strong>——
                役割を混ぜないのがポイントです。
              </Dialog>
              <Dialog speaker="a">
                取得用を残したまま整形できるので、不具合の調査や仕様変更にも強い。
                加工中に DB アクセスが増えない点も、性能面で大きいです。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="06-select-from-db"
                slide={5}
                label="第6章: SELECT の基本を復習する"
                variant="back"
                className="mb-4"
              />
              <Dialog speaker="b">
                わざわざ分ける必要ありますか？ 取得用テーブルを直接書き換えちゃダメなんですか？
              </Dialog>
              <Dialog speaker="teacher">
                ダメではないのですが、<strong>危ない</strong>です。取得用を書き換えると「DB から取った当時の値」が失われ、
                不具合のときに「元は何だったか」を追えなくなります。
                原本（取得用）と整形結果（出力用）は分けておくほうが安全です。
              </Dialog>
              <Dialog speaker="stumble">
                取得用データを直接書き換えると、元データが汚れて原因調査が難しくなります。
                「<strong>読む用（取得用）</strong>」と「<strong>作る用（出力用）</strong>」は必ず分けましょう。
              </Dialog>

              <h3>この章で使う変数</h3>
              <p>
                上の解説を、BKPF/BSEG を組み合わせる章では次の6変数で実装します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA lt_bkpf TYPE TABLE OF bkpf.   " ヘッダ取得用（内部テーブル・複数行）
DATA lt_bseg TYPE TABLE OF bseg.   " 明細取得用（内部テーブル・複数行）
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（内部テーブル・複数行）

DATA ls_bkpf TYPE bkpf.            " ヘッダ1行（作業領域・構造）
DATA ls_bseg TYPE bseg.            " 明細1行（作業領域・構造）
DATA ls_out  TYPE ty_out.          " 出力1行（作業領域・構造）`}
              />
              <ul>
                <li>
                  <code>lt_bkpf</code> … ヘッダ（<code>bkpf</code>）の<strong>取得用</strong>内部テーブル。DB から取った行を保持（書き換えない）
                </li>
                <li>
                  <code>lt_bseg</code> … 明細（<code>bseg</code>）の<strong>取得用</strong>内部テーブル。同上
                </li>
                <li>
                  <code>lt_out</code> … <strong>出力用</strong>内部テーブル。<code>APPEND</code> で行を順番に追加
                </li>
                <li>
                  <code>ls_bkpf</code> / <code>ls_bseg</code> … 取得用データの<strong>1行</strong>を扱う作業領域（<code>LOOP</code> / <code>READ TABLE</code> の受け皿）
                </li>
                <li>
                  <code>ls_out</code> … 出力行を<strong>1行ずつ</strong>組み立てる作業領域。完成したら <code>APPEND</code> して <code>CLEAR</code>
                </li>
                <li>
                  <code>ty_out</code> … 出力行の<strong>型</strong>（<code>TYPES</code> で定義）。<code>lt_out</code> / <code>ls_out</code> の行の形
                </li>
              </ul>
              <Dialog speaker="b">
                変が6個も並んでて圧倒されます…。とくに <code>lt_</code> だけで3つ——
                なんでこんなにあるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                取得用が2つ（ヘッダ・明細）＋出力用が1つ、です。
                <code>lt_bkpf</code> / <code>lt_bseg</code> は取得用、<code>lt_out</code> は出力用——
                合計3つの内部テーブル、と数えてください。
              </Dialog>
              <Dialog speaker="b">
                <code>lt_</code> と <code>ls_</code> の違い、まだ混乱します…。第5章の復習、ですよね？
              </Dialog>
              <Dialog speaker="teacher">
                第5章の復習です。<code>lt_</code>＝<strong>内部テーブル（複数行）</strong>、
                <code>ls_</code>＝<strong>作業領域（1行・構造）</strong>。
                <code>LOOP</code> や <code>READ TABLE</code> で取得用から1行取り出し、
                <code>ls_out</code> で出力行を組み立て、<code>APPEND</code> で <code>lt_out</code> へ追加します。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="05-internal-tables"
                slide={5}
                label="第5章: 内部テーブルを復習する"
                variant="back"
                className="mb-4"
              />
              <Dialog speaker="b">
                <code>ty_out</code> と <code>lt_out</code> の違いは？ 名前が似てて混乱します…。
              </Dialog>
              <Dialog speaker="teacher">
                <code>ty_out</code> は出力行の<strong>型</strong>（<code>TYPES</code> で定義）。
                <code>lt_out</code> は、その型の行を載せる<strong>内部テーブル</strong>本体です。
                型と実物——第5章の「設計図と実物」と同じ関係です。
              </Dialog>
              <Dialog speaker="a">
                <code>ty_out</code> は BKPF/BSEG そのものではなく「一覧に載せたい項目だけ」を並べた設計、
                と理解するとコードが読みやすくなります。
              </Dialog>
              <Dialog speaker="b">
                整理できました。DB は最初に一度 → 取得用から1行ずつ読む → 出力用へ <code>APPEND</code>。
              </Dialog>
              <Dialog speaker="teacher">
                完璧です。分ける理由は3つ：<br />
                　① 頭の整理<br />
                　② 元データの保全<br />
                　③ DB 読み取りの最小化<br />
                すべてこの流れにつながります。次は、<code>ls_out</code> で1行を組み立てる命令（<code>MOVE</code> など）に入ります。
              </Dialog>
            </>
          ),
        },
        {
          title: "MOVEと対応づけ",
          plainText:
            "値を移す：MOVE と MOVE-CORRESPONDING\nMOVE a TO b（または b = a）：1つの値を移す\nMOVE-CORRESPONDING：同じ名前の項目をまとめて移す（とても便利）\nMOVE-CORRESPONDING ls_bkpf TO ls_out. \" 同名項目を一気にコピー\nls_out-amount = ls_bseg-dmbtr. \" 名前が違う項目は1つずつ移す\nBちゃん：同名だけ自動って、名前が合ってないと移らないんですね。\n先生：その通り。違う名前は手で1つずつ。amount と dmbtr は同じ「金額」でも名前が違う。\nBちゃん：同じラベルの引き出しから、中身をまとめて移す感じ？\n先生：完璧。同名は MOVE-CORRESPONDING、違う名前は手動、と覚えてください。",
          content: (
            <>
              <h2>値を移す：<code>MOVE</code> と <code>MOVE-CORRESPONDING</code></h2>

              <p>
                出力行（<code>ls_out</code>）を組み立てるとき、「ヘッダから日付をコピー」「明細から金額をコピー」と
                <strong>項目ごとに値を移します</strong>。
              </p>
              <ul>
                <li><code>MOVE a TO b</code>（または <code>b = a</code>）：1つの値を移す</li>
                <li>
                  <code>MOVE-CORRESPONDING</code>：<strong>同じ名前の項目</strong>をまとめて移す（とても便利）
                </li>
              </ul>
              <Dialog speaker="b">
                「同名だけ自動」って、名前が合っていない項目は移らないんですね…。
                全部 <code>MOVE-CORRESPONDING</code> だけで済まないの、最初は残念に感じました。
              </Dialog>
              <Dialog speaker="teacher">
                その気持ち、よく分かります。でも表ごとに項目名が違うのは日常です。
                <code>amount</code> と <code>dmbtr</code> はどちらも「金額」——名前が違うだけ。
                だから<strong>同名は自動、違う名前は手動</strong>の2段構えになります。
              </Dialog>
              <Dialog speaker="b">
                同じラベルの引き出しから、中身をまとめて移す感じ？
              </Dialog>
              <Dialog speaker="teacher">
                完璧なたとえです。ラベル（項目名）が一致する引き出しだけ一気に移せます。
                ラベルが違う引き出しは、1つずつ手で移してください。
              </Dialog>

              <h3>例：ヘッダと明細から出力行へ</h3>
              <CodeBlock
                language="ABAP"
                code={`" ① ヘッダから、名前が同じ項目をまとめてコピー
MOVE-CORRESPONDING ls_bkpf TO ls_out.

" ② 名前が違う項目は、1つずつ手動で移す
ls_out-amount = ls_bseg-dmbtr.   " 出力側=amount、明細側=dmbtr`}
              />
              <ul>
                <li>
                  <code>MOVE-CORRESPONDING ls_bkpf TO ls_out.</code> … ヘッダから出力用へ、
                  <strong>名前が同じ項目</strong>（伝票番号 <code>belnr</code>・日付 <code>budat</code> など）をまとめてコピー
                </li>
                <li>
                  <code>ls_out-amount = ls_bseg-dmbtr.</code> … 意味は同じ「金額」でも、
                  出力側は <code>amount</code>、明細側は <code>dmbtr</code> と<strong>名前が違う</strong>ので手動で移す
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "蓄える・消す",
          plainText:
            "蓄える・消す：APPEND / CLEAR / REFRESH\nAPPEND ls_out TO lt_out：作った1行を出力テーブルに追加\nCLEAR ls_out：作業領域（1行）を空にする\nREFRESH lt_out：出力テーブル全体を空にする\nBちゃん：CLEAR と REFRESH、どっちが何を消すのか混同しそう…\n先生：CLEAR＝ls_out、REFRESH＝lt_out全体。今回のループでは CLEAR が主役。\nつまずき：APPEND したあと CLEAR し忘れると前の行の値が次に残る。\nBちゃん：家計簿へ1行追加したら、机を空にして次の行——CLEAR、ですね。\n先生：その通り。組み立て→追加→クリアを口ぐせに。",
          content: (
            <>
              <h2>蓄える・消す：<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code></h2>

              <h3>解説</h3>
              <p>
                出力行（<code>ls_out</code>）ができたら <code>lt_out</code> へ<strong>追加</strong>し、
                <code>ls_out</code> を<strong>空にして</strong>次の行へ。
                この「追加 → クリア」を繰り返すのが、この章の核心リズムです。
              </p>
              <Dialog speaker="b">
                <code>CLEAR</code> と <code>REFRESH</code>、どっちが何を消すのか、いつも混同しそうです…。
              </Dialog>
              <Dialog speaker="teacher">
                覚え方はシンプルです。<code>CLEAR</code>＝<strong>作業領域</strong>（<code>ls_out</code>）を空にする。
                <code>REFRESH</code>＝<strong>出力テーブル全体</strong>（<code>lt_out</code>）を空にする。
                今回の「1行ずつ組み立てる」ループでは、毎回使うのは <code>CLEAR</code> です。
              </Dialog>
              <Dialog speaker="stumble">
                <code>APPEND</code> したあと <code>CLEAR</code> し忘れると、前の行の値が次の行に<strong>残って混ざる</strong>。
                原因が分かりにくいバグの代表例です。→ 「1行作る → 追加 → クリア」をワンセットに。
              </Dialog>
              <Dialog speaker="b">
                家計簿へ1行追加したら、机（<code>ls_out</code>）を空にして次の行——
                <code>REFRESH lt_out</code> は家計簿ごと全部消す、最初からやり直すとき用、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。「組み立て → 追加 → クリア」を口ぐせにすれば、混ざる事故はほぼ防げます。
              </Dialog>

              <h3>例：命令と変数</h3>
              <ul>
                <li><code>APPEND ls_out TO lt_out</code> … 作った1行を<strong>出力テーブル</strong>（<code>lt_out</code>）に追加</li>
                <li><code>CLEAR ls_out</code> … <strong>作業領域</strong>（1行）を空にする</li>
                <li><code>REFRESH lt_out</code> … <strong>出力テーブル全体</strong>を空にする</li>
              </ul>
            </>
          ),
        },
        {
          title: "結合の流れ",
          plainText:
            "ヘッダと明細を一覧にする処理の型\n① BKPF（ヘッダ）を取得\n② T003T などでコードを名称に変換\n③ BSEG（明細）と対応付け\n④ 出力用内部テーブルへ1行ずつ格納\nAくん：SQLのJOINでも書けそうですが、ABAPレポートではLOOP＋READ TABLEが定番？\n先生：その通り。取得はSELECTでまとめ、結合は内部テーブル上で行うのが実務の型。",
          content: (
            <>
              <h2>ヘッダと明細を一覧にする処理の型</h2>
              <p>仕訳日記帳のような一覧を作るとき、おおむね次の流れになります。</p>
              <MermaidDiagram
                chart={`flowchart LR
  A[BKPF 取得] --> B[T003T 等で名称化]
  B --> C[BSEG と対応付け]
  C --> D[出力用内部テーブルへ格納]`}
              />
              <InfoPanel
                title="なぜ SQL JOIN より LOOP + READ TABLE か"
                variant="reference"
                lead="他の言語では JOIN が自然でも、ABAP レポートでは次の理由で内部テーブル結合が多い。"
              >
                <ul>
                  <li>
                    <strong>取得と加工を分ける</strong> … まず <code>SELECT</code> で必要な表を内部テーブルに載せ、
                    そのあとメモリ上で <code>LOOP</code> / <code>READ TABLE</code> して組み立てる
                  </li>
                  <li>
                    <strong>帳票向けの柔軟さ</strong> … 1明細1行の出力、項目の再配置、
                    後段のサプレス処理など、帳票特有の加工がしやすい
                  </li>
                  <li>
                    <strong>実務の定番パターン</strong> … 複数表の JOIN 1発より、
                    「表ごとに取得 → ループで結合 → 出力用に APPEND」の方が読みやすいコードが多い
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                SQL の JOIN でも書けそうですが、ABAP レポートでは <code>LOOP</code> ＋ <code>READ TABLE</code> が定番なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で OK です。取得は <code>SELECT</code> でまとめ、結合は内部テーブル上で行う——これが実務の型です。
                次のスライドでは、<strong>DB から必要な行だけ</strong>内部テーブルへ載せる方法（明細の伝票番号で絞る）を見てから、
                例えと3テーブル結合に進みます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="09-control-flow"
                slide={2}
                label="第9章: サプレス・出力制御へ進む"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "必要なデータだけ取得",
          plainText:
            "必要なデータだけDB→内部テーブル\n①明細を先にSELECT ②明細のユニークな伝票番号で伝票だけ取得 ③会社マスタも同様\nFOR ALL ENTRIES＝明細に出てくるキーだけ。空のときはIFでガード。\nBちゃん：明細5行でも伝票2件なら、ヘッダ2行だけ？\n先生：その通り。全部取らないのがポイント。",
          content: (
            <>
              <h2>DB から<strong>必要な分だけ</strong>内部テーブルへ</h2>
              <p>
                3テーブル結合の前に、<strong>何を DB から取るか</strong>を整理します。
                伝票テーブル（BKPF）を<strong>丸ごと</strong>取る必要はありません——
                明細（BSEG）に登場する<strong>伝票番号だけ</strong>に絞ります。
              </p>
              <Callout variant="note">
                <strong>取得の順番（この章の型）</strong>
                <br />
                ① <strong>明細</strong>を先に <code>SELECT</code>（帳票の本体・LOOP の起点）<br />
                ② 明細に登場する<strong>ユニークな伝票キー</strong>で <strong>伝票</strong>だけ取得<br />
                ③ 伝票に登場する会社コードで <strong>会社マスタ</strong>だけ取得
              </Callout>
              <SelectNecessaryDataDiagram />
              <p>
                例では明細が<strong>5行</strong>あっても、伝票番号は <code>100001</code> と <code>100002</code> の
                <strong>2種類</strong>だけ。ヘッダ（伝票）も DB から<strong>2行だけ</strong>取れば足ります。
              </p>
              <Dialog speaker="b">
                明細の各行に同じ伝票番号が並んでても、ヘッダは1回分でいい——
                黄色の行は「同じ伝票の2行目以降」、ですね？
              </Dialog>
              <Dialog speaker="teacher">
                その理解で OK です。SAP では伝票を特定するキーは
                <code>bukrs</code>（会社）＋ <code>belnr</code>（伝票番号）＋ <code>gjahr</code>（年度）の3つセットです。
                明細の<strong>各行</strong>からこのキーを読み取り、<strong>重複を除いた分だけ</strong>ヘッダを取ります。
              </Dialog>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph step1 ["① 明細を先に取得"]
    S1["SELECT FROM bseg<br/>INTO lt_bseg"]
  end
  subgraph step2 ["② 明細の伝票キーでヘッダだけ"]
    S2["FOR ALL ENTRIES IN lt_bseg<br/>SELECT FROM bkpf → lt_bkpf"]
  end
  subgraph step3 ["③ 伝票の会社コードでマスタだけ"]
    S3["FOR ALL ENTRIES IN lt_bkpf<br/>SELECT FROM t001 → lt_t001"]
  end
  step1 --> step2 --> step3
  step3 --> M["メモリ上で LOOP + READ TABLE 結合"]`}
              />
              <h3>例：<code>FOR ALL ENTRIES</code> で必要分だけ</h3>
              <CodeBlock
                language="ABAP"
                code={`" ① 明細を先に取得（選択条件で絞る）
SELECT bukrs belnr gjahr buzei dmbtr
  FROM bseg
  INTO TABLE lt_bseg
  WHERE bukrs = p_bukrs
    AND budat IN s_budat.

" ② 明細に登場する伝票だけヘッダ取得（全伝票は取らない）
IF lt_bseg IS NOT INITIAL.
  SELECT bukrs belnr gjahr budat
    FROM bkpf
    INTO TABLE lt_bkpf
    FOR ALL ENTRIES IN lt_bseg
    WHERE bukrs = lt_bseg-bukrs
      AND belnr = lt_bseg-belnr
      AND gjahr = lt_bseg-gjahr.
ENDIF.

" ③ ヘッダに登場する会社だけマスタ取得
IF lt_bkpf IS NOT INITIAL.
  SELECT bukrs butxt
    FROM t001
    INTO TABLE lt_t001
    FOR ALL ENTRIES IN lt_bkpf
    WHERE bukrs = lt_bkpf-bukrs.
ENDIF.`}
              />
              <ul>
                <li>
                  <code>FOR ALL ENTRIES IN lt_bseg</code> … 明細内部テーブルに含まれる<strong>伝票キーの組み合わせだけ</strong>を
                  <code>WHERE</code> に使ってヘッダを取得（同じキーの重複行は SAP 側で整理）
                </li>
                <li>
                  <code>IF lt_bseg IS NOT INITIAL.</code> … 明細が0件のときにマスタ全件を取ってしまう<strong>罠</strong>を防ぐ（必須）
                </li>
                <li>
                  必要な<strong>列だけ</strong> <code>SELECT</code>（<code>SELECT *</code> は避ける）——第6章の復習
                </li>
              </ul>
              <Dialog speaker="stumble">
                明細が0件なのに <code>FOR ALL ENTRIES</code> だけ書くと、条件が効かず<strong>伝票やマスタを全件取得</strong>してしまう——
                開発環境では気づきにくい重大バグです。
              </Dialog>
              <Dialog speaker="a">
                取得用内部テーブル（<code>lt_bseg</code> / <code>lt_bkpf</code> / <code>lt_t001</code>）に
                <strong>必要最小限</strong>だけ載せてから LOOP 結合に入る——
                この順番が実務の定番ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。次のスライドは<strong>性能の補足</strong>（分からなければスキップ可）です。
                そのあと例え話で結合のイメージを掴みます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="06-select-from-db"
                slide={5}
                label="第6章: SELECT の基本を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "LOOP内SELECTを避ける理由",
          plainText:
            "LOOP内SELECTを避ける理由（補足・スキップ可）\n本コース必須ではない。難しければ次の例えへ進んでOK。口ぐせ：取得はLOOP前、結合はREAD TABLE。\nBちゃん：LOOP内SELECTのほうが書きやすくて楽だと思ってた…その場で取れるし。\n先生：書くときは楽。本番では往復が件数分。楽な近道がN+1問題。\nBちゃん：楽そうな書き方がトラップだった。n²n³は後回しで型だけ守ってもいい？\n先生：その通り。詳しくは第13章。",
          content: (
            <>
              <h2>
                <code>LOOP</code> の<strong>中</strong>で <code>SELECT</code> しない理由
              </h2>
              <InfoPanel
                title="このスライドについて"
                variant="reference"
                lead={
                  <>
                    <strong>本コースの必須内容ではありません。</strong>
                    性能の背景を理解したい人向けの補足です。
                  </>
                }
              >
                <ul>
                  <li>
                    往復コスト・N+1問題・テーブル結合での<strong>ネスト LOOP</strong>（参考）
                  </li>
                  <li>
                    <strong>分からない・難しければスキップして大丈夫</strong>です。次の「例え」「3テーブル結合」へ進んでください
                  </li>
                  <li>
                    最低限覚える型：<strong>取得は LOOP の前</strong>、<strong>結合は READ TABLE</strong>、
                    <strong>LOOP は② 明細だけ</strong>（3テーブル結合スライドで実践）
                  </li>
                  <li>詳しくは第13章（良いABAP）で扱います</li>
                </ul>
              </InfoPanel>
              <p>
                前のスライドでは、<code>FOR ALL ENTRIES</code> で<strong>LOOP の前</strong>に必要分だけ DB から取得しました。
                結合は <code>READ TABLE</code> で行う——この順番には、性能上の理由があります。
              </p>
              <Dialog speaker="b">
                正直、前まで <code>LOOP</code> の中で <code>SELECT</code> したほうが<strong>楽</strong>だと思ってました。
                「いまの明細に合う伝票が欲しい」→ その場で <code>SELECT SINGLE</code>——
                流れが1行ずつ追いやすいし、<code>FOR ALL ENTRIES</code> を先に書かなくていいですよね？
              </Dialog>
              <Dialog speaker="teacher">
                書く直感としては、そう感じる人がとても多いです。
                でも DB への<strong>往復</strong>という観点で見ると、楽な書き方が本番で一番困るパターンになります。
              </Dialog>
              <Callout variant="note">
                <strong>DB への問い合わせは「往復」が重い</strong>
                <br />
                プログラム（事務所）と DB（倉庫）は別の場所にあります。
                1回 <code>SELECT</code> するたびに<strong>往復の旅</strong>が1回発生し、時間がかかります。
              </Callout>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph bad ["❌ LOOP 内 SELECT"]
    L["LOOP 明細 N行"] --> S["毎回 SELECT"]
    S --> DB1[("DB 往復 × N")]
    DB1 --> L
  end
  subgraph good ["✅ この章の型"]
    Q["LOOP 前: FOR ALL ENTRIES 等"] --> DB2[("DB 往復 少数")]
    DB2 --> M["LOOP 内: READ TABLE"]
    M --> R["メモリ照合（往復なし）"]
  end`}
              />
              <ul>
                <li>
                  <strong>LOOP 内 SELECT</strong> … 明細100行なら DB へ<strong>100回往復</strong>。
                  業界では「<strong>N+1問題</strong>」と呼ばれる代表的なアンチパターンです
                </li>
                <li>
                  <strong>開発環境では気づきにくい</strong> … 件数が少ないと速く見えますが、
                  本番の大量データでは処理が止まる原因になります
                </li>
                <li>
                  <strong>正しい型</strong> … <code>FOR ALL ENTRIES</code> などで LOOP の前に必要分だけ取得し、
                  LOOP 内はメモリ上の <code>READ TABLE</code> で照合する
                </li>
              </ul>
              <Dialog speaker="b">
                え、私が「楽」だと思ってた <code>LOOP</code> 内 <code>SELECT</code> が、明細100行で DB へ<strong>100回往復</strong>…？
                研修データではサクッと動いたから、問題ないと思ってました…。
              </Dialog>
              <Dialog speaker="teacher">
                件数が少ないと「楽な書き方」でも動きます。
                本番で明細が増えると往復が件数分膨らむ——<strong>N+1問題</strong>です。
                だから先にまとめて取り、LOOP 内は <code>READ TABLE</code> で机の上だけ照合します。
              </Dialog>

              <h3>テーブル結合で LOOP を重ねると、件数の累乗で遅くなる</h3>
              <p>
                結合のために<strong>表ごとに LOOP をネスト</strong>すると、突き合わせの回数が件数の累乗オーダーに近づきます。
                （細かい計算量の話は第13章でも触れますが、<strong>イメージだけ</strong>押さえれば十分です。）
              </p>
              <ul>
                <li>
                  <strong>2表を二重 LOOP</strong>（例：伝票 LOOP × 明細 LOOP）… おおむね <strong>n × m</strong>。
                  両方100件なら最大<strong>1万回</strong>の突き合わせ（<strong>n²</strong> オーダー）
                </li>
                <li>
                  <strong>3表を三重 LOOP</strong> … さらに1段重なると <strong>n³</strong> オーダーに近づく
                </li>
                <li>
                  <strong>この章の型</strong> … <strong>LOOP は② 明細だけ</strong>（n回）、①③ は <code>READ TABLE</code> で1行取得。
                  明細100行なら<strong>100回の1周</strong>——ネスト LOOP や LOOP 内 SELECT よりはるかに軽い
                </li>
              </ul>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph nest ["❌ 表ごとに LOOP を重ねる"]
    L1["LOOP ①"] --> L2["LOOP ②"]
    L2 --> L3["LOOP ③"]
    L3 --> X["比較 ≈ n³"]
  end
  subgraph ok ["✅ この章"]
    D["LOOP ② 明細 n回"] --> R1["READ ①"]
    R1 --> R2["READ ③"]
    R2 --> Y["≈ n 回の1周"]
  end`}
              />
              <Dialog speaker="b">
                表ごとに <code>LOOP</code> を重ねるのも、コードの並びはわかりやすそう…でも <strong>n³</strong> は怖いです。
                結局、<strong>楽そうな</strong> <code>SELECT</code> やネスト LOOP より、
                口ぐせの型（LOOP 前に取得・明細だけ LOOP）のほうが正解、ですね？
              </Dialog>
              <Dialog speaker="teacher">
                その整理で大丈夫です。<strong>読みやすさだけ</strong>で選ぶと、性能のトラップに入りがちです。
                結合で3表全部 <code>LOOP</code> にすると n³ オーダー——この章は<strong>LOOP は明細1本</strong>＋ <code>READ TABLE</code> です。
                第13章でも、同じ「楽な近道」の話を深掘りします。
              </Dialog>
              <Dialog speaker="b">
                <strong>n²</strong> や <strong>n³</strong> はまだふわっとだけど…
                「楽だから LOOP 内 <code>SELECT</code>」はやめて、スキップして口ぐせだけ守ってもいいですか？
              </Dialog>
              <Dialog speaker="teacher">
                大丈夫です。<strong>取得は LOOP の前、結合は READ TABLE、LOOP は明細だけ</strong>——この3つが身につけば、
                この章の実習は進められます。性能の深掘りは第13章でまた会いましょう。
              </Dialog>
              <Dialog speaker="a">
                Bちゃんの「その場で <code>SELECT</code>」は、確かに読みやすいですが、
                前のスライドの「①②③ を LOOP 前に取得 → LOOP 内は <code>READ TABLE</code>」のほうが、
                性能面では正しい設計、ということですね！
              </Dialog>
              <Callout variant="tip">
                口ぐせ：<strong>取得は LOOP の前、結合は READ TABLE</strong>。
                DB への往復を減らす——この章の型は、性能改善の第一歩でもあります。
              </Callout>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="13-good-programming"
                slide={3}
                label="第13章: なぜ LOOP 内 SELECT が遅いか（詳しく）"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "例え：3つのメモ",
          plainText:
            "例え：3つのメモ\nレシート（注文）→注文品目→品目マスタ\n①表紙 ②品目行（めくる起点） ③商品名辞書\nBちゃん：ネット通販、3枚に分かれてる感じ？\n先生：その通り。次のスライドで1行ずつつなげる。",
          content: (
            <>
              <h2>例えで理解する：<strong>3つのメモ</strong></h2>
              <p>
                テーブル結合の前に、<strong>日常の例え</strong>でイメージを掴みましょう。
                ネット通販やレジのレシート——情報が<strong>3枚のメモ</strong>に分かれている、と想像してください。
              </p>
              <Callout variant="tip">
                <strong>3つのメモの役割</strong>
                <br />
                ① <strong>レシート（注文）</strong> … 注文番号・日付（表紙）<br />
                ② <strong>注文品目</strong> … 何を・いくつ買ったか（<strong>1行ずつめくる起点</strong>）<br />
                ③ <strong>品目マスタ</strong> … 品目コード → 商品名（辞書）
              </Callout>
              <ReceiptAnalogySourcesDiagram />
              <Dialog speaker="b">
                注文 A001 に品目が2行ある——黄色の行から、1行ずつ処理するんですね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。次のスライドでは、この3つを<strong>1行ずつつなげて</strong>、
                見やすい一覧にしていきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "例え：1行ずつつなぐ",
          plainText:
            "例え：1行ずつつなぐ\n②品目1行→①レシート→③品目マスタ→一覧1行\n例え→SAP：レシート=伝票、品目=明細、品目マスタ=会社マスタ\nBちゃん：コードから名前を辞書で引く——③の考え方は同じ。\n先生：次はSAP表で同じ型をコードに。",
          content: (
            <>
              <h2>例えで理解する：<strong>1行ずつつなぐ</strong></h2>
              <p>
                前のスライドの3つのメモを、<strong>注文品目1行ごと</strong>にくっつけます。
              </p>
              <ReceiptAnalogyResultDiagram />
              <h3>1行ずつやること（コードの前に）</h3>
              <ol>
                <li>
                  <strong>② 注文品目</strong>を1行取り出す（注文 A001・1行目 …）
                </li>
                <li>
                  同じ<strong>注文番号</strong>で ① レシートから日付などを探す
                </li>
                <li>
                  品目コード（P100）で ③ 品目マスタから<strong>商品名</strong>を探す
                </li>
                <li>
                  3つを並べて<strong>一覧の1行</strong>に書く → 次の注文品目行へ
                </li>
              </ol>
              <Dialog speaker="b">
                注文に商品が2つあれば、② を2回めくって、一覧も2行——「品目1行＝出力1行」、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。やっていることは「<strong>バラバラの3つを、1行ずつくっつける</strong>」だけ。
                SAP でも同じ型です。
              </Dialog>
              <InfoPanel title="例え → SAP（この章）" variant="reference">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left font-semibold">例え</th>
                      <th className="pb-2 text-left font-semibold">SAP（この章で使う表）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">① レシート（注文）</td>
                      <td className="py-1">伝票 <code>BKPF</code></td>
                    </tr>
                    <tr>
                      <td className="py-1">② 注文品目</td>
                      <td className="py-1">明細 <code>BSEG</code></td>
                    </tr>
                    <tr>
                      <td className="py-1">③ 品目マスタ（商品名）</td>
                      <td className="py-1">
                        会社マスタ <code>T001</code>（<strong>会社名</strong>を付ける——③ の「辞書」の役割は同じ）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                品目マスタじゃなく会社マスタ、ですか。でも「コードから名前を辞書で引く」——③ の考え方は同じ、と。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。次のスライドで、伝票・明細・会社マスタに置き換えて、同じ型をコードに落とし込みます。
              </Dialog>
            </>
          ),
        },
        {
          title: "3テーブル結合",
          plainText:
            "3テーブル結合：伝票→明細→会社マスタ\nLOOP②→READ①→READ③→組み立て→APPEND→CLEAR\nLOOPは明細だけ。①③はREAD TABLEで1行。\nBちゃん：レシートの例え、そのまま BKPF/BSEG/T001？\n先生：その通り。次のスライドでコード。",
          content: (
            <>
              <h2>
                3テーブル結合：<strong>伝票 → 明細 → 会社マスタ</strong>
              </h2>
              <p>
                内部テーブルに載せた3表を、<strong>② 明細を起点</strong>に1行ずつつなげます。
                テーブル名の並びは <strong>伝票 → 明細 → 会社マスタ</strong>、
                処理の順は <strong>明細 → 伝票 → 会社マスタ</strong> です。
              </p>
              <ThreeTableChainDiagram />
              <ThreeTableJoinOverviewDiagram />
              <JoinFlowDiagram
                activeDetailIndex={0}
                loopRound={1}
                caption="LOOP 1回目 — ②明細から①伝票・③会社マスタを結合"
              />
              <MermaidDiagram
                chart={`sequenceDiagram
  participant V as ① 伝票 lt_bkpf
  participant D as ② 明細 lt_bseg
  participant M as ③ 会社マスタ lt_t001
  participant W as 机 ls_out
  participant O as 家計簿 lt_out
  Note over D: LOOP 開始
  D->>D: 1行目 → ls_bseg
  D->>V: belnr で READ ①
  V->>M: bukrs で READ ③
  V->>W: MOVE 日付など
  M->>W: MOVE 会社名
  D->>W: MOVE 金額
  W->>O: APPEND
  W->>W: CLEAR
  Note over D: 次の明細行へ`}
              />
              <Dialog speaker="b">
                「ネスト」ってループの中にループ…？ 3テーブル全部 LOOP するんですか？
              </Dialog>
              <Dialog speaker="teacher">
                いいえ。<strong>LOOP は② 明細だけ</strong>です。
                ① 伝票と ③ 会社マスタは <code>READ TABLE</code> で合う1行だけ取り出します。
                同じ伝票の2行目以降も、①③ の READ は毎回行いますが、取れる内容は同じ——変わるのは② の品目と金額だけです。
              </Dialog>
              {LOOP_THREE_TABLE_STEPS.map((step) => (
                <SampleTable
                  key={step.round}
                  caption={`🔄 ${step.detailLabel}（LOOP ${step.round} 回目）`}
                  variant="default"
                >
                  <tbody>
                    <tr>
                      <Th>LOOP ②</Th>
                      <Td>{step.detail}</Td>
                    </tr>
                    <tr>
                      <Th>READ ①</Th>
                      <Td>{step.voucherLookup}</Td>
                    </tr>
                    <tr>
                      <Th>READ ③</Th>
                      <Td>{step.masterLookup}</Td>
                    </tr>
                    <tr>
                      <Th>出力1行</Th>
                      <Td>
                        <strong>{step.output}</strong>
                      </Td>
                    </tr>
                  </tbody>
                </SampleTable>
              ))}
              <Callout variant="tip">
                口ぐせ：<strong>LOOP ② → READ ① → READ ③ → 組み立て → APPEND → CLEAR</strong>。
                次のスライドで、この流れを ABAP コードに落とし込みます。
              </Callout>
            </>
          ),
        },
        {
          title: "LOOPの中で組み立てる",
          plainText:
            "3テーブル結合のコード\nLOOP AT lt_bseg → READ lt_bkpf → READ lt_t001 → MOVE → APPEND → CLEAR\nBちゃん：前のスライドの図、そのままコード版？\n先生：その通り。声に出して読めば長さより意味が先に見える。",
          content: (
            <>
              <h2>3テーブル結合の <code>LOOP</code> コード</h2>
              <p>
                前のスライドの流れが、そのまま次のコードです。
                <code>READ TABLE</code> の鍵は <code>belnr</code>（① 伝票）と <code>bukrs</code>（③ 会社）です。
              </p>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph selectPhase ["取得（章の前半）"]
    S1[("DB")] -->|FOR ALL ENTRIES| F2["② lt_bseg"]
    F2 --> F1["① lt_bkpf"]
    F1 --> F3["③ lt_t001"]
  end
  subgraph loopPhase ["LOOP 1回"]
    L["LOOP ②"] --> R1["READ ①"]
    R1 --> R2["READ ③"]
    R2 --> M["MOVE → APPEND → CLEAR"]
  end
  F1 --> loopPhase
  F2 --> loopPhase
  F3 --> loopPhase
  M -.->|次の明細| L`}
              />
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_bseg INTO ls_bseg.          " ② 明細

  READ TABLE lt_bkpf INTO ls_bkpf         " ① 伝票
    WITH KEY bukrs = ls_bseg-bukrs
             belnr = ls_bseg-belnr
             gjahr = ls_bseg-gjahr.
  IF sy-subrc <> 0. CONTINUE. ENDIF.

  READ TABLE lt_t001 INTO ls_t001         " ③ 会社マスタ
    WITH KEY bukrs = ls_bkpf-bukrs.
  IF sy-subrc <> 0. CLEAR ls_t001. ENDIF.

  MOVE-CORRESPONDING ls_bkpf TO ls_out.
  ls_out-name   = ls_t001-butxt.
  ls_out-amount = ls_bseg-dmbtr.

  APPEND ls_out TO lt_out.
  CLEAR ls_out.

ENDLOOP.`}
              />
              <Figure
                src="image/08-header-detail-join.webp"
                alt="lt_bkpf（伝票）とlt_bseg（明細）から1行(ls_out)を組み立て、APPENDでlt_outへ蓄積する流れ。"
                caption="3テーブル → 1行組み立て → APPEND で lt_out へ"
                kind="diagram"
              />
              <ul>
                <li>
                  <code>LOOP AT lt_bseg</code> … ② 明細（1明細＝出力1行）
                </li>
                <li>
                  <code>READ TABLE lt_bkpf</code> … ① 伝票（明細と同じ <code>belnr</code> キー）
                </li>
                <li>
                  <code>READ TABLE lt_t001</code> … ③ 会社マスタ（伝票の <code>bukrs</code>）
                </li>
                <li>
                  <code>MOVE-CORRESPONDING</code> ＋ 個別代入 → <code>APPEND</code> → <code>CLEAR</code>
                </li>
              </ul>
              <InfoPanel
                title="4つ目のマスタを結合するとき"
                variant="reference"
                lead="T003T（伝票タイプ名）など、READ TABLE がもう1段増えることもあります。"
              >
                <p>
                  <strong>LOOP は② 明細のまま</strong>、<code>READ TABLE</code> を増やすだけ——3テーブル結合と同じ型です。
                </p>
              </InfoPanel>
              <Dialog speaker="b">
                コードは長く見えますけど、やってることは前のスライドの口ぐせと同じ、ですね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。「LOOP ② → READ ① → READ ③ → 組み立て → APPEND → CLEAR」と声に出して読んでみてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認質問",
          plainText:
            "確認質問\n先生の問い：1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？\nBちゃん：家計簿へ1行追加したら、次の行を書く前に机を空に…つまり CLEAR？\n先生：正解！組み立て→APPEND→CLEAR を口ぐせにすれば混ざる事故はほぼ防げます。\nBちゃん：最初は APPEND だけで終わっちゃいそうでした。クリア、忘れやすい。",
          content: (
            <>
              <h2>確認質問</h2>
              <p><strong>先生の問い：</strong>「1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？」</p>
              <Dialog speaker="b">
                えっと…家計簿へ1行追加したら、次の行を書く前に机を空にする…つまり <code>CLEAR</code>、ですか？
              </Dialog>
              <Reveal>
                <Dialog speaker="teacher">
                  正解！「組み立て → APPEND → CLEAR」を口ぐせにすれば、混ざる事故はほぼ防げます。
                </Dialog>
                <Dialog speaker="b">
                  最初は <code>APPEND</code> だけで終わっちゃいそうでした。
                  「追加したら必ず片付け」——メモしておきます。
                </Dialog>
              </Reveal>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\nBちゃん：DBは最初に一度、取得用から読んで出力用へAPPENDする流れは掴めました。\n先生：同名は MOVE-CORRESPONDING、違う名前は手動。取得用は触らない。\nAくん：取得用に載せておけば加工中のDBアクセスが増えず、仕様変更にも強い。\nBちゃん：組み立て→追加→クリア、のリズムが道しるべになりそう。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="b">
                最初は「ヘッダと明細を合体」と聞いて途方に暮れましたけど、
                DB は<strong>最初に一度</strong>取って、取得用から1行ずつ読み、
                出力用へ「組み立て → 追加 → 片付け」——この流れなら、もう一度やれそうです。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。細かい点は4つだけ。<br />
                ① <strong>3テーブル結合</strong> … LOOP ②明細 → READ ①伝票 → READ ③会社マスタ。<br />
                ② 同名項目は <code>MOVE-CORRESPONDING</code>、違う名前は手動で移す。<br />
                ③ 取得用テーブルは触らない。<br />
                ④ <code>APPEND</code> のあとは必ず <code>CLEAR</code>。
              </Dialog>
              <Dialog speaker="a">
                取得用に載せておけば、加工中は DB へ何度も行かなくて済みます。
                出力用を別にしておけば、整形ロジックを変えても取得用はそのまま——
                性能と保守性、両方の理由でこの分け方が定番です。
              </Dialog>
              <Dialog speaker="b">
                命令名はまだ全部覚えきれませんけど、「組み立て → 追加 → クリア」のリズムが
                コードを読むときの道しるべになりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "コード早見表",
          plainText:
            "コード早見表\n3テーブル：①伝票 lt_bkpf ②明細 lt_bseg ③会社マスタ lt_t001\nLOOP ② → READ ① → READ ③ → 組み立て → APPEND → CLEAR",
          content: (
            <>
              <h2>コード早見表</h2>
              <p>
                この章で使うコードを一覧にまとめました。
                <strong>3テーブル結合（伝票 → 明細 → 会社マスタ）</strong>の対応を意識して読みましょう。
              </p>
              <ThreeTableChainDiagram />

              <h3>出力行の型（<code>ty_out</code>）</h3>
              <p>
                出力用テーブルの行の形は、<code>TYPES</code> で先に定義します（第5章の「設計図と実物」）。
                BKPF/BSEG そのものではなく、<strong>一覧に載せたい項目だけ</strong>を並べます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`TYPES: 
  BEGIN OF ty_out,
    belnr  TYPE bkpf-belnr,   " 伝票番号（ヘッダと同名 → MOVE-CORRESPONDING）
    budat  TYPE bkpf-budat,   " 日付（同上）
    bukrs  TYPE bkpf-bukrs,   " 会社コード（同上）
    name   TYPE t001-butxt,   " 会社名（T001 から手動で移す）
    amount TYPE bseg-dmbtr,   " 金額（明細の dmbtr を手動で移す）
  END OF ty_out.`}
              />
              <ul>
                <li>
                  <code>TYPES ... BEGIN OF ty_out ... END OF ty_out.</code> … 出力<strong>1行分</strong>の型（構造）を定義
                </li>
                <li>
                  <code>TYPE bkpf-belnr</code> など … 既存項目と同じ型・長さを借りる書き方（<code>LIKE</code> と同様の考え方）
                </li>
                <li>
                  同名項目（<code>belnr</code> など）は <code>MOVE-CORRESPONDING</code> で自動コピー、
                  違う名前（<code>amount</code> ← <code>dmbtr</code>）は手動代入
                </li>
              </ul>

              <h3>変数の宣言</h3>
              <CodeBlock
                language="ABAP"
                code={`" ty_out の型が定義済みであること
DATA lt_bkpf TYPE TABLE OF bkpf.   " ヘッダ取得用
DATA lt_bseg TYPE TABLE OF bseg.   " 明細取得用
DATA lt_t001 TYPE TABLE OF t001.   " 会社名取得用（3NF）
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（ty_out 型の行を複数）

DATA ls_bkpf TYPE bkpf.            " ヘッダ1行（作業領域）
DATA ls_bseg TYPE bseg.            " 明細1行（作業領域）
DATA ls_t001 TYPE t001.            " 会社1行（作業領域）
DATA ls_out  TYPE ty_out.          " 出力1行（作業領域）`}
              />

              <InfoPanel
                title="この章の命令一覧"
                variant="reference"
                lead={
                  <>
                    取得用から1行を読み、出力用へ<strong>組み立て → 追加 → クリア</strong>する命令。
                    <code>READ TABLE</code> のあとは <code>sy-subrc</code> を確認します。
                  </>
                }
              >
                <ul>
                  <li>
                    <code>MOVE-CORRESPONDING ls_bkpf TO ls_out.</code> … 同名項目をまとめてコピー
                  </li>
                  <li>
                    <code>ls_out-amount = ls_bseg-dmbtr.</code> … 名前が違う項目は手動で代入
                  </li>
                  <li>
                    <code>APPEND ls_out TO lt_out.</code> … できた1行を出力用に追加
                  </li>
                  <li>
                    <code>CLEAR ls_out.</code> … 作業領域（1行）を空にする
                  </li>
                  <li>
                    <code>REFRESH lt_out.</code> … 出力用テーブル全体を空にする（ループ外・やり直し用）
                  </li>
                  <li>
                    <code>LOOP AT lt_bseg INTO ls_bseg.</code> … <strong>② 明細</strong>：LOOP の起点
                  </li>
                  <li>
                    <code>READ TABLE lt_bkpf INTO ls_bkpf WITH KEY ...</code> … <strong>① 伝票</strong>：{" "}
                    <code>belnr</code> で1行取得 <strong>⚠️ <code>sy-subrc</code> を確認</strong>
                  </li>
                  <li>
                    <code>READ TABLE lt_t001 INTO ls_t001 WITH KEY bukrs = ...</code> … <strong>③ 会社マスタ</strong>：{" "}
                    <code>bukrs</code> で1行取得 <strong>⚠️ <code>sy-subrc</code> を確認</strong>
                  </li>
                </ul>
              </InfoPanel>

              <h3>LOOP の型（3テーブル結合・この章の核心）</h3>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_bseg INTO ls_bseg.          " ② 明細

  READ TABLE lt_bkpf INTO ls_bkpf           " ① 伝票
    WITH KEY bukrs = ls_bseg-bukrs
             belnr = ls_bseg-belnr
             gjahr = ls_bseg-gjahr.
  IF sy-subrc <> 0. CONTINUE. ENDIF.

  READ TABLE lt_t001 INTO ls_t001           " ③ 会社マスタ
    WITH KEY bukrs = ls_bkpf-bukrs.
  IF sy-subrc <> 0. CLEAR ls_t001. ENDIF.

  MOVE-CORRESPONDING ls_bkpf TO ls_out.
  ls_out-name   = ls_t001-butxt.
  ls_out-amount = ls_bseg-dmbtr.

  APPEND ls_out TO lt_out.
  CLEAR ls_out.

ENDLOOP.`}
              />

              <Callout variant="tip">
                口ぐせ：<strong>LOOP ②明細 → READ ①伝票 → READ ③会社マスタ → 組み立て → APPEND → CLEAR</strong>。
                テーブル名の並びは <strong>伝票 → 明細 → 会社マスタ</strong>。
              </Callout>
              <Dialog speaker="teacher">
                この一覧は復習用です。コードが長く見えても、中身はこの型の繰り返しだけ——次のスライドで理解度を確認しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 同じ名前の項目をまとめて移すのに便利なのは？→ MOVE-CORRESPONDING\nQ2 1行をAPPENDした後、次の行の前に作業領域を空にする命令は？→ CLEAR\nQ3 内部テーブルを取得用と出力用に分ける主な利点は？→ 役割が分離され整形処理を安全に管理できる\nBちゃん：組み立て→追加→クリア。このリズムが身につけば、難しい章も乗り越えられそうです。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="MOVE-CORRESPONDING は、両者で名前が一致する項目だけをまとめてコピーします。Bちゃんのたとえで言えば「同じラベルの引き出しから中身をまとめて移す」命令です。名前が違う項目（amount と dmbtr など）は自動では移りません。"
                question={<strong>同じ名前の項目をまとめて移すのに便利なのは？</strong>}
                options={["APPEND", "MOVE-CORRESPONDING", "REFRESH"]}
              />
              <Quiz
                answer={2}
                explanation="CLEAR は作業領域（<code>ls_out</code>）を空にします。APPEND の後にこれを忘れると前の値が残ります。通帳コピーと家計簿のたとえで言えば、家計簿へ1行追加したあと「机を空にする」作業です。REFRESH は家計簿全体を空にするので、今回のループでは使いません。"
                question={<strong>1行をAPPENDした後、次の行の前に作業領域を空にする命令は？</strong>}
                options={["MOVE", "ULINE", "CLEAR"]}
              />
              <Quiz
                answer={0}
                explanation="取得用と出力用を分けると、元データを残したまま整形でき、役割が分離されます。あわせて SELECT は最初にまとめて実行し、加工中はメモリ上の内部テーブルを読むだけにできるので、DB への読み取り回数も減らせます。"
                question={<strong>内部テーブルを「取得用」と「出力用」に分ける主な利点は？</strong>}
                options={[
                  "役割が分離され、整形処理を安全に管理できる",
                  "必ず実行速度が2倍になる",
                  "CLEARやAPPENDが不要になる",
                ]}
              />
              <Dialog speaker="b">
                「組み立て → 追加 → クリア」。このリズムが身につけば、
                難しい章も、通帳コピーと家計簿のたとえを頼りに乗り越えられそうです。次の章も頑張ります！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CombineDataLesson);
