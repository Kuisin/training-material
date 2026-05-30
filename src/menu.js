// レッスン一覧ページのスタイルエントリ（Tailwind 共有スタイルを読み込む）。
import './styles.css';

// レッスン側のテーマ選択（localStorage）を一覧ページにも反映する。
const stored = localStorage.getItem('training-theme');
const theme =
  stored === 'light' || stored === 'dark'
    ? stored
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
document.documentElement.dataset.theme = theme;
