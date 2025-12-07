import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET - 检查点赞状态
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ liked: false });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(session.user.email) as { id: number } | undefined;

    if (!user) {
      return NextResponse.json({ liked: false });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topic_id");
    const replyId = searchParams.get("reply_id");

    let existingLike;
    if (topicId) {
      existingLike = db
        .prepare(
          "SELECT 1 FROM discussion_likes WHERE user_id = ? AND topic_id = ?"
        )
        .get(user.id, topicId);
    } else if (replyId) {
      existingLike = db
        .prepare(
          "SELECT 1 FROM discussion_likes WHERE user_id = ? AND reply_id = ?"
        )
        .get(user.id, replyId);
    }

    return NextResponse.json({ liked: !!existingLike });
  } catch (error) {
    console.error("Check like status error:", error);
    return NextResponse.json({ liked: false });
  }
}

// POST - 点赞/取消点赞
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(session.user.email) as { id: number } | undefined;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { topic_id, reply_id } = await request.json();

    // 必须指定主题或回复其中之一
    if ((!topic_id && !reply_id) || (topic_id && reply_id)) {
      return NextResponse.json(
        { error: "必须指定主题或回复其中之一" },
        { status: 400 }
      );
    }

    // 检查是否已经点赞
    let existingLike;
    if (topic_id) {
      existingLike = db
        .prepare(
          "SELECT * FROM discussion_likes WHERE user_id = ? AND topic_id = ?"
        )
        .get(user.id, topic_id);
    } else {
      existingLike = db
        .prepare(
          "SELECT * FROM discussion_likes WHERE user_id = ? AND reply_id = ?"
        )
        .get(user.id, reply_id);
    }

    if (existingLike) {
      // 取消点赞
      db.prepare("DELETE FROM discussion_likes WHERE id = ?").run(
        (existingLike as any).id
      );

      // 更新计数
      if (topic_id) {
        db.prepare(
          "UPDATE discussion_topics SET like_count = like_count - 1 WHERE id = ?"
        ).run(topic_id);
      } else {
        db.prepare(
          "UPDATE discussion_replies SET like_count = like_count - 1 WHERE id = ?"
        ).run(reply_id);
      }

      return NextResponse.json({ liked: false });
    } else {
      // 添加点赞
      if (topic_id) {
        db.prepare(
          "INSERT INTO discussion_likes (user_id, topic_id) VALUES (?, ?)"
        ).run(user.id, topic_id);
        db.prepare(
          "UPDATE discussion_topics SET like_count = like_count + 1 WHERE id = ?"
        ).run(topic_id);
      } else {
        db.prepare(
          "INSERT INTO discussion_likes (user_id, reply_id) VALUES (?, ?)"
        ).run(user.id, reply_id);
        db.prepare(
          "UPDATE discussion_replies SET like_count = like_count + 1 WHERE id = ?"
        ).run(reply_id);
      }
      return NextResponse.json({ liked: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
