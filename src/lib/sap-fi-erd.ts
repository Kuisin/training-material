import type { DatabaseSchemaInfo } from "react-erd";

const SCHEMA_NAME = "sap_fi";

type SapColumnType = "CHAR" | "NUMC" | "DATS" | "CURR" | "CUKY" | "LANG";

interface SapColumnDef {
  code: string;
  label: string;
  sapType: SapColumnType;
  foreignKeys?: {
    table: string;
    column: string;
  }[];
}

interface SapTableDef {
  name: string;
  subtitle?: string;
  primaryKey: string | string[];
  color?: string;
  columns: SapColumnDef[];
}

function columnLabel(code: string, label: string): string {
  return `${label} (${code})`;
}

function toDataType(sapType: SapColumnType): "text" | "number" | "datetime" | "money" {
  switch (sapType) {
    case "NUMC":
      return "number";
    case "DATS":
      return "datetime";
    case "CURR":
      return "money";
    default:
      return "text";
  }
}

function buildTable(def: SapTableDef, columnCodes?: string[]) {
  const columns = columnCodes
    ? def.columns.filter((col) => columnCodes.includes(col.code))
    : def.columns;

  const primaryKeyCodes = Array.isArray(def.primaryKey) ? def.primaryKey : [def.primaryKey];
  const primaryKeyLabels = primaryKeyCodes
    .filter((code) => columns.some((col) => col.code === code))
    .map((code) => columnLabel(code, columns.find((c) => c.code === code)!.label));

  // react-erd: single PK must be a string; composite PK is string[] (patched in node_modules).
  const primaryKey: string | string[] =
    primaryKeyLabels.length === 1 ? primaryKeyLabels[0]! : primaryKeyLabels;

  return {
    name: def.subtitle ? `${def.name} — ${def.subtitle}` : def.name,
    primaryKey,
    color: def.color,
    columns: columns.map((col) => ({
      name: columnLabel(col.code, col.label),
      type: toDataType(col.sapType),
      foreignKeys: (col.foreignKeys ?? []).map((fk) => {
        const target = FI_TABLES.find((t) => t.name === fk.table);
        const targetCol = target?.columns.find((c) => c.code === fk.column);
        return {
          foreignSchemaName: SCHEMA_NAME,
          foreignTableName: target?.subtitle ? `${target.name} — ${target.subtitle}` : target!.name,
          foreignColumnName: columnLabel(fk.column, targetCol?.label ?? fk.column),
          constrained: true,
        };
      }),
    })),
  };
}

