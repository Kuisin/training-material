import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  LessonMeta,
  InfoPanel,
  LessonLinkButton,
  horizontalLineClasses,
  horizontalLineBorderColor,
  mountLesson,
} from "../../src/lesson";
import type { ReactNode } from "react";
import { cn } from "../../src/lib/cn";
import { lessonChapterLabel, lessonLinkChapterLabel } from "../../src/lib/courses";

const COURSE_SLUG = "abap-taining";

/** 一覧・ヘッダーと同じ course.json 採番で「第{n}章」 */
function ch(lessonFile: string, suffix = "") {
  return lessonChapterLabel(COURSE_SLUG, lessonFile, { suffix });
}

function linkLabel(lessonFile: string, description: string) {
  return lessonLinkChapterLabel(COURSE_SLUG, lessonFile, description);
}

const CH = {
  controlBasic: ch("09-control-flow"),
  controlAdv: ch("09-control-flow-advanced"),
  select: ch("06-select-from-db"),
  modularization: ch("10-modularization"),
} as const;

export const lessonMeta = {
  title: "レポート制御（応用）— 仕組み・フラグ・設計",
  meta: "初学者 · 20分",
};

const SORT_SORTED_ROWS = [
  { bukrs: "1000", belnr: "100001", amount: "158,000" },
  { bukrs: "1000", belnr: "100003", amount: "8,900" },
  { bukrs: "1000", belnr: "100005", amount: "2,480" },
  { bukrs: "2000", belnr: "100002", amount: "6,750" },
  { bukrs: "2000", belnr: "100004", amount: "4,200" },
] as const;

/** サプレス / AT制御 / フラグ — 使い分けの早見表 */
const TECHNIQUE_GUIDE = [
  {
    name: "サプレス",
    question: "同じ見出しを毎行書く必要がある？",
    mechanism: "前行と比べて同じ列を CLEAR",
    when: "一覧の見た目をすっきりさせたい",
  },
  {
    name: "AT制御",
    question: "グループの頭や末尾で別処理が要る？",
    mechanism: "SORT後、変わり目で AT … ENDAT.",
    when: "見出し・小計・総合計を差し込む",
  },
  {
    name: "フラグ",
    question: "ループ全体で「1件でも起きたか」を覚える？",
    mechanism: "該当時に lv_flag = 'X'",
    when: "ループ後にまとめて判断・メッセージ",
  },
] as const;

const CONTROL_IF_TRACE_ROWS = [
  {
    row: 1,
    bukrs: "1000",
    first: true,
    isNewBukrs: true,
    isEndOfBukrs: false,
    isLast: false,
    reason: "先頭行。前行なしなので NEW",
  },
  {
    row: 2,
    bukrs: "1000",
    first: false,
    isNewBukrs: false,
    isEndOfBukrs: false,
    isLast: false,
    reason: "前後とも1000なので境界ではない",
  },
  {
    row: 3,
    bukrs: "1000",
    first: false,
    isNewBukrs: false,
    isEndOfBukrs: true,
    isLast: false,
    reason: "次行が2000に変わるため END OF",
  },
  {
    row: 4,
    bukrs: "2000",
    first: false,
    isNewBukrs: true,
    isEndOfBukrs: false,
    isLast: false,
    reason: "前行が1000なので NEW",
  },
  {
    row: 5,
    bukrs: "2000",
    first: false,
    isNewBukrs: false,
    isEndOfBukrs: true,
    isLast: true,
    reason: "最終行。かつ2000グループ末尾",
  },
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
        <table className="w-full min-w-0 border-collapse text-left text-sm">{children}</table>
      </div>
    </figure>
  );
}

function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        horizontalLineClasses("strong"),
        "bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        className
      )}
    >
      {children}
    </th>
  );
}

const TRACE_SECTION_DIVIDER =
  "border-r-2 border-slate-200 dark:border-slate-600";

function Td({
  children,
  highlight = false,
  muted = false,
  className,
}: {
  children: ReactNode;
  highlight?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        horizontalLineClasses("normal"),
        "px-3 py-2",
        highlight && "bg-emerald-100/80 font-medium text-emerald-950 dark:bg-emerald-500/15 dark:text-emerald-100",
        muted && "text-slate-400 dark:text-slate-500",
        className
      )}
    >
      {children}
    </td>
  );
}

