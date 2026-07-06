"use client";

import { useState } from "react";
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
  Search,
  BarChart3,
  TrendingUp,
  Trophy,
  Plus,
  Folder,
} from "lucide-react";
import { Icon3DTeacher } from "@/components/premium-3d-icons";

// Primary navigation group
const PRIMARY_NAV = [
  { href: "/", labelKey: "home" as const, fallback: "Home", icon: Home },
  { href: "/review", labelKey: "review" as const, fallback: "Review", icon: RotateCcw },
  { href: "/mock-test", labelKey: "mockTests" as const, fallback: "Mock Tests", icon: FileText },
  { href: "/sprint", labelKey: null, fallback: "Sprint", icon: Zap },
  { href: "/english", labelKey: null, fallback: "Learn English", icon: GraduationCap },
  { href: "/custom-quiz", labelKey: null, fallback: "Custom Quiz", icon: PenSquare },
  { href: "/study-materials", labelKey: null, fallback: "Study Materials", icon: BookOpen },
];

// Analytics group
const ANALYTICS_NAV = [
  { href: "/dashboard", labelKey: null, fallback: "Dashboard", icon: BarChart3 },
  { href: "/reports", labelKey: null, fallback: "Reports", icon: TrendingUp },
  { href: "/achievements", labelKey: null, fallback: "Achievements", icon: Trophy },
];

export function AppSidebar() {
  const { user } = useUser();
  const { t } = useLocale();
  const pathname = usePathname();
  const [userFolders, setUserFolders] = useState<string[]>([]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName?.trim()) {
      setUserFolders([...userFolders, folderName.trim()]);
    }
  };

  if (!user) return null;

  const isContributorRole = ["contributor", "admin"].includes(user.role || "");

  return (
    <aside className="hidden md:flex md:flex-col md:w-48 md:flex-shrink-0 sticky top-0 h-screen border-r bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 z-30">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 px-4 py-5 mb-2">
        <div className="w-8 h-8 bg-[#F26A4B] rounded-lg flex items-center justify-center text-white font-bold text-base">
          K
        </div>
        <span className="text-lg font-bold text-[#16213E] dark:text-white">Krakkify</span>
      </a>

      {/* Search Bar Placeholder */}
      <div className="px-4 pb-6">
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
                ? "bg-[rgba(242,106,75,0.08)] dark:bg-[#F26A4B]/20 text-[#F26A4B] dark:text-[#F58972]"
                : "text-[#16213E] dark:text-slate-300 hover:bg-[rgba(22,33,62,0.04)] dark:hover:bg-slate-900"
            }`}
          >
            <Icon3DTeacher size={20} />
            <span>Contributor Portal</span>
          </Link>
        ) : (
          <>
            {/* Primary Navigation Group */}
            <ul className="space-y-1 mb-4">
              {PRIMARY_NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey) : item.fallback;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-[rgba(242,106,75,0.08)] dark:bg-[#F26A4B]/20 text-[#F26A4B] dark:text-[#F58972]"
                          : "text-[#16213E] dark:text-slate-300 hover:bg-[rgba(22,33,62,0.04)] dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Group Separator */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-3" />

            {/* Analytics Group */}
            <ul className="space-y-1 mb-4">
              {ANALYTICS_NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey) : item.fallback;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-[rgba(242,106,75,0.08)] dark:bg-[#F26A4B]/20 text-[#F26A4B] dark:text-[#F58972]"
                          : "text-[#16213E] dark:text-slate-300 hover:bg-[rgba(22,33,62,0.04)] dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Group Separator */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-3" />

            {/* Your Folders Section */}
            <div className="px-3 pt-1 pb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Your folders
              </p>
            </div>

            {/* New Folder Button */}
            <button
              onClick={handleCreateFolder}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors mb-2"
            >
              <Plus className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span className="truncate">New folder</span>
            </button>

            {/* User Created Folders */}
            {userFolders.length > 0 && (
              <ul className="space-y-1">
                {userFolders.map((folderName, index) => (
                  <li key={index}>
                    <Link
                      href={`/folders/${encodeURIComponent(folderName)}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    >
                      <Folder className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      <span className="truncate">{folderName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
