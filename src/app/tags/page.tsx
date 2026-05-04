import Link from "next/link";
import type { Metadata } from "next";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "../layout.config";
import { getAllTags, getTaggedPages } from "@/lib/tags";

export default function TagsPage() {
  const tags = getAllTags();
  const pages = getTaggedPages();

  const tagCounts = tags.map((tag) => ({
    tag,
    count: pages.filter((page) => page.tags.includes(tag)).length,
  }));

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-12 sm:py-16 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-fd-foreground mb-2">
                所有标签
              </h1>
              <p className="text-fd-muted-foreground">共 {tags.length} 个标签</p>
            </div>

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
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}

export const metadata: Metadata = {
  title: "所有标签",
  description: "查看所有标签与对应文章",
};
