"use client";

import { ReactNode, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { Menu, X, ChevronLeft, Sun, Moon, LogOut } from "lucide-react";
import { getNavigationConfig } from "@/config/navigation";
import { SidebarItem } from "./nav-item";
import { cn } from "@/lib/utils";
import { SidebarFooter } from "./sidebar-footer";
interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { session, isAdmin } = usePermissions();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 获取配置化的菜单
  const navSections = getNavigationConfig(session, isAdmin());

  const isDocsPage = pathname?.startsWith("/docs");
  const isAuthPage = pathname?.startsWith("/auth");

  if (isDocsPage || isAuthPage) {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="min-h-screen bg-fd-background flex text-sm">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-fd-card border-r border-fd-border z-50 transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
        )}
      >
        {/* Header: Logo & Toggle */}
        <div
          className={cn(
            "flex items-center border-b border-fd-border p-4 h-16",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <Link
              href="/"
              className="text-xl font-bold text-fd-foreground truncate"
            >
              Formulaic
            </Link>
          )}

          <div className="flex items-center gap-2">
            {/* 桌面端折叠 */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 hover:bg-fd-muted rounded-md text-fd-muted-foreground hover:text-fd-foreground"
            >
              {collapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
            {/* 移动端关闭 */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 侧边栏导航区域 */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {/* 分组标题 */}
              {!collapsed && section.title && (
                <h4 className="px-3 mb-2 text-xs font-semibold text-fd-muted-foreground/70 uppercase tracking-wider">
                  {section.title}
                </h4>
              )}

              {/* 分组内容 */}
              {section.items.map((item) => (
                <SidebarItem
                  key={item.title}
                  item={item}
                  collapsed={collapsed}
                  onItemClick={() => setSidebarOpen(false)}
                />
              ))}

              {/* 仅在非折叠状态下，且不是最后一组时，显示分割线 */}
              {!collapsed && idx < navSections.length - 1 && (
                <div className="pt-4 pb-2">
                  <div className="h-px bg-fd-border/40 mx-2" />
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Actions: Theme & User */}
        <SidebarFooter
          collapsed={collapsed}
          session={session}
          onSignOut={handleSignOut}
          onSidebarClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 px-4 h-16 bg-fd-card border-b border-fd-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-fd-muted rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold">Formulaic</span>
        </header>

        <main className="flex-1 p-0 relative">{children}</main>
      </div>
    </div>
  );
}
