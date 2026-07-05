"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { useTheme } from "@/context/theme-context";
import { LanguageSelector } from "./language-selector";
import { SoundToggle } from "./sound-toggle";
import { isAdmin } from "@/lib/admin";
import {
  Home,
  RotateCcw,
  FileText,
  Zap,
  GraduationCap,
  PenSquare,
  BookOpen,
  Star,
  Moon,
  Sun,
  BarChart3,
  TrendingUp,
  Trophy,
  Settings,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { Icon3DTeacher } from "@/components/premium-3d-icons";

const NAV_ITEMS = [
  { href: "/", labelKey: "home" as const, fallback: "Home", icon: Home },
  { href: "/review", labelKey: "review" as const, fallback: "Review", icon: RotateCcw },
  { href: "/mock-test", labelKey: "mockTests" as const, fallback: "Mock Tests", icon: FileText },
  { href: "/sprint", labelKey: null, fallback: "Sprint", icon: Zap },
  { href: "/english", labelKey: null, fallback: "Learn English", icon: GraduationCap },
  { href: "/custom-quiz", labelKey: null, fallback: "Custom Quiz", icon: PenSquare },
  { href: "/study-materials", labelKey: null, fallback: "Study Materials", icon: BookOpen },
];

export function AppSidebar() {
  const { user, logout } = useUser();
  const { t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

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
    "flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100";

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 sticky top-0 h-screen border-r z-40" style={{ backgroundColor: '#12141F', borderColor: 'rgba(0,0,0,0.2)', color: '#cbd5e1' }}>
      {/* Logo */}
      <a href="/" className="flex items-center gap-3 px-6 py-6">
        <div className="w-9 h-9 bg-[#4255FF] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
          K
        </div>
        <span className="text-xl font-bold text-white">Krakkify</span>
      </a>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4">
        {isContributorRole ? (
          <Link
            href="/contributor"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/contributor") ? "bg-[#4255FF] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon3DTeacher size={20} />
            Contributor Portal
          </Link>
        ) : (
          <>
            <p className="px-3 pt-2 pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Main Menu
            </p>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey) : item.fallback;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active ? "bg-[#4255FF] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="flex-1 truncate">{label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Upgrade CTA */}
            <Link
              href="/pricing"
              className={`mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/pricing") ? "bg-amber-500/20 text-amber-300" : "text-amber-400 hover:bg-amber-500/10"
              }`}
            >
              <Star className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor" />
              Upgrade
            </Link>
          </>
        )}
      </nav>

      {/* Sound + Language row */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
          <SoundToggle />
          <LanguageSelector />
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative px-4 pb-6 pt-4 border-t border-white/10" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label={`${showMenu ? "Close" : "Open"} user menu`}
          aria-expanded={showMenu}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: user.avatar_color || "#6366f1" }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">
              {user.role === "admin" ? "Admin" : user.role === "contributor" ? "Contributor" : "Student"}
            </p>
          </div>
        </button>

        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 rounded-2xl shadow-lg overflow-hidden bg-white border border-slate-200 z-50">
            {/* Student Links */}
            {!isContributorRole && (
              <div className="py-2 border-b border-slate-200">
                <Link href="/dashboard" className={menuItemClass} onClick={() => setShowMenu(false)}>
                  <BarChart3 className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  Dashboard
                </Link>
                <Link href="/reports" className={menuItemClass} onClick={() => setShowMenu(false)}>
                  <TrendingUp className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  Reports
                </Link>
                <Link href="/achievements" className={menuItemClass} onClick={() => setShowMenu(false)}>
                  <Trophy className="w-5 h-5 flex-shrink-0 text-slate-500" />
                  Achievements
                </Link>
              </div>
            )}

            {/* Admin Links */}
            {isAdmin(user.role, user.email) && (
              <div className="py-2 border-b border-slate-200">
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

            <div className="py-2 border-b border-slate-200">
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
    </aside>
  );
}
