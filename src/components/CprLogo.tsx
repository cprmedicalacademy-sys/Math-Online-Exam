import React from 'react';

interface CprLogoProps {
  className?: string;
  size?: number;
}

export const CprLogo: React.FC<CprLogoProps> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      aria-label="CPR Medical Academy - Centre for Post-gRaduation"
    >
      <defs>
        {/* Soft shadow for depth */}
        <filter id="cpr-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.08" />
        </filter>
        <linearGradient id="bell-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e5cb3" />
          <stop offset="60%" stopColor="#124ca1" />
          <stop offset="100%" stopColor="#0b316a" />
        </linearGradient>
      </defs>

      {/* Main Circular Badge Background */}
      <circle cx="250" cy="250" r="242" fill="#ffffff" stroke="#124ca1" strokeWidth="15" />

      {/* Stethoscope On Left */}
      <g strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Binaural headset tubes (Navy) */}
        <path
          d="M 92 148 C 88 185 102 235 125 242 C 148 235 162 185 158 148"
          stroke="#124ca1"
        />
        {/* Metal spring arch */}
        <path
          d="M 94 185 C 112 195 138 195 156 185"
          stroke="#124ca1"
          strokeWidth="3.5"
        />
        {/* Ear tips */}
        <ellipse cx="91" cy="144" rx="7" ry="4" fill="#124ca1" stroke="#124ca1" transform="rotate(-20 91 144)" />
        <ellipse cx="159" cy="144" rx="7" ry="4" fill="#124ca1" stroke="#124ca1" transform="rotate(20 159 144)" />

        {/* Stem joint (Navy) */}
        <path d="M 125 242 L 125 258" stroke="#124ca1" strokeWidth="5.5" />
        <circle cx="125" cy="258" r="4.5" fill="#124ca1" />

        {/* Red flexible tube descending into ECG */}
        <path
          d="M 125 262 C 124 290 128 322 155 322 L 240 322"
          stroke="#dc2626"
          strokeWidth="5"
        />

        {/* Heartbeat ECG / Pulse Line (Red) */}
        <path
          d="M 240 322 L 252 300 L 262 344 L 274 285 L 285 352 L 296 314 L 305 322 L 380 322"
          stroke="#dc2626"
          strokeWidth="5"
        />
      </g>

      {/* Stethoscope Chest Piece (Bell) */}
      <circle cx="395" cy="322" r="18" fill="url(#bell-reflection)" />
      <circle cx="395" cy="322" r="15" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="395" cy="322" r="18" fill="none" stroke="#124ca1" strokeWidth="3" />

      {/* Typography: CPR */}
      <g>
        {/* 'C' in Royal Blue */}
        <text
          x="195"
          y="235"
          fill="#124ca1"
          fontSize="130"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, 'Arial Rounded MT Bold', Impact, sans-serif"
          letterSpacing="-4"
        >
          C
        </text>

        {/* 'P' in Crimson Red */}
        <text
          x="280"
          y="235"
          fill="#dc2626"
          fontSize="130"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, 'Arial Rounded MT Bold', Impact, sans-serif"
          letterSpacing="-4"
        >
          P
        </text>

        {/* 'R' in Royal Blue */}
        <text
          x="365"
          y="235"
          fill="#124ca1"
          fontSize="130"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, 'Arial Rounded MT Bold', Impact, sans-serif"
          letterSpacing="-4"
        >
          R
        </text>
      </g>

      {/* Script: Medical Academy */}
      <text
        x="315"
        y="280"
        textAnchor="middle"
        fill="#111827"
        fontSize="44"
        fontWeight="bold"
        fontStyle="italic"
        fontFamily="'Brush Script MT', 'Dancing Script', 'Pacifico', cursive, sans-serif"
      >
        Medical Academy
      </text>

      {/* Bottom Subtitle: Centre for Post-gRaduation (CPR) */}
      <g
        fontSize="21"
        fontWeight="bold"
        fontFamily="'Times New Roman', Times, 'Georgia', serif"
        textAnchor="middle"
      >
        <text x="250" y="380">
          <tspan fill="#124ca1">Centre for </tspan>
          <tspan fill="#dc2626">Post-gRaduation </tspan>
          <tspan fill="#124ca1">(CPR)</tspan>
        </text>
      </g>
    </svg>
  );
};
