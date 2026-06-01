import type { QuizLevel } from "../../src/components/quiz-level-badge";

export interface AssessmentQuizSingle {
  level: "basic";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface AssessmentQuizMulti {
  level: Exclude<QuizLevel, "basic">;
  question: string;
  options: string[];
  answers: number[];
  explanation: string;
}

export type AssessmentQuiz = AssessmentQuizSingle | AssessmentQuizMulti;

export function isMultiQuiz(q: AssessmentQuiz): q is AssessmentQuizMulti {
  return q.level !== "basic";
}

export interface LessonAssessmentData {
  num: string;
  title: string;
  summary: string;
  /** code = ABAP コード組み立て / flow = 手順・概念の並べ替え */
  arrangeKind: "code" | "flow";
  codeInstruction: string;
  codeLines: string[];
  quizzes: AssessmentQuiz[];
}

export const ASSESSMENTS: LessonAssessmentData[] = [
  {
    num: "0",
    title: "ABAP開発の役割",
    summary: "業務の要望をシステムの動きに翻訳する、という開発の流れを確認します。",
    arrangeKind: "flow",
    codeInstruction: "開発の流れが正しい順番になるよう、一覧から選んで組み立ててください",
    codeLines: [
      "業務担当の要望をヒアリングする。",
      "要件を整理し、システムの動きに翻訳する。",
      "ABAP でプログラムを実装する。",
      "テストで動作を確認する。",
      "本番リリースする。",
    ],
    quizzes: [
      {
        level: "basic",
        question: "ABAP 開発者の主な仕事は何ですか？",
        options: [
          "業務の要望をプログラムの動きに翻訳する",
          "ハードウェアの修理をする",
          "会計仕訳の最終判断を下す",
        ],
        answer: 0,
        explanation: "ABAP 開発者は業務の要望をシステム（コード）の動きに翻訳するのが主な役割です。",
      },
      {
        level: "intermediate",
        question: "ABAP 開発者の役割として正しいものは？（複数選択）",
        options: [
          "業務の要望をコードに翻訳する",
          "データベースの物理設計だけを担当する",
          "テスト可能な形でプログラムを届ける",
          "業務担当の代わりに会計判断を下す",
        ],
        answers: [0, 2],
        explanation:
          "要望の翻訳とテスト可能な成果物の提供が役割です。DB 物理設計のみや会計判断は主たる役割ではありません。",
      },
      {
        level: "advanced",
        question: "要件が曖昧なとき、開発者として適切な対応は？（複数選択）",
        options: [
          "そのまま実装を始めて後から調整する",
          "業務担当と確認し、入力・出力・例外を具体化する",
          "テスト観点を早い段階で共有する",
          "仕様を暗黙の了解に任せる",
        ],
        answers: [1, 2],
        explanation:
          "曖昧な要件のまま実装すると手戻りが増えます。具体化とテスト観点の共有が重要です。",
      },
    ],
  },
  {
    num: "1",
    title: "コース全体像",
    summary: "レポート処理の基本フロー「入力→取得→加工→出力」を確認します。",
    arrangeKind: "flow",
    codeInstruction: "レポート処理の流れが正しい順番になるよう組み立ててください",
    codeLines: [
      "選択画面で条件を入力する。",
      "SELECT でデータを取得する。",
      "LOOP でデータを加工する。",
      "WRITE で帳票に出力する。",
    ],
    quizzes: [
      {
        level: "basic",
        question: "照会レポートの基本フローで、DB からデータを取る工程は？",
        options: ["SELECT（取得）", "WRITE（出力）", "COMMIT（確定）"],
        answer: 0,
        explanation: "DB からの読み取りは SELECT が担います。WRITE は出力、COMMIT は更新確定です。",
      },
      {
        level: "intermediate",
        question: "このコースで扱う2種類のプログラムとして正しいものは？（複数選択）",
        options: [
          "照会（データを取得して表示する）",
          "登録（データをシステムに書き込む）",
          "OS のカーネル開発",
          "フロントエンドの CSS 設計",
        ],
        answers: [0, 1],
        explanation: "このコースでは照会レポートと会計伝票登録の2パターンを学びます。",
      },
      {
        level: "advanced",
        question: "「入力→取得→加工→出力」の各段階で起きうる問題として正しいものは？（複数選択）",
        options: [
          "入力条件が不足していて対象データが絞れない",
          "取得列が多すぎて性能が悪化する",
          "加工ロジックの誤りで表示内容が業務と合わない",
          "出力が見やすくてもデータが間違っていれば問題ない",
        ],
        answers: [0, 1, 2],
        explanation:
          "各段階に品質リスクがあります。データの正しさと見やすさは両方必要です。",
      },
    ],
  },
  {
    num: "2",
    title: "会計の基本",
    summary: "伝票のヘッダ（BKPF）と明細（BSEG）の関係を確認します。",
    arrangeKind: "flow",
    codeInstruction: "会計伝票のデータ構造が正しい順番・関係になるよう組み立ててください",
    codeLines: [
      "BKPF に伝票ヘッダ（日付・会社コードなど）を保持する。",
      "BSEG に伝票明細（勘定・金額など）を保持する。",
      "ヘッダと明細は伝票番号（BELNR）で紐づく。",
      "1 伝票に複数の明細行がある。",
    ],
    quizzes: [
      {
        level: "basic",
        question: "会計伝票の「ヘッダ」と「明細」の関係として正しいのは？",
        options: [
          "1 伝票にヘッダ1行と明細が複数行ある",
          "1 伝票に明細は必ず1行だけ",
          "ヘッダと明細は無関係",
        ],
        answer: 0,
        explanation: "1 伝票はヘッダ1行＋明細複数行が基本構造です。",
      },
      {
        level: "intermediate",
        question: "仕訳日記帳・会計伝票について正しいものは？（複数選択）",
        options: [
          "ヘッダは 1 伝票につき 1 行",
          "明細は 1 伝票につき 1 行だけ",
          "明細には勘定科目と金額が入る",
          "借方と貸方のバランスが重要",
        ],
        answers: [0, 2, 3],
        explanation: "明細は複数行あり得ます。勘定・金額・借贷バランスが重要です。",
      },
      {
        level: "advanced",
        question: "BKPF/BSEG を使った開発で考慮すべき点は？（複数選択）",
        options: [
          "BELNR でヘッダと明細を結合する必要がある",
          "明細だけ取得すればヘッダ情報は不要",
          "会社コード・年度などヘッダ項目も一覧に出す場面がある",
          "明細行数が多いほど結合処理の設計が重要になる",
        ],
        answers: [0, 2, 3],
        explanation:
          "ヘッダと明細はキーで結合します。一覧ではヘッダ項目も必要で、行数が多いほど結合設計が効きます。",
      },
    ],
  },
  {
    num: "3",
    title: "最初のABAP",
    summary: "レポートプログラムの骨格（REPORT → DATA → 処理）を確認します。",
    arrangeKind: "code",
    codeInstruction: "レポートが正しく動く順番に組み立ててください",
    codeLines: [
      "REPORT z_journal.",
      "DATA lt_bkpf TYPE TABLE OF bkpf.",
      "SELECT * FROM bkpf INTO TABLE lt_bkpf.",
      "LOOP AT lt_bkpf INTO DATA(ls_bkpf).",
      "  WRITE: / ls_bkpf-belnr.",
      "ENDLOOP.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "ABAP レポートプログラムの先頭で宣言する命令は？",
        options: ["REPORT", "SELECT", "COMMIT"],
        answer: 0,
        explanation: "REPORT でプログラム名を宣言します。",
      },
      {
        level: "intermediate",
        question: "ABAP レポートプログラムの基本要素として正しいものは？（複数選択）",
        options: [
          "REPORT でプログラム名を宣言する",
          "DATA で変数や内部テーブルを宣言する",
          "HTML で画面レイアウトを定義する",
          "CONSTANTS で変更不可の値を定義できる",
        ],
        answers: [0, 1, 3],
        explanation: "REPORT・DATA・CONSTANTS が基本です。HTML レイアウトは ABAP レポートの基本要素ではありません。",
      },
      {
        level: "advanced",
        question: "次の記述で問題があるものは？（複数選択）",
        options: [
          "LOOP の前に DATA 宣言がない",
          "ENDLOOP が無く LOOP だけ書いている",
          "REPORT 宣言のあとに DATA で内部テーブルを宣言する",
          "SELECT の結果を確認せず WRITE だけする",
        ],
        answers: [0, 1, 3],
        explanation:
          "変数宣言不足・LOOP ペア欠落・取得結果未確認はバグの原因になります。",
      },
    ],
  },
  {
    num: "4",
    title: "選択画面",
    summary: "PARAMETERS / SELECT-OPTIONS と SELECT の組み合わせを確認します。",
    arrangeKind: "code",
    codeInstruction: "条件入力 → 取得 → 結果確認 の順に組み立ててください",
    codeLines: [
      "PARAMETERS p_bukrs TYPE bkpf-bukrs.",
      "SELECT-OPTIONS s_budat FOR bkpf-budat.",
      "SELECT * FROM bkpf INTO TABLE lt_bkpf",
      "  WHERE bukrs = p_bukrs AND budat IN s_budat.",
      "IF sy-subrc = 0.",
      "  WRITE: / '対象あり'.",
      "ENDIF.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "単一の会社コードを入力させたいときに使うのは？",
        options: ["PARAMETERS", "SELECT-OPTIONS", "APPEND"],
        answer: 0,
        explanation: "単一値入力は PARAMETERS、範囲入力は SELECT-OPTIONS です。",
      },
      {
        level: "intermediate",
        question: "選択画面の命令について正しいものは？（複数選択）",
        options: [
          "PARAMETERS は単一値の入力に使う",
          "SELECT-OPTIONS は範囲指定の入力に使える",
          "SELECT-OPTIONS は DB テーブルを作成する",
          "選択画面の値は WHERE 句で使える",
        ],
        answers: [0, 1, 3],
        explanation: "PARAMETERS/SELECT-OPTIONS の値は SELECT の WHERE 句で参照できます。",
      },
      {
        level: "advanced",
        question: "選択画面と SELECT の組み合わせで起きやすい問題は？（複数選択）",
        options: [
          "必須条件が空のまま全件取得してしまう",
          "SELECT-OPTIONS の IN 句を付け忘れる",
          "PARAMETERS の型と DB 項目型が合わない",
          "選択画面があれば sy-subrc の確認は不要",
        ],
        answers: [0, 1, 2],
        explanation:
          "入力チェック・IN 句・型整合は重要です。取得後も sy-subrc を確認するのが定石です。",
      },
    ],
  },
  {
    num: "5",
    title: "内部テーブル",
    summary: "内部テーブルへの追加と LOOP 処理を確認します。",
    arrangeKind: "code",
    codeInstruction: "データを内部テーブルに蓄えて処理する流れを組み立ててください",
    codeLines: [
      "DATA lt_data TYPE TABLE OF ty_out.",
      "READ TABLE lt_bkpf INTO ls_bkpf INDEX 1.",
      "MOVE-CORRESPONDING ls_bkpf TO ls_out.",
      "APPEND ls_out TO lt_data.",
      "LOOP AT lt_data INTO ls_out.",
      "  WRITE: / ls_out-belnr.",
      "ENDLOOP.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "内部テーブルに行を追加する命令は？",
        options: ["APPEND", "ULINE", "COMMIT"],
        answer: 0,
        explanation: "APPEND で行を追加します。",
      },
      {
        level: "intermediate",
        question: "内部テーブルについて正しいものは？（複数選択）",
        options: [
          "LOOP AT で全行を順に処理できる",
          "READ TABLE で条件に合う 1 行を取り出せる",
          "APPEND で行を追加できる",
          "SORT で並べ替えができる",
        ],
        answers: [0, 1, 2, 3],
        explanation: "LOOP・READ TABLE・APPEND・SORT は内部テーブルの基本操作です。",
      },
      {
        level: "advanced",
        question: "内部テーブル運用で性能・正確性に影響する点は？（複数選択）",
        options: [
          "LOOP 内で毎回 READ TABLE するよりキー設計を意識する",
          "SORT せず AT NEW を使う",
          "不要に STANDARD TABLE と SORTED TABLE を取り違える",
          "ワークエリアを CLEAR せず APPEND する",
        ],
        answers: [0, 1, 3],
        explanation:
          "キー設計・ソート・ワークエリアの初期化は品質に直結します。",
      },
    ],
  },
  {
    num: "6",
    title: "SELECT",
    summary: "DB からの取得と SY-SUBRC による結果確認を確認します。",
    arrangeKind: "code",
    codeInstruction: "安全に DB から取得する流れを組み立ててください",
    codeLines: [
      "SELECT bukrs belnr budat",
      "  FROM bkpf",
      "  INTO TABLE lt_bkpf",
      "  WHERE bukrs = p_bukrs.",
      "IF sy-subrc = 0.",
      "  WRITE: / '取得件数:', lines( lt_bkpf ).",
      "ENDIF.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "SELECT の直後に sy-subrc = 0 が意味することは？",
        options: ["取得に成功した", "必ず 0 件だった", "構文エラーが起きた"],
        answer: 0,
        explanation: "sy-subrc = 0 は直前処理の成功を示します。",
      },
      {
        level: "intermediate",
        question: "SELECT と SY-SUBRC について正しいものは？（複数選択）",
        options: [
          "sy-subrc = 0 は直前の処理が成功したことを示す",
          "INTO TABLE で内部テーブルに一括取得できる",
          "sy-subrc は常に 1 になる",
          "BKPF は会計伝票ヘッダのテーブル",
        ],
        answers: [0, 1, 3],
        explanation: "INTO TABLE 一括取得、BKPF=ヘッダ、sy-subrc で結果確認が基本です。",
      },
      {
        level: "advanced",
        question: "SELECT 文の設計で避けるべきことは？（複数選択）",
        options: [
          "SELECT * で不要列まで取得する",
          "必要列だけを指定する",
          "WHERE 条件なしで全件取得する（大量テーブル）",
          "取得後に sy-subrc や件数を確認する",
        ],
        answers: [0, 2],
        explanation:
          "不要列・無条件全件取得は性能リスクです。必要列指定と結果確認が推奨されます。",
      },
    ],
  },
  {
    num: "7",
    title: "帳票出力",
    summary: "WRITE と ULINE で見やすい帳票を整える流れを確認します。",
    arrangeKind: "code",
    codeInstruction: "見出し → 区切り → 明細出力の順に組み立ててください",
    codeLines: [
      "WRITE: / '会計伝票一覧'.",
      "ULINE.",
      "WRITE: / '伝票番号', 20 '日付', 40 '金額'.",
      "ULINE.",
      "LOOP AT lt_out INTO ls_out.",
      "  WRITE: / ls_out-belnr, 20 ls_out-budat, 40 ls_out-amount.",
      "ENDLOOP.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "横の区切り線を引く命令は？",
        options: ["ULINE", "SKIP", "APPEND"],
        answer: 0,
        explanation: "ULINE は区切り線、SKIP は空行です。",
      },
      {
        level: "intermediate",
        question: "帳票出力の命令について正しいものは？（複数選択）",
        options: [
          "WRITE で文字や値を出力する",
          "ULINE で横の区切り線を引ける",
          "SKIP で空行を入れられる",
          "WRITE の桁位置指定で列をそろえられる",
        ],
        answers: [0, 1, 2, 3],
        explanation: "WRITE・ULINE・SKIP・桁位置指定は帳票整形の基本です。",
      },
      {
        level: "advanced",
        question: "現場で「見づらい帳票」と言われる典型原因は？（複数選択）",
        options: [
          "見出しと明細の桁位置がずれている",
          "区切り線や空行がなく塊で表示される",
          "データが正しければレイアウトは無関係",
          "列が多いのに位置指定がない",
        ],
        answers: [0, 1, 3],
        explanation:
          "正しさに加え、列位置・区切り・余白が可読性を左右します。",
      },
    ],
  },
  {
    num: "8",
    title: "データ結合",
    summary: "ヘッダと明細を MOVE で一覧用データに組み立てる流れを確認します。",
    arrangeKind: "code",
    codeInstruction: "ヘッダと明細を結合して出力用テーブルに載せる流れを組み立ててください",
    codeLines: [
      "LOOP AT lt_bseg INTO ls_bseg.",
      "  READ TABLE lt_bkpf INTO ls_bkpf WITH KEY belnr = ls_bseg-belnr.",
      "  CLEAR ls_out.",
      "  MOVE-CORRESPONDING ls_bkpf TO ls_out.",
      "  MOVE-CORRESPONDING ls_bseg TO ls_out.",
      "  APPEND ls_out TO lt_out.",
      "ENDLOOP.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "同名項目をまとめて移送する命令は？",
        options: ["MOVE-CORRESPONDING", "ULINE", "ENDLOOP"],
        answer: 0,
        explanation: "MOVE-CORRESPONDING は同名項目の一括移送に使います。",
      },
      {
        level: "intermediate",
        question: "データ結合（ヘッダ＋明細）について正しいものは？（複数選択）",
        options: [
          "READ TABLE でヘッダを明細のキーで引ける",
          "MOVE-CORRESPONDING で同名項目をまとめて移送できる",
          "APPEND で結合結果を出力用テーブルに追加する",
          "ヘッダと明細は必ず 1 行しか結合できない",
        ],
        answers: [0, 1, 2],
        explanation: "明細行数ぶん結合できます。READ TABLE + MOVE + APPEND が基本パターンです。",
      },
      {
        level: "advanced",
        question: "結合処理でバグりやすいポイントは？（複数選択）",
        options: [
          "READ TABLE 失敗（sy-subrc ≠ 0）を無視する",
          "ワークエリアを CLEAR せず前行の値が残る",
          "結合キー（BELNR 等）の取り違え",
          "LOOP の外で APPEND すれば高速なので常にそうする",
        ],
        answers: [0, 1, 2],
        explanation:
          "READ 失敗・CLEAR 忘れ・キー間違いは結合バグの典型です。",
      },
    ],
  },
  {
    num: "9",
    title: "レポート制御",
    summary: "サプレス出力と AT NEW / END OF によるグループ制御を確認します。",
    arrangeKind: "code",
    codeInstruction: "会社コードごとに見出しと集計を出す流れを組み立ててください",
    codeLines: [
      "SORT lt_out BY bukrs belnr.",
      "LOOP AT lt_out INTO ls_out.",
      "  AT NEW bukrs.",
      "    WRITE: / '会社:', ls_out-bukrs.",
      "  ENDAT.",
      "  WRITE: / ls_out-belnr, ls_out-budat.",
      "ENDLOOP.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "AT NEW が正しく動くために LOOP の前に必要なのは？",
        options: ["SORT（並べ替え）", "COMMIT", "DELETE"],
        answer: 0,
        explanation: "AT NEW / END OF はソート済みデータでグループ境界を検出します。",
      },
      {
        level: "intermediate",
        question: "レポート制御について正しいものは？（複数選択）",
        options: [
          "SORT で LOOP の前に並べ替えると AT NEW が効く",
          "AT NEW はグループの先頭で処理を実行する",
          "SUPPRESS 関連の制御で不要な出力を抑えられる",
          "AT NEW はソートなしでも必ず正しく動く",
        ],
        answers: [0, 1, 2],
        explanation: "ソート＋AT NEW/END OF＋サプレスでグループ帳票を制御します。",
      },
      {
        level: "advanced",
        question: "グループ帳票で出力がおかしくなる原因として考えられるものは？（複数選択）",
        options: [
          "SORT キーが AT NEW の項目と一致していない",
          "同じグループ内で順序がバラバラ",
          "サプレス設定と AT NEW の組み合わせミス",
          "WRITE より前に必ず COMMIT が必要",
        ],
        answers: [0, 1, 2],
        explanation:
          "ソートキー不一致・順序乱れ・サプレス設定ミスが典型原因です。",
      },
    ],
  },
  {
    num: "10",
    title: "モジュール化",
    summary: "FORM 定義と PERFORM 呼び出しの流れを確認します。",
    arrangeKind: "code",
    codeInstruction: "FORM を定義して PERFORM で呼び出す流れを組み立ててください",
    codeLines: [
      "PERFORM get_data USING p_bukrs CHANGING lt_bkpf.",
      "PERFORM print_report USING lt_bkpf.",
      "FORM get_data USING pv_bukrs TYPE bukrs",
      "           CHANGING pt_bkpf TYPE tt_bkpf.",
      "  SELECT * FROM bkpf INTO TABLE pt_bkpf WHERE bukrs = pv_bukrs.",
      "ENDFORM.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "FORM を呼び出す命令は？",
        options: ["PERFORM", "SELECT", "WRITE"],
        answer: 0,
        explanation: "PERFORM で FORM を呼び出します。",
      },
      {
        level: "intermediate",
        question: "FORM / PERFORM について正しいものは？（複数選択）",
        options: [
          "PERFORM で FORM を呼び出す",
          "USING は入力引数、CHANGING は変更可能な引数",
          "FORM 内の変数はすべてグローバルスコープになる",
          "モジュール化すると処理の見通しがよくなる",
        ],
        answers: [0, 1, 3],
        explanation: "FORM 内の DATA はローカルスコープです。",
      },
      {
        level: "advanced",
        question: "モジュール化で保守性を下げる書き方は？（複数選択）",
        options: [
          "1 つの FORM が取得・加工・出力を全部やる",
          "CHANGING で内部テーブルを暗黙に書き換えるだけで結果が追えない",
          "用途ごとに FORM を分け引数を明示する",
          "PERFORM 名が内容と無関係で検索しにくい",
        ],
        answers: [0, 1, 3],
        explanation:
          "単一責任・引数の明示・命名は保守性の基本です。",
      },
    ],
  },
  {
    num: "11",
    title: "会計伝票登録",
    summary: "BAPI による検証→登録→確定の流れを確認します。",
    arrangeKind: "code",
    codeInstruction: "登録が安全に行われる順番に組み立ててください",
    codeLines: [
      "ls_header-comp_code = '1000'.",
      "APPEND ls_item TO lt_item.",
      "CALL FUNCTION 'BAPI_ACC_DOCUMENT_CHECK'.",
      "CALL FUNCTION 'BAPI_ACC_DOCUMENT_POST'.",
      "READ TABLE lt_return WITH KEY type = 'E'.",
      "CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "BAPI で登録を確定（DB に反映）するのはどれ？",
        options: [
          "BAPI_TRANSACTION_COMMIT",
          "BAPI_ACC_DOCUMENT_CHECK",
          "ULINE",
        ],
        answer: 0,
        explanation: "COMMIT で確定、CHECK は検証、POST は登録実行です。",
      },
      {
        level: "intermediate",
        question: "会計伝票登録（BAPI）について正しいものは？（複数選択）",
        options: [
          "CHECK で登録前に検証できる",
          "POST で実際に登録する",
          "COMMIT で変更を確定する",
          "エラー確認なしで COMMIT するのが安全",
        ],
        answers: [0, 1, 2],
        explanation: "CHECK → POST → エラー確認 → COMMIT の順が安全です。",
      },
      {
        level: "advanced",
        question: "伝票登録フローでデータ不整合・事故を防ぐために必要なことは？（複数選択）",
        options: [
          "lt_return の type = 'E' を確認する",
          "CHECK を省略して POST だけ実行する",
          "借方・貸方バランス等の業務チェックを CHECK に任せつつ結果を見る",
          "COMMIT 前にエラーがないことを確認する",
        ],
        answers: [0, 2, 3],
        explanation:
          "CHECK 結果と RETURN のエラー確認なしの COMMIT は危険です。",
      },
    ],
  },
  {
    num: "12",
    title: "実務の進め方",
    summary: "仕様変更時の影響分析とテストの流れを確認します。",
    arrangeKind: "flow",
    codeInstruction: "仕様変更に対応する流れを組み立ててください",
    codeLines: [
      "変更内容と影響範囲を洗い出す。",
      "関連プログラム・テーブルを特定する。",
      "修正を実装する。",
      "回帰テストで既存機能を確認する。",
      "レビュー・リリースする。",
    ],
    quizzes: [
      {
        level: "basic",
        question: "仕様変更後に「既存機能が壊れていないか」を確認するテストは？",
        options: ["回帰テスト", "負荷テストのみ", "テスト不要"],
        answer: 0,
        explanation: "回帰テストで既存機能への影響を確認します。",
      },
      {
        level: "intermediate",
        question: "実務での変更対応について正しいものは？（複数選択）",
        options: [
          "影響分析で修正範囲を事前に把握する",
          "回帰テストで既存機能への影響を確認する",
          "仕様変更はテスト不要でリリースしてよい",
          "変更履歴を残す習慣が保守性を高める",
        ],
        answers: [0, 1, 3],
        explanation: "影響分析・回帰テスト・変更履歴は実務の基本です。",
      },
      {
        level: "advanced",
        question: "小さな修正依頼でも見落としやすいリスクは？（複数選択）",
        options: [
          "共通 FORM を変更して別レポートにも影響が出る",
          "SELECT 条件変更で件数だけでなく会計ロジックが変わる",
          "影響が1ファイルだけならテスト省略でよい",
          "テストデータが実業務と乖離している",
        ],
        answers: [0, 1, 3],
        explanation:
          "共通部品・条件変更・テストデータの妥当性は小変更でも重要です。",
      },
    ],
  },
  {
    num: "13",
    title: "良いABAP",
    summary: "SELECT・内部テーブルの性能と、可読性・保守性の両立を確認します。",
    arrangeKind: "code",
    codeInstruction: "大量データを扱うときの良い取得パターンを組み立ててください",
    codeLines: [
      "SELECT bukrs belnr budat",
      "  FROM bkpf",
      "  INTO TABLE lt_bkpf",
      "  WHERE bukrs = p_bukrs",
      "    AND budat IN s_budat.",
      "SORT lt_bkpf BY budat ASCENDING.",
      "LOOP AT lt_bkpf INTO ls_bkpf.",
      "  WRITE: / ls_bkpf-belnr, ls_bkpf-budat.",
      "ENDLOOP.",
    ],
    quizzes: [
      {
        level: "basic",
        question: "性能面で特に避けるべきパターンは？",
        options: [
          "LOOP 内で毎回 SELECT する",
          "INTO TABLE で一括取得する",
          "必要列だけ SELECT する",
        ],
        answer: 0,
        explanation: "ネステッド SELECT（ループ内 SELECT）は DB アクセスが行数分増えます。",
      },
      {
        level: "intermediate",
        question: "性能・保守性の良い ABAP について正しいものは？（複数選択）",
        options: [
          "必要な列だけ SELECT する",
          "LOOP 内で毎回 SELECT する（ネステッド SELECT）",
          "INTO TABLE でまとめて取得してから LOOP する",
          "WHERE でキー項目を指定して絞り込む",
        ],
        answers: [0, 2, 3],
        explanation: "必要列・一括取得・キー指定が基本です。ループ内 SELECT は避けます。",
      },
      {
        level: "advanced",
        question: "大量データの照会レポートで総合的に検討すべきことは？（複数選択）",
        options: [
          "WHERE 条件とインデックス（キー）の関係",
          "取得後の LOOP 内で再度 DB にアクセスしない",
          "SELECT * は列追加時に安全なので常に使う",
          "SE30 / SAT でボトルネックを計測する",
        ],
        answers: [0, 1, 3],
        explanation:
          "キー・DB アクセス回数・計測に基づく改善が重要です。SELECT * は性能・可読性の両面で避けます。",
      },
    ],
  },
  {
    num: "14",
    title: "SAP開発ツール",
    summary: "SE38 の開発サイクル、デバッグ、主要トランザクションと汎用モジュールの位置づけを確認します。",
    arrangeKind: "flow",
    codeInstruction: "SE38 でプログラムを実行するまでの正しい流れを組み立ててください",
    codeLines: [
      "エディタで編集し保存する。",
      "構文チェックを行う。",
      "有効化する。",
      "実行（F8）する。",
      "結果を確認し、必要なら修正に戻る。",
    ],
    quizzes: [
      {
        level: "basic",
        question: "保存後に実行しても動かないとき、最初に疑う操作は？",
        options: ["有効化を忘れた", "テーブルを削除した", "選択画面を増やした"],
        answer: 0,
        explanation: "有効化しないと実行時オブジェクトが更新されません。構文チェックと有効化はセットで行います。",
      },
      {
        level: "intermediate",
        question: "デバッグや開発で有用な操作として正しいものは？（複数選択）",
        options: [
          "ブレークポイントを設定する",
          "F1 でヘルプを見る",
          "有効化を省略して毎回保存だけする",
          "F6 でサブルーチン内部を飛ばす",
        ],
        answers: [0, 1, 3],
        explanation: "ブレークポイント・F1・F6 は日常の調査に使います。有効化省略は典型的な不具合原因です。",
      },
      {
        level: "advanced",
        question: "汎用モジュールについて正しい説明は？（複数選択）",
        options: [
          "CALL FUNCTION で呼び出す",
          "すべての処理をプログラム内に重複実装すべき",
          "FILE_GET_NAME は論理ファイル名の解決に使える",
          "REUSE_ALV_GRID_DISPLAY は一覧表示に使える",
        ],
        answers: [0, 2, 3],
        explanation:
          "汎用モジュールは共通処理の再利用です。FILE_GET_NAME・ALV 表示は代表例です。",
      },
    ],
  },
  {
    num: "15",
    title: "ファイル連携とバッチ",
    summary: "論理ファイル、サーバファイル操作、バックグラウンドジョブ、BDC の関係を確認します。",
    arrangeKind: "flow",
    codeInstruction: "外部ファイルを取り込んで登録する流れの概略を組み立ててください",
    codeLines: [
      "外部ファイルをサーバの所定位置へ配置する。",
      "ABAP が論理ファイル名でデータを読み込む。",
      "内容を検証・変換する。",
      "BAPI または BDC 等で登録する。",
      "結果・履歴を確認する。",
    ],
    quizzes: [
      {
        level: "basic",
        question: "論理ファイルを使う主な理由は？",
        options: [
          "環境ごとの物理パス差を設定側で吸収できる",
          "プログラムに物理パスを直書きするため",
          "GUI でファイル操作できなくするため",
        ],
        answer: 0,
        explanation: "論理名はプログラムで固定し、物理パスは FILE 設定で切り替えます。",
      },
      {
        level: "intermediate",
        question: "ファイル連携・ジョブで正しい組み合わせは？（複数選択）",
        options: [
          "AL11 でサーバ上のファイルを参照できる",
          "SM37 でジョブ結果を確認できる",
          "CG3Z はサーバから PC へダウンロードする",
          "FILE_GET_NAME で論理名から物理パスを得られる",
        ],
        answers: [0, 1, 3],
        explanation: "AL11・SM37・FILE_GET_NAME は連携で頻出です。CG3Z はアップロード（PC→サーバ）です。",
      },
      {
        level: "advanced",
        question: "BDC と BAPI の位置づけとして適切なものは？（複数選択）",
        options: [
          "新規開発では BAPI が優先されることが多い",
          "BDC は画面操作をデータ化して再生する",
          "BDC は常にテーブルへ直接 INSERT するだけ",
          "CALL TRANSACTION 実行後は SY-SUBRC 等で成否を確認する",
        ],
        answers: [0, 1, 3],
        explanation:
          "BAPI は公式登録窓口。BDC は画面再生方式。成否は SY-SUBRC とメッセージで確認します。",
      },
    ],
  },
];
