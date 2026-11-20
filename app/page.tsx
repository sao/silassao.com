import Image from "next/image";
import { WorkList } from "./work-list";

type Role = {
  company: string;
  title: string;
  years: string;
  href: string;
};

const work: Role[] = [
  { company: "Supabase", title: "Head of Design", years: "2026 – Now", href: "https://supabase.com" },
  { company: "IBM", title: "Design Director, Data and AI", years: "2025 – 2026", href: "https://ibm.com" },
  { company: "DataStax", title: "Head of Product Experience", years: "2020 – 2025", href: "https://datastax.com" },
  { company: "New Relic", title: "Director of Product Design", years: "2019 – 2020", href: "https://newrelic.com" },
  { company: "Moovel", title: "Director of Product Design", years: "2018 – 2019", href: "https://moovelus.com" },
  { company: "Cloudability", title: "Lead Product Designer", years: "2017 – 2018", href: "https://cloudability.com" },
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
      <main className="max-w-[528px] p-6 lowercase sm:max-w-[576px] sm:p-12 md:max-w-[608px] md:p-16">
        <Image src="/logo.svg" alt="Silas Sao" width={120} height={40} className="mb-10 h-10 w-auto" />

        <h1 className="mb-8 text-base">
          <span className="font-semibold text-bright">Silas Sao</span>{" "}
          <span className="text-content">is an engineer turned designer.</span>
        </h1>

        <div className="mb-10 space-y-4 text-base leading-relaxed text-content">
          <p>
            I&apos;m head of design at{" "}
            <a href="https://supabase.com" target="_blank" className={link}>Supabase</a>.
          </p>
          <p>
            Previously, I was a design director for Data and AI at{" "}
            <a href="https://ibm.com" target="_blank" className={link}>IBM</a>, working on agentic
            experiences and design systems.
          </p>
          <p>
            Before that, I built the product experience team at{" "}
            <a href="https://datastax.com" target="_blank" className={link}>DataStax</a>,
            spanning brand and product design, technical content, and product analytics. At{" "}
            <a href="https://newrelic.com" target="_blank" className={link}>New Relic</a>, I led
            design for APM, infrastructure, and logs.
          </p>
          <p>
            I was born in Hawaii and now live in the Pacific Northwest. I&apos;m completely
            self-taught, and I spend my time experimenting with emerging technologies and exploring
            how they shape human behavior.
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
          <WorkList roles={work} />
        </section>

        <footer className="text-xs text-faint">© Silas Sao {new Date().getFullYear()}</footer>
      </main>
    </div>
  );
}
