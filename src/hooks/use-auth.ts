"use client";

import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * 判断指定用户是否为内容的作者（纯函数）
 * @param userId - 用户ID
 * @param createdBy - 内容创建者的ID（可能是数字或字符串）
 * @returns boolean - 如果用户是作者返回 true
 */
export function isAuthor(
  userId: string | null | undefined,
  createdBy: number | string | null | undefined
): boolean {
  if (!userId || !createdBy) {
    return false;
  }

  return String(createdBy) === String(userId);
}

/**
 * 判断当前用户是否为指定内容的作者（Hook）
 * @param createdBy - 内容创建者的ID（可能是数字或字符串）
 * @returns boolean - 如果当前用户是作者返回 true
 */
export function useIsAuthor(
  createdBy: number | string | null | undefined
): boolean {
  const { data: session } = useSession();
  return isAuthor(session?.user?.id, createdBy);
}

/**
 * 判断当前用户是否为多个内容之一的作者
 * @param createdByIds - 内容创建者的ID数组
 * @returns boolean - 如果当前用户是任一内容的作者返回 true
 */
export function useIsAuthorOfAny(
  createdByIds: (number | string | null | undefined)[]
): boolean {
  const { data: session } = useSession();

  if (!session?.user?.id) {
    return false;
  }

  const userId = String(session.user.id);
  return createdByIds.some((id) => id && String(id) === userId);
}

/**
 * 获取当前用户ID
 * @returns string | null - 当前用户ID或null
 */
export function useCurrentUserId(): string | null {
  const { data: session } = useSession();
  return session?.user?.id || null;
}

/**
 * 判断当前用户是否有指定角色
 * @param role - 角色名称
 * @returns boolean
 */
export function useHasRole(role: string): boolean {
  const { data: session } = useSession();
  return session?.user?.role === role;
}

/**
 * 判断当前用户是否为管理员
 * @returns boolean
 */
export function useIsAdmin(): boolean {
  return useHasRole("admin");
}
