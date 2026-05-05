import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  DownloadIcon,
  GitBranchIcon,
  UserIcon,
} from "lucide-react";
import { blogSource } from "@/lib/source";
import { DocsBody } from "fumadocs-ui/page";
import { TOCProvider, TOCScrollArea } from "fumadocs-ui/components/toc";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { getMDXComponents } from "@/mdx-components";
import { baseOptions } from "@/app/layout.config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { PageViews } from "@/components/page-views";
import { TOCItems } from "@/components/toc-items";
import { Footer } from "@/components/footer";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    notFound();
  }

  const { data } = page;
  const MDXContent = page.data.body;

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="pt-8 sm:pt-12 pb-4 px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-6 group"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>返回博客列表</span>
            </Link>

            {data.feature_image && (
              <div className="mb-6">
                <img
                  src={data.feature_image}
                  alt={data.title}
                  className="w-full h-64 object-cover rounded-lg border border-fd-border"
                />
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-fd-foreground mb-4">
                {data.title}
              </h1>

              {data.description && (
                <p className="text-lg text-fd-muted-foreground mb-4">
                  {data.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-fd-muted-foreground">
                {data.author && (
                  <>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{data.author}</span>
                    </div>
                    <span>•</span>
                  </>
                )}

                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {new Date(data.published_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>

                {data.tags && data.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="px-2 py-0.5 border border-fd-border text-fd-muted-foreground rounded-full text-xs hover:text-fd-foreground hover:border-fd-foreground/30"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <PageViews />
            </div>

            <div className="flex gap-8">
              <div className="flex-1 min-w-0">
                <article className="p-6 bg-fd-card border border-fd-border rounded-lg">
                  <DocsBody>
                    <MDXContent components={getMDXComponents()} />
                  </DocsBody>
                </article>
              </div>

              {page.data.toc && page.data.toc.length > 0 && (
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-24">
                    <div className="p-4 bg-fd-card border border-fd-border rounded-lg">
                      <h3 className="text-sm font-semibold text-fd-foreground mb-3">
                        目录
                      </h3>
                      <TOCProvider toc={page.data.toc}>
                        <TOCScrollArea>
                          <TOCItems />
                        </TOCScrollArea>
                      </TOCProvider>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const { data } = page;

  return {
    title: `${data.title}`,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.published_at,
      images: data.feature_image ? [data.feature_image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: data.feature_image ? [data.feature_image] : undefined,
    },
  };
}
