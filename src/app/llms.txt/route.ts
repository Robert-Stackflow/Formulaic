import { source } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const pages = source.getPages();

  // Generate llms.txt content
  const lines: string[] = [
    "# Formulaic - 技术学习与知识分享平台",
    "",
    "这是一个系统化的技术知识库，涵盖算法、后端开发、计算机系统、DevOps、大语言模型、编程语言和面试准备等核心领域。",
    "",
    "## 文档列表",
    "",
  ];

  // Group pages by category
  const categories: Record<string, typeof pages> = {};

  for (const page of pages) {
    const url = page.url;
    const category = url.split("/")[2] || "other"; // Get category from URL
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(page);
  }

  // Category names mapping
  const categoryNames: Record<string, string> = {
    "programming-languages": "编程语言",
    algorithms: "数据结构与算法",
    "computer-system-basics": "计算机系统基础",
    "large-language-models": "大语言模型",
    "backend-development": "后端开发",
    devops: "DevOps",
    interview: "面试准备",
  };

  // Output pages by category
  for (const [category, categoryPages] of Object.entries(categories).sort()) {
    const categoryName = categoryNames[category] || category;
    lines.push(`### ${categoryName}`);
    lines.push("");

    for (const page of categoryPages) {
      const title = page.data.title || "Untitled";
      const description = page.data.description || "";
      const url = `https://formulaic.vercel.app${page.url}`;

      lines.push(`- [${title}](${url})`);
      if (description) {
        lines.push(`  ${description}`);
      }
    }
    lines.push("");
  }

  lines.push("## 获取 Markdown 内容");
  lines.push("");
  lines.push(
    "要获取任何页面的 Markdown 内容，只需在 URL 后添加 `.mdx` 扩展名。"
  );
  lines.push("");
  lines.push("例如：");
  lines.push("- HTML: https://formulaic.vercel.app/docs/algorithms");
  lines.push("- Markdown: https://formulaic.vercel.app/docs/algorithms.mdx");

  const content = lines.join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
