import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// POST - 重新打开主题（仅作者可以）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    // 获取主题信息
    const db = getDb();
    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(id) as any;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 检查权限：只有作者可以重新打开
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(session.user.email) as any;

    if (!user || topic.created_by !== user.id) {
      return NextResponse.json(
        { error: "权限不足，只有作者可以重新打开主题" },
        { status: 403 }
      );
    }

    // 检查主题是否已关闭
    if (!topic.closed_at) {
      return NextResponse.json(
        { error: "主题未关闭，无需重新打开" },
        { status: 400 }
      );
    }

    // 重新打开主题
    db.prepare(
      "UPDATE discussion_topics SET closed_at = NULL, closed_by = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(id);

    return NextResponse.json({ success: true, message: "主题已重新打开" });
  } catch (error) {
    console.error("Reopen topic error:", error);
    return NextResponse.json({ error: "重新打开主题失败" }, { status: 500 });
  }
}
