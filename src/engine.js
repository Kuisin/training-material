// ============================================================================
//  レッスン共有エンジン（コンポーネント本体）
//  ----------------------------------------------------------------------------
//  各レッスンHTMLは「中身（#deck 内のスライド）」と <body> の data-* 属性だけを
//  持てばよい。上部バー・コントロール・ジャンプメニュー・進捗バー・AIボタン・
//  スライド送り・Mermaid描画・確認テスト・「次の章」遷移は、すべてここが生成・配線する。
//
//  レッスン側で使う data-* 属性（<body> に付ける）:
//    data-title  … レッスンタイトル（上部バーと <title> に使用）
//    data-next   … 次の章のファイル名（例 "01-overview.html"）。最終章は空。
//    data-prev   … 前の章のファイル名（例 "00-introduction.html"）。最初の章は空。
//    data-index  … レッスン一覧へのリンク（既定 "../index.html"）
// ============================================================================
import '@picocss/pico/css/pico.min.css';
import './styles.css';
import mermaid from 'mermaid';

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

async function boot() {
  const title = (document.body.dataset.title || document.title || '').trim();
  const nextHref = (document.body.dataset.next || '').trim();
  const prevHref = (document.body.dataset.prev || '').trim();
  const indexHref = (document.body.dataset.index || '../index.html').trim();
  document.title = title ? `${title} — ABeam 研修` : document.title;

  // ---- クローム（共通の枠）を生成して #deck の前後に差し込む ----
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="progress" id="progress"></div>
    <button id="aiAskBtn" class="ai-fab contrast" title="このレッスンの内容をコピーして Copilot に質問する">🤖 Copilotに質問</button>
    <header class="topbar">
      <button id="menuBtn" class="secondary">☰ メニュー</button>
      <h1>${escapeHtml(title)}</h1>
      <span class="counter" id="counterTop"></span>
      <a href="${escapeHtml(indexHref)}" role="button" class="contrast outline">レッスン一覧</a>
    </header>
    <div id="menu" role="navigation" aria-label="スライド"><h2>スライド</h2><ol id="menuList"></ol></div>
    <div id="overlay"></div>
  `);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="controls">
      <button id="prevBtn" class="secondary">← 前へ</button>
      <span class="counter" id="counterBottom"></span>
      <span class="spacer"></span>
      <button id="nextBtn">次へ →</button>
    </footer>
  `);

  // ---- Mermaid 図を（デッキが隠れている間に）描画して幅を正しく取る ----
  mermaid.initialize({ startOnLoad: false });
  try { await mermaid.run({ querySelector: '.mermaid' }); } catch (e) {}

  // ---- スライドエンジン ----
  const slides   = [...document.querySelectorAll('#deck .slide')];
  const menuList = document.getElementById('menuList');
  const progress = document.getElementById('progress');
  const cTop = document.getElementById('counterTop');
  const cBot = document.getElementById('counterBottom');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const menu = document.getElementById('menu');
  const overlay = document.getElementById('overlay');
  let idx = 0;

  slides.forEach((s, i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#s' + (i + 1);
    a.textContent = (i + 1) + '. ' + (s.dataset.title || ('スライド ' + (i + 1)));
    a.addEventListener('click', e => { e.preventDefault(); show(i); closeMenu(); });
    li.appendChild(a); menuList.appendChild(li);
  });
  const menuLinks = [...menuList.querySelectorAll('a')];

  function show(i) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, n) => s.classList.toggle('active', n === idx));
    menuLinks.forEach((a, n) => a.classList.toggle('active', n === idx));
    const label = (idx + 1) + ' / ' + slides.length;
    cTop.textContent = label; cBot.textContent = label;
    progress.style.width = ((idx + 1) / slides.length * 100) + '%';
    if (idx === 0) {
      prevBtn.disabled = !prevHref;          // 前の章があれば押せる、無ければ無効
      prevBtn.textContent = prevHref ? '← 前の章' : '← 前へ';
    } else {
      prevBtn.disabled = false;
      prevBtn.textContent = '← 前へ';
    }
    if (idx === slides.length - 1) {
      nextBtn.disabled = !nextHref;          // 次の章があれば押せる、無ければ無効
      nextBtn.textContent = nextHref ? '次の章 →' : '次へ →';
    } else {
      nextBtn.disabled = false;
      nextBtn.textContent = '次へ →';
    }
    history.replaceState(null, '', '#s' + (idx + 1));
    window.scrollTo(0, 0);
  }
  function goNext() {
    if (idx === slides.length - 1) { if (nextHref) location.href = nextHref; }
    else show(idx + 1);
  }
  function goPrev() {
    if (idx === 0) { if (prevHref) location.href = prevHref; }
    else show(idx - 1);
  }
  function openMenu(){ menu.classList.add('open'); overlay.classList.add('open'); }
  function closeMenu(){ menu.classList.remove('open'); overlay.classList.remove('open'); }

  document.getElementById('menuBtn').addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext();
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') goPrev();
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key === 'Escape') closeMenu();
  });

  // ---- 確認テスト ----
  document.querySelectorAll('.quiz').forEach(q => {
    const answer = Number(q.dataset.answer);
    const fb = q.querySelector('.feedback');
    const btns = q.querySelectorAll('button');
    btns.forEach((btn, i) => btn.addEventListener('click', () => {
      btns.forEach((b, j) => {
        b.disabled = true;
        if (j === answer) b.classList.add('correct');
        else if (j === i) b.classList.add('wrong');
      });
      fb.textContent = (i === answer ? '✅ 正解！ ' : '❌ 惜しい！ ') + (q.dataset.explanation || '');
    }));
  });

  // ---- AIに質問: レッスン全文をコピーして Copilot へ貼り付けてもらう ----
  const slideText = s => s.textContent.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
  document.getElementById('aiAskBtn').addEventListener('click', async () => {
    const body = slides.map(s => '## ' + (s.dataset.title || '') + '\n' + slideText(s)).join('\n\n');
    const text = '以下は研修レッスン「' + title + '」の内容です。この内容について質問があります。\n\n' +
      '----\n' + body + '\n----\n\n【質問】（ここに知りたいことを書いてください）';
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch (e) {}
    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { copied = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    alert(copied
      ? 'レッスン内容をコピーしました。\nCopilot（チャット）に貼り付けて、末尾に質問を書いて送信してください。'
      : 'コピーできませんでした。お手数ですが画面の内容を選択してコピーしてください。');
  });

  // ---- 開始（#s3 のようなディープリンクに対応） ----
  document.body.classList.add('ready');
  const m = location.hash.match(/^#s(\d+)/);
  show(m ? parseInt(m[1]) - 1 : 0);
}

boot();
