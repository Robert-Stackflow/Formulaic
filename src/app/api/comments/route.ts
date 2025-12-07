import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { containsSensitiveWords } from "@/lib/validation";
import { sendPushPlusNotification } from "@/lib/notification";

// 获取所有评论
export async function GET(request: NextRequest) {
  // 检查查看权限
  const permCheck = await requirePermission("can_view_discuss");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error },
      { status: permCheck.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // 获取评论（只获取顶级评论）
    const db = getDb();
    const comments = db
      .prepare(
        `
      SELECT 
        c.*,
        u.username,
        u.avatar,
        (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.parent_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `
      )
      .all(limit, offset);

    // 获取总数
    const total = db
      .prepare("SELECT COUNT(*) as count FROM comments WHERE parent_id IS NULL")
      .get() as any;

    return NextResponse.json({
      comments,
      total: total.count,
      page,
      totalPages: Math.ceil(total.count / limit),
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 创建新评论
export async function POST(request: NextRequest) {
  // 检查发帖权限
  const permCheck = await requirePermission("can_post_discuss");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error },
      { status: permCheck.status }
    );
  }

  try {
    const { content, parentId } = await request.json();
    const userId = permCheck.session.user.id;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    // 获取敏感词列表
    const db = getDb();
    const sensitiveWords = db
      .prepare("SELECT word, type, is_regex FROM sensitive_words")
      .all() as Array<{ word: string; type: string; is_regex: number }>;

    // 检查敏感词
    const checkResult = containsSensitiveWords(content, sensitiveWords);
    if (checkResult.found) {
      return NextResponse.json(
        { error: "内容包含敏感词，无法发布" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      "INSERT INTO comments (user_id, content, parent_id) VALUES (?, ?, ?)"
    );
    const result = stmt.run(userId, content, parentId || null);

    // 如果是回复评论，触发通知
    if (parentId) {
      await sendReplyNotification(parentId, userId, content);
    }

    // 检查关注者，发送通知
    if (parentId) {
      await sendWatchNotification(parentId, userId, content);
    }

    return NextResponse.json(
      {
        success: true,
        commentId: result.lastInsertRowid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 发送回复通知
async function sendReplyNotification(
  parentId: number,
  replyUserId: number | string,
  content: string
) {
  try {
    const db = getDb();
    const parentComment = db
      .prepare(
        `
      SELECT c.*, u.notification_reply, u.notification_email, u.notification_pushplus, u.username as author_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `
      )
      .get(parentId) as any;

    console.log("Parent Comment:", parentComment);

    if (!parentComment || parentComment.user_id === replyUserId) {
      return; // 不给自己发通知
    }

    if (parentComment.notification_reply === 1) {
      const replyUser = db
        .prepare("SELECT username FROM users WHERE id = ?")
        .get(replyUserId) as any;
      const message = `${
        replyUser?.username
      } 回复了你的评论: ${content.substring(0, 50)}...`;

      // 发送 PushPlus 通知
      if (parentComment.notification_pushplus) {
        await sendPushPlusNotification(
          parentComment.notification_pushplus,
          "新回复通知",
          message
        );
      }
    }
  } catch (error) {
    console.error("Send reply notification error:", error);
  }
}

// 发送关注通知
async function sendWatchNotification(
  commentId: number,
  replyUserId: number | string,
  content: string
) {
  try {
    // 获取根评论ID
    const db = getDb();
    let rootCommentId = commentId;
    let parentComment = db
      .prepare("SELECT parent_id FROM comments WHERE id = ?")
      .get(commentId) as any;

    while (parentComment?.parent_id) {
      rootCommentId = parentComment.parent_id;
      parentComment = db
        .prepare("SELECT parent_id FROM comments WHERE id = ?")
        .get(rootCommentId) as any;
    }

    // 获取关注该评论的用户
    const watchers = db
      .prepare(
        `
      SELECT u.id, u.username, u.notification_email, u.notification_pushplus
      FROM comment_watches cw
      JOIN users u ON cw.user_id = u.id
      WHERE cw.comment_id = ? AND u.notification_watch = 1 AND u.id != ?
    `
      )
      .all(rootCommentId, replyUserId) as any[];

    const replyUser = db
      .prepare("SELECT username FROM users WHERE id = ?")
      .get(replyUserId) as any;
    const message = `${
      replyUser?.username
    } 在你关注的评论中发布了新回复: ${content.substring(0, 50)}...`;

    for (const watcher of watchers) {
      // 发送 PushPlus 通知
      if (watcher.notification_pushplus) {
        await sendPushPlusNotification(
          watcher.notification_pushplus,
          "关注的评论有新回复",
          message
        );
      }
    }
  } catch (error) {
    console.error("Send watch notification error:", error);
  }
}
