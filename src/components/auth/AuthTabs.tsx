"use client";

import Link from "next/link";

const wavyUnderline: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='100' height='10' viewBox='0 0 100 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 Q 5 1, 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5' stroke='%23F26B4E' stroke-width='7' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "repeat-x",
  backgroundSize: "28px 10px",
  backgroundPosition: "bottom",
};

interface AuthTabsProps {
  active: "signup" | "login";
  /**
   * When provided, tabs switch mode in-place (used inside AuthOverlay) instead
   * of navigating to a new route. When omitted, tabs are plain <Link> anchors
   * (used by the standalone /signup and /login pages).
   */
  onSelect?: (mode: "signup" | "login") => void;
}

export function AuthTabs({ active, onSelect }: AuthTabsProps) {
  const tabClass = (mode: "signup" | "login") =>
    `font-heading text-[26px] font-bold tracking-tight pb-2 transition-colors ${
      active === mode
        ? "text-slate-900 dark:text-white"
        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    }`;

  if (onSelect) {
    return (
      <div className="flex items-center gap-8 mb-10">
        <button
          type="button"
          onClick={() => onSelect("signup")}
          className={tabClass("signup")}
          style={active === "signup" ? wavyUnderline : undefined}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => onSelect("login")}
          className={tabClass("login")}
          style={active === "login" ? wavyUnderline : undefined}
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8 mb-10">
      <Link
        href="/signup"
        className={tabClass("signup")}
        style={active === "signup" ? wavyUnderline : undefined}
      >
        Sign up
      </Link>
      <Link
        href="/login"
        className={tabClass("login")}
        style={active === "login" ? wavyUnderline : undefined}
      >
        Log in
      </Link>
    </div>
  );
}
