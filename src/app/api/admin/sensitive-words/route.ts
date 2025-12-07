import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";

// 获取所有敏感词（仅管理员）
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const db = getDb();
    const words = db
      .prepare("SELECT * FROM sensitive_words ORDER BY created_at DESC")
      .all();
    return NextResponse.json({ words });
  } catch (error) {
    console.error("Get sensitive words error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 添加敏感词（仅管理员）
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const {
      word,
      type = "text",
      is_regex = 0,
      description,
    } = await request.json();

    if (!word || typeof word !== "string" || word.trim() === "") {
      return NextResponse.json({ error: "敏感词不能为空" }, { status: 400 });
    }

    // 如果是正则表达式，验证其有效性
    if (type === "regex" || is_regex === 1) {
      try {
        new RegExp(word.trim());
      } catch (e) {
        return NextResponse.json(
          { error: "无效的正则表达式" },
          { status: 400 }
        );
      }
    }

    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO sensitive_words (word, type, is_regex, description) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(
      word.trim(),
      type === "regex" ? "regex" : "text",
      type === "regex" || is_regex === 1 ? 1 : 0,
      description || null
    );

    return NextResponse.json(
      {
        success: true,
        id: result.lastInsertRowid,
        message: "敏感词添加成功",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json({ error: "该敏感词已存在" }, { status: 409 });
    }
    console.error("Add sensitive word error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 删除敏感词（仅管理员）
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const db = getDb();

    if (!id) {
      return NextResponse.json({ error: "缺少敏感词ID" }, { status: 400 });
    }

    db.prepare("DELETE FROM sensitive_words WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "敏感词删除成功" });
  } catch (error) {
    console.error("Delete sensitive word error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
