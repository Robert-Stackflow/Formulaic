import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

// POST - 标记/取消标记为答案
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
    const reply = db
      .prepare("SELECT * FROM discussion_replies WHERE id = ?")
      .get(id) as any;

    if (!reply) {
      return NextResponse.json({ error: "回复不存在" }, { status: 404 });
    }

    // 获取主题信息
    const topic = db
      .prepare("SELECT * FROM discussion_topics WHERE id = ?")
      .get(reply.topic_id) as any;

    if (!topic) {
      return NextResponse.json({ error: "主题不存在" }, { status: 404 });
    }

    // 检查权限：只有主题作者可以标记答案
    if (user.id !== topic.created_by) {
      return NextResponse.json(
        { error: "只有主题作者可以标记答案" },
        { status: 403 }
      );
    }

    // 切换答案状态
    const newAnswerStatus = reply.is_answer === 1 ? 0 : 1;
    db.prepare("UPDATE discussion_replies SET is_answer = ? WHERE id = ?").run(
      newAnswerStatus,
      id
    );

    // 如果标记为答案，自动将主题标记为已解决
    if (newAnswerStatus === 1) {
      db.prepare(
        "UPDATE discussion_topics SET is_resolved = 1 WHERE id = ?"
      ).run(reply.topic_id);
    } else {
      // 如果取消答案标记，检查是否还有其他答案
      const otherAnswers = db
        .prepare(
          "SELECT COUNT(*) as count FROM discussion_replies WHERE topic_id = ? AND is_answer = 1"
        )
        .get(reply.topic_id) as { count: number };

      if (otherAnswers.count === 0) {
        // 没有其他答案了，取消已解决状态
        db.prepare(
          "UPDATE discussion_topics SET is_resolved = 0 WHERE id = ?"
        ).run(reply.topic_id);
      }
    }

    return NextResponse.json({
      success: true,
      is_answer: newAnswerStatus,
    });
  } catch (error) {
    console.error("Mark as answer error:", error);
    return NextResponse.json({ error: "标记答案失败" }, { status: 500 });
  }
}
