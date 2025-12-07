import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET - 获取主题的所有回复
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查主题是否存在
    const db = getDb();
    const topic = db
      .prepare("SELECT id FROM discussion_topics WHERE id = ?")
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

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Get replies error:", error);
    return NextResponse.json({ error: "获取回复失败" }, { status: 500 });
  }
}
