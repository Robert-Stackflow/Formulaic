import { source } from "@/lib/source";

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = (await page.data.getText("processed")).trim();
  const title = page.data.title;
  const description =
    page.data.description !== undefined ? `${page.data.description}\n` : "";
  const url = page.url;

  return `# ${title}

${description}[原文链接](${url})

---

${processed}`;
}
