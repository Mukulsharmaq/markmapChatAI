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
        {/* Pure-white lacquer top */}
        <linearGradient id="topFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f4f6f8" />
          <stop offset="100%" stopColor="#dfe3e8" />
        </linearGradient>
        {/* Front edge (thickness) */}
        <linearGradient id="edgeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfd3d9" />
          <stop offset="100%" stopColor="#a9aeb6" />
        </linearGradient>
        {/* Center sheen */}
        <radialGradient id="sheen" cx="50%" cy="18%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Ambient occlusion along the back edge (where people sit) */}
        <linearGradient id="ao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(60,66,76,0.26)" />
          <stop offset="100%" stopColor="rgba(60,66,76,0)" />
        </linearGradient>
        <clipPath id="topClip">
          <path d="M430 636 L1490 636 Q1512 636 1520 650 L1650 792 Q1656 802 1642 802 L278 802 Q264 802 270 792 L400 650 Q408 636 430 636 Z" />
        </clipPath>
      </defs>

      {/* Contact shadow on the floor */}
      <ellipse cx="960" cy="840" rx="840" ry="80" fill="rgba(0,0,0,0.55)" />
      <ellipse cx="960" cy="838" rx="660" ry="54" fill="rgba(0,0,0,0.35)" />

      {/* Front edge / thickness with a bevel highlight */}
      <path d="M270 790 L1650 790 L1650 828 Q1650 834 1642 834 L278 834 Q270 834 270 828 Z" fill="url(#edgeFill)" />
      <path d="M270 790 L1650 790 L1650 796 L270 796 Z" fill="#ffffff" opacity="0.75" />

      {/* Table top */}
      <path
        d="M430 636 L1490 636 Q1512 636 1520 650 L1650 792 Q1656 802 1642 802 L278 802 Q264 802 270 792 L400 650 Q408 636 430 636 Z"
        fill="url(#topFill)"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Surface detail: faint grain lines + AO + sheen, clipped to the top */}
      <g clipPath="url(#topClip)">
        {/* subtle length-wise grain */}
        {Array.from({ length: 11 }).map((_, i) => (
          <path
            key={i}
            d={`M ${300 + i * 4} 650 L ${340 + i * 4} 800`}
            stroke="rgba(120,125,135,0.045)"
            strokeWidth="20"
          />
        ))}
        <rect x="250" y="636" width="1420" height="62" fill="url(#ao)" />
        <rect x="250" y="636" width="1420" height="190" fill="url(#sheen)" />
        {/* thin reflection streak */}
        <path d="M560 660 L1360 660 L1300 700 L520 700 Z" fill="#ffffff" opacity="0.12" />
      </g>

      {/* accent inlay line near the front edge */}
      <path d="M400 778 L1520 778" stroke={accent} strokeOpacity="0.30" strokeWidth="2" />
    </svg>
  );
};
