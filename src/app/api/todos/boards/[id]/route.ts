import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 获取TODO看板详情（包括列表和卡片）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: boardId } = await params;

    // 获取看板信息
    const db = getDb();
    const board = db
      .prepare("SELECT * FROM todo_boards WHERE id = ?")
      .get(boardId);

    if (!board) {
      return NextResponse.json({ error: "看板不存在" }, { status: 404 });
    }

    // 获取列表
    const lists = db
      .prepare(
        `
      SELECT * FROM todo_lists 
      WHERE board_id = ? 
      ORDER BY position
    `
      )
      .all(boardId);

    // 获取所有卡片
    const cards = db
      .prepare(
        `
      SELECT c.*, u.username as creator_name
      FROM todo_cards c
      JOIN users u ON c.created_by = u.id
      WHERE c.list_id IN (SELECT id FROM todo_lists WHERE board_id = ?)
      ORDER BY c.position
    `
      )
      .all(boardId);

    // 组织数据结构
    const listsWithCards = (lists as any[]).map((list) => ({
      ...list,
      cards: (cards as any[]).filter((card) => card.list_id === list.id),
    }));

    return NextResponse.json({
      board,
      lists: listsWithCards,
    });
  } catch (error) {
    console.error("Get todo error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 更新TODO看板
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const permCheck = await requirePermission("can_edit_todo");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error },
      { status: permCheck.status }
    );
  }

  try {
    const { title, description } = await request.json();
    const { id: boardId } = await params;

    const db = getDb();
    db.prepare(
      "UPDATE todo_boards SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(title, description, boardId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update todo error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 删除TODO看板
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const permCheck = await requirePermission("can_edit_todo");
  if ("error" in permCheck) {
    return NextResponse.json(
      { error: permCheck.error },
      { status: permCheck.status }
    );
  }

  try {
    const { id: boardId } = await params;
    const db = getDb();
    db.prepare("DELETE FROM todo_boards WHERE id = ?").run(boardId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete todo error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
