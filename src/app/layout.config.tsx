import Image from "next/image";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
  NavbarMenu,
  NavbarMenuTrigger,
  NavbarMenuContent,
  NavbarMenuLink,
} from "fumadocs-ui/layouts/home/navbar";
import {
  Code2,
  Cpu,
  Server,
  Brain,
  Rocket,
  BookOpen,
  GraduationCap,
  Layers,
} from "lucide-react";

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
        {/* <Image
          src="/logo-transparent.png"
          alt="Formulaic"
          width={24}
          height={24}
          className="rounded"
          priority
        /> */}
        <span className="font-semibold">Formulaic</span>
      </>
    ),
  },
  links: [
    {
      type: "custom",
      on: "nav",
      children: (
        <NavbarMenu>
          <NavbarMenuTrigger>文档</NavbarMenuTrigger>
          <NavbarMenuContent className="grid grid-cols-2 gap-3 p-6 min-w-[500px]">
            <NavbarMenuLink href="/programming-languages" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <Code2 className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    编程语言
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    多种编程语言特性与最佳实践
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/algorithms" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <Layers className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    数据结构与算法
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    算法设计与分析，提升编程思维
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/computer-system-basics" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <Cpu className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    计算机系统基础
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    操作系统、网络、组成原理
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/large-language-models" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <Brain className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    大语言模型
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    LLM 应用开发与提示工程
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/backend-development" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <Server className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    后端开发
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    服务端架构与 API 设计
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/devops" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <Rocket className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    DevOps
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    CI/CD、容器化、云原生
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/interview-preparation" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-fd-accent/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-fd-accent">
                  <GraduationCap className="w-5 h-5 text-fd-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    面试准备
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    技术面试题目与解题思路
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
          </NavbarMenuContent>
        </NavbarMenu>
      ),
    },
    {
      text: "博客",
      url: "/blog",
    },
  ],
  githubUrl: "https://github.com/Robert-Stackflow/Formulaic",
};
