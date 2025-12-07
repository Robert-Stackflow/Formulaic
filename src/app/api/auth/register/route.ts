import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import {
  validateStudentId,
  validateHustEmail,
  validatePassword,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const { username, email, student_id, password } = await request.json();

    if (!username || !email || !student_id || !password) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    // 验证学号格式
    if (!validateStudentId(student_id)) {
      return NextResponse.json(
        { error: "学号格式错误，必须是 M202XXXXXX 格式（X为数字）" },
        { status: 400 }
      );
    }

    // 验证邮箱
    if (!validateHustEmail(email)) {
      return NextResponse.json(
        { error: "邮箱必须是 @hust.edu.cn 结尾" },
        { status: 400 }
      );
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "密码不符合要求",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const db = getDb();
    const existingUser = db
      .prepare(
        "SELECT * FROM users WHERE email = ? OR username = ? OR student_id = ?"
      )
      .get(email, username, student_id);

    if (existingUser) {
      return NextResponse.json(
        { error: "用户名、邮箱或学号已被使用" },
        { status: 409 }
      );
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户（默认权限：可以查看todo和讨论区、可以发帖，但不能修改todo和创建讨论区板块）
    const stmt = db.prepare(
      `INSERT INTO users (
        username, email, student_id, password_hash, notification_email,
        can_view_todo, can_edit_todo, can_view_discuss, can_post_discuss, can_create_discuss_board, disabled
      ) VALUES (?, ?, ?, ?, ?, 1, 0, 1, 1, 0, 1)`
    );
    const result = stmt.run(username, email, student_id, passwordHash, email);

    return NextResponse.json(
      {
        success: true,
        userId: result.lastInsertRowid,
        message: "注册成功！请联系管理员审核并启用您的账号，启用后方可登录。",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
