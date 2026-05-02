import Link from "next/link";

interface BlogTagProps {
  tag: string;
}

export function BlogTag({ tag }: BlogTagProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="px-2 py-0.5 border border-fd-border text-fd-muted-foreground rounded-full text-xs hover:text-fd-foreground hover:border-fd-foreground/30"
    >
      {tag}
    </Link>
  );
}
