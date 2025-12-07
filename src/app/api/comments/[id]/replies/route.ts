import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// 获取评论的回复
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;

    const db = getDb();
    const replies = db
      .prepare(
        `
      SELECT 
        c.*,
        u.username,
        u.avatar,
        (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as like_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.parent_id = ?
      ORDER BY c.created_at ASC
    `
      )
      .all(commentId);

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Get replies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
