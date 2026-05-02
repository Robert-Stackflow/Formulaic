import Link from "next/link";
import type { Metadata } from "next";
import { PageLayout } from "@/components/page-layout";
import { getAllTags, getTaggedPages } from "@/lib/tags";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const pages = getTaggedPages().filter((page) =>
    page.tags.includes(decodedTag),
  );

  return (
    <PageLayout
      title={`标签：${decodedTag}`}
      description={`共 ${pages.length} 篇文章`}
      maxWidth="xl"
    >
      <div className="grid gap-4">
        {pages.map((page) => (
          <Link
            key={page.url}
            href={page.url}
            className="rounded-2xl border border-fd-border bg-fd-card p-4 transition hover:border-fd-foreground/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-base font-semibold text-fd-foreground">
                  {page.title}
                </div>
                {page.description && (
                  <p className="mt-1 text-sm text-fd-muted-foreground">
                    {page.description}
                  </p>
                )}
              </div>
              {page.readingTime && (
                <div className="text-xs text-fd-muted-foreground">
                  阅读时长：{page.readingTime}
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-fd-muted-foreground">
              {page.tags.map((t) => (
                <span
                  key={`${page.url}-${t}`}
                  className={`rounded-full border px-2 py-0.5 ${
                    t === decodedTag
                      ? "border-fd-foreground/30 text-fd-foreground"
                      : "border-fd-border"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `标签：${decodedTag}`,
    description: `查看所有包含标签 ${decodedTag} 的文章`,
  };
}
