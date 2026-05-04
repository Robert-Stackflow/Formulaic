import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { pageSchema, metaSchema } from "fumadocs-core/source/schema";
import { z } from "zod";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const docSchema = pageSchema.extend({
  category: z.string().optional(), // 自定义分类
  icon: z.string().optional(), // Lucide 图标名称
  tags: z.array(z.string()).optional(),
  readingTime: z.string().optional(),
  index: z.boolean().default(false), // 是否在该目录下作为 index 展示
  ai_summary: z.boolean().optional(), // 是否显示 AI 摘要
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  url: z.string().optional(), // 可选的 URL 字段，允许自定义链接地址
  description: z.string().optional(),
  lastUpdated: z.string().optional(),
  authors: z.array(z.string()).optional(),
});

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: docSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: metaSchema },
});

export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: pageSchema.extend({
      description: z.string(),
      published_at: z.string(),
      author: z.string().optional(),
      feature_image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      readingTime: z.string().optional(),
      category: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    mdxExtensions: ["mdx", "md"],
    remarkImageOptions: {
      onError: "ignore",
    },
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultLanguage: "plaintext",
      defaultColor: false,
      transformers: [
        {
          name: "fumadocs:code-title",
          code(node) {
            const lang = this.options.lang || "plaintext";
            if (node.properties["data-language"]) {
              return;
            }
            node.properties["data-language"] = lang;
          },
        },
      ],
    },
  },
});
