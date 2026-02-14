import Link from "next/link";

export default function WorkDetailLayout({
  name,
  role,
  period,
  tags,
  children,
}: {
  name: string;
  role: string;
  period: string;
  tags?: string[];
  children: React.ReactNode;
}) {
  return (
    <article>
      <Link
        href="/work"
        className="text-sm text-fg-subtle hover:text-fg-muted transition-colors"
      >
        &larr; back to work
      </Link>
      <h1 className="text-2xl font-medium lowercase mt-6 mb-2">{name}</h1>
      <p className="text-sm font-mono text-fg-subtle mb-2">
        {role} {"// "}{period}
      </p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-fg-subtle border border-border px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {(!tags || tags.length === 0) && <div className="mb-8" />}
      <div className="prose prose-invert max-w-none">{children}</div>
    </article>
  );
}
