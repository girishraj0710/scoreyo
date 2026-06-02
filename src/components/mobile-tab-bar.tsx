"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, RotateCcw, Menu } from "lucide-react";

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: Trophy, label: "Dashboard" },
    { href: "/review", icon: RotateCcw, label: "Review" },
    { href: "/more", icon: Menu, label: "More" },
  ];

  // Don't show on quiz page or during quiz flow
  if (pathname.startsWith("/quiz") || pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden under fixed bar */}
      <div className="h-16 md:hidden" />

      {/* Fixed bottom tab bar - only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-4 h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "text-[#4255FF]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
