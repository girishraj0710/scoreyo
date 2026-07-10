/**
 * EmergentCard Component
 *
 * Reusable card component following Emergent Design System.
 *
 * Features:
 * - 4 variants: default, dark, hero, glass
 * - Hover effect (lift + border color change)
 * - Large border radius (rounded-3xl)
 * - Subtle border and shadow
 * - Flexible content via children
 */

import React from 'react';
import { emergentColors } from '@/lib/emergent-colors';

export interface EmergentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'default' | 'dark' | 'hero' | 'glass';
  /** Enable hover effect (lift + border glow) */
  hover?: boolean;
  /** Custom border radius (overrides default rounded-3xl) */
  rounded?: 'xl' | '2xl' | '3xl';
  /** Custom padding (overrides default p-6) */
  padding?: 'sm' | 'md' | 'lg' | 'none';
  /** Children content */
  children: React.ReactNode;
}

export function EmergentCard({
  variant = 'default',
  hover = false,
  rounded = '3xl',
  padding = 'md',
  className = '',
  children,
  ...props
}: EmergentCardProps) {
  // Variant styles
  const variantClasses = {
    default: `
      bg-white
      dark:bg-slate-800
      border
      border-black/5
      dark:border-white/10
      shadow-sm
      ${hover ? `hover:border-[${emergentColors.primary}]/30 hover:shadow-md` : ''}
    `,
    dark: `
      bg-[${emergentColors.secondary}]
      dark:bg-slate-900
      text-white
      border
      border-white/10
      shadow-md
      ${hover ? 'hover:border-white/20 hover:shadow-lg' : ''}
    `,
    hero: `
      bg-gradient-to-br
      from-[${emergentColors.primary}]
      to-[${emergentColors.primaryLight}]
      text-white
      border-0
      shadow-[${emergentColors.shadows.pop}]
      ${hover ? `hover:shadow-[${emergentColors.shadows.popHover}]` : ''}
    `,
    glass: `
      backdrop-blur-xl
      bg-white/70
      dark:bg-slate-900/70
      border
      border-black/5
      dark:border-white/10
      shadow-lg
      ${hover ? `hover:bg-white/80 hover:border-[${emergentColors.primary}]/20` : ''}
    `,
  };

  // Rounded styles
  const roundedClasses = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  // Padding styles
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Hover styles
  const hoverClasses = hover
    ? 'transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer'
    : 'transition-all duration-200';

  // Combine all classes
  const cardClasses = `
    ${variantClasses[variant]}
    ${roundedClasses[rounded]}
    ${paddingClasses[padding]}
    ${hoverClasses}
    flex
    flex-col
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

/**
 * Usage Examples:
 *
 * // Default card
 * <EmergentCard>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </EmergentCard>
 *
 * // Card with hover effect
 * <EmergentCard hover onClick={handleClick}>
 *   <h3>Interactive Card</h3>
 *   <p>Click me!</p>
 * </EmergentCard>
 *
 * // Dark variant
 * <EmergentCard variant="dark">
 *   <h3 className="text-white">Dark Card</h3>
 *   <p className="text-white/80">Dark background</p>
 * </EmergentCard>
 *
 * // Hero variant (gradient)
 * <EmergentCard variant="hero">
 *   <h1 className="text-4xl font-bold">Daily MCQ</h1>
 *   <p className="text-white/90">Challenge yourself!</p>
 * </EmergentCard>
 *
 * // Glass variant (glassmorphism)
 * <EmergentCard variant="glass">
 *   <header>Sticky Header</header>
 * </EmergentCard>
 *
 * // Custom rounded corners
 * <EmergentCard rounded="2xl">
 *   <p>Rounded 2xl</p>
 * </EmergentCard>
 *
 * // Custom padding
 * <EmergentCard padding="lg">
 *   <h2>Large Padding</h2>
 * </EmergentCard>
 *
 * // No padding (useful for full-bleed images)
 * <EmergentCard padding="none">
 *   <img src="..." alt="..." className="w-full rounded-t-3xl" />
 *   <div className="p-6">
 *     <h3>Image Card</h3>
 *   </div>
 * </EmergentCard>
 */
