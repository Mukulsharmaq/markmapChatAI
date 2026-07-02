/**
 * Scene02_CustomerIntel — three customer account cards slide in from the left,
 * then a label reveals. Lower-left placement so speakers stay clear.
 * Audio moment: "...take the intel from the customer accounts".
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "../types";
import { OverlayRoot, fs } from "../components/OverlayRoot";
import { OverlayCard } from "../components/OverlayCard";
import { PreviewBackground } from "../components/PreviewBackground";
import { COLORS, RADIUS, SAFE, SPRING_CONFIG } from "../theme";

const cardSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()),
});

export const scene02Schema = commonOverlaySchema.extend({
  cards: z.array(cardSchema),
  label: z.string(),
});

export const scene02Defaults: z.infer<typeof scene02Schema> = {
  ...DEFAULT_COMMON,
  cards: [
    { name: "Customer Account 01", tags: ["Power user", "Active"] },
    { name: "Customer Account 02", tags: ["Champion", "Expanding"] },
    { name: "Customer Account 03", tags: ["Multi-team"] },
  ],
  label: "Intel starts with customer accounts",
};

export const Scene02_CustomerIntel: React.FC<z.infer<typeof scene02Schema>> = (props) => {
  const { cards, label, accent, fontScale, delayInFrames, showReferenceFrame } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delayInFrames;

  const labelIn = spring({ frame: f - fps * 1.8, fps, config: SPRING_CONFIG });

  return (
    <>
      <PreviewBackground show={showReferenceFrame} />
      <OverlayRoot {...props}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 18,
            padding: `0 0 0 ${SAFE.leftColumnX}px`,
          }}
        >
          {cards.map((c, i) => {
            const appearAt = delayInFrames + Math.round(fps * (0.2 + i * 0.35));
            const enter = spring({ frame: frame - appearAt, fps, config: SPRING_CONFIG });
            const x = interpolate(enter, [0, 1], [-70, 0]);
            const opacity = interpolate(enter, [0, 1], [0, 1]);
            return (
              <div key={i} style={{ transform: `translateX(${x}px)`, opacity }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    width: 560,
                    padding: "20px 24px",
                    borderRadius: RADIUS.md,
                    background: COLORS.cardBg,
                    border: `1px solid ${COLORS.cardBorder}`,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {/* company icon placeholder */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: RADIUS.sm,
                      background: "rgba(255,255,255,0.08)",
                      border: `1px solid ${COLORS.cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: accent,
                      fontSize: fs(24, fontScale),
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: COLORS.textPrimary,
                        fontSize: fs(28, fontScale),
                        fontWeight: 600,
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {c.tags.map((t, j) => (
                        <span
                          key={j}
                          style={{
                            fontSize: fs(17, fontScale),
                            fontWeight: 500,
                            color: COLORS.textSecondary,
                            padding: "3px 12px",
                            borderRadius: RADIUS.pill,
                            background: "rgba(255,255,255,0.06)",
                            border: `1px solid ${COLORS.cardBorder}`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Summary label */}
          <div
            style={{
              marginTop: 10,
              opacity: interpolate(labelIn, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(labelIn, [0, 1], [16, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ width: 34, height: 4, background: accent, borderRadius: 2 }} />
            <span
              style={{
                color: COLORS.textPrimary,
                fontSize: fs(30, fontScale),
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          </div>
        </AbsoluteFill>
      </OverlayRoot>
    </>
  );
};
