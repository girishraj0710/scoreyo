/**
 * EmergentStatTile Component
 *
 * Reusable stat display component following Emergent Design System.
 * Uses monospace font (JetBrains Mono) for numbers.
 *
 * Features:
 * - Large number display with mono font
 * - Optional label
 * - Optional icon
 * - Optional change indicator (up/down arrow with percentage)
 * - Compact or expanded layout
 */

import React from 'react';
import { emergentColors } from '@/lib/emergent-colors';

export interface EmergentStatTileProps {
  /** Stat label */
  label: string;
  /** Stat value (number or string) */
  value: number | string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Change percentage (e.g., +12, -5) */
  change?: number;
  /** Custom color for the value */
  color?: string;
  /** Layout variant */
  layout?: 'compact' | 'expanded';
  /** Additional classes */
  className?: string;
}

export function EmergentStatTile({
  label,
  value,
  icon,
  change,
  color = emergentColors.secondary,
  layout = 'compact',
  className = '',
}: EmergentStatTileProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  if (layout === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Icon */}
        {icon && (
          <div
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              bg-black/5
              dark:bg-white/10
            "
          >
            {icon}
          </div>
        )}

        {/* Value + Label */}
        <div className="flex flex-col">
          <div
            className="
              font-mono
              font-bold
              text-2xl
              tracking-tighter
            "
            style={{ color }}
          >
            {value}
          </div>
          <div
            className={`
              text-sm
              font-medium
              text-[${emergentColors.textSecondary}]
            `}
          >
            {label}
          </div>
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div
            className={`
              ml-auto
              text-sm
              font-bold
              flex
              items-center
              gap-1
              ${isPositive ? `text-[${emergentColors.success}]` : ''}
              ${isNegative ? `text-[${emergentColors.danger}]` : ''}
            `}
          >
            {isPositive && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            )}
            {isNegative && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    );
  }

  // Expanded layout
  return (
    <div
      className={`
        flex
        flex-col
        gap-2
        ${className}
      `}
    >
      {/* Label + Change */}
      <div className="flex items-center justify-between">
        <div
          className={`
            text-sm
            font-semibold
            text-[${emergentColors.textPrimary}]
            dark:text-white
          `}
        >
          {label}
        </div>

        {change !== undefined && (
          <div
            className={`
              text-sm
              font-bold
              flex
              items-center
              gap-1
              ${isPositive ? `text-[${emergentColors.success}]` : ''}
              ${isNegative ? `text-[${emergentColors.danger}]` : ''}
            `}
          >
            {isPositive && (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            )}
            {isNegative && (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {/* Icon + Value */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        {icon && (
          <div
            className="
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              bg-black/5
              dark:bg-white/10
            "
          >
            {icon}
          </div>
        )}

        {/* Value */}
        <div
          className="
            font-mono
            font-bold
            text-3xl
            sm:text-4xl
            tracking-tighter
          "
          style={{ color }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/**
 * Usage Examples:
 *
 * // Compact layout (default)
 * <EmergentStatTile
 *   label="XP Earned"
 *   value={2590}
 * />
 *
 * // With icon
 * <EmergentStatTile
 *   label="Streak"
 *   value={5}
 *   icon={<FireIcon className="w-5 h-5 text-[#E9C46A]" />}
 * />
 *
 * // With positive change
 * <EmergentStatTile
 *   label="Accuracy"
 *   value="84%"
 *   change={12}
 *   color={emergentColors.success}
 * />
 *
 * // With negative change
 * <EmergentStatTile
 *   label="Time per Question"
 *   value="2.3m"
 *   change={-8}
 *   color={emergentColors.danger}
 * />
 *
 * // Expanded layout
 * <EmergentStatTile
 *   label="Total Questions"
 *   value={1234}
 *   layout="expanded"
 *   icon={<QuestionIcon />}
 * />
 *
 * // Custom color
 * <EmergentStatTile
 *   label="Gold Earned"
 *   value={450}
 *   color={emergentColors.gold}
 *   icon={<CoinIcon />}
 * />
 */
