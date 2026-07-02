/**
 * OverlayRoot — wraps every scene. Applies the common x/y/scale/opacity/font
 * controls once so individual scenes only worry about their own layout.
 *
 * IMPORTANT: no background color is ever set here. The composition stays
 * transparent for alpha export.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY } from "../fonts";
import type { CommonOverlayProps } from "../types";

export const OverlayRoot: React.FC<
  CommonOverlayProps & { children: React.ReactNode }
> = ({ x, y, scale, opacity, fontScale, children }) => {
  return (
    <AbsoluteFill
      style={{
        // No backgroundColor -> transparent.
        fontFamily: FONT_FAMILY,
        opacity,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          // Font scale is applied via CSS custom property that scenes read.
          ["--font-scale" as string]: String(fontScale),
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Helper: multiply a base font size by the live fontScale prop. */
export const fs = (base: number, fontScale: number) =>
  Math.round(base * fontScale);
