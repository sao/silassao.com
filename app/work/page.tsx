import type { Metadata } from "next";
import PageContainer from "@/components/page-container";
import SectionHeading from "@/components/section-heading";
import WorkEntryComponent from "@/components/work-entry";
import { getWorkEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "work",
};

export default function WorkPage() {
  const entries = getWorkEntries();

  return (
    <PageContainer>
      <SectionHeading prefix="##">work</SectionHeading>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <WorkEntryComponent
            key={entry.slug}
            slug={entry.slug}
            name={entry.name}
            role={entry.role}
            period={entry.period}
            description={entry.description}
            tags={entry.tags}
          />
        ))}
      </ul>
    </PageContainer>
  );
}
