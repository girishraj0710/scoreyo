"use client";

import { ReactNode } from "react";
import { useUser } from "@/context/user-context";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
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
      {/* Mobile header (hidden on desktop) */}
      {showHeaderFooter && <AppHeader />}

      <div className="flex flex-1">
        {/* Desktop sidebar (hidden on mobile) */}
        {showHeaderFooter && <AppSidebar />}

        <div className="flex flex-col flex-1 min-w-0">
          {/* Desktop top nav (hidden on mobile) */}
          {showHeaderFooter && <TopNav />}

          <main className="flex-1">{children}</main>
          {showHeaderFooter && <AppFooter />}
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      {showHeaderFooter && <MobileTabBar />}

      {/* Check if existing users need to select a role */}
      <RoleSelectionChecker />
    </>
  );
}
