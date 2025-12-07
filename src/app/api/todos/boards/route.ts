import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 获取所有TODO看板
export async function GET() {
  // 检查查看权限
  const permCheck = await requirePermission("can_view_todo");
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
      SELECT b.*, u.username as creator_name
      FROM todo_boards b
      JOIN users u ON b.created_by = u.id
      ORDER BY b.updated_at DESC
    `
      )
      .all();

    // 为每个看板添加未完成待办数量
    const boardsWithStats = (boards as any[]).map((board) => {
      const pendingCount = db
        .prepare(
          `
        SELECT COUNT(*) as count
        FROM todo_cards c
        JOIN todo_lists l ON c.list_id = l.id
        WHERE l.board_id = ? AND c.completed = 0
      `
        )
        .get(board.id) as { count: number };

      return {
        ...board,
        pending_count: pendingCount.count,
      };
    });

    return NextResponse.json({ boards: boardsWithStats });
  } catch (error) {
    console.error("Get todos error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 创建新TODO看板
export async function POST(request: NextRequest) {
  // 检查创建权限
  const permCheck = await requirePermission("can_create_todo_board");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error },
      { status: permCheck.status }
    );
  }

  try {
    const { title, description } = await request.json();
    const userId = permCheck.session.user.id;

    if (!title) {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO todo_boards (title, description, created_by) VALUES (?, ?, ?)"
    );
    const result = stmt.run(title, description || "", userId);

    return NextResponse.json(
      {
        success: true,
        boardId: result.lastInsertRowid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create todo error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
