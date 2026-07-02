/**
 * Grain — animated film-grain / paper-noise overlay via SVG feTurbulence.
 * Gives the printed "editorial" feel Vox-style pieces have. Very subtle.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const Grain: React.FC<{ opacity?: number; speed?: number }> = ({
  opacity = 0.14,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  // Jitter the seed so grain shimmers like real film.
  const seed = (Math.floor(frame * speed) % 12) + 1;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
