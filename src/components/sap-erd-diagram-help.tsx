/** SAP FI 用 ER 図（react-erd）の見方・記号説明（ExpandableFullscreen の折りたたみ用） */
export function SapErdDiagramHelp() {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          図の見方
        </h3>
        <ul className="m-0 list-disc space-y-1 pl-5">
          <li>
            1つの箱＝<strong>1テーブル</strong>。上端の色付きバーと表名（例: <code>BKPF</code>）で識別します。
          </li>
          <li>
            各行＝<strong>1列</strong>。左が<strong>日本語名 (列コード)</strong>、右が型の代表分類（text / number / datetime / money）。
          </li>
          <li>
            箱と箱を結ぶ<strong>線</strong>＝参照関係（外部キー）。左の列から右のテーブルへつながります（多くは 1対多）。
          </li>
          <li>
            配置はおおむね<strong>左→右</strong>にマスタ・ヘッダ・明細の順。
            <strong>背景（余白）をドラッグ</strong>して全体を移動、ホイール（またはピンチ）で拡大・縮小できます。
          </li>
          <li>
            この図は<strong>閲覧専用</strong>です。テーブルの移動・列の接続・関係線の編集はできません（研修資料用の固定レイアウト）。
          </li>
          <li>
            見づらいときは図右上の<strong>「全画面」</strong>で拡大。全画面中は <kbd className="rounded border px-1 text-[0.7rem]">Esc</kbd> または「閉じる」で戻ります。
          </li>
        </ul>
      </section>
      <section>
        <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          行頭のアイコン
        </h3>
        <ul className="m-0 space-y-2 p-0">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 font-mono text-base leading-none" aria-hidden>
              🔑
            </span>
            <span>
              <strong>鍵マーク</strong> … そのテーブルの<strong>主キー（PK）</strong>。行を一意に決める列（伝票なら会社コード＋伝票番号＋年度など）。
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 font-mono text-base leading-none" aria-hidden>
              🔗
            </span>
            <span>
              <strong>リンクマーク</strong> … <strong>外部キー</strong>。別テーブルの列を参照（例: 明細の会社コード → ヘッダの会社コード）。
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 font-mono text-base leading-none" aria-hidden>
              🔑🔗
            </span>
            <span>
              <strong>鍵＋リンク</strong> … 主キーかつ他表への参照を兼ねる列。
            </span>
          </li>
          <li className="flex gap-2 pl-6 text-slate-600 dark:text-slate-400">
            <span>（アイコンなし）… 通常列。</span>
          </li>
        </ul>
        <p className="mb-0 mt-2 text-xs text-slate-500 dark:text-slate-400">
          図上の実アイコンは react-erd の Material Design Icons（鍵・リンク）で表示されます。上記は意味の対応です。
        </p>
      </section>
    </div>
  );
}
