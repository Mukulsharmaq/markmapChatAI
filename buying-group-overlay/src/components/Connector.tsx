/**
 * Connector — a thin white line between two points that "draws" in over time.
 * Coordinates are in the SVG/overlay space of the parent scene.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  appearAt?: number;
  durationInFrames?: number;
  color?: string;
  width?: number;
}> = ({
  x1,
  y1,
  x2,
  y2,
  appearAt = 0,
  durationInFrames = 12,
  color = COLORS.line,
  width = 2,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [appearAt, appearAt + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const length = Math.hypot(x2 - x1, y2 - y1);

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - progress)}
    />
  );
};
