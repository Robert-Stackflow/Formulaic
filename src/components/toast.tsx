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
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  };

  const bgColors = {
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  };

  const textColors = {
    success: "text-green-800 dark:text-green-200",
    error: "text-red-800 dark:text-red-200",
    info: "text-blue-800 dark:text-blue-200",
    warning: "text-yellow-800 dark:text-yellow-200",
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
