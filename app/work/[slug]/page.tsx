import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import PageContainer from "@/components/page-container";
import WorkDetailLayout from "@/components/work-detail-layout";
import { mdxComponents } from "@/components/mdx-components";
import { getWorkEntries, getWorkEntry } from "@/lib/content";

export function generateStaticParams() {
  return getWorkEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWorkEntry(slug);
  if (!entry) return {};
  return {
    title: entry.name,
    description: entry.description,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getWorkEntry(slug);
  if (!entry) notFound();

  return (
    <PageContainer>
      <WorkDetailLayout
        name={entry.name}
        role={entry.role}
        period={entry.period}
        tags={entry.tags}
      >
        <MDXRemote
          source={entry.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: "github-dark-default",
                    keepBackground: false,
                  },
                ],
              ],
            },
          }}
        />
      </WorkDetailLayout>
    </PageContainer>
  );
}
