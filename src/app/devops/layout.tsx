import type { ReactNode } from "react";
import { DocLayoutWrapper } from "@/components/docs/doc-layout-wrapper";
import { devopsSource } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return <DocLayoutWrapper source={devopsSource}>{children}</DocLayoutWrapper>;
}
