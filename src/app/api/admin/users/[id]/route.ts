import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import { validateStudentId, validateHustEmail } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const {
      username,
      email,
      student_id,
      role,
      can_view_todo,
      can_edit_todo,
      can_create_todo_board,
      can_view_discuss,
      can_post_discuss,
      can_create_discuss_board,
    } = await request.json();

    // 检查是否为超级管理员
    const db = getDb();
    const targetUser = db
      .prepare("SELECT role FROM users WHERE id = ?")
      .get(id) as { role: string } | undefined;

    if (targetUser?.role === "superadmin") {
      return NextResponse.json(
        { error: "超级管理员不可修改" },
        { status: 403 }
      );
    }

    // 验证输入
    if (!username || !email || !student_id) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 验证学号格式
    if (!validateStudentId(student_id)) {
      return NextResponse.json(
        { error: "学号格式不正确，必须是M202开头后跟6位数字" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (!validateHustEmail(email)) {
      return NextResponse.json(
        { error: "邮箱必须是@hust.edu.cn域名" },
        { status: 400 }
      );
    }

    // 验证角色（不允许设置为超级管理员）
    if (role && !["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "无效的角色" }, { status: 400 });
    }

    // 检查邮箱或学号是否被其他用户使用
    const existingUser = db
      .prepare(
        "SELECT id FROM users WHERE (email = ? OR student_id = ?) AND id != ?"
      )
      .get(email, student_id, id) as { id: number } | undefined;

    if (existingUser) {
      return NextResponse.json(
        { error: "邮箱或学号已被其他用户使用" },
        { status: 409 }
      );
    }

    // 更新用户信息和权限
    const updateStmt = db.prepare(`
      UPDATE users 
      SET username = ?, 
          email = ?, 
          student_id = ?, 
          role = ?,
          can_view_todo = ?,
          can_edit_todo = ?,
          can_create_todo_board = ?,
          can_view_discuss = ?,
          can_post_discuss = ?,
          can_create_discuss_board = ?
      WHERE id = ?
    `);

    updateStmt.run(
      username,
      email,
      student_id,
      role || "user",
      can_view_todo !== undefined ? can_view_todo : 0,
      can_edit_todo !== undefined ? can_edit_todo : 0,
      can_create_todo_board !== undefined ? can_create_todo_board : 0,
      can_view_discuss !== undefined ? can_view_discuss : 0,
      can_post_discuss !== undefined ? can_post_discuss : 0,
      can_create_discuss_board !== undefined ? can_create_discuss_board : 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    // 检查用户是否存在，以及是否为超级管理员
    const db = getDb();
    const user = db
      .prepare("SELECT id, role FROM users WHERE id = ?")
      .get(id) as { id: number; role: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 超级管理员不可删除
    if (user.role === "superadmin") {
      return NextResponse.json(
        { error: "超级管理员不可删除" },
        { status: 403 }
      );
    }

    // 删除用户
    db.prepare("DELETE FROM users WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "用户已删除" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 });
  }
}
