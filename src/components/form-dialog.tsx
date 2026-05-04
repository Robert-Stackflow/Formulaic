"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function FormDialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
}: FormDialogProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-fd-card border border-fd-border rounded-lg ${maxWidthClasses[maxWidth]} w-full shadow-lg`}
        >
          <div className="flex justify-between items-center p-4 border-b border-fd-border">
            <h2 className="text-xl font-semibold text-fd-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors hover:scale-110 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">{children}</div>

          <div className="flex justify-end gap-2 p-4 border-t border-fd-border">
            {footer}
          </div>
        </div>
      </div>
    </>
  );
}
