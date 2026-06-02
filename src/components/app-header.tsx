"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { LanguageSelector } from "./language-selector";
import { SoundToggle } from "./sound-toggle";
import { isAdmin } from "@/lib/admin";

export function AppHeader() {
  const { user, isLoading, logout, setShowLoginModal } = useUser();
  const { t } = useLocale();
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
    `relative px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
      isActive(href)
        ? "text-[#4255FF] bg-[#E8EAFF]"
        : "text-slate-600 hover:text-[#4255FF] hover:bg-slate-50"
    }`;

  const mobileNavLinkClass = (href: string) =>
    `block px-4 py-2 text-sm transition-colors ${
      isActive(href)
        ? "text-[#4255FF] bg-[#E8EAFF] font-semibold border-l-2 border-[#4255FF]"
        : "text-slate-600 hover:bg-slate-50"
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
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
            {/* For Teachers/Contributors - Show Teacher Portal */}
            {user && ['teacher', 'contributor', 'admin'].includes(user.role || '') ? (
              <>
                <Link href="/teacher" className={navLinkClass("/teacher")}>
                  👨‍🏫 Teacher Portal
                </Link>
                <Link href="/teacher/submissions" className={navLinkClass("/teacher/submissions")}>
                  📝 My Submissions
                </Link>
                <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                  {t("dashboard")}
                </Link>
                <Link href="/review" className={navLinkClass("/review")}>
                  {t("review")}
                </Link>
                <Link href="/pricing" className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50" : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"}`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t("pricing")}
                </Link>
              </>
            ) : (
              <>
                {/* For Students - Show Regular Navigation */}
                <Link href="/" className={navLinkClass("/")}>
                  {t("home")}
                </Link>
                <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                  {t("dashboard")}
                </Link>
                <Link href="/review" className={navLinkClass("/review")}>
                  {t("review")}
                </Link>
                <Link href="/mock-test" className={navLinkClass("/mock-test")}>
                  {t("mockTests")}
                </Link>
                <Link href="/reports" className={navLinkClass("/reports")}>
                  {t("reports")}
                </Link>
                <Link href="/achievements" className={navLinkClass("/achievements")}>
                  Badges
                </Link>
                <Link href="/sprint" className={navLinkClass("/sprint")}>
                  Sprint
                </Link>
                <Link href="/english" className={navLinkClass("/english")}>
                  Learn English
                </Link>
                <Link href="/custom-quiz" className={navLinkClass("/custom-quiz")}>
                  Custom Quiz
                </Link>
                <Link href="/pricing" className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50" : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"}`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t("pricing")}
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
                className="w-24 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-24 px-4 py-2 bg-[#4255FF] text-white font-medium rounded-lg hover:bg-[#3242CC] border border-[#4255FF] hover:border-[#3242CC] transition-colors"
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
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: user.avatar_color || "#6366f1" }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline max-w-[80px] truncate">
                  {user.name}
                </span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-[70] py-1">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-medium text-slate-800 text-sm flex items-center gap-2">
                      {user.name}
                      {user.role && user.role !== 'student' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                          {user.role === 'teacher' ? '👨‍🏫' : user.role === 'contributor' ? '🤝' : '⚙️'} {user.role}
                        </span>
                      )}
                    </div>
                    {user.email && <div className="text-xs text-slate-400">{user.email}</div>}
                  </div>
                  {/* Mobile nav links - Role Based */}
                  <div className="sm:hidden border-b border-slate-100">
                    {user.role && ['teacher', 'contributor', 'admin'].includes(user.role) ? (
                      <>
                        <Link href="/teacher" className={mobileNavLinkClass("/teacher")} onClick={() => setShowMenu(false)}>👨‍🏫 Teacher Portal</Link>
                        <Link href="/teacher/submissions" className={mobileNavLinkClass("/teacher/submissions")} onClick={() => setShowMenu(false)}>📝 My Submissions</Link>
                        <Link href="/dashboard" className={mobileNavLinkClass("/dashboard")} onClick={() => setShowMenu(false)}>{t("dashboard")}</Link>
                        <Link href="/review" className={mobileNavLinkClass("/review")} onClick={() => setShowMenu(false)}>{t("review")}</Link>
                        <Link href="/pricing" className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50 border-l-2 border-amber-600" : "text-amber-600 hover:bg-amber-50"}`} onClick={() => setShowMenu(false)}>{t("pricing")}</Link>
                      </>
                    ) : (
                      <>
                        <Link href="/" className={mobileNavLinkClass("/")} onClick={() => setShowMenu(false)}>{t("home")}</Link>
                        <Link href="/dashboard" className={mobileNavLinkClass("/dashboard")} onClick={() => setShowMenu(false)}>{t("dashboard")}</Link>
                        <Link href="/review" className={mobileNavLinkClass("/review")} onClick={() => setShowMenu(false)}>{t("review")}</Link>
                        <Link href="/mock-test" className={mobileNavLinkClass("/mock-test")} onClick={() => setShowMenu(false)}>{t("mockTests")}</Link>
                        <Link href="/reports" className={mobileNavLinkClass("/reports")} onClick={() => setShowMenu(false)}>{t("reports")}</Link>
                        <Link href="/achievements" className={mobileNavLinkClass("/achievements")} onClick={() => setShowMenu(false)}>Badges</Link>
                        <Link href="/sprint" className={mobileNavLinkClass("/sprint")} onClick={() => setShowMenu(false)}>Sprint</Link>
                        <Link href="/english" className={mobileNavLinkClass("/english")} onClick={() => setShowMenu(false)}>
                          Learn English
                        </Link>
                        <Link href="/custom-quiz" className={mobileNavLinkClass("/custom-quiz")} onClick={() => setShowMenu(false)}>
                          Custom Quiz
                        </Link>
                        <Link href="/pricing" className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50 border-l-2 border-amber-600" : "text-amber-600 hover:bg-amber-50"}`} onClick={() => setShowMenu(false)}>{t("pricing")}</Link>
                      </>
                    )}
                  </div>
                  {/* Admin Links (if admin role) */}
                  {isAdmin(user.role, user.email) && (
                    <div className="border-b border-slate-100">
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2"
                        onClick={() => setShowMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                      </Link>
                      <Link
                        href="/admin/questions"
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2"
                        onClick={() => setShowMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Reported Questions
                      </Link>
                      <Link
                        href="/admin/review-questions"
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2"
                        onClick={() => setShowMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Pending Questions
                      </Link>
                    </div>
                  )}
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/");
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
