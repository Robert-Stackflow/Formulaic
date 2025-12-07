import React from "react";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  bgColor?: string;
  textColor?: string;
}

const sizeClasses = {
  xs: "w-5 h-5 text-xs",
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
  xl: "w-12 h-12 text-lg",
};

/**
 * 根据字符串生成一致的颜色
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 生成柔和的颜色
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#6366f1", // indigo
    "#f97316", // orange
    "#14b8a6", // teal
    "#a855f7", // violet
  ];

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Avatar 组件
 * 显示用户头像，使用用户名的第一个字符
 */
export function Avatar({
  name,
  size = "md",
  className = "",
  bgColor,
  textColor = "white",
}: AvatarProps) {
  const firstChar = name?.charAt(0)?.toUpperCase() || "?";
  const backgroundColor = bgColor || stringToColor(name);

  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 font-medium ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor,
        color: textColor,
      }}
      title={name}
    >
      {firstChar}
    </div>
  );
}
