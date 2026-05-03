import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import {
  Code2,
  Layers,
  Cpu,
  Brain,
  Server,
  Rocket,
  GraduationCap,
} from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      links={[]}
      tabs={[
        {
          icon: <Code2 className="size-4" />,
          title: "编程语言",
          description: "编程语言核心知识与面试要点",
          url: "/docs/programming-languages",
        },
        {
          icon: <Layers className="size-4" />,
          title: "数据结构与算法",
          description: "算法与数据结构",
          url: "/docs/algorithms",
        },
        {
          icon: <Cpu className="size-4" />,
          title: "计算机系统基础",
          description: "计算机系统基础知识",
          url: "/docs/computer-system-basics",
        },
        {
          icon: <Brain className="size-4" />,
          title: "大语言模型",
          description: "LLM 相关技术与应用",
          url: "/docs/large-language-models",
        },
        {
          icon: <Server className="size-4" />,
          title: "后端开发",
          description: "后端开发技术栈",
          url: "/docs/backend-development",
        },
        {
          icon: <Rocket className="size-4" />,
          title: "DevOps",
          description: "DevOps 工具与实践",
          url: "/docs/devops",
        },
        {
          icon: <GraduationCap className="size-4" />,
          title: "面试",
          description: "面试技巧与准备指南",
          url: "/docs/interview",
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
