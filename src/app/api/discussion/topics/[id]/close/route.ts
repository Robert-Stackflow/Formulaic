import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// POST - 关闭主题
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // 检查权限：只有作者可以关闭主题
    if (user.id !== topic.created_by) {
      return NextResponse.json(
        { error: "只有作者可以关闭主题" },
        { status: 403 }
      );
    }

    // 检查是否已经关闭
    if (topic.closed_at) {
      return NextResponse.json({ error: "主题已经关闭" }, { status: 400 });
    }

    // 关闭主题
    db.prepare(
      `
      UPDATE discussion_topics
      SET closed_at = CURRENT_TIMESTAMP, closed_by = ?
      WHERE id = ?
    `
    ).run(user.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Close topic error:", error);
    return NextResponse.json({ error: "关闭主题失败" }, { status: 500 });
  }
}
