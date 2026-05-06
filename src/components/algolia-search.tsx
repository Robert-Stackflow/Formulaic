"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { liteClient } from "algoliasearch/lite";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import Link from "next/link";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "Your Algolia App ID";
const apiKey =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ||
  "Your Algolia Search API Key";
const indexName = process.env.ALGOLIA_INDEX_NAME || "document";
const client = liteClient(appId, apiKey);

interface AlgoliaHit {
  title: string;
  url: string;
  content: string;
  section?: string;
  section_id?: string;
  objectID: string;
  _highlightResult: {
    title: {
      value: string;
      matchLevel: string;
    };
    content: {
      value: string;
      matchLevel: string;
    };
    section?: {
      value: string;
      matchLevel: string;
    };
  };
}

interface SearchResult {
  hits: AlgoliaHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
}

function HighlightedText({ html }: { html: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className="[&_em]:not-italic [&_em]:font-semibold [&_em]:text-fd-primary [&_em]:bg-fd-primary/10 [&_em]:px-0.5 [&_em]:rounded"
    />
  );
}

function SearchResultItem({ hit }: { hit: AlgoliaHit }) {
  const fullUrl = hit.section_id ? `${hit.url}#${hit.section_id}` : hit.url;

  return (
    <Link
      href={fullUrl}
      className="block px-4 py-3 hover:bg-fd-accent rounded-lg transition-colors group"
    >
      <div className="flex flex-col gap-1.5">
        <div className="font-medium text-sm line-clamp-1 group-hover:text-fd-primary transition-colors">
          <HighlightedText html={hit._highlightResult.title.value} />
        </div>
        {hit.section && (
          <div className="text-xs text-fd-muted-foreground line-clamp-1">
            <HighlightedText
              html={hit._highlightResult.section?.value || hit.section}
            />
          </div>
        )}
        <div className="text-xs text-fd-muted-foreground line-clamp-2 leading-relaxed">
          <HighlightedText html={hit._highlightResult.content.value} />
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-2.5 py-1 text-xs rounded cursor-pointer hover:bg-fd-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="上一页"
      >
        上一页
      </button>
      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="min-w-[28px] px-2 py-1 text-xs rounded hover:bg-fd-accent transition-colors cursor-pointer"
          >
            1
          </button>
          {startPage > 1 && <span className="px-1 text-fd-muted-foreground">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-[28px] px-2 py-1 text-xs rounded cursor-pointer transition-colors ${
            page === currentPage
              ? "bg-fd-primary text-fd-primary-foreground font-medium"
              : "hover:bg-fd-accent"
          }`}
        >
          {page + 1}
        </button>
      ))}
      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="px-1 text-fd-muted-foreground">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="min-w-[28px] px-2 py-1 text-xs rounded cursor-pointer hover:bg-fd-accent transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-2.5 py-1 text-xs rounded hover:bg-fd-accent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="下一页"
      >
        下一页
      </button>
    </div>
  );
}

export default function AlgoliaSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(
    async (query: string, page: number) => {
      if (!query.trim()) {
        setResult(null);
        return;
      }

      setIsLoading(true);
      try {
        const searchResult = await client.search({
          requests: [
            {
              indexName,
              query,
              distinct: 5,
              hitsPerPage: 10,
              page,
              ...(locale && { filters: `locale:${locale}` }),
            },
          ],
        });

        setResult(searchResult.results[0] as unknown as SearchResult);
      } catch (error) {
        console.error("Search error:", error);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [locale],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
      performSearch(search, 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, performSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearch(search, page);
    // 滚动到顶部
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>

        <div ref={scrollContainerRef} className="overflow-y-auto px-2 max-h-[60vh]">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-fd-primary animate-pulse">
                  ...
                </div>
                <div className="mt-2 text-sm text-fd-muted-foreground">
                  搜索中
                </div>
              </div>
            </div>
          )}

          {!isLoading && result && result.hits.length > 0 && (
            <div className="sticky top-0 bg-fd-background z-10 py-2 px-2 mb-1 border-b border-fd-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-fd-muted-foreground">
                  找到 <span className="font-medium text-fd-foreground">{result.nbHits}</span> 个结果
                </span>
                <span className="text-fd-muted-foreground">
                  用时 <span className="font-medium text-fd-foreground">{result.processingTimeMS}</span>ms
                </span>
              </div>
            </div>
          )}

          {!isLoading && result && result.hits.length > 0 ? (
            <>
              <div className="space-y-1 pb-2">
                {result.hits.map((hit) => (
                  <SearchResultItem key={hit.objectID} hit={hit} />
                ))}
              </div>
              {result.nbPages > 1 && (
                <div className="sticky bottom-0 bg-fd-background border-t border-fd-border pt-2 pb-1">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={result.nbPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : !isLoading && search.trim() && !result?.hits.length ? (
            <div className="py-12 text-center text-sm text-fd-muted-foreground">
              未找到相关结果
            </div>
          ) : !isLoading && !search.trim() ? (
            <div className="py-12 text-center text-sm text-fd-muted-foreground">
              输入关键词开始搜索
            </div>
          ) : null}
        </div>

        <SearchDialogFooter>
          <a
            href="https://algolia.com"
            rel="noreferrer noopener"
            className="ms-auto text-xs text-fd-muted-foreground"
          >
            Search powered by Algolia
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
