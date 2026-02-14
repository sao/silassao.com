import Link from "next/link";

export default function PostLayout({
  title,
  date,
  readingTime,
  children,
}: {
  title: string;
  date: string;
  readingTime: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <Link
        href="/blog"
        className="text-sm text-fg-subtle hover:text-fg-muted transition-colors"
      >
        &larr; back to blog
      </Link>
      <h1 className="text-2xl font-medium lowercase mt-6 mb-2">{title}</h1>
      <p className="text-sm font-mono text-fg-subtle mb-8">
        {date} {"// "}{readingTime}
      </p>
      <div className="prose prose-invert max-w-none">{children}</div>
    </article>
  );
}
