import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import { getDb } from "./db";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();

  if (!session || !session.user) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  return { session };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "未授权" }, { status: 401 });
}

export function forbiddenResponse(message = "没有权限执行此操作") {
  return NextResponse.json({ error: message }, { status: 403 });
}

// 权限检查函数
export async function checkPermission(
  userId: number | string,
  permission:
    | "can_view_todo"
    | "can_edit_todo"
    | "can_create_todo_board"
    | "can_view_discuss"
    | "can_post_discuss"
    | "can_create_discuss_board"
): Promise<boolean> {
  const db = getDb();
  const user = db        
    .prepare(`SELECT ${permission}, role FROM users WHERE id = ?`)
    .get(userId) as any;

  // 超级管理员和管理员拥有所有权限
  if (user?.role === "superadmin" || user?.role === "admin") {
    return true;
  }

  return user?.[permission] === 1;
}

// 检查是否为管理员（包括超级管理员）
export async function isAdmin(userId: number | string): Promise<boolean> {
  const db = getDb();
  const user = db
    .prepare("SELECT role FROM users WHERE id = ?")
    .get(userId) as any;
  return user?.role === "superadmin" || user?.role === "admin";
}

// 检查是否为超级管理员
export async function isSuperAdmin(userId: number | string): Promise<boolean> {
  const db = getDb();
  const user = db
    .prepare("SELECT role FROM users WHERE id = ?")
    .get(userId) as any;
  return user?.role === "superadmin";
}

// 要求管理员权限
export async function requireAdmin() {
  const session = await getSession();

  if (!session || !session.user?.id) {
    return { error: "未授权", status: 401 };
  }

  const admin = await isAdmin(session.user.id);
  if (!admin) {
    return { error: "需要管理员权限", status: 403 };
  }

  return { session };
}

// 要求特定权限
export async function requirePermission(
  permission:
    | "can_view_todo"
    | "can_edit_todo"
    | "can_create_todo_board"
    | "can_view_discuss"
    | "can_post_discuss"
    | "can_create_discuss_board"
) {
  const session = await getSession();

  if (!session || !session.user?.id) {
    return { error: "未授权", status: 401 };
  }

  const hasPermission = await checkPermission(session.user.id, permission);
  if (!hasPermission) {
    return { error: "没有此操作权限", status: 403 };
  }

  return { session };
}
