"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { useTheme } from "@/context/theme-context";
import { LanguageSelector } from "./language-selector";
import { SoundToggle } from "./sound-toggle";
import { isAdmin as checkIsAdmin } from "@/lib/admin";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
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
  const [userFolders, setUserFolders] = useState<{ id: number; name: string }[]>([]);
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

  // Load the user's folders from the API once they're logged in.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch("/api/folders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.folders) setUserFolders(data.folders);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    const trimmed = folderName?.trim();
    if (!trimmed) return;
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.folder) setUserFolders((prev) => [...prev, data.folder]);
      } else if (res.status === 409) {
        alert("A folder with that name already exists.");
      }
    } catch {
      // no-op: network error, folder not created
    }
  };

  if (!user) return null;

  const isContributorRole = user.role === "contributor"; // Only contributor, NOT admin
  const isAdminRole = user.role === "admin"; // Local boolean check (separate from imported isAdmin function)

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
            <div className="w-8 h-8 bg-[#F26A4B] rounded-lg flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="butt" strokeLinejoin="miter" className="w-5 h-5">
                <path d="M17 7 H8 V11.5 H16 V17 H7" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#16213E] dark:text-white">Scoreyo</span>
          </a>
        </div>

        {/* Center: Universal Search Bar */}
        <UniversalSearch />

        {/* Right side actions - Admin Contributor Button, Notifications, Sound, Language, Profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Admin: Quick access to Contributor Portal */}
          {isAdminRole && (
            <a
              href="/contributor"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors relative group"
              aria-label="Contributor Portal"
              title="Contributor Portal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600 dark:text-purple-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </a>
          )}

          {/* Upgrade Button - Only for students with free subscription */}
          {user?.role === 'student' && user?.subscription_status !== 'pro' && (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#FFCD1F', color: '#000' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0C01F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFCD1F'}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Upgrade
            </Link>
          )}

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
                {checkIsAdmin(user?.role, user?.email) && (
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
                    <Link
                      href="/admin/review-questions"
                      className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FileText className="w-5 h-5 flex-shrink-0 text-slate-500" />
                      Pending Questions
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
                      // logout() redirects to /api/auth/logout itself; a
                      // router.push here would race and cancel it, leaving the
                      // user logged in.
                      setShowProfileMenu(false);
                      logout();
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
        {isContributorRole && !isAdminRole ? (
          /* Contributor (not admin): Only show Contributor Portal link */
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
          /* Student or Admin: Show full student sidebar */
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
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase" style={{ letterSpacing: '0.2em' }}>
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
                    {userFolders.map((folder) => (
                      <li key={folder.id}>
                        <Link
                          href={`/folders/${folder.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                        >
                          <Folder className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                          <span className="truncate">{folder.name}</span>
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

