import React from 'react';

interface IconProps {
  className?: string;
}

export const PresentationsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Presentations"
    >
      <defs>
        {/* Gradients for screen */}
        <linearGradient id="screen-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="screen-content" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.4" />
        </linearGradient>

        {/* Gradient for podium */}
        <linearGradient id="podium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        {/* Shadow filters */}
        <filter id="screen-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <filter id="podium-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="28" r="28" fill="#ccfbf1" opacity="0.3" />

      {/* Presentation screen with stand */}
      <g filter="url(#screen-shadow)">
        {/* Screen frame */}
        <rect
          x="12"
          y="8"
          width="40"
          height="28"
          rx="2"
          fill="url(#screen-gradient)"
        />

        {/* Screen border (3D effect) */}
        <rect
          x="12"
          y="8"
          width="40"
          height="28"
          rx="2"
          stroke="#0f766e"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Screen content area */}
        <rect
          x="15"
          y="11"
          width="34"
          height="22"
          rx="1"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* Presentation content - title */}
        <rect x="18" y="14" width="20" height="2" rx="1" fill="#0d9488" opacity="0.8" />

        {/* Presentation content - bullet points */}
        <circle cx="19" cy="19.5" r="0.8" fill="#14b8a6" opacity="0.7" />
        <rect x="21" y="19" width="24" height="1" rx="0.5" fill="#5eead4" opacity="0.6" />

        <circle cx="19" cy="22.5" r="0.8" fill="#14b8a6" opacity="0.7" />
        <rect x="21" y="22" width="22" height="1" rx="0.5" fill="#5eead4" opacity="0.6" />

        <circle cx="19" cy="25.5" r="0.8" fill="#14b8a6" opacity="0.7" />
        <rect x="21" y="25" width="20" height="1" rx="0.5" fill="#5eead4" opacity="0.6" />

        {/* Chart visualization */}
        <g opacity="0.5">
          <rect x="40" y="24" width="3" height="6" rx="0.5" fill="#14b8a6" />
          <rect x="44" y="20" width="3" height="10" rx="0.5" fill="#2dd4bf" />
        </g>

        {/* Screen stand (tripod) */}
        <path
          d="M 32 36 L 32 42"
          stroke="#0d9488"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Tripod base */}
        <path
          d="M 28 42 L 32 42 L 36 42"
          stroke="#0f766e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Podium with microphone */}
      <g filter="url(#podium-shadow)">
        {/* Podium body */}
        <path
          d="M 18 44 L 22 44 L 24 56 L 16 56 Z"
          fill="url(#podium-gradient)"
        />

        {/* Podium 3D side face */}
        <path
          d="M 22 44 L 24 44 L 26 56 L 24 56 Z"
          fill="#0d9488"
          opacity="0.7"
        />

        {/* Podium top surface */}
        <ellipse cx="20" cy="44" rx="4" ry="1.5" fill="#2dd4bf" />

        {/* Podium front highlight */}
        <path
          d="M 18 44 L 19 44 L 20 56 L 18 56 Z"
          fill="#ffffff"
          opacity="0.2"
        />

        {/* Microphone stand */}
        <line
          x1="20"
          y1="44"
          x2="20"
          y2="38"
          stroke="#0f766e"
          strokeWidth="0.8"
        />

        {/* Microphone head */}
        <ellipse cx="20" cy="37" rx="2" ry="2.5" fill="#14b8a6" />
        <ellipse cx="20" cy="37" rx="1.5" ry="2" fill="#2dd4bf" />

        {/* Microphone mesh texture */}
        <g opacity="0.4">
          <line x1="19" y1="36" x2="19" y2="38" stroke="#0d9488" strokeWidth="0.3" />
          <line x1="20" y1="36" x2="20" y2="38" stroke="#0d9488" strokeWidth="0.3" />
          <line x1="21" y1="36" x2="21" y2="38" stroke="#0d9488" strokeWidth="0.3" />
        </g>
      </g>

      {/* Decorative presentation sparkles */}
      <g opacity="0.5">
        <circle cx="10" cy="14" r="1" fill="#5eead4" />
        <circle cx="54" cy="12" r="1.2" fill="#2dd4bf" />
        <circle cx="8" cy="30" r="0.8" fill="#14b8a6" />
        <circle cx="56" cy="32" r="1" fill="#99f6e4" />
      </g>

      {/* Spotlight effect on screen */}
      <ellipse
        cx="32"
        cy="22"
        rx="12"
        ry="8"
        fill="#ffffff"
        opacity="0.15"
      />
    </svg>
  );
};
