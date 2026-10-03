import { createHash } from "node:crypto";
import type { StructuredData } from "fumadocs-core/mdx-plugins/remark-structure";

export interface SearchDocument {
  id: string;
  page_id: string;
  title: string;
  url: string;
  section: string;
  content: string;
  tags: string[];
  type: "docs" | "blog";
}

export function indexPage(page: {
  url: string; title: string; description?: string; tags?: string[];
  type: SearchDocument["type"]; structured: StructuredData;
}): SearchDocument[] {
  if (!/^\/(docs|blog)(\/|$)/.test(page.url) || page.url.startsWith("//")) throw new Error("Search pages must use local documentation or blog URLs");
  // One record per section, using the same anchors rendered by Fumadocs.
  const sections = new Map<string, { title: string; contents: string[] }>();
  sections.set("", { title: "", contents: page.description ? [page.description] : [] });
  for (const heading of page.structured.headings) sections.set(heading.id, { title: heading.content, contents: [] });
  for (const block of page.structured.contents) {
    const section = sections.get(block.heading || "") || sections.get("")!;
    if (block.content.trim()) section.contents.push(block.content.trim());
  }
  return [...sections].map(([anchor, section]) => {
    const url = page.url + (anchor ? `#${encodeURIComponent(anchor)}` : "");
    return { id: createHash("sha256").update(url).digest("hex"), page_id: page.url,
      title: page.title, url, section: section.title, content: section.contents.join("\n"),
      tags: page.tags || [], type: page.type };
  });
}
