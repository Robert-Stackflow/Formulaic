import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ToastContainer } from "@/components/toast";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import ClientShell from "@/components/shell/client-shell";
import "katex/dist/katex.css";

export const metadata: Metadata = {
  title: {
    default: "Formulaic - 技术面试知识库",
    template: "%s - Formulaic",
  },
  description:
    "Formulaic 是一个系统化的技术面试知识库，涵盖算法、后端开发、计算机系统、DevOps、大语言模型、编程语言等核心领域的八股文知识整理。",
  keywords: [
    "Formulaic",
    "技术面试",
    "八股文",
    "算法",
    "后端开发",
    "计算机系统",
    "面试",
    "编程知识",
  ],
  authors: [{ name: "Formulaic" }],
  creator: "Formulaic",
  publisher: "Formulaic",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Formulaic",
    title: "Formulaic - 技术面试知识库",
    description:
      "系统化的技术面试知识库，帮助你掌握算法、后端、系统、DevOps 等核心领域的八股文知识。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formulaic - 技术面试知识库",
    description:
      "系统化的技术面试知识库，帮助你掌握算法、后端、系统、DevOps 等核心领域的八股文知识。",
  },
  icons: {
    icon: "/logo-transparent.png",
    shortcut: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <RootProvider search={{}}>
          <ClientShell>{children}</ClientShell>
          <ToastContainer />
        </RootProvider>
      </body>
    </html>
  );
}
