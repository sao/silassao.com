// The site's words, in one place. The homepage, /llms.txt, and the structured
// data search engines read are all built from this, so an edit here shows up
// everywhere. (README.md is still kept in sync by hand.)

export const site = {
  url: "https://silassao.com",
  name: "Silas Sao",
  title: "Silas Sao",
  description: "Head of design at Supabase.",
};

// A paragraph is a run of plain text and links.
export type Segment = string | { text: string; href: string };
export type Paragraph = Segment[];

const supabase = { text: "Supabase", href: "https://supabase.com" };
const datastax = { text: "DataStax", href: "https://datastax.com" };
const ibm = { text: "IBM", href: "https://ibm.com" };
const newRelic = { text: "New Relic", href: "https://newrelic.com" };

export const bio: Paragraph[] = [
  ["Today, I'm head of design at ", supabase, "."],
  [
    "Previously, I built and led design, content, and growth teams at ",
    datastax,
    ". After 5 years, I helped lead the company through an acquisition by ",
    ibm,
    ". At IBM, I was a design director for data and AI, working on agentic experiences and design systems.",
  ],
  [
    "Before that, I led the design teams responsible for APM, infrastructure, traces, and logs at ",
    newRelic,
    ".",
  ],
];

export type Role = {
  company: string;
  title: string;
  years: string;
  href: string;
};

export const work: Role[] = [
  { company: "Supabase", title: "Head of Design", years: "Currently", href: supabase.href },
  { company: "IBM", title: "Design Director, Data and AI", years: "2025 – 2026", href: ibm.href },
  { company: "DataStax", title: "Head of Product Experience", years: "2020 – 2025", href: datastax.href },
  { company: "New Relic", title: "Director of Product Design", years: "2019 – 2020", href: newRelic.href },
  { company: "Moovel", title: "Director of Product Design", years: "2018 – 2019", href: "https://moovelus.com" },
  { company: "Cloudability", title: "Lead Product Designer", years: "2017 – 2018", href: "https://cloudability.com" },
];

export const socials = [
  { label: "X", href: "https://x.com/silassao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/silassao/" },
  { label: "Instagram", href: "https://www.instagram.com/silassao/" },
  { label: "Substack", href: "http://userinference.substack.com/" },
];

// --- Machine-readable versions ---------------------------------------------

function paragraphToMarkdown(p: Paragraph) {
  return p.map((s) => (typeof s === "string" ? s : `[${s.text}](${s.href})`)).join("");
}

// /llms.txt: the whole site as markdown, for agents and LLMs (llmstxt.org).
export function llmsTxt() {
  return [
    `# ${site.name}`,
    `> ${site.name} is ${work[0].title.toLowerCase()} at ${work[0].company}.`,
    ...bio.map(paragraphToMarkdown),
    "## Work",
    work.map((r) => `- [${r.company}](${r.href}): ${r.title}, ${r.years}`).join("\n"),
    "## Links",
    [`- [Website](${site.url})`, ...socials.map((s) => `- [${s.label}](${s.href})`)].join("\n"),
  ].join("\n\n") + "\n";
}

// schema.org Person, embedded on the homepage for search engines and agents.
export function personJsonLd() {
  const current = work[0];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: current.title,
    worksFor: { "@type": "Organization", name: current.company, url: current.href },
    alumniOf: work.slice(1).map((r) => ({ "@type": "Organization", name: r.company, url: r.href })),
    sameAs: socials.map((s) => s.href),
  };
}
