import { useState, useEffect, type FormEvent } from "react";

const STORAGE_KEY = "umami_user";
const SKIP_KEY = "umami_skip_until";
const SKIP_COUNTDOWN = 5;

interface UmamiUser {
  name: string;
  email: string;
}

declare global {
  interface Window {
    umami?: {
      identify: (data: Record<string, string>) => void;
    };
  }
}

function getStoredUser(): UmamiUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UmamiUser) : null;
  } catch {
    return null;
  }
}

function isSkippedToday(): boolean {
  const until = localStorage.getItem(SKIP_KEY);
  return !!until && Date.now() < Number(until);
}

function skipForToday(): void {
  localStorage.setItem(SKIP_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
}

export function UmamiIdentify() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(SKIP_COUNTDOWN);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      window.umami?.identify({ name: stored.name, email: stored.email });
    } else if (!isSkippedToday()) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [open, countdown]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const user: UmamiUser = { name: name.trim(), email: email.trim() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.umami?.identify({ name: user.name, email: user.email });
    setOpen(false);
  }

  function handleSkip() {
    skipForToday();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
          はじめに
        </h2>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          記録のため、名前（ニックネームも可）とメールアドレスを入力してください。
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              お名前
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="taro.yamada@abeam.com"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
          >
            開始する
          </button>
        </form>
        <div className="mt-3 flex justify-center">
          {countdown > 0 ? (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {countdown}秒後にスキップできます
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:text-slate-500 dark:hover:text-slate-300"
            >
              今日はスキップする
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
