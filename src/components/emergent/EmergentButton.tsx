/**
 * EmergentButton Component
 *
 * Reusable button component following Emergent Design System.
 *
 * Features:
 * - 4 variants: primary, secondary, outline, ghost
 * - 3 sizes: sm, md, lg
 * - Loading state with spinner
 * - Disabled state
 * - Hover lift effect
 * - Active press effect
 * - Custom shadow with brand color (primary variant)
 */

import React from 'react';
import { emergentColors } from '@/lib/emergent-colors';

export interface EmergentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state - shows spinner */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Optional icon (left side) */
  icon?: React.ReactNode;
  /** Children (button text) */
  children: React.ReactNode;
}

export function EmergentButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  onClick,
  ...props
}: EmergentButtonProps) {
  // Variant styles
  const variantClasses = {
    primary: `
      bg-[${emergentColors.primary}]
      text-white
      hover:bg-[${emergentColors.primaryHover}]
      shadow-[0_4px_14px_0_rgb(231,111,81,0.39)]
      hover:shadow-[0_6px_20px_rgba(231,111,81,0.23)]
      focus:ring-[${emergentColors.primary}]/20
    `,
    secondary: `
      bg-[${emergentColors.secondary}]
      text-white
      hover:bg-[#1E3A45]
      shadow-sm
      hover:shadow-md
      focus:ring-[${emergentColors.secondary}]/20
    `,
    outline: `
      bg-transparent
      border-2
      border-[${emergentColors.primary}]
      text-[${emergentColors.primary}]
      hover:bg-[${emergentColors.primary}]/5
      hover:border-[${emergentColors.primaryHover}]
      focus:ring-[${emergentColors.primary}]/20
    `,
    ghost: `
      bg-transparent
      text-[${emergentColors.textPrimary}]
      hover:bg-black/5
      focus:ring-black/10
    `,
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  // Disabled styles
  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none'
    : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95';

  // Width styles
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `
    inline-flex
    items-center
    justify-center
    gap-2
    font-semibold
    tracking-wide
    transition-all
    duration-200
    focus:outline-none
    focus:ring-4
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabledClasses}
    ${widthClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {/* Icon */}
      {!loading && icon && <span>{icon}</span>}

      {/* Button text */}
      <span>{children}</span>
    </button>
  );
}

/**
 * Usage Examples:
 *
 * // Primary button (default)
 * <EmergentButton onClick={handleClick}>
 *   Start Learning
 * </EmergentButton>
 *
 * // Secondary button
 * <EmergentButton variant="secondary">
 *   View Details
 * </EmergentButton>
 *
 * // Outline button
 * <EmergentButton variant="outline">
 *   Cancel
 * </EmergentButton>
 *
 * // Ghost button
 * <EmergentButton variant="ghost">
 *   Skip
 * </EmergentButton>
 *
 * // Small button
 * <EmergentButton size="sm">
 *   Done
 * </EmergentButton>
 *
 * // Large button
 * <EmergentButton size="lg">
 *   Take Mock Test
 * </EmergentButton>
 *
 * // Loading state
 * <EmergentButton loading>
 *   Submitting...
 * </EmergentButton>
 *
 * // Disabled state
 * <EmergentButton disabled>
 *   Locked
 * </EmergentButton>
 *
 * // With icon
 * <EmergentButton icon={<PlayIcon />}>
 *   Start Quiz
 * </EmergentButton>
 *
 * // Full width
 * <EmergentButton fullWidth>
 *   Continue
 * </EmergentButton>
 */
