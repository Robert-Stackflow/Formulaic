import Link from "next/link";
import {
  BookOpenIcon,
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
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
  },
  {
    title: "数据结构与算法",
    description: "数据结构、算法设计与分析，提升编程思维",
    icon: <LayersIcon className="w-6 h-6" />,
    href: "/algorithms",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "计算机系统基础",
    description: "操作系统、计算机网络、组成原理等基础知识",
    icon: <NetworkIcon className="w-6 h-6" />,
    href: "/computer-system-basics",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "大语言模型",
    description: "LLM应用开发、提示工程、AI工具使用",
    icon: <BrainIcon className="w-6 h-6" />,
    href: "/large-language-models",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    title: "后端开发",
    description: "服务端架构、API设计、数据库优化等核心技术",
    icon: <ServerIcon className="w-6 h-6" />,
    href: "/backend-development",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "DevOps",
    description: "CI/CD、容器化、云原生、自动化运维",
    icon: <CodeIcon className="w-6 h-6" />,
    href: "/devops",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "面试准备",
    description: "技术面试题目、解题思路、面试经验分享",
    icon: <GraduationCapIcon className="w-6 h-6" />,
    href: "/interview-preparation",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Formulaic
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-primary/70 mt-2">
              技术学习与知识分享
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            系统化的技术文档，涵盖算法、后端、系统、DevOps、AI 等多个领域
          </p>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              探索技术领域
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              选择你感兴趣的方向，开始学习之旅
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {docSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${section.color}`}
                />
                <div
                  className={`inline-flex p-3 rounded-xl ${section.bgColor} mb-4`}
                >
                  <div
                    className={`[&>svg]:w-6 [&>svg]:h-6 bg-gradient-to-br ${section.color} bg-clip-text`}
                  >
                    {section.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:${section.color} transition-all">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[2.5rem] line-clamp-2">
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
