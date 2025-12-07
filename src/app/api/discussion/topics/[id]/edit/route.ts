import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// POST - 编辑主题
export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const db = getDb();
    const { id } = await params;
    const { title, content, tags } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "标题和内容不能为空" },
        { status: 400 }
      );
    }

    // 获取用户ID
    const user = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(session.user.email) as { id: number } | undefined;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 检查主题是否存在且是作者
    const topic = db
      .prepare("SELECT id, created_by FROM discussion_topics WHERE id = ?")
      .get(id) as { id: number; created_by: number } | undefined;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    if (topic.created_by !== user.id) {
      return NextResponse.json(
        { error: "只有作者可以编辑主题" },
        { status: 403 }
      );
    }

    // 更新主题
    db.prepare(
      `UPDATE discussion_topics 
       SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    ).run(title.trim(), content.trim(), tags || null, id);

    return NextResponse.json({
      success: true,
      message: "主题已更新",
    });
  } catch (error) {
    console.error("编辑主题失败:", error);
    return NextResponse.json({ error: "编辑主题失败" }, { status: 500 });
  }
}
