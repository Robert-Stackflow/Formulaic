"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/validation";
import { LoadingContent } from "@/components/loading";
import { PageLayout, PageHeader } from "@/components/page-layout";
import { showToast } from "@/components/toast";
import { apiGet, apiPatch } from "@/lib/api-client";
import LoadingButton from "@/components/loading-button";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [settings, setSettings] = useState({
    notification_reply: true,
    notification_watch: false,
    notification_pushplus: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitEditingInfo, setSubmitEditingInfo] = useState(false);
  const [submitEditingNotifications, setSubmitEditingNotifications] =
    useState(false);
  const [submitUpdatingPassword, setSubmitUpdatingPassword] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    student_id: "",
    email: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      loadSettings();
    }
  }, [status]);

  const loadSettings = async () => {
    setLoading(true);
    const result = await apiGet("/api/user/settings");
    setLoading(false);
    if (result.success && result.data) {
      setUserInfo(result.data.user);
      setEditData({
        username: result.data.user.username,
        student_id: result.data.user.student_id,
        email: result.data.user.email,
      });
      setSettings({
        notification_reply: result.data.user.notification_reply === 1,
        notification_watch: result.data.user.notification_watch === 1,
        notification_pushplus: result.data.user.notification_pushplus || "",
      });
    }
  };

  const handleSaveUserInfo = async () => {
    setSubmitEditingInfo(true);
    const result = await apiPatch("/api/user/settings", editData, {
      showSuccessToast: true,
      successMessage: "基本信息已保存",
    });
    setSubmitEditingInfo(false);

    if (result.success) {
      setEditingInfo(false);
      loadSettings();
    }
  };

  const handleSaveNotifications = async (showToast = true) => {
    setSubmitEditingNotifications(true);
    const result = await apiPatch("/api/user/settings", settings, {
      showSuccessToast: showToast,
      successMessage: "通知设置已保存",
    });
    setSubmitEditingNotifications(false);
  };

  const handleNotificationChange = async (
    field: "notification_reply" | "notification_watch",
    value: boolean
  ) => {
    const newSettings = {
      ...settings,
      [field]: value,
    };
    setSettings(newSettings);

    // 自动保存
    setSubmitEditingNotifications(true);
    await apiPatch("/api/user/settings", newSettings, {
      showSuccessToast: false,
    });
    setSubmitEditingNotifications(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证新密码
    const validation = validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      showToast(`密码不符合要求：${validation.errors.join("；")}`, "error");
      return;
    }

    // 确认密码
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }

    setSubmitUpdatingPassword(true);
    const result = await apiPatch(
      "/api/user/settings",
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      {
        showSuccessToast: true,
        successMessage: "密码已更新",
      }
    );
    setSubmitUpdatingPassword(false);

    if (result.success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader title="用户设置" description="管理你的账号信息和偏好设置" />

      {status === "loading" || loading ? (
        <LoadingContent message="加载用户设置..." />
      ) : (
        <>
          {/* 用户信息 */}
          {userInfo && (
            <div className="bg-fd-card border border-fd-border rounded-lg transition-all p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-fd-foreground">
                  基本信息
                </h2>
                {!editingInfo && (
                  <button
                    onClick={() => setEditingInfo(true)}
                    className="text-sm px-3 py-1 cursor-pointer bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    编辑
                  </button>
                )}
              </div>

              {editingInfo ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-fd-foreground">
                      用户名
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={editData.username}
                      onChange={(e) =>
                        setEditData({ ...editData, username: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-fd-foreground">
                      学号{" "}
                      <span className="text-fd-muted-foreground text-xs">
                        (M开头表示硕士,D开头表示博士)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editData.student_id}
                      onChange={(e) =>
                        setEditData({ ...editData, student_id: e.target.value })
                      }
                      placeholder="M202XXXXXX 或 D202XXXXXX"
                      className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-fd-foreground">
                      邮箱{" "}
                      <span className="text-fd-muted-foreground text-xs">
                        (必须@hust.edu.cn)
                      </span>
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      placeholder="yourname@hust.edu.cn"
                      className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                    />
                  </div>
                  <div className="flex gap-3">
                    <LoadingButton
                      loading={submitEditingInfo}
                      onClick={handleSaveUserInfo}
                      loadingText={"保存中..."}
                      normalText={"保存"}
                      iconName={"Save"}
                    />
                    <button
                      onClick={() => {
                        setEditingInfo(false);
                        setEditData({
                          username: userInfo.username,
                          student_id: userInfo.student_id,
                          email: userInfo.email,
                        });
                      }}
                      className="px-4 py-2 cursor-pointer bg-fd-secondary text-fd-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="text-fd-muted-foreground w-20">
                      用户名：
                    </span>
                    <span className="text-fd-foreground font-medium">
                      {userInfo.username}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-fd-muted-foreground w-20">
                      学号：
                    </span>
                    <span className="text-fd-foreground">
                      {userInfo.student_id}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-fd-muted-foreground w-20">
                      邮箱：
                    </span>
                    <span className="text-fd-foreground">{userInfo.email}</span>
                  </div>
                  <div className="flex">
                    <span className="text-fd-muted-foreground w-20">
                      角色：
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userInfo.role === "superadmin"
                          ? "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
                          : userInfo.role === "admin"
                          ? "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                          : "bg-fd-muted text-fd-muted-foreground border border-fd-border"
                      }`}
                    >
                      {userInfo.role === "superadmin"
                        ? "超级管理员"
                        : userInfo.role === "admin"
                        ? "管理员"
                        : "普通用户"}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-fd-border">
                    <p className="font-semibold mb-3 text-fd-foreground">
                      我的权限：
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(userInfo.can_view_todo === 1 ||
                        userInfo.can_view_todo === true) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                          查看TODO
                        </span>
                      )}
                      {(userInfo.can_edit_todo === 1 ||
                        userInfo.can_edit_todo === true) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
                          编辑TODO
                        </span>
                      )}
                      {(userInfo.can_create_todo_board === 1 ||
                        userInfo.can_create_todo_board === true) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                          创建TODO看板
                        </span>
                      )}
                      {(userInfo.can_view_discuss === 1 ||
                        userInfo.can_view_discuss === true) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800">
                          查看讨论区
                        </span>
                      )}
                      {(userInfo.can_post_discuss === 1 ||
                        userInfo.can_post_discuss === true) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                          发布主题
                        </span>
                      )}
                      {(userInfo.can_create_discuss_board === 1 ||
                        userInfo.can_create_discuss_board === true) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800">
                          创建讨论区板块
                        </span>
                      )}
                      {userInfo.can_view_todo !== 1 &&
                        userInfo.can_edit_todo !== 1 &&
                        userInfo.can_create_todo_board !== 1 &&
                        userInfo.can_view_discuss !== 1 &&
                        userInfo.can_post_discuss !== 1 &&
                        userInfo.can_create_discuss_board !== 1 && (
                          <span className="text-fd-muted-foreground text-xs">
                            暂无权限
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 通知设置 */}
          <div className="bg-fd-card border border-fd-border rounded-lg transition-all p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-fd-foreground">
              通知设置
            </h2>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notification_reply}
                  onChange={(e) =>
                    handleNotificationChange(
                      "notification_reply",
                      e.target.checked
                    )
                  }
                  disabled={loading}
                  className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary mr-2 disabled:opacity-50"
                />
                <span className="text-fd-foreground">
                  有人回复我的评论时通知我
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notification_watch}
                  onChange={(e) =>
                    handleNotificationChange(
                      "notification_watch",
                      e.target.checked
                    )
                  }
                  disabled={loading}
                  className="w-4 h-4 text-fd-primary bg-fd-background border-fd-border rounded focus:ring-2 focus:ring-fd-primary mr-2 disabled:opacity-50"
                />
                <span className="text-fd-foreground">
                  我关注的主题有新回复时通知我
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium mb-2 text-fd-foreground">
                  PushPlus Token{" "}
                  <span className="text-fd-muted-foreground">(可选)</span>
                </label>
                <input
                  type="text"
                  value={settings.notification_pushplus}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notification_pushplus: e.target.value,
                    })
                  }
                  placeholder="在 pushplus.plus 获取 token"
                  className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                />
                <p className="text-xs text-fd-muted-foreground mt-1">
                  访问{" "}
                  <a
                    href="http://www.pushplus.plus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    pushplus.plus
                  </a>{" "}
                  获取 Token
                </p>
              </div>

              <LoadingButton
                loading={submitEditingNotifications}
                onClick={async () => await handleSaveNotifications(true)}
                loadingText={"保存中..."}
                normalText={"保存通知设置"}
                iconName={"Save"}
              />
            </div>
          </div>

          {/* 修改密码 */}
          <div className="bg-fd-card border border-fd-border rounded-lg transition-all p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-fd-foreground">
              修改密码
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-fd-foreground">
                  当前密码
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-fd-foreground">
                  新密码
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  placeholder="至少8位，包含大小写字母、数字和符号"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-fd-foreground">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-fd-background border border-fd-border rounded-md text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  required
                  minLength={8}
                />
              </div>

              <LoadingButton
                type="submit"
                loading={submitUpdatingPassword}
                loadingText={"更新中..."}
                normalText={"更新密码"}
                iconName={"Save"}
              />
            </form>
          </div>
        </>
      )}
    </PageLayout>
  );
}
