"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, X, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-fd-success" />,
    error: <XCircle className="w-5 h-5 text-fd-destructive" />,
    info: <Info className="w-5 h-5 text-fd-primary" />,
    warning: <AlertCircle className="w-5 h-5 text-fd-warning" />,
  };

  const bgColors = {
    success: "bg-fd-success/10 border-fd-success/20",
    error: "bg-fd-destructive/10 border-fd-destructive/20",
    info: "bg-fd-primary/10 border-fd-primary/20",
    warning: "bg-fd-warning/10 border-fd-warning/20",
  };

  const textColors = {
    success: "text-fd-success",
    error: "text-fd-destructive",
    info: "text-fd-primary",
    warning: "text-fd-warning",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      } ${bgColors[type]}`}
    >
      {icons[type]}
      <span className={`text-sm font-medium ${textColors[type]}`}>
        {message}
      </span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`ml-2 ${textColors[type]} hover:opacity-70`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast Container Component
export function ToastContainer() {
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      type: "success" | "error" | "info" | "warning";
    }>
  >([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type = "success" } = event.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
    };

    window.addEventListener("show-toast" as any, handleToast);
    return () => window.removeEventListener("show-toast" as any, handleToast);
  }, []);

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${1 + index * 5}rem` }}
          className="fixed right-4 z-50"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        </div>
      ))}
    </>
  );
}

// Helper function to show toast
export function showToast(
  message: string,
  type: "success" | "error" | "info" | "warning" = "success"
) {
  window.dispatchEvent(
    new CustomEvent("show-toast", { detail: { message, type } })
  );
}
