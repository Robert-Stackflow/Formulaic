import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-fd-border bg-fd-background/95 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div className="lg:col-span-1">
              <h3 className="text-base font-bold text-fd-foreground mb-4">
                Formulaic
              </h3>
              <p className="text-sm text-fd-muted-foreground leading-relaxed max-w-xs">
                覆盖 LLM、AI Infra、数据结构与算法、计算机系统基础等知识，让学习更清晰、更高效
              </p>
            </div>

            {/* 基础知识 */}
            <div>
              <h3 className="text-sm font-semibold text-fd-foreground mb-4">
                基础知识
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/docs/programming-languages"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    编程语言
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/algorithms"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    数据结构与算法
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/computer-system-basics"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    计算机系统基础
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/large-language-models"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    大语言模型
                  </Link>
                </li>
              </ul>
            </div>

            {/* 更多技能 */}
            <div>
              <h3 className="text-sm font-semibold text-fd-foreground mb-4">
                更多技能
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/docs/backend-development"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    后端开发
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/devops"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    DevOps
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/interview"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    面试
                  </Link>
                </li>
              </ul>
            </div>

            {/* 其他资源 */}
            <div>
              <h3 className="text-sm font-semibold text-fd-foreground mb-4">
                其他资源
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-fd-muted-foreground hover:text-fd-primary transition-colors inline-block"
                  >
                    博客
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/Robert-Stackflow/Formulaic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-fd-muted-foreground hover:text-fd-primary transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-fd-border py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-fd-muted-foreground">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Formulaic. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-fd-primary transition-colors"
              >
                隐私政策
              </Link>
              <Link
                href="/terms"
                className="hover:text-fd-primary transition-colors"
              >
                使用条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
