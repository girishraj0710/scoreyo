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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Product</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/" className="hover:text-[#00A1E0] transition-colors">Home</a></li>
              <li><a href="/mock-test" className="hover:text-[#00A1E0] transition-colors">Mock Tests</a></li>
              <li><a href="/pricing" className="hover:text-[#00A1E0] transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Legal</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/terms" className="hover:text-[#00A1E0] transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-[#00A1E0] transition-colors">Privacy Policy</a></li>
              <li><a href="/refund" className="hover:text-[#00A1E0] transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Support</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/contact" className="hover:text-[#00A1E0] transition-colors">Contact Us</a></li>
              <li><a href="mailto:support@prepgenie.co.in" className="hover:text-[#00A1E0] transition-colors">Email Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="text-slate-500">Bangalore, Karnataka</li>
              <li className="text-slate-500">India</li>
            </ul>
          </div>
        </div>

        {/* Copyright and Info */}
        <div className="text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
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
                  className="text-blue-500 hover:text-[#00A1E0] underline"
                >
                  WordLevel.net
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
