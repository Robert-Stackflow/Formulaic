import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href?: string; // 如果有子菜单，href 可以是可选的
  icon?: LucideIcon;
  external?: boolean;
  disabled?: boolean;
  items?: NavItem[]; // 支持嵌套
}

export interface NavSection {
  title?: string; // 分组标题
  items: NavItem[];
}