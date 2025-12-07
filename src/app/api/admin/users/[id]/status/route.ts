import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";

// 启用/禁用用户
export async function PATCH(
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
    const { disabled } = await request.json();

    // 检查用户是否存在，以及是否为超级管理员
    const db = getDb();
    const user = db
      .prepare("SELECT id, role FROM users WHERE id = ?")
      .get(id) as { id: number; role: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 超级管理员不可禁用
    if (user.role === "superadmin") {
      return NextResponse.json(
        { error: "超级管理员不可禁用" },
        { status: 403 }
      );
    }

    // 更新用户状态
    db.prepare("UPDATE users SET disabled = ? WHERE id = ?").run(
      disabled ? 1 : 0,
      id
    );

    return NextResponse.json({
      success: true,
      message: disabled ? "用户已禁用" : "用户已启用",
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return NextResponse.json({ error: "更新用户状态失败" }, { status: 500 });
  }
}
