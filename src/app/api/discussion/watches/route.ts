import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET - 检查关注状态
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ watching: false });
    }
    const db = getDb();

    const user = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(session.user.email) as { id: number } | undefined;

    if (!user) {
      return NextResponse.json({ watching: false });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topic_id");

    if (!topicId) {
      return NextResponse.json({ watching: false });
    }

    const existingWatch = db
      .prepare(
        "SELECT 1 FROM discussion_watches WHERE user_id = ? AND topic_id = ?"
      )
      .get(user.id, topicId);

    return NextResponse.json({ watching: !!existingWatch });
  } catch (error) {
    console.error("Check watch status error:", error);
    return NextResponse.json({ watching: false });
  }
}

// POST - 关注/取消关注主题
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

    const { topic_id } = await request.json();

    if (!topic_id) {
      return NextResponse.json({ error: "主题ID不能为空" }, { status: 400 });
    }

    // 检查主题是否存在
    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(topic_id);

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 检查是否已关注
    const existingWatch = db
      .prepare(
        "SELECT * FROM discussion_watches WHERE user_id = ? AND topic_id = ?"
      )
      .get(user.id, topic_id);

    if (existingWatch) {
      // 取消关注
      db.prepare("DELETE FROM discussion_watches WHERE id = ?").run(
        (existingWatch as any).id
      );
      // 更新计数
      db.prepare(
        "UPDATE discussion_topics SET watch_count = watch_count - 1 WHERE id = ?"
      ).run(topic_id);
      return NextResponse.json({ watching: false });
    } else {
      // 添加关注
      db.prepare(
        "INSERT INTO discussion_watches (user_id, topic_id) VALUES (?, ?)"
      ).run(user.id, topic_id);
      // 更新计数
      db.prepare(
        "UPDATE discussion_topics SET watch_count = watch_count + 1 WHERE id = ?"
      ).run(topic_id);
      return NextResponse.json({ watching: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Toggle watch error:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
