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

export default function CombineDataLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "08-combine-data", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "複数データをまとめる\nバラバラの情報（ヘッダと明細）を、1行ずつ見やすい一覧に整える章です。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・取得用と出力用の「棚」を分ける\n・データを移す命令（MOVE / MOVE-CORRESPONDING）\n・1行ずつ追加・片付け（APPEND / CLEAR / REFRESH）\nBちゃん：前の章まででなんとかついてきたけど…今回は難しそう。\n先生：難しい章です。でも覚えることは3つだけ。棚を分ける→1行を組み立てる→追加して片付ける。\nBちゃん：3つだけなら、深呼吸して挑戦します。",
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
          title: "LOOPの中で組み立てる",
          plainText:
            "実際の流れ：LOOPの中で1行ずつ\nLOOP AT lt_bseg INTO ls_bseg. READ TABLE lt_bkpf INTO ls_bkpf WITH KEY ... MOVE-CORRESPONDING ls_bkpf TO ls_out. ls_out-amount = ls_bseg-dmbtr. APPEND ls_out TO lt_out. CLEAR ls_out. ENDLOOP.\nBちゃん：明細1行ずつ、対応ヘッダを探して出力1行を作る？\n先生：その通り。明細1行につき出力1行。これがこの章の実務パターン。\nBちゃん：中身は長いけど、やってることは「組み立て→追加→クリア」の繰り返しだけ？\n先生：まさに。コードが長く見えても中身は同じリズム。",
          content: (
            <>
              <h2>実際の流れ：<code>LOOP</code> の中で1行ずつ</h2>

              <h3>解説</h3>
              <p>
                ここまでの命令が、<code>LOOP</code> の中で<strong>1行ずつ繰り返されます</strong>。
                明細を1行ずつ取り出し、対応するヘッダを <code>READ TABLE</code> で探し、
                出力行を組み立てて <code>lt_out</code> へ <code>APPEND</code>——このリズムが実務パターンです。
              </p>
              <Dialog speaker="b">
                明細を1行ずつめくりながら、対応するヘッダを探す——
                トランプをめくりながら、ペアのカードを探す感じ？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。明細1行につき、出力も1行。
                ヘッダは <code>READ TABLE</code> で「この明細の親」を1行だけ取り出します。
              </Dialog>
              <Dialog speaker="b">
                コードは長く見えますけど、やってることは「組み立て → 追加 → クリア」の繰り返しだけ、ですね？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。命令が増えて見えても、<strong>リズムは1つ</strong>。
                怖がらず、1ブロックずつ「何をしているか」を声に出して読んでみてください。
              </Dialog>

              <h3>例：LOOP のコード</h3>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_bseg INTO ls_bseg.          " 明細を1行ずつ作業領域へ

  READ TABLE lt_bkpf INTO ls_bkpf         " 対応するヘッダを1行取得
    WITH KEY bukrs = ls_bseg-bukrs
             belnr = ls_bseg-belnr
             gjahr = ls_bseg-gjahr.
  IF sy-subrc <> 0. CONTINUE. ENDIF.      " 見つからなければ次の明細へ

  MOVE-CORRESPONDING ls_bkpf TO ls_out.   " ヘッダの同名項目をコピー
  ls_out-amount = ls_bseg-dmbtr.          " 金額は手動で移す

  APPEND ls_out TO lt_out.                " 出力テーブルへ追加
  CLEAR ls_out.                           " 作業領域を空にして次の行へ

ENDLOOP.`}
              />
              <ul>
                <li>
                  <code>LOOP AT lt_bseg INTO ls_bseg.</code> … 明細取得用から1行ずつ <code>ls_bseg</code> へ
                </li>
                <li>
                  <code>READ TABLE ... WITH KEY ...</code> … いまの明細に対応するヘッダを1行だけ取得
                </li>
                <li>
                  <code>MOVE-CORRESPONDING</code> ＋ 個別代入 … <code>ls_out</code> で1行を組み立て
                </li>
                <li>
                  <code>APPEND</code> → <code>CLEAR</code> … <code>lt_out</code> へ追加して、<code>ls_out</code> を片付け
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "図解：取得→対応付け→蓄積",
          plainText:
            "図で見る：まとめる流れ\nflowchart：ヘッダ取得＋明細取得 → 1行を組み立て → APPENDで蓄積 → CLEARして次の行へ → 繰り返し\nBちゃん：フォルダから1枚→家計簿の1行を組み立て→追加→机を空に、を繰り返すだけ？\n先生：その通り。通帳コピーと家計簿のたとえで、このリズムが核心。\nBちゃん：図とコード、両方見ると頭の中でつながりました。",
          content: (
            <>
              <h2>図で見る：まとめる流れ</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A[ヘッダ取得] --> C[1行を組み立て]
  B[明細取得] --> C
  C --> D[APPEND で蓄積]
  D --> E[CLEAR して次の行へ]
  E --> C`}
              />
              <Figure
                src="image/08-header-detail-join.webp"
                alt="lt_bkpf（ヘッダ行）とlt_bseg（明細行）から、MOVE-CORRESPONDINGと個別代入で1行(ls_out)を組み立て、APPENDでlt_out（出力テーブル）に積み上げていく流れの図。"
                caption="ヘッダ＋明細 → 1行を組み立て（MOVE-CORRESPONDING＋個別代入）→ APPENDで蓄積"
                kind="diagram"
              />
              <Dialog speaker="b">
                通帳コピーのフォルダから1枚取る → 家計簿の1行を組み立てる → 家計簿へ追加 → 机を空にする——
                これを繰り返すだけ？
              </Dialog>
              <Dialog speaker="teacher">
                その通り。このリズムがこの章の核心です。前のスライドのコードも、
                この図の <code>C → D → E → C</code> を <code>LOOP</code> の中で回しているだけです。
              </Dialog>
              <Dialog speaker="b">
                図とコード、両方見ると頭の中でつながりました。単独だと難しかったです…。
              </Dialog>
              <Callout variant="tip">
                この章のABAPキーワード：<code>MOVE</code> / <code>MOVE-CORRESPONDING</code> / <code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>。
                全部覚えなくてOK。まずは <strong>組み立て → APPEND → CLEAR</strong> だけ口ぐせに。
              </Callout>
            </>
          ),
        },
        {
          title: "ミニ演習",
          plainText:
            "確認質問＆ミニ演習\n先生の問い：1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？\nBちゃん：家計簿へ1行追加したら、次の行を書く前に机を空に…つまり CLEAR？\n先生：正解！組み立て→APPEND→CLEAR を口ぐせにすれば混ざる事故はほぼ防げます。\nBちゃん：最初は APPEND だけで終わっちゃいそうでした。クリア、忘れやすい。",
          content: (
            <>
              <h2>確認質問＆ミニ演習</h2>
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
                その通りです。細かい点は3つだけ。<br />
                ① 同名項目は <code>MOVE-CORRESPONDING</code>、違う名前は手動で移す。<br />
                ② 取得用テーブルは触らない。<br />
                ③ <code>APPEND</code> のあとは必ず <code>CLEAR</code>。
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
            "コード早見表（チートシート）\n出力行の型：TYPES BEGIN OF ty_out ... END OF ty_out.\n変数宣言：lt_bkpf / lt_bseg / lt_out と ls_bkpf / ls_bseg / ls_out\nMOVE-CORRESPONDING ls_bkpf TO ls_out. / ls_out-amount = ls_bseg-dmbtr.\nAPPEND ls_out TO lt_out. / CLEAR ls_out.\nLOOP：明細LOOP→READ TABLEヘッダ→組み立て→APPEND→CLEAR\nリズム：組み立て → APPEND → CLEAR\n先生：テスト前にこの一覧を見返してください。",
          content: (
            <>
              <h2>コード早見表</h2>
              <p>
                この章で使うコードを一覧にまとめました。チートシートとして見返してください。
              </p>

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
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（ty_out 型の行を複数）

DATA ls_bkpf TYPE bkpf.            " ヘッダ1行（作業領域）
DATA ls_bseg TYPE bseg.            " 明細1行（作業領域）
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
                    <code>LOOP AT lt_bseg INTO ls_bseg.</code> … 明細を1行ずつ処理
                  </li>
                  <li>
                    <code>READ TABLE lt_bkpf INTO ls_bkpf WITH KEY ...</code> … 対応ヘッダを1行取得{" "}
                    <strong>⚠️ <code>sy-subrc</code> を確認</strong>
                  </li>
                </ul>
              </InfoPanel>

              <h3>LOOP の型（この章の核心）</h3>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_bseg INTO ls_bseg.

  READ TABLE lt_bkpf INTO ls_bkpf
    WITH KEY bukrs = ls_bseg-bukrs
             belnr = ls_bseg-belnr
             gjahr = ls_bseg-gjahr.
  IF sy-subrc <> 0. CONTINUE. ENDIF.

  MOVE-CORRESPONDING ls_bkpf TO ls_out.
  ls_out-amount = ls_bseg-dmbtr.

  APPEND ls_out TO lt_out.
  CLEAR ls_out.

ENDLOOP.`}
              />

              <Callout variant="tip">
                覚えるのはリズムだけ：<strong>組み立て → APPEND → CLEAR</strong>。
                通帳コピーと家計簿のたとえで言えば、フォルダから1枚 → 家計簿へ1行追加 → 机を空にする、の繰り返しです。
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
