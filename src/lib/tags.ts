import { blogSource, source } from "@/lib/source";
import { getReadingTimeFromPage } from "@/lib/reading-time";

export type TaggedPage = {
  title: string;
  description?: string;
  url: string;
  tags: string[];
  readingTime?: string | number;
  type: "docs" | "blog";
};

export function getTaggedPages(): TaggedPage[] {
  const docs = source.getPages().flatMap((page) => {
    const tags = page.data.tags ?? [];
    if (tags.length === 0) return [];
    return [
      {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        tags,
        readingTime: getReadingTimeFromPage(page),
        type: "docs" as const,
      },
    ];
  });

  const blogs = blogSource.getPages().flatMap((page) => {
    const tags = page.data.tags ?? [];
    if (tags.length === 0) return [];
    return [
      {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        tags,
        readingTime: getReadingTimeFromPage(page),
        type: "blog" as const,
      },
    ];
  });

  return [...docs, ...blogs];
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getTaggedPages().forEach((page) => {
    page.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "zh-CN"));
}
