import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc]">
        <Providers>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
