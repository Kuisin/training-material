import { cn } from "../lib/cn";
import { lessonPageHref } from "../lib/app-href";

interface LessonLinkButtonBaseProps {
  label: string;
  className?: string;
  variant?: "forward" | "back";
}

interface LessonLinkButtonWithHref extends LessonLinkButtonBaseProps {
  href: string;
  courseSlug?: never;
  lessonFile?: never;
}

interface LessonLinkButtonWithCourse extends LessonLinkButtonBaseProps {
  href?: never;
  courseSlug: string;
  lessonFile: string;
}

type LessonLinkButtonProps = LessonLinkButtonWithHref | LessonLinkButtonWithCourse;

export function LessonLinkButton({
  href,
  courseSlug,
  lessonFile,
  label,
  className,
  variant = "forward",
}: LessonLinkButtonProps) {
  const resolvedHref =
    href ?? (courseSlug && lessonFile ? lessonPageHref(courseSlug, lessonFile) : "#");

  return (
    <a
      href={resolvedHref}
      className={cn(
        "ml-auto flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-white px-4 py-2 text-sm font-semibold text-brand no-underline transition hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand/50 dark:bg-slate-900 dark:text-brand dark:hover:bg-brand/20",
        className
      )}
    >
      {variant === "back" ? <span aria-hidden>←</span> : null}
      {label}
      {variant === "forward" ? <span aria-hidden>→</span> : null}
    </a>
  );
}
