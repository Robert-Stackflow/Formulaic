"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  show?: boolean;
  className?: string;
  iconClassName?: string;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  buttonClassName?: string;
  menuClassName?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

export function DropdownMenu({
  items,
  buttonClassName = "",
  menuClassName = "",
  onOpenChange,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const visibleItems = items.filter((item) => item.show !== false);

  if (visibleItems.length === 0) return null;

  const openMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 200;
    const screenHeight = window.innerHeight;

    const spaceBelow = screenHeight - rect.bottom;
    const spaceAbove = rect.top;

    let finalPlacement: "top" | "bottom" = "bottom";
    // if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
    //   finalPlacement = "top";
    // }

    setPlacement(finalPlacement);

    const top =
      finalPlacement === "bottom" ? rect.bottom + 6 : rect.top - menuHeight - 6;

    let left = rect.right - 150;
    left = Math.max(8, Math.min(left, window.innerWidth - 160));

    setMenuPos({ top, left });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isOpen;
    setIsOpen(next);
    onOpenChange?.(next);
    if (next) openMenu();
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handleItemClick = (item: DropdownMenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    item.onClick(e);
    handleClose();
  };

  // useEffect(() => {
  //   const fn = (e: MouseEvent) => {
  //     if (!isOpen) return;
  //     handleClose();
  //   };
  //   window.addEventListener("click", fn);
  //   return () => window.removeEventListener("click", fn);
  // }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`flex-shrink-0 cursor-pointer text-fd-muted-foreground hover:text-fd-foreground transition-colors p-2 rounded hover:bg-fd-secondary ${buttonClassName}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* 背景遮罩 */}
                <div className="fixed inset-0 z-10" onClick={handleClose} />

                {/* 菜单 */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: placement === "bottom" ? -6 : 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: placement === "bottom" ? -6 : 6,
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={`fixed bg-fd-card border border-fd-border rounded-md shadow-lg overflow-hidden z-[999] min-w-[140px] ${menuClassName}`}
                  style={{
                    top: menuPos.top,
                    left: menuPos.left,
                  }}
                >
                  {visibleItems.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === visibleItems.length - 1;
                    return (
                      <button
                        key={index}
                        onClick={(e) => handleItemClick(item, e)}
                        className={`w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-fd-secondary flex items-center gap-2 ${
                          isFirst ? "rounded-t-md" : ""
                        } ${isLast ? "rounded-b-md" : ""} ${
                          item.className || "text-fd-foreground"
                        }`}
                      >
                        {item.icon && (
                          <span className={item.iconClassName}>
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
