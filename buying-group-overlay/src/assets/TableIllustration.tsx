/**
 * TableIllustration — a premium boardroom conference table authored purely in
 * SVG (vector). Rendered once to a transparent PNG (public/assets/table.png)
 * via the "Asset-Table" composition, then used as a base image layer that the
 * Remotion scene animates people on top of.
 *
 * Transparent background so it can occlude only the figures' lower bodies.
 */
import React from "react";

export const TableIllustration: React.FC<{ accent?: string }> = ({ accent = "#F5C518" }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
      <defs>
        {/* Light marble/lacquer top */}
        <linearGradient id="topFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfcf8" />
          <stop offset="55%" stopColor="#f1ece0" />
          <stop offset="100%" stopColor="#ded6c5" />
        </linearGradient>
        {/* Front edge (thickness) */}
        <linearGradient id="edgeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9bea8" />
          <stop offset="100%" stopColor="#a89d84" />
        </linearGradient>
        {/* Center sheen */}
        <radialGradient id="sheen" cx="50%" cy="18%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Ambient occlusion along the back edge (where people sit) */}
        <linearGradient id="ao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(70,60,40,0.28)" />
          <stop offset="100%" stopColor="rgba(70,60,40,0)" />
        </linearGradient>
        <clipPath id="topClip">
          <path d="M520 636 L1400 636 Q1420 636 1428 650 L1560 792 Q1566 802 1552 802 L368 802 Q354 802 360 792 L492 650 Q500 636 520 636 Z" />
        </clipPath>
      </defs>

      {/* Contact shadow on the floor */}
      <ellipse cx="960" cy="838" rx="760" ry="76" fill="rgba(0,0,0,0.55)" />
      <ellipse cx="960" cy="836" rx="600" ry="52" fill="rgba(0,0,0,0.35)" />

      {/* Front edge / thickness with a bevel highlight */}
      <path d="M360 790 L1560 790 L1560 828 Q1560 834 1552 834 L368 834 Q360 834 360 828 Z" fill="url(#edgeFill)" />
      <path d="M360 790 L1560 790 L1560 796 L360 796 Z" fill="#fffdf7" opacity="0.7" />

      {/* Table top */}
      <path
        d="M520 636 L1400 636 Q1420 636 1428 650 L1560 792 Q1566 802 1552 802 L368 802 Q354 802 360 792 L492 650 Q500 636 520 636 Z"
        fill="url(#topFill)"
        stroke="#fffef9"
        strokeWidth="1.5"
      />

      {/* Surface detail: faint grain lines + AO + sheen, clipped to the top */}
      <g clipPath="url(#topClip)">
        {/* subtle length-wise grain */}
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M ${380 + i * 4} 650 L ${420 + i * 4} 800`}
            stroke="rgba(120,105,75,0.05)"
            strokeWidth="18"
          />
        ))}
        <rect x="340" y="636" width="1240" height="60" fill="url(#ao)" />
        <rect x="340" y="636" width="1240" height="180" fill="url(#sheen)" />
        {/* thin reflection streak */}
        <path d="M600 660 L1360 660 L1300 700 L560 700 Z" fill="#ffffff" opacity="0.10" />
      </g>

      {/* accent inlay line near the front edge */}
      <path d="M470 778 L1450 778" stroke={accent} strokeOpacity="0.30" strokeWidth="2" />
    </svg>
  );
};
