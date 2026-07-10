"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Search,
  BarChart3,
  TrendingUp,
  Trophy,
  Plus,
  Folder,
  Layers,
  Menu,
  Bell,
  Settings,
  LogOut,
  AlertTriangle,
  Moon,
  Sun,
} from "lucide-react";
import { Icon3DTeacher } from "@/components/premium-3d-icons";
import { UniversalSearch } from "@/components/universal-search";

// Primary navigation group
const PRIMARY_NAV = [
  { href: "/", labelKey: "home" as const, fallback: "Home", icon: Home },
  { href: "/study-guides", labelKey: null, fallback: "Study Guides", icon: BookOpen },
  { href: "/flashcards", labelKey: null, fallback: "Flashcards", icon: Layers },
  { href: "/review", labelKey: "review" as const, fallback: "Review", icon: RotateCcw },
  { href: "/mock-test", labelKey: "mockTests" as const, fallback: "Mock Tests", icon: FileText },
  { href: "/sprint", labelKey: null, fallback: "Sprint", icon: Zap },
  { href: "/english", labelKey: null, fallback: "Learn English", icon: GraduationCap },
  { href: "/custom-quiz", labelKey: null, fallback: "Custom Quiz", icon: PenSquare },
];

// Analytics group
const ANALYTICS_NAV = [
  { href: "/dashboard", labelKey: null, fallback: "Dashboard", icon: BarChart3 },
  { href: "/reports", labelKey: null, fallback: "Reports", icon: TrendingUp },
  { href: "/achievements", labelKey: null, fallback: "Achievements", icon: Trophy },
];

export function AppSidebar() {
  const { user, logout } = useUser();
  const { t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const [userFolders, setUserFolders] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // Emit event for layout to adjust
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isCollapsed: newState } }));
  };

  useEffect(() => {
    if (!showProfileMenu) return;

    function handleClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [showProfileMenu]);

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
    <>
      {/* Top Header Bar - Fixed across page */}
      <header className="hidden md:flex items-center gap-6 px-6 py-4 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 right-0 z-50">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Hamburger button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F26A4B] rounded-lg flex items-center justify-center text-white font-bold text-base">
              K
            </div>
            <span className="text-lg font-bold text-[#16213E] dark:text-white">Krakkify</span>
          </a>
        </div>

        {/* Center: Universal Search Bar */}
        <UniversalSearch />

        {/* Right side actions - Notifications, Sound, Language, Profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notifications */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Sound Toggle */}
          <SoundToggle />

          {/* Language Selector */}
          <LanguageSelector />

          {/* User Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all"
              style={{ backgroundColor: user?.avatar_color || "#F26A4B" }}
              aria-label={`${showProfileMenu ? "Close" : "Open"} user menu`}
              aria-expanded={showProfileMenu}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                {/* Admin Links */}
                {isAdmin(user?.role, user?.email) && (
                  <div className="py-2 border-b border-slate-200 dark:border-slate-800">
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <BarChart3 className="w-5 h-5 flex-shrink-0 text-slate-500" />
                      Analytics
                    </Link>
                    <Link
                      href="/admin/questions"
                      className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-slate-500" />
                      Reported Questions
                    </Link>
                  </div>
                )}

                {/* Regular Menu Items */}
                <div className="py-2 border-b border-slate-200 dark:border-slate-800">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-5 h-5 flex-shrink-0 text-slate-500" />
                    Settings
                  </Link>
                  <button
                    onClick={() => toggleTheme()}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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

                {/* Logout */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      router.push("/");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar - No header, just navigation */}
      <aside
        className={[
          'hidden',
          'md:flex',
          'md:flex-col',
          'md:flex-shrink-0',
          'fixed',
          'left-0',
          'top-[96px]',
          'h-[calc(100vh-96px)]',
          'border-r',
          'bg-white',
          'dark:bg-[#0f172a]',
          'border-slate-200',
          'dark:border-slate-800',
          'z-40',
          'transition-all',
          'duration-300',
          isCollapsed ? 'md:w-16' : 'md:w-48'
        ].join(' ')}
      >

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-8 pb-6">
        {isContributorRole ? (
          <Link
            href="/contributor"
            className={
              isActive("/contributor")
                ? "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-[rgba(242,106,75,0.08)] dark:bg-[#F26A4B]/20 text-[#F26A4B] dark:text-[#F58972]"
                : "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#16213E] dark:text-slate-300 hover:bg-[rgba(22,33,62,0.04)] dark:hover:bg-slate-900"
            }
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

                const linkClasses = [
                  'flex',
                  'items-center',
                  isCollapsed ? 'justify-center' : 'gap-3',
                  'px-3',
                  'py-2',
                  'rounded-lg',
                  'text-sm',
                  'font-medium',
                  'transition-colors',
                  active
                    ? 'bg-[rgba(242,106,75,0.08)] dark:bg-[#F26A4B]/20 text-[#F26A4B] dark:text-[#F58972]'
                    : 'text-[#16213E] dark:text-slate-300 hover:bg-[rgba(22,33,62,0.04)] dark:hover:bg-slate-900'
                ].filter(Boolean).join(' ');

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={linkClasses}
                      title={isCollapsed ? label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                      {!isCollapsed && <span className="truncate">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Group Separator */}
            {!isCollapsed && <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-3" />}

            {/* Analytics Group */}
            <ul className="space-y-1 mb-4">
              {ANALYTICS_NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = item.labelKey ? t(item.labelKey) : item.fallback;

                const linkClasses = [
                  'flex',
                  'items-center',
                  isCollapsed ? 'justify-center' : 'gap-3',
                  'px-3',
                  'py-2',
                  'rounded-lg',
                  'text-sm',
                  'font-medium',
                  'transition-colors',
                  active
                    ? 'bg-[rgba(242,106,75,0.08)] dark:bg-[#F26A4B]/20 text-[#F26A4B] dark:text-[#F58972]'
                    : 'text-[#16213E] dark:text-slate-300 hover:bg-[rgba(22,33,62,0.04)] dark:hover:bg-slate-900'
                ].filter(Boolean).join(' ');

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={linkClasses}
                      title={isCollapsed ? label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                      {!isCollapsed && <span className="truncate">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {!isCollapsed && (
              <>
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
          </>
        )}
      </nav>
    </aside>
    </>
  );
}

