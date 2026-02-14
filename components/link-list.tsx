import SectionHeading from "@/components/section-heading";

const links = [
  { label: "X", href: "https://x.com/silassao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/silassao/" },
  { label: "Instagram", href: "https://www.instagram.com/silassao/" },
  { label: "Substack", href: "https://userinference.substack.com/" },
];

export default function LinkList() {
  return (
    <section>
      <SectionHeading>connect</SectionHeading>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-2"
            >
              {link.label}
              <span className="text-fg-subtle">&rarr;</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
