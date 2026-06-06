"use client";

import { useLocale } from "@/context/locale-context";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "hi" : "en")}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[var(--card-border)] hover:bg-[var(--primary-bg)] text-slate-600"
      title={locale === "en" ? "हिंदी में बदलें" : "Switch to English"}
    >
      {locale === "en" ? (
        <>
          <span className="text-base leading-none">अ</span>
          <span>हिंदी</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none">A</span>
          <span>ENG</span>
        </>
      )}
    </button>
  );
}
