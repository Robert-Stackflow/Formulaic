import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteParams = Promise<{ id: string }>;

// POST - 编辑回复
export async function POST(
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

    // 检查权限 - 只有作者可以编辑
    if (user.id !== reply.created_by) {
      return NextResponse.json(
        { error: "只有作者可以编辑回复" },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
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

    // 记录编辑历史
    if (content !== reply.content) {
      db.prepare(
        `INSERT INTO discussion_edit_history (reply_id, content_before, content_after, edited_by) 
         VALUES (?, ?, ?, ?)`
      ).run(id, reply.content, content, user.id);
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
    console.error("Edit reply error:", error);
    return NextResponse.json({ error: "编辑回复失败" }, { status: 500 });
  }
}
