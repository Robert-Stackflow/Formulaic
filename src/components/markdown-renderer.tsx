"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-bold mt-6 mb-4 text-fd-foreground"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-semibold mt-5 mb-3 text-fd-foreground"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-semibold mt-4 mb-2 text-fd-foreground"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-3 leading-7 text-fd-foreground" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-fd-primary no-underline hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code
                className="bg-fd-secondary text-fd-foreground px-1.5 py-0.5 rounded text-sm font-mono before:content-none after:content-none"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block bg-fd-secondary text-fd-foreground p-4 rounded border border-fd-border overflow-x-auto shadow-none"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="my-4 overflow-x-auto" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-3 list-disc pl-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-3 list-decimal pl-6" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-fd-primary pl-4 italic text-fd-muted-foreground my-4"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-lg shadow my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full border border-fd-border"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-fd-secondary" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-fd-border px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-fd-border px-4 py-2" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-fd-border" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-fd-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-fd-foreground" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
