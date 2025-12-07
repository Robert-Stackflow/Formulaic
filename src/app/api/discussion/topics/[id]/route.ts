import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// GET - 获取主题详情及回复
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // 增加浏览次数
    const db = getDb();
    db.prepare(
      "UPDATE discussion_topics SET view_count = view_count + 1 WHERE id = ?"
    ).run(id);

    // 获取主题详情
    const topic = db
      .prepare(
        `
        SELECT 
          t.*,
          u.username as author_name,
          u.email as author_email,
          u.avatar as author_avatar,
          b.name as board_name
        FROM discussion_topics t
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN discussion_boards b ON t.board_id = b.id
        WHERE t.id = ?
      `
      )
      .get(id);

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 获取回复列表 (包含父回复作者名)
    const replies = db
      .prepare(
        `
        SELECT 
          r.*,
          u.username as author_name,
          u.avatar as author_avatar,
          parent_u.username as parent_author_name
        FROM discussion_replies r
        LEFT JOIN users u ON r.created_by = u.id
        LEFT JOIN discussion_replies parent_r ON r.parent_id = parent_r.id
        LEFT JOIN users parent_u ON parent_r.created_by = parent_u.id
        WHERE r.topic_id = ?
        ORDER BY r.is_answer DESC, r.created_at ASC
      `
      )
      .all(id);

    // 检查当前用户是否点赞和关注
    let userLiked = false;
    let userWatching = false;

    if (session?.user?.email) {
      const user = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(session.user.email) as { id: number } | undefined;

      if (user) {
        const like = db
          .prepare(
            "SELECT * FROM discussion_likes WHERE user_id = ? AND topic_id = ?"
          )
          .get(user.id, id);
        userLiked = !!like;

        const watch = db
          .prepare(
            "SELECT * FROM discussion_watches WHERE user_id = ? AND topic_id = ?"
          )
          .get(user.id, id);
        userWatching = !!watch;
      }
    }

    return NextResponse.json({
      topic,
      replies,
      userLiked,
      userWatching,
    });
  } catch (error) {
    console.error("Get topic error:", error);
    return NextResponse.json({ error: "获取主题详情失败" }, { status: 500 });
  }
}

// PATCH - 更新主题（作者或管理员）
export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    const db = getDb();

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(session.user.email) as any;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { id } = await params;
    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(id) as any;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 检查权限：作者或管理员
    if (user.id !== topic.created_by && user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const { title, content, tags, status, is_pinned } = await request.json();

    // 构建更新语句
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      values.push(content);
    }
    if (tags !== undefined) {
      updates.push("tags = ?");
      values.push(tags);
    }
    if (status !== undefined) {
      // 只有作者可以修改状态
      if (user.id === topic.created_by || user.role === "admin") {
        updates.push("status = ?");
        values.push(status);
      }
    }
    if (is_pinned !== undefined && user.role === "admin") {
      // 只有管理员可以置顶
      updates.push("is_pinned = ?");
      values.push(is_pinned ? 1 : 0);
    }

    if (updates.length > 0) {
      // 记录内容编辑历史
      if (content !== undefined && content !== topic.content) {
        db.prepare(
          `INSERT INTO discussion_edit_history (topic_id, content_before, content_after, edited_by) 
           VALUES (?, ?, ?, ?)`
        ).run(id, topic.content, content, user.id);
      }

      updates.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      db.prepare(
        `UPDATE discussion_topics SET ${updates.join(", ")} WHERE id = ?`
      ).run(...values);
    }

    const updatedTopic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(id);

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    console.error("Update topic error:", error);
    return NextResponse.json({ error: "更新主题失败" }, { status: 500 });
  }
}

// DELETE - 删除主题（作者或管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(session.user.email) as any;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { id } = await params;
    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(id) as any;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 检查权限：作者或管理员或超级管理员
    if (
      user.id !== topic.created_by &&
      user.role !== "admin" &&
      user.role !== "superadmin"
    ) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    // 使用事务删除主题及相关数据
    const deleteTransaction = db.transaction(() => {
      // 1. 删除所有回复的点赞
      db.prepare(
        `DELETE FROM discussion_likes 
         WHERE reply_id IN (SELECT id FROM discussion_replies WHERE topic_id = ?)`
      ).run(id);

      // 2. 删除所有回复的编辑历史
      db.prepare(
        `DELETE FROM discussion_edit_history 
         WHERE reply_id IN (SELECT id FROM discussion_replies WHERE topic_id = ?)`
      ).run(id);

      // 3. 删除所有回复
      db.prepare("DELETE FROM discussion_replies WHERE topic_id = ?").run(id);

      // 4. 删除主题的编辑历史
      db.prepare("DELETE FROM discussion_edit_history WHERE topic_id = ?").run(
        id
      );

      // 5. 删除主题的关注
      db.prepare("DELETE FROM discussion_watches WHERE topic_id = ?").run(id);

      // 6. 删除主题的点赞
      db.prepare("DELETE FROM discussion_likes WHERE topic_id = ?").run(id);

      // 7. 删除主题本身
      db.prepare("DELETE FROM discussion_topics WHERE id = ?").run(id);
    });

    deleteTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete topic error:", error);
    return NextResponse.json({ error: "删除主题失败" }, { status: 500 });
  }
}
