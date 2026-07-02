/**
 * Person — a stylized editorial "cutout" figure authored entirely in SVG:
 * a duotone silhouette with a halftone dot texture and the signature offset
 * accent stroke behind it (the Vox "printed cutout" look). Role changes the
 * small accessory so CFO/CDTO/Champion/Power User read differently.
 */
import React from "react";

type Role = "cfo" | "cdto" | "champion" | "poweruser" | "generic";

export const Person: React.FC<{
  role?: Role;
  size?: number;
  accent?: string;
  offset?: number;
}> = ({ role = "generic", size = 120, accent = "#F5C518", offset = 7 }) => {
  const uid = React.useId().replace(/:/g, "");

  // Head + shoulders silhouette.
  const Silhouette = ({ fill }: { fill: string }) => (
    <g fill={fill}>
      <circle cx="60" cy="40" r="21" />
      <path d="M18 120 Q18 76 60 76 Q102 76 102 120 Z" />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 120 124" fill="none">
      <defs>
        <clipPath id={`sil-${uid}`}>
          <circle cx="60" cy="40" r="21" />
          <path d="M18 120 Q18 76 60 76 Q102 76 102 120 Z" />
        </clipPath>
        <pattern id={`ht-${uid}`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.4" fill="rgba(90,70,10,0.35)" />
        </pattern>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf9f3" />
          <stop offset="100%" stopColor="#e6e0d2" />
        </linearGradient>
      </defs>

      {/* Offset accent stroke behind (the signature 3D-ish print offset) */}
      <g transform={`translate(${offset}, ${offset})`}>
        <Silhouette fill={accent} />
      </g>

      {/* Main duotone body */}
      <Silhouette fill={`url(#fill-${uid})`} />

      {/* Halftone shading clipped to the silhouette */}
      <g clipPath={`url(#sil-${uid})`}>
        <rect x="0" y="0" width="120" height="124" fill={`url(#ht-${uid})`} opacity="0.32" />
        {/* soft directional shadow */}
        <rect x="72" y="0" width="48" height="124" fill="rgba(60,45,10,0.12)" />
      </g>
      {/* crisp accent rim on the light silhouette */}
      <g fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="1.5">
        <circle cx="60" cy="40" r="21" />
        <path d="M18 120 Q18 76 60 76 Q102 76 102 120" />
      </g>

      {/* Role accessory */}
      {role === "cfo" && (
        <path d="M60 62 l6 10 -6 22 -6 -22 z" fill={accent} stroke="#0b0f16" strokeWidth="1" />
      )}
      {role === "cdto" && (
        <rect x="49" y="70" width="22" height="15" rx="2" fill={accent} stroke="#0b0f16" strokeWidth="1" />
      )}
      {role === "champion" && (
        <path
          d="M60 60 l3.4 6.9 7.6 1.1 -5.5 5.4 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.4 7.6 -1.1 z"
          fill={accent}
          stroke="#0b0f16"
          strokeWidth="0.8"
        />
      )}
      {role === "poweruser" && (
        <>
          <path d="M44 44 a16 16 0 0 1 32 0" fill="none" stroke={accent} strokeWidth="4" />
          <rect x="40" y="44" width="7" height="12" rx="3" fill={accent} />
          <rect x="73" y="44" width="7" height="12" rx="3" fill={accent} />
        </>
      )}
    </svg>
  );
};
