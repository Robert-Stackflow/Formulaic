"use client";

import { useTOCItems } from "fumadocs-ui/components/toc";
import Link from "next/link";

export function TOCItems() {
  const items = useTOCItems();

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className="block text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          style={{
            paddingLeft: `${(item.depth - 2) * 0.75}rem`,
          }}
          // data-active={item.active}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
