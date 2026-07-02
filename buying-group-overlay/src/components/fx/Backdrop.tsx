/**
 * Backdrop — the shared, locked editorial background for hero (full-screen)
 * scenes. Deep radial gradient + concentric rings + a large halftone glow +
 * vignette, with a slow "camera" drift so it never feels static. This is the
 * Vox "one continuous shot" trick: same background, things move on top.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Backdrop: React.FC<{
  accent?: string;
  base?: string;
  drift?: boolean;
}> = ({ accent = "#F5C518", base = "#0b0f16", drift = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Very slow scale + pan for a living background.
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = drift ? 1.04 + p * 0.05 : 1;
  const tx = drift ? interpolate(p, [0, 1], [-14, 14]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale}) translateX(${tx}px)` }}
      >
        {/* Radial glow from center */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 46%, ${accent}22 0%, ${accent}0d 22%, transparent 55%)`,
          }}
        />
        {/* Deep vignette */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Concentric rings + halftone dots (SVG) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <radialGradient id="ringFade" cx="50%" cy="46%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.10" />
              <stop offset="70%" stopColor="white" stopOpacity="0.03" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="white" fillOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="1920" height="1080" fill="url(#dots)" />
          {[220, 380, 540, 700, 860].map((r) => (
            <circle
              key={r}
              cx="960"
              cy="500"
              r={r}
              fill="none"
              stroke="url(#ringFade)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
