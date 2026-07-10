/**
 * EmergentInput Component
 *
 * Reusable form input component following Emergent Design System.
 *
 * Features:
 * - Label + input
 * - Error state with message
 * - Focus ring with brand color
 * - Optional helper text
 * - Disabled state
 */

import React from 'react';
import { emergentColors } from '@/lib/emergent-colors';

export interface EmergentInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message (shows red border + error text) */
  error?: string;
  /** Helper text (shows below input) */
  helperText?: string;
  /** Full width */
  fullWidth?: boolean;
}

export function EmergentInput({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}: EmergentInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const widthClasses = fullWidth ? 'w-full' : '';

  const inputClasses = `
    px-4
    py-3
    rounded-xl
    border-2
    transition-all
    duration-200
    font-medium
    text-[${emergentColors.textPrimary}]
    dark:text-white
    placeholder:text-[${emergentColors.textSecondary}]
    focus:outline-none
    ${
      error
        ? `
          border-[${emergentColors.danger}]
          focus:border-[${emergentColors.danger}]
          focus:ring-4
          focus:ring-[${emergentColors.danger}]/20
          bg-red-50/50
          dark:bg-red-900/10
        `
        : `
          border-black/10
          dark:border-white/20
          focus:border-[${emergentColors.primary}]
          focus:ring-4
          focus:ring-[${emergentColors.primary}]/20
          bg-white
          dark:bg-slate-800
        `
    }
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    dark:disabled:bg-slate-900
    ${widthClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`
            text-sm
            font-semibold
            text-[${emergentColors.textPrimary}]
            dark:text-white
          `}
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />

      {/* Error message */}
      {error && (
        <p className={`text-sm font-medium text-[${emergentColors.danger}]`}>
          {error}
        </p>
      )}

      {/* Helper text */}
      {!error && helperText && (
        <p className={`text-sm text-[${emergentColors.textSecondary}]`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Usage Examples:
 *
 * // Basic input
 * <EmergentInput
 *   label="Email"
 *   placeholder="Enter your email"
 * />
 *
 * // Input with error
 * <EmergentInput
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * // Input with helper text
 * <EmergentInput
 *   label="Username"
 *   helperText="This will be your public display name"
 * />
 *
 * // Full width input
 * <EmergentInput
 *   label="Full Name"
 *   placeholder="John Doe"
 *   fullWidth
 * />
 *
 * // Disabled input
 * <EmergentInput
 *   label="Account ID"
 *   value="12345"
 *   disabled
 * />
 */
