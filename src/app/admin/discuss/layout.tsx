import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "讨论区",
  description: "Formulaic 讨论区 - 交流想法，分享经验",
};

export default function DiscussLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
