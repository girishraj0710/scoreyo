"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: "half" | "full" | "auto";
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = "auto",
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    // Only allow dragging down
    if (deltaY > 0) {
      currentYRef.current = deltaY;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    // If dragged down more than 100px, close the sheet
    if (currentYRef.current > 100) {
      onClose();
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentYRef.current = 0;
  };

  if (!isOpen) return null;

  const heightClass =
    height === "full"
      ? "h-[90vh]"
      : height === "half"
        ? "h-[50vh]"
        : "max-h-[80vh]";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 md:flex md:items-center md:justify-center"
        onClick={onClose}
      />

      {/* Sheet - bottom on mobile, centered modal on desktop */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 md:relative md:max-w-lg md:w-full rounded-t-2xl md:rounded-2xl shadow-2xl z-50 transition-transform duration-300 ease-out"
        style={{ background: "var(--card-bg)" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle (mobile only) */}
        <div className="md:hidden pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 rounded-full" style={{ background: "var(--muted)" }} />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${heightClass}`}>{children}</div>
      </div>
    </>
  );
}
