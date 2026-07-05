"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { useTheme } from "@/context/theme-context";
import { LanguageSelector } from "./language-selector";
import { SoundToggle } from "./sound-toggle";
import { isAdmin } from "@/lib/admin";
import {
  Plus,
  Moon,
  Sun,
  BarChart3,
  TrendingUp,
  Trophy,
  Settings,
  LogOut,
  AlertTriangle,
  FileText,
} from "lucide-react";

export function TopNav() {
  const { user, logout } = useUser();
  const { t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [showMenu]);

  if (!user) return null;

  const isContributorRole = ["contributor", "admin"].includes(user.role || "");
  const menuItemClass =
    "flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <header className="hidden md:flex items-center justify-end gap-3 px-6 py-3 border-b sticky top-0 z-50 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
      {/* Notifications Bell */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2} />
        {/* Notification badge (example - can be dynamic) */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Sound Toggle */}
      <SoundToggle />

      {/* Language Selector */}
      <LanguageSelector />

      {/* Profile Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all"
          style={{ backgroundColor: user.avatar_color || "#6366f1" }}
          aria-label={`${showMenu ? "Close" : "Open"} user menu`}
          aria-expanded={showMenu}
        >
          {user.name?.charAt(0).toUpperCase()}
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-50">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>

            {/* Admin Links */}
            {isAdmin(user.role, user.email) && (
              <div className="py-2 border-b border-slate-200 dark:border-slate-800">
                <Link href="/admin" className={menuItemClass} onClick={() => setShowMenu(false)}>
                  <BarChart3 className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  Analytics
                </Link>
                <Link href="/admin/questions" className={menuItemClass} onClick={() => setShowMenu(false)}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  Reported Questions
                </Link>
                <Link href="/admin/review-questions" className={menuItemClass} onClick={() => setShowMenu(false)}>
                  <FileText className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  Pending Questions
                </Link>
              </div>
            )}

            <div className="py-2 border-b border-slate-200 dark:border-slate-800">
              <Link href="/settings" className={menuItemClass} onClick={() => setShowMenu(false)}>
                <Settings className="w-5 h-5 flex-shrink-0 text-slate-500" />
                Settings
              </Link>
              <button
                onClick={() => toggleTheme()}
                className={`w-full text-left ${menuItemClass}`}
                aria-label={`Toggle ${isDarkMode ? "light" : "dark"} mode`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 flex-shrink-0 text-slate-500" />
                ) : (
                  <Moon className="w-5 h-5 flex-shrink-0 text-slate-500" />
                )}
                {isDarkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>

            <button
              onClick={async () => {
                setShowMenu(false);
                await logout();
                router.push("/");
              }}
              className={`w-full text-left ${menuItemClass}`}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-slate-500" />
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
