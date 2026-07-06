import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/conditional-layout";

// Plus Jakarta Sans - Variable font (200-800) for modern EdTech typography
// Geometric, clean, highly readable premium platform aesthetic
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-main",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Krakkify - Smart Exam Prep for India",
  description:
    "Expert-curated exam preparation for JEE, NEET, UPSC, SSC, Banking, CAT and 20+ Indian competitive exams. Previous year questions, NCERT-based practice, smart progress tracking.",
  keywords: [
    "JEE preparation",
    "NEET preparation",
    "UPSC preparation",
    "SSC CGL",
    "Banking exams",
    "CAT preparation",
    "exam prep India",
    "competitive exams India",
    "previous year questions",
    "NCERT questions",
    "Krakkify",
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://krakkify.in',
    siteName: 'Krakkify - Smart Exam Prep',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full min-w-[320px] flex flex-col font-sans transition-colors" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