/** 入力データと IF 判定を1表にまとめたトレース（行高を自然に揃える） */
function IfDetectionTracePair() {
  return (
    <figure className="not-prose my-4">
      <div
        className={cn(
          "overflow-x-auto rounded-lg border shadow-sm",
          horizontalLineBorderColor
        )}
      >
        <table className="w-full min-w-176 border-collapse text-left text-sm">
          <thead>
            <tr>
              <th
                colSpan={4}
                className={cn(
                  horizontalLineClasses("normal"),
                  TRACE_SECTION_DIVIDER,
                  "bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                入力データ（SORT済み）
              </th>
              <th
                colSpan={7}
                className={cn(
                  horizontalLineClasses("normal"),
                  "bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                )}
              >
                IF判定で見える ATイベント
              </th>
            </tr>
            <tr>
              <Th className="w-10">行</Th>
              <Th className="w-14">会社</Th>
              <Th>伝票</Th>
              <Th className={TRACE_SECTION_DIVIDER}>金額</Th>
              <Th className="w-10">行</Th>
              <Th className="w-14">会社</Th>
              <Th className="w-14 text-center">FIRST</Th>
              <Th className="w-14 text-center">NEW</Th>
              <Th className="w-16 text-center">END OF</Th>
              <Th className="w-14 text-center">LAST</Th>
              <Th>判定理由</Th>
            </tr>
          </thead>
          <tbody>
            {CONTROL_IF_TRACE_ROWS.map((trace, index) => {
              const input = SORT_SORTED_ROWS[index];
              return (
                <tr key={trace.row}>
                  <Td className="tabular-nums">{trace.row}</Td>
                  <Td>{input.bukrs}</Td>
                  <Td className="whitespace-nowrap">{input.belnr}</Td>
                  <Td className={cn(TRACE_SECTION_DIVIDER, "whitespace-nowrap")}>{input.amount}</Td>
                  <Td className="tabular-nums">{trace.row}</Td>
                  <Td>{trace.bukrs}</Td>
                  <Td className="text-center" highlight={trace.first} muted={!trace.first}>
                    {trace.first ? "true" : "false"}
                  </Td>
                  <Td className="text-center" highlight={trace.isNewBukrs} muted={!trace.isNewBukrs}>
                    {trace.isNewBukrs ? "true" : "false"}
                  </Td>
                  <Td
                    className="text-center"
                    highlight={trace.isEndOfBukrs}
                    muted={!trace.isEndOfBukrs}
                  >
                    {trace.isEndOfBukrs ? "true" : "false"}
                  </Td>
                  <Td className="text-center" highlight={trace.isLast} muted={!trace.isLast}>
                    {trace.isLast ? "true" : "false"}
                  </Td>
                  <Td className="min-w-40 leading-snug">{trace.reason}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** 応用編の冒頭・末尾から基本編へ戻るリンク */
function BasicLink() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-taining"
        lessonFile="09-control-flow"
        label={`${CH.controlBasic}（基本編）に戻る`}
        variant="back"
      />
    </div>
  );
}

export default function ControlFlowAdvancedLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-taining",
        "09-control-flow-advanced",
        lessonMeta.title
      )}
      slides={[
        {
          title: "概要",
          plainText:
            "レポート制御（応用編）\n基本編で学んだサプレスとAT制御を土台に、もう一歩踏み込む。\n⏱ 20分 / 📶 初学者〜中級 / 🏷 ABAP研修\nこの応用編で学ぶこと\n・AT制御の内部の仕組み（IFで検知してみる）\n・フラグ（旗）を使った状態の管理\n・SY-SUBRCとフラグの役割の違い\n・多重ネストを避ける設計の意識\n基本編（サプレス・AT制御・SORT）が前提。",
          content: (
            <>
              <hgroup>
                <h1>レポート制御（応用編）</h1>
                <p>
                  基本編で学んだ<strong>サプレス</strong>と <code>AT</code> 制御を土台に、
                  仕組みの理解・状態管理・設計のコツへ一歩踏み込みます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者〜中級" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この応用編で学ぶこと</h3>
              <ul>
                <li><code>AT</code> 制御の内部の仕組み（IFで「何を検知しているか」を可視化）</li>
                <li>フラグ（旗）を使った状態の管理</li>
                <li><code>SY-SUBRC</code> とフラグの役割の違い</li>
                <li>多重ネストを避ける設計の意識</li>
              </ul>
              <h3>3つの技法の使い分け</h3>
              <SampleTable caption="迷ったときは「何を覚えたいか」で選ぶ" variant="default">
                <thead>
                  <tr>
                    <Th>技法</Th>
                    <Th>自分に問うこと</Th>
                    <Th>仕組み</Th>
                    <Th>向く場面</Th>
                  </tr>
                </thead>
                <tbody>
                  {TECHNIQUE_GUIDE.map((row) => (
                    <tr key={row.name}>
                      <Td>
                        <strong>{row.name}</strong>
                      </Td>
                      <Td>{row.question}</Td>
                      <Td>{row.mechanism}</Td>
                      <Td>{row.when}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Callout variant="note">
                このレッスンは<strong>{CH.controlAdv}（応用編）</strong>です（一覧のレッスン番号と同じ採番）。
                {CH.controlBasic}（基本編）のサプレス・<code>AT</code> 制御・<code>SORT</code> を学んだ前提で進みます。
                あいまいな箇所があれば、下のボタンから基本編に戻って確認してください。
              </Callout>
              <BasicLink />
              <Dialog speaker="teacher">
                ここからは「なぜそう動くのか」「実務でどう設計するか」に踏み込みます。
                新しい命令はほとんど増えません。<strong>見方の解像度を上げる</strong>回だと思ってください。
              </Dialog>
            </>
          ),
        },
        {
          title: "AT制御をIFで検知してみる",
          plainText:
            "上級者向け：AT制御をIFで再現\nAT FIRST/NEW/END OF/LASTは、実質的に『先頭か・前行と違うか・次行と違うか・最終行か』の判定。\nつまりAT制御は、自分の行番号と前後の行を見比べているだけ。\nAT NEW＝前と違う、AT END OF＝次と違う。\n前行・次行を比較するIFで書くと、何を検知しているかが明確になる。\n用途：デバッグ時に境界判定を可視化したいとき。\nBちゃん：魔法じゃなく『前の人・次の人と違う?』をたずねているだけなんですね。",
          content: (
            <>
              <h2>AT制御は何を検知しているか（IF版）</h2>
              <p>
                <code>AT FIRST</code> / <code>AT NEW</code> / <code>AT END OF</code> / <code>AT LAST</code>{" "}
                は、実は特別な魔法ではありません。やっていることは<strong>「自分の行番号」と「前後の行」を見比べる</strong>だけです。<code>AT NEW</code> は前の行と違うとき、<code>AT END OF</code> は次の行と違うとき。デバッグ時はこれをIFで書くと、境界条件が目で追えるようになります。
              </p>
              <InfoPanel
                title="上級者向けの補足"
                variant="reference"
                lead="このセクションは「AT制御の内部判定を理解したい人」向けです。"
              >
                <ul>
                  <li>
                    <strong>まずは通常の学習順</strong> … 実務では <code>AT FIRST</code> / <code>AT NEW</code> /{" "}
                    <code>AT END OF</code> / <code>AT LAST</code> をそのまま使えば十分です。
                  </li>
                  <li>
                    <strong>このページの目的</strong> … IF判定で「何を検知しているか」を可視化し、デバッグや設計レビューをしやすくすることです。
                  </li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`DATA lv_lines TYPE i.
lv_lines = lines( lt_out ).

LOOP AT lt_out INTO ls_out INDEX DATA(lv_idx).
  DATA(lv_is_first) = xsdbool( lv_idx = 1 ).
  DATA(lv_is_last)  = xsdbool( lv_idx = lv_lines ).

  DATA(lv_prev_bukrs) = VALUE bukrs( ).
  DATA(lv_next_bukrs) = VALUE bukrs( ).

  IF lv_idx > 1.
    lv_prev_bukrs = lt_out[ lv_idx - 1 ]-bukrs.
  ENDIF.
  IF lv_idx < lv_lines.
    lv_next_bukrs = lt_out[ lv_idx + 1 ]-bukrs.
  ENDIF.

  DATA(lv_is_new_bukrs)    = xsdbool( lv_idx = 1 OR lv_prev_bukrs <> ls_out-bukrs ).
  DATA(lv_is_end_of_bukrs) = xsdbool( lv_idx = lv_lines OR lv_next_bukrs <> ls_out-bukrs ).

  " ここでAT制御相当の処理を実行できる
ENDLOOP.`}
              />
              <h3>IFの変数とAT制御の対応</h3>
              <ul>
                <li>
                  <code>lv_is_first</code> … 行番号が1 → <code>AT FIRST</code> 相当
                </li>
                <li>
                  <code>lv_is_new_bukrs</code> … 先頭、または前行と会社が違う → <code>AT NEW bukrs</code> 相当
                </li>
                <li>
                  <code>lv_is_end_of_bukrs</code> … 最終行、または次行と会社が違う → <code>AT END OF bukrs</code> 相当
                </li>
                <li>
                  <code>lv_is_last</code> … 行番号が最終 → <code>AT LAST</code> 相当
                </li>
              </ul>
              <h3>検知結果トレース（5行サンプル）</h3>
              <IfDetectionTracePair />
              <Dialog speaker="b">
                先生、AT制御って内部では結局、何を見ているんですか？魔法みたいに感じます。
              </Dialog>
              <Dialog speaker="teacher">
                魔法ではありません。「自分は先頭？」「前の人と会社が違う？」「次の人と違う？」「自分は最後？」をたずねているだけです。上の表のとおりですね。
              </Dialog>
              <Dialog speaker="a">
                だから前後の行をのぞいて比べているんですね。<code>AT NEW</code> は「前と違う」、<code>AT END OF</code> は「次と違う」。仕組みが見えると、なぜ <code>SORT</code> が前提なのかも腑に落ちます。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。並んでいない＝前後がバラバラだと、この比較が意味を失います。実務ではAT制御を使い、設計確認や不具合調査ではこのIFトレースで判定根拠を可視化する、と使い分けるとよいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "フラグ（旗）",
          plainText:
            "フラグ ＝ 状態を覚えておく旗\nフラグは「ある状態が起きたか」を覚えておく小さな箱（多くは 'X' か空）。例：1件でもエラーがあったかを覚えておき最後にまとめて判断。\nDATA lv_error TYPE flag.\nLOOP AT lt_in INTO ls_in. IF ls_in-amount < 0. lv_error = 'X'. ENDIF. ENDLOOP.\nIF lv_error = 'X'. MESSAGE 'エラーが含まれています' TYPE 'I'. ENDIF.\nInfoPanel：フラグは1回以上起きたかだけ分かる。件数・該当行など詳細が必要ならカウンタや別テーブルを検討。\nBちゃん：あとで思い出すための付箋みたいなものですね。立てておいて最後に見る。",
          content: (
            <>
              <h2>フラグ ＝ 状態を覚えておく旗</h2>
              <p>フラグは「ある状態が起きたか」を覚えておく小さな箱（多くは <code>'X'</code> か空）。例：「1件でもエラーがあったか」を覚えておき、最後にまとめて判断します。</p>
              <CodeBlock
                language="ABAP"
                code={`DATA lv_error TYPE flag.        " 旗（'X' で立てる）

LOOP AT lt_in INTO ls_in.
  IF ls_in-amount < 0.
    lv_error = 'X'.            " エラーの旗を立てる
  ENDIF.
ENDLOOP.

IF lv_error = 'X'.
  MESSAGE 'エラーが含まれています' TYPE 'I'.
ENDIF.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>DATA lv_error TYPE flag.</code> … フラグ用の変数。空＝旗なし、<code>&apos;X&apos;</code>＝旗あり
                </li>
                <li>
                  <code>IF ls_in-amount &lt; 0.</code> … 金額がマイナスならエラー条件
                </li>
                <li>
                  <code>lv_error = &apos;X&apos;.</code> … 1件でも該当すれば旗を立てる（下ろさない限り立ったまま）
                </li>
                <li>
                  <code>IF lv_error = &apos;X&apos;.</code> … ループ後に旗を確認し、エラーがあったかまとめて判断
                </li>
              </ul>
              <Dialog speaker="b">
                先生、フラグって要するに何のためにあるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                「あとで思い出すための付箋」です。立てておいて、ループを抜けた後に見る。一度立てたら、下ろさない限り立ったままです。
              </Dialog>
              <Dialog speaker="a">
                だから「1件でも起きたか」を覚えるのに向くんですね。件数や行番号までは分からない、ということですか？
              </Dialog>
              <Dialog speaker="teacher">
                そのとおり。件数や該当行が要るときは、カウンタや別テーブルを使います（下の補足を参照）。
              </Dialog>
              <InfoPanel
                title="フラグで分かること・分からないこと"
                variant="reference"
                lead="フラグは「1回以上起きたかどうか」だけを覚えられます。それで足りない場面もあります。"
              >
                <ul>
                  <li>
                    <strong>分かること</strong> … エラーが1件でもあったか（はい／いいえ）
                  </li>
                  <li>
                    <strong>分からないこと</strong> … 何件エラーがあったか、どの行か、どんな種類か
                  </li>
                </ul>
                <p className="mb-2 mt-4 font-semibold">より詳しく知りたいとき</p>
                <ul>
                  <li>
                    <strong>件数が欲しい</strong> … カウンタ変数（例：<code>lv_error_cnt</code>）を用意し、該当するたびに{" "}
                    <code>lv_error_cnt = lv_error_cnt + 1.</code> する
                  </li>
                  <li>
                    <strong>該当行を残したい</strong> … エラー行だけ別の内部テーブルに{" "}
                    <code>APPEND</code> しておく
                  </li>
                  <li>
                    <strong>その場で行番号を知らせたい</strong> … ループの中でメッセージを出す（旗だけに頼らない）
                  </li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "表示フラグについて",
          plainText: `表示フラグのさわり（${CH.controlAdv}応用編）。${CH.controlBasic}基本編でAT NEW内で見出しを戻した。AT NEWの中は旗だけ・値はENDATの外。中でgs_outを読むと*が混ざるため。詳細は特別演習③。`,
          content: (
            <>
              <h2>表示フラグ</h2>
              <p>
                <strong>{CH.controlBasic}（基本編）</strong>では、<code>AT NEW</code> の<strong>中で</strong>見出し列を戻しました。
                伝票見出しのように<strong>列が多い帳票</strong>や<strong>改ページで見出しを出し直す</strong>場面では、
                もう一段の書き方<strong>表示フラグ</strong>に進むことがあります。
                ここでは役割だけ押さえます。
              </p>
              <InfoPanel
                title="表示フラグとは"
                variant="reference"
                lead="「この行で、どの見出し列を出すか」を覚える小さなスイッチです。"
              >
                <ul>
                  <li>
                    <code>AT NEW</code> の<strong>中</strong> … 値は読まず、<strong>旗（表示フラグ）だけ立てる</strong>
                  </li>
                  <li>
                    <code>ENDAT</code> の<strong>外</strong> … 旗が立った列だけ、作業領域に値をセットして <code>WRITE</code>
                  </li>
                  <li>
                    ループの先頭で旗をいったん消す → 変わり目で必要な旗だけ立てる → 帳票の「—」と同じ考え方
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                <strong>なぜ中で「値」を読まないのか</strong>：<code>AT NEW … ENDAT</code> の<strong>内側</strong>では、
                制御項目より<strong>右側</strong>の作業領域が <code>*</code> で埋まる ABAP の仕様があります。
                中で <code>gs_out</code> の項目を読むと、<strong>本当の値ではない</strong>ことがあります。
                だから「中は旗だけ・値は <code>ENDAT</code> の外」が帳票サプレスの定石です。
              </Callout>
              <Callout variant="note">
                <strong>{CH.controlAdv}（応用編）の「フラグ」とは別物</strong>：さきほどの <code>TYPE flag</code>（<code>&apos;X&apos;</code>）は、
                ループ<strong>後</strong>に「1件でも起きたか」を覚える旗です。
                表示フラグは<strong>行ごと</strong>に「どの列を出すか」を決める旗。名前は同じでも用途が違います。
              </Callout>
              <Dialog speaker="b">
                {CH.controlBasic}（基本編）の「<code>AT NEW</code> でその場で戻す」と、表示フラグ版はどう違うんですか？
              </Dialog>
              <Dialog speaker="teacher">
                考え方は同じ「変わり目だけ出す」です。書き方が、<strong>その場で1列戻す</strong>から、
                <strong>先に「出す列」を決めてからまとめてセット</strong>に変わるイメージです。
                列が増えたり、改ページで全部出し直したりするときに効きます。
              </Dialog>
              <Dialog speaker="a">
                じゃあ応用編では触らず、演習で手を動かす感じですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。手順とコードは<strong>特別演習③</strong>で扱います。
                今日は「そういう第二段がある」と分かっていれば十分です。
              </Dialog>
              <div className="mt-4">
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="94-exercise-journal-ledger-control-break"
                  label="特別演習③で詳しく学ぶ"
                  variant="forward"
                />
              </div>
            </>
          ),
        },
        {
          title: "SY-SUBRCだけでは足りない時",
          plainText:
            "「取れた／取れない」だけでは足りない場面\nSY-SUBRC は直前の1回の処理の成否。READ TABLEで見つからなければ4、見つかれば0。\nループで100件読んでも、最後のSY-SUBRCは最後の1回分だけ。1件でも見つからなかったかはフラグで覚える。\n先生：1回ごとの成否＝SY-SUBRC、流れ全体の状態＝フラグ。役割が違うので両方使う。",
          content: (
            <>
              <h2>「取れた／取れない」だけでは足りない場面</h2>
              <p>
                <code>SY-SUBRC</code> の基本は<strong>{CH.select}</strong>（<code>SELECT</code> のあとで確認）で学びました。
                ここでは、ループの<strong>あと</strong>まで状態を覚えておく話を足します。
              </p>
              <p>
                <code>SY-SUBRC</code> は<strong>直前の1回の処理</strong>の成否だけを表します。
                ループの中で何度も <code>READ TABLE</code> しても、ループを抜けたあとの <code>SY-SUBRC</code> は<strong>最後に実行した1回分</strong>の結果です。
                「100件のうち1件でもマスタに無かったか」は、フラグで自分が覚えておく必要があります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA lv_missing TYPE flag.

LOOP AT lt_doc INTO ls_doc.
  READ TABLE lt_matnr WITH KEY matnr = ls_doc-matnr TRANSPORTING NO FIELDS.
  IF sy-subrc <> 0.
    lv_missing = 'X'.    " この1回は見つからなかった（直前の成否）
  ENDIF.
ENDLOOP.

" ここでの sy-subrc は「最後の READ TABLE 1回分」だけ
IF lv_missing = 'X'.
  MESSAGE '存在しない品目が含まれています' TYPE 'I'.
ENDIF.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>READ TABLE … IF sy-subrc &lt;&gt; 0.</code> … この行のマスタ有無を<strong>その場で</strong>判定（1回の成否）
                </li>
                <li>
                  <code>lv_missing = &apos;X&apos;.</code> … 1件でも該当したら旗を立て、ループ後まで状態を保持
                </li>
                <li>
                  ループ後の <code>IF lv_missing = &apos;X&apos;.</code> … <strong>全体を通した結果</strong>でメッセージや処理分岐
                </li>
              </ul>
              <InfoPanel title="SY-SUBRC とフラグの対比" variant="reference" lead="役割が違うので、必要に応じて両方使います。">
                <ul>
                  <li>
                    <strong>SY-SUBRC</strong> … 直前の1命令の結果（0＝成功、4＝該当なし など）。都度確認する
                  </li>
                  <li>
                    <strong>フラグ</strong> … ループ全体で「一度でも起きたか」を後ろまで運ぶ
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                先生、ループの最後で <code>SY-SUBRC</code> を見れば、途中で失敗した件も分かりませんか？
              </Dialog>
              <Dialog speaker="teacher">
                それが分からないんです。<code>SY-SUBRC</code> は「最後の1回」の結果だけ。途中で1件失敗していても上書きされます。だから旗で覚えておく必要があります。
              </Dialog>
              <Dialog speaker="b">
                なるほど。1回ごとの成否は <code>SY-SUBRC</code>、流れ全体の状態はフラグ、と役割が違うんですね。
              </Dialog>
              <div className="mt-4">
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="06-select-from-db"
                  label={linkLabel("06-select-from-db", "SY-SUBRC の基本を復習する")}
                  variant="back"
                />
              </div>
            </>
          ),
        },
        {
          title: "多重ネストを避ける",
          plainText:
            "入れ子を深くしすぎない\n深いネスト：条件を満たさない行もさらに内側のIFまで読ませる。\nCONTINUE版：対象外は先に弾いてから本処理。読む人は『この行は処理対象』だけ追えばよい。\nつまずき：とりあえず IF を足すを繰り返すと3ヶ月後に誰も読めないコードに。→ 深くなったら分け方を見直すサイン。",
          content: (
            <>
              <h2>入れ子を深くしすぎない</h2>
              <p>
                <code>IF</code> の中に <code>IF</code>、さらにその中に <code>IF</code>…と深くなると、
                「この行は処理対象か？」を追うのが大変になります。
                <strong>対象外を先に弾く</strong>（<code>CONTINUE</code>）と、本処理だけが左に揃って読みやすくなります。
              </p>
              <h3>❌ ネストが深い例</h3>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_out INTO ls_out.
  IF ls_out-bukrs IS NOT INITIAL.
    IF ls_out-amount > 0.
      IF ls_out-blart = 'SA'.
        " ここだけ本当にやりたい処理
        WRITE: / ls_out-belnr, ls_out-amount.
      ENDIF.
    ENDIF.
  ENDIF.
ENDLOOP.`}
              />
              <h3>✅ CONTINUE で浅くする例</h3>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_out INTO ls_out.
  IF ls_out-bukrs IS INITIAL.
    CONTINUE.
  ENDIF.
  IF ls_out-amount <= 0.
    CONTINUE.
  ENDIF.
  IF ls_out-blart <> 'SA'.
    CONTINUE.
  ENDIF.

  " 対象行だけが残る — 本処理は1段のまま
  WRITE: / ls_out-belnr, ls_out-amount.
ENDLOOP.`}
              />
              <ul>
                <li>
                  <code>CONTINUE.</code> … この行の残りの処理をスキップし、次の行へ（「対象外なら早退」）
                </li>
                <li>ネストの代わりに「ガード条件を上に並べる」と、本処理のインデントが浅く保てます</li>
                <li>サプレスの多重 IF も同じ発想。上位が違えば下位は必ず表示、という階層ルールを先に決める</li>
              </ul>
              <Dialog speaker="b">
                先生、<code>CONTINUE</code> で先に弾くのと <code>IF</code> で囲うのは、結果は同じですよね？なぜわざわざ書き換えるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                結果は同じでも、読みやすさが違います。対象外を先に弾くと、本処理が左に揃って「この行は処理対象」だとすぐ分かります。
              </Dialog>
              <Dialog speaker="stumble">
                「とりあえず IF を足す」を繰り返すと、3ヶ月後に誰も読めないコードに。→ 深くなったら「分け方を見直すサイン」です。
              </Dialog>
              <Dialog speaker="a">
                ネストの深さは“複雑さのメーター”だと思えば良いんですね。浅いほど健全。
              </Dialog>
              <Dialog speaker="teacher">
                いいまとめです。深くなってきたら、条件を先に判定して抜ける／処理を FORM やメソッドに分ける、を検討してください。
                <strong>{CH.modularization}</strong>（モジュール化 — 分かりやすくする）にもつながります。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理（質問でおさらい）\nQ この章を一言で？→ 変わり目を捕まえて表示や集計を制御する（並び順が正しいときだけ意味を持つ）。\nQ SY-SUBRCとフラグの使い分けは？→ 1回ごとの成否はSY-SUBRC、流れ全体の状態はフラグ。\nQ ネストが深くなったら？→ 対象外を先に弾く・処理を分けて浅く保つ。",
          content: (
            <>
              <h2>対話で整理（質問でおさらい）</h2>
              <Dialog speaker="b">
                先生、{CH.controlBasic}・{CH.controlAdv}を合わせて一言でまとめると何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                「変わり目を捕まえて、表示や集計を制御する」。ただし <code>AT FIRST</code> / <code>AT NEW</code> / <code>AT END OF</code> / <code>AT LAST</code> は、並び順が正しいときだけ意味を持ちます。
              </Dialog>
              <Dialog speaker="a">
                <code>SY-SUBRC</code> とフラグの使い分けは、どう覚えればいいですか？
              </Dialog>
              <Dialog speaker="teacher">
                1回ごとの成否は <code>SY-SUBRC</code>、流れ全体の状態はフラグ。役割を分けると責務がはっきりします。
              </Dialog>
              <Dialog speaker="b">
                条件が増えてネストが深くなったら？
              </Dialog>
              <Dialog speaker="teacher">
                対象外を先に弾く、処理を分ける。浅く保つのが鉄則です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック（応用編）\nQ1 1件でもエラーがあったかを覚えるのに向くのは？→ フラグ（旗）を使う\nQ2 IF版で AT NEW に相当する判定は？→ 先頭、または前行とキーが違う\nQ3 SY-SUBRC とフラグの役割の違いは？→ SY-SUBRCは1回の成否、フラグは流れ全体の状態\nQ4 IF のネストが深くなったときの対処は？→ 早めに抜ける/処理を分けて浅く保つ\n今日のひとこと：応用編は『なぜそう動くか』と『どう設計するか』。基本編と往復すると定着する。",
          content: (
            <>
              <h2>理解度チェック（応用編）</h2>
              <Quiz
                answer={1}
                explanation="フラグは流れ全体の状態（1件でも問題があったか等）を覚えておく旗。1回ごとの成否を表す SY-SUBRC とは役割が違います。"
                question={<strong>「複数件のうち1件でもエラーがあったか」を覚えておくのに向くのは？</strong>}
                options={["SY-SUBRC を見るだけ", "フラグ（旗）を使う", "ULINE を引く"]}
              />
              <Quiz
                answer={0}
                explanation="IF版では、AT NEW は『先頭行、または前の行とキーが違う』と等価です。AT END OF は『最終行、または次の行とキーが違う』。前後の行と比べているだけなので、SORT が前提になります。"
                question={<strong>IFで書き直すと、<code>AT NEW bukrs</code> に相当する判定は？</strong>}
                options={[
                  "先頭行、または前行と会社コードが違う",
                  "最終行、または次行と会社コードが違う",
                  "金額がマイナスの行",
                ]}
              />
              <Quiz
                answer={2}
                explanation="SY-SUBRC は直前の1回の処理の成否を表すだけ。複数件を通した『全体の状態』は自分でフラグに覚えさせます。役割が違うので両方を使い分けます。"
                question={<strong><code>SY-SUBRC</code> とフラグの役割の違いとして正しいのは？</strong>}
                options={[
                  "どちらも同じで、好みで選んでよい",
                  "SY-SUBRC は全体の状態、フラグは1回の成否",
                  "SY-SUBRC は1回の成否、フラグは流れ全体の状態",
                ]}
              />
              <Quiz
                answer={1}
                explanation="ネストが深くなったら、条件を先に判定して CONTINUE などで早めに抜ける／処理を分ける、で浅く保ちます。『とりあえず IF を足す』の繰り返しは可読性を下げます。"
                question={<strong>IF のネストが深くなってきたときの対処として適切なのは？</strong>}
                options={[
                  "さらに IF を足して条件を細かくする",
                  "早めに抜ける／処理を分けて浅く保つ",
                  "すべての IF を1行にまとめる",
                ]}
              />
              <Callout variant="tip">
                演習で手を動かすなら、特別演習③（伝票見出しをまとめる）が{CH.controlBasic}・{CH.controlAdv}の内容と直結しています。
              </Callout>
              <div className="mt-4 flex flex-wrap gap-2">
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="10-modularization"
                  label={linkLabel("10-modularization", "モジュール化へ進む")}
                  variant="forward"
                />
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="94-exercise-journal-ledger-control-break"
                  label="特別演習③へ（コントロールレベル出力）"
                  variant="forward"
                />
                <BasicLink />
              </div>
              <Dialog speaker="closing">
                {CH.controlAdv}（応用編）は「なぜそう動くのか」と「どう設計するか」。{CH.controlBasic}（基本編）と往復すると、制御の理解がぐっと定着します。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ControlFlowAdvancedLesson);
