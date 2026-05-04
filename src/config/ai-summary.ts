/**
 * AI Summary configuration
 */
export const aiSummaryConfig = {
  /**
   * Whether to show AI summary by default
   * Can be overridden by page-level `ai_summary` frontmatter
   */
  showByDefault: true,

  /**
   * API endpoint for generating summaries
   */
  apiEndpoint: "https://api.cloudchewie.com/blog/summary",

  /**
   * Cache duration in milliseconds (default: 7 days)
   */
  cacheDuration: 7 * 24 * 60 * 60 * 1000,
};
