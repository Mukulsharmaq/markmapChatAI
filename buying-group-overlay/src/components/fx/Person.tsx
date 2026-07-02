/**
 * Person — a richer editorial "cutout" of a businessperson, authored in SVG:
 * suit shoulders with lapels + shirt + collar, a head with hair, a subtle
 * halftone print texture, the signature offset accent stroke, and a per-role
 * accessory (tie / glasses / star / headset / crown). Reads as a real person
 * on the committee, not a generic icon.
 */
import React from "react";

type Role = "cfo" | "cdto" | "champion" | "poweruser" | "buyer" | "generic";

const HAIR: Record<Role, string> = {
  cfo: "M40 40 Q40 19 60 19 Q80 19 80 40 Q74 29 60 29 Q46 29 40 40 Z",
  cdto: "M39 42 Q39 18 60 18 Q81 18 81 42 Q80 30 68 29 L67 24 Q54 22 46 30 Q41 33 39 42 Z",
  champion: "M41 39 Q41 20 60 20 Q79 20 79 39 Q71 31 60 31 Q49 31 41 39 Z",
  poweruser: "M41 40 Q41 21 60 21 Q79 21 79 40 Q72 32 60 32 Q48 32 41 40 Z",
  buyer: "M40 40 Q40 18 60 18 Q80 18 80 40 Q73 28 60 28 Q47 28 40 40 Z",
  generic: "M41 39 Q41 20 60 20 Q79 20 79 39 Q71 31 60 31 Q49 31 41 39 Z",
};

export const Person: React.FC<{
  role?: Role;
  size?: number;
  accent?: string;
  offset?: number;
}> = ({ role = "generic", size = 120, accent = "#F5C518", offset = 7 }) => {
  const uid = React.useId().replace(/:/g, "");

  const shoulders = "M14 128 Q14 82 60 82 Q106 82 106 128 Z";
  const headCx = 60;
  const headCy = 42;
  const headR = 21;

  return (
    <svg width={size} height={(size * 132) / 120} viewBox="0 0 120 132" fill="none">
      <defs>
        <clipPath id={`sh-${uid}`}>
          <path d={shoulders} />
        </clipPath>
        <pattern id={`ht-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.2" fill="rgba(255,255,255,0.10)" />
        </pattern>
        <linearGradient id={`suit-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4658" />
          <stop offset="100%" stopColor="#222a37" />
        </linearGradient>
        <linearGradient id={`skin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbeedd" />
          <stop offset="100%" stopColor="#f0dcc4" />
        </linearGradient>
      </defs>

      {/* Offset accent stroke behind (signature print offset) */}
      <g transform={`translate(${offset}, ${offset})`}>
        <circle cx={headCx} cy={headCy} r={headR} fill={accent} />
        <path d={shoulders} fill={accent} />
      </g>

      {/* Neck */}
      <rect x="53" y="58" width="14" height="26" rx="4" fill={`url(#skin-${uid})`} />
      <rect x="53" y="58" width="14" height="10" fill="rgba(0,0,0,0.12)" />

      {/* Suit shoulders */}
      <path d={shoulders} fill={`url(#suit-${uid})`} />
      <g clipPath={`url(#sh-${uid})`}>
        <rect x="0" y="70" width="120" height="62" fill={`url(#ht-${uid})`} />
        {/* Shirt V */}
        <path d="M60 82 L78 132 L42 132 Z" fill="#eef1f5" />
        {/* Lapels */}
        <path d="M60 84 L46 132 L40 108 L54 84 Z" fill="#20262f" />
        <path d="M60 84 L74 132 L80 108 L66 84 Z" fill="#20262f" />
        {/* Collar */}
        <path d="M60 84 L52 96 L58 92 Z" fill="#d7dbe1" />
        <path d="M60 84 L68 96 L62 92 Z" fill="#d7dbe1" />
        {/* soft side shadow */}
        <rect x="74" y="70" width="46" height="62" fill="rgba(0,0,0,0.16)" />
      </g>

      {/* Head + hair */}
      <circle cx={headCx} cy={headCy} r={headR} fill={`url(#skin-${uid})`} />
      <path d={HAIR[role]} fill="#20262f" />

      {/* Role accessory */}
      {role === "cfo" && (
        // tie
        <path d="M60 92 l5 6 -5 26 -5 -26 z" fill={accent} stroke="#0b0f16" strokeWidth="0.8" />
      )}
      {role === "cdto" && (
        // glasses
        <g stroke="#20262f" strokeWidth="2" fill="none">
          <circle cx="52" cy="43" r="6.5" />
          <circle cx="68" cy="43" r="6.5" />
          <line x1="58.5" y1="43" x2="61.5" y2="43" />
        </g>
      )}
      {role === "champion" && (
        // star badge on chest
        <path
          d="M60 96 l3 6.1 6.7 1 -4.9 4.7 1.2 6.7 -6 -3.2 -6 3.2 1.2 -6.7 -4.9 -4.7 6.7 -1 z"
          fill={accent}
          stroke="#0b0f16"
          strokeWidth="0.7"
        />
      )}
      {role === "poweruser" && (
        // headset
        <g>
          <path d="M42 42 a18 18 0 0 1 36 0" fill="none" stroke={accent} strokeWidth="3.5" />
          <rect x="38" y="42" width="7" height="13" rx="3" fill={accent} />
          <rect x="75" y="42" width="7" height="13" rx="3" fill={accent} />
          <path d="M45 52 q6 8 15 6" fill="none" stroke={accent} strokeWidth="2.5" />
        </g>
      )}
      {role === "buyer" && (
        // crown (the ultimate approver / budget holder)
        <path
          d="M46 14 L51 22 L60 12 L69 22 L74 14 L72 26 L48 26 Z"
          fill={accent}
          stroke="#0b0f16"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      )}

      {/* crisp accent rim on the outer silhouette */}
      <g fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1.4">
        <circle cx={headCx} cy={headCy} r={headR} />
        <path d={shoulders} />
      </g>
    </svg>
  );
};
