/**
 * Scene05_Committee — THE PAYOFF. Center "Buying Committee" node with four
 * surrounding member nodes sliding into place, connectors drawing, and a badge
 * "3-4 members identified". Centered but compact; sits slightly right so a
 * left-seated speaker stays visible. Move with the x prop as needed.
 * Audio moment: "...now we know three, four buying committee members".
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "../types";
import { OverlayRoot, fs } from "../components/OverlayRoot";
import { Node } from "../components/Node";
import { Connector } from "../components/Connector";
import { PreviewBackground } from "../components/PreviewBackground";
import { COLORS, RADIUS, SPRING_CONFIG } from "../theme";

export const scene05Schema = commonOverlaySchema.extend({
  centerLabel: z.string(),
  members: z.array(z.string()),
  badge: z.string(),
});

export const scene05Defaults: z.infer<typeof scene05Schema> = {
  ...DEFAULT_COMMON,
  centerLabel: "Buying Committee",
  members: ["CDTO", "CFO", "Champion", "Power User"],
  badge: "3–4 members identified",
};

const BOX = 900;
const CENTER = { x: BOX / 2, y: BOX / 2 };
// Elliptical orbit: wider horizontally so the left/right member nodes clear the
// wide "Buying Committee" center node; shorter vertically to stay compact.
const ORBIT_X = 400;
const ORBIT_Y = 250;

export const Scene05_Committee: React.FC<z.infer<typeof scene05Schema>> = (props) => {
  const { centerLabel, members, badge, accent, fontScale, delayInFrames, showReferenceFrame } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delayInFrames;

  // Positions: top, right, bottom, left (works for exactly 4; falls back to
  // even distribution for any count).
  const positions = members.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / members.length;
    return {
      x: CENTER.x + Math.cos(angle) * ORBIT_X,
      y: CENTER.y + Math.sin(angle) * ORBIT_Y,
    };
  });

  const badgeIn = spring({ frame: f - fps * 2.6, fps, config: SPRING_CONFIG });

  return (
    <>
      <PreviewBackground show={showReferenceFrame} />
      <OverlayRoot {...props}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", width: BOX, height: BOX }}>
            {/* Connectors */}
            <svg
              width={BOX}
              height={BOX}
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              {positions.map((p, i) => (
                <Connector
                  key={i}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={p.x}
                  y2={p.y}
                  appearAt={delayInFrames + Math.round(fps * (0.8 + i * 0.18))}
                  durationInFrames={Math.round(fps * 0.35)}
                  color={COLORS.line}
                />
              ))}
            </svg>

            {/* Member nodes slide in from center outward */}
            {members.map((m, i) => {
              const appearAt = delayInFrames + Math.round(fps * (0.9 + i * 0.22));
              const enter = spring({ frame: frame - appearAt, fps, config: SPRING_CONFIG });
              const p = positions[i];
              const ix = interpolate(enter, [0, 1], [CENTER.x, p.x]);
              const iy = interpolate(enter, [0, 1], [CENTER.y, p.y]);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: ix,
                    top: iy,
                    transform: "translate(-50%, -50%)",
                    opacity: interpolate(enter, [0, 0.4], [0, 1]),
                  }}
                >
                  <Node
                    label={m}
                    appearAt={appearAt}
                    highlight
                    accent={accent}
                    fontSize={Math.round(30 * fontScale)}
                  />
                </div>
              );
            })}

            {/* Center node (drawn last, on top) */}
            <div
              style={{
                position: "absolute",
                left: CENTER.x,
                top: CENTER.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Node
                label={centerLabel}
                appearAt={delayInFrames + Math.round(fps * 0.1)}
                accent={accent}
                fontSize={Math.round(38 * fontScale)}
                paddingX={34}
                paddingY={22}
                style={{ background: COLORS.cardBgSolid, borderColor: accent }}
              />
            </div>

            {/* Badge */}
            <div
              style={{
                position: "absolute",
                left: CENTER.x,
                top: BOX + 6,
                transform: `translate(-50%, 0) translateY(${interpolate(badgeIn, [0, 1], [16, 0])}px)`,
                opacity: interpolate(badgeIn, [0, 1], [0, 1]),
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: RADIUS.pill,
                background: `${accent}22`,
                border: `1.5px solid ${accent}`,
                color: COLORS.textPrimary,
                fontSize: fs(26, fontScale),
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 5, background: accent }} />
              {badge}
            </div>
          </div>
        </AbsoluteFill>
      </OverlayRoot>
    </>
  );
};
