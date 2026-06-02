"use client";

import { ReactNode } from "react";
import { useUser } from "@/context/user-context";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { RoleSelectionChecker } from "@/components/role-selection-checker";

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();

  // Show header/footer only for logged-in users
  // Landing page (for non-logged users) has its own header built-in
  const showHeaderFooter = !isLoading && user;

  return (
    <>
      {showHeaderFooter && <AppHeader />}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && <AppFooter />}
      {showHeaderFooter && <MobileTabBar />}
      {/* Check if existing users need to select a role */}
      <RoleSelectionChecker />
    </>
  );
}
