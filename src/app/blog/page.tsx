import type { Metadata } from "next";
import Link from "next/link";
import { CalendarIcon, UserIcon } from "lucide-react";
import { blogSource } from "@/lib/source";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "../layout.config";
import { BlogTag } from "@/components/blog-tag";

export const dynamic = "force-static";
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Blog",
  description: "Formulaic 的最新动态",
  keywords: ["博客", "开发日志", "更新动态"],
};

export default function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.published_at).getTime();
    const dateB = new Date(b.data.published_at).getTime();
    return dateB - dateA; // Sort by newest first
  });

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-12 sm:py-16 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-fd-foreground mb-2">
                博客
              </h1>
              <p className="text-fd-muted-foreground">Formulaic 的最新动态</p>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.url}
                  className="group p-6 bg-fd-card border border-fd-border rounded-lg transition-all duration-300 hover:border-fd-primary/50 hover:shadow-lg hover:shadow-fd-primary/5 hover:-translate-y-1"
                >
                  <Link href={post.url} className="block">
                    <div>
                      <h2 className="text-xl font-semibold text-fd-foreground mb-2 group-hover:text-fd-primary transition-colors">
                        {post.data.title}
                      </h2>

                      <p className="text-fd-muted-foreground mb-4 line-clamp-2">
                        {post.data.description}
                      </p>

                      <div className="flex items-center gap-3 text-sm text-fd-muted-foreground">
                        {post.data.author && (
                          <>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <UserIcon className="w-4 h-4" />
                              <span>{post.data.author}</span>
                            </div>
                            <span>•</span>
                          </>
                        )}

                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(
                              post.data.published_at,
                            ).toLocaleDateString("zh-CN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </span>
                        </div>

                        {post.data.tags && post.data.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex flex-wrap gap-2">
                              {post.data.tags.map((tag) => (
                                <BlogTag key={tag} tag={tag} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 mx-auto mb-4 text-fd-muted-foreground" />
                <h3 className="text-lg font-medium text-fd-foreground mb-2">
                  暂无博客文章
                </h3>
                <p className="text-fd-muted-foreground">
                  正在编写新文章，敬请期待...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
