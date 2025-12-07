import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sendPushPlusNotification } from "@/lib/notification";
import { requirePermission } from "@/lib/auth-utils";

// 发送通知给评论作者，返回被通知的用户ID
async function sendReplyAuthorNotification(
  parentId: number,
  replyUserId: number,
  content: string
): Promise<number | null> {
  try {
    const db = getDb();
    const parentReply = db
      .prepare(
        `
      SELECT dr.*, u.notification_reply, u.notification_email, u.notification_pushplus, u.username as author_name
      FROM discussion_replies dr
      JOIN users u ON dr.created_by = u.id
      WHERE dr.id = ?
    `
      )
      .get(parentId) as any;

    if (!parentReply || parentReply.created_by === replyUserId) {
      return null; // 不给自己发通知
    }

    if (parentReply.notification_reply === 1) {
      const replyUser = db
        .prepare("SELECT username, avatar FROM users WHERE id = ?")
        .get(replyUserId) as any;

      const contentPreview =
        content.length > 100 ? content.substring(0, 100) + "..." : content;
      const timestamp = new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
      });

      const htmlMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1a73e8; margin-top: 0; border-bottom: 2px solid #1a73e8; padding-bottom: 12px;">
              新回复通知
            </h2>
            <div style="margin: 20px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                ${
                  replyUser?.avatar
                    ? `<img src="${replyUser.avatar}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 12px;" alt="avatar" />`
                    : ""
                }
                <div>
                  <strong style="color: #333; font-size: 16px;">${
                    replyUser?.username || "某用户"
                  }</strong>
                  <span style="color: #666; margin-left: 8px;">回复了你的评论</span>
                </div>
              </div>
              <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 16px; margin: 16px 0; border-radius: 4px;">
                <p style="margin: 0; color: #333; line-height: 1.6;">${contentPreview}</p>
              </div>
              <div style="color: #999; font-size: 12px; margin-top: 12px;">
                ${timestamp}
              </div>
            </div>
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <a href="${
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
              }/discuss" 
                 style="display: inline-block; padding: 12px 24px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                查看详情
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 16px; color: #999; font-size: 12px;">
            <p>这是一封自动发送的通知邮件，请勿直接回复</p>
          </div>
        </div>
      `;

      // 发送 PushPlus 通知
      if (parentReply.notification_pushplus) {
        await sendPushPlusNotification(
          parentReply.notification_pushplus,
          "新回复通知",
          htmlMessage
        );
      }
    }

    return parentReply.created_by;
  } catch (error) {
    console.error("Send reply author notification error:", error);
    return null;
  }
}

// 发送通知给主题关注者
async function sendTopicWatchersNotification(
  topicId: number,
  replyUserId: number,
  content: string,
  excludeUserId?: number | null
) {
  try {
    // 获取关注该主题的用户，排除回复者和已通知的评论作者
    const excludeIds = [replyUserId];
    if (excludeUserId) {
      excludeIds.push(excludeUserId);
    }

    const db = getDb();
    const watchers = db
      .prepare(
        `
      SELECT u.id, u.username, u.notification_email, u.notification_pushplus
      FROM discussion_watches dw
      JOIN users u ON dw.user_id = u.id
      WHERE dw.topic_id = ? AND u.notification_watch = 1 AND u.id NOT IN (${excludeIds.join(
        ","
      )})
    `
      )
      .all(topicId) as any[];

    if (watchers.length === 0) return;

    const topic = db
      .prepare("SELECT title, id FROM discussion_topics WHERE id = ?")
      .get(topicId) as any;

    const replyUser = db
      .prepare("SELECT username, avatar FROM users WHERE id = ?")
      .get(replyUserId) as any;

    const contentPreview =
      content.length > 100 ? content.substring(0, 100) + "..." : content;
    const timestamp = new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    });

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #34a853; margin-top: 0; border-bottom: 2px solid #34a853; padding-bottom: 12px;">
            关注的主题有新回复
          </h2>
          <div style="margin: 20px 0;">
            <div style="background-color: #e8f5e9; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
              <h3 style="margin: 0; color: #2e7d32; font-size: 18px;">📌 ${
                topic?.title || "未知主题"
              }</h3>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              ${
                replyUser?.avatar
                  ? `<img src="${replyUser.avatar}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 12px;" alt="avatar" />`
                  : ""
              }
              <div>
                <strong style="color: #333; font-size: 16px;">${
                  replyUser?.username || "某用户"
                }</strong>
                <span style="color: #666; margin-left: 8px;">发布了新回复</span>
              </div>
            </div>
            <div style="background-color: #f8f9fa; border-left: 4px solid #34a853; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <p style="margin: 0; color: #333; line-height: 1.6;">${contentPreview}</p>
            </div>
            <div style="color: #999; font-size: 12px; margin-top: 12px;">
              ${timestamp}
            </div>
          </div>
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }/discuss/topics/${topic?.id}" 
               style="display: inline-block; padding: 12px 24px; background-color: #34a853; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              查看主题
            </a>
          </div>
        </div>
        <div style="text-align: center; margin-top: 16px; color: #999; font-size: 12px;">
          <p>这是一封自动发送的通知邮件，请勿直接回复</p>
        </div>
      </div>
    `;

    for (const watcher of watchers) {
      // 发送 PushPlus 通知
      if (watcher.notification_pushplus) {
        await sendPushPlusNotification(
          watcher.notification_pushplus,
          "关注的主题有新回复",
          htmlMessage
        );
      }
    }
  } catch (error) {
    console.error("Send topic watchers notification error:", error);
  }
}

