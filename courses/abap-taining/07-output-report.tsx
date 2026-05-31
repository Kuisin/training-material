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
  title: "出力をつくる",
  meta: "初学者 · 20分",
};

export default function OutputReportLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "07-output-report", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "出力をつくる\n帳票＝整えて見せること。データを取るだけでは不十分、という話を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・帳票（レポート出力）は「見やすく整える」工程だということ\n・出力を整える命令（WRITE / ULINE / SKIP / NEW-LINE / NEW-PAGE）\n・「見やすさ」はユーザーにとっての価値だ、という視点",
          content: (
            <>
              <hgroup>
                <h1>出力をつくる</h1>
                <p>帳票＝整えて見せること。データを取るだけでは不十分、という話を学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>帳票（レポート出力）は「見やすく整える」工程だということ</li>
                <li>出力を整える命令（<code>WRITE</code> / <code>ULINE</code> / <code>SKIP</code> / <code>NEW-LINE</code> / <code>NEW-PAGE</code>）</li>
                <li>「見やすさ」はユーザーにとっての価値だ、という視点</li>
              </ul>
            </>
          ),
        },
        {
          title: "見にくい議事録のたとえ",
          plainText:
            "同じ内容でも、整え方で伝わり方が変わる\n改行も見出しもない、文字がびっしりの議事録は読む気が失せる。逆に見出し・区切り線・適度な空きがあるとぐっと読みやすい。帳票も同じ。\n先生：取得したデータをそのまま並べるだけでは読めるけどつらい状態。整えて初めて使える資料になる。\nBちゃん：レシピでも材料と手順が分かれてると作りやすい。あれと同じですね。\n先生：そう。中身が同じでも、整え方で価値が変わります。",
          content: (
            <>
              <h2>同じ内容でも、整え方で伝わり方が変わる</h2>
              <p>改行も見出しもない、文字がびっしりの議事録は読む気が失せますよね。逆に、見出し・区切り線・適度な空きがあると、ぐっと読みやすくなります。帳票も同じです。</p>
              <Figure
                src="image/07-messy-vs-clean.png"
                alt="左：文字や数字がびっしり詰まって見出しも区切りもない読みにくい一覧。右：同じ内容だが見出し・区切り線・空行・桁そろえで整理された読みやすい帳票。before/afterの対比。"
                caption="同じデータでも、整えるだけで「読めるけどつらい」→「使える資料」に変わる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                取得したデータをそのまま並べるだけでは「読めるけど、つらい」状態。整えて初めて“使える資料”になります。
              </Dialog>
              <Dialog speaker="b">
                レシピでも、材料と手順が分かれてると作りやすいです。あれと同じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "整える命令たち",
          plainText:
            "見た目を整える基本命令\nWRITE：文字や値を書き出す（/ で改行つき）\nULINE：横の区切り線を引く\nSKIP：空行を入れる\nNEW-LINE：次の行へ移る\nNEW-PAGE：改ページする\nAくん：文章でいう改行・罫線・空行・改ページに1対1で対応しているんですね。",
          content: (
            <>
              <h2>見た目を整える基本命令</h2>
              <ul>
                <li><code>WRITE</code>：文字や値を書き出す（<code>/</code> で改行つき）</li>
                <li><code>ULINE</code>：横の区切り線を引く</li>
                <li><code>SKIP</code>：空行を入れる</li>
                <li><code>NEW-LINE</code>：次の行へ移る</li>
                <li><code>NEW-PAGE</code>：改ページする</li>
              </ul>
              <Dialog speaker="a">
                文章でいう「改行」「罫線」「空行」「改ページ」に1対1で対応しているんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その対応で覚えて大丈夫です。難しい命令ではなく、ワープロの整形ボタンと同じ役割だと思ってください。
              </Dialog>
            </>
          ),
        },
        {
          title: "出力のコード例",
          plainText:
            "見出し → 区切り → 明細\nWRITE: / '会計伝票一覧'. ULINE.\nWRITE: / '伝票番号', 20 '日付', 40 '金額'. ULINE.\nLOOP AT lt_out INTO ls_out. WRITE: / ls_out-belnr, 20 ls_out-budat, 40 ls_out-amount. ENDLOOP.\n先生：数字（20, 40）は何桁目から書くかという位置指定。列をそろえると一気に表らしくなる。\nAくん：見出しの桁位置と明細の桁位置を同じ数字にそろえるのがコツですね。",
          content: (
            <>
              <h2>見出し → 区切り → 明細</h2>
              <CodeBlock
                language="ABAP"
                code={`WRITE: / '会計伝票一覧'.
ULINE.
WRITE: / '伝票番号', 20 '日付', 40 '金額'.
ULINE.
LOOP AT lt_out INTO ls_out.
  WRITE: / ls_out-belnr, 20 ls_out-budat, 40 ls_out-amount.
ENDLOOP.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>WRITE: / &apos;会計伝票一覧&apos;.</code> … タイトルを表示。<code>/</code> は改行して書く
                </li>
                <li>
                  <code>ULINE.</code> … 区切り線（罫線）を引く
                </li>
                <li>
                  <code>WRITE: / &apos;伝票番号&apos;, 20 &apos;日付&apos;, 40 &apos;金額&apos;.</code> … 列見出し。<code>20</code> <code>40</code> は「何桁目から書くか」の位置
                </li>
                <li>
                  <code>LOOP AT lt_out INTO ls_out.</code> … 整形済みデータを1行ずつ出力。見出しと同じ桁位置（20・40）で列をそろえる
                </li>
              </ul>
              <Figure
                src="image/07-aligned-columns.png"
                alt="WRITEの桁位置指定の図。見出し行と明細行で『伝票番号は1桁目、日付は20桁目、金額は40桁目』と縦に揃っている様子を、桁数の目盛りとともに示す。"
                caption="桁位置（20・40）を見出しと明細でそろえると、列がきれいに整列する"
                kind="diagram"
              />
              <Dialog speaker="a">
                見出しの桁位置と明細の桁位置を同じ数字にそろえるのがコツですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。数字（20, 40）は「何桁目から書くか」という位置指定。列をそろえると一気に表らしくなります。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：取得から帳票へ",
          plainText:
            "図で見る：取得しただけ → 整えて帳票に\nflowchart：取得データ(並べただけ) → 見出しをつける → 区切り線・桁そろえ → 読みやすい帳票\nこの章のABAPキーワード：WRITE / ULINE / SKIP / NEW-LINE / NEW-PAGE。",
          content: (
            <>
              <h2>図で見る：取得しただけ → 整えて帳票に</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A["取得データ<br/>(並べただけ)"] --> B[見出しをつける]
  B --> C[区切り線・桁そろえ]
  C --> D["読みやすい帳票"]`}
              />
              <Callout variant="tip">
                この章のABAPキーワード：<code>WRITE</code> / <code>ULINE</code> / <code>SKIP</code> / <code>NEW-LINE</code> / <code>NEW-PAGE</code>。
              </Callout>
            </>
          ),
        },
        {
          title: "見やすさは価値",
          plainText:
            "見やすさ＝ユーザーへの思いやり\n帳票を見るのは人。少し整えるだけで相手の確認作業が何倍も楽になる。これは技術というより気づかい。\nつまずき：データが合っていればOKと思いがち。でも見づらい帳票は現場では使えないと言われてしまう。\nBちゃん：正しいだけじゃなく、優しい資料にしたいですね。\n先生：その視点が、現場で信頼される開発者の第一歩です。",
          content: (
            <>
              <h2>見やすさ＝ユーザーへの思いやり</h2>
              <p>帳票を見るのは「人」です。少し整えるだけで、相手の確認作業が何倍も楽になります。これは技術というより“気づかい”の部分です。</p>
              <Dialog speaker="stumble">
                「データが合っていればOK」と思いがち。でも見づらい帳票は、現場では「使えない」と言われてしまいます。
              </Dialog>
              <Dialog speaker="b">
                正しいだけじゃなく、優しい資料にしたいですね。
              </Dialog>
              <Dialog speaker="teacher">
                その視点が、現場で信頼される開発者の第一歩です。「正しさ」と「読みやすさ」は両方そろって価値になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：出力を、正しい情報を届けるための最後の設計工程と捉えること。WRITEで値を出すだけでなくULINEやSKIPで視線の流れを整え、判断しやすい帳票に仕上げる。\nAくん：帳票はUI設計に近く、同じデータでも配置や区切りで読み取りコストが大きく変わる。列位置のそろえ方も品質要件の一部。\nBちゃん：数字が並ぶ画面でも見出しや空行があるだけで安心して読める。使う人が迷わないように整えるのが開発側の仕事だと実感しました。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章のポイントは、出力を「正しい情報を届けるための最後の設計工程」と捉えることです。WRITEで値を出すだけでなく、ULINEやSKIPで視線の流れを整えて、判断しやすい帳票に仕上げます。
              </Dialog>
              <Dialog speaker="a">
                つまり帳票はUI設計に近く、同じデータでも配置や区切りで読み取りコストが大きく変わるんですね。列位置のそろえ方も品質要件の一部になる。
              </Dialog>
              <Dialog speaker="b">
                数字が並ぶ画面でも、見出しや空行があるだけで安心して読めます。使う人が迷わないように整えるのが、開発側の仕事だと実感しました。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 横の区切り線を引く命令は？→ ULINE\nQ2 出力を整える一番の理由は？→ 見る人の確認作業を楽にするため（ユーザー価値）\nQ3 伝票番号・日付・金額を見やすく横並びにする工夫は？→ WRITEの桁位置指定で列をそろえる\n今日のひとこと：ひと手間の整えが、相手の「ありがとう」につながります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="ULINE は横の区切り線を引く命令です。SKIP は空行、NEW-PAGE は改ページ。命令ごとの役割を使い分けることで、見出し・明細・集計の境界が明確になり、帳票の誤読を減らせます。"
                question={<strong>横の区切り線を引く命令はどれ？</strong>}
                options={["SKIP", "NEW-PAGE", "ULINE"]}
              />
              <Quiz
                answer={0}
                explanation="データが正しくても、見づらい帳票は現場で使われません。見やすさはユーザーにとっての価値です。特に月次処理のように確認件数が多い業務では、可読性の差が作業時間とミス率に直結します。"
                question={<strong>出力（帳票）を整える一番の理由は？</strong>}
                options={[
                  "見る人の確認作業を楽にするため（ユーザー価値）",
                  "プログラムを速くするため",
                  "データを暗号化するため",
                ]}
              />
              <Quiz
                answer={1}
                explanation="帳票で列をそろえて出力するには、WRITEの位置指定を使って同じ桁位置へ項目を配置するのが基本です。桁位置がそろうと比較しやすくなり、金額や日付の見落としを防げます。"
                question={<strong>「伝票番号・日付・金額」を見やすく横並びにする工夫として適切なのは？</strong>}
                options={[
                  "全項目を同じ位置に連続で出す",
                  "WRITEの桁位置指定で列をそろえる",
                  "ULINEだけを増やして列位置は気にしない",
                ]}
              />
              <Dialog speaker="closing">
                ひと手間の整えが、相手の「ありがとう」につながります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OutputReportLesson);
