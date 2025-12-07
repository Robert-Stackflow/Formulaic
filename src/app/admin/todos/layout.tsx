import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TODO 看板",
  description: "管理项目任务和工作流程",
};

export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
