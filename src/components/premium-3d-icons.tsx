// 3D Icon Components with shadows and depth - matching reference design

export function Icon3DBook({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="20" ry="3" fill="black" opacity="0.1" />

      {/* Book spine */}
      <path d="M18 12 L18 52 L20 54 L20 14 Z" fill="#2D7A5E" />

      {/* Book cover */}
      <rect x="20" y="12" width="26" height="40" rx="2" fill="#34D399" />
      <rect x="20" y="12" width="26" height="40" rx="2" fill="url(#bookGradient)" />

      {/* Page indicator */}
      <rect x="24" y="28" width="8" height="2" rx="1" fill="white" opacity="0.8" />

      {/* Book depth/pages */}
      <path d="M46 12 L48 14 L48 54 L46 52 Z" fill="#10B981" />

      <defs>
        <linearGradient id="bookGradient" x1="20" y1="12" x2="46" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DPencil({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="28" cy="58" rx="16" ry="3" fill="black" opacity="0.1" transform="rotate(-45 28 58)" />

      {/* Pencil eraser holder */}
      <path d="M8 12 L12 8 L14 10 L10 14 Z" fill="#94A3B8" />

      {/* Pencil eraser */}
      <path d="M12 8 L18 2 L22 6 L16 12 Z" fill="#FCA5A5" />

      {/* Pencil body */}
      <rect x="10" y="14" width="40" height="8" rx="1" fill="#F97316" transform="rotate(-45 30 18)" />
      <rect x="10" y="14" width="40" height="8" rx="1" fill="url(#pencilGradient)" transform="rotate(-45 30 18)" />

      {/* Pencil wood part */}
      <path d="M44 44 L48 48 L50 46 L46 42 Z" fill="#FDE68A" />

      {/* Pencil tip */}
      <path d="M48 48 L52 52 L50 54 L46 50 Z" fill="#78350F" />
      <path d="M50 50 L54 54 L52 56 L50 54 Z" fill="#1F2937" />

      <defs>
        <linearGradient id="pencilGradient" x1="10" y1="14" x2="50" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DNotebook({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="22" ry="3" fill="black" opacity="0.1" />

      {/* Spiral binding */}
      <circle cx="14" cy="16" r="2" fill="#94A3B8" />
      <circle cx="14" cy="24" r="2" fill="#94A3B8" />
      <circle cx="14" cy="32" r="2" fill="#94A3B8" />
      <circle cx="14" cy="40" r="2" fill="#94A3B8" />
      <circle cx="14" cy="48" r="2" fill="#94A3B8" />

      {/* Notebook cover */}
      <rect x="18" y="10" width="32" height="44" rx="2" fill="#A855F7" />
      <rect x="18" y="10" width="32" height="44" rx="2" fill="url(#notebookGradient)" />

      {/* Notebook lines */}
      <line x1="24" y1="20" x2="44" y2="20" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="26" x2="44" y2="26" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="32" x2="44" y2="32" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="38" x2="44" y2="38" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="44" x2="44" y2="44" stroke="white" strokeWidth="1" opacity="0.6" />

      {/* Notebook depth */}
      <path d="M50 10 L52 12 L52 56 L50 54 Z" fill="#7C3AED" />

      <defs>
        <linearGradient id="notebookGradient" x1="18" y1="10" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DSparkle({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="18" ry="3" fill="black" opacity="0.1" />

      {/* Main star */}
      <path d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" fill="#FBBF24" />
      <path d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" fill="url(#sparkleGradient)" />

      {/* Small sparkles */}
      <circle cx="48" cy="16" r="3" fill="#FDE047" />
      <circle cx="16" cy="20" r="2" fill="#FDE047" />
      <circle cx="50" cy="44" r="2" fill="#FDE047" />

      <defs>
        <linearGradient id="sparkleGradient" x1="32" y1="8" x2="32" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DChart({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="24" ry="3" fill="black" opacity="0.1" />

      {/* Chart bars */}
      <rect x="12" y="36" width="10" height="16" rx="2" fill="#34D399" />
      <rect x="12" y="36" width="10" height="16" rx="2" fill="url(#bar1Gradient)" />

      <rect x="27" y="24" width="10" height="28" rx="2" fill="#10B981" />
      <rect x="27" y="24" width="10" height="28" rx="2" fill="url(#bar2Gradient)" />

      <rect x="42" y="16" width="10" height="36" rx="2" fill="#059669" />
      <rect x="42" y="16" width="10" height="36" rx="2" fill="url(#bar3Gradient)" />

      {/* Trend line */}
      <path d="M 16 42 Q 32 28, 48 20" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="20" r="3" fill="#FBBF24" />

      <defs>
        <linearGradient id="bar1Gradient" x1="17" y1="36" x2="17" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="bar2Gradient" x1="32" y1="24" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="bar3Gradient" x1="47" y1="16" x2="47" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DTrophy({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="20" ry="3" fill="black" opacity="0.1" />

      {/* Trophy base */}
      <rect x="24" y="48" width="16" height="6" rx="1" fill="#78350F" />

      {/* Trophy stem */}
      <rect x="30" y="38" width="4" height="10" fill="#92400E" />

      {/* Trophy cup */}
      <path d="M18 18 L20 38 L44 38 L46 18 Z" fill="#FBBF24" />
      <path d="M18 18 L20 38 L44 38 L46 18 Z" fill="url(#trophyGradient)" />

      {/* Trophy handles */}
      <path d="M16 20 Q12 24, 14 28 L18 26 L18 22 Z" fill="#F59E0B" />
      <path d="M48 20 Q52 24, 50 28 L46 26 L46 22 Z" fill="#F59E0B" />

      {/* Trophy rim */}
      <ellipse cx="32" cy="18" rx="14" ry="4" fill="#FDE047" />

      {/* Star decoration */}
      <path d="M32 24 L34 28 L38 28 L35 31 L36 35 L32 32 L28 35 L29 31 L26 28 L30 28 Z" fill="#FDE047" />

      <defs>
        <linearGradient id="trophyGradient" x1="32" y1="18" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DRocket({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="3" fill="black" opacity="0.1" />

      {/* Rocket flame */}
      <path d="M26 48 L28 54 L32 50 L36 54 L38 48 Z" fill="#F97316" />
      <path d="M28 50 L30 54 L32 52 L34 54 L36 50 Z" fill="#FDE047" />

      {/* Rocket fins */}
      <path d="M20 36 L24 44 L28 40 Z" fill="#C084FC" />
      <path d="M44 36 L40 44 L36 40 Z" fill="#C084FC" />

      {/* Rocket body */}
      <rect x="26" y="24" width="12" height="24" rx="1" fill="#A855F7" />
      <rect x="26" y="24" width="12" height="24" rx="1" fill="url(#rocketGradient)" />

      {/* Rocket nose */}
      <path d="M26 24 L32 8 L38 24 Z" fill="#E879F9" />

      {/* Rocket window */}
      <circle cx="32" cy="32" r="4" fill="#60A5FA" opacity="0.6" />
      <circle cx="32" cy="32" r="3" fill="#DBEAFE" opacity="0.8" />

      <defs>
        <linearGradient id="rocketGradient" x1="32" y1="24" x2="32" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DGraduationCap({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="24" ry="3" fill="black" opacity="0.1" />

      {/* Cap base */}
      <path d="M10 32 L32 24 L54 32 L32 40 Z" fill="#3B82F6" />
      <path d="M10 32 L32 24 L54 32 L32 40 Z" fill="url(#capGradient)" />

      {/* Cap top (mortar board) */}
      <rect x="22" y="28" width="20" height="2" fill="#2563EB" />
      <path d="M20 26 L44 26 L42 28 L22 28 Z" fill="#1E40AF" />

      {/* Tassel */}
      <line x1="32" y1="24" x2="38" y2="18" stroke="#FBBF24" strokeWidth="1.5" />
      <circle cx="38" cy="18" r="2" fill="#FDE047" />
      <path d="M38 18 L36 22 L38 20 L40 22 Z" fill="#FBBF24" />

      {/* Cap sides */}
      <path d="M32 40 L10 32 L10 42 L32 50 Z" fill="#60A5FA" opacity="0.6" />
      <path d="M32 40 L54 32 L54 42 L32 50 Z" fill="#1D4ED8" opacity="0.4" />

      <defs>
        <linearGradient id="capGradient" x1="32" y1="24" x2="32" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Icon3DTarget({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="20" ry="3" fill="black" opacity="0.1" />

      {/* Target rings */}
      <circle cx="32" cy="32" r="24" fill="#FEE2E2" />
      <circle cx="32" cy="32" r="18" fill="#FECACA" />
      <circle cx="32" cy="32" r="12" fill="#FCA5A5" />
      <circle cx="32" cy="32" r="6" fill="#EF4444" />

      {/* Arrow */}
      <path d="M42 12 L32 32 L34 32 L44 12 Z" fill="#78350F" />
      <path d="M42 12 L46 10 L44 14 Z" fill="#DC2626" />
      <path d="M30 32 L32 34 L34 32 L32 30 Z" fill="#78350F" />

      <defs>
        <radialGradient id="targetGlow">
          <stop stopColor="#FEE2E2" />
          <stop offset="1" stopColor="#DC2626" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Icon mapping for easy use
export const Icon3DMap = {
  book: Icon3DBook,
  pencil: Icon3DPencil,
  notebook: Icon3DNotebook,
  sparkle: Icon3DSparkle,
  chart: Icon3DChart,
  trophy: Icon3DTrophy,
  rocket: Icon3DRocket,
  graduation: Icon3DGraduationCap,
  target: Icon3DTarget,
};

export type Icon3DType = keyof typeof Icon3DMap;
