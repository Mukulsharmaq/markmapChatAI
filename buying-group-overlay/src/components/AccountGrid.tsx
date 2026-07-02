/**
 * AccountGrid — a subtle NxN grid of rounded squares representing target
 * accounts. A few "selected" squares pulse in the accent color.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export const AccountGrid: React.FC<{
  cols?: number;
  rows?: number;
  cell?: number;
  gap?: number;
  appearAt?: number;
  /** indices (0-based, row-major) that pulse in the accent color */
  selected?: number[];
  accent?: string;
}> = ({
  cols = 10,
  rows = 10,
  cell = 22,
  gap = 8,
  appearAt = 0,
  selected = [12, 34, 57, 78],
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = cols * rows;
  const selectedSet = new Set(selected);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isSel = selectedSet.has(i);

        // Staggered fade for the whole grid.
        const appear = spring({
          frame: frame - appearAt - (i % cols) * 0.6 - Math.floor(i / cols) * 0.6,
          fps,
          config: { damping: 20, stiffness: 120, mass: 0.6 },
        });
        const baseOpacity = interpolate(appear, [0, 1], [0, isSel ? 1 : 0.28]);

        // Selected squares pulse.
        const pulsePhase = (frame - appearAt) / (fps * 1.4);
        const pulse = isSel
          ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(pulsePhase * Math.PI * 2 + i))
          : 1;

        return (
          <div
            key={i}
            style={{
              width: cell,
              height: cell,
              borderRadius: 5,
              background: isSel ? accent : "rgba(255,255,255,0.16)",
              border: `1px solid ${
                isSel ? accent : "rgba(255,255,255,0.10)"
              }`,
              boxShadow: isSel ? `0 0 14px ${accent}` : "none",
              opacity: isSel ? baseOpacity * pulse : baseOpacity,
            }}
          />
        );
      })}
    </div>
  );
};
