import React from 'react';

interface IconProps {
  className?: string;
}

export const PracticalScenariosIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Practical Scenarios"
    >
      <defs>
        {/* Gradients for map pin (coral/orange - everyday life) */}
        <linearGradient id="ps-pin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="ps-pin-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Gradient for location card (sky blue) */}
        <linearGradient id="ps-card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="ps-card-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Gradient for base ground */}
        <radialGradient id="ps-ground-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fed7aa" stopOpacity="0" />
        </radialGradient>

        <filter id="ps-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="ps-card-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Ground glow ellipse */}
      <ellipse cx="26" cy="54" rx="20" ry="5" fill="url(#ps-ground-gradient)" />

      {/* Location card (3D, isometric-ish) behind the pin */}
      <g filter="url(#ps-card-shadow)">
        {/* Card side face */}
        <path d="M 40 20 L 58 26 L 58 46 L 40 40 Z" fill="url(#ps-card-side)" />

        {/* Card front face */}
        <rect x="34" y="18" width="24" height="24" rx="3" fill="url(#ps-card-gradient)" />

        {/* Card top face for 3D */}
        <path d="M 34 18 L 40 14 L 64 20 L 58 24 L 34 18 Z" fill="#bae6fd" opacity="0.9" />

        {/* Card text lines */}
        <rect x="38" y="24" width="14" height="2" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="38" y="29" width="16" height="1.4" rx="0.7" fill="#e0f2fe" opacity="0.8" />
        <rect x="38" y="33" width="12" height="1.4" rx="0.7" fill="#e0f2fe" opacity="0.7" />

        {/* Small clock icon on card representing a real-life plan */}
        <circle cx="47" cy="37.5" r="2.4" fill="#ffffff" opacity="0.9" />
        <line x1="47" y1="37.5" x2="47" y2="36" stroke="#0284c7" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="47" y1="37.5" x2="48.2" y2="37.9" stroke="#0284c7" strokeWidth="0.6" strokeLinecap="round" />
      </g>

      {/* 3D map pin (main focal shape) */}
      <g filter="url(#ps-shadow)">
        <path
          d="M 22 6 C 32 6 38 14 38 23 C 38 33 26 46 22 50 C 18 46 6 33 6 23 C 6 14 12 6 22 6 Z"
          fill="url(#ps-pin-gradient)"
        />
        <path
          d="M 22 6 C 32 6 38 14 38 23 C 38 33 26 46 22 50 C 18 46 6 33 6 23 C 6 14 12 6 22 6 Z"
          fill="url(#ps-pin-highlight)"
        />
        {/* Inner circle (hole) */}
        <circle cx="22" cy="22" r="8" fill="#fff7ed" />
        <circle cx="22" cy="22" r="8" fill="#fdba74" opacity="0.3" />
        {/* House glyph inside pin - everyday scenario symbol */}
        <path d="M 22 17 L 27 21.5 L 25.5 21.5 L 25.5 26 L 18.5 26 L 18.5 21.5 L 17 21.5 Z" fill="#c2410c" />
      </g>

      {/* Pin base shadow ellipse */}
      <ellipse cx="22" cy="52" rx="6" ry="1.8" fill="#7c2d12" opacity="0.25" />

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="10" cy="10" r="1" fill="#fdba74" />
        <circle cx="60" cy="12" r="1.1" fill="#7dd3fc" />
        <circle cx="8" cy="46" r="0.8" fill="#fb923c" />
        <circle cx="52" cy="52" r="0.9" fill="#38bdf8" />
      </g>
    </svg>
  );
};
