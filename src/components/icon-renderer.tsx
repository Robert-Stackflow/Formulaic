"use client";

import * as LucideIcons from "lucide-react";
import { MessageCircle } from "lucide-react";

interface IconRendererProps {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
}

export function IconRenderer({
  iconName,
  className = "w-6 h-6",
  style,
}: IconRendererProps) {
  const Icon = (LucideIcons as any)[iconName] || MessageCircle;
  return <Icon className={className} style={style} />;
}
