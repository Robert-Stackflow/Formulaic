import Link from "next/link";
import {
  CodeIcon,
  ServerIcon,
  BrainIcon,
  NetworkIcon,
  MessageSquareCodeIcon,
  GraduationCapIcon,
  LayersIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { ScrollDownIndicator } from "@/components/scroll-down-indicator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formulaic - 技术学习与知识分享平台",
  description:
    "Formulaic 提供全面的技术文档，涵盖算法、后端开发、计算机系统、DevOps、大语言模型、编程语言和面试准备等领域。",
  keywords: [
    "技术文档",
    "数据结构与算法",
    "后端开发",
    "计算机系统",
    "DevOps",
    "大语言模型",
    "编程语言",
    "面试准备",
    "学习笔记",
  ],
};

const docSections = [
  {
    title: "编程语言",
    description: "多种编程语言特性、最佳实践与生态系统",
    icon: <MessageSquareCodeIcon className="w-6 h-6" />,
    href: "/programming-languages",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
  {
    title: "数据结构与算法",
    description: "数据结构、算法设计与分析，提升编程思维",
    icon: <LayersIcon className="w-6 h-6" />,
    href: "/algorithms",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
  {
    title: "计算机系统基础",
    description: "操作系统、计算机网络、组成原理等基础知识",
    icon: <NetworkIcon className="w-6 h-6" />,
    href: "/computer-system-basics",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
  {
    title: "大语言模型",
    description: "LLM应用开发、提示工程、AI工具使用",
    icon: <BrainIcon className="w-6 h-6" />,
    href: "/large-language-models",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
  {
    title: "后端开发",
    description: "服务端架构、API设计、数据库优化等核心技术",
    icon: <ServerIcon className="w-6 h-6" />,
    href: "/backend-development",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
  {
    title: "DevOps",
    description: "CI/CD、容器化、云原生、自动化运维",
    icon: <CodeIcon className="w-6 h-6" />,
    href: "/devops",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
  {
    title: "面试准备",
    description: "技术面试题目、解题思路、面试经验分享",
    icon: <GraduationCapIcon className="w-6 h-6" />,
    href: "/interview-preparation",
    iconColor: "text-fd-primary",
    bgColor: "bg-fd-accent",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section - Full viewport height */}
      <section className="relative flex h-[calc(100vh-4rem)] items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-fd-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-fd-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-fd-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl w-full items-center gap-8 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1.5 text-xs text-fd-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-fd-primary animate-pulse" />
              系统化学习路径
            </div>
            <h1 className="mt-4 sm:mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-fd-foreground">
              Formulaic
              <span className="block text-fd-primary mt-2 sm:mt-3 bg-gradient-to-r from-fd-primary to-fd-primary/60 bg-clip-text text-transparent">
                技术学习与知识分享
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl xl:text-2xl text-fd-muted-foreground leading-relaxed">
              覆盖 LLM、AI
              Infra、数据结构与算法、计算机系统基础等知识，让学习更清晰、更高效
            </p>
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
              <Link
                href="/large-language-models"
                className="inline-flex items-center justify-center rounded-full bg-fd-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-fd-primary-foreground shadow-lg shadow-fd-primary/25 transition hover:brightness-90 hover:shadow-xl hover:shadow-fd-primary/30 hover:scale-105"
              >
                开始学习
                <ArrowRightIcon className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border-2 border-fd-border bg-fd-card px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-fd-foreground transition hover:border-fd-primary hover:text-fd-primary hover:scale-105"
              >
                最新博客
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: "总访问量", value: "100K+" },
                { label: "文档字数", value: "50w+" },
                { label: "持续更新", value: "∞" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-fd-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-fd-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-fd-border bg-fd-card p-6 sm:p-8 shadow-xl backdrop-blur-sm">
            <div className="text-sm sm:text-base font-semibold text-fd-foreground">
              学习路径
            </div>
            <p className="mt-2 text-xs sm:text-sm text-fd-muted-foreground">
              3 步构建你的技术体系，从基础到实践再到前沿，全面提升技能水平
            </p>
            <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4">
              {[
                {
                  title: "打好基础",
                  desc: "算法与系统知识夯实核心能力",
                  step: "01",
                },
                {
                  title: "工程实践",
                  desc: "后端与 DevOps 形成完整闭环",
                  step: "02",
                },
                {
                  title: "前沿提升",
                  desc: "LLM 与 AI 工具扩展边界",
                  step: "03",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-fd-border bg-fd-background/50 px-4 sm:px-5 py-3 sm:py-4 text-sm"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl font-bold text-fd-primary/30">
                      {item.step}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-fd-foreground text-sm sm:text-base">
                        {item.title}
                      </div>
                      <p className="mt-1 sm:mt-1.5 text-xs text-fd-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll down indicator - clickable */}
        <ScrollDownIndicator />
      </section>

      {/* Documentation Sections */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-fd-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-fd-foreground mb-4">
              探索技术领域
            </h2>
            <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
              选择你感兴趣的方向，开始学习之旅
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-2xl border border-fd-border bg-fd-card p-6 transition-all duration-200 hover:border-fd-primary/60"
              >
                <div
                  className={`inline-flex p-3 rounded-xl ${section.bgColor} mb-4 ${section.iconColor}`}
                >
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-fd-foreground mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-fd-muted-foreground mb-4 min-h-[2.5rem] line-clamp-2">
                  {section.description}
                </p>
                <div className="flex items-center text-sm font-medium text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
                  查看文档
                  <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
