import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  validatePassword,
  validateStudentId,
  validateHustEmail,
} from "@/lib/validation";

// 获取当前用户设置
export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const db = getDb();
    const user = db
      .prepare(
        `
      SELECT id, username, email, student_id, role,
             can_view_todo, can_edit_todo, can_create_todo_board, can_view_discuss, can_post_discuss, can_create_discuss_board,
             notification_reply, notification_watch, notification_email, notification_pushplus
      FROM users WHERE id = ?
    `
      )
      .get(auth.session.user.id) as any;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 更新用户设置
export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const userId = auth.session.user.id;
    const data = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    // 修改用户名
    const db = getDb();
    if (data.username && data.username !== auth.session.user.name) {
      // 检查用户名是否已存在
      const existingUser = db
        .prepare("SELECT id FROM users WHERE username = ? AND id != ?")
        .get(data.username, userId);
      if (existingUser) {
        return NextResponse.json({ error: "用户名已被使用" }, { status: 400 });
      }
      updates.push("username = ?");
      values.push(data.username);
    }

    // 修改学号
    if (data.student_id) {
      if (!validateStudentId(data.student_id)) {
        return NextResponse.json(
          { error: "学号格式不正确（应为M202XXXXXX或D202XXXXXX）" },
          { status: 400 }
        );
      }
      // 检查学号是否已存在
      const existingStudent = db
        .prepare("SELECT id FROM users WHERE student_id = ? AND id != ?")
        .get(data.student_id, userId);
      if (existingStudent) {
        return NextResponse.json({ error: "学号已被使用" }, { status: 400 });
      }
      updates.push("student_id = ?");
      values.push(data.student_id);
    }

    // 修改邮箱
    if (data.email && data.email !== auth.session.user.email) {
      if (!validateHustEmail(data.email)) {
        return NextResponse.json(
          { error: "邮箱必须是@hust.edu.cn后缀" },
          { status: 400 }
        );
      }
      // 检查邮箱是否已存在
      const existingEmail = db
        .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
        .get(data.email, userId);
      if (existingEmail) {
        return NextResponse.json({ error: "邮箱已被使用" }, { status: 400 });
      }
      updates.push("email = ?");
      values.push(data.email);
    }

    // 通知设置
    if (typeof data.notification_reply !== "undefined") {
      updates.push("notification_reply = ?");
      values.push(data.notification_reply ? 1 : 0);
    }
    if (typeof data.notification_watch !== "undefined") {
      updates.push("notification_watch = ?");
      values.push(data.notification_watch ? 1 : 0);
    }
    if (typeof data.notification_email !== "undefined") {
      updates.push("notification_email = ?");
      values.push(data.notification_email || null);
    }
    if (typeof data.notification_pushplus !== "undefined") {
      updates.push("notification_pushplus = ?");
      values.push(data.notification_pushplus || null);
    }

    // 修改密码
    if (data.currentPassword && data.newPassword) {
      const user = db
        .prepare("SELECT password_hash FROM users WHERE id = ?")
        .get(userId) as any;

      const validPassword = await bcrypt.compare(
        data.currentPassword,
        user.password_hash
      );
      if (!validPassword) {
        return NextResponse.json({ error: "当前密码错误" }, { status: 400 });
      }

      const passwordValidation = validatePassword(data.newPassword);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          {
            error: "新密码不符合要求",
            details: passwordValidation.errors,
          },
          { status: 400 }
        );
      }

      const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
      updates.push("password_hash = ?");
      values.push(newPasswordHash);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "没有要更新的设置" }, { status: 400 });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(userId);

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...values);

    return NextResponse.json({ success: true, message: "设置更新成功" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
