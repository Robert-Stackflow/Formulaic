"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingContent } from "@/components/loading";
import { PageLayout } from "@/components/page-layout";
import MarkdownEditor from "@/components/markdown-editor";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Check, Loader2, Save, ArrowLeft } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api-client";
import LoadingButton from "@/components/loading-button";

interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  icon: string | null;
}

export default function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topicId, setTopicId] = useState<string>("");
  const [topic, setTopic] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
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
      setTopicId(p.id);
      fetchTopic(p.id);
    });
  }, []);

  const fetchTags = async () => {
    const result = await apiGet("/api/admin/discussion-tags");
    if (result.success && result.data) {
      setAvailableTags(result.data.tags);
    }
  };

  const fetchTopic = async (id: string) => {
    const result = await apiGet(`/api/discussion/topics/${id}`);
    if (result.success && result.data) {
      const topicData = result.data.topic;
      setTopic(topicData);
      setTitle(topicData.title);
      setContent(topicData.content);

      // 解析标签
      if (topicData.tags) {
        try {
          const tags = JSON.parse(topicData.tags);
          setSelectedTags(Array.isArray(tags) ? tags : []);
        } catch {
          setSelectedTags([]);
        }
      }

      // 检查是否是作者
      if (topicData.author_email !== session?.user?.email) {
        setError("只有主题作者可以编辑");
      }
    } else {
      setError("加载主题失败");
    }
    setLoading(false);
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
      `/api/discussion/topics/${topicId}/edit`,
      {
        title,
        content,
        tags: JSON.stringify(selectedTags),
      },
      {
        showSuccessToast: true,
        successMessage: "主题更新成功",
      }
    );

    if (result.success) {
      router.push(`/discuss/topics/${topicId}`);
    } else {
      setError(result.error || "更新失败");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout maxWidth="2xl">
        <LoadingContent message="加载主题..." />
      </PageLayout>
    );
  }

  if (error && !topic) {
    return (
      <PageLayout maxWidth="2xl">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-fd-primary cursor-pointer hover:underline"
          >
            返回
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="2xl">
      <Link
        href={`/discuss/topics/${topicId}`}
        className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>返回主题</span>
      </Link>

      <div className="bg-fd-card border border-fd-border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">编辑主题</h1>

        <form onSubmit={handleSubmit}>
          {/* 标题 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-fd-background border border-fd-border rounded-md focus:outline-none focus:ring-2 focus:ring-fd-primary text-fd-foreground"
              placeholder="输入主题标题..."
              required
            />
          </div>

          {/* 标签选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">标签</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const TagIcon = tag.icon
                  ? (LucideIcons as any)[tag.icon] || null
                  : null;
                const isSelected = selectedTags.includes(tag.name);

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-offset-2"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? tag.color + "30"
                        : tag.color + "15",
                      color: tag.color,
                    }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {TagIcon && <TagIcon className="w-3.5 h-3.5" />}
                    {tag.description}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 内容 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              内容 <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="输入主题内容，支持 Markdown 格式..."
              minHeight="400px"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="px-6 py-2 rounded-md cursor-pointer text-sm bg-fd-secondary text-fd-secondary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              取消
            </button>
            <LoadingButton
              type="submit"
              loading={submitting}
              disabled={submitting || !title.trim() || !content.trim()}
              loadingText={"保存中..."}
              normalText={"保存修改"}
              iconName={"Save"}
            />
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
