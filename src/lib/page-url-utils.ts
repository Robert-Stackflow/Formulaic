/**
 * Utility functions for handling page URLs and file paths
 * Handles the special case where index pages have URLs without /index
 */

interface PageData {
  url: string;
  path: string;
  absolutePath: string;
  data: {
    index?: boolean;
    info: {
      path: string;
      fullPath: string;
    };
  };
}

/**
 * Get the MDX file path relative to the content directory
 * @param page - The page object from fumadocs
 * @returns The relative path to the MDX file (e.g., "docs/algorithms/index.mdx")
 */
export function getMdxFilePath(page: PageData): string {
  return page.data.info.fullPath;
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
  },
): string {
  const filePath = getMdxFilePath(page);
  return `https://github.com/${config.owner}/${config.repo}/edit/${config.branch}/${filePath}`;
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
  },
): string {
  const filePath = getMdxFilePath(page);
  return `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${filePath}`;
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
  },
): string {
  return `https://github.com/${config.owner}/${config.repo}/issues/new?title=${encodeURIComponent(`[文档反馈] ${title}`)}&body=${encodeURIComponent(`页面链接: ${page.url}\n\n问题描述:\n`)}`;
}

/**
 * Get the markdown URL for fetching raw content
 * This is used by LLMCopyButton and ViewOptions to fetch the MDX content
 * Converts page URL to the corresponding MDX file path
 * @param page - The page object from fumadocs
 * @returns The relative URL to fetch the markdown content (e.g., "/docs/algorithms/index.mdx" or "/docs/algorithms/1-python.mdx")
 */
export function getMarkdownUrl(page: PageData): string {
  // // If it's an index page, append /index.mdx to the URL
  // // Otherwise, append .mdx to the URL
  // if (page.data.index) {
  //   return `${page.url}/index.mdx`;
  // }
  return `${page.url}.mdx`;
}
