"use client";

import { icons } from "@/lib/icons";
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
  const Icon = icons[iconName as keyof typeof icons] || MessageCircle;
  return <Icon className={className} style={style} />;
}
