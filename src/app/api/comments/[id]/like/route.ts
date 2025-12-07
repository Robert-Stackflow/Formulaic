import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 点赞/取消点赞
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id: commentId } = await params;
    const userId = auth.session.user.id;

    // 检查是否已点赞
    const db = getDb();
    const existingLike = db
      .prepare("SELECT * FROM likes WHERE user_id = ? AND comment_id = ?")
      .get(userId, commentId);

    if (existingLike) {
      // 取消点赞
      db.prepare("DELETE FROM likes WHERE user_id = ? AND comment_id = ?").run(
        userId,
        commentId
      );

      return NextResponse.json({
        success: true,
        action: "unliked",
      });
    } else {
      // 点赞
      db.prepare("INSERT INTO likes (user_id, comment_id) VALUES (?, ?)").run(
        userId,
        commentId
      );

      return NextResponse.json({
        success: true,
        action: "liked",
      });
    }
  } catch (error) {
    console.error("Like comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
