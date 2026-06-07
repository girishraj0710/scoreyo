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
import { Moon, Sun } from "lucide-react";

export function AppHeader() {
  const { user, isLoading, logout, setShowLoginModal } = useUser();
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

  const navLinkClass = (href: string) =>
    `relative px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors`;

  const navLinkStyle = (href: string): React.CSSProperties =>
    isActive(href)
      ? { color: '#ffffff', backgroundColor: 'var(--primary)' }
      : { color: 'var(--foreground-secondary)' };

  const navHoverProps = (href: string) =>
    isActive(href) ? {} : {
      onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.color = 'var(--primary)';
        e.currentTarget.style.backgroundColor = 'var(--nav-hover-bg)';
      },
      onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.color = 'var(--foreground-secondary)';
        e.currentTarget.style.backgroundColor = 'transparent';
      },
    };

  const mobileNavLinkClass = (href: string) =>
    `block px-4 py-2 text-sm transition-colors ${
      isActive(href)
        ? "text-[#4255FF] bg-[#E8EAFF] dark:bg-indigo-900/40 font-semibold border-l-2 border-[#4255FF]"
        : "text-slate-600 dark:text-slate-400 hover:bg-[var(--primary-bg)] dark:hover:bg-slate-800"
    }`;

  // Close menu on any click outside the menu container
  useEffect(() => {
    if (!showMenu) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }

    // Use capture phase so we catch clicks before anything else
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [showMenu]);

  return (
    <header className="sticky top-0 z-50 border-b shadow-sm" style={{ background: 'var(--card-bg)', borderBottomColor: 'var(--card-border)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 mr-8 lg:mr-12">
          <div className="w-9 h-9 bg-[#4255FF] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            P
          </div>
          <span className="text-xl font-bold bg-[#4255FF] bg-clip-text text-transparent">
            PrepGenie
          </span>
        </a>

        <div className="flex items-center gap-1">
          {/* Nav Links - Role Based */}
          <nav className="hidden sm:flex items-center gap-1">
            {/* For Contributors - Show Contributor Portal */}
            {user && ['contributor', 'admin'].includes(user.role || '') ? (
              <>
                <Link href="/contributor" className={navLinkClass("/contributor")} style={navLinkStyle("/contributor")} {...navHoverProps("/contributor")}>
                  👨‍🏫 Contributor Portal
                </Link>
                {/* My Submissions link removed - available as tab on main page */}
              </>
            ) : (
              <>
                {/* For Students - Show Regular Navigation */}
                <Link href="/" className={navLinkClass("/")} style={navLinkStyle("/")} {...navHoverProps("/")}>
                  {t("home")}
                </Link>
                <Link href="/review" className={navLinkClass("/review")} style={navLinkStyle("/review")} {...navHoverProps("/review")}>
                  {t("review")}
                </Link>
                <Link href="/mock-test" className={navLinkClass("/mock-test")} style={navLinkStyle("/mock-test")} {...navHoverProps("/mock-test")}>
                  {t("mockTests")}
                </Link>
                <Link href="/sprint" className={navLinkClass("/sprint")} style={navLinkStyle("/sprint")} {...navHoverProps("/sprint")}>
                  Sprint
                </Link>
                <Link href="/english" className={navLinkClass("/english")} style={navLinkStyle("/english")} {...navHoverProps("/english")}>
                  Learn English
                </Link>
                <Link href="/custom-quiz" className={navLinkClass("/custom-quiz")} style={navLinkStyle("/custom-quiz")} {...navHoverProps("/custom-quiz")}>
                  Custom Quiz
                </Link>
                <Link href="/study-materials" className={navLinkClass("/study-materials")} style={navLinkStyle("/study-materials")} {...navHoverProps("/study-materials")}>
                  📖 Study Materials
                </Link>
                <Link href="/pricing" className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50" : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"}`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Upgrade
                </Link>
              </>
            )}
          </nav>

          {/* Sound Toggle */}
          <div className="ml-2">
            <SoundToggle />
          </div>

          {/* Language Selector */}
          <div className="ml-1">
            <LanguageSelector />
          </div>

          {/* Auth Buttons (when not logged in and not loading) */}
          {!user && !isLoading && (
            <div className="flex items-center gap-3 ml-2">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-24 px-4 py-2 font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                style={{ color: 'var(--foreground-secondary)', backgroundColor: 'var(--hover-bg)', borderColor: 'var(--card-border)' }}
              >
                Log in
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-24 px-4 py-2 text-white font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
                style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
              >
                Sign up
              </button>
            </div>
          )}

          {/* User Menu */}
          {user && (
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                aria-label={`${showMenu ? 'Close' : 'Open'} user menu`}
                aria-expanded={showMenu}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: user.avatar_color || "#6366f1" }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline max-w-[80px] truncate" style={{ color: 'var(--foreground)' }}>
                  {user.name}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-tertiary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-lg z-[70] overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  {/* Premium Header Section */}
                  <div className="px-6 py-6" style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                        style={{ backgroundColor: user.avatar_color || "#6366f1" }}
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                          {user.name}
                        </h3>
                        <p className="text-xs truncate" style={{ color: 'var(--foreground-secondary)' }}>{user.email}</p>
                        {user.role && user.role !== 'student' && (
                          <span className="inline-block text-xs px-2 py-1 rounded-full mt-2" style={{ background: 'var(--hover-bg)', color: 'var(--foreground-secondary)' }}>
                            {user.role === 'contributor' ? 'Contributor' : 'Admin'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Mobile nav links - Role Based */}
                  <div className="sm:hidden" style={{ borderBottom: '1px solid var(--divider)' }}>
                    {user.role && ['contributor', 'contributor', 'admin'].includes(user.role) ? (
                      <>
                        <Link href="/contributor" className={mobileNavLinkClass("/contributor")} onClick={() => setShowMenu(false)}>👨‍🏫 Contributor Portal</Link>
                        {/* My Submissions link removed - available as tab on main page */}
                      </>
                    ) : (
                      <>
                        <Link href="/" className={mobileNavLinkClass("/")} onClick={() => setShowMenu(false)}>{t("home")}</Link>
                        <Link href="/review" className={mobileNavLinkClass("/review")} onClick={() => setShowMenu(false)}>{t("review")}</Link>
                        <Link href="/mock-test" className={mobileNavLinkClass("/mock-test")} onClick={() => setShowMenu(false)}>{t("mockTests")}</Link>
                        <Link href="/sprint" className={mobileNavLinkClass("/sprint")} onClick={() => setShowMenu(false)}>Sprint</Link>
                        <Link href="/english" className={mobileNavLinkClass("/english")} onClick={() => setShowMenu(false)}>
                          Learn English
                        </Link>
                        <Link href="/custom-quiz" className={mobileNavLinkClass("/custom-quiz")} onClick={() => setShowMenu(false)}>
                          Custom Quiz
                        </Link>
                        <Link href="/study-materials" className={mobileNavLinkClass("/study-materials")} onClick={() => setShowMenu(false)}>📖 Study Materials</Link>
                        <Link href="/pricing" className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive("/pricing") ? "text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 border-l-2 border-amber-600" : "text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"}`} onClick={() => setShowMenu(false)}>Upgrade</Link>
                      </>
                    )}
                  </div>
                  {/* Student Links - Dashboard, Reports, Badges */}
                  {!['contributor', 'admin'].includes(user.role || '') && (
                    <div className="py-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <Link
                        href="/dashboard"
                        className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => setShowMenu(false)}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m0 0H3m4 0v8m0 0H3m4 0v4a2 2 0 002 2h4m0 0h4a2 2 0 002-2v-4m0 0h2m-2 0V9a2 2 0 00-2-2h-4m0 0H9m0 0V5a2 2 0 012-2h4" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        href="/reports"
                        className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => setShowMenu(false)}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Reports
                      </Link>
                      <Link
                        href="/achievements"
                        className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => setShowMenu(false)}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path d="M6 9c0-1.105.895-2 2-2h8c1.105 0 2 .895 2 2v3h2c1.105 0 2 .895 2 2v5c0 1.105-.895 2-2 2h-1v1c0 .552-.448 1-1 1s-1-.448-1-1v-1H9v1c0 .552-.448 1-1 1s-1-.448-1-1v-1H6c-1.105 0-2-.895-2-2v-5c0-1.105.895-2 2-2h2V9zm2 3v5h8v-5H8z"/>
                          <path d="M9 7c0-.552.448-1 1-1h4c.552 0 1 .448 1 1s-.448 1-1 1h-4c-.552 0-1-.448-1-1z"/>
                        </svg>
                        Achievements
                      </Link>
                    </div>
                  )}
                  {/* Admin Links (if admin role) */}
                  {isAdmin(user.role, user.email) && (
                    <div className="py-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <Link
                        href="/admin"
                        className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                        onClick={() => setShowMenu(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                      </Link>
                      <Link
                        href="/admin/questions"
                        className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                        onClick={() => setShowMenu(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Reported Questions
                      </Link>
                      <Link
                        href="/admin/review-questions"
                        className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                        onClick={() => setShowMenu(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Pending Questions
                      </Link>
                    </div>
                  )}
                  <div className="py-2" style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
                    <Link
                      href="/settings"
                      className="block px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                      style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      onClick={() => setShowMenu(false)}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <button
                      onClick={() => toggleTheme()}
                      className="w-full text-left px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                      style={{ color: 'var(--foreground)', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      aria-label={`Toggle ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                      {isDarkMode ? (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707.707M4.929 4.929l.707.707m10.728 0l.707-.707M4.929 19.071l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                      {isDarkMode ? 'Light mode' : 'Dark mode'}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/");
                      logout();
                    }}
                    className="w-full text-left px-6 py-3 text-sm flex items-center gap-3 transition-colors"
                    style={{ color: 'var(--foreground-secondary)', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--hover-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    aria-label="Logout"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--foreground-secondary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
