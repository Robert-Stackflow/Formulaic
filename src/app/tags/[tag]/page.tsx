import Link from "next/link";
import type { Metadata } from "next";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "../../layout.config";
import { getAllTags, getTaggedPages } from "@/lib/tags";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  if (!decodedTag || decodedTag.trim() === "") {
    return (
      <HomeLayout {...baseOptions}>
        <div className="p-10 text-center">标签不存在</div>
      </HomeLayout>
    );
  }

  const pages = getTaggedPages()
    .filter((page) => page.tags.includes(decodedTag))
    .filter((page) => page.url && page.url.trim() !== "");

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-12 sm:py-16 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-fd-foreground mb-2">
                标签：{decodedTag}
              </h1>
              <p className="text-fd-muted-foreground">
                共 {pages.length} 篇文章
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Link
                  key={page.url}
                  href={page.url}
                  className="rounded-2xl border border-fd-border bg-fd-card p-4 transition hover:border-fd-foreground/30 flex flex-col"
                >
                  <div className="flex-1">
                    <div className="text-base font-semibold text-fd-foreground">
                      {page.title}
                    </div>
                    {page.description && (
                      <p className="mt-1 text-sm text-fd-muted-foreground line-clamp-2">
                        {page.description}
                      </p>
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
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  const tags = getAllTags();

  return tags
    .filter((tag) => typeof tag === "string" && tag.trim() !== "")
    .map((tag) => ({ tag }));
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
