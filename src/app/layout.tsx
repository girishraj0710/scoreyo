import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

// Poppins - Industry standard for education apps (Byju's, Unacademy style)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
        <Providers>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
