import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理后台",
  description: "系统管理和配置",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
