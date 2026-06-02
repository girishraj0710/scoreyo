"use client";

import { useEffect, useRef } from "react";

export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const startYRef = useRef<number>(0);
  const pullingRef = useRef<boolean>(false);

  useEffect(() => {
    let refreshIndicator: HTMLDivElement | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of page
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY !== 0) return;

      const currentY = e.touches[0].clientY;
      const pullDistance = currentY - startYRef.current;

      // User is pulling down
      if (pullDistance > 0 && pullDistance < 150) {
        pullingRef.current = true;

        // Create refresh indicator if it doesn't exist
        if (!refreshIndicator) {
          refreshIndicator = document.createElement("div");
          refreshIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%) translateY(-60px);
            background: #4255FF;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999;
            transition: transform 0.2s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          `;
          refreshIndicator.textContent = "Pull to refresh";
          document.body.appendChild(refreshIndicator);
        }

        // Update indicator position
        const progress = Math.min(pullDistance / 80, 1);
        refreshIndicator.style.transform = `translateX(-50%) translateY(${progress * 60 - 60}px)`;

        if (pullDistance > 80) {
          refreshIndicator.textContent = "Release to refresh";
          refreshIndicator.style.background = "#10b981";
        } else {
          refreshIndicator.textContent = "Pull to refresh";
          refreshIndicator.style.background = "#4255FF";
        }
      }
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      if (!pullingRef.current) return;

      const currentY = e.changedTouches[0].clientY;
      const pullDistance = currentY - startYRef.current;

      // Trigger refresh if pulled far enough
      if (pullDistance > 80) {
        if (refreshIndicator) {
          refreshIndicator.textContent = "Refreshing...";
          refreshIndicator.style.transform = "translateX(-50%) translateY(10px)";
        }

        await onRefresh();

        // Hide indicator after refresh
        setTimeout(() => {
          if (refreshIndicator) {
            refreshIndicator.style.transform = "translateX(-50%) translateY(-60px)";
            setTimeout(() => {
              refreshIndicator?.remove();
              refreshIndicator = null;
            }, 200);
          }
        }, 500);
      } else {
        // Hide indicator without refreshing
        if (refreshIndicator) {
          refreshIndicator.style.transform = "translateX(-50%) translateY(-60px)";
          setTimeout(() => {
            refreshIndicator?.remove();
            refreshIndicator = null;
          }, 200);
        }
      }

      pullingRef.current = false;
      startYRef.current = 0;
    };

    // Only add listeners on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      refreshIndicator?.remove();
    };
  }, [onRefresh]);
}
