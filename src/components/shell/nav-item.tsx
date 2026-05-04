"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/nav";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  level?: number; // 新增层级控制
  onItemClick?: () => void;
}

export function SidebarItem({
  item,
  collapsed,
  level = 0,
  onItemClick,
}: NavItemProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // 判定激活状态
  const isActive = item.href
    ? pathname === item.href || pathname?.startsWith(item.href + "/")
    : false;

  const hasActiveChild = item.items?.some(
    (child) =>
      child.href &&
      (pathname === child.href || pathname?.startsWith(child.href + "/"))
  );

  useEffect(() => {
    if (hasActiveChild) setIsExpanded(true);
  }, [hasActiveChild]);

  const Icon = item.icon;
  const hasChildren = !!item.items && item.items.length > 0;

  // 点击处理
  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    } else {
      onItemClick?.();
    }
  };

  // 动态计算缩进 (collapsed 状态下不缩进)
  // 第一级不缩进(level 0)，第二级缩进(level 1)
  const indentStyle = collapsed ? {} : { paddingLeft: `${12 + level * 12}px` };

  return (
    <div className="w-full select-none">
      {/* 渲染链接或按钮 */}
      <Link
        href={!hasChildren && item.href ? item.href : "#"}
        onClick={handleClick}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        style={indentStyle}
        title={collapsed ? item.title : ""}
        className={cn(
          "group flex items-center gap-3 py-2 pr-3 rounded-md transition-all duration-200 w-full outline-none",
          isActive
            ? "bg-fd-primary/10 text-fd-primary font-medium"
            : "text-fd-muted-foreground hover:bg-fd-muted/80 hover:text-fd-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        {/* 图标 */}
        {Icon && (
          <Icon
            className={cn(
              "w-4 h-4 flex-shrink-0",
              isActive
                ? "text-fd-primary"
                : "text-fd-muted-foreground group-hover:text-fd-foreground"
            )}
          />
        )}

        {/* 文字内容 (折叠时隐藏) */}
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-sm">{item.title}</span>

            {/* 外部链接图标 */}
            {item.external && !hasChildren && (
              <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
            )}

            {/* 折叠箭头 */}
            {hasChildren && (
              <ChevronRight
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 opacity-50 group-hover:opacity-100",
                  isExpanded ? "rotate-90" : ""
                )}
              />
            )}
          </>
        )}
      </Link>

      {/* 递归子菜单 */}
      {!collapsed && hasChildren && isExpanded && (
        <div className="mt-1 space-y-0.5 relative">
          {/* 可选：添加左侧连接线增强层级感 */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px bg-fd-border/50"
            style={{ left: `${18 + level * 12}px` }}
          />

          {item.items!.map((subItem) => (
            <SidebarItem
              key={subItem.title}
              item={subItem}
              collapsed={collapsed}
              level={level + 1} // 增加层级
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
