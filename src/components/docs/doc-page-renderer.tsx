import { getPageTreePeers } from "fumadocs-core/page-tree";
import { Card, Cards } from "fumadocs-ui/components/card";
import { DocsPage } from "fumadocs-ui/layouts/notebook/page";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import type { LoaderOutput } from "fumadocs-core/source";
import { ExportPDFButton, LLMCopyButton, ViewOptions } from "./page-sections";
import { AISummaryCard } from "@/components/ai-summary-card";
import { aiSummaryConfig } from "@/config/ai-summary";
import { GiscusComments } from "@/components/giscus-comments";
import { DocFeedback } from "@/components/doc-feedback";
import { giscusConfig, githubConfig } from "@/config/giscus";
import { PageInfoCard } from "@/components/page-info-card";
import {
  getMdxFilePath,
  getGithubEditUrl,
  getGithubViewUrl,
  getGithubIssueUrl,
  getMarkdownUrl,
} from "@/lib/page-url-utils";

interface DocPageRendererProps {
  source: LoaderOutput<any>;
  slug?: string[];
}

export function DocPageRenderer({ source, slug }: DocPageRendererProps) {
  const page = source.getPage(slug);
  if (!page) notFound();

  const {
    body: MDXContent,
    full,
    toc,
    lastModified,
    title,
    description,
    tags,
    index,
    ai_summary,
    url: problemUrl,
    difficulty,
  } = page.data;

  // Determine whether to show AI summary
  // Priority: page-level ai_summary > index page check > global default
  const showAISummary =
    ai_summary !== undefined
      ? ai_summary
      : index
        ? false
        : aiSummaryConfig.showByDefault;

  return (
    <DocsPage
      toc={toc}
      full={full}
      // lastUpdate={lastModified ? new Date(lastModified) : undefined}
      tableOfContent={{
        style: "clerk",
        footer: (
          <div className="mt-2">
            <PageInfoCard
              owner={githubConfig.owner}
              repo={githubConfig.repo}
              filePath={getMdxFilePath(page)}
              pageUrl={page.url}
            />
          </div>
        ),
      }}
      tableOfContentPopover={{
        style: "clerk",
        footer: (
          <div className="mb-4">
            <PageInfoCard
              owner={githubConfig.owner}
              repo={githubConfig.repo}
              filePath={getMdxFilePath(page)}
              pageUrl={page.url}
            />
          </div>
        ),
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-[1.75em] font-semibold">{title}</h1>
          <p className="text-lg text-fd-muted-foreground mb-3">{description}</p>

          {/* LeetCode problem metadata */}
          {(difficulty || problemUrl) && (
            <div
              className="flex flex-wrap items-center gap-3 mb-3"
              id="doc-page-metadata"
            >
              {difficulty && (
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    difficulty === "Easy"
                      ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20"
                      : difficulty === "Medium"
                        ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-500 dark:ring-yellow-500/20"
                        : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
                  }`}
                >
                  {difficulty}
                </span>
              )}
              {problemUrl && (
                <a
                  href={problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  LeetCode 原题
                </a>
              )}
            </div>
          )}

          {tags && tags.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2 text-sm text-fd-muted-foreground mb-4"
              id="doc-page-tags"
            >
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground/30"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <div
            className="flex flex-row flex-wrap gap-2 items-center"
            id="doc-page-actions"
          >
            <LLMCopyButton markdownUrl={getMarkdownUrl(page)} />
            <ExportPDFButton />
            <ViewOptions
              markdownUrl={getMarkdownUrl(page)}
              githubUrl={getGithubViewUrl(page, githubConfig)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center border-b mb-3"></div>

      {showAISummary && <AISummaryCard />}

      <div className="prose flex-1 text-fd-foreground/90 mb-4" id="doc-content">
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
        {index ? <DocsCategory source={source} url={page.url} /> : null}
      </div>

      {/* Document Feedback */}
      <DocFeedback
        githubEditUrl={getGithubEditUrl(page, githubConfig)}
        githubIssueUrl={getGithubIssueUrl(page, title, githubConfig)}
      />

      {/* Giscus Comments */}
      {!index && (
        <GiscusComments
          repo={giscusConfig.repo}
          repoId={giscusConfig.repoId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
          mapping={giscusConfig.mapping}
          reactionsEnabled={giscusConfig.reactionsEnabled}
          emitMetadata={giscusConfig.emitMetadata}
          inputPosition={giscusConfig.inputPosition}
          lang={giscusConfig.lang}
          loading={giscusConfig.loading}
        />
      )}
    </DocsPage>
  );
}

function DocsCategory({
  source,
  url,
}: {
  source: LoaderOutput<any>;
  url: string;
}) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => {
        return (
          <Card key={peer.url} title={peer.name} href={peer.url}>
            {peer.description}
          </Card>
        );
      })}
    </Cards>
  );
}

export function getDocPageMetadata(source: LoaderOutput<any>, slug?: string[]) {
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
