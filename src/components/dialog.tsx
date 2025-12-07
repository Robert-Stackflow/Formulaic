"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import LoadingButton from "./loading-button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
  confirmText?: string;
  loadingText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  confirmText = "确定",
  loadingText = "处理中...",
  cancelText = "取消",
  type = "danger",
}: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const buttonColors = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-orange-600 hover:bg-orange-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-fd-card border border-fd-border rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-fd-border">
            <h2 className="text-lg font-semibold text-fd-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 py-8">
            <p className="text-fd-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-fd-border">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-fd-secondary cursor-pointer text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              {cancelText}
            </button>
            <LoadingButton
              type="submit"
              onClick={async () => {
                await onConfirm();
                await onClose();
              }}
              loading={loading}
              loadingText={loadingText}
              normalText={confirmText}
              className={buttonColors[type]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
