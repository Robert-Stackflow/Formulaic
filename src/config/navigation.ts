import {
  BookOpen,
  MessageSquare,
  CheckSquare,
  Settings,
  Shield,
  Newspaper,
  Server,
  GitBranch,
  LayoutGrid,
  Globe,
} from "lucide-react";
import { NavSection, NavItem } from "@/types/nav";
import { Session } from "next-auth";

export function getNavigationConfig(
  session: Session | null,
  isAdmin: boolean,
): NavSection[] {
  // 1. 核心功能 (仅登录可见)
  const coreNav: NavItem[] = session
    ? [
        { title: "讨论区", href: "/discuss", icon: MessageSquare },
        { title: "TODO 看板", href: "/todos", icon: CheckSquare },
      ]
    : [];

  // 2. 资源与外部链接 (全局可见，外部工具可以在此处聚合)
  const resourcesNav: NavItem[] = [
    { title: "博客", href: "/blog", icon: Newspaper },
    { title: "文档", href: "/docs", icon: BookOpen, external: true },
  ];

  // 2.1 外部工具 (如果需要登录才显示工具，可以加判断)
  if (session) {
    resourcesNav.push({
      title: "常用工具",
      icon: LayoutGrid, // 或者 use Globe
      items: [
        {
          title: "GitHub",
          href: "https://github.com/Robert-Stackflow/Formulaic",
          icon: GitBranch,
          external: true,
        },
      ],
    });
  }

  // 3. 用户设置
  const settingsNav: NavItem[] = session
    ? [
        ...(isAdmin
          ? [{ title: "后台管理", href: "/admin", icon: Shield }]
          : []),
      ]
    : [];

  // 组装最终结构
  const sections: NavSection[] = [];

  // Section 1: 平台 (仅登录显示，未登录不显示空标题)
  if (coreNav.length > 0) {
    sections.push({ title: "平台", items: coreNav });
  }

  // Section 2: 发现 (包含文档、Blog、外部链接) -> 这是一个独立分组
  sections.push({ title: "发现", items: resourcesNav });

  // Section 3: 设置 (仅登录显示)
  if (settingsNav.length > 0) {
    sections.push({ title: "设置", items: settingsNav });
  }

  return sections;
}
