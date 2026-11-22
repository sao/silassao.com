import Image from "next/image";
import { WaterBackground } from "./water-background";
import { CompanyLogo } from "../../company-logo";
import { bio, site, socials, work, type Paragraph } from "../../content";

const link =
  "text-bright underline decoration-stroke-strong underline-offset-4 transition-colors hover:decoration-bright";

function Prose({ paragraph }: { paragraph: Paragraph }) {
  return (
    <p>
      {paragraph.map((s, i) =>
        typeof s === "string" ? (
          s
        ) : (
          <a key={i} href={s.href} target="_blank" className={link}>
            {s.text}
          </a>
        ),
      )}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-sm text-faint">{children}</h2>;
}

export function V2Home() {
  return (
    <div data-version="2" className="min-h-screen bg-[#080808] text-content">
      <WaterBackground />
      <main className="relative max-w-[528px] p-6 sm:max-w-[576px] sm:p-12 md:max-w-[608px] md:p-16">
        <Image src="/logo.svg" alt="Silas Sao" width={120} height={40} className="mb-10 h-10 w-auto" />

        <div className="mb-10 space-y-4 text-base leading-relaxed text-content">
          <h1 className="text-base text-content">
            Hi, I&apos;m <span className="font-semibold text-bright">{site.name}</span> 👋
          </h1>
          {bio.map((p, i) => (
            <Prose key={i} paragraph={p} />
          ))}
        </div>

        <div className="mb-16 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" className={link}>
              {s.label}
            </a>
          ))}
        </div>

        <section className="mb-16">
          <SectionLabel>Work</SectionLabel>
          <ul className="space-y-1">
            {work.map((r) => (
              <li key={r.company} className="flex items-center gap-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-bright">
                  <CompanyLogo company={r.company} className="h-[18px] w-[18px]" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-4">
                  <span className="flex flex-col">
                    <span className="text-sm text-bright">{r.company}</span>
                    <span className="text-sm text-muted">{r.title}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted">{r.years}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="text-xs text-faint">© {site.name} {new Date().getFullYear()}</footer>
      </main>
    </div>
  );
}
