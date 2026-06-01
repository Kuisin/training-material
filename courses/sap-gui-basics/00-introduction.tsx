import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CharacterIntro,
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
            "SAP GUI とは\nSAP という業務システムに接続するための“窓口”ソフトです。この章では、なぜ操作の基本を先に学ぶのかを整理します。\n⏱ 10分 / 📶 初学者 / 🏷 SAP GUI 基礎",
          content: (
            <>
              <hgroup>
                <h1>SAP GUI とは</h1>
                <p>
                  SAP という業務システムに接続するための<strong>“窓口”ソフト</strong>です。この章では、なぜ操作の基本を先に学ぶのかを整理します。
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
          title: "登場人物",
          plainText:
            "3人で学ぶ\n先生と新卒2人。SAP は初めてでも、パソコン操作の経験はあれば大丈夫、という前提で進めます。",
          content: (
            <>
              <h2>3人で学ぶ</h2>
              <CharacterIntro speaker="teacher">
                SAP GUI（サップ・ジー・ユー・アイ）は、SAP システムを操作するための画面です。まずは「どこを触れば何が起きるか」を体で覚えましょう。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                開発の研修に入る前に、画面の共通ルールを押さえたいです。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                ログイン画面は見たことがあるけど、その先がまだピンときません…。
              </CharacterIntro>
              <Dialog speaker="teacher">
                大丈夫です。今日は“見た目の地図”から始めます。細かい業務知識は後からで十分です。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAPとGUI",
          plainText:
            "SAP＝業務の頭脳、GUI＝操作する窓\nSAP は会社の業務データや処理を担うサーバー側のシステム。SAP GUI はそのシステムに指示を送るクライアント（手元の画面）です。",
          content: (
            <>
              <h2>SAP ＝ 業務の頭脳、GUI ＝ 操作する窓</h2>
              <p>
                <strong>SAP</strong> は、会計・購買・在庫などの業務を支える<strong>サーバー側</strong>のシステムです。
                <strong>SAP GUI</strong> は、その SAP に接続して操作する<strong>手元の画面アプリ</strong>です。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  U[あなた] --> G[SAP GUI\n手元のPC]
  G --> S[SAP システム\nサーバー]
  S --> D[(業務データ)]`}
              />
              <Callout variant="tip">
                銀行の ATM に例えると、ATM 画面が SAP GUI、銀行の本番処理が SAP サーバー、というイメージに近いです。
              </Callout>
              <Dialog speaker="a">
                だから GUI の操作が分からないと、中の ABAP や業務画面までたどり着けない、ということですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "なぜ先にGUI",
          plainText:
            "なぜ操作を先に学ぶのか\n開発者も業務ユーザーも、同じ SAP GUI で画面を開く。ログイン・トランザクション・F4 などの共通操作を知っていると、研修や実務の説明が一気に理解しやすくなる。",
          content: (
            <>
              <h2>なぜ操作を先に学ぶのか</h2>
              <ul>
                <li>開発者も業務担当も、<strong>同じ SAP GUI</strong> で画面を開く</li>
                <li>ログイン、トランザクション、戻る、検索ヘルプなどは<strong>全画面共通</strong></li>
                <li>操作に慣れると、後の ABAP 研修や業務トレーニングで「画面の話」がすぐ腹落ちする</li>
              </ul>
              <Dialog speaker="teacher">
                プログラムの中身を学ぶ前に、「車のハンドルとブレーキ」の位置を覚える段階だと思ってください。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SAP GUI の役割は？→ SAP システムを操作するクライアント\nQ2 先に GUI を学ぶ理由は？→ 全画面共通の操作の土台になるから",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="SAP GUI は手元の PC から SAP サーバーへ接続し、画面操作で業務や開発を行うためのクライアントです。"
                question={<strong>SAP GUI の役割として正しいのは？</strong>}
                options={[
                  "SAP のデータベースを直接編集する専用エディタ",
                  "SAP システムを操作するためのクライアント（画面）",
                  "Excel の代替となる表計算ソフト",
                ]}
              />
              <Quiz
                answer={2}
                explanation="ログイン、トランザクション、F4 などは業務画面・開発画面を問わず共通です。土台を先に押さえると学習効率が上がります。"
                question={<strong>操作を先に学ぶ主な理由は？</strong>}
                options={[
                  "ABAP の構文を暗記するため",
                  "SAP をインストールするため",
                  "全画面で共通する操作の土台を作るため",
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
