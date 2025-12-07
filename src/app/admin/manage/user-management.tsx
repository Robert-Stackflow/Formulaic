// pages/admin/user-management.tsx

import React, { useState, useRef } from "react";
import {
  ChevronDown,
  X,
  Copy,
  MoreVertical,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  FileInput,
} from "lucide-react";
import { Dialog } from "@/components/dialog";
import { FormDialog } from "@/components/form-dialog";
import { DropdownMenu } from "@/components/dropdown-menu";
import LoadingWrapper from "@/components/loading-wrapper";
import LoadingButton from "@/components/loading-button";
import { showToast } from "@/components/toast";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";
import { User } from "@/types/admin";

interface UserManagementProps {
  users: User[];
  loadData: () => Promise<void>;
}

/**
 * 用户管理 Tab 内容
 */
export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  loadData,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    student_id: "",
    password: "",
    role: "user" as "user" | "admin",
    can_view_todo: 1,
    can_edit_todo: 0,
    can_create_todo_board: 0,
    can_view_discuss: 1,
    can_post_discuss: 1,
    can_create_board: 0,
  });
  const [showCreateRoleDropdown, setShowCreateRoleDropdown] = useState(false);
  const [showEditRoleDropdown, setShowEditRoleDropdown] = useState(false);
  const [submitEditingStatusMap, setSubmitEditingStatusMap] = useState<
    Record<string, boolean>
  >({});
  const [submitDeletingUser, setSubmitDeletingUser] = useState(false);
  const [submitEditingUser, setSubmitEditingUser] = useState(false);
  const [submitCreatingUser, setSubmitCreatingUser] = useState(false);
  const [submitResettingPassword, setSubmitResettingPassword] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const createRoleDropdownRef = useRef<HTMLDivElement>(null);
  const editRoleDropdownRef = useRef<HTMLDivElement>(null);

  const handleUpdatePermission = async (
    userId: number,
    permission: string,
    value: boolean
  ) => {
    const result = await apiPatch(
      "/api/admin/users",
      {
        userId,
        permissions: { [permission]: value },
      },
      {
        showSuccessToast: true,
        successMessage: "权限更新成功",
      }
    );

    if (result.success) {
      loadData();
    }
  };

  const handleCreateUser = async () => {
    console.log(newUserForm);
    if (
      !newUserForm.username ||
      !newUserForm.email ||
      !newUserForm.student_id ||
      !newUserForm.password
    ) {
      showToast("请填写所有必填字段", "error");
      return;
    }

    setSubmitCreatingUser(true);
    const result = await apiPost("/api/auth/register", newUserForm, {
      showSuccessToast: true,
      successMessage: "用户创建成功",
    });
    setSubmitCreatingUser(false);

    if (result.success) {
      setShowCreateUser(false);
      setNewUserForm({
        username: "",
        email: "",
        student_id: "",
        password: "",
        role: "user",
        can_view_todo: 1,
        can_edit_todo: 0,
        can_create_todo_board: 0,
        can_view_discuss: 1,
        can_post_discuss: 0,
        can_create_board: 0,
      });
      loadData();
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetPasswordUser || !newPassword.trim()) return;

    setSubmitResettingPassword(true);
    const result = await apiPatch(
      `/api/admin/users/${resetPasswordUser.id}/password`,
      { password: newPassword },
      {
        showSuccessToast: true,
        successMessage: "密码重置成功",
      }
    );
    setSubmitResettingPassword(false);

    if (result.success) {
      setResetPasswordUser(null);
      setNewPassword("");
    }
  };

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitEditingUser(true);
    const result = await apiPatch(
      `/api/admin/users/${editingUser.id}`,
      {
        username: editingUser.username,
        email: editingUser.email,
        student_id: editingUser.student_id || editingUser.student_id,
        role: editingUser.role,
        can_view_todo: editingUser.can_view_todo,
        can_edit_todo: editingUser.can_edit_todo,
        can_create_todo_board: editingUser.can_create_todo_board,
        can_view_discuss: editingUser.can_view_discuss,
        can_post_discuss: editingUser.can_post_discuss,
        can_create_board: editingUser.can_create_board,
      },
      {
        showSuccessToast: true,
        successMessage: "用户信息和权限更新成功",
      }
    );
    setSubmitEditingUser(false);

    if (result.success) {
      setEditingUser(null);
      loadData();
    }
  };

  const handleToggleUserStatus = async (
    userId: number,
    currentStatus: number
  ) => {
    setSubmitEditingStatusMap((prev) => ({
      ...prev,
      [userId]: true,
    }));
    const result = await apiPatch(
      `/api/admin/users/${userId}/status`,
      { disabled: currentStatus === 1 ? 0 : 1 },
      {
        showSuccessToast: true,
        successMessage: currentStatus === 1 ? "用户已启用" : "用户已禁用",
      }
    );
    setSubmitEditingStatusMap((prev) => ({
      ...prev,
      [userId]: false,
    }));

    if (result.success) {
      loadData();
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUserId) return;

    setSubmitDeletingUser(true);
    const result = await apiDelete(`/api/admin/users/${deletingUserId}`, {
      showSuccessToast: true,
      successMessage: "用户已删除",
    });
    setSubmitDeletingUser(false);

    if (result.success) {
      setDeletingUserId(null);
      loadData();
    }
  };

  return (
    <>
      {/* 用户管理 */}
      {
        <div className="space-y-4">
          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCreateUser(!showCreateUser);
              }}
              className="px-4 py-2 cursor-pointer bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              {showCreateUser ? "关闭创建用户" : "创建新用户"}
            </button>
          </div>

          {/* 创建用户表单 */}
          {showCreateUser && (
            <div className="p-4 bg-fd-card border border-fd-border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-fd-foreground">
                创建新用户
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    学号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserForm.student_id}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        student_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    角色
                  </label>
                  <div className="relative" ref={createRoleDropdownRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setShowCreateRoleDropdown(!showCreateRoleDropdown)
                      }
                      className="w-full px-3 py-2 cursor-pointer bg-fd-background border border-fd-border rounded-md text-fd-foreground text-left flex items-center justify-between hover:border-fd-primary focus:outline-none focus:ring-2 focus:ring-fd-primary transition-colors"
                    >
                      <span>
                        {newUserForm.role === "admin" ? "管理员" : "普通用户"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-fd-muted-foreground transition-transform ${
                          showCreateRoleDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showCreateRoleDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg overflow-hidden animate-in fade-in duration-200">
                        <div
                          onClick={() => {
                            setNewUserForm({ ...newUserForm, role: "user" });
                            setShowCreateRoleDropdown(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-fd-muted/50 text-fd-foreground transition-colors"
                        >
                          普通用户
                        </div>
                        <div
                          onClick={() => {
                            setNewUserForm({ ...newUserForm, role: "admin" });
                            setShowCreateRoleDropdown(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-fd-muted/50 text-fd-foreground transition-colors"
                        >
                          管理员
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="border border-fd-border rounded-lg p-4 bg-fd-muted/20 mb-4">
                <label className="block text-sm font-medium mb-3 text-fd-foreground">
                  默认权限
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.can_view_todo === 1}
                      onChange={(e) =>
                        setNewUserForm({
                          ...newUserForm,
                          can_view_todo: e.target.checked ? 1 : 0,
                        })
                      }
                      className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded"
                    />
                    <span className="ml-2 text-sm text-fd-foreground">
                      查看TODO
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.can_edit_todo === 1}
                      onChange={(e) =>
                        setNewUserForm({
                          ...newUserForm,
                          can_edit_todo: e.target.checked ? 1 : 0,
                        })
                      }
                      className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded"
                    />
                    <span className="ml-2 text-sm text-fd-foreground">
                      编辑TODO
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.can_create_todo_board === 1}
                      onChange={(e) =>
                        setNewUserForm({
                          ...newUserForm,
                          can_create_todo_board: e.target.checked ? 1 : 0,
                        })
                      }
                      className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded"
                    />
                    <span className="ml-2 text-sm text-fd-foreground">
                      创建TODO看板
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.can_view_discuss === 1}
                      onChange={(e) =>
                        setNewUserForm({
                          ...newUserForm,
                          can_view_discuss: e.target.checked ? 1 : 0,
                        })
                      }
                      className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded"
                    />
                    <span className="ml-2 text-sm text-fd-foreground">
                      查看讨论区
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.can_post_discuss === 1}
                      onChange={(e) =>
                        setNewUserForm({
                          ...newUserForm,
                          can_post_discuss: e.target.checked ? 1 : 0,
                        })
                      }
                      className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded"
                    />
                    <span className="ml-2 text-sm text-fd-foreground">
                      发布主题
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUserForm.can_create_board === 1}
                      onChange={(e) =>
                        setNewUserForm({
                          ...newUserForm,
                          can_create_board: e.target.checked ? 1 : 0,
                        })
                      }
                      className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded"
                    />
                    <span className="ml-2 text-sm text-fd-foreground">
                      创建讨论板块
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90"
                >
                  取消
                </button>
                <LoadingButton
                  loading={submitCreatingUser}
                  onClick={handleCreateUser}
                  loadingText={"创建中..."}
                  normalText={"创建"}
                  iconName={"UserPlus"}
                />
              </div>
            </div>
          )}

          {/* 用户列表 */}
          <div className="px-2 py-2 bg-fd-card border border-fd-border rounded-lg hover:border-fd-primary transition-all">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-fd-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      用户名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      学号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      邮箱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      权限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fd-border">
                  {users.map((user: User) => (
                    <tr
                      key={user.id}
                      className="hover:bg-fd-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fd-foreground">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                        {user.student_id || user.student_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "superadmin"
                              ? "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
                              : user.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                              : "bg-fd-muted text-fd-muted-foreground border border-fd-border"
                          }`}
                        >
                          {user.role === "superadmin"
                            ? "超级管理员"
                            : user.role === "admin"
                            ? "管理员"
                            : "普通用户"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {user.can_view_todo === 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                              查看TODO
                            </span>
                          )}
                          {user.can_edit_todo === 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
                              编辑TODO
                            </span>
                          )}
                          {user.can_create_todo_board === 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                              创建TODO看板
                            </span>
                          )}
                          {user.can_view_discuss === 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800">
                              查看讨论区
                            </span>
                          )}
                          {user.can_post_discuss === 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                              发布主题
                            </span>
                          )}
                          {user.can_create_board === 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800">
                              创建板块
                            </span>
                          )}
                          {user.can_view_todo === 0 &&
                            user.can_edit_todo === 0 &&
                            user.can_create_todo_board === 0 &&
                            user.can_view_discuss === 0 &&
                            user.can_post_discuss === 0 &&
                            user.can_create_board === 0 && (
                              <span className="text-fd-muted-foreground text-xs">
                                暂无权限
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.role === "superadmin" ? (
                          <span className="text-fd-muted-foreground text-xs">
                            -
                          </span>
                        ) : (
                          <LoadingWrapper
                            loading={submitEditingStatusMap[user.id] ?? false}
                          >
                            <button
                              onClick={() =>
                                handleToggleUserStatus(user.id, user.disabled)
                              }
                              disabled={
                                submitEditingStatusMap[user.id] ?? false
                              }
                              className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fd-primary focus:ring-offset-2 ${
                                user.disabled === 0
                                  ? "bg-green-600"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                              role="switch"
                              aria-checked={user.disabled === 0}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  user.disabled === 0
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </LoadingWrapper>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2 items-center whitespace-nowrap">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="px-3 py-1.5 cursor-pointer text-xs font-medium bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                          >
                            编辑
                          </button>
                          <DropdownMenu
                            items={[
                              {
                                label: "重置密码",
                                icon: <KeyRound className="w-4 h-4" />,
                                onClick: (e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  setResetPasswordUser(user);
                                },
                              },
                              ...(user.role !== "superadmin"
                                ? [
                                    {
                                      label: "删除",
                                      icon: <Trash2 className="w-4 h-4" />,
                                      onClick: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setDeletingUserId(user.id);
                                      },
                                      className:
                                        "text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-950/20",
                                    },
                                  ]
                                : []),
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      {/* 编辑用户模态框 */}
      <FormDialog
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title="编辑用户信息"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              type="submit"
              form="edit-user-form"
              loading={submitEditingUser}
              loadingText={"保存中..."}
              normalText={"保存"}
              iconName={"Save"}
            />
          </>
        }
      >
        {editingUser && (
          <form
            id="edit-user-form"
            onSubmit={handleEditUser}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-fd-foreground">
                用户名
              </label>
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    username: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-fd-foreground">
                邮箱
              </label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-fd-foreground">
                学号
              </label>
              <input
                type="text"
                value={editingUser.student_id || editingUser.student_id}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    student_id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-fd-foreground">
                角色
              </label>
              {editingUser.role === "superadmin" ? (
                <div className="w-full px-3 py-2 bg-fd-muted border border-fd-border rounded-md text-fd-muted-foreground cursor-not-allowed">
                  超级管理员（不可修改）
                </div>
              ) : (
                <div className="relative" ref={editRoleDropdownRef}>
                  <button
                    type="button"
                    onClick={() =>
                      setShowEditRoleDropdown(!showEditRoleDropdown)
                    }
                    className="w-full px-3 py-2 cursor-pointer bg-fd-background border border-fd-border rounded-md text-fd-foreground text-left flex items-center justify-between hover:border-fd-primary focus:outline-none focus:ring-2 focus:ring-fd-primary transition-colors"
                  >
                    <span>
                      {editingUser.role === "admin" ? "管理员" : "普通用户"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-fd-muted-foreground transition-transform ${
                        showEditRoleDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showEditRoleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-fd-card border border-fd-border rounded-md shadow-lg overflow-hidden animate-in fade-in duration-200">
                      <div
                        onClick={() => {
                          setEditingUser({ ...editingUser, role: "user" });
                          setShowEditRoleDropdown(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-fd-muted/50 text-fd-foreground transition-colors"
                      >
                        普通用户
                      </div>
                      <div
                        onClick={() => {
                          setEditingUser({ ...editingUser, role: "admin" });
                          setShowEditRoleDropdown(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-fd-muted/50 text-fd-foreground transition-colors"
                      >
                        管理员
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-fd-border rounded-lg p-4 bg-fd-muted/20">
              <label className="block text-sm font-medium mb-3 text-fd-foreground">
                权限设置
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.can_view_todo === 1}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        can_view_todo: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary"
                  />
                  <span className="ml-2 text-sm text-fd-foreground">
                    查看TODO
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.can_edit_todo === 1}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        can_edit_todo: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary"
                  />
                  <span className="ml-2 text-sm text-fd-foreground">
                    编辑TODO
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.can_create_todo_board === 1}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        can_create_todo_board: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary"
                  />
                  <span className="ml-2 text-sm text-fd-foreground">
                    创建TODO看板
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.can_view_discuss === 1}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        can_view_discuss: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary"
                  />
                  <span className="ml-2 text-sm text-fd-foreground">
                    查看讨论区
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.can_post_discuss === 1}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        can_post_discuss: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary"
                  />
                  <span className="ml-2 text-sm text-fd-foreground">
                    发布主题
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.can_create_board === 1}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        can_create_board: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary"
                  />
                  <span className="ml-2 text-sm text-fd-foreground">
                    创建讨论板块
                  </span>
                </label>
              </div>
            </div>
          </form>
        )}
      </FormDialog>

      {/* 重置密码模态框 */}
      <FormDialog
        isOpen={resetPasswordUser !== null}
        onClose={() => {
          setResetPasswordUser(null);
          setNewPassword("");
        }}
        title="重置密码"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setResetPasswordUser(null);
                setNewPassword("");
              }}
              className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              取消
            </button>
            <LoadingButton
              type="submit"
              form="reset-password-form"
              loading={submitResettingPassword}
              disabled={!newPassword.trim()}
              loadingText={"重置中..."}
              normalText={"重置密码"}
              iconName={"Save"}
            />
          </>
        }
      >
        {resetPasswordUser && (
          <>
            <div className="mb-4 p-3 rounded-md bg-fd-muted/40 border border-fd-border flex flex-col gap-1">
              <div className="text-sm text-fd-muted-foreground">
                为以下用户重置密码：
              </div>
              <div className="font-semibold text-base text-fd-foreground flex items-center gap-2">
                <span>{resetPasswordUser.username}</span>
                <span className="text-xs text-fd-muted-foreground">
                  ({resetPasswordUser.email})
                </span>
              </div>
            </div>
            <form
              id="reset-password-form"
              onSubmit={handleResetPassword}
              className="space-y-4"
              autoComplete="off"
            >
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-fd-foreground">
                  新密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码（至少8位，包含大小写字母和数字）"
                    className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary pr-10"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fd-muted-foreground hover:text-fd-foreground transition-colors p-1 rounded hover:bg-fd-secondary"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-fd-muted-foreground">
                  密码要求：至少8位，包含大小写字母和数字
                </p>
              </div>
            </form>
          </>
        )}
      </FormDialog>

      {/* 删除用户确认对话框 */}
      <Dialog
        isOpen={deletingUserId !== null}
        onClose={() => setDeletingUserId(null)}
        title="确认删除用户"
        description="确定要删除这个用户吗？用户的所有数据将被删除，此操作不可恢复。"
        onConfirm={handleDeleteUser}
        loading={submitDeletingUser}
        loadingText="删除中..."
        confirmText="删除"
        cancelText="取消"
        type="danger"
      />
    </>
  );
};