const FI_TABLES: SapTableDef[] = [
  {
    name: "BKPF",
    subtitle: "伝票ヘッダ",
    color: "#4f46e5",
    primaryKey: ["BUKRS", "BELNR", "GJAHR"],
    columns: [
      { code: "BUKRS", label: "会社コード", sapType: "CHAR", foreignKeys: [{ table: "T001", column: "BUKRS" }] },
      { code: "BELNR", label: "会計伝票番号", sapType: "CHAR" },
      { code: "GJAHR", label: "会計年度", sapType: "NUMC" },
      { code: "BLART", label: "伝票タイプ", sapType: "CHAR", foreignKeys: [{ table: "T003T", column: "BLART" }] },
      { code: "BLDAT", label: "証憑日付", sapType: "DATS" },
      { code: "BUDAT", label: "転記日付", sapType: "DATS" },
      { code: "MONAT", label: "会計期間", sapType: "NUMC" },
      { code: "WAERS", label: "伝票通貨", sapType: "CUKY" },
      { code: "XBLNR", label: "参照伝票番号", sapType: "CHAR" },
      { code: "BKTXT", label: "ヘッダテキスト", sapType: "CHAR" },
      { code: "CPUDT", label: "入力日付", sapType: "DATS" },
      { code: "USNAM", label: "登録ユーザ", sapType: "CHAR" },
      { code: "TCODE", label: "トランザクション", sapType: "CHAR" },
      { code: "STBLG", label: "反対伝票番号", sapType: "CHAR" },
    ],
  },
  {
    name: "BSEG",
    subtitle: "伝票明細",
    color: "#0ea5e9",
    primaryKey: ["BUKRS", "BELNR", "GJAHR", "BUZEI"],
    columns: [
      {
        code: "BUKRS",
        label: "会社コード",
        sapType: "CHAR",
        foreignKeys: [{ table: "BKPF", column: "BUKRS" }],
      },
      {
        code: "BELNR",
        label: "伝票番号",
        sapType: "CHAR",
        foreignKeys: [{ table: "BKPF", column: "BELNR" }],
      },
      {
        code: "GJAHR",
        label: "会計年度",
        sapType: "NUMC",
        foreignKeys: [{ table: "BKPF", column: "GJAHR" }],
      },
      { code: "BUZEI", label: "明細番号", sapType: "NUMC" },
      { code: "BSCHL", label: "転記キー", sapType: "CHAR" },
      { code: "SHKZG", label: "貸借区分", sapType: "CHAR" },
      { code: "DMBTR", label: "現地通貨額", sapType: "CURR" },
      { code: "WRBTR", label: "伝票通貨額", sapType: "CURR" },
      {
        code: "HKONT",
        label: "総勘定元帳勘定",
        sapType: "CHAR",
        foreignKeys: [
          { table: "SKA1", column: "SAKNR" },
          { table: "SKAT", column: "SAKNR" },
        ],
      },
      { code: "KUNNR", label: "得意先コード", sapType: "CHAR", foreignKeys: [{ table: "KNA1", column: "KUNNR" }] },
      { code: "LIFNR", label: "仕入先コード", sapType: "CHAR", foreignKeys: [{ table: "LFA1", column: "LIFNR" }] },
      { code: "KOSTL", label: "原価センタ", sapType: "CHAR" },
      { code: "MWSKZ", label: "税コード", sapType: "CHAR" },
      { code: "ZUONR", label: "割当番号", sapType: "CHAR" },
      { code: "SGTXT", label: "明細テキスト", sapType: "CHAR" },
    ],
  },
  {
    name: "ACDOCA",
    subtitle: "Universal Journal",
    color: "#8b5cf6",
    primaryKey: ["RLDNR", "RBUKRS", "GJAHR", "BELNR", "DOCLN"],
    columns: [
      { code: "RLDNR", label: "元帳", sapType: "CHAR" },
      { code: "RBUKRS", label: "会社コード", sapType: "CHAR" },
      { code: "GJAHR", label: "会計年度", sapType: "NUMC" },
      { code: "BELNR", label: "伝票番号", sapType: "CHAR" },
      { code: "DOCLN", label: "明細番号", sapType: "NUMC" },
      { code: "RACCT", label: "勘定コード", sapType: "CHAR" },
      { code: "DRCRK", label: "貸借区分", sapType: "CHAR" },
      { code: "HSL", label: "現地通貨額", sapType: "CURR" },
      { code: "TSL", label: "取引通貨額", sapType: "CURR" },
      { code: "RHCUR", label: "現地通貨", sapType: "CUKY" },
      { code: "BUDAT", label: "転記日付", sapType: "DATS" },
    ],
  },
  {
    name: "T001",
    subtitle: "会社コード",
    color: "#10b981",
    primaryKey: "BUKRS",
    columns: [
      { code: "BUKRS", label: "会社コード", sapType: "CHAR" },
      { code: "BUTXT", label: "会社名", sapType: "CHAR" },
      { code: "LAND1", label: "国", sapType: "CHAR" },
      { code: "WAERS", label: "通貨", sapType: "CUKY" },
      { code: "KTOPL", label: "勘定表", sapType: "CHAR" },
    ],
  },
  {
    name: "T003T",
    subtitle: "伝票タイプ名称",
    color: "#14b8a6",
    primaryKey: ["SPRAS", "BLART"],
    columns: [
      { code: "SPRAS", label: "言語", sapType: "LANG" },
      { code: "BLART", label: "伝票タイプ", sapType: "CHAR" },
      { code: "LTEXT", label: "名称", sapType: "CHAR" },
    ],
  },
  {
    name: "SKA1",
    subtitle: "勘定マスタ",
    color: "#f59e0b",
    primaryKey: ["KTOPL", "SAKNR"],
    columns: [
      { code: "KTOPL", label: "勘定表", sapType: "CHAR" },
      { code: "SAKNR", label: "勘定番号", sapType: "CHAR" },
    ],
  },
  {
    name: "SKAT",
    subtitle: "勘定名称",
    color: "#eab308",
    primaryKey: ["SPRAS", "KTOPL", "SAKNR"],
    columns: [
      { code: "SPRAS", label: "言語", sapType: "LANG" },
      { code: "KTOPL", label: "勘定表", sapType: "CHAR", foreignKeys: [{ table: "T001", column: "KTOPL" }] },
      { code: "SAKNR", label: "勘定番号", sapType: "CHAR" },
      { code: "TXT20", label: "短名称", sapType: "CHAR" },
    ],
  },
  {
    name: "KNA1",
    subtitle: "得意先",
    color: "#f97316",
    primaryKey: "KUNNR",
    columns: [
      { code: "KUNNR", label: "得意先コード", sapType: "CHAR" },
      { code: "NAME1", label: "名称", sapType: "CHAR" },
    ],
  },
  {
    name: "LFA1",
    subtitle: "仕入先",
    color: "#ef4444",
    primaryKey: "LIFNR",
    columns: [
      { code: "LIFNR", label: "仕入先コード", sapType: "CHAR" },
      { code: "NAME1", label: "名称", sapType: "CHAR" },
    ],
  },
];

