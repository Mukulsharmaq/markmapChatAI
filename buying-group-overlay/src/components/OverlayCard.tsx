/**
 * OverlayCard — the dark translucent card primitive used everywhere.
 * Springs up + fades in based on a per-card `appearAt` frame.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, RADIUS, SHADOW, SPRING_CONFIG } from "../theme";

export const OverlayCard: React.FC<{
  appearAt?: number;
  width?: number | string;
  padding?: number;
  accent?: string;
  accentBorder?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  appearAt = 0,
  width,
  padding = 24,
  accent,
  accentBorder = false,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - appearAt,
    fps,
    config: SPRING_CONFIG,
  });

  const translateY = interpolate(enter, [0, 1], [28, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        padding,
        borderRadius: RADIUS.md,
        background: COLORS.cardBg,
        border: `1px solid ${
          accentBorder && accent ? accent : COLORS.cardBorder
        }`,
        boxShadow: SHADOW.card,
        backdropFilter: "blur(6px)",
        transform: `translateY(${translateY}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
