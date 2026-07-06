import React from 'react';

interface IconProps {
  className?: string;
}

export const ListeningComprehensionIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Listening Comprehension">
      <defs>
        <linearGradient id="lcBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id="lcCupFront" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
        <radialGradient id="lcCupFront2" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#065F46" />
        </radialGradient>
        <linearGradient id="lcCupSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>
        <radialGradient id="lcPad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#D9F99D" />
          <stop offset="100%" stopColor="#4D7C0F" />
        </radialGradient>
        <filter id="lcShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.26" />
        </filter>
      </defs>

      <ellipse cx="32" cy="55" rx="16" ry="3.5" fill="#000" opacity="0.15" />

      <g filter="url(#lcShadow)">
        {/* headband */}
        <path d="M14,30 Q14,8 32,8 Q50,8 50,30" stroke="url(#lcBand)" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* left ear cup (partial, perspective) */}
        <ellipse cx="14" cy="33" rx="6.5" ry="9" fill="url(#lcCupFront2)" />

        {/* right ear cup (main, 3D with side face) */}
        <polygon points="56,24 61,26.5 61,38.5 56,41" fill="url(#lcCupSide)" />
        <ellipse cx="50" cy="32.5" rx="8" ry="10.5" fill="url(#lcCupFront)" />
        <ellipse cx="50" cy="32.5" rx="5" ry="6.8" fill="url(#lcPad)" />

        {/* sound wave rings */}
        <path d="M61,24 Q68,32.5 61,41" stroke="#A3E635" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M64,19 Q74,32.5 64,46" stroke="#A3E635" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
        <path d="M67,14 Q80,32.5 67,51" stroke="#A3E635" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.22" />

        {/* highlight */}
        <ellipse cx="47" cy="28" rx="3" ry="4.5" fill="#FFFFFF" opacity="0.3" />
      </g>

      {/* sparkles */}
      <circle cx="10" cy="14" r="1.2" fill="#FFFFFF" opacity="0.5" />
      <circle cx="22" cy="6" r="1" fill="#FFFFFF" opacity="0.45" />
      <circle cx="6" cy="46" r="0.9" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
};
