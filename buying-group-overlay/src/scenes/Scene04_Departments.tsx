/**
 * Scene04_Departments — three department cards with a use case each, sliding in
 * one by one, plus a connecting label. Bottom band placement (lower third),
 * spanning width but kept low so faces stay clear.
 * Audio moment: "...the use cases we solve for their department".
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "../types";
import { OverlayRoot, fs } from "../components/OverlayRoot";
import { PreviewBackground } from "../components/PreviewBackground";
import { COLORS, RADIUS, SAFE, SPRING_CONFIG } from "../theme";

export const scene04Schema = commonOverlaySchema.extend({
  departments: z.array(z.object({ name: z.string(), useCase: z.string() })),
  label: z.string(),
});

export const scene04Defaults: z.infer<typeof scene04Schema> = {
  ...DEFAULT_COMMON,
  departments: [
    { name: "Digital Transformation", useCase: "Workflow automation" },
    { name: "Finance", useCase: "Approval process" },
    { name: "Operations", useCase: "Internal request flow" },
  ],
  label: "Use case → department interest",
};

export const Scene04_Departments: React.FC<z.infer<typeof scene04Schema>> = (props) => {
  const { departments, label, accent, fontScale, delayInFrames, showReferenceFrame } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delayInFrames;

  const labelIn = spring({ frame: f - fps * 0.1, fps, config: SPRING_CONFIG });

  return (
    <>
      <PreviewBackground show={showReferenceFrame} />
      <OverlayRoot {...props}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: `0 0 ${SAFE.bottomMargin + 30}px 0`,
          }}
        >
          {/* Connecting label on top of the row */}
          <div
            style={{
              opacity: interpolate(labelIn, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(labelIn, [0, 1], [14, 0])}px)`,
              color: COLORS.textSecondary,
              fontSize: fs(26, fontScale),
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            {label}
          </div>

          <div style={{ display: "flex", gap: 22 }}>
            {departments.map((d, i) => {
              const appearAt = delayInFrames + Math.round(fps * (0.3 + i * 0.4));
              const enter = spring({ frame: frame - appearAt, fps, config: SPRING_CONFIG });
              const y = interpolate(enter, [0, 1], [40, 0]);
              const opacity = interpolate(enter, [0, 1], [0, 1]);
              const useCaseIn = spring({
                frame: frame - appearAt - Math.round(fps * 0.35),
                fps,
                config: SPRING_CONFIG,
              });
              return (
                <div
                  key={i}
                  style={{
                    transform: `translateY(${y}px)`,
                    opacity,
                    width: 420,
                    padding: "24px 26px",
                    borderRadius: RADIUS.md,
                    background: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <div
                    style={{
                      color: COLORS.textMuted,
                      fontSize: fs(18, fontScale),
                      fontWeight: 600,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                    }}
                  >
                    Department
                  </div>
                  <div
                    style={{
                      color: COLORS.textPrimary,
                      fontSize: fs(30, fontScale),
                      fontWeight: 700,
                      marginTop: 6,
                      marginBottom: 16,
                    }}
                  >
                    {d.name}
                  </div>
                  <div
                    style={{
                      opacity: interpolate(useCaseIn, [0, 1], [0, 1]),
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: RADIUS.sm,
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${accent}55`,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: accent }} />
                    <span
                      style={{
                        color: COLORS.textPrimary,
                        fontSize: fs(23, fontScale),
                        fontWeight: 500,
                      }}
                    >
                      {d.useCase}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </OverlayRoot>
    </>
  );
};
