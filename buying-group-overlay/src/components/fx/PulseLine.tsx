/**
 * PulseLine — a connector that draws on, then sends a glowing pulse dot
 * traveling from the center outward along it. Adds life to diagrams.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const PulseLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  appearAt?: number;
  drawFrames?: number;
  color?: string;
  accent?: string;
}> = ({ x1, y1, x2, y2, appearAt = 0, drawFrames = 12, color = "rgba(255,255,255,0.35)", accent = "#F5C518" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.hypot(x2 - x1, y2 - y1);

  const draw = interpolate(frame, [appearAt, appearAt + drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse travels repeatedly after the line is drawn.
  const cycle = fps * 2.2;
  const t = ((frame - appearAt - drawFrames) % cycle) / cycle;
  const pt = Math.max(0, Math.min(1, t));
  const px = x1 + (x2 - x1) * pt;
  const py = y1 + (y2 - y1) * pt;
  const showPulse = frame > appearAt + drawFrames;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      {showPulse && (
        <circle cx={px} cy={py} r={4} fill={accent} opacity={0.9 * (1 - Math.abs(pt - 0.5) * 1.2)}>
        </circle>
      )}
    </g>
  );
};
