import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen, Layers } from "lucide-react";
import { DocsDropdown } from "@/components/docs-dropdown";
import { Logo } from "@/components/logo";

const docsMenuItems = [
  {
    href: "/docs/programming-languages",
    title: "编程语言",
    description: "多种编程语言特性与最佳实践",
    icon: "Code2",
  },
  {
    href: "/docs/algorithms",
    title: "数据结构与算法",
    description: "算法设计与分析，提升编程思维",
    icon: "Layers",
  },
  {
    href: "/docs/computer-system-basics",
    title: "计算机系统基础",
    description: "操作系统、网络、组成原理",
    icon: "Cpu",
  },
  {
    href: "/docs/large-language-models",
    title: "大语言模型",
    description: "LLM 应用开发与提示工程",
    icon: "Brain",
  },
  {
    href: "/docs/backend-development",
    title: "后端开发",
    description: "服务端架构与 API 设计",
    icon: "Server",
  },
  {
    href: "/docs/devops",
    title: "DevOps",
    description: "CI/CD、容器化、云原生",
    icon: "Rocket",
  },
  {
    href: "/docs/interview",
    title: "面试",
    description: "技术面试题目与解题思路",
    icon: "GraduationCap",
  },
];

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    transparentMode: "top",
    title: (
      <>
        <Logo className="size-6 text-gray-900 dark:text-gray-100" />
        <span className="font-semibold">Formulaic</span>
      </>
    ),
  },
  links: [
    {
      type: "custom",
      on: "nav",
      children: <DocsDropdown items={docsMenuItems} />,
    },
    {
      type: "custom",
      on: "nav",
      children: (
        <a
          className="px-2.5 py-1.5 text-sm transition-all duration-200 rounded-md cursor-pointer text-fd-muted-foreground hover:text-fd-accent-foreground hover:bg-fd-accent/50"
          href="/blog"
          id="nav-blog-link"
        >
          博客
        </a>
      ),
    },
    {
      type: "custom",
      on: "nav",
      children: (
        <a
          className="px-2.5 py-1.5 text-sm transition-all duration-200 rounded-md cursor-pointer text-fd-muted-foreground hover:text-fd-accent-foreground hover:bg-fd-accent/50"
          href="/tags"
          id="nav-tags-link"
        >
          标签
        </a>
      ),
    },
  ],
  githubUrl: "https://github.com/Robert-Stackflow/Formulaic",
};
