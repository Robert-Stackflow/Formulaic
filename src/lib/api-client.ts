import { showToast } from "@/components/toast";

interface ApiOptions extends RequestInit {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

/**
 * 统一的API请求函数
 * 自动处理错误和Toast提示
 */
export async function apiRequest<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<{
  success: boolean;
  statusCode: Number;
  data?: T;
  error?: string;
  message?: string;
}> {
  const {
    showSuccessToast = false,
    successMessage,
    showErrorToast = true,
    errorMessage,
    ...fetchOptions
  } = options;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    const data = await response.json();

    const message =
      data.message || (response.ok ? successMessage : errorMessage);

    const statusCode = response.status;

    if (!response.ok) {
      // 服务器返回错误
      const error = data.error || errorMessage || "操作失败";
      if (showErrorToast) {
        showToast(error, "error");
      }
      return { success: false, statusCode, error, data, message };
    }

    // 请求成功
    if (showSuccessToast && successMessage) {
      showToast(successMessage, "success");
    }

    return { success: true, statusCode, data, message };
  } catch (error) {
    // 网络错误或其他异常
    const errorMsg = errorMessage || "网络错误，请稍后重试";
    if (showErrorToast) {
      showToast(errorMsg, "error");
    }
    return { success: false, statusCode: 500, error: errorMsg };
  }
}

/**
 * GET 请求
 */
export async function apiGet<T = any>(
  url: string,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<{
  success: boolean;
  statusCode: Number;
  data?: T;
  error?: string;
  message?: string;
}> {
  return apiRequest<T>(url, { ...options, method: "GET" });
}

/**
 * POST 请求
 */
export async function apiPost<T = any>(
  url: string,
  body?: any,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<{
  success: boolean;
  statusCode: Number;
  data?: T;
  error?: string;
  message?: string;
}> {
  return apiRequest<T>(url, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT 请求
 */
export async function apiPut<T = any>(
  url: string,
  body?: any,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<{
  success: boolean;
  statusCode: Number;
  data?: T;
  error?: string;
  message?: string;
}> {
  return apiRequest<T>(url, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PATCH 请求
 */
export async function apiPatch<T = any>(
  url: string,
  body?: any,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<{
  success: boolean;
  statusCode: Number;
  data?: T;
  error?: string;
  message?: string;
}> {
  return apiRequest<T>(url, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE 请求
 */
export async function apiDelete<T = any>(
  url: string,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<{
  success: boolean;
  statusCode: Number;
  data?: T;
  error?: string;
  message?: string;
}> {
  return apiRequest<T>(url, { ...options, method: "DELETE" });
}
