import { RelationshipDiagram } from "react-erd";
import "react-erd/dist/style.css";
import {
  sapFiAcDocaSchemas,
  sapFiBkpfSchemas,
  sapFiBsegSchemas,
  sapFiErdTableColors,
  sapFiJournalLedgerHeaderSchemas,
  sapFiJournalLedgerSchemas,
  sapFiMasterSchemas,
  sapFiOverviewSchemas,
} from "../lib/sap-fi-erd";
import { ExpandableFullscreen } from "./expandable-fullscreen";
import { SapErdDiagramHelp } from "./sap-erd-diagram-help";

export type SapErdDiagramVariant =
  | "overview"
  | "bkpf"
  | "bseg"
  | "acdoca"
  | "master"
  | "journalLedger"
  | "journalLedgerHeader";

const SCHEMAS_BY_VARIANT = {
  overview: sapFiOverviewSchemas,
  bkpf: sapFiBkpfSchemas,
  bseg: sapFiBsegSchemas,
  acdoca: sapFiAcDocaSchemas,
  master: sapFiMasterSchemas,
  journalLedger: sapFiJournalLedgerSchemas,
  journalLedgerHeader: sapFiJournalLedgerHeaderSchemas,
} as const;

const TITLE_BY_VARIANT: Record<SapErdDiagramVariant, string> = {
  overview: "会計テーブル関連図（BKPF / BSEG / マスタ）",
  bkpf: "BKPF — 会計伝票ヘッダ",
  bseg: "BSEG — 会計伝票明細",
  acdoca: "ACDOCA — Universal Journal",
  master: "マスタ・辞書テーブル（T001 / T003T / SKA1）",
  journalLedger: "仕訳日記帳演習② — テーブル関連図",
  journalLedgerHeader: "仕訳日記帳演習① — テーブル関連図",
};

interface SapErdDiagramProps {
  variant: SapErdDiagramVariant;
  /** スライド内の表示高さ（px）。省略時 480 */
  height?: number;
  /** 全画面ヘッダー用タイトル（省略時は variant から自動） */
  title?: string;
}

/**
 * 研修スライド用の読み取り専用 ER 図（[react-erd](https://github.com/CNimmo16/react-erd)）。
 * 列は「日本語名 (列コード)」。右上の「全画面」で拡大表示できる。
 */
export function SapErdDiagram({ variant, height = 480, title }: SapErdDiagramProps) {
  const schemas = SCHEMAS_BY_VARIANT[variant];
  const displayTitle = title ?? TITLE_BY_VARIANT[variant];

  return (
    <ExpandableFullscreen
      title={displayTitle}
      inlineHeight={height}
      panelClassName="sap-erd-diagram h-full w-full"
      descriptionLabel="ER図の見方・記号の説明"
      collapsibleDescription={<SapErdDiagramHelp />}
      renderContent={() => (
        <div className="sap-erd-diagram sap-erd-diagram--view-only h-full w-full">
          <RelationshipDiagram schemas={schemas} tableColors={sapFiErdTableColors} />
        </div>
      )}
    />
  );
}
