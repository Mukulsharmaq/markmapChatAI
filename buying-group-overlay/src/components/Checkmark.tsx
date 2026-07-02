/**
 * Checkmark — an SVG check that draws itself on. Used in the validation scene.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export const Checkmark: React.FC<{
  size?: number;
  appearAt?: number;
  durationInFrames?: number;
  color?: string;
}> = ({
  size = 40,
  appearAt = 0,
  durationInFrames = 12,
  color = COLORS.success,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [appearAt, appearAt + durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Path length for a two-segment check within a 24x24 viewBox.
  const pathLength = 30;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke={color}
        strokeWidth="1.5"
        opacity={interpolate(progress, [0, 0.3], [0, 0.5], {
          extrapolateRight: "clamp",
        })}
      />
      <path
        d="M6 12.5 L10.5 17 L18 7.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - progress)}
      />
    </svg>
  );
};
