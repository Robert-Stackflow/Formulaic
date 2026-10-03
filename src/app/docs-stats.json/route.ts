import { source } from "@/lib/source";
import { countWords, calculateReadingTime } from "@/lib/word-count";
import type { PageWordCount } from "@/lib/api/docs-stats";

export const dynamic = "force-static";
export const revalidate = false;
function words(value: number) { return value >= 10000 ? `${(value / 10000).toFixed(1)}w` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value); }
function minutes(value: number) { return value >= 60 ? `${Math.floor(value / 60)}h${value % 60 ? `${value % 60}min` : ""}` : `${value}min`; }
export async function GET() {
  const pages: Record<string, PageWordCount> = {};
  let totalWords = 0, totalReadingTime = 0;
  for (const page of source.getPages()) {
    const { structuredData } = await page.data.load();
    const text = [...structuredData.headings, ...structuredData.contents].map(entry => entry.content).join("\n");
    const wordCount = countWords(text), readingTime = calculateReadingTime(text);
    pages[page.url] = { slug: page.url, title: page.data.title, wordCount, readingTime, readingTimeText: minutes(readingTime) };
    totalWords += wordCount; totalReadingTime += readingTime;
  }
  return Response.json({ site: { totalWords, totalReadingTime, pageCount: Object.keys(pages).length,
    formattedWords: words(totalWords), formattedReadingTime: minutes(totalReadingTime) }, pages });
}
