"use client";

import { useLocale } from "@/context/locale-context";

export function AppFooter() {
  const { t } = useLocale();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
        <p>{t("footerText")}</p>
        <p className="mt-1 text-xs text-slate-400">{t("footerExams")}</p>
      </div>
    </footer>
  );
}
