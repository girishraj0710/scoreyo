"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = "Continue",
  onAction,
  autoClose = false,
  autoCloseDelay = 3000,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
        if (onAction) onAction();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose, onAction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md pointer-events-auto"
            >
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F26A4B]/10 via-transparent to-transparent pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                {/* Content */}
                <div className="relative p-8">
                  {/* Success icon */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      {/* Pulse ring */}
                      <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-green-500"
                      />

                      {/* Icon */}
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </div>

                      {/* Sparkle effect */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-500" fill="currentColor" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-heading text-2xl font-black text-center text-[#16213E] dark:text-white mb-3"
                  >
                    {title}
                  </motion.h3>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-slate-600 dark:text-slate-400 mb-6"
                  >
                    {message}
                  </motion.p>

                  {/* Action button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                      if (onAction) onAction();
                      onClose();
                    }}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#F26A4B] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D35D42] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                  >
                    {actionLabel}
                  </motion.button>

                  {/* Auto-close indicator */}
                  {autoClose && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Auto-closing in {autoCloseDelay / 1000}s...
                      </p>
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
                        className="h-1 bg-gradient-to-r from-[#F26A4B] to-[#E76F51] rounded-full mt-2"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
