import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/conditional-layout";

// Fredoka - Rounded, friendly, playful sans-serif
// Perfect for modern, approachable educational platforms
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "PrepGenie - Smart Exam Prep for India",
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
    "PrepGenie",
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
      className={`${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-[320px] flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
