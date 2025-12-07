import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";

// 获取所有用户列表（仅管理员）
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
    const users = db
      .prepare(
        `
      SELECT id, username, email, student_id, role, disabled,
             can_view_todo, can_edit_todo, can_create_todo_board, can_view_discuss, can_post_discuss, can_create_discuss_board,
             created_at
      FROM users
      ORDER BY created_at DESC
    `
      )
      .all();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 更新用户权限（仅管理员）
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { userId, permissions } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    // 不能修改管理员用户的权限
    const db = getDb();
    const user = db
      .prepare("SELECT role FROM users WHERE id = ?")
      .get(userId) as any;
    if (user?.role === "admin" && authResult.session.user.id !== userId) {
      return NextResponse.json(
        { error: "不能修改其他管理员的权限" },
        { status: 403 }
      );
    }

    // 构建更新语句
    const updates: string[] = [];
    const values: any[] = [];

    if (typeof permissions.can_view_todo !== "undefined") {
      updates.push("can_view_todo = ?");
      values.push(permissions.can_view_todo ? 1 : 0);
    }
    if (typeof permissions.can_edit_todo !== "undefined") {
      updates.push("can_edit_todo = ?");
      values.push(permissions.can_edit_todo ? 1 : 0);
    }
    if (typeof permissions.can_create_todo_board !== "undefined") {
      updates.push("can_create_todo_board = ?");
      values.push(permissions.can_create_todo_board ? 1 : 0);
    }
    if (typeof permissions.can_view_discuss !== "undefined") {
      updates.push("can_view_discuss = ?");
      values.push(permissions.can_view_discuss ? 1 : 0);
    }
    if (typeof permissions.can_post_discuss !== "undefined") {
      updates.push("can_post_discuss = ?");
      values.push(permissions.can_post_discuss ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "没有要更新的权限" }, { status: 400 });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(userId);

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...values);

    return NextResponse.json({ success: true, message: "权限更新成功" });
  } catch (error) {
    console.error("Update permissions error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
