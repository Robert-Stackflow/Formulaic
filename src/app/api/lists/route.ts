import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 创建新列表
export async function POST(request: NextRequest) {
  const auth = await requirePermission("can_edit_todo");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { boardId, title } = await request.json();

    if (!boardId || !title) {
      return NextResponse.json(
        { error: "Board ID and title are required" },
        { status: 400 }
      );
    }

    // 获取当前最大位置
    const db = getDb();
    const maxPosition = db
      .prepare("SELECT MAX(position) as max FROM todo_lists WHERE board_id = ?")
      .get(boardId) as any;

    const position = (maxPosition?.max || 0) + 1;

    const stmt = db.prepare(
      "INSERT INTO todo_lists (board_id, title, description, tags, position) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(boardId, title, "", "[]", position);

    return NextResponse.json(
      {
        success: true,
        listId: result.lastInsertRowid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 更新列表（标题或位置）
export async function PUT(request: NextRequest) {
  const auth = await requirePermission("can_edit_todo");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { listId, title, description, tags, position } = await request.json();

    const db = getDb();
    if (title !== undefined) {
      db.prepare(
        "UPDATE todo_lists SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(title, listId);
    }

    if (description !== undefined) {
      db.prepare(
        "UPDATE todo_lists SET description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(description, listId);
    }

    if (tags !== undefined) {
      db.prepare(
        "UPDATE todo_lists SET tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(tags, listId);
    }

    if (position !== undefined) {
      db.prepare(
        "UPDATE todo_lists SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(position, listId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 删除列表
export async function DELETE(request: NextRequest) {
  const auth = await requirePermission("can_edit_todo");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("id");

    if (!listId) {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare("DELETE FROM todo_lists WHERE id = ?").run(listId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
