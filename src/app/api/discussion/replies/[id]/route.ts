import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// PATCH - 更新回复（作者或管理员）
export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
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

    // 检查权限
    if (user.id !== reply.created_by && user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    // 敏感词检测
    const sensitiveWords = db
      .prepare("SELECT word, type, is_regex FROM sensitive_words")
      .all() as Array<{ word: string; type: string; is_regex: number }>;

    for (const sw of sensitiveWords) {
      let matched = false;
      if (sw.is_regex === 1 || sw.type === "regex") {
        try {
          const regex = new RegExp(sw.word, "i");
          matched = regex.test(content);
        } catch (e) {
          console.error(`Invalid regex pattern: ${sw.word}`, e);
        }
      } else {
        matched = content.toLowerCase().includes(sw.word.toLowerCase());
      }

      if (matched) {
        return NextResponse.json({ error: `内容包含敏感词` }, { status: 400 });
      }
    }

    db.prepare(
      `
      UPDATE discussion_replies
      SET content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    ).run(content, id);

    const updatedReply = db
      .prepare("SELECT * FROM discussion_replies WHERE id = ?")
      .get(id);

    return NextResponse.json({ reply: updatedReply });
  } catch (error) {
    console.error("Update reply error:", error);
    return NextResponse.json({ error: "更新回复失败" }, { status: 500 });
  }
}

// DELETE - 删除回复（作者或管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
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

    // 检查权限
    if (user.id !== reply.created_by && user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    db.prepare("DELETE FROM discussion_replies WHERE id = ?").run(id);

    // 更新主题回复数
    db.prepare(
      `
      UPDATE discussion_topics
      SET reply_count = reply_count - 1
      WHERE id = ?
    `
    ).run(reply.topic_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reply error:", error);
    return NextResponse.json({ error: "删除回复失败" }, { status: 500 });
  }
}
