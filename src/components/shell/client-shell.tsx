"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";

export default function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return <>{children}</>;
  }
  return <AppShell>{children}</AppShell>;
}
