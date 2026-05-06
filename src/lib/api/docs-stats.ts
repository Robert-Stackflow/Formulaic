/**
 * 文档统计 API 客户端
 */

export interface PageWordCount {
  slug: string;
  title: string;
  wordCount: number;
  readingTime: number;
  readingTimeText: string;
}

export interface SiteStats {
  totalWords: number;
  totalReadingTime: number;
  pageCount: number;
  formattedWords: string;
  formattedReadingTime: string;
}

export interface WordCountResponse {
  site: SiteStats;
  page?: PageWordCount | null;
  error?: string;
}

/**
 * 获取文档字数统计
 * @param slug 可选，传入则返回该页面统计 + 全站统计，不传入则只返回全站统计
 */
export async function fetchWordCount(
  slug?: string,
): Promise<WordCountResponse | null> {
  try {
    const url = slug
      ? `/api/docs/word-count?slug=${encodeURIComponent(slug)}`
      : "/api/docs/word-count";

    const response = await fetch(url);

    if (!response.ok) {
      // console.error(`Failed to fetch word count: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    // console.error("Error fetching word count:", error);
    return null;
  }
}

export async function fetchDocsStats(): Promise<SiteStats | null> {
  const result = await fetchWordCount();
  return result?.site || null;
}

export type WordCountResult = PageWordCount;
export type DocsStatsResult = SiteStats;
