"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, type Locale } from "@/context/locale-context";

const languages = [
  { code: "en" as Locale, name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi" as Locale, name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "ta" as Locale, name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te" as Locale, name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "bn" as Locale, name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr" as Locale, name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu" as Locale, name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn" as Locale, name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ borderColor: "var(--card-border)", background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
        aria-label="Change language"
        aria-expanded={showMenu}
      >
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "var(--muted)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border z-[100] py-1 max-h-80 overflow-y-auto" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              Select Language
            </div>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={
                locale === lang.code
                  ? { background: "var(--primary-bg)", color: "var(--primary)" }
                  : { background: "transparent", color: "var(--foreground-secondary)" }
              }
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-bg)"}
              onMouseLeave={(e) => e.currentTarget.style.background = locale === lang.code ? "var(--primary-bg)" : "transparent"}
              aria-label={`Select ${lang.name}`}
              aria-current={locale === lang.code ? "true" : undefined}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{lang.name}</div>
              </div>
              {locale === lang.code && (
                <svg className="w-4 h-4 text-[#4255FF]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}

          <div className="px-3 py-2 border-t mt-1" style={{ borderColor: "var(--card-border)" }}>
            <div className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Questions in English + Selected language</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
