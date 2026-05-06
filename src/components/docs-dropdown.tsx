"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Layers,
  Cpu,
  Brain,
  Server,
  Rocket,
  GraduationCap,
} from "lucide-react";

interface MenuItem {
  href: string;
  title: string;
  description: string;
  icon: string;
}

interface DocsDropdownProps {
  items: MenuItem[];
}

const iconMap = {
  Code2,
  Layers,
  Cpu,
  Brain,
  Server,
  Rocket,
  GraduationCap,
} as const;

export function DocsDropdown({ items }: DocsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">(
    "left",
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // 计算下拉框位置
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 280;
      const viewportWidth = window.innerWidth;

      if (buttonRect.left + dropdownWidth > viewportWidth - 20) {
        setDropdownPosition("right");
      } else {
        setDropdownPosition("left");
      }
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className={`px-2.5 py-1.5 text-sm transition-all duration-200 rounded-md cursor-pointer ${
          isOpen
            ? "bg-fd-accent text-fd-primary"
            : "text-fd-muted-foreground hover:text-fd-accent-foreground hover:bg-fd-accent/50"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        文档
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 w-[280px] bg-fd-popover border border-fd-border rounded-lg shadow-lg ${
            dropdownPosition === "right" ? "right-0" : "left-0"
          }`}
          style={{
            animation: "dropdownSlideIn 200ms ease-out",
            zIndex: 50,
          }}
        >
          <style jsx>{`
            @keyframes dropdownSlideIn {
              from {
                opacity: 0;
                transform: translateY(-8px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
          <div className="flex flex-col gap-0.5 p-1.5">
            {items.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-2.5 px-2.5 py-2 rounded-md hover:bg-fd-accent transition-colors"
                >
                  <div className="flex-shrink-0 pt-0.5">
                    <Icon className="w-4 h-4 text-fd-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-fd-foreground group-hover:text-fd-primary transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-fd-muted-foreground line-clamp-1 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
