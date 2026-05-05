/**
 * Utility functions for handling page URLs and file paths
 * Handles the special case where index pages have URLs without /index
 */

interface PageData {
  url: string;
  index?: boolean;
}

/**
 * Get the MDX file path relative to the content directory
 * @param page - The page object from fumadocs
 * @returns The relative path to the MDX file (e.g., "docs/algorithms/index.mdx")
 */
export function getMdxFilePath(page: PageData): string {
  if (page.index) {
    return `${page.url}/index.mdx`;
  }
  return `${page.url}.mdx`;
}

/**
 * Get the full GitHub URL for editing the page
 * @param page - The page object from fumadocs
 * @param config - GitHub configuration
 * @returns The full GitHub edit URL
 */
export function getGithubEditUrl(
  page: PageData,
  config: {
    owner: string;
    repo: string;
    branch: string;
    contentDir: string;
  }
): string {
  const filePath = getMdxFilePath(page);
  return `https://github.com/${config.owner}/${config.repo}/edit/${config.branch}/${config.contentDir}${filePath}`;
}

/**
 * Get the full GitHub URL for viewing the page
 * @param page - The page object from fumadocs
 * @param config - GitHub configuration
 * @returns The full GitHub blob URL
 */
export function getGithubViewUrl(
  page: PageData,
  config: {
    owner: string;
    repo: string;
    branch: string;
    contentDir: string;
  }
): string {
  const filePath = getMdxFilePath(page);
  return `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${config.contentDir}${filePath}`;
}

/**
 * Get the full GitHub URL for creating an issue about the page
 * @param page - The page object from fumadocs
 * @param title - The page title
 * @param config - GitHub configuration
 * @returns The full GitHub issue creation URL
 */
export function getGithubIssueUrl(
  page: PageData,
  title: string,
  config: {
    owner: string;
    repo: string;
  }
): string {
  return `https://github.com/${config.owner}/${config.repo}/issues/new?title=${encodeURIComponent(`[文档反馈] ${title}`)}&body=${encodeURIComponent(`页面链接: ${page.url}\n\n问题描述:\n`)}`;
}

/**
 * Get the markdown URL for fetching raw content
 * This is used by LLMCopyButton and ViewOptions to fetch the MDX content
 * @param page - The page object from fumadocs
 * @returns The relative URL to fetch the markdown content
 */
export function getMarkdownUrl(page: PageData): string {
  return getMdxFilePath(page);
}
