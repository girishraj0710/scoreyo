import React from 'react';

interface IconProps {
  className?: string;
}

export const AdvancedTenseCombinationsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Advanced Tense Combinations"
    >
      <defs>
        {/* Gradients for large gear (indigo/violet) */}
        <linearGradient id="atc-gear-large" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        {/* Gradients for small gear (violet/magenta) */}
        <linearGradient id="atc-gear-small" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        {/* Gradient for tiny gear (fuchsia) */}
        <linearGradient id="atc-gear-tiny" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>

        <linearGradient id="atc-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="atc-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="atc-small-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="32" r="28" fill="#ede9fe" opacity="0.35" />

      {/* Large gear (bottom-left, main tense) */}
      <g filter="url(#atc-shadow)">
        <path
          d="M 22 6 L 25 6 L 25.8 10.5 L 29.3 11.9 L 33 9.3 L 35.1 11.4 L 32.5 15.1 L 33.9 18.6 L 38.4 19.4 L 38.4 22.4 L 33.9 23.2 L 32.5 26.7 L 35.1 30.4 L 33 32.5 L 29.3 29.9 L 25.8 31.3 L 25 35.8 L 22 35.8 L 21.2 31.3 L 17.7 29.9 L 14 32.5 L 11.9 30.4 L 14.5 26.7 L 13.1 23.2 L 8.6 22.4 L 8.6 19.4 L 13.1 18.6 L 14.5 15.1 L 11.9 11.4 L 14 9.3 L 17.7 11.9 L 21.2 10.5 Z"
          fill="url(#atc-gear-large)"
          transform="translate(2 6)"
        />
        <circle cx="25.5" cy="27" r="7" fill="#312e81" opacity="0.4" />
        <circle cx="25.5" cy="27" r="5.5" fill="#e0e7ff" />
        <path
          d="M 22 6 L 25 6 L 25.8 10.5 L 29.3 11.9 L 33 9.3 L 35.1 11.4 L 32.5 15.1 L 33.9 18.6 L 38.4 19.4 L 38.4 22.4 L 33.9 23.2 L 32.5 26.7 L 35.1 30.4 L 33 32.5 L 29.3 29.9 L 25.8 31.3 L 25 35.8 L 22 35.8 L 21.2 31.3 L 17.7 29.9 L 14 32.5 L 11.9 30.4 L 14.5 26.7 L 13.1 23.2 L 8.6 22.4 L 8.6 19.4 L 13.1 18.6 L 14.5 15.1 L 11.9 11.4 L 14 9.3 L 17.7 11.9 L 21.2 10.5 Z"
          fill="url(#atc-highlight)"
          transform="translate(2 6)"
        />
      </g>

      {/* Small gear (top-right, combined tense) interlocking */}
      <g filter="url(#atc-small-shadow)">
        <path
          d="M 41 4 L 43 4 L 43.6 7.2 L 46.1 8.2 L 48.7 6.3 L 50.1 7.7 L 48.2 10.3 L 49.2 12.8 L 52.4 13.4 L 52.4 15.4 L 49.2 16 L 48.2 18.5 L 50.1 21.1 L 48.7 22.5 L 46.1 20.6 L 43.6 21.6 L 43 24.8 L 41 24.8 L 40.4 21.6 L 37.9 20.6 L 35.3 22.5 L 33.9 21.1 L 35.8 18.5 L 34.8 16 L 31.6 15.4 L 31.6 13.4 L 34.8 12.8 L 35.8 10.3 L 33.9 7.7 L 35.3 6.3 L 37.9 8.2 L 40.4 7.2 Z"
          fill="url(#atc-gear-small)"
          transform="translate(3 14)"
        />
        <circle cx="42" cy="28.4" r="4.8" fill="#581c87" opacity="0.4" />
        <circle cx="42" cy="28.4" r="3.7" fill="#f3e8ff" />
        <path
          d="M 41 4 L 43 4 L 43.6 7.2 L 46.1 8.2 L 48.7 6.3 L 50.1 7.7 L 48.2 10.3 L 49.2 12.8 L 52.4 13.4 L 52.4 15.4 L 49.2 16 L 48.2 18.5 L 50.1 21.1 L 48.7 22.5 L 46.1 20.6 L 43.6 21.6 L 43 24.8 L 41 24.8 L 40.4 21.6 L 37.9 20.6 L 35.3 22.5 L 33.9 21.1 L 35.8 18.5 L 34.8 16 L 31.6 15.4 L 31.6 13.4 L 34.8 12.8 L 35.8 10.3 L 33.9 7.7 L 35.3 6.3 L 37.9 8.2 L 40.4 7.2 Z"
          fill="url(#atc-highlight)"
          transform="translate(3 14)"
        />
      </g>

      {/* Tiny gear (bottom-right, third combined tense) */}
      <g filter="url(#atc-small-shadow)">
        <circle cx="46" cy="47" r="9" fill="url(#atc-gear-tiny)" />
        <g opacity="0.9">
          <rect x="44.3" y="35.5" width="3.4" height="4" rx="1" fill="url(#atc-gear-tiny)" />
          <rect x="44.3" y="54.5" width="3.4" height="4" rx="1" fill="url(#atc-gear-tiny)" />
          <rect x="33.5" y="45.3" width="4" height="3.4" rx="1" fill="url(#atc-gear-tiny)" />
          <rect x="54.5" y="45.3" width="4" height="3.4" rx="1" fill="url(#atc-gear-tiny)" />
        </g>
        <circle cx="46" cy="47" r="9" fill="url(#atc-highlight)" />
        <circle cx="46" cy="47" r="3.5" fill="#86198f" opacity="0.4" />
        <circle cx="46" cy="47" r="2.6" fill="#fae8ff" />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="8" cy="50" r="1" fill="#c4b5fd" />
        <circle cx="58" cy="10" r="1.1" fill="#f0abfc" />
        <circle cx="12" cy="56" r="0.8" fill="#a5b4fc" />
      </g>
    </svg>
  );
};
