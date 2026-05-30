interface ProgressBarProps {
  /** 0〜1 の進捗割合 */
  ratio: number;
}

export function ProgressBar({ ratio }: ProgressBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent">
      <div
        className="h-full bg-brand transition-[width] duration-300 ease-out"
        style={{ width: `${Math.round(ratio * 100)}%` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
      />
    </div>
  );
}
