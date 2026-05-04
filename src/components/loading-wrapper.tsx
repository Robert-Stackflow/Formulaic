"use client";

import React from "react";
import { IconRenderer } from "./icon-renderer";

interface LoadingWrapperProps {
  loading?: boolean;
  loadingIconName?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading = false,
  loadingIconName = "Loader2",
  children,
  className = "",
  overlayClassName = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* 内容区域（加载时禁用点击） */}
      <div className={loading ? "pointer-events-none opacity-60" : ""}>
        {children}
      </div>

      {/* 遮罩 + 加载动画 */}
      {loading && (
        <div
          className={`
            absolute inset-0
            flex items-center justify-center 
            ${overlayClassName}
          `}
        >
          <IconRenderer
            iconName={loadingIconName}
            className="w-4 h-4 animate-spin text-white"
          />
        </div>
      )}
    </div>
  );
};

export default LoadingWrapper;
