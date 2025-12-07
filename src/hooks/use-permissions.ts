import { useSession } from "next-auth/react";

export type Permission =
  | "can_view_todo"
  | "can_edit_todo"
  | "can_create_todo_board"
  | "can_view_discuss"
  | "can_post_discuss"
  | "can_create_discuss_board";

export function usePermissions() {
  const { data: session } = useSession();

  // 检查是否为管理员（包括超级管理员）
  const isAdmin = () => {
    return (
      session?.user?.role === "admin" || session?.user?.role === "superadmin"
    );
  };

  // 检查是否为超级管理员
  const isSuperAdmin = () => {
    return session?.user?.role === "superadmin";
  };

  // 检查单个权限
  const hasPermission = (permission: Permission): boolean => {
    if (!session?.user) return false;

    // 超级管理员和管理员拥有所有权限
    if (isAdmin()) return true;

    // 检查具体权限
    return Boolean((session.user as any)[permission]);
  };

  // 检查多个权限（需要全部满足）
  const hasAllPermissions = (...permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  // 检查多个权限（满足任一即可）
  const hasAnyPermission = (...permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  // 是否已登录
  const isAuthenticated = (): boolean => {
    return Boolean(session?.user);
  };

  return {
    session,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    // 快捷方法
    canViewTodo: () => hasPermission("can_view_todo"),
    canEditTodo: () => hasPermission("can_edit_todo"),
    canCreateTodoBoard: () => hasPermission("can_create_todo_board"),
    canViewDiscuss: () => hasPermission("can_view_discuss"),
    canPostDiscuss: () => hasPermission("can_post_discuss"),
    canCreateDiscussBoard: () => hasPermission("can_create_discuss_board"),
  };
}
