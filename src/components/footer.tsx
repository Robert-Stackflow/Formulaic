import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-fd-background/50 mt-auto">
      <div className="mx-auto max-w-fd-container px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4">
              Formulaic
            </h3>
            <p className="text-sm text-fd-muted-foreground leading-relaxed">
              技术面试知识库，系统化整理算法、后端、系统等核心领域知识。
            </p>
          </div>

          {/* 基础知识 */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4">
              基础知识
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li>
                <Link
                  href="/programming-languages"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  编程语言
                </Link>
              </li>
              <li>
                <Link
                  href="/algorithms"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  数据结构与算法
                </Link>
              </li>
              <li>
                <Link
                  href="/computer-system-basics"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  计算机系统基础
                </Link>
              </li>
              <li>
                <Link
                  href="/large-language-models"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  大语言模型
                </Link>
              </li>
            </ul>
          </div>

          {/* 更多技能 */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4">
              更多技能
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li>
                <Link
                  href="/backend-development"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  后端开发
                </Link>
              </li>
              <li>
                <Link
                  href="/devops"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  DevOps
                </Link>
              </li>
              <li>
                <Link
                  href="/interview-preparation"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  面试准备
                </Link>
              </li>
            </ul>
          </div>

          {/* 其他资源 */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4">
              其他资源
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  博客
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Robert-Stackflow/Formulaic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-[var(--color-fd-primary)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
