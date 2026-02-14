import Link from "next/link";

export default function BlogPostRow({
  slug,
  title,
  date,
}: {
  slug: string;
  title: string;
  date: string;
}) {
  return (
    <li>
      <Link
        href={`/blog/${slug}`}
        className="flex items-baseline justify-between gap-4 group py-1"
      >
        <span className="text-fg-muted group-hover:text-fg transition-colors truncate">
          {title}
        </span>
        <span className="text-sm font-mono text-fg-subtle shrink-0">
          {date}
        </span>
      </Link>
    </li>
  );
}
