import React from 'react';

interface IconProps {
  className?: string;
}

export const SentenceTypesPunctuationIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Sentence Types and Punctuation">
      <defs>
        <linearGradient id="stpIndigoTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C7D2FE" />
          <stop offset="100%" stopColor="#A5B4FC" />
        </linearGradient>
        <linearGradient id="stpIndigoFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="stpIndigoSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="stpMagentaTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5D0FE" />
          <stop offset="100%" stopColor="#F0ABFC" />
        </linearGradient>
        <linearGradient id="stpMagentaFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E879F9" />
          <stop offset="100%" stopColor="#A21CAF" />
        </linearGradient>
        <linearGradient id="stpMagentaSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A21CAF" />
          <stop offset="100%" stopColor="#701A75" />
        </linearGradient>
        <linearGradient id="stpAmberTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="stpAmberFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="stpAmberSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <filter id="stpShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      <ellipse cx="32" cy="57" rx="22" ry="3.5" fill="#000" opacity="0.13" />

      <g filter="url(#stpShadow)">
        {/* Block A - period, indigo */}
        <polygon points="8,36 18,30 28,36 18,42" fill="url(#stpIndigoTop)" />
        <polygon points="8,36 18,42 18,52 8,46" fill="url(#stpIndigoFront)" />
        <polygon points="18,42 28,36 28,46 18,52" fill="url(#stpIndigoSide)" />
        <circle cx="18" cy="36" r="2.1" fill="#312E81" />

        {/* Block C - exclamation, amber */}
        <polygon points="40,24 50,18 60,24 50,30" fill="url(#stpAmberTop)" />
        <polygon points="40,24 50,30 50,42 40,36" fill="url(#stpAmberFront)" />
        <polygon points="50,30 60,24 60,36 50,42" fill="url(#stpAmberSide)" />
        <rect x="49" y="20" width="2" height="5.5" rx="1" fill="#78350F" />
        <circle cx="50" cy="27.5" r="1" fill="#78350F" />

        {/* Block B - question mark, magenta (floats highest) */}
        <polygon points="22,12 34,5 46,12 34,19" fill="url(#stpMagentaTop)" />
        <polygon points="22,12 34,19 34,31 22,24" fill="url(#stpMagentaFront)" />
        <polygon points="34,19 46,12 46,24 34,31" fill="url(#stpMagentaSide)" />
        <path d="M31,9.5 Q31,7 34,7 Q37,7 37,9.5 Q37,11.5 34,12.5" stroke="#701A75" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="34" cy="15.5" r="1" fill="#701A75" />

        {/* highlights */}
        <polygon points="22,12 34,5 34,7 24,12.5" fill="#FFFFFF" opacity="0.25" />
        <polygon points="8,36 18,30 18,32 10,36.7" fill="#FFFFFF" opacity="0.2" />
        <polygon points="40,24 50,18 50,20 42,24.6" fill="#FFFFFF" opacity="0.2" />
      </g>

      {/* sparkles */}
      <circle cx="6" cy="18" r="1.2" fill="#FFFFFF" opacity="0.5" />
      <circle cx="58" cy="14" r="1" fill="#FFFFFF" opacity="0.45" />
      <circle cx="60" cy="44" r="0.9" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
};
