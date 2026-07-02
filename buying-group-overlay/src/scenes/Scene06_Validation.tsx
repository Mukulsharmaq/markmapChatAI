/**
 * Scene06_Validation — three validation source cards (Analysts, Local Experts,
 * SMEs), each earns a checkmark, then a "Validated" badge pops. Lower-third
 * band. Audio moment: "...go back to the analyst... local experts, SMEs...
 * validate".
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "../types";
import { OverlayRoot, fs } from "../components/OverlayRoot";
import { Checkmark } from "../components/Checkmark";
import { PreviewBackground } from "../components/PreviewBackground";
import { COLORS, RADIUS, SAFE, SPRING_CONFIG } from "../theme";

export const scene06Schema = commonOverlaySchema.extend({
  sources: z.array(z.string()),
  badge: z.string(),
});

export const scene06Defaults: z.infer<typeof scene06Schema> = {
  ...DEFAULT_COMMON,
  sources: ["Analysts", "Local Experts", "SMEs"],
  badge: "Validated",
};

export const Scene06_Validation: React.FC<z.infer<typeof scene06Schema>> = (props) => {
  const { sources, badge, accent, fontScale, delayInFrames, showReferenceFrame } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delayInFrames;

  const badgeAt = delayInFrames + Math.round(fps * (0.4 + sources.length * 0.5 + 0.4));
  const badgeIn = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 180, mass: 0.8 } });

  return (
    <>
      <PreviewBackground show={showReferenceFrame} />
      <OverlayRoot {...props}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "column",
            gap: 26,
            padding: `0 0 ${SAFE.bottomMargin + 30}px 0`,
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            {sources.map((s, i) => {
              const appearAt = delayInFrames + Math.round(fps * (0.2 + i * 0.5));
              const enter = spring({ frame: frame - appearAt, fps, config: SPRING_CONFIG });
              const y = interpolate(enter, [0, 1], [34, 0]);
              const opacity = interpolate(enter, [0, 1], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    transform: `translateY(${y}px)`,
                    opacity,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    width: 340,
                    padding: "20px 24px",
                    borderRadius: RADIUS.md,
                    background: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                    boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Checkmark
                    size={40}
                    appearAt={appearAt + Math.round(fps * 0.3)}
                    durationInFrames={Math.round(fps * 0.4)}
                  />
                  <span
                    style={{
                      color: COLORS.textPrimary,
                      fontSize: fs(28, fontScale),
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Validated badge */}
          <div
            style={{
              transform: `scale(${interpolate(badgeIn, [0, 1], [0.6, 1])})`,
              opacity: interpolate(badgeIn, [0, 1], [0, 1]),
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 34px",
              borderRadius: RADIUS.pill,
              background: `${COLORS.success}1f`,
              border: `2px solid ${COLORS.success}`,
              boxShadow: `0 0 30px ${COLORS.success}55`,
            }}
          >
            <Checkmark size={38} appearAt={badgeAt} durationInFrames={Math.round(fps * 0.3)} color={COLORS.success} />
            <span
              style={{
                color: COLORS.textPrimary,
                fontSize: fs(40, fontScale),
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              {badge}
            </span>
          </div>
        </AbsoluteFill>
      </OverlayRoot>
    </>
  );
};
