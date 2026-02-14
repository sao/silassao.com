import PageContainer from "@/components/page-container";
import IdentityBlock from "@/components/identity-block";
import Divider from "@/components/divider";
import RecentPosts from "@/components/recent-posts";
import SelectedWork from "@/components/selected-work";
import LinkList from "@/components/link-list";
import { getBlogPosts } from "@/lib/content";
import { getWorkEntries } from "@/lib/content";

export default function Home() {
  const posts = getBlogPosts()
    .slice(0, 5)
    .map((p) => ({ slug: p.slug, title: p.title, date: p.date }));

  const work = getWorkEntries()
    .slice(0, 3)
    .map((w) => ({
      slug: w.slug,
      name: w.name,
      role: w.role,
      period: w.period,
    }));

  return (
    <PageContainer>
      <IdentityBlock />
      <Divider />
      <RecentPosts posts={posts} />
      <div className="mt-10" />
      <SelectedWork items={work} />
      <Divider />
      <LinkList />
    </PageContainer>
  );
}
