interface MetaItem {
  icon: string;
  text: string;
}

interface LessonMetaProps {
  items: MetaItem[];
}

export function LessonMeta({ items }: LessonMetaProps) {
  return (
    <dl className="not-prose my-5 flex flex-wrap gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <span aria-hidden>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </dl>
  );
}
