"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { useTheme } from "@/context/theme-context";
import { LanguageSelector } from "./language-selector";
import { SoundToggle } from "./sound-toggle";
import { isAdmin as checkIsAdmin } from "@/lib/admin";
import ExamSwitcher from "./ExamSwitcher";
import {
  Bell,
  Moon,
  Sun,
  Settings,
  LogOut,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";

export function TopNav() {
  const { user, logout, isAdmin } = useUser();
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

  // Debug: Log user data to console
  console.log('[TopNav] User data:', {
    role: user.role,
    subscription_status: user.subscription_status,
    shouldShowUpgrade: user?.role === 'student' && user?.subscription_status !== 'pro'
  });

  const isContributorRole = ["contributor", "admin"].includes(user.role || "");
  const menuItemClass =
    "flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <header className="hidden md:flex items-center justify-end gap-3 px-6 py-3 border-b sticky top-0 z-50 bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800">
      {/* Exam Switcher (only if user has multiple exams) */}
      <ExamSwitcher />

      {/* Debug info - TEMPORARY */}
      <div className="text-xs text-gray-500 px-2">
        Role: {user?.role || 'null'} | Sub: {user?.subscription_status || 'null'}
      </div>

      {/* Upgrade Button - Only for students with free subscription */}
      {user?.role === 'student' && user?.subscription_status !== 'pro' && (
        <Link
          href="/pricing"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Upgrade
        </Link>
      )}

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
            {checkIsAdmin(user.role, user.email) && (
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
