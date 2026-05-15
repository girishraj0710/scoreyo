"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { LanguageSelector } from "./language-selector";
import { SoundToggle } from "./sound-toggle";

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
        ? "text-indigo-600 bg-indigo-50"
        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
    }`;

  const mobileNavLinkClass = (href: string) =>
    `block px-4 py-2 text-sm transition-colors ${
      isActive(href)
        ? "text-indigo-600 bg-indigo-50 font-semibold border-l-2 border-indigo-600"
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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 mr-4">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            P
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            PrepGenie
          </span>
        </a>

        <div className="flex items-center gap-1">
          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-1">
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
            <Link href="/pricing" className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50" : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t("pricing")}
            </Link>
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
                className="w-24 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 transition-colors"
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
                    <div className="font-medium text-slate-800 text-sm">{user.name}</div>
                    {user.email && <div className="text-xs text-slate-400">{user.email}</div>}
                  </div>
                  {/* Mobile nav links */}
                  <div className="sm:hidden border-b border-slate-100">
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
                    <Link href="/pricing" className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive("/pricing") ? "text-amber-700 bg-amber-50 border-l-2 border-amber-600" : "text-amber-600 hover:bg-amber-50"}`} onClick={() => setShowMenu(false)}>{t("pricing")}</Link>
                  </div>
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
