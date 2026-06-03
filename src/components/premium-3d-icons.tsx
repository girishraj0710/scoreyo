// Premium Flat Icons with Subtle Depth - Matching Modern Educational Design
// Simple, clean, meaningful icons with soft color palettes

export function Icon3DBook({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="18" ry="2" fill="#000000" opacity="0.08" />

      {/* Book pages stack */}
      <rect x="16" y="14" width="32" height="38" rx="2" fill="#E8EAF6" />
      <rect x="17" y="15" width="30" height="36" rx="1.5" fill="#F5F5F5" />

      {/* Book cover */}
      <rect x="18" y="12" width="28" height="38" rx="2" fill="#5C6BC0" />

      {/* Bookmark */}
      <rect x="38" y="12" width="4" height="20" fill="#FF7043" />
      <path d="M38 32 L40 29 L42 32 V12 H38 Z" fill="#FF7043" />

      {/* Page lines */}
      <line x1="24" y1="24" x2="38" y2="24" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <line x1="24" y1="30" x2="38" y2="30" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <line x1="24" y1="36" x2="32" y2="36" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export function Icon3DPencil({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="30" cy="58" rx="14" ry="2" fill="#000000" opacity="0.08" />

      {/* Pencil body */}
      <rect x="18" y="10" width="12" height="42" rx="1.5" fill="#FFB74D" transform="rotate(30 24 31)" />

      {/* Pencil eraser holder */}
      <rect x="12" y="8" width="12" height="4" rx="0.5" fill="#78909C" transform="rotate(30 18 10)" />

      {/* Pencil eraser */}
      <rect x="10" y="4" width="12" height="4" rx="1" fill="#EF5350" transform="rotate(30 16 6)" />

      {/* Pencil tip wood */}
      <path d="M40 40 L46 46 L44 48 L38 42 Z" fill="#FDD835" />

      {/* Pencil tip lead */}
      <path d="M44 48 L48 52 L46 54 L42 50 Z" fill="#424242" />

      {/* Pencil shine */}
      <rect x="20" y="16" width="3" height="24" rx="1" fill="#FFFFFF" opacity="0.2" transform="rotate(30 21.5 28)" />
    </svg>
  );
}

export function Icon3DNotebook({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="20" ry="2" fill="#000000" opacity="0.08" />

      {/* Notebook cover */}
      <rect x="16" y="10" width="32" height="44" rx="2" fill="#AB47BC" />

      {/* Spiral binding holes */}
      <circle cx="14" cy="16" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="14" cy="26" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="14" cy="36" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="14" cy="46" r="2.5" fill="#FFFFFF" opacity="0.9" />

      {/* Notebook paper */}
      <rect x="20" y="14" width="24" height="36" rx="1" fill="#FFFFFF" />

      {/* Lines on paper */}
      <line x1="24" y1="22" x2="40" y2="22" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="28" x2="40" y2="28" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="34" x2="40" y2="34" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="40" x2="40" y2="40" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />

      {/* Red margin line */}
      <line x1="26" y1="18" x2="26" y2="46" stroke="#EF5350" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export function Icon3DSparkle({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="2" fill="#000000" opacity="0.08" />

      {/* Main star */}
      <path d="M32 8 L36 22 L50 24 L38 34 L42 48 L32 40 L22 48 L26 34 L14 24 L28 22 Z" fill="#FFD54F" />

      {/* Star highlight */}
      <path d="M32 8 L34 18 L44 20 L36 27 L38 37 L32 32 Z" fill="#FFF9C4" opacity="0.6" />

      {/* Small sparkles */}
      <circle cx="48" cy="16" r="3" fill="#FFE082" />
      <circle cx="16" cy="20" r="2.5" fill="#FFE082" />
      <circle cx="50" cy="44" r="2" fill="#FFE082" />

      {/* Tiny sparkle accents */}
      <path d="M48 16 L49 13 L50 16 L53 17 L50 18 L49 21 L48 18 L45 17 Z" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

export function Icon3DChart({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="22" ry="2" fill="#000000" opacity="0.08" />

      {/* Chart background */}
      <rect x="10" y="10" width="44" height="40" rx="2" fill="#F5F5F5" />

      {/* Chart bars */}
      <rect x="16" y="34" width="8" height="12" rx="1" fill="#66BB6A" />
      <rect x="28" y="26" width="8" height="20" rx="1" fill="#42A5F5" />
      <rect x="40" y="20" width="8" height="26" rx="1" fill="#AB47BC" />

      {/* Bar highlights */}
      <rect x="17" y="35" width="2" height="10" rx="0.5" fill="#FFFFFF" opacity="0.3" />
      <rect x="29" y="27" width="2" height="18" rx="0.5" fill="#FFFFFF" opacity="0.3" />
      <rect x="41" y="21" width="2" height="24" rx="0.5" fill="#FFFFFF" opacity="0.3" />

      {/* Growth arrow */}
      <path d="M12 38 L24 30 L36 34 L48 22" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M48 22 L44 24 L46 28 Z" fill="#FF7043" />
    </svg>
  );
}

export function Icon3DTrophy({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="18" ry="2" fill="#000000" opacity="0.08" />

      {/* Trophy base */}
      <rect x="22" y="48" width="20" height="6" rx="1" fill="#8D6E63" />

      {/* Trophy stem */}
      <rect x="29" y="40" width="6" height="8" rx="1" fill="#A1887F" />

      {/* Trophy cup bottom */}
      <path d="M20 22 L22 40 L42 40 L44 22 Z" fill="#FFB300" />

      {/* Trophy cup top rim */}
      <ellipse cx="32" cy="22" rx="12" ry="3" fill="#FFD54F" />

      {/* Trophy handles */}
      <path d="M18 24 C14 26, 14 30, 18 32 L20 28 Z" fill="#FFA726" />
      <path d="M46 24 C50 26, 50 30, 46 32 L44 28 Z" fill="#FFA726" />

      {/* Trophy shine */}
      <ellipse cx="28" cy="28" rx="3" ry="8" fill="#FFFFFF" opacity="0.25" />

      {/* Star on trophy */}
      <path d="M32 26 L33 29 L36 29 L34 31 L35 34 L32 32 L29 34 L30 31 L28 29 L31 29 Z" fill="#FFF59D" />
    </svg>
  );
}

export function Icon3DRocket({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="14" ry="2" fill="#000000" opacity="0.08" />

      {/* Rocket flames */}
      <ellipse cx="32" cy="50" rx="6" ry="8" fill="#FF7043" />
      <ellipse cx="32" cy="50" rx="4" ry="6" fill="#FFB74D" />
      <ellipse cx="32" cy="50" rx="2" ry="4" fill="#FFF59D" />

      {/* Rocket body */}
      <rect x="24" y="20" width="16" height="30" rx="2" fill="#7E57C2" />

      {/* Rocket nose cone */}
      <path d="M24 20 L32 6 L40 20 Z" fill="#9575CD" />

      {/* Rocket window */}
      <circle cx="32" cy="28" r="5" fill="#42A5F5" />
      <circle cx="32" cy="28" r="4" fill="#90CAF9" opacity="0.5" />

      {/* Rocket fins */}
      <path d="M24 40 L18 48 L24 46 Z" fill="#5E35B1" />
      <path d="M40 40 L46 48 L40 46 Z" fill="#5E35B1" />

      {/* Rocket stripes */}
      <rect x="24" y="36" width="16" height="2" fill="#FFFFFF" opacity="0.2" />

      {/* Rocket highlight */}
      <rect x="26" y="22" width="2" height="24" rx="1" fill="#FFFFFF" opacity="0.15" />
    </svg>
  );
}

export function Icon3DGraduationCap({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="20" ry="2" fill="#000000" opacity="0.08" />

      {/* Cap base (diamond shape) */}
      <path d="M32 20 L50 28 L32 36 L14 28 Z" fill="#263238" />

      {/* Cap top layer */}
      <path d="M32 20 L50 28 L32 32 L14 28 Z" fill="#37474F" />

      {/* Mortarboard top */}
      <rect x="20" y="24" width="24" height="3" fill="#455A64" />

      {/* Cap drape left */}
      <path d="M14 28 L14 38 L32 46 L32 36 Z" fill="#1E88E5" opacity="0.7" />

      {/* Cap drape right */}
      <path d="M50 28 L50 38 L32 46 L32 36 Z" fill="#1976D2" opacity="0.5" />

      {/* Tassel string */}
      <line x1="32" y1="20" x2="38" y2="12" stroke="#FFB300" strokeWidth="1.5" />

      {/* Tassel top */}
      <circle cx="38" cy="12" r="2" fill="#FFD54F" />

      {/* Tassel threads */}
      <line x1="38" y1="12" x2="36" y2="16" stroke="#FFB300" strokeWidth="1" opacity="0.8" />
      <line x1="38" y1="12" x2="38" y2="16" stroke="#FFB300" strokeWidth="1" opacity="0.8" />
      <line x1="38" y1="12" x2="40" y2="16" stroke="#FFB300" strokeWidth="1" opacity="0.8" />
    </svg>
  );
}

export function Icon3DTarget({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="18" ry="2" fill="#000000" opacity="0.08" />

      {/* Target rings */}
      <circle cx="32" cy="32" r="22" fill="#FFEBEE" />
      <circle cx="32" cy="32" r="17" fill="#FFCDD2" />
      <circle cx="32" cy="32" r="12" fill="#EF9A9A" />
      <circle cx="32" cy="32" r="7" fill="#EF5350" />
      <circle cx="32" cy="32" r="3" fill="#E53935" />

      {/* Arrow shaft */}
      <rect x="38" y="16" width="3" height="20" rx="1.5" fill="#8D6E63" transform="rotate(45 39.5 26)" />

      {/* Arrow tip */}
      <path d="M46 14 L50 10 L48 16 Z" fill="#5D4037" />

      {/* Arrow fletching */}
      <path d="M36 28 L34 26 L36 24 Z" fill="#FF7043" />
      <path d="M36 28 L34 30 L36 32 Z" fill="#FF5722" />

      {/* Target stand */}
      <rect x="30" y="48" width="4" height="8" fill="#78909C" />
      <rect x="26" y="54" width="12" height="2" rx="1" fill="#546E7A" />
    </svg>
  );
}

export function Icon3DFolder({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="22" ry="2" fill="#000000" opacity="0.08" />

      {/* Folder back */}
      <rect x="12" y="22" width="40" height="28" rx="2" fill="#FFB74D" />

      {/* Folder tab */}
      <path d="M12 22 L12 18 C12 16.8954 12.8954 16 14 16 L26 16 L30 22 Z" fill="#FFA726" />

      {/* Folder front */}
      <rect x="12" y="24" width="40" height="26" rx="2" fill="#FFD54F" />

      {/* Folder label area */}
      <rect x="18" y="32" width="28" height="12" rx="1" fill="#FFFFFF" opacity="0.3" />

      {/* Folder shine */}
      <rect x="14" y="26" width="4" height="20" rx="1" fill="#FFFFFF" opacity="0.15" />
    </svg>
  );
}

export function Icon3DClipboard({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="18" ry="2" fill="#000000" opacity="0.08" />

      {/* Clipboard board */}
      <rect x="18" y="12" width="28" height="40" rx="2" fill="#A1887F" />

      {/* Clipboard paper */}
      <rect x="20" y="18" width="24" height="34" rx="1" fill="#FFFFFF" />

      {/* Clipboard clip */}
      <rect x="28" y="8" width="8" height="8" rx="2" fill="#78909C" />
      <rect x="29" y="10" width="6" height="6" rx="1" fill="#90A4AE" />

      {/* Paper lines */}
      <line x1="24" y1="26" x2="40" y2="26" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="32" x2="40" y2="32" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="38" x2="40" y2="38" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="44" x2="34" y2="44" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" />

      {/* Checkmarks */}
      <path d="M24 26 L26 28 L28 24" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24 32 L26 34 L28 30" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Icon3DBell({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="2" fill="#000000" opacity="0.08" />

      {/* Bell body */}
      <path d="M22 34 C22 24, 28 18, 32 18 C36 18, 42 24, 42 34 L42 42 L22 42 Z" fill="#FFB300" />

      {/* Bell rim */}
      <ellipse cx="32" cy="42" rx="10" ry="2" fill="#FF8F00" />

      {/* Bell top */}
      <circle cx="32" cy="16" r="3" fill="#FFA726" />
      <rect x="31" y="12" width="2" height="4" fill="#8D6E63" />

      {/* Bell clapper */}
      <circle cx="32" cy="46" r="2.5" fill="#546E7A" />
      <line x1="32" y1="42" x2="32" y2="44" stroke="#78909C" strokeWidth="1.5" />

      {/* Bell shine */}
      <ellipse cx="28" cy="28" rx="3" ry="6" fill="#FFFFFF" opacity="0.25" />

      {/* Notification dot */}
      <circle cx="42" cy="22" r="4" fill="#EF5350" />
      <circle cx="42" cy="22" r="2.5" fill="#FFCDD2" opacity="0.5" />
    </svg>
  );
}

export function Icon3DLightbulb({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="14" ry="2" fill="#000000" opacity="0.08" />

      {/* Bulb base screw */}
      <rect x="28" y="46" width="8" height="2" fill="#90A4AE" />
      <rect x="28" y="48" width="8" height="2" fill="#78909C" />
      <rect x="28" y="50" width="8" height="2" fill="#90A4AE" />

      {/* Bulb base */}
      <rect x="27" y="42" width="10" height="4" rx="1" fill="#B0BEC5" />

      {/* Bulb glass */}
      <circle cx="32" cy="28" r="14" fill="#FFF59D" />
      <circle cx="32" cy="28" r="12" fill="#FFEE58" />

      {/* Bulb filament */}
      <path d="M32 22 L32 34" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 26 C28 26, 30 28, 32 28 C34 28, 36 26, 36 26" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Light rays */}
      <line x1="32" y1="10" x2="32" y2="6" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="20" x2="52" y2="16" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="36" x2="52" y2="40" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="20" x2="12" y2="16" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="36" x2="12" y2="40" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" />
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
  folder: Icon3DFolder,
  clipboard: Icon3DClipboard,
  bell: Icon3DBell,
  lightbulb: Icon3DLightbulb,
};

export type Icon3DType = keyof typeof Icon3DMap;
