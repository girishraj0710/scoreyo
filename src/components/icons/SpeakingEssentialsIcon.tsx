import React from 'react';

interface IconProps {
  className?: string;
}

export const SpeakingEssentialsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Speaking Essentials">
      <defs>
        <linearGradient id="seMicHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="seMicBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="seBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="seWave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        <filter id="seShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      <ellipse cx="32" cy="55" rx="14" ry="3.5" fill="#000" opacity="0.15" />

      <g filter="url(#seShadow)">
        {/* stand base */}
        <ellipse cx="32" cy="50" rx="11" ry="3.2" fill="url(#seBase)" />
        <rect x="30.5" y="40" width="3" height="11" rx="1.5" fill="url(#seMicBody)" />

        {/* mic body/handle */}
        <rect x="27" y="30" width="10" height="14" rx="3.5" fill="url(#seMicBody)" />
        <rect x="33" y="30" width="4" height="14" rx="2" fill="#3B0764" opacity="0.35" />

        {/* mic head capsule */}
        <rect x="23" y="8" width="18" height="26" rx="9" fill="url(#seMicHead)" />
        <rect x="32" y="8" width="9" height="26" rx="9" fill="#3B0764" opacity="0.25" />

        {/* grille lines */}
        <rect x="26" y="15" width="12" height="1.6" rx="0.8" fill="#3B0764" opacity="0.35" />
        <rect x="26" y="20" width="12" height="1.6" rx="0.8" fill="#3B0764" opacity="0.35" />
        <rect x="26" y="25" width="12" height="1.6" rx="0.8" fill="#3B0764" opacity="0.35" />

        {/* sound waves right */}
        <path d="M45,16 Q51,21 45,28" stroke="url(#seWave)" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M49,10 Q59,21 49,32" stroke="url(#seWave)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />

        {/* sound waves left */}
        <path d="M19,16 Q13,21 19,28" stroke="url(#seWave)" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M15,10 Q5,21 15,32" stroke="url(#seWave)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />

        {/* highlight */}
        <ellipse cx="27" cy="14" rx="4" ry="7" fill="#FFFFFF" opacity="0.22" />
      </g>

      {/* sparkles */}
      <circle cx="8" cy="12" r="1.2" fill="#FFFFFF" opacity="0.5" />
      <circle cx="56" cy="12" r="1" fill="#FFFFFF" opacity="0.45" />
      <circle cx="6" cy="36" r="0.9" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
};
