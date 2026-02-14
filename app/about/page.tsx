import type { Metadata } from "next";
import PageContainer from "@/components/page-container";
import SectionHeading from "@/components/section-heading";
import Divider from "@/components/divider";
import LinkList from "@/components/link-list";

export const metadata: Metadata = {
  title: "about",
};

export default function AboutPage() {
  return (
    <PageContainer>
      <SectionHeading prefix="##">about</SectionHeading>
      <div className="space-y-4 text-fg-muted leading-relaxed">
        <p>
          my name is silas. i&apos;m a software engineer turned product
          designer, working on AI.
        </p>
        <p>
          i was born in hawaii and now live in the pacific northwest. as a
          lifelong learner, i&apos;m completely self-taught. i devote my time to
          experimenting with emerging technologies and exploring how they shape
          human behavior. being around passionate builders and makers energizes
          me. i have a high bar for quality and am obsessed with every detail.
        </p>
        <p>
          currently, you can find me leading design at IBM, building with agents, or writing the next post for{" "}
          <a
            href="https://userinference.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg underline decoration-fg-subtle underline-offset-3 hover:decoration-fg transition-colors"
          >
            my newsletter
          </a>
          .
        </p>
      </div>

      <Divider />

      <SectionHeading>now</SectionHeading>
      <ul className="space-y-2 text-fg-muted text-sm">
        <li>leading design for agentic developer tools at IBM</li>
        <li>writing about design, technology, and human behavior</li>
        <li>rebuilding this site from the ground up</li>
      </ul>

      <Divider />

      <LinkList />
    </PageContainer>
  );
}
