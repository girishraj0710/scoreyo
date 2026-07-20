"use client";

import { useLocale } from "@/context/locale-context";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/user-context";

export function AppFooter() {
  const { t } = useLocale();
  const pathname = usePathname();
  const { user } = useUser();

  // Show TOEFL attribution only on English learning pages
  const isEnglishPage = pathname?.startsWith("/english");

  // Check if user is contributor
  const isContributor = user && ['contributor', 'admin'].includes(user.role || '');

  return (
    <footer className="border-t mt-auto" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--foreground)' }}>Product</h3>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
              <li><a href="/" className="hover:text-[#E76F51] transition-colors">Home</a></li>
              {!isContributor && (
                <>
                  <li><a href="/mock-test" className="hover:text-[#E76F51] transition-colors">Mock Tests</a></li>
                  <li><a href="/pricing" className="hover:text-[#E76F51] transition-colors">Pricing</a></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--foreground)' }}>Legal</h3>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
              <li><a href="/terms" className="hover:text-[#E76F51] transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-[#E76F51] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--foreground)' }}>Support</h3>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
              <li><a href="/contact" className="hover:text-[#E76F51] transition-colors">Contact Us</a></li>
              <li><a href="mailto:support@scoreyo.in" className="hover:text-[#E76F51] transition-colors">Email Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--foreground)' }}>Company</h3>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--muted)' }}>
              <li>Bangalore, Karnataka</li>
              <li>India</li>
            </ul>
          </div>
        </div>

        {/* Copyright and Info */}
        <div className="text-center text-sm border-t pt-6" style={{ color: 'var(--muted)', borderColor: 'var(--card-border)' }}>
          <p>{t("footerText")}</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{t("footerExams")}</p>

          {/* Attribution for TOEFL Vocabulary Dataset (MIT License Requirement) */}
          {/* Only shown on English learning pages */}
          {isEnglishPage && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                TOEFL vocabulary powered by{" "}
                <a
                  href="https://wordlevel.net"
                  target="_blank"
                  rel="dofollow noopener noreferrer"
                  className="underline"
                  style={{ color: 'var(--primary)' }}
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
