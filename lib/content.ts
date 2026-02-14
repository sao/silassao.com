import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  published: boolean;
  readingTime: string;
  content: string;
};

export type WorkEntry = {
  slug: string;
  name: string;
  role: string;
  period: string;
  description: string;
  tags?: string[];
  image?: string;
  published: boolean;
  order: number;
  content: string;
};

function readMdxFiles(dir: string) {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const filePath = path.join(fullPath, f);
      const raw = fs.readFileSync(filePath, "utf-8");
      const slug = f.replace(/\.mdx$/, "");
      return { slug, raw };
    });
}

export function getBlogPosts(): BlogPost[] {
  return readMdxFiles("blog")
    .map(({ slug, raw }) => {
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        description: data.description,
        published: data.published !== false,
        readingTime: stats.text,
        content,
      };
    })
    .filter((p) => p.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function getWorkEntries(): WorkEntry[] {
  return readMdxFiles("work")
    .map(({ slug, raw }) => {
      const { data, content } = matter(raw);
      return {
        slug,
        name: data.name ?? slug,
        role: data.role ?? "",
        period: data.period ?? "",
        description: data.description ?? "",
        tags: data.tags,
        image: data.image,
        published: data.published !== false,
        order: data.order ?? 99,
        content,
      };
    })
    .filter((e) => e.published)
    .sort((a, b) => a.order - b.order);
}

export function getWorkEntry(slug: string): WorkEntry | undefined {
  return getWorkEntries().find((e) => e.slug === slug);
}
