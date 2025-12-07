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
        Formulaic
      </>
    ),
  },
  links: [
    {
      type: "custom",
      on: "nav",
      children: (
        <NavbarMenu>
          <NavbarMenuTrigger>核心板块</NavbarMenuTrigger>
          <NavbarMenuContent className="grid grid-cols-2 gap-3 p-6">
            <NavbarMenuLink href="/programming-languages" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-blue-500/10">
                  <Code2 className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    编程语言
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    编程语言基础与进阶
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/algorithms" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-purple-500/10">
                  <Brain className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    算法
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    数据结构与算法
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/computer-system-basics" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-orange-500/10">
                  <Cpu className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    计算机系统基础
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    计算机系统基础知识
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/large-language-models" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-green-500/10">
                  <Rocket className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    大语言模型
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    LLM相关技术
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
          </NavbarMenuContent>
        </NavbarMenu>
      ),
    },
    {
      type: "custom",
      on: "nav",
      children: (
        <NavbarMenu>
          <NavbarMenuTrigger>更多板块</NavbarMenuTrigger>
          <NavbarMenuContent className="grid grid-cols-2 gap-3 p-6">
            <NavbarMenuLink href="/backend-development" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-indigo-500/10">
                  <Server className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    后端开发
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    后端技术栈
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/devops" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-teal-500/10">
                  <Rocket className="w-5 h-5 text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    DevOps
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    运维开发实践
                  </div>
                </div>
              </div>
            </NavbarMenuLink>
            <NavbarMenuLink href="/interview-preparation" className="group">
              <div className="flex items-start gap-3 p-3 rounded-lg transition-colors">
                <div className="flex-shrink-0 p-2 rounded-md bg-red-500/10">
                  <GraduationCap className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fd-foreground mb-1">
                    面试准备
                  </div>
                  <div className="text-xs text-fd-muted-foreground line-clamp-2">
                    面试技巧与经验
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
