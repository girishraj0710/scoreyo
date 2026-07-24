"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/user-context";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
import { AppFooter } from "@/components/app-footer";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { RoleSelectionChecker } from "@/components/role-selection-checker";

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Full-screen routes (no sidebar, header, or footer)
  const isFullScreenRoute =
    pathname === "/blocks" ||
    pathname === "/match" ||
    pathname === "/blast-game" ||
    pathname === "/onboarding" || // Onboarding is a standalone flow — no app chrome, no escape until complete
    pathname.startsWith("/level-mode"); // Matches /level-mode AND /level-mode/[examId]

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.isCollapsed);
    };
    window.addEventListener('sidebar-toggle' as any, handleSidebarToggle);
    return () => window.removeEventListener('sidebar-toggle' as any, handleSidebarToggle);
  }, []);

  // Show header/footer only for logged-in users
  // Landing page (for non-logged users) has its own header built-in
  const showHeaderFooter = !isLoading && user && !isFullScreenRoute;

  // Full-screen routes render without any layout
  if (isFullScreenRoute) {
    return <>{children}</>;
  }

  // Compute main content classes
  const mainContentClasses = [
    'flex',
    'flex-col',
    'flex-1',
    'min-w-0',
    'transition-all',
    'duration-300',
    showHeaderFooter && (sidebarCollapsed ? 'md:ml-16' : 'md:ml-48'),
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile header (hidden on desktop) */}
      {showHeaderFooter && <AppHeader />}

      {/* Desktop: AppSidebar now includes the top header bar */}
      {showHeaderFooter && <AppSidebar />}

      <div className={mainContentClasses}>
        {/* Desktop top nav (hidden on mobile) - removed since header is in sidebar now */}
        {/* {showHeaderFooter && <TopNav />} */}

        <main className={`flex-1 ${showHeaderFooter ? 'md:mt-[96px]' : ''}`}>{children}</main>
        {showHeaderFooter && <AppFooter />}
      </div>

      {/* Mobile bottom tab bar */}
      {showHeaderFooter && <MobileTabBar />}

      {/* Check if existing users need to select a role */}
      <RoleSelectionChecker />
    </>
  );
}
