import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth, requirePermission } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// GET - 获取所有讨论板块
export async function GET() {
  // 检查查看权限
  const permCheck = await requirePermission("can_view_discuss");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error, boards: [] },
      { status: permCheck.status }
    );
  }

  try {
    const db = getDb();
    const boards = db
      .prepare(
        `
        SELECT 
          b.*,
          u.username as creator_name,
          (SELECT COUNT(*) FROM discussion_topics WHERE board_id = b.id) as topic_count
        FROM discussion_boards b
        LEFT JOIN users u ON b.created_by = u.id
        ORDER BY b.created_at ASC
      `
      )
      .all();

    return NextResponse.json({ boards });
  } catch (error) {
    console.error("Get boards error:", error);
    return NextResponse.json({ error: "获取板块列表失败" }, { status: 500 });
  }
}

// POST - 创建新讨论板块（管理员或有权限的用户）
export async function POST(request: NextRequest) {
  // 检查创建讨论区板块权限
  const permCheck = await requirePermission("can_create_discuss_board");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error },
      { status: permCheck.status }
    );
  }

  const { session } = permCheck;

  try {
    const db = getDb();
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(session.user.email) as any;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { name, description, icon, color } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "板块名称不能为空" }, { status: 400 });
    }

    const result = db
      .prepare(
        `
        INSERT INTO discussion_boards (name, description, icon, color, created_by)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(
        name,
        description || "",
        icon || "MessageCircle",
        color || "#3b82f6",
        user.id
      );

    const board = db
      .prepare("SELECT * FROM discussion_boards WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    console.error("Create board error:", error);
    return NextResponse.json({ error: "创建讨论区板块失败" }, { status: 500 });
  }
}
