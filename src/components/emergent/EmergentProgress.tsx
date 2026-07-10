/**
 * EmergentProgress Component
 *
 * Reusable progress indicator following Emergent Design System.
 *
 * Features:
 * - 2 variants: bar (horizontal) and ring (circular)
 * - Custom color
 * - Optional label
 * - Percentage display
 */

import React from 'react';
import { emergentColors } from '@/lib/emergent-colors';

export interface EmergentProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Progress variant */
  variant?: 'bar' | 'ring';
  /** Custom color (default: primary) */
  color?: string;
  /** Optional label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Size (only for ring variant) */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

export function EmergentProgress({
  value,
  variant = 'bar',
  color = emergentColors.primary,
  label,
  showPercentage = false,
  size = 'md',
  className = '',
}: EmergentProgressProps) {
  // Clamp value between 0-100
  const clampedValue = Math.min(100, Math.max(0, value));

  if (variant === 'bar') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* Label + Percentage */}
        {(label || showPercentage) && (
          <div className="flex items-center justify-between text-sm">
            {label && (
              <span
                className={`font-medium text-[${emergentColors.textPrimary}] dark:text-white`}
              >
                {label}
              </span>
            )}
            {showPercentage && (
              <span
                className={`font-bold font-mono text-[${emergentColors.textSecondary}]`}
              >
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div
          className="
            w-full
            h-2
            bg-black/5
            dark:bg-white/10
            rounded-full
            overflow-hidden
          "
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${clampedValue}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    );
  }

  // Ring variant (circular progress)
  const sizeClasses = {
    sm: { outer: 48, stroke: 4 },
    md: { outer: 64, stroke: 5 },
    lg: { outer: 96, stroke: 6 },
  };

  const { outer, stroke } = sizeClasses[size];
  const radius = (outer - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      {/* Circular SVG */}
      <div className="relative">
        <svg
          width={outer}
          height={outer}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            className="text-black/5 dark:text-white/10"
          />

          {/* Progress circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Percentage text (centered) */}
        {showPercentage && (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              font-bold
              font-mono
              text-sm
            "
            style={{ color }}
          >
            {Math.round(clampedValue)}%
          </div>
        )}
      </div>

      {/* Label */}
      {label && (
        <span
          className={`text-sm font-medium text-[${emergentColors.textPrimary}] dark:text-white text-center`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Usage Examples:
 *
 * // Basic horizontal bar
 * <EmergentProgress value={64} />
 *
 * // Bar with label
 * <EmergentProgress
 *   value={78}
 *   label="Foundation Path"
 * />
 *
 * // Bar with percentage
 * <EmergentProgress
 *   value={92}
 *   label="Advanced Path"
 *   showPercentage
 * />
 *
 * // Bar with custom color
 * <EmergentProgress
 *   value={45}
 *   color={emergentColors.success}
 *   label="Accuracy"
 * />
 *
 * // Circular progress (small)
 * <EmergentProgress
 *   value={64}
 *   variant="ring"
 *   size="sm"
 *   showPercentage
 * />
 *
 * // Circular progress (medium)
 * <EmergentProgress
 *   value={78}
 *   variant="ring"
 *   size="md"
 *   label="Overall Progress"
 *   showPercentage
 * />
 *
 * // Circular progress (large) with custom color
 * <EmergentProgress
 *   value={92}
 *   variant="ring"
 *   size="lg"
 *   color={emergentColors.warning}
 *   label="Streak"
 *   showPercentage
 * />
 */
