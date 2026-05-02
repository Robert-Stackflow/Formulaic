import Link from "next/link";
import type { Metadata } from "next";
import { PageLayout } from "@/components/page-layout";
import { getAllTags, getTaggedPages } from "@/lib/tags";

export default function TagsPage() {
  const tags = getAllTags();
  const pages = getTaggedPages();

  const tagCounts = tags.map((tag) => ({
    tag,
    count: pages.filter((page) => page.tags.includes(tag)).length,
  }));

  return (
    <PageLayout
      title="所有标签"
      description={`共 ${tags.length} 个标签`}
      maxWidth="xl"
    >
      <div className="flex flex-wrap gap-3">
        {tagCounts.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-fd-border px-3 py-1 text-sm text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/30"
          >
            {tag}
            <span className="ml-2 text-xs text-fd-muted-foreground/70">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: "所有标签",
  description: "查看所有标签与对应文章",
};
