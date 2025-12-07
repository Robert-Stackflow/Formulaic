import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 关注/取消关注评论
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

    // 检查评论是否存在
    const db = getDb();
    const comment = db
      .prepare("SELECT id FROM comments WHERE id = ?")
      .get(commentId);
    if (!comment) {
      return NextResponse.json({ error: "评论不存在" }, { status: 404 });
    }

    // 检查是否已关注
    const existing = db
      .prepare(
        "SELECT id FROM comment_watches WHERE user_id = ? AND comment_id = ?"
      )
      .get(userId, commentId);

    if (existing) {
      // 取消关注
      db.prepare(
        "DELETE FROM comment_watches WHERE user_id = ? AND comment_id = ?"
      ).run(userId, commentId);
      return NextResponse.json({ success: true, watching: false });
    } else {
      // 添加关注
      db.prepare(
        "INSERT INTO comment_watches (user_id, comment_id) VALUES (?, ?)"
      ).run(userId, commentId);
      return NextResponse.json({ success: true, watching: true });
    }
  } catch (error) {
    console.error("Toggle watch error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 检查是否关注了某个评论
export async function GET(
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

    const db = getDb();
    const watching = db
      .prepare(
        "SELECT id FROM comment_watches WHERE user_id = ? AND comment_id = ?"
      )
      .get(userId, commentId);

    return NextResponse.json({ watching: !!watching });
  } catch (error) {
    console.error("Check watch error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
