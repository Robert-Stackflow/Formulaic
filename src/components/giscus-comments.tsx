"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GiscusCommentsProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: "top" | "bottom";
  lang?: string;
  loading?: "lazy" | "eager";
}

export function GiscusComments({
  repo,
  repoId,
  category,
  categoryId,
  mapping = "pathname",
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = "bottom",
  lang = "zh-CN",
  loading = "lazy",
}: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0");
    script.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0");
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", resolvedTheme === "dark" ? `${window.location.origin}/giscus-dark.css` : `${window.location.origin}/giscus-light.css`);
    script.setAttribute("data-lang", lang);
    script.setAttribute("data-loading", loading);
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, mapping, reactionsEnabled, emitMetadata, inputPosition, lang, loading]);

  // Update theme when it changes
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe) return;

    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: resolvedTheme === "dark" ? `${window.location.origin}/giscus-dark.css` : `${window.location.origin}/giscus-light.css`,
          },
        },
      },
      "https://giscus.app"
    );
  }, [resolvedTheme]);

  return <div ref={ref} id="giscus-comments" />;
}
