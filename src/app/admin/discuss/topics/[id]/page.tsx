"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isAuthor } from "@/hooks/use-auth";
import { LoadingContent } from "@/components/loading";
import { PageLayout } from "@/components/page-layout";
import MarkdownEditor from "@/components/markdown-editor";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Dialog } from "@/components/dialog";
import {
  TopicTitle,
  ContentItem,
  EmptyReplies,
} from "@/components/discussion/topic-timeline";
import Link from "next/link";
import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import {
  Send,
  Loader2,
  Lock,
  LockOpen,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { set } from "zod";

export default function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [topicId, setTopicId] = useState<string>("");
  const [topic, setTopic] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [userLiked, setUserLiked] = useState(false);
  const [userWatching, setUserWatching] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyToName, setReplyToName] = useState("");
  const [replyToContent, setReplyToContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [closingTopic, setClosingTopic] = useState(false);
  const [reopeningTopic, setReopeningTopic] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [deleteReplyId, setDeleteReplyId] = useState<number | null>(null);
  const [deleteTopicDialogOpen, setDeleteTopicDialogOpen] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(false);
  const [deletingReply, setDeletingReply] = useState(false);
  const [submittingReplyEdit, setSubmittingReplyEdit] = useState(false);
  const [availableTags, setAvailableTags] = useState<
    Array<{
      id: number;
      name: string;
      color: string;
      description: string;
      icon: string | null;
    }>
  >([]);

  useEffect(() => {
    fetchTags();
    params.then((p) => {
      setTopicId(p.id);
      fetchTopic(p.id);
      fetchUserLikeStatus(p.id);
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
      setTopic(result.data.topic);

      // 排序回复：答案置顶
      const sortedReplies = [...result.data.replies].sort((a, b) => {
        if (a.is_answer && !b.is_answer) return -1;
        if (!a.is_answer && b.is_answer) return 1;
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      setReplies(sortedReplies);
      setUserWatching(result.data.userWatching);

      // 设置已点赞的回复
      if (result.data.likedReplies) {
        setLikedReplies(new Set(result.data.likedReplies));
      }

      if (result.data.topic?.title) {
        document.title = `${result.data.topic.title} - 讨论区 - Formulaic`;
      }
    } else {
      setError("加载主题失败");
    }
    setLoading(false);
  };

  const fetchUserLikeStatus = async (id: string) => {
    if (!session) return;
    const result = await apiGet(`/api/discussion/likes?topic_id=${id}`);
    if (result.success && result.data) {
      setUserLiked(result.data.liked);
    }
  };

  const handleLike = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    const result = await apiPost("/api/discussion/likes", {
      topic_id: topicId,
    });
    if (result.success && result.data) {
      setUserLiked(result.data.liked);
      setTopic((prev: any) => ({
        ...prev,
        like_count: prev.like_count + (result.data.liked ? 1 : -1),
      }));
    }
  };

  const handleWatch = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    const result = await apiPost("/api/discussion/watches", {
      topic_id: topicId,
    });
    if (result.success && result.data) {
      setUserWatching(result.data.watching);
      setTopic((prev: any) => ({
        ...prev,
        watch_count: prev.watch_count + (result.data.watching ? 1 : -1),
      }));
    }
  };

  const toggleReplyLike = async (replyId: number) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    const result = await apiPost("/api/discussion/likes", {
      reply_id: replyId,
    });
    if (result.success && result.data) {
      const newLikedReplies = new Set(likedReplies);
      if (result.data.liked) {
        newLikedReplies.add(replyId);
      } else {
        newLikedReplies.delete(replyId);
      }
      setLikedReplies(newLikedReplies);

      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId
            ? { ...r, like_count: r.like_count + (result.data.liked ? 1 : -1) }
            : r
        )
      );
    }
  };

  const closeTopic = async () => {
    if (!session || !topic) return;

    setCloseDialogOpen(false);
    setClosingTopic(true);

    const result = await apiPost(
      `/api/discussion/topics/${topicId}/close`,
      {},
      {
        showSuccessToast: true,
        successMessage: "主题已关闭",
      }
    );
    if (result.success) {
      await fetchTopic(topicId);
    }
    setClosingTopic(false);
  };

  const reopenTopic = async () => {
    if (!session || !topic) return;

    setReopenDialogOpen(false);
    setReopeningTopic(true);
    const result = await apiPost(
      `/api/discussion/topics/${topicId}/reopen`,
      {},
      {
        showSuccessToast: true,
        successMessage: "主题已重新打开",
      }
    );
    if (result.success) {
      await fetchTopic(topicId);
    }
    setReopeningTopic(false);
  };

  const markAsAnswer = async (replyId: number) => {
    if (!session || !topic) return;

    const result = await apiPost(
      `/api/discussion/replies/${replyId}/answer`,
      {},
      {
        showSuccessToast: true,
        successMessage: "已标记为答案",
      }
    );
    if (result.success) {
      fetchTopic(topicId);
    }
  };

  const handleEditReply = (replyId: number, content: string) => {
    setEditingReplyId(replyId);
    setEditingReplyContent(content);
    setTimeout(() => {
      document
        .getElementById(`edit-reply-${replyId}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSaveEditReply = async (replyId: number) => {
    if (!editingReplyContent.trim() || !session) return;

    setSubmittingReplyEdit(true);
    const result = await apiPost(
      `/api/discussion/replies/${replyId}/edit`,
      { content: editingReplyContent },
      {
        showSuccessToast: true,
        successMessage: "回复编辑成功",
      }
    );
    setSubmittingReplyEdit(false);

    if (result.success) {
      setEditingReplyId(null);
      setEditingReplyContent("");
      fetchTopic(topicId);
    }
  };

  const handleDeleteReply = (replyId: number) => {
    setDeleteReplyId(replyId);
  };

  const confirmDeleteReply = async () => {
    if (!deleteReplyId || !session) return;

    setDeletingReply(true);

    const result = await apiPost(
      `/api/discussion/replies/${deleteReplyId}/delete`,
      {},
      {
        showSuccessToast: true,
        successMessage: "回复已删除",
      }
    );

    setDeletingReply(false);

    if (result.success) {
      setDeleteReplyId(null);
      fetchTopic(topicId);
    }
  };

  const handleEditTopic = () => {
    router.push(`/discuss/topics/${topicId}/edit`);
  };

  const deleteTopic = async () => {
    if (!session || !topic) return;

    setDeletingTopic(true);

    const result = await apiDelete(`/api/discussion/topics/${topicId}`, {
      showSuccessToast: true,
      successMessage: "主题已删除",
    });
    setDeletingTopic(false);
    if (result.success) {
      setDeleteTopicDialogOpen(false);
      router.push(`/discuss/boards/${topic.board_id}`);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !session) return;

    setSubmitting(true);
    setError("");

    const result = await apiPost(
      "/api/discussion/replies",
      {
        topic_id: topicId,
        content: replyContent,
        parent_id: replyToId,
      },
      {
        showSuccessToast: true,
        successMessage: "回复发布成功",
      }
    );

    if (result.success) {
      setReplyContent("");
      setReplyToId(null);
      setReplyToName("");
      setReplyToContent("");
      fetchTopic(topicId);
    } else {
      setError("发布回复失败");
    }

    setSubmitting(false);
  };

  const isTopicAuthor = isAuthor(session?.user?.id, topic?.created_by);

  return (
    <PageLayout maxWidth="2xl">
      {loading ? (
        <LoadingContent message="加载主题..." />
      ) : error || !topic ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error || "主题不存在"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-fd-primary cursor-pointer hover:underline"
          >
            返回
          </button>
        </div>
      ) : (
        <>
          <Link
            href={`/discuss/boards/${topic.board_id}`}
            className="inline-flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>返回 {topic.board_name}</span>
          </Link>

          {/* GitHub Issue 风格的主题和回复 */}
          <div className="space-y-0">
            {/* 标题和标签 */}
            <TopicTitle
              topic={topic}
              availableTags={availableTags}
              isAuthor={isTopicAuthor}
              session={session}
              userWatching={userWatching}
              onEdit={handleEditTopic}
              onWatch={handleWatch}
              onDelete={() => setDeleteTopicDialogOpen(true)}
            />

            {/* 主题内容 */}
            <ContentItem
              item={topic}
              type="topic"
              replies={replies}
              session={session}
              isAuthor={isTopicAuthor}
              userLiked={userLiked}
              onLikeTopic={handleLike}
              MarkdownRenderer={MarkdownRenderer}
            />

            {/* 回复列表 */}
            {replies.length > 0 ? (
              <>
                {replies.map((reply, index) => {
                  const parentReply = reply.parent_id
                    ? replies.find((r: any) => r.id === reply.parent_id)
                    : null;
                  const isReplyAuthor = isAuthor(
                    session?.user?.id,
                    reply.created_by
                  );

                  return (
                    <React.Fragment key={reply.id}>
                      {editingReplyId === reply.id ? (
                        <div className="flex gap-4 mb-6">
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-fd-primary text-fd-primary-foreground flex items-center justify-center font-bold text-lg ring-2 ring-fd-background shadow-md">
                              {reply.author_name[0].toUpperCase()}
                            </div>
                            {index < replies.length - 1 && (
                              <div
                                className="w-0.5 flex-1 bg-fd-border my-2"
                                style={{ minHeight: "20px" }}
                              />
                            )}
                          </div>
                          <div
                            id={`edit-reply-${reply.id}`}
                            className="flex-1 min-w-0 bg-fd-card border border-fd-border rounded-lg p-6"
                          >
                            <h3 className="text-lg font-semibold mb-4 text-fd-foreground">
                              编辑回复
                            </h3>
                            <MarkdownEditor
                              value={editingReplyContent}
                              onChange={setEditingReplyContent}
                              placeholder="编辑你的回复..."
                              minHeight="200px"
                            />
                            <div className="flex gap-3 mt-4">
                              <LoadingButton
                                onClick={() => handleSaveEditReply(reply.id)}
                                loading={submittingReplyEdit}
                                disabled={
                                  submittingReplyEdit ||
                                  !editingReplyContent.trim()
                                }
                                loadingText={"保存中..."}
                                normalText={"保存修改"}
                                iconName={"Save"}
                              />
                              <button
                                onClick={() => {
                                  setEditingReplyId(null);
                                  setEditingReplyContent("");
                                }}
                                disabled={submittingReplyEdit}
                                className="px-4 py-2 bg-fd-secondary text-fd-secondary-foreground rounded-md hover:bg-fd-muted transition-colors cursor-pointer"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ContentItem
                          item={reply}
                          type="reply"
                          topic={topic}
                          parentReply={parentReply}
                          index={index}
                          replies={replies}
                          session={session}
                          likedReplies={likedReplies}
                          isAuthor={isTopicAuthor}
                          isReplyAuthor={isReplyAuthor}
                          onReply={(replyId, authorName, content) => {
                            setReplyToId(replyId);
                            setReplyToName(authorName);
                            setReplyToContent(content);
                            document
                              .getElementById("reply-editor")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          onLikeReply={toggleReplyLike}
                          onMarkAsAnswer={markAsAnswer}
                          onEditReply={handleEditReply}
                          onDeleteReply={handleDeleteReply}
                          MarkdownRenderer={MarkdownRenderer}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <EmptyReplies />
            )}

            {/* 回复表单 */}
            {!topic.closed_at && session && (
              <form
                id="reply-editor"
                onSubmit={handleReply}
                className="bg-fd-card border border-fd-border rounded-lg p-6 mt-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-fd-foreground">
                  {replyToId ? `回复 ${replyToName}` : "发布回复"}
                </h3>
                {replyToId && replyToContent && (
                  <div className="mb-3 border-l-2 border-blue-500 pl-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        回复 {replyToName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyToId(null);
                          setReplyToName("");
                          setReplyToContent("");
                        }}
                        className="text-sm cursor-pointer text-fd-muted-foreground hover:text-fd-foreground"
                      >
                        取消
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto text-xs text-fd-muted-foreground">
                      <MarkdownRenderer content={replyToContent} />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}
                <MarkdownEditor
                  value={replyContent}
                  onChange={setReplyContent}
                  placeholder="输入你的回复，支持 Markdown 格式..."
                  minHeight="150px"
                />
                <div className="flex gap-3 mt-4 items-center justify-end">
                  {isTopicAuthor && (
                    <LoadingButton
                      type="button"
                      loading={closingTopic}
                      onClick={() => setCloseDialogOpen(true)}
                      loadingText={"关闭中..."}
                      normalText={"关闭主题"}
                      iconName={"Lock"}
                      className="bg-orange-500 hover:bg-orange-600"
                    />
                  )}
                  <LoadingButton
                    type="submit"
                    loading={submitting}
                    disabled={submitting || !replyContent.trim()}
                    loadingText={"发送中..."}
                    normalText={"发布回复"}
                    iconName={"Send"}
                  />
                </div>
              </form>
            )}

            {!topic.closed_at && !session && (
              <div className="bg-fd-card border border-fd-border rounded-lg p-6 text-center mt-6">
                <p className="text-fd-muted-foreground mb-3">
                  请先登录后再发布回复
                </p>
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="px-6 py-2 cursor-pointer bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90"
                >
                  登录
                </button>
              </div>
            )}

            {topic.closed_at && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-orange-700 dark:text-orange-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    此主题已关闭，不能再发布回复
                  </p>
                  {isTopicAuthor && (
                    <LoadingButton
                      type="button"
                      loading={reopeningTopic}
                      onClick={() => setReopenDialogOpen(true)}
                      loadingText={"重新打开中..."}
                      normalText={"重新打开"}
                      iconName={"LockOpen"}
                      className="bg-blue-500 hover:bg-blue-600"
                    />
                  )}
                </div>
              </div>
            )}

            {/* 关闭主题确认Dialog */}
            <Dialog
              isOpen={closeDialogOpen}
              onClose={() => setCloseDialogOpen(false)}
              onConfirm={closeTopic}
              title="关闭主题"
              description="确定要关闭这个主题吗？关闭后将不能再发布回复。"
              confirmText="关闭"
              cancelText="取消"
              type="warning"
            />

            {/* 重新打开主题确认Dialog */}
            <Dialog
              isOpen={reopenDialogOpen}
              onClose={() => setReopenDialogOpen(false)}
              onConfirm={reopenTopic}
              title="重新打开主题"
              description="确定要重新打开这个主题吗？重新打开后可以继续接收回复。"
              confirmText="重新打开"
              cancelText="取消"
              type="info"
            />

            {/* 删除回复确认Dialog */}
            <Dialog
              isOpen={!!deleteReplyId}
              onClose={() => setDeleteReplyId(null)}
              onConfirm={confirmDeleteReply}
              loading={deletingReply}
              title="删除回复"
              description="确定要删除这条回复吗？删除后无法恢复。"
              confirmText="删除"
              loadingText="删除中..."
              cancelText="取消"
              type="danger"
            />

            {/* 删除主题确认Dialog */}
            <Dialog
              isOpen={deleteTopicDialogOpen}
              onClose={() => setDeleteTopicDialogOpen(false)}
              onConfirm={deleteTopic}
              loading={deletingTopic}
              title="删除主题"
              description="确定要删除这个主题吗？删除后所有相关的回复、关注和点赞也将被删除，此操作无法恢复。"
              confirmText="删除"
              loadingText="删除中..."
              cancelText="取消"
              type="danger"
            />
          </div>
        </>
      )}
    </PageLayout>
  );
}
