import type { Metadata } from "next";
import PageContainer from "@/components/page-container";
import SectionHeading from "@/components/section-heading";
import BlogPostRow from "@/components/blog-post-row";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "blog",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <PageContainer>
      <SectionHeading prefix="##">blog</SectionHeading>
      <ul className="space-y-1">
        {posts.map((post) => (
          <BlogPostRow
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
          />
        ))}
      </ul>
    </PageContainer>
  );
}