// POST - 发布回复
export async function POST(request: NextRequest) {
  try {
    const permCheck = await requirePermission("can_post_discuss");
    if ("error" in permCheck) {
      return NextResponse.json(
        { error: permCheck.error },
        { status: permCheck.status }
      );
    }

    const { session } = permCheck;

    const db = getDb();
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(session.user.email) as any;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { topic_id, content, parent_id } = await request.json();

    if (!topic_id || !content) {
      return NextResponse.json(
        { error: "主题ID和内容不能为空" },
        { status: 400 }
      );
    }

    // 检查主题是否存在
    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(topic_id) as any;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 敏感词检测
    const sensitiveWords = db
      .prepare("SELECT word, type, is_regex FROM sensitive_words")
      .all() as Array<{ word: string; type: string; is_regex: number }>;

    for (const sw of sensitiveWords) {
      let matched = false;
      if (sw.is_regex === 1 || sw.type === "regex") {
        try {
          const regex = new RegExp(sw.word, "i");
          matched = regex.test(content);
        } catch (e) {
          console.error(`Invalid regex pattern: ${sw.word}`, e);
        }
      } else {
        matched = content.toLowerCase().includes(sw.word.toLowerCase());
      }

      if (matched) {
        return NextResponse.json({ error: `内容包含敏感词` }, { status: 400 });
      }
    }

    // 如果是回复某条评论，检查父评论是否存在
    if (parent_id) {
      const parentReply = db
        .prepare("SELECT * FROM discussion_replies WHERE id = ?")
        .get(parent_id);
      if (!parentReply) {
        return NextResponse.json({ error: "父评论不存在" }, { status: 404 });
      }
    }

    const result = db
      .prepare(
        `
        INSERT INTO discussion_replies (topic_id, content, parent_id, created_by)
        VALUES (?, ?, ?, ?)
      `
      )
      .run(topic_id, content, parent_id || null, user.id);

    // 更新主题的回复数和最后回复时间
    db.prepare(
      `
      UPDATE discussion_topics
      SET reply_count = reply_count + 1, last_reply_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    ).run(topic_id);

    // 如果是回复某条评论，发送通知给评论作者
    let notifiedUserId: number | null = null;
    if (parent_id) {
      notifiedUserId = await sendReplyAuthorNotification(
        parent_id,
        user.id,
        content
      );
    }

    // 发送通知给主题关注者（排除已通知的评论作者）
    await sendTopicWatchersNotification(
      topic_id,
      user.id,
      content,
      notifiedUserId
    );

    const reply = db
      .prepare("SELECT * FROM discussion_replies WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json({ error: "发布回复失败" }, { status: 500 });
  }
}
