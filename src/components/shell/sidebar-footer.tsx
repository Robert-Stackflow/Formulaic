"use client";

import Link from "next/link";
import {
  LogOut,
  Sun,
  Moon,
  LogIn,
  Settings,
  ChevronUp,
  User,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
// 引入所需的 React Hook
import { useState, useRef, useEffect } from "react";

interface SidebarFooterProps {
  collapsed: boolean;
  session: Session | null;
  onSignOut: () => void;
  onSidebarClose: () => void;
}

export function SidebarFooter({
  collapsed,
  session,
  onSignOut,
  onSidebarClose,
}: SidebarFooterProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 外部点击关闭菜单的 Hook
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // 切换主题逻辑 (保持不变)
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

  const userInitial =
    session?.user?.name?.[0]?.toUpperCase() ||
    session?.user?.email?.[0]?.toUpperCase() ||
    "U";

  // 通用的按钮基础样式
  const buttonBaseClass = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
    "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/80",
    collapsed ? "justify-center px-2" : "w-full"
  );

  // 下拉菜单项的样式
  const dropdownItemClass =
    "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-fd-muted/80 transition-colors cursor-pointer text-sm w-full";

  // 退出登录按钮的 Popover 样式
  const signOutItemClass = cn(
    dropdownItemClass,
    "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
  );

  if (!session) {
    return (
      <div className="p-3 mt-auto border-t border-fd-border bg-fd-card/50 backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          {/* 主题切换 (未登录依然可用) */}
          <button
            onClick={toggleTheme}
            className={buttonBaseClass}
            title={collapsed ? "切换主题" : ""}
          >
            <Sun className="w-4 h-4 flex-shrink-0 dark:hidden" />
            <Moon className="w-4 h-4 flex-shrink-0 hidden dark:block" />
            {!collapsed && <span className="flex-1 text-left">切换模式</span>}
          </button>
          {/* 登录按钮 */}
          <Link
            href="/auth/signin"
            onClick={onSidebarClose}
            className={cn(
              "mt-2 flex items-center gap-2 border border-fd-primary/20 bg-fd-primary/5 text-fd-primary hover:bg-fd-primary/10 transition-all rounded-lg",
              collapsed
                ? "justify-center p-2"
                : "justify-center px-4 py-2.5 font-medium shadow-sm"
            )}
            title="登录账号"
          >
            <LogIn className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>立即登录</span>}
          </Link>
        </div>
      </div>
    );
  }

  // ------------------------- 登录后区域 -------------------------
  return (
    <div
      className="p-3 mt-auto border-t border-fd-border bg-fd-card/50 backdrop-blur-sm"
      ref={menuRef}
    >
      <div className="flex flex-col gap-1">
        {/* 1. 主题切换按钮 */}
        <button
          onClick={toggleTheme}
          className={buttonBaseClass}
          title={collapsed ? "切换主题" : ""}
        >
          <Sun className="w-4 h-4 flex-shrink-0 dark:hidden" />
          <Moon className="w-4 h-4 flex-shrink-0 hidden dark:block" />
          {!collapsed && (
            <span className="flex-1 text-left">
              <span className="dark:hidden">浅色模式</span>
              <span className="hidden dark:inline">深色模式</span>
            </span>
          )}
        </button>

        {/* 2. 用户卡片 - 触发菜单 */}
        <div className="my-1 h-px bg-fd-border/50" />
        <button
          onClick={() => {
            if (collapsed) {
              // 如果折叠，直接链接到设置 (遵循简洁原则)
              onSidebarClose();
              // window.location.href = '/settings';
              // 实际项目中 Next.js Link/router.push 更好，但这里模拟点击
            } else {
              // 展开时，切换菜单状态
              setIsMenuOpen(!isMenuOpen);
            }
          }}
          className={cn(
            "flex items-center gap-3 rounded-lg py-2 transition-all duration-200 w-full text-left",
            collapsed ? "justify-center px-2" : "px-3 hover:bg-fd-muted/80",
            isMenuOpen && !collapsed && "bg-fd-muted/80" // 菜单打开时保持高亮
          )}
          title={collapsed ? "用户菜单" : ""}
        >
          {/* 头像区域 (保持不变) */}
          <div className="h-8 w-8 rounded-full bg-fd-primary/10 text-fd-primary flex items-center justify-center border border-fd-primary/20 flex-shrink-0">
            {/* ... (头像/首字母逻辑不变) ... */}
            {session.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="User"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold">{userInitial}</span>
            )}
          </div>

          {/* 用户文字信息 */}
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-fd-foreground truncate leading-none mb-0.5">
                {session.user?.name || "用户"}
              </p>
              <p className="text-xs text-fd-muted-foreground truncate">
                {session.user?.email}
              </p>
            </div>
          )}

          {/* 菜单箭头 */}
          {!collapsed && (
            <ChevronUp
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200 opacity-50",
                isMenuOpen ? "rotate-0" : "rotate-180"
              )}
            />
          )}
        </button>

        {/* 3. 用户菜单 Popover */}
        {isMenuOpen && !collapsed && (
          <div
            className={cn(
              "absolute bottom-20 left-[calc(100%+8px)] w-56 p-2 bg-fd-card border border-fd-border rounded-xl shadow-2xl z-50 transform origin-bottom-left",
              // 针对折叠状态的调整，展开时 Popover 应该位于侧边栏上方
              !collapsed && "left-3 right-3 bottom-[90px] w-auto max-w-full"
            )}
          >
            <div className="flex flex-col gap-0.5">
              {/* 用户设置 */}
              <Link
                href="/settings"
                onClick={() => {
                  setIsMenuOpen(false);
                  onSidebarClose();
                }}
                className={dropdownItemClass}
              >
                <Settings className="w-4 h-4" />
                <span>账户设置</span>
              </Link>

              {/* 退出登录 */}
              <button
                onClick={() => {
                  onSignOut();
                  setIsMenuOpen(false);
                }}
                className={signOutItemClass}
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
