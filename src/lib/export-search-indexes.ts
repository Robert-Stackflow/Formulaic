import { source, blogSource } from "@/lib/source";
import { indexPage, type SearchDocument } from "@/lib/onesearch-index";

export async function exportSearchIndexes() {
  const documents: SearchDocument[] = [];
  for (const [collection, type] of [[source, "docs"], [blogSource, "blog"]] as const) {
    for (const page of collection.getPages()) {
      const { structuredData } = await page.data.load();
      documents.push(...indexPage({ url: page.url, title: page.data.title,
        description: page.data.description, tags: page.data.tags, type, structured: structuredData }));
    }
  }
  return { version: 1, count: documents.length, documents };
}
