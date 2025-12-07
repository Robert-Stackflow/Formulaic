import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// POST - 删除回复
export async function POST(
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
    const reply = db
      .prepare("SELECT * FROM discussion_replies WHERE id = ?")
      .get(id) as any;

    if (!reply) {
      return NextResponse.json({ error: "回复不存在" }, { status: 404 });
    }

    // 检查权限 - 只有作者可以删除
    if (user.id !== reply.created_by) {
      return NextResponse.json(
        { error: "只有作者可以删除回复" },
        { status: 403 }
      );
    }

    // 开始事务删除
    db.prepare("BEGIN TRANSACTION").run();

    try {
      // 删除回复的编辑历史
      db.prepare("DELETE FROM discussion_edit_history WHERE reply_id = ?").run(
        id
      );

      // 删除回复
      db.prepare("DELETE FROM discussion_replies WHERE id = ?").run(id);

      // 更新主题回复数
      db.prepare(
        `
        UPDATE discussion_topics
        SET reply_count = reply_count - 1
        WHERE id = ?
      `
      ).run(reply.topic_id);

      // 如果有子回复（被引用的回复），将它们的 parent_id 设为 NULL
      db.prepare(
        `
        UPDATE discussion_replies
        SET parent_id = NULL
        WHERE parent_id = ?
      `
      ).run(id);

      db.prepare("COMMIT").run();

      return NextResponse.json({ success: true });
    } catch (error) {
      db.prepare("ROLLBACK").run();
      throw error;
    }
  } catch (error) {
    console.error("Delete reply error:", error);
    return NextResponse.json({ error: "删除回复失败" }, { status: 500 });
  }
}
