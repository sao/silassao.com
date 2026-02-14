import Link from "next/link";
import SectionHeading from "@/components/section-heading";

type Post = {
  slug: string;
  title: string;
  date: string;
};

export default function RecentPosts({ posts }: { posts: Post[] }) {
  return (
    <section>
      <SectionHeading>recent writing</SectionHeading>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="flex items-baseline justify-between gap-4 group"
            >
              <span className="text-fg-muted group-hover:text-fg transition-colors truncate">
                {post.title}
              </span>
              <span className="text-sm font-mono text-fg-subtle shrink-0">
                {post.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/blog"
        className="mt-4 inline-block text-sm text-fg-subtle hover:text-fg-muted transition-colors"
      >
        all posts &rarr;
      </Link>
    </section>
  );
}
