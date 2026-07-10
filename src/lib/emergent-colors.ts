/**
 * Emergent Design System - Color Palette
 *
 * Complete color constants for the Emergent design system.
 * Use these constants instead of hardcoded hex values for consistency.
 *
 * Theme: Organic & Earthy + Pastel & Soft
 * Vibe: Optimistic, Focused, Premium
 */

export const emergentColors = {
  // ============================================
  // BACKGROUNDS
  // ============================================
  background: '#FAF8F5',        // Warm off-white - main page background
  surface: '#FFFFFF',           // White cards, panels
  surfaceCool: '#F1F5F9',       // Cool gray - secondary surfaces

  // ============================================
  // TEXT
  // ============================================
  textPrimary: '#1E293B',       // Dark slate - main text
  textSecondary: '#64748B',     // Muted slate - secondary text
  textMuted: '#8B94A6',         // Lighter muted - tertiary text

  // ============================================
  // BRAND
  // ============================================
  primary: '#E76F51',           // Terracotta - primary actions, CTAs
  primaryHover: '#D65A3D',      // Darker terracotta - hover state
  primaryLight: '#E15838',      // Lighter terracotta - gradient end
  secondary: '#264653',         // Deep teal - secondary brand color

  // ============================================
  // ACCENTS
  // ============================================
  success: '#2A9D8F',           // Calm teal - success states
  warning: '#E9C46A',           // Gold - warnings, streaks
  danger: '#DC2626',            // Red - errors, urgent items
  info: '#7C3AED',              // Purple - info, advanced content
  gold: '#C89B3C',              // Premium gold - Pro badges

  // ============================================
  // BORDERS
  // ============================================
  borderSubtle: 'rgba(0,0,0,0.06)',    // Very subtle borders
  borderMedium: 'rgba(0,0,0,0.10)',    // Medium borders
  borderStrong: 'rgba(0,0,0,0.15)',    // Strong borders

  // ============================================
  // GLASS EFFECTS
  // ============================================
  glass: 'rgba(255,255,255,0.7)',      // Glass morphism background
  glassDark: 'rgba(30,41,59,0.1)',     // Dark glass overlay

  // ============================================
  // GRADIENTS
  // ============================================
  gradients: {
    primary: {
      from: '#E76F51',
      to: '#D65A3D',
    },
    success: {
      from: '#2A9D8F',
      to: '#10B981',
    },
    warning: {
      from: '#E9C46A',
      to: '#F59E0B',
    },
    purple: {
      from: '#7C3AED',
      to: '#A855F7',
    },
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    soft: '0 8px 30px rgb(0,0,0,0.04)',
    pop: '0 4px 14px 0 rgb(231,111,81,0.39)',
    popHover: '0 6px 20px rgba(231,111,81,0.23)',
  },
} as const;

/**
 * Helper function to get gradient CSS string
 * @param gradientKey - Key from emergentColors.gradients
 * @param direction - Gradient direction (default: 'to-br')
 */
export function getGradient(
  gradientKey: keyof typeof emergentColors.gradients,
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl' = 'to-br'
): string {
  const gradient = emergentColors.gradients[gradientKey];
  return `bg-gradient-${direction} from-[${gradient.from}] to-[${gradient.to}]`;
}

/**
 * Check if a color is from the legacy palette (should be replaced)
 */
export const legacyColors = {
  oldBlue1: '#5B7CFF',
  oldBlue2: '#4255FF',
  oldBlue3: '#3B82F6',
  oldBlue4: '#6B9FD6',
  oldGray: '#F8FAFC',
};

/**
 * Migration map: old color → new color
 */
export const colorMigrationMap: Record<string, string> = {
  '#5B7CFF': emergentColors.primary,
  '#4255FF': emergentColors.primary,
  '#3B82F6': emergentColors.primary,
  '#6B9FD6': emergentColors.primary,
  '#F8FAFC': emergentColors.background,
  '#10B981': emergentColors.success,
  '#F59E0B': emergentColors.warning,
};
