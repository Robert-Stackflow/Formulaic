"use client";

import React, { ButtonHTMLAttributes } from "react";
import { IconRenderer } from "./icon-renderer";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loadingText?: string;
  normalText?: string;
  iconName?: string; // 正常状态图标名称
  loadingIconName?: string; // 加载状态图标名称
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  normalText,
  iconName,
  loadingIconName,
  disabled,
  className = "",
  type,
  ...props
}) => {
  const hasBg = className?.includes("bg-");

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`px-4 py-2 text-sm cursor-pointer text-fd-primary-foreground
    ${hasBg ? "" : "bg-fd-primary"} 
    rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 
    flex items-center justify-center gap-2 
    ${className}`}
      {...props}
    >
      {loading ? (
        <>
          {loadingIconName ? (
            <IconRenderer
              iconName={loadingIconName}
              className="w-4 h-4 animate-spin"
            />
          ) : (
            <IconRenderer iconName="Loader2" className="w-4 h-4 animate-spin" />
          )}
          {loadingText}
        </>
      ) : (
        <>
          {iconName && <IconRenderer iconName={iconName} className="w-4 h-4" />}
          {normalText}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
