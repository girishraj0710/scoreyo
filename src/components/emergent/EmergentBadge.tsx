/**
 * EmergentBadge Component
 *
 * Reusable badge component following Emergent Design System.
 * Used for status indicators, tags, labels, achievements, etc.
 *
 * Features:
 * - 5 variants: success, warning, error, info, neutral
 * - 2 sizes: sm, md
 * - Optional dot indicator
 * - Optional icon
 */

import React from 'react';
import { emergentColors } from '@/lib/emergent-colors';

export interface EmergentBadgeProps {
  /** Badge variant */
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** Badge size */
  size?: 'sm' | 'md';
  /** Show dot indicator */
  dot?: boolean;
  /** Optional icon (left side) */
  icon?: React.ReactNode;
  /** Badge text */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

export function EmergentBadge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  icon,
  children,
  className = '',
}: EmergentBadgeProps) {
  // Variant styles
  const variantClasses = {
    success: `
      bg-[${emergentColors.success}]/10
      dark:bg-[${emergentColors.success}]/20
      text-[${emergentColors.success}]
      border-[${emergentColors.success}]/20
    `,
    warning: `
      bg-[${emergentColors.warning}]/10
      dark:bg-[${emergentColors.warning}]/20
      text-[#B8860B]
      border-[${emergentColors.warning}]/20
    `,
    error: `
      bg-[${emergentColors.danger}]/10
      dark:bg-[${emergentColors.danger}]/20
      text-[${emergentColors.danger}]
      border-[${emergentColors.danger}]/20
    `,
    info: `
      bg-[${emergentColors.info}]/10
      dark:bg-[${emergentColors.info}]/20
      text-[${emergentColors.info}]
      border-[${emergentColors.info}]/20
    `,
    neutral: `
      bg-slate-100
      dark:bg-slate-800
      text-[${emergentColors.textSecondary}]
      border-black/10
      dark:border-white/10
    `,
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl',
  };

  // Dot color
  const dotColors = {
    success: emergentColors.success,
    warning: '#B8860B',
    error: emergentColors.danger,
    info: emergentColors.info,
    neutral: emergentColors.textSecondary,
  };

  // Combine all classes
  const badgeClasses = `
    inline-flex
    items-center
    gap-1.5
    font-medium
    border
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <span className={badgeClasses}>
      {/* Dot indicator */}
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColors[variant] }}
        />
      )}

      {/* Icon */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Badge text */}
      <span>{children}</span>
    </span>
  );
}

/**
 * Usage Examples:
 *
 * // Success badge
 * <EmergentBadge variant="success">
 *   Completed
 * </EmergentBadge>
 *
 * // Warning badge
 * <EmergentBadge variant="warning">
 *   Due Soon
 * </EmergentBadge>
 *
 * // Error badge
 * <EmergentBadge variant="error">
 *   Failed
 * </EmergentBadge>
 *
 * // Info badge
 * <EmergentBadge variant="info">
 *   New
 * </EmergentBadge>
 *
 * // Neutral badge
 * <EmergentBadge variant="neutral">
 *   JEE Main
 * </EmergentBadge>
 *
 * // With dot indicator
 * <EmergentBadge variant="success" dot>
 *   Active
 * </EmergentBadge>
 *
 * // Medium size
 * <EmergentBadge size="md" variant="info">
 *   CEFR B2
 * </EmergentBadge>
 *
 * // With icon
 * <EmergentBadge
 *   variant="warning"
 *   icon={<FireIcon className="w-4 h-4" />}
 * >
 *   3 Day Streak
 * </EmergentBadge>
 */
