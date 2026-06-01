import { cn } from "../lib/cn";

interface LessonLinkButtonProps {
  href: string;
  label: string;
  className?: string;
}

export function LessonLinkButton({ href, label, className }: LessonLinkButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "ml-auto flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-white px-4 py-2 text-sm font-semibold text-brand no-underline transition hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand/50 dark:bg-slate-900 dark:text-brand dark:hover:bg-brand/20",
        className
      )}
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}
