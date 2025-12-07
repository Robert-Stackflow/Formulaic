import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/validation";

// 重置用户密码（管理员）
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
    const { password } = await request.json();

    // 验证密码
    if (!password) {
      return NextResponse.json({ error: "请输入新密码" }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join("；") },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const db = getDb();
    const user = db.prepare("SELECT id FROM users WHERE id = ?").get(id);
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 哈希新密码
    const passwordHash = bcrypt.hashSync(password, 10);

    // 更新密码
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      passwordHash,
      id
    );

    return NextResponse.json({
      success: true,
      message: "密码重置成功",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "重置密码失败" }, { status: 500 });
  }
}
