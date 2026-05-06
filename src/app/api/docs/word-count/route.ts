import { NextRequest, NextResponse } from "next/server";
import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";
import { countWords, calculateReadingTime } from "@/lib/word-count";

export const revalidate = 3600; // 缓存1小时

/**
 * 格式化数字（如 70000 -> 7.0万）
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

/**
 * 格式化阅读时间
 */
function formatReadingTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  }
  return `${minutes}min`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  try {
    // 计算全站统计
    const pages = source.getPages();
    let totalWords = 0;
    let totalReadingTime = 0;
    const pageCount = pages.length;

    for (const page of pages) {
      try {
        const content = await getLLMText(page);
        const wordCount = countWords(content);
        const readingTime = calculateReadingTime(content);

        totalWords += wordCount;
        totalReadingTime += readingTime;
      } catch (error) {
        console.error(`Error processing page ${page.url}:`, error);
      }
    }

    const siteStats = {
      totalWords,
      totalReadingTime,
      pageCount,
      formattedWords: formatNumber(totalWords),
      formattedReadingTime: formatReadingTime(totalReadingTime),
    };

    // 如果没有传入 slug，只返回全站统计
    if (!slug) {
      return NextResponse.json({
        site: siteStats,
      });
    }

    // 如果传入了 slug，额外返回当前页面统计
    const slugArray = slug.split("/").filter((s) => s && s !== "docs");
    const page = source.getPage(slugArray);

    if (!page) {
      // 页面不存在，但仍返回全站统计
      return NextResponse.json({
        site: siteStats,
        page: null,
        error: "Page not found",
      });
    }

    const content = await getLLMText(page);
    const wordCount = countWords(content);
    const readingTime = calculateReadingTime(content);

    return NextResponse.json({
      site: siteStats,
      page: {
        slug: page.url,
        title: page.data.title,
        wordCount,
        readingTime,
        readingTimeText: formatReadingTime(readingTime),
      },
    });
  } catch (error) {
    console.error("Error calculating word count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
