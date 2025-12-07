import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const docSchema = frontmatterSchema.extend({
  category: z.string().optional(), // 自定义分类
  icon: z.string().optional(), // Lucide 图标名称
  tags: z.array(z.string()).optional(),
  index: z.boolean().default(false), // 是否在该目录下作为 index 展示
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  description: z.string().optional(),
  lastUpdated: z.string().optional(),
  authors: z.array(z.string()).optional(),
});

export const computerSystemBasics = defineDocs({
  dir: "content/computer-system-basics",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const programmingLanguages = defineDocs({
  dir: "content/programming-languages",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const algorithms = defineDocs({
  dir: "content/algorithms",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const backendDevelopment = defineDocs({
  dir: "content/backend-development",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const devops = defineDocs({
  dir: "content/devops",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const llm = defineDocs({
  dir: "content/large-language-models",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const interviewPrep = defineDocs({
  dir: "content/interview-preparation",
  docs: { schema: docSchema },
  meta: { schema: metaSchema },
});

export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: frontmatterSchema.extend({
      description: z.string(),
      published_at: z.string(),
      feature_image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    // Place it at first, it should be executed before the syntax highlighter
    rehypePlugins: (v) => [rehypeKatex, ...v],
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    mdxExtensions: ["mdx", "md"],
    remarkImageOptions: {
      onError: "ignore",
    },
  },
});
