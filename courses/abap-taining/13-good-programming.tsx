import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "適切なプログラミング",
  meta: "初学者 · 25分",
};

export default function GoodProgrammingLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "13-good-programming", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "適切なプログラミング\n性能と保守性。10年後も使われることを見据えた、悪い例・良い例の対比で学ぶ仕上げの章です。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・性能（速さ）と保守性（直しやすさ）を両立する書き方\n・SELECT や LOOP の書き方で、なぜ速度に差が出るのか\n・悪い例・良い例の対比と、引き継げるコードの条件",
          content: (
            <>
              <hgroup>
                <h1>適切なプログラミング</h1>
                <p>性能と保守性。10年後も使われることを見据えた、悪い例・良い例の対比で学ぶ仕上げの章です。</p>
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
                <li>性能（速さ）と保守性（直しやすさ）を両立する書き方</li>
                <li><code>SELECT</code> や <code>LOOP</code> の書き方で、なぜ速度に差が出るのか</li>
                <li>悪い例・良い例の対比と、引き継げるコードの条件</li>
              </ul>
            </>
          ),
        },
        {
          title: "近道のたとえ",
          plainText:
            "「近道」が、実は渋滞の原因になる\nその場では速そうに見える書き方が、データが増えると一気に遅くなることがある。とくにDBへ何度も取りに行く書き方は件数が増えるほど効く。\n先生：性能は少ないデータでは気づかないのが怖いところ。本番の大量データで初めて遅さが牙をむく。だから最初から良い型で書く。\nBちゃん：少人数の試食会では平気でも本番の宴会で回らなくなる…みたいなことですね。\n先生：まさに。だから最初から大人数を前提に仕込みます。",
          content: (
            <>
              <h2>「近道」が、実は渋滞の原因になる</h2>
              <p>その場では速そうに見える書き方が、データが増えると一気に遅くなることがあります。とくに「DBへ何度も取りに行く」書き方は、件数が増えるほど効いてきます。</p>
              <Figure
                src="image/13-shortcut-traffic.png"
                alt="一見すると速そうな細い近道に車が殺到して大渋滞している様子と、広い本道がスムーズに流れている様子の対比。データ量が増えると近道が詰まる比喩。"
                caption="その場の“近道”が、データ量が増えると渋滞の原因になる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                性能は「少ないデータでは気づかない」のが怖いところ。本番の大量データで初めて遅さが牙をむきます。だから最初から良い型で書きます。
              </Dialog>
              <Dialog speaker="b">
                少人数の試食会では平気でも、本番の宴会で回らなくなる…みたいなことですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜ差が出るか",
          plainText:
            "DBアクセスは「往復」が重い\nデータベースへの問い合わせは1回ごとに往復の時間がかかる。ループの中で毎回 SELECT するとその往復が件数分くり返されとても遅くなる。\nつまずき：LOOP の中で SELECT は代表的なアンチパターン。件数×往復＝爆発的に遅くなる。\nAくん：計算量の話ですね。N件のループ内でN回問い合わせればコストはNに比例して膨らむ。",
          content: (
            <>
              <h2>DBアクセスは「往復」が重い</h2>
              <p>データベースへの問い合わせは、1回ごとに“往復の時間”がかかります。ループの中で毎回 <code>SELECT</code> すると、その往復が件数分くり返され、とても遅くなります。</p>
              <Dialog speaker="stumble">
                「LOOP の中で SELECT」は代表的なアンチパターン。件数×往復＝爆発的に遅くなります。
              </Dialog>
              <Dialog speaker="a">
                計算量の話ですね。N件のループ内でN回問い合わせれば、コストはNに比例して膨らむ。
              </Dialog>
              <Dialog speaker="teacher">
                いい着眼です。だから「往復の回数そのものを減らす」のが、最も効く改善になります。次の悪い例・良い例で体感しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "悪い例",
          plainText:
            "悪い例：ループの中で毎回DBへ\n❌ 明細1件ごとにDBへ取りに行く（往復が件数分）\nLOOP AT lt_bseg INTO ls_bseg. SELECT SINGLE butxt FROM t001 INTO lv_name WHERE bukrs = ls_bseg-bukrs. WRITE: / ls_bseg-belnr, lv_name. ENDLOOP.\nBちゃん：1件ごとに倉庫まで歩いて取りに行ってる…たしかに大変そう。",
          content: (
            <>
              <h2>悪い例：ループの中で毎回DBへ</h2>
              <CodeBlock
                language="ABAP"
                code={`" ❌ 明細1件ごとにDBへ取りに行く（往復が件数分）
LOOP AT lt_bseg INTO ls_bseg.
  SELECT SINGLE butxt FROM t001
    INTO lv_name
    WHERE bukrs = ls_bseg-bukrs.
  WRITE: / ls_bseg-belnr, lv_name.
ENDLOOP.`}
              />
              <h3>何が問題か</h3>
              <ul>
                <li>
                  <code>LOOP</code> の<strong>中</strong>に <code>SELECT SINGLE</code> … 明細100件ならDBへ100回往復する（N+1問題）
                </li>
                <li>
                  毎回同じ会社コードでも取りに行く … 無駄な重複アクセス
                </li>
              </ul>
              <Dialog speaker="b">
                1件ごとに倉庫まで歩いて取りに行ってる…たしかに大変そう。
              </Dialog>
            </>
          ),
        },
        {
          title: "良い例",
          plainText:
            "良い例：先にまとめて取り、メモリで突き合わせ\n✅ 必要な会社名を一度だけまとめて取得\nSELECT bukrs butxt FROM t001 INTO TABLE lt_t001 FOR ALL ENTRIES IN lt_bseg WHERE bukrs = lt_bseg-bukrs.\nLOOP AT lt_bseg INTO ls_bseg. READ TABLE lt_t001 INTO ls_t001 WITH KEY bukrs = ls_bseg-bukrs. WRITE: / ls_bseg-belnr, ls_t001-butxt. ENDLOOP.\nAくん：先に倉庫から必要分を台車でまとめて運び、あとは机の上で照合。往復が激減しますね。\nこの章のABAPキーワード：FOR ALL ENTRIES / READ TABLE / 必要な列だけ SELECT / 性能・保守性。",
          content: (
            <>
              <h2>良い例：先にまとめて取り、メモリで突き合わせ</h2>
              <CodeBlock
                language="ABAP"
                code={`" ✅ 必要な会社名を一度だけまとめて取得
SELECT bukrs butxt FROM t001
  INTO TABLE lt_t001
  FOR ALL ENTRIES IN lt_bseg
  WHERE bukrs = lt_bseg-bukrs.

LOOP AT lt_bseg INTO ls_bseg.
  READ TABLE lt_t001 INTO ls_t001
    WITH KEY bukrs = ls_bseg-bukrs.   " メモリ内で照合（往復なし）
  WRITE: / ls_bseg-belnr, ls_t001-butxt.
ENDLOOP.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SELECT ... INTO TABLE lt_t001 FOR ALL ENTRIES IN lt_bseg</code> … 明細に登場する会社コードに必要な会社名だけを<strong>1回のSELECT</strong>でまとめて取得
                </li>
                <li>
                  <code>WHERE bukrs = lt_bseg-bukrs</code> … 明細テーブルに含まれる会社コードに限定
                </li>
                <li>
                  <code>READ TABLE lt_t001 ... WITH KEY bukrs = ls_bseg-bukrs</code> … ループ内ではDBへ行かず、手元の棚（<code>lt_t001</code>）から会社名を照合
                </li>
              </ul>
              <Dialog speaker="a">
                先に倉庫から必要分を台車でまとめて運び、あとは机の上で照合。往復が激減しますね。
              </Dialog>
              <Callout variant="warning">
                <code>FOR ALL ENTRIES</code> の注意：駆動テーブル（<code>lt_bseg</code>）が
                <strong>空のときは <code>WHERE</code> が無視され全件取得</strong>になります。使う前に{" "}
                <code>IF lt_bseg IS NOT INITIAL.</code> で空チェックを（重複行は自動で除かれます）。
              </Callout>
              <Callout variant="tip">
                この章のABAPキーワード：<code>FOR ALL ENTRIES</code> / <code>READ TABLE</code> / 必要な列だけ <code>SELECT</code> / 性能・保守性。
              </Callout>
            </>
          ),
        },
        {
          title: "図解：往復を減らす",
          plainText:
            "図で見る：無駄な往復を減らす\nflowchart：悪い例＝LOOP↔毎回SELECT（往復多）／良い例＝1回でまとめてSELECT→メモリ上で照合\n先生：ポイントはDBへの往復を減らす・必要な列だけ取る。この2つだけでも体感速度は大きく変わる。",
          content: (
            <>
              <h2>図で見る：無駄な往復を減らす</h2>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph 悪い例
    L1[LOOP] --> Q1[毎回SELECT]
    Q1 --> L1
  end
  subgraph 良い例
    Q2[1回でまとめてSELECT] --> M[メモリ上で照合]
  end`}
              />
              <Figure
                src="image/13-roundtrip.png"
                alt="左：LOOPの各回ごとにDB（倉庫）へ何度も往復する矢印が大量にある悪い例。右：最初に1回だけまとめてDBから取り、あとは内部テーブル（机）で照合する良い例。往復回数の多寡を矢印の数で対比。"
                caption="悪い例＝件数分の往復／良い例＝1回でまとめて取り、あとはメモリ内で照合"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                ポイントは「DBへの往復を減らす」「必要な列だけ取る」。この2つだけでも、体感速度は大きく変わります。
              </Dialog>
            </>
          ),
        },
        {
          title: "引き継げる書き方",
          plainText:
            "保守性：10年後も誰かが直せるように\nコメント・命名：意図が読み取れる\n変更履歴：いつ・なぜ変えたか分かる\n開発標準に合わせる：チームで書き方を揃える\n部品化：直す範囲を狭く保つ\nBちゃん：速さだけじゃなく優しさ（読みやすさ）も品質なんですね。\n先生：速くて、読みやすくて、安全に直せる。この3つがそろって適切なプログラミング。研修おつかれさまでした！",
          content: (
            <>
              <h2>保守性：10年後も誰かが直せるように</h2>
              <ul>
                <li><strong>コメント・命名</strong>：意図が読み取れる</li>
                <li><strong>変更履歴</strong>：いつ・なぜ変えたか分かる</li>
                <li><strong>開発標準に合わせる</strong>：チームで書き方を揃える</li>
                <li><strong>部品化</strong>：直す範囲を狭く保つ</li>
              </ul>
              <Dialog speaker="b">
                速さだけじゃなく、優しさ（読みやすさ）も品質なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                速くて、読みやすくて、安全に直せる。この3つがそろって“適切なプログラミング”です。研修おつかれさまでした！
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：最終章の結論は、良いプログラムは速いだけでも読みやすいだけでも不十分で、性能と保守性の両立が必要という点。特にDBアクセス回数を減らす設計は実務で体感差が最も大きい。\nAくん：LOOP内SELECTのアンチパターンを避け、先にまとめて取得してメモリ照合する構造にするとスケール時の劣化を抑えられる。命名や部品化を整えれば将来改修も安全。\nBちゃん：今は動いていてもデータ量が増えたときに困らない書き方を最初から選ぶのが大事。未来の人が読めるように書くことまで含めて品質だと理解できました。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                最終章の結論は、良いプログラムは「速いだけ」でも「読みやすいだけ」でも不十分で、性能と保守性の両立が必要だという点です。特にDBアクセス回数を減らす設計は、実務で体感差が最も大きく出ます。
              </Dialog>
              <Dialog speaker="a">
                LOOP内SELECTのようなアンチパターンを避け、先にまとめて取得してメモリ照合する構造にすると、スケール時の劣化を抑えられますね。さらに命名や部品化を整えることで、将来改修も安全にできる。
              </Dialog>
              <Dialog speaker="b">
                今は動いていても、データ量が増えたときに困らない書き方を最初から選ぶのが大事なんですね。未来の人が読めるように書くことまで含めて品質だと理解できました。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 性能上、避けたい代表的な書き方は？→ LOOP の中で毎回 SELECT する\nQ2 適切なプログラミングが満たすべきものは？→ 性能と保守性（読みやすさ・直しやすさ）の両立\nQ3 DB往復を減らすと並んで有効な基本方針は？→ 必要な列に絞ってSELECTする\n今日のひとこと：ここまで来たあなたは、もう翻訳者の入口に立っています。良いコードは未来へのやさしさです。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="LOOP の中で毎回 SELECT すると、DBへの往復が件数分くり返されて遅くなります。先にまとめて取得してメモリで照合します。データ量が少ない開発環境では見えにくくても、本番件数ではレスポンス悪化が顕著に現れる典型的な原因です。"
                question={<strong>性能上、避けたい代表的な書き方は？</strong>}
                options={[
                  "必要な列だけを SELECT する",
                  "LOOP の中で毎回 SELECT する",
                  "FOR ALL ENTRIES でまとめて取得する",
                ]}
              />
              <Quiz
                answer={2}
                explanation="適切なプログラミングは、速さ（性能）だけでなく、読みやすさ・直しやすさ（保守性）まで含めて評価します。短期的に速く見える実装でも、改修時に壊れやすければ総コストは増えるため、長期運用視点で品質を判断します。"
                question={<strong>「適切なプログラミング」が満たすべきものは？</strong>}
                options={[
                  "とにかく実行が速いことだけ",
                  "とにかく短く書くことだけ",
                  "性能と保守性（読みやすさ・直しやすさ）の両立",
                ]}
              />
              <Quiz
                answer={1}
                explanation="必要な列だけをSELECTするのは、転送データ量を減らして性能を改善し、コード側でも扱う項目を明確にする基本戦略です。不要列まで取得するとメモリ消費も増え、可読性と保守性の両面で不利になります。"
                question={<strong>「DB往復を減らす」と並んで性能改善に有効な基本方針は？</strong>}
                options={[
                  "毎回SELECT *で全列を取得する",
                  "必要な列に絞ってSELECTする",
                  "READ TABLEを使わず常に二重LOOPにする",
                ]}
              />
              <Dialog speaker="closing">
                ここまで来たあなたは、もう「翻訳者」の入口に立っています。良いコードは、未来へのやさしさです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(GoodProgrammingLesson);
