/**
 * Eyebrow — the brand's "gold signal": an eyebrow dash + label.
 * Labels per the type rules: 700 weight, uppercase, wide tracking.
 * The dash draws in first, then the label fades + rises with it.
 */
import React from "react";
import { interpolate } from "remotion";
import { BRAND_FONT, WEIGHT } from "../fonts";
import { COLORS } from "../theme";
import { easeOutQuint, rise } from "./motion";

export const Eyebrow: React.FC<{
  frame: number;
  from: number;
  label: string;
  fontSize?: number;
}> = ({ frame, from, label, fontSize = 25 }) => {
  const dashW = interpolate(frame, [from, from + 20], [0, 44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  const r = rise(frame, from + 6, 22, 14);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 44,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: dashW,
            height: 4,
            borderRadius: 2,
            background: COLORS.gold,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: BRAND_FONT,
          fontWeight: WEIGHT.bold,
          fontSize,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: COLORS.gold,
          opacity: r.opacity,
          transform: `translateY(${r.translateY}px)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};
