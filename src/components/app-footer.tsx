"use client";

import { useLocale } from "@/context/locale-context";
import { usePathname } from "next/navigation";

export function AppFooter() {
  const { t } = useLocale();
  const pathname = usePathname();

  // Show TOEFL attribution only on English learning pages
  const isEnglishPage = pathname?.startsWith("/english");

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
        <p>{t("footerText")}</p>
        <p className="mt-1 text-xs text-slate-400">{t("footerExams")}</p>

        {/* Attribution for TOEFL Vocabulary Dataset (MIT License Requirement) */}
        {/* Only shown on English learning pages */}
        {isEnglishPage && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              TOEFL vocabulary powered by{" "}
              <a
                href="https://wordlevel.net"
                target="_blank"
                rel="dofollow noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                WordLevel.net
              </a>
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
