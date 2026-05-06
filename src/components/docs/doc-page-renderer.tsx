import { findSiblings } from "fumadocs-core/page-tree";
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
      breadcrumb={{
        enabled: false,
      }}
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
        // footer: (
        //   <div className="mb-4">
        //     <PageInfoCard
        //       owner={githubConfig.owner}
        //       repo={githubConfig.repo}
        //       filePath={getMdxFilePath(page)}
        //       pageUrl={page.url}
        //     />
        //   </div>
        // ),
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

      <div
        className={`${index ? "" : "prose"} flex-1 text-fd-foreground/90 mb-4`}
        id="doc-content"
      >
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

function CustomCard({
  name,
  description,
  tags,
  url,
  difficulty,
  problemUrl,
  isFolder,
}: {
  name: string;
  description?: string;
  tags?: string[];
  url: string;
  difficulty?: string;
  problemUrl?: string;
  isFolder?: boolean;
}) {
  const isLeetCode = difficulty || problemUrl;

  return (
    <Link
      href={url}
      className="group block rounded-lg border border-fd-border bg-fd-card p-5 hover:border-fd-primary/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors line-clamp-2">
            {name}
          </h3>
          {isFolder && (
            <span className="inline-flex items-center rounded-md bg-fd-accent px-2 py-0.5 text-xs font-medium text-fd-muted-foreground flex-shrink-0">
              集合
            </span>
          )}
        </div>
        <svg
          className="w-4 h-4 text-fd-muted-foreground group-hover:text-fd-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {isLeetCode ? (
        <div className="flex flex-wrap items-center gap-2">
          {difficulty && (
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
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
            <span className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground">
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
            </span>
          )}
        </div>
      ) : (
        description && (
          <p className="text-sm text-fd-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-fd-border/50">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center text-xs text-fd-muted-foreground">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function DocsCategory({
  source,
  url,
}: {
  source: LoaderOutput<any>;
  url: string;
}) {
  const siblings = findSiblings(source.pageTree, url);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="docs-category">
      {siblings
        .filter((sibling) => sibling.type !== "separator")
        .map((sibling) => {
          // For folders, use index page; for pages, use the page itself
          const isFolder = sibling.type === "folder";
          const itemUrl = isFolder ? sibling.index?.url : sibling.url;
          const itemName = sibling.name;
          const itemDescription = sibling.description;

          if (!itemUrl) return null;

          // Get page data for tags and LeetCode metadata
          const peerPage = source.getPage(
            itemUrl.split("/").filter(Boolean).slice(1),
          );
          const peerData = peerPage?.data;

          return (
            <CustomCard
              key={itemUrl}
              name={String(itemName)}
              description={
                itemDescription ? String(itemDescription) : undefined
              }
              tags={peerData?.tags}
              url={itemUrl}
              difficulty={peerData?.difficulty}
              problemUrl={peerData?.url}
              isFolder={isFolder}
            />
          );
        })}
    </div>
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
