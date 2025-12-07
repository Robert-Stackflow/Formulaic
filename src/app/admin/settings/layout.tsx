import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户设置",
  description: "管理您的账户设置和偏好",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
