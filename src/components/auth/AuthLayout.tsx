"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  side?: "left" | "right";
  mascotSrc?: string;
}

export function AuthLayout({
  children,
  side = "right",
  mascotSrc = "/images/auth-mascot-v2.png",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative">
      {/* Close button */}
      <Link
        href="/"
        aria-label="Close"
        className="absolute top-5 right-5 z-20 flex items-center justify-center w-10 h-10 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-6 h-6" strokeWidth={2.5} />
      </Link>

      {/* Left Side - Mascot Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Full-bleed mascot background */}
        <Image
          src={mascotSrc}
          alt="Scoreyo study companion"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          {/* Logo / Brand */}
          <Link href="/" className="inline-block group">
            <h1
              className="text-5xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)", color: "#1B2A49" }}
            >
              Scoreyo
            </h1>
            <p
              className="text-lg font-semibold mt-1"
              style={{ fontFamily: "var(--font-heading)", color: "#475569" }}
            >
              Where Learning Meets Intelligence
            </p>
          </Link>
        </div>
      </motion.div>


      {/* Right Side - Clean Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex items-start justify-center p-8 lg:p-12 bg-white dark:bg-slate-950 overflow-y-auto"
      >
        <div className="w-full max-w-md lg:mt-[12vh]">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden block mb-10">
            <span
              className="text-3xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)", color: "#1B2A49" }}
            >
              Scoreyo
            </span>
          </Link>

          {/* Form Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
