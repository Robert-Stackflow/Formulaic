"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingContent } from "@/components/loading";
import { PageLayout, PageHeader } from "@/components/page-layout";
import { Avatar } from "@/components/avatar";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
  MessageCircle,
  Eye,
  ThumbsUp,
  Pin,
  CheckCircle2,
  Lock,
  Filter,
  X,
  ArrowLeft,
  Star,
  StarOff,
  Search,
  ChevronDown,
  Unlock,
  Circle,
  Check,
  Tag as TagIcon,
  ArrowUpDown,
  Clock,
  MessageSquare,
  Edit,
  MoreVertical,
  User,
  List,
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api-client";
import { showToast } from "@/components/toast";
import { usePermissions } from "@/hooks/use-permissions";
import { DropdownMenu } from "@/components/dropdown-menu";

const IconRenderer = ({
  iconName,
  className,
  style,
}: {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const Icon = (LucideIcons as any)[iconName] || MessageCircle;
  return <Icon className={className} style={style} />;
};

interface Board {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  icon: string | null;
}

interface Topic {
  id: number;
  board_id: number;
  title: string;
  content: string;
  tags: string | null;
  status: string;
  is_pinned: number;
  is_resolved: number;
  closed_at: string | null;
  view_count: number;
  reply_count: number;
  like_count: number;
  watch_count: number;
  author_name: string;
  created_by: number;
  created_at: string;
  last_reply_at: string | null;
}

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { session, canPostDiscuss } = usePermissions();
  const { isAdmin } = usePermissions();
  const router = useRouter();
  const [boardId, setBoardId] = useState<string>("");
  const [board, setBoard] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<
    "created_at" | "reply_count" | "like_count" | "watch_count"
  >("created_at");
  const [filterMode, setFilterMode] = useState<
    "all" | "closed-only" | "hide-closed" | "resolved-only" | "hide-resolved"
  >("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [watchedTopics, setWatchedTopics] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);

  // 简单的客户端缓存
  const topicsCache = useRef<
    Map<string, { data: Topic[]; totalPages: number; timestamp: number }>
  >(new Map());
  const CACHE_DURATION = 60000; // 缓存1分钟

  useEffect(() => {
    fetchTags();
    params.then((p) => {
      setBoardId(p.id);
      fetchBoard(p.id);
      fetchTopics(p.id, 1);
      fetchAuthors(p.id);
    });
  }, []);

  const fetchTags = async () => {
    const result = await apiGet("/api/admin/discussion-tags");
    if (result.success && result.data) {
      setAvailableTags(result.data.tags);
    }
  };

  const fetchAuthors = async (id: string) => {
    const result = await apiGet(
      `/api/discussion/topics?board_id=${id}&get_authors=true`
    );
    if (result.success && result.data?.authors) {
      setAvailableAuthors(result.data.authors);
    }
  };

  useEffect(() => {
    if (boardId) {
      const timer = setTimeout(
        () => {
          fetchTopics(boardId, page);
        },
        searchQuery ? 300 : 0
      ); // 搜索时防抖
      return () => clearTimeout(timer);
    }
  }, [
    page,
    sortBy,
    filterMode,
    selectedTags,
    searchQuery,
    selectedAuthor,
    session,
    pageSize,
  ]);

  const fetchBoard = async (id: string) => {
    const result = await apiGet(`/api/discussion/boards/${id}`);
    if (result.success && result.data) {
      setBoard(result.data.board);
      if (result.data.board?.name) {
        document.title = `${result.data.board.name} - 讨论区 - Formulaic`;
      }
    }
  };

  const fetchTopics = async (id: string, p: number) => {
    setIsSearching(true);
    const params = new URLSearchParams({
      board_id: id,
      page: p.toString(),
      limit: pageSize.toString(),
      sort: sortBy,
    });

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    if (selectedAuthor) {
      params.append("author", selectedAuthor);
    }
    if (selectedTags.length > 0) {
      params.append("tags", selectedTags.join(","));
    }
    if (filterMode !== "all") {
      params.append("status", filterMode);
    }

    const cacheKey = params.toString();
    const cached = topicsCache.current.get(cacheKey);
    const now = Date.now();

    // 检查缓存是否有效
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      setTopics(cached.data);
      setTotalPages(cached.totalPages);
      setIsSearching(false);
      setLoading(false);

      // 如果用户已登录，获取关注状态
      if (session) {
        fetchWatchedTopics(cached.data.map((t: Topic) => t.id));
      }
      return;
    }

    const result = await apiGet(`/api/discussion/topics?${params.toString()}`);
    if (result.success && result.data) {
      setTopics(result.data.topics);
      setTotalPages(result.data.pagination.totalPages);

      // 缓存结果
      topicsCache.current.set(cacheKey, {
        data: result.data.topics,
        totalPages: result.data.pagination.totalPages,
        timestamp: now,
      });

      // 如果用户已登录，获取关注状态
      if (session) {
        fetchWatchedTopics(result.data.topics.map((t: Topic) => t.id));
      }
    }
    setLoading(false);
    setIsSearching(false);
  };

  const fetchWatchedTopics = async (topicIds: number[]) => {
    const watched = new Set<number>();
    await Promise.all(
      topicIds.map(async (id) => {
        const result = await apiGet(`/api/discussion/watches?topic_id=${id}`);
        if (result.success && result.data?.watching) {
          watched.add(id);
        }
      })
    );
    setWatchedTopics(watched);
  };

  const toggleWatch = async (topicId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const result = await apiPost("/api/discussion/watches", {
      topic_id: topicId,
    });
    if (result.success && result.data) {
      const newWatched = new Set(watchedTopics);
      if (result.data.watching) {
        newWatched.add(topicId);
        showToast("已关注该主题", "success");
      } else {
        newWatched.delete(topicId);
        showToast("已取消关注", "success");
      }
      setWatchedTopics(newWatched);

      // 更新主题的关注数
      setTopics((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? {
                ...t,
                watch_count: t.watch_count + (result.data.watching ? 1 : -1),
              }
            : t
        )
      );
    }
  };

  const togglePin = async (
    topicId: number,
    currentPinned: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await apiPost(`/api/discussion/topics/${topicId}/pin`, {});
    if (result.success && result.data) {
      const newPinnedState = (result.data as any).pinned;
      const isPinned = newPinnedState === 1;

      // 更新主题的置顶状态
      setTopics((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? {
                ...t,
                is_pinned: newPinnedState,
              }
            : t
        )
      );

      showToast(isPinned ? "主题已置顶" : "已取消置顶", "success");

      // 清空缓存以重新加载排序后的列表
      topicsCache.current.clear();
      fetchTopics(boardId, page);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  // 所有筛选(标签、状态)都已由 API 处理，直接使用返回的数据
  const filteredTopics = topics;

  const getTagInfo = (tagName: string) => {
    const tag = availableTags.find((t) => t.name === tagName);
    return {
      color: tag?.color || "#6b7280",
      label: tag?.description || tagName,
      icon: tag?.icon,
    };
  };

  return (
    <PageLayout maxWidth="2xl">
      <Link
        href="/discuss"
        className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>返回讨论区</span>
      </Link>

      {loading || !board ? (
        <LoadingContent message="加载板块..." />
      ) : (
        <>
          <div className="mb-6">
            <PageHeader
              title={
                <span className="flex items-center gap-3">
                  <IconRenderer
                    iconName={board.icon}
                    className="w-8 h-8"
                    style={{ color: board.color || "#3b82f6" }}
                  />
                  {board.name}
                </span>
              }
              description={board.description}
              action={
                canPostDiscuss() && (
                  <Link
                    href={`/discuss/boards/${boardId}/new`}
                    className="px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
                  >
                    发布主题
                  </Link>
                )
              }
            />
          </div>

          {!session && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-300 dark:border-yellow-800 p-4 rounded-lg text-center">
              <p className="text-yellow-800 dark:text-yellow-300">
                请先登录才能发布主题
              </p>
            </div>
          )}

          {/* GitHub Issue 风格的筛选和搜索 */}
          <div className="mb-4 space-y-3">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fd-muted-foreground" />
              <input
                type="text"
                placeholder="搜索主题标题、内容或回复..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-10 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSearching && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-fd-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* 筛选器行 */}
            <div className="flex gap-2 items-center flex-wrap">
              {/* 状态筛选下拉 */}
              <div className="relative group">
                <button className="px-3 py-1.5 text-sm cursor-pointer border border-fd-border rounded-md bg-fd-background hover:bg-fd-muted transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>
                    {filterMode === "all"
                      ? "全部主题"
                      : filterMode === "closed-only"
                      ? "仅已关闭"
                      : filterMode === "hide-closed"
                      ? "未关闭"
                      : filterMode === "resolved-only"
                      ? "仅已解决"
                      : "未解决"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg z-10 min-w-[160px]">
                  {[
                    { value: "all", label: "全部主题", icon: null },
                    { value: "closed-only", label: "仅已关闭", icon: Lock },
                    { value: "hide-closed", label: "未关闭", icon: Unlock },
                    {
                      value: "resolved-only",
                      label: "仅已解决",
                      icon: CheckCircle2,
                    },
                    { value: "hide-resolved", label: "未解决", icon: Circle },
                  ].map((option, index, array) => {
                    const Icon = option.icon;
                    const isFirst = index === 0;
                    const isLast = index === array.length - 1;
                    return (
                      <div key={option.value}>
                        <button
                          onClick={() => {
                            setFilterMode(option.value as any);
                            setPage(1);
                          }}
                          className={`w-full px-3 py-2 cursor-pointer text-sm text-left hover:bg-fd-muted transition-colors flex items-center gap-2 ${
                            isFirst ? "rounded-t-md" : ""
                          } ${isLast ? "rounded-b-md" : ""} ${
                            filterMode === option.value
                              ? "bg-fd-muted text-fd-primary"
                              : ""
                          }`}
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {option.label}
                          {filterMode === option.value && (
                            <Check className="w-3.5 h-3.5 ml-auto" />
                          )}
                        </button>
                        {option.value == "all" && (
                          <div className="border-t border-fd-border" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 作者筛选下拉 */}
              {availableAuthors.length > 0 && (
                <div className="relative group">
                  <button className="px-3 py-1.5 text-sm cursor-pointer border border-fd-border rounded-md bg-fd-background hover:bg-fd-muted transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedAuthor || "作者"}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg z-10 min-w-[180px] max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedAuthor("");
                        setPage(1);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-fd-muted transition-colors flex items-center gap-2 rounded-t-md ${
                        !selectedAuthor
                          ? "bg-fd-muted text-fd-primary font-medium"
                          : ""
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      全部作者
                      {!selectedAuthor && (
                        <Check className="w-3.5 h-3.5 ml-auto" />
                      )}
                    </button>
                    <div className="border-t border-fd-border" />
                    {availableAuthors.map((author, index) => (
                      <button
                        key={author}
                        onClick={() => {
                          setSelectedAuthor(author);
                          setPage(1);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-fd-muted transition-colors flex items-center gap-2 ${
                          index === availableAuthors.length - 1
                            ? "rounded-b-md"
                            : ""
                        } ${
                          selectedAuthor === author
                            ? "bg-fd-muted text-fd-primary font-medium"
                            : ""
                        }`}
                      >
                        <Avatar name={author} size="sm" />
                        <span className="flex-1 truncate">{author}</span>
                        {selectedAuthor === author && (
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 标签筛选下拉 */}
              {availableTags.length > 0 && (
                <div className="relative group">
                  <button className="px-3 py-1.5 text-sm cursor-pointer border border-fd-border rounded-md bg-fd-background hover:bg-fd-muted transition-colors flex items-center gap-2">
                    <TagIcon className="w-4 h-4" />
                    <span>
                      {selectedTags.length === 0
                        ? "标签"
                        : `${selectedTags.length} 个标签`}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                    {availableTags.map((tag: Tag, index) => {
                      const TagIcon = tag.icon
                        ? (LucideIcons as any)[tag.icon] || null
                        : null;
                      const isSelected = selectedTags.includes(tag.name);
                      const isFirst = index === 0;
                      const isLast =
                        index === availableTags.length - 1 &&
                        selectedTags.length === 0;
                      return (
                        <button
                          key={tag.name}
                          onClick={() => toggleTag(tag.name)}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-fd-muted transition-colors flex items-center gap-2 ${
                            isFirst ? "rounded-t-md" : ""
                          } ${isLast ? "rounded-b-md" : ""} ${
                            isSelected ? "bg-fd-primary/10 border-l-2" : ""
                          }`}
                          style={
                            isSelected ? { borderLeftColor: tag.color } : {}
                          }
                        >
                          {isSelected ? (
                            <CheckCircle2
                              className="w-4 h-4 font-bold"
                              style={{ color: tag.color }}
                            />
                          ) : TagIcon ? (
                            <TagIcon
                              className="w-3.5 h-3.5"
                              style={{ color: tag.color }}
                            />
                          ) : (
                            <Circle className="w-3.5 h-3.5 opacity-50" />
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              isSelected ? "font-semibold" : ""
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? tag.color + "30"
                                : tag.color + "20",
                              color: tag.color,
                            }}
                          >
                            {tag.description || tag.name}
                          </span>
                        </button>
                      );
                    })}
                    {selectedTags.length > 0 && (
                      <div className="border-t border-fd-border px-3 py-2 rounded-b-md">
                        <button
                          onClick={() => {
                            setSelectedTags([]);
                            setPage(1);
                          }}
                          className="text-sm cursor-pointer text-fd-muted-foreground hover:text-fd-foreground transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          清除所有标签
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 页面大小选择 */}
              <div className="relative group ml-auto">
                <button className="px-3 py-1.5 text-sm cursor-pointer border border-fd-border rounded-md bg-fd-background hover:bg-fd-muted transition-colors flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>{pageSize}条/页</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg z-10 min-w-[120px]">
                  {[10, 20, 30, 50].map((size, index, array) => {
                    const isFirst = index === 0;
                    const isLast = index === array.length - 1;
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setPageSize(size);
                          setPage(1);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-fd-muted transition-colors flex items-center gap-2 ${
                          isFirst ? "rounded-t-md" : ""
                        } ${isLast ? "rounded-b-md" : ""} ${
                          pageSize === size ? "bg-fd-muted text-fd-primary" : ""
                        }`}
                      >
                        {size}条/页
                        {pageSize === size && (
                          <Check className="w-3.5 h-3.5 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 排序下拉 */}
              <div className="relative group">
                <button className="px-3 py-1.5 text-sm cursor-pointer border border-fd-border rounded-md bg-fd-background hover:bg-fd-muted transition-colors flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <span>
                    {sortBy === "created_at"
                      ? "最新"
                      : sortBy === "reply_count"
                      ? "回复数"
                      : sortBy === "like_count"
                      ? "点赞数"
                      : "关注数"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg z-10 min-w-[140px]">
                  {[
                    { value: "created_at", label: "最新", icon: Clock },
                    {
                      value: "reply_count",
                      label: "回复数",
                      icon: MessageSquare,
                    },
                    { value: "like_count", label: "点赞数", icon: ThumbsUp },
                    { value: "watch_count", label: "关注数", icon: Star },
                  ].map((option, index, array) => {
                    const Icon = option.icon;
                    const isFirst = index === 0;
                    const isLast = index === array.length - 1;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as any)}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-fd-muted transition-colors flex items-center gap-2 ${
                          isFirst ? "rounded-t-md" : ""
                        } ${isLast ? "rounded-b-md" : ""} ${
                          sortBy === option.value
                            ? "bg-fd-muted text-fd-primary"
                            : ""
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {option.label}
                        {sortBy === option.value && (
                          <Check className="w-3.5 h-3.5 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 活动筛选器显示 */}
            {(searchQuery ||
              selectedTags.length > 0 ||
              selectedAuthor ||
              filterMode !== "all") && (
              <div className="flex gap-2 items-center flex-wrap text-sm">
                <span className="text-xs font-medium text-fd-muted-foreground">
                  筛选条件:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 rounded-full text-xs font-medium">
                    <Search className="w-3 h-3" />
                    {searchQuery}
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setPage(1);
                      }}
                      className="ml-0.5 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterMode !== "all" && (
                  <span className="px-2.5 py-1 flex items-center gap-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 rounded-full text-xs font-medium">
                    <Filter className="w-3 h-3" />
                    {filterMode === "closed-only"
                      ? "仅已关闭"
                      : filterMode === "hide-closed"
                      ? "未关闭"
                      : filterMode === "resolved-only"
                      ? "仅已解决"
                      : "未解决"}
                    <button
                      onClick={() => {
                        setFilterMode("all");
                        setPage(1);
                      }}
                      className="hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedAuthor && (
                  <span className="px-2.5 py-1 flex items-center gap-1 bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20 rounded-full text-xs font-medium">
                    <User className="w-3 h-3" />
                    {selectedAuthor}
                    <button
                      onClick={() => {
                        setSelectedAuthor("");
                        setPage(1);
                      }}
                      className="hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedTags.map((tagName) => {
                  const tagInfo = getTagInfo(tagName);
                  return (
                    <span
                      key={tagName}
                      className="px-2.5 py-1 flex items-center gap-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: tagInfo.color + "20",
                        color: tagInfo.color,
                      }}
                    >
                      <IconRenderer
                        iconName={tagInfo.icon || "Tag"}
                        className="w-3 h-3"
                        style={{ color: tagInfo.color }}
                      />
                      {tagInfo.label}
                      <button
                        onClick={() => toggleTag(tagName)}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterMode("all");
                    setSelectedTags([]);
                    setSelectedAuthor("");
                    setPage(1);
                  }}
                  className="text-fd-muted-foreground cursor-pointer hover:text-fd-foreground transition-colors"
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {filteredTopics.map((topic: Topic) => {
              const topicTags = topic.tags ? JSON.parse(topic.tags) : [];
              const isWatched = watchedTopics.has(topic.id);

              return (
                <div
                  key={topic.id}
                  className="group bg-fd-card border border-fd-border rounded-lg hover:border-fd-primary hover:shadow-lg transition-all"
                >
                  <Link href={`/discuss/topics/${topic.id}`} className="block">
                    <div className="p-4">
                      {/* 标签行 */}
                      {(topic.is_pinned === 1 ||
                        topic.closed_at ||
                        topic.is_resolved === 1 ||
                        topicTags.length > 0) && (
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {topic.is_pinned === 1 && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-full font-medium inline-flex items-center gap-1">
                              <Pin className="w-3 h-3" />
                              置顶
                            </span>
                          )}
                          {topic.closed_at && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium inline-flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              已关闭
                            </span>
                          )}
                          {topic.is_resolved === 1 && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 rounded-full font-medium inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              已解决
                            </span>
                          )}
                          {topicTags.map((tagName: string) => {
                            const tagData = availableTags.find(
                              (t) => t.name === tagName
                            );
                            const tagColor = tagData?.color || "#6b7280";
                            const tagLabel = tagData?.description || tagName;
                            const TagIcon = tagData?.icon
                              ? (LucideIcons as any)[tagData.icon] || null
                              : null;
                            return (
                              <button
                                key={tagName}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleTag(tagName);
                                }}
                                className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                                style={{
                                  backgroundColor: tagColor + "20",
                                  color: tagColor,
                                }}
                                title={`点击筛选${tagLabel}`}
                              >
                                {TagIcon && <TagIcon className="w-3 h-3" />}
                                {tagLabel}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 标题、作者信息和关注按钮 */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-fd-foreground mb-1.5 group-hover:text-fd-primary transition-colors line-clamp-2">
                            {topic.title}
                          </h3>

                          <div className="flex items-center gap-3 text-sm text-fd-muted-foreground">
                            <span className="font-medium">
                              {topic.author_name}
                            </span>
                            <span>
                              {new Date(topic.created_at).toLocaleDateString(
                                "zh-CN",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {
                            <DropdownMenu
                              items={[
                                {
                                  label: "编辑主题",
                                  icon: <Edit className="w-4 h-4" />,
                                  show:
                                    session?.user?.id != undefined &&
                                    Number(session.user.id) ===
                                      topic.created_by,
                                  onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(
                                      `/discuss/topics/${topic.id}/edit`
                                    );
                                  },
                                },
                                {
                                  label:
                                    topic.is_pinned === 1
                                      ? "取消置顶"
                                      : "置顶主题",
                                  icon: <Pin className="w-4 h-4" />,
                                  onClick: (e) =>
                                    togglePin(topic.id, topic.is_pinned, e),
                                  show: isAdmin(),
                                  className:
                                    topic.is_pinned === 1
                                      ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                      : "",
                                },
                              ]}
                            />
                          }
                          {session && (
                            <button
                              onClick={(e) => toggleWatch(topic.id, e)}
                              disabled={!session}
                              className={`p-1.5 rounded-md text-sm cursor-pointer flex items-center gap-1 ${
                                isWatched
                                  ? "text-fd-primary"
                                  : "text-fd-muted-foreground hover:text-fd-foreground"
                              } transition-colors disabled:opacity-50`}
                              title={isWatched ? "取消关注" : "关注"}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  isWatched ? "fill-current" : ""
                                }`}
                              />
                              <span className="text-xs font-medium">
                                {topic.watch_count || 0}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 统计信息栏 */}
                      <div className="flex items-center gap-4 text-sm text-fd-muted-foreground pt-2 border-t border-fd-border/50">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MessageCircle className="w-4 h-4 text-fd-primary" />
                          <span className="text-fd-foreground">
                            {topic.reply_count}
                          </span>
                          <span className="hidden sm:inline">回复</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span className="text-fd-foreground">
                            {topic.view_count}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-fd-foreground">
                            {topic.like_count}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {filteredTopics.length === 0 && topics.length > 0 && (
            <div className="text-center py-12 text-fd-muted-foreground">
              没有符合筛选条件的主题
            </div>
          )}

          {topics.length === 0 &&
            (canPostDiscuss() ? (
              <div className="text-center py-12 text-fd-muted-foreground">
                还没有主题，
                {session ? (
                  <Link
                    href={`/discuss/boards/${boardId}/new`}
                    className="text-fd-primary hover:underline cursor-pointer"
                  >
                    来发布第一个吧！
                  </Link>
                ) : (
                  "登录后可以发布主题"
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-fd-muted-foreground">
                暂无主题
              </div>
            ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-fd-secondary cursor-pointer text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-4 py-2 text-fd-foreground">
                {page} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p: number) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-fd-secondary cursor-pointer text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
