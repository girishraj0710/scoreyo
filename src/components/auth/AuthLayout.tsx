"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  side?: "left" | "right";
}

export function AuthLayout({ children, side = "right" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative">
      {/* Left Side - Solid Premium Color */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#4F46E5]"
      >
        {/* Subtle Texture */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">Krakkify</span>
          </Link>

          {/* Center Content */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold leading-[1.1] mb-6" style={{ letterSpacing: '-0.02em' }}>
                Excel in your
                <br />
                competitive exams
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                AI-powered practice platform trusted by thousands of students across India.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            © 2026 Krakkify
          </div>
        </div>
      </motion.div>

      {/* Educational Image - Cuts through divider */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          {/* High-quality education photo */}
          <div className="w-[400px] h-[400px] rounded-2xl overflow-hidden shadow-2xl ring-8 ring-white dark:ring-slate-900 relative">
            <Image
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80"
              alt="Student studying"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">10K+ Students</span>
            </div>
          </div>

          {/* Achievement badge */}
          <div className="absolute -bottom-4 -left-4 bg-[#4F46E5] rounded-xl shadow-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-sm font-semibold text-white">Top Rated Platform</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Clean Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white dark:bg-slate-950"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">Krakkify</span>
          </Link>

          {/* Form Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
