import Link from "next/link";

export default function WorkEntry({
  slug,
  name,
  role,
  period,
  description,
  tags,
}: {
  slug: string;
  name: string;
  role: string;
  period: string;
  description: string;
  tags?: string[];
}) {
  return (
    <li>
      <Link href={`/work/${slug}`} className="group block py-3">
        <span className="text-fg-muted group-hover:text-fg transition-colors">
          {name}
        </span>
        <span className="block text-sm text-fg-subtle mt-0.5">
          {role} {"// "}{period}
        </span>
        <p className="text-sm text-fg-subtle mt-1">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
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
      </Link>
    </li>
  );
}
