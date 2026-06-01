import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CharacterIntro,
  Figure,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "SAP GUI とは — なぜ操作を覚えるのか",
  meta: "初学者 · 10分",
};

export default function IntroductionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "00-introduction", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "SAP GUI とは\nSAP という業務システムに接続するための「窓口」ソフトです。この章では、なぜ操作の基本を先に学ぶのかを整理します。\n⏱ 10分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・SAP と SAP GUI の関係（サーバーとクライアント）\n・なぜ「画面操作」が開発・業務の両方で必要か\n・このコースのゴール（迷わず動かせる土台）",
          content: (
            <>
              <hgroup>
                <h1>SAP GUI とは</h1>
                <p>
                  SAP という業務システムに接続するための<strong>"窓口"ソフト</strong>です。この章では、なぜ操作の基本を先に学ぶのかを整理します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "10分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP GUI 基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>SAP と SAP GUI の関係（サーバーとクライアント）</li>
                <li>なぜ「画面操作」が開発・業務の両方で必要か</li>
                <li>このコースのゴール（迷わず動かせる土台）</li>
              </ul>
            </>
          ),
        },
        {
          title: "3人で学ぶ",
          plainText:
            "3人の登場人物\n先生・Aくん・Bちゃんの3人でSAP GUIを学びます。\n先生：SAP GUI（サップ・ジー・ユー・アイ）は、SAP システムを操作するための画面です。まずは「どこを触れば何が起きるか」を体で覚えましょう。\nAくん：開発の研修に入る前に、画面の共通ルールを押さえたいです。コマンドの背景も知りたい。\nBちゃん：ログイン画面は見たことがあるけど、その先がまだピンときません…。例え話があると助かります。\n先生：今日は「見た目の地図」から始めます。細かい業務知識は後からで十分です。",
          content: (
            <>
              <h2>3人で学ぶ</h2>
              <p>
                このレッスンには3人が出てきます。先生と新卒2人です。
                <strong>あなたに近いほうの言葉</strong>を特に拾ってください。
              </p>
              <CharacterIntro speaker="teacher">
                SAP GUI（エス・エー・ピー　ジー・ユー・アイ）は、SAP システムを操作するための画面です。まずは「どこを触れば何が起きるか」を体で覚えましょう。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                開発の研修に入る前に、画面の共通ルールを押さえたいです。コマンドの背景も理解したいタイプです。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                ログイン画面は見たことがあるけど、その先がまだピンときません…。例え話があると助かります。
              </CharacterIntro>
              <Dialog speaker="teacher">
                大丈夫です。今日は「見た目の地図」から始めます。細かい業務知識は後からで十分ですよ。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP と GUI の関係",
          plainText:
            "SAP＝業務の頭脳、GUI＝操作する窓\nSAP は会社の業務データや処理を担うサーバー側のシステム。SAP GUI はそのシステムに指示を送るクライアント（手元の画面）です。\nATM に例えると、ATM の画面が SAP GUI、銀行の本番処理が SAP サーバーのイメージです。\nAくん：GUI の操作が分からないと、中の ABAP や業務画面までたどり着けないということですね。\nBちゃん：ATM の例えが分かりやすいです。手元の機械を通してサーバーに命令を送る感じ。",
          content: (
            <>
              <h2>SAP ＝ 業務の頭脳、GUI ＝ 操作する窓</h2>
              <p>
                <strong>SAP</strong> は、会計・購買・在庫などの業務を支える<strong>サーバー側</strong>のシステムです。
                <strong>SAP GUI</strong> は、その SAP に接続して操作する<strong>手元の画面アプリ</strong>です。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  U[あなた] --> G[SAP GUI\\n手元の PC]
  G --> S[SAP システム\\nサーバー]
  S --> D[(業務データ)]`}
              />
              <Callout variant="tip">
                銀行の ATM に例えると、<strong>ATM 画面 ＝ SAP GUI</strong>、<strong>銀行の本番処理 ＝ SAP サーバー</strong>です。ATM を操作するだけで口座（データ）が動くように、GUI を操作すれば業務処理が動きます。
              </Callout>
              <Dialog speaker="a">
                だから GUI の操作が分からないと、中の ABAP や業務画面までたどり着けない、ということですね。
              </Dialog>
              <Dialog speaker="b">
                ATM の例え、すごく分かりやすいです！手元の機械を通してサーバーに命令を送る感じ。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜ先に GUI を学ぶのか",
          plainText:
            "なぜ操作を先に学ぶのか\n開発者も業務ユーザーも、同じ SAP GUI で画面を開く。ログイン・トランザクション・F4 などの共通操作を知っていると、研修や実務の説明が一気に腹落ちしやすくなる。\n先生：プログラムの中身を学ぶ前に、「車のハンドルとブレーキ」の位置を覚える段階だと思ってください。\nAくん：GUI が分かれば、後の ABAP 研修で「画面で確認する」がすぐできる。土台が大事。\nBちゃん：業務担当者も開発者も同じ画面を使うなら、まず共通言語を持っておいた方がいいですね。",
          content: (
            <>
              <h2>なぜ操作を先に学ぶのか</h2>
              <Figure
                src="image/00-gui-why-first.webp"
                alt="開発者・業務担当者・初心者が全員同じ SAP GUI 画面の前に立っている。「共通の出発点」という矢印が画面を指している。GUI スキルが ABAP 研修・業務トレーニング両方への入り口になる構造図。"
                caption="開発者も業務担当者も、全員が SAP GUI から始まる"
                kind="concept"
              />
              <ul>
                <li>開発者も業務担当者も、<strong>同じ SAP GUI</strong> で画面を開く</li>
                <li>ログイン・トランザクション・戻る・検索ヘルプなどは<strong>全画面共通</strong></li>
                <li>操作に慣れると、後の ABAP 研修や業務トレーニングで「画面の話」がすぐ腹落ちする</li>
              </ul>
              <Dialog speaker="teacher">
                プログラムの中身を学ぶ前に、「車のハンドルとブレーキの位置」を覚える段階だと思ってください。
              </Dialog>
              <Dialog speaker="a">
                GUI が分かれば、ABAP 研修で「SE38 を開いて」と言われた瞬間に動けますね。土台が先、は合理的です。
              </Dialog>
              <Dialog speaker="b">
                業務担当の人も同じ画面を使うなら、まず共通の言葉を持っておいた方がいいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "このコースのゴール",
          plainText:
            "コースのゴール\n4つのゴールを目指します。\n1. ログインして目的のトランザクションを開ける\n2. 画面の各部分（ツールバー・ステータスバーなど）の名前が分かる\n3. F1・F3・F4・F8 などショートカットで迷子にならない\n4. 困ったときの対処の型を持つ\n先生：全部がすぐできなくても大丈夫。繰り返し使うほど定着します。\nBちゃん：4つのゴールが明確だと安心して始められます。\nつまずき：「SAP は難しそう」という印象がありますが、操作のルールは意外と少なくシンプルです。まずは触ってみましょう。",
          content: (
            <>
              <h2>このコースのゴール</h2>
              <ol>
                <li>ログインして目的の<strong>トランザクション（画面）</strong>を開ける</li>
                <li>画面の各部分（ツールバー・コマンド欄・ステータスバーなど）の<strong>名前と役割</strong>が分かる</li>
                <li><kbd>F1</kbd>・<kbd>F3</kbd>・<kbd>F4</kbd>・<kbd>F8</kbd> など基本ショートカットで<strong>迷子にならない</strong></li>
                <li>困ったときの<strong>対処の型</strong>を持つ（固まった・遅い・ログインできない）</li>
              </ol>
              <Dialog speaker="teacher">
                全部がすぐにできなくても大丈夫です。繰り返し使うほど定着します。まず「知っている」が大事です。
              </Dialog>
              <Dialog speaker="b">
                4つのゴールが明確だと、どこまで頑張ればいいか分かって安心して始められます！
              </Dialog>
              <Dialog speaker="stumble">
                「SAP は難しそう」という印象がありますが、操作のルールは意外と少なくシンプルです。難しく見えるのは「慣れていないから」だけ。まず触ってみましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SAP GUI の役割として正しいのは？→ SAP システムを操作するためのクライアント（画面）\nQ2 操作を先に学ぶ主な理由は？→ 全画面で共通する操作の土台を作るため\n今日のひとこと：まず「見た目の地図」を持てれば十分。画面の名前が分かると、後の研修が一気に楽になります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="SAP GUI は手元の PC から SAP サーバーへ接続し、画面操作で業務や開発を行うためのクライアントです。SAP 本体（データや業務処理）はサーバー側にあり、GUI はその「窓口」です。"
                question={<strong>SAP GUI の役割として正しいのは？</strong>}
                options={[
                  "SAP のデータベースを直接編集する専用エディタ",
                  "SAP システムを操作するためのクライアント（画面）",
                  "Excel の代替となる表計算ソフト",
                ]}
              />
              <Quiz
                answer={2}
                explanation="ログイン・トランザクション・F4 などは業務画面・開発画面を問わず共通です。土台を先に押さえると、ABAP 研修でも業務トレーニングでも「画面の話」が即座に腹落ちします。"
                question={<strong>操作を先に学ぶ主な理由は？</strong>}
                options={[
                  "ABAP の構文を暗記するため",
                  "SAP をインストールするため",
                  "全画面で共通する操作の土台を作るため",
                ]}
              />
              <Dialog speaker="closing">
                まず「見た目の地図」を持てれば十分です。画面の名前が分かると、後の研修が一気に楽になりますよ。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
