"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Dialog } from "@/components/dialog";
import {
  validateStudentId,
  validateHustEmail,
  validatePassword,
  getPasswordStrengthInfo,
} from "@/lib/validation";
import { apiPost } from "@/lib/api-client";
import { showToast } from "@/components/toast";
import LoadingButton from "@/components/loading-button";

export default function SignInPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    student_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 登录
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        // 前端验证
        if (!validateStudentId(formData.student_id)) {
          setError("学号格式错误，必须是 M202XXXXXX 格式（X为数字）");
          setLoading(false);
          return;
        }

        if (!validateHustEmail(formData.email)) {
          setError("邮箱必须是 @hust.edu.cn 结尾");
          setLoading(false);
          return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          setError(`密码不符合要求：${passwordValidation.errors.join("；")}`);
          setLoading(false);
          return;
        }

        // 注册
        const result = await apiPost("/api/auth/register", formData);

        if (result.success && result.data) {
          if (result.statusCode == 201) {
            // 201 状态码表示已注册但无法自动登录
            showToast(
              result.message ??
                "注册成功！请联系管理员审核并启用您的账号，启用后方可登录。",
              "warning"
            );
            setIsLogin(true);
            setError("");
          } else {
            // 注册成功后自动登录
            const signInResult = await signIn("credentials", {
              email: formData.email,
              password: formData.password,
              redirect: false,
            });

            if (!signInResult?.error) {
              setShowSuccessDialog(true);
            }
          }
        } else if (result.error) {
          if (result.error.includes("：")) {
            setError(result.error);
          } else {
            setError(result.error || "注册失败");
          }
        }
      }
    } catch (error) {
      setError("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength =
    !isLogin && formData.password
      ? getPasswordStrengthInfo(formData.password)
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fd-primary/5 via-fd-background to-fd-secondary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fd-foreground mb-2">
            Formulaic
          </h1>
        </div>

        {/* 登录/注册卡片 */}
        <div className="bg-fd-card border border-fd-border rounded-xl p-8 backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg bg-fd-secondary/50 p-1">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-fd-primary text-fd-primary-foreground shadow-sm"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                登录
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-fd-primary text-fd-primary-foreground shadow-sm"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                注册
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-fd-border rounded-lg bg-fd-background text-fd-foreground placeholder:text-fd-muted-foreground focus:ring-2 focus:ring-fd-primary focus:border-transparent transition-all"
                    required={!isLogin}
                    placeholder="请输入用户名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-fd-foreground">
                    学号{" "}
                    <span className="text-fd-muted-foreground text-xs">
                      (M202XXXXXX)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.student_id}
                    onChange={(e) =>
                      setFormData({ ...formData, student_id: e.target.value })
                    }
                    placeholder="M202XXXXXX"
                    className="w-full px-4 py-3 border border-fd-border rounded-lg bg-fd-background text-fd-foreground placeholder:text-fd-muted-foreground focus:ring-2 focus:ring-fd-primary focus:border-transparent transition-all"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-fd-foreground">
                邮箱{" "}
                {!isLogin && (
                  <span className="text-fd-muted-foreground text-xs">
                    (@hust.edu.cn)
                  </span>
                )}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={!isLogin ? "yourname@hust.edu.cn" : "请输入邮箱"}
                className="w-full px-4 py-3 border border-fd-border rounded-lg bg-fd-background text-fd-foreground placeholder:text-fd-muted-foreground focus:ring-2 focus:ring-fd-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center justify-between text-fd-foreground">
                <span>密码</span>
                {passwordStrength && (
                  <span className={`text-xs ${passwordStrength.color}`}>
                    强度：{passwordStrength.text}
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-20 border border-fd-border rounded-lg bg-fd-background text-fd-foreground placeholder:text-fd-muted-foreground focus:ring-2 focus:ring-fd-primary focus:border-transparent transition-all"
                  required
                  minLength={8}
                  placeholder={
                    !isLogin
                      ? "至少8位，包含大小写字母、数字和符号"
                      : "请输入密码"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fd-muted-foreground hover:text-fd-foreground transition-colors p-1 rounded hover:bg-fd-secondary"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {!isLogin && formData.password && (
                <p className="text-xs text-fd-muted-foreground mt-2">
                  密码必须包含：大写字母、小写字母、数字、特殊符号
                </p>
              )}
            </div>

            <LoadingButton
              loading={loading}
              type="submit"
              loadingText={isLogin ? "登录中..." : "注册中..."}
              normalText={isLogin ? "登录" : "注册"}
              className="w-full py-3 text-md"
            />
          </form>

          <div className="mt-6 text-center text-sm text-fd-muted-foreground">
            {isLogin ? (
              <p>
                还没有账号？
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className="text-fd-primary cursor-pointer hover:underline ml-1 font-medium"
                >
                  立即注册
                </button>
              </p>
            ) : (
              <p>
                已有账号？
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className="text-fd-primary cursor-pointer hover:underline ml-1 font-medium"
                >
                  立即登录
                </button>
              </p>
            )}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 text-sm text-fd-muted-foreground">
          <p>© 2025 Formulaic. All rights reserved.</p>
        </div>
      </div>

      {/* 注册成功对话框 */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={() => {
          setShowSuccessDialog(false);
          router.push("/");
          router.refresh();
        }}
        title="注册成功"
        description="您的账号已成功注册！点击确定开始使用。"
        confirmText="确定"
        type="info"
      />
    </div>
  );
}
