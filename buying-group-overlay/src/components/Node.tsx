/**
 * Node — a pill/box node for org-map and committee diagrams. Springs in with an
 * optional accent highlight and soft glow.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, RADIUS, SHADOW, SPRING_CONFIG } from "../theme";

export const Node: React.FC<{
  label: string;
  sublabel?: string;
  appearAt?: number;
  highlight?: boolean;
  accent?: string;
  fontSize?: number;
  paddingX?: number;
  paddingY?: number;
  style?: React.CSSProperties;
}> = ({
  label,
  sublabel,
  appearAt = 0,
  highlight = false,
  accent = COLORS.accent,
  fontSize = 30,
  paddingX = 26,
  paddingY = 16,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - appearAt,
    fps,
    config: SPRING_CONFIG,
  });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: RADIUS.pill,
        background: highlight ? "rgba(245, 197, 24, 0.14)" : COLORS.cardBgSolid,
        border: `1.5px solid ${highlight ? accent : COLORS.cardBorderStrong}`,
        boxShadow: highlight
          ? `${SHADOW.soft}, 0 0 26px ${COLORS.glow}`
          : SHADOW.soft,
        transform: `scale(${scale})`,
        opacity,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        style={{
          color: highlight ? accent : COLORS.textPrimary,
          fontSize,
          fontWeight: 600,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </span>
      {sublabel ? (
        <span
          style={{
            color: COLORS.textSecondary,
            fontSize: Math.round(fontSize * 0.52),
            fontWeight: 500,
          }}
        >
          {sublabel}
        </span>
      ) : null}
    </div>
  );
};
