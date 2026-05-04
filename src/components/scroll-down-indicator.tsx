"use client";

import { ChevronDownIcon } from "lucide-react";

export function ScrollDownIndicator() {
  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight - 64,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:text-fd-primary transition-colors group"
      aria-label="向下滚动"
    >
      <span className="text-xs text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
        向下滚动探索更多
      </span>
      <ChevronDownIcon className="w-5 h-5 text-fd-muted-foreground group-hover:text-fd-primary transition-colors" />
    </button>
  );
}
