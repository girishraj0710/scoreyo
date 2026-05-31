import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/conditional-layout";

// Inter - Clean geometric sans-serif, closest to Quizlet's Hurmegeo Sans No2
// Industry standard, highly readable, professional
const inter = Inter({
  variable: "--font-inter",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
