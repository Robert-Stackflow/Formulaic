// 发送邮件通知（已禁用）
export async function sendEmailNotification(
  email: string,
  subject: string,
  message: string
) {
  // 邮件通知功能已禁用
  console.log(
    `Email notification disabled. Would send to ${email}: ${subject}`
  );
}

// 发送 PushPlus 通知
export async function sendPushPlusNotification(
  token: string,
  title: string,
  content: string
) {
  try {
    const response = await fetch("http://www.pushplus.plus/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        title,
        content,
        template: "html",
      }),
    });

    if (!response.ok) {
      console.error("PushPlus notification failed:", await response.text());
    }
  } catch (error) {
    console.error("Send PushPlus notification error:", error);
  }
}
