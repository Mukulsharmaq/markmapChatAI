/**
 * BlueprintPanel — the opaque navy surface every overlay sits on.
 *
 * Brand signatures in play:
 *  1. Blueprint grid — faint engineered grid on every navy surface.
 *  2. Navy dissolve gradient (exact stops from the brand PDF).
 *
 * Deliberately 100% opaque: the podcast footage must never read through the
 * panel, so there is no translucency and no backdrop blur — separation from
 * the video comes from the deep shadow, the hairline border, and the flat
 * navy field.
 */
import React from "react";
import { COLORS, NAVY_DISSOLVE, RADIUS, SHADOW } from "../theme";

const GRID_CELL = 44;

export const blueprintGridBackground = (cell = GRID_CELL): string =>
  [
    `repeating-linear-gradient(0deg, ${COLORS.gridLine} 0px, ${COLORS.gridLine} 1px, transparent 1px, transparent ${cell}px)`,
    `repeating-linear-gradient(90deg, ${COLORS.gridLine} 0px, ${COLORS.gridLine} 1px, transparent 1px, transparent ${cell}px)`,
  ].join(", ");

export const BlueprintPanel: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ style, children }) => {
  return (
    <div
      style={{
        position: "relative",
        background: NAVY_DISSOLVE,
        borderRadius: RADIUS.overlayCard,
        border: `1.5px solid ${COLORS.cardBorder}`,
        boxShadow: SHADOW.panel,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Blueprint grid layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: blueprintGridBackground(),
          pointerEvents: "none",
        }}
      />
      {/* Soft corner bloom so the field never reads flat (brand: "backgrounds
          are layered, never flat") — solid-on-solid, no transparency to the
          video behind. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(90% 80% at 100% 115%, rgba(231,181,59,0.10), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", height: "100%" }}>{children}</div>
    </div>
  );
};
