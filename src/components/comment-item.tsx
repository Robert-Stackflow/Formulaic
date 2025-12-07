"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { apiGet, apiPost } from "@/lib/api-client";

interface Comment {
  id: number;
  user_id: number;
  username: string;
  avatar: string | null;
  content: string;
  like_count: number;
  reply_count: number;
  created_at: string;
}

interface Reply {
  id: number;
  user_id: number;
  username: string;
  avatar: string | null;
  content: string;
  like_count: number;
  created_at: string;
}

interface CommentItemProps {
  comment: Comment;
  onUpdate: () => void;
}

export default function CommentItem({ comment, onUpdate }: CommentItemProps) {
  const { data: session } = useSession();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [liked, setLiked] = useState(false);

  const fetchReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    const result = await apiGet(`/api/comments/${comment.id}/replies`);
    if (result.success && result.data) {
      setReplies(result.data.replies);
      setShowReplies(true);
    }
  };

  const submitReply = async () => {
    if (!replyContent.trim()) return;

    const result = await apiPost(
      "/api/comments",
      {
        content: replyContent,
        parentId: comment.id,
      },
      {
        showSuccessToast: true,
        successMessage: "回复成功",
      }
    );

    if (result.success) {
      setReplyContent("");
      setShowReplyInput(false);
      fetchReplies();
      onUpdate();
    }
  };

  const toggleLike = async () => {
    if (!session) return;

    const result = await apiPost(`/api/comments/${comment.id}/like`, {});

    if (result.success) {
      setLiked(!liked);
      onUpdate();
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: zhCN,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {comment.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{comment.username}</span>
            <span className="text-sm text-gray-500">
              {formatTime(comment.created_at)}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={toggleLike}
              disabled={!session}
              className={`flex items-center gap-1 hover:text-blue-600 ${
                liked ? "text-blue-600" : "text-gray-500"
              } disabled:cursor-not-allowed`}
            >
              ❤️ {comment.like_count}
            </button>
            {session && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-gray-500 hover:text-blue-600"
              >
                💬 回复
              </button>
            )}
            {comment.reply_count > 0 && (
              <button
                onClick={fetchReplies}
                className="text-gray-500 hover:text-blue-600"
              >
                {showReplies ? "隐藏" : "查看"} {comment.reply_count} 条回复
              </button>
            )}
          </div>

          {/* 回复输入框 */}
          {showReplyInput && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="写下你的回复..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitReply}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  发送
                </button>
                <button
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyContent("");
                  }}
                  className="px-4 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 回复列表 */}
          {showReplies && replies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {reply.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {reply.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(reply.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
