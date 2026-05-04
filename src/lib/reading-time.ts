const WORDS_PER_MINUTE = 300;

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingTime(text?: string) {
  if (!text) return undefined;
  const plain = stripMarkdown(text);
  if (!plain) return undefined;
  const cjkCount = (plain.match(/[\u4e00-\u9fff]/g) || []).length;
  const wordCount = (plain.match(/[A-Za-z0-9]+/g) || []).length;
  const total = cjkCount + wordCount;
  const minutes = Math.max(1, Math.ceil(total / WORDS_PER_MINUTE));
  return `${minutes} 分钟`;
}

export function getReadingTimeFromPage(page: any) {
  return (
    page?.data?.readingTime ||
    estimateReadingTime(
      page?.data?.content ||
        page?.data?.rawContent ||
        page?.data?._raw ||
        page?.data?.mdx ||
        page?.data?.body?.toString?.(),
    )
  );
}
