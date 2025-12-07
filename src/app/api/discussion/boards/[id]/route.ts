import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";

type RouteParams = Promise<{ id: string }>;

// GET - 获取单个板块详情
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;

    const db = getDb();
    const board = db
      .prepare(
        `
        SELECT 
          b.*,
          u.username as creator_name,
          (SELECT COUNT(*) FROM discussion_topics WHERE board_id = b.id) as topic_count
        FROM discussion_boards b
        LEFT JOIN users u ON b.created_by = u.id
        WHERE b.id = ?
      `
      )
      .get(id);

    if (!board) {
      return NextResponse.json({ error: "板块不存在" }, { status: 404 });
    }

    return NextResponse.json({ board });
  } catch (error) {
    console.error("Get board error:", error);
    return NextResponse.json({ error: "获取板块失败" }, { status: 500 });
  }
}

// PATCH - 更新板块信息（仅管理员）
export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const authCheck = await requireAdmin();
    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const db = getDb();

    const { id } = await params;
    const { name, description, icon, color } = await request.json();

    const board = db
      .prepare("SELECT * FROM discussion_boards WHERE id = ?")
      .get(id);

    if (!board) {
      return NextResponse.json({ error: "板块不存在" }, { status: 404 });
    }

    db.prepare(
      `
      UPDATE discussion_boards
      SET name = ?, description = ?, icon = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    ).run(name, description, icon, color, id);

    const updatedBoard = db
      .prepare("SELECT * FROM discussion_boards WHERE id = ?")
      .get(id);

    return NextResponse.json({ board: updatedBoard });
  } catch (error) {
    console.error("Update board error:", error);
    return NextResponse.json({ error: "更新板块失败" }, { status: 500 });
  }
}

// DELETE - 删除板块（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const authCheck = await requireAdmin();
    if ("error" in authCheck) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status }
      );
    }

    const db = getDb();
    const { id } = await params;

    const board = db
      .prepare("SELECT * FROM discussion_boards WHERE id = ?")
      .get(id);

    if (!board) {
      return NextResponse.json({ error: "板块不存在" }, { status: 404 });
    }

    db.prepare("DELETE FROM discussion_boards WHERE id = ?").run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete board error:", error);
    return NextResponse.json({ error: "删除板块失败" }, { status: 500 });
  }
}
