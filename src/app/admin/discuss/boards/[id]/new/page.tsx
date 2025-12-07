"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingContent } from "@/components/loading";
import { PageLayout } from "@/components/page-layout";
import MarkdownEditor from "@/components/markdown-editor";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Check, Loader2, Send, ArrowLeft } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api-client";
import LoadingButton from "@/components/loading-button";

interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  icon: string | null;
}

export default function NewTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boardId, setBoardId] = useState<string>("");
  const [board, setBoard] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    fetchTags();
    params.then((p) => {
      setBoardId(p.id);
      fetchBoard(p.id);
    });
  }, []);

  const fetchTags = async () => {
    const result = await apiGet("/api/admin/discussion-tags");
    if (result.success && result.data) {
      setAvailableTags(result.data.tags);
    }
  };

  const fetchBoard = async (id: string) => {
    const result = await apiGet(`/api/discussion/boards/${id}`);
    if (result.success && result.data) {
      setBoard(result.data.board);
    }
  };

  const toggleTag = (tagValue: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagValue)
        ? prev.filter((t) => t !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("标题和内容不能为空");
      return;
    }

    setSubmitting(true);
    setError("");

    const result = await apiPost(
      "/api/discussion/topics",
      {
        board_id: boardId,
        title,
        content,
        tags: JSON.stringify(selectedTags),
      },
      {
        showSuccessToast: true,
        successMessage: "主题发布成功",
      }
    );

    if (result.success && result.data) {
      router.push(`/discuss/topics/${result.data.topic.id}`);
    } else {
      setError("发布失败");
    }

    setSubmitting(false);
  };

  if (status === "loading" || !board) {
    return (
      <PageLayout maxWidth="2xl">
        <LoadingContent message="加载中..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="2xl">
      <Link
        href={`/discuss/boards/${boardId}`}
        className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>返回 {board.name}</span>
      </Link>

      <div className="bg-fd-card border border-fd-border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-fd-foreground">
          发起新主题
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-fd-foreground">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入主题标题"
              className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-fd-foreground">
              标签（可多选）
            </label>
            <div className="flex flex-wrap gap-4">
              {availableTags.map((tag: Tag) => {
                const TagIcon = tag.icon
                  ? (LucideIcons as any)[tag.icon] || null
                  : null;
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1.5 rounded cursor-pointer text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedTags.includes(tag.name)
                        ? "ring-2 ring-offset-2"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                      borderColor: selectedTags.includes(tag.name)
                        ? tag.color
                        : "transparent",
                    }}
                  >
                    {selectedTags.includes(tag.name) ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : TagIcon ? (
                      <TagIcon className="w-3.5 h-3.5" />
                    ) : null}
                    {tag.description || tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-fd-foreground">
              内容 <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="请详细描述你的主题内容...支持 Markdown 格式"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Link
              href={`/discuss/boards/${boardId}`}
              className="px-6 py-2 bg-fd-secondary cursor-pointer text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </Link>
            <LoadingButton
              type="submit"
              disabled={title.trim() === "" || content.trim() === ""}
              loading={submitting}
              loadingText={"发布中..."}
              normalText={"发布主题"}
              iconName={"Send"}
            />
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
