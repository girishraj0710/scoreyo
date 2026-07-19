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

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute top-32 left-12 bg-white/10 backdrop-blur-md rounded-xl shadow-xl px-4 py-3 border border-white/20"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">10K+ Students</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="absolute bottom-32 left-12 bg-yellow-400/20 backdrop-blur-md rounded-xl shadow-xl px-4 py-3 border border-yellow-400/30"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-sm font-semibold text-white">Top Rated</span>
          </div>
        </motion.div>

        {/* High-Quality Educational Image with Blend Effect */}
        <div className="absolute bottom-0 right-0 w-[550px] h-[550px] pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full"
          >
            {/* Image Container with Blend Mode */}
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=90"
                alt="Educational illustration"
                fill
                className="object-contain object-bottom-right"
                style={{
                  mixBlendMode: 'lighten',
                  opacity: 0.95,
                  filter: 'saturate(1.3) brightness(1.1)'
                }}
                unoptimized
              />
              {/* Gradient Overlay for Better Blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4F46E5]/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#4F46E5]/30" />
            </div>
          </motion.div>
        </div>
      </motion.div>


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
