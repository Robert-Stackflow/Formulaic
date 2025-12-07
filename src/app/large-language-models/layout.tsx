import type { ReactNode } from "react";
import { DocLayoutWrapper } from "@/components/docs/doc-layout-wrapper";
import { llmSource } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return <DocLayoutWrapper source={llmSource}>{children}</DocLayoutWrapper>;
}
