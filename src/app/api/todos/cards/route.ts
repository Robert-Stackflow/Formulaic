import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 创建新卡片
export async function POST(request: NextRequest) {
  const auth = await requirePermission("can_edit_todo");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { listId, title, description } = await request.json();
    const userId = auth.session.user.id;

    if (!listId || !title) {
      return NextResponse.json(
        { error: "List ID and title are required" },
        { status: 400 }
      );
    }

    // 获取当前最大位置
    const db = getDb();
    const maxPosition = db
      .prepare("SELECT MAX(position) as max FROM todo_cards WHERE list_id = ?")
      .get(listId) as any;

    const position = (maxPosition?.max || 0) + 1;

    const stmt = db.prepare(
      "INSERT INTO todo_cards (list_id, title, description, position, created_by) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(listId, title, description || "", position, userId);

    return NextResponse.json(
      {
        success: true,
        cardId: result.lastInsertRowid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 更新卡片
export async function PUT(request: NextRequest) {
  const auth = await requirePermission("can_edit_todo");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const {
      cardId,
      title,
      description,
      listId,
      position,
      completed,
      completed_at,
    } = await request.json();

    if (!cardId) {
      return NextResponse.json(
        { error: "Card ID is required" },
        { status: 400 }
      );
    }

    let query = "UPDATE todo_cards SET updated_at = CURRENT_TIMESTAMP";
    const params: any[] = [];

    if (title !== undefined) {
      query += ", title = ?";
      params.push(title);
    }
    if (description !== undefined) {
      query += ", description = ?";
      params.push(description);
    }
    if (listId !== undefined) {
      query += ", list_id = ?";
      params.push(listId);
    }
    if (position !== undefined) {
      query += ", position = ?";
      params.push(position);
    }
    if (completed !== undefined) {
      query += ", completed = ?";
      params.push(completed);
    }
    if (completed_at !== undefined) {
      query += ", completed_at = ?";
      params.push(completed_at);
    }

    query += " WHERE id = ?";
    params.push(cardId);

    const db = getDb();
    db.prepare(query).run(...params);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 删除卡片
export async function DELETE(request: NextRequest) {
  const auth = await requirePermission("can_edit_todo");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("id");

    if (!cardId) {
      return NextResponse.json(
        { error: "Card ID is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare("DELETE FROM todo_cards WHERE id = ?").run(cardId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete card error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