/** 仕訳日記帳演習②で SELECT / 結合に使う列だけ */
const JOURNAL_LEDGER_COLUMNS: Record<string, string[]> = {
  T001: ["BUKRS", "KTOPL", "WAERS"],
  T003T: ["SPRAS", "BLART", "LTEXT"],
  BKPF: ["BUKRS", "BELNR", "GJAHR", "BLART", "BUDAT", "BLDAT", "USNAM"],
  BSEG: ["BUKRS", "BELNR", "GJAHR", "BUZEI", "HKONT", "SHKZG", "DMBTR", "SGTXT"],
  SKAT: ["SPRAS", "KTOPL", "SAKNR", "TXT20"],
};

function schemasFromTables(
  tableNames: string[],
  columnFilter?: Record<string, string[]>,
): DatabaseSchemaInfo[] {
  const tables = FI_TABLES.filter((t) => tableNames.includes(t.name)).map((def) =>
    buildTable(def, columnFilter?.[def.name]),
  );
  const tableDisplayNames = new Set(tables.map((t) => t.name));

  const filteredTables = tables.map((table) => ({
    ...table,
    columns: table.columns.map((col) => ({
      ...col,
      foreignKeys: col.foreignKeys.filter((fk) => tableDisplayNames.has(fk.foreignTableName)),
    })),
  }));

  return [{ name: SCHEMA_NAME, tables: filteredTables }];
}

/** 主要テーブル全体の関連図（BKPF・BSEG・マスタ） */
export const sapFiOverviewSchemas = schemasFromTables([
  "BKPF",
  "BSEG",
  "T001",
  "T003T",
  "SKA1",
  "KNA1",
  "LFA1",
]);

export const sapFiBkpfSchemas = schemasFromTables(["BKPF"]);
export const sapFiBsegSchemas = schemasFromTables(["BSEG"]);
export const sapFiAcDocaSchemas = schemasFromTables(["ACDOCA"]);
export const sapFiMasterSchemas = schemasFromTables(["T001", "T003T", "SKA1"]);

/** 仕訳日記帳演習② — T001 / T003T / BKPF / BSEG / SKAT（演習で使う列のみ） */
export const sapFiJournalLedgerSchemas = schemasFromTables(
  ["T001", "T003T", "BKPF", "BSEG", "SKAT"],
  JOURNAL_LEDGER_COLUMNS,
);

export const sapFiErdTableColors = [
  "#4f46e5",
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#14b8a6",
  "#f59e0b",
  "#eab308",
  "#f97316",
  "#ef4444",
];
