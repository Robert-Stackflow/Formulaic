"use client";

import {
  MessageCircle,
  ThumbsUp,
  Star,
  Lock,
  Pin,
  CheckCircle2,
  MoreVertical,
  Award,
  X as XIcon,
  Edit,
} from "lucide-react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Avatar } from "@/components/avatar";
import { DropdownMenu } from "@/components/dropdown-menu";

interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  icon: string | null;
}

// 主题标题和标签组件
interface TopicTitleProps {
  topic: any;
  availableTags: Tag[];
  isAuthor: boolean;
  session: any;
  userWatching: boolean;
  onEdit: () => void;
  onWatch: () => void;
  onDelete?: () => void;
}

export function TopicTitle({
  topic,
  availableTags,
  isAuthor,
  session,
  userWatching,
  onEdit,
  onWatch,
  onDelete,
}: TopicTitleProps) {
  const tags = topic?.tags ? JSON.parse(topic.tags) : [];

  return (
    <div className="bg-fd-card border border-fd-border rounded-lg p-6 mb-4">
      {/* 标签和状态 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tagName: string) => {
          const tagData = availableTags.find((t) => t.name === tagName);
          const tagColor = tagData?.color || "#6b7280";
          const tagLabel = tagData?.description || tagName;
          const TagIcon = tagData?.icon
            ? (LucideIcons as any)[tagData.icon] || null
            : null;
          return (
            <span
              key={tagName}
              className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
              style={{
                backgroundColor: tagColor + "20",
                color: tagColor,
              }}
            >
              {TagIcon && <TagIcon className="w-3 h-3" />}
              {tagLabel}
            </span>
          );
        })}
        {topic.is_pinned === 1 && (
          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded inline-flex items-center gap-1">
            <Pin className="w-3 h-3" />
            置顶
          </span>
        )}
        {topic.is_resolved === 1 && (
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            已解决
          </span>
        )}
        {topic.closed_at && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded inline-flex items-center gap-1">
            <Lock className="w-3 h-3" />
            已关闭
          </span>
        )}
      </div>

      {/* 标题和操作按钮 */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-fd-foreground flex-1">
          {topic.title}
        </h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 关注按钮 */}
          <button
            onClick={onWatch}
            disabled={!session}
            className={`px-4 py-2 rounded-md text-sm cursor-pointer font-medium flex items-center gap-2 ${
              userWatching
                ? "bg-fd-primary text-fd-primary-foreground"
                : "bg-fd-secondary text-fd-secondary-foreground"
            } hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50`}
          >
            <Star className={`w-4 h-4 ${userWatching ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">
              {userWatching ? "已关注" : "关注"}
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-fd-background/50 text-xs font-semibold">
              {topic.watch_count || 0}
            </span>
          </button>

          {/* 更多按钮 */}
          {isAuthor && session && (
            <DropdownMenu
              items={[
                {
                  label: "编辑主题",
                  icon: <Edit className="w-4 h-4" />,
                  onClick: () => onEdit(),
                },
                {
                  label: "删除主题",
                  icon: <XIcon className="w-4 h-4" />,
                  onClick: () => onDelete?.(),
                  show: !!onDelete,
                  className:
                    "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20",
                },
              ]}
              buttonClassName=""
              menuClassName="min-w-[140px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 通用内容项组件（用于主题内容和回复）
interface ContentItemProps {
  item: any;
  type: "topic" | "reply";
  MarkdownRenderer: React.ComponentType<{
    content: string;
    className?: string;
  }>;
  // 主题和回复通用
  session?: any;
  // 主题特有
  userLiked?: boolean;
  onLikeTopic?: () => void;
  // 回复特有
  topic?: any;
  parentReply?: any;
  index?: number;
  replies?: any[];
  likedReplies?: Set<number>;
  isAuthor?: boolean;
  isReplyAuthor?: boolean;
  onReply?: (replyId: number, authorName: string, content: string) => void;
  onLikeReply?: (replyId: number) => void;
  onMarkAsAnswer?: (replyId: number) => void;
  onEditReply?: (replyId: number, content: string) => void;
  onDeleteReply?: (replyId: number) => void;
}

export function ContentItem({
  item,
  type,
  MarkdownRenderer,
  session,
  userLiked = false,
  onLikeTopic,
  topic,
  parentReply,
  index = 0,
  replies = [],
  likedReplies = new Set(),
  isAuthor = false,
  isReplyAuthor = false,
  onReply,
  onLikeReply,
  onMarkAsAnswer,
  onEditReply,
  onDeleteReply,
}: ContentItemProps) {
  const isTopic = type === "topic";
  const reply = !isTopic ? item : null;

  return (
    <div className="flex gap-4 mb-6">
      {/* 用户头像 */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <Avatar name={item.author_name} size="md" />
        {/* 连接线 - 仅回复显示 */}
        {((isTopic && replies.length > 0) || index < replies.length - 1) && (
          <div
            className="w-0.5 flex-1 bg-fd-border my-2"
            style={{ minHeight: "20px" }}
          />
        )}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        {/* 日期标记 - 仅回复显示 */}
        {!isTopic &&
          reply &&
          (index === 0 ||
            new Date(reply.created_at).toLocaleDateString() !==
              new Date(replies[index - 1].created_at).toLocaleDateString()) && (
            <div className="mb-3 flex items-center gap-2">
              <div className="text-xs font-medium text-fd-muted-foreground bg-fd-muted px-3 py-1 rounded-full">
                {new Date(reply.created_at).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="h-px flex-1 bg-fd-border" />
            </div>
          )}

        <div
          className={`relative bg-fd-card border rounded-lg p-6 transition-all ${
            reply?.is_answer
              ? "border-green-500/50 ring-2 ring-green-500/20 hover:border-fd-primary"
              : "border-fd-border hover:border-fd-primary"
          }`}
        >
          {/* 最佳答案标记 - 仅回复显示 */}
          {!isTopic && reply?.is_answer === 1 && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-400 z-20" />
                <div className="relative bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 px-3 py-2 rounded-sm shadow-lg transform rotate-3">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_52%)] bg-[length:3px_3px] rounded-sm" />
                  <div className="relative flex items-center gap-1.5">
                    <span className="text-xs font-bold text-green-800 dark:text-green-300 whitespace-nowrap">
                      最佳答案
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/5 blur-sm transform translate-y-1 -z-10" />
              </div>
            </div>
          )}

          {/* 作者信息和时间 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium text-fd-foreground">
              {item.author_name}
            </span>
            {!isTopic &&
              reply &&
              topic &&
              reply.created_by === topic.created_by && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-fd-primary/10 text-fd-primary border border-fd-primary/20 font-medium">
                  楼主
                </span>
              )}
            <span className="text-sm text-fd-muted-foreground">
              {new Date(item.created_at).toLocaleString("zh-CN")}
            </span>
            {item.updated_at && item.updated_at !== item.created_at && (
              <span className="text-xs text-fd-muted-foreground">
                (编辑于 {new Date(item.updated_at).toLocaleString("zh-CN")})
              </span>
            )}
          </div>

          {/* 被回复的内容 - 仅回复显示 */}
          {!isTopic && parentReply && (
            <div className="mb-2 pl-3 border-l-2 border-fd-border bg-fd-secondary/30 p-2 rounded">
              <div className="text-xs text-fd-muted-foreground mb-1 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                回复{" "}
                <span className="font-medium">{parentReply.author_name}</span>
              </div>
              <div className="text-xs text-fd-muted-foreground max-h-32 overflow-y-auto">
                <MarkdownRenderer
                  content={parentReply.content}
                  className="prose-sm"
                />
              </div>
            </div>
          )}

          {/* 内容 */}
          <MarkdownRenderer content={item.content} />

          {/* 操作按钮 */}
          <div className="flex justify-between items-center pt-4 border-t border-fd-border mt-4">
            <div className="flex gap-3">
              {/* 点赞按钮 - topic 和 reply 都显示 */}
              <button
                onClick={() => {
                  if (isTopic) {
                    onLikeTopic?.();
                  } else {
                    onLikeReply?.(reply!.id);
                  }
                }}
                disabled={!session}
                className={`text-sm flex items-center gap-1 ${
                  (isTopic && userLiked) ||
                  (!isTopic && reply && likedReplies.has(reply.id))
                    ? "text-pink-600 dark:text-pink-500"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                } transition-colors disabled:opacity-50 cursor-pointer`}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 ${
                    (isTopic && userLiked) ||
                    (!isTopic && reply && likedReplies.has(reply.id))
                      ? "fill-current"
                      : ""
                  }`}
                />
                {item.like_count || 0}
              </button>

              {/* 回复按钮 - 仅回复显示 */}
              {!isTopic && session && onReply && reply && (
                <button
                  onClick={() =>
                    onReply(reply.id, reply.author_name, reply.content)
                  }
                  className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  回复
                </button>
              )}

              {/* 回复数 - 仅 topic 显示 */}
              {isTopic && (
                <span className="text-sm text-fd-muted-foreground flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {item.reply_count} 回复
                </span>
              )}
            </div>

            {/* 更多菜单 - 仅回复显示 */}
            {!isTopic && reply && session && (isAuthor || isReplyAuthor) && (
              <DropdownMenu
                items={[
                  {
                    label: "编辑回复",
                    icon: <Edit className="w-3.5 h-3.5" />,
                    onClick: () => onEditReply?.(reply.id, reply.content),
                    show: isReplyAuthor && !!onEditReply,
                  },
                  {
                    label:
                      reply.is_answer !== 1 ? "标记为答案" : "取消标记为答案",
                    icon:
                      reply.is_answer !== 1 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <XIcon className="w-3.5 h-3.5 text-orange-600" />
                      ),
                    onClick: () => onMarkAsAnswer?.(reply.id),
                    show: isAuthor && !!onMarkAsAnswer,
                  },
                  {
                    label: "删除回复",
                    icon: <XIcon className="w-3.5 h-3.5" />,
                    onClick: () => onDeleteReply?.(reply.id),
                    show: isReplyAuthor && !!onDeleteReply,
                    className:
                      "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20",
                  },
                ]}
                buttonClassName="p-1"
                menuClassName="min-w-[160px]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 兼容旧名称
export const TopicHeader = ContentItem;

// 兼容旧名称
export const ReplyItem = ContentItem;

interface EmptyRepliesProps {}

export function EmptyReplies({}: EmptyRepliesProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex flex-col items-center gap-3 px-6 py-8 bg-fd-muted/30 rounded-lg border border-dashed border-fd-border">
        <MessageCircle className="w-8 h-8 text-fd-muted-foreground opacity-50" />
        <p className="text-fd-muted-foreground">还没有回复，来发布第一条吧！</p>
      </div>
    </div>
  );
}
