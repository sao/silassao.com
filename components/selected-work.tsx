import Link from "next/link";
import SectionHeading from "@/components/section-heading";

type WorkItem = {
  slug: string;
  name: string;
  role: string;
  period: string;
};

export default function SelectedWork({ items }: { items: WorkItem[] }) {
  return (
    <section>
      <SectionHeading>selected work</SectionHeading>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/work/${item.slug}`}
              className="group block"
            >
              <span className="text-fg-muted group-hover:text-fg transition-colors">
                {item.name}
              </span>
              <span className="block text-sm text-fg-subtle">
                {item.role} {"// "}{item.period}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/work"
        className="mt-4 inline-block text-sm text-fg-subtle hover:text-fg-muted transition-colors"
      >
        all work &rarr;
      </Link>
    </section>
  );
}
