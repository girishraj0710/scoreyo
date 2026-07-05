"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import {
  Home,
  RotateCcw,
  FileText,
  Zap,
  GraduationCap,
  PenSquare,
  BookOpen,
  Users,
  Bell,
  Search,
} from "lucide-react";
import { Icon3DTeacher } from "@/components/premium-3d-icons";

const NAV_ITEMS = [
  { href: "/", labelKey: "home" as const, fallback: "Home", icon: Home },
  { href: "/library", labelKey: null, fallback: "Your library", icon: BookOpen },
  { href: "/study-groups", labelKey: null, fallback: "Study groups", icon: Users },
  { href: "/notifications", labelKey: null, fallback: "Notifications", icon: Bell },
];

const DIVIDER_LABEL = "Your folders";

const SECONDARY_NAV = [
  { href: "/review", labelKey: "review" as const, fallback: "Review", icon: RotateCcw },
  { href: "/mock-test", labelKey: "mockTests" as const, fallback: "Mock Tests", icon: FileText },
  { href: "/sprint", labelKey: null, fallback: "Sprint", icon: Zap },
  { href: "/english", labelKey: null, fallback: "Learn English", icon: GraduationCap },
  { href: "/custom-quiz", labelKey: null, fallback: "Custom Quiz", icon: PenSquare },
  { href: "/study-materials", labelKey: null, fallback: "Study Materials", icon: Search },
];

export function AppSidebar() {
  const { user } = useUser();
  const { t } = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (!user) return null;

  const isContributorRole = ["contributor", "admin"].includes(user.role || "");

  return (
    <aside className="hidden md:flex md:flex-col md:w-48 md:flex-shrink-0 sticky top-0 h-screen border-r bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 z-30">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 px-4 py-5">
        <div className="w-8 h-8 bg-[#4255FF] rounded-lg flex items-center justify-center text-white font-bold text-base">
          K
        </div>
        <span className="text-lg font-bold text-slate-900 dark:text-white">Krakkify</span>
      </a>

      {/* Search Bar Placeholder */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-sm">
          <Search className="w-4 h-4" />
          <span>Search...</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2">
        {isContributorRole ? (
          <Link
            href="/contributor"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/contributor")
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <Icon3DTeacher size={20} />
            <span>Contributor Portal</span>
          </Link>
        ) : (
          <>
            {/* Primary Navigation */}
            <ul className="space-y-0.5 mb-4">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey) : item.fallback;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Divider + Label */}
            <div className="px-3 pt-2 pb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {DIVIDER_LABEL}
              </p>
            </div>

            {/* Secondary Navigation */}
            <ul className="space-y-0.5">
              {SECONDARY_NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey) : item.fallback;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
}
