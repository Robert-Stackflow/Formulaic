"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText, LoaderCircle, X } from "lucide-react";
import { SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogFooter,
  SearchDialogHeader, SearchDialogIcon, SearchDialogInput, SearchDialogOverlay,
  type SharedProps } from "fumadocs-ui/components/dialog/search";
import { highlightParts, safeSearchUrl, searchDocuments, type SearchResponse } from "@/lib/onesearch-client";

function Highlight({ value }: { value: string }) {
  return highlightParts(value).map((part, i) => part.highlighted
    ? <mark key={i} className="rounded-sm bg-fd-primary/10 px-0.5 text-fd-primary">{part.text}</mark>
    : <span key={i}>{part.text}</span>);
}

export default function OneSearchDialog({ open, onOpenChange }: SharedProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [composing, setComposing] = useState(false);
  const [active, setActive] = useState(-1);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const requestVersion = useRef(0);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const version = ++requestVersion.current;
    if (!open || composing || !query.trim()) {
      setLoading(false); setResult(null); setError(""); return;
    }
    const controller = new AbortController();
    setLoading(true); setError(""); setResult(null); setActive(-1);
    const timer = setTimeout(async () => {
      try {
        const next = await searchDocuments(query.trim(), page, controller.signal);
        if (requestVersion.current === version) {
          setResult(next); viewport.current?.scrollTo({ top: 0 });
        }
      } catch (err) {
        if (!controller.signal.aborted && requestVersion.current === version) setError(err instanceof Error ? err.message : "搜索失败，请重试");
      } finally {
        if (requestVersion.current === version) setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); requestVersion.current++; };
  }, [query, page, open, composing, retry]);

  function moveResult(event: React.KeyboardEvent) {
    if (event.nativeEvent.isComposing || !result?.hits.length) return;
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "ArrowDown" ? (active + 1) % result.hits.length : (active <= 0 ? result.hits.length - 1 : active - 1);
      setActive(next); links.current[next]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && active >= 0 && event.target instanceof HTMLInputElement) {
      event.preventDefault(); links.current[active]?.click();
    }
  }

  return <SearchDialog open={open} onOpenChange={onOpenChange} search={query} isLoading={loading}
    onSearchChange={value => { setQuery(value); setPage(1); }}>
    <SearchDialogOverlay className="formulaic-search-overlay" />
    <SearchDialogContent className="formulaic-search-dialog" onKeyDown={moveResult}>
      <SearchDialogHeader className="shrink-0 gap-3 px-5 py-4">
        <SearchDialogIcon />
        <SearchDialogInput aria-label="搜索文档与博客" onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} />
        <SearchDialogClose aria-label="关闭搜索" className="size-9 shrink-0 p-0"><X className="size-4" /></SearchDialogClose>
      </SearchDialogHeader>
      <div ref={viewport} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3" aria-live="polite" aria-busy={loading}>
        {loading ? <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-fd-muted-foreground"><LoaderCircle className="size-4 animate-spin" />正在搜索</div>
          : error ? <div className="py-14 text-center text-sm"><p role="alert">{error}</p><button type="button" className="mt-4 rounded-lg border px-4 py-2" onClick={() => setRetry(v => v + 1)}>重新搜索</button></div>
          : result?.hits.length ? <div className="space-y-1">
            <p className="px-3 pb-2 text-xs text-fd-muted-foreground">{result.totalHits} 个结果 · {result.processingTimeMs} ms</p>
            {result.hits.map((hit, i) => <Link key={hit.id} href={safeSearchUrl(hit.url)!} prefetch={false}
              ref={element => { links.current[i] = element; }} onFocus={() => setActive(i)}
              onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) onOpenChange(false); }}
              className={`group flex gap-3 rounded-xl px-3 py-4 outline-none transition-colors hover:bg-fd-accent focus-visible:ring-2 focus-visible:ring-fd-primary ${active === i ? "bg-fd-accent" : ""}`}>
              <FileText className="mt-0.5 size-4 shrink-0 text-fd-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-fd-muted-foreground">{hit.type === "blog" ? "博客" : "文档"}{hit.section && <> / <Highlight value={hit._formatted?.section || hit.section} /></>}</p>
                <h3 className="mt-1 text-sm font-semibold"><Highlight value={hit._formatted?.title || hit.title} /></h3>
                <p className="mt-1.5 line-clamp-3 break-words text-sm leading-relaxed text-fd-muted-foreground"><Highlight value={hit._formatted?.content || hit.content} /></p>
              </div><ArrowUpRight className="mt-1 size-4 shrink-0 text-fd-muted-foreground" />
            </Link>)}
          </div> : <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 text-center"><FileText className="size-7 text-fd-muted-foreground" /><p className="text-sm text-fd-muted-foreground">{query.trim() ? "未找到相关内容，试试其他关键词" : "输入关键词，搜索文档与博客"}</p></div>}
      </div>
      <SearchDialogFooter className="flex shrink-0 items-center justify-between gap-3 px-5 py-3">
        <span className="text-xs text-fd-muted-foreground">OneSearch</span>
        {result && result.totalPages > 1 ? <nav aria-label="搜索分页" className="flex items-center gap-2">
          <button type="button" aria-label="上一页" disabled={loading || page <= 1} onClick={() => setPage(p => p - 1)} className="flex size-9 items-center justify-center rounded-lg border bg-fd-background disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          <span className="min-w-12 text-center text-xs tabular-nums">{result.page} / {result.totalPages}</span>
          <button type="button" aria-label="下一页" disabled={loading || page >= result.totalPages} onClick={() => setPage(p => p + 1)} className="flex size-9 items-center justify-center rounded-lg border bg-fd-background disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </nav> : <span className="hidden text-xs text-fd-muted-foreground sm:block">↑ ↓ 选择 · Enter 打开 · Esc 关闭</span>}
      </SearchDialogFooter>
    </SearchDialogContent>
  </SearchDialog>;
}
