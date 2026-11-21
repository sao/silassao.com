import Image from "next/image";
import { WaterBackground } from "./water-background";
import { CompanyLogo } from "./company-logo";

type Role = {
  company: string;
  title: string;
  years: string;
};

const work: Role[] = [
  { company: "Supabase", title: "Head of Design", years: "Currently" },
  { company: "IBM", title: "Design Director, Data and AI", years: "2025 – 2026" },
  { company: "DataStax", title: "Head of Product Experience", years: "2020 – 2025" },
  { company: "New Relic", title: "Director of Product Design", years: "2019 – 2020" },
  { company: "Moovel", title: "Director of Product Design", years: "2018 – 2019" },
  { company: "Cloudability", title: "Lead Product Designer", years: "2017 – 2018" },
];

const socials = [
  { label: "X", href: "https://x.com/silassao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/silassao/" },
  { label: "Instagram", href: "https://www.instagram.com/silassao/" },
  { label: "Substack", href: "http://userinference.substack.com/" },
];

const link =
  "text-bright underline decoration-stroke-strong underline-offset-4 transition-colors hover:decoration-bright";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-sm lowercase text-faint">{children}</h2>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-content">
      <WaterBackground />
      <main className="relative max-w-[528px] p-6 lowercase sm:max-w-[576px] sm:p-12 md:max-w-[608px] md:p-16">
        <Image src="/logo.svg" alt="Silas Sao" width={120} height={40} className="mb-10 h-10 w-auto" />

        <h1 className="mb-8 text-base text-content">
          Hi. My name is <span className="font-semibold text-bright">Silas Sao</span>, an
          engineer turned designer.
        </h1>

        <div className="mb-10 space-y-4 text-base leading-relaxed text-content">
          <p>
            Now, I&apos;m head of design at{" "}
            <a href="https://supabase.com" target="_blank" className={link}>Supabase</a>.
          </p>
          <p>
            Previously, I was a design director for Data and AI at{" "}
            <a href="https://ibm.com" target="_blank" className={link}>IBM</a>, working on agentic
            experiences and design systems. I led the team through IBM&apos;s acquisition of{" "}
            <a href="https://datastax.com" target="_blank" className={link}>DataStax</a>, where I
            built product experience, spanning brand and product design, technical content, and
            product analytics.
          </p>
          <p>
            Before that, I led design for APM, infrastructure, traces, and logs at{" "}
            <a href="https://newrelic.com" target="_blank" className={link}>New Relic</a>.
          </p>
        </div>

        <div className="mb-16 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" className={link}>
              {s.label}
            </a>
          ))}
        </div>

        <section className="mb-16">
          <SectionLabel>work</SectionLabel>
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

        <footer className="text-xs text-faint">© Silas Sao {new Date().getFullYear()}</footer>
      </main>
    </div>
  );
}
