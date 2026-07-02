/**
 * Scene01_Title — lower-third title + subtle 10x10 account grid.
 * Audio moment: Ganesh asks "...the process you follow on buying group mapping".
 *
 * Layout: title bottom-left (lower third), grid bottom-right so the center stays
 * clear for speakers.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "../types";
import { OverlayRoot, fs } from "../components/OverlayRoot";
import { OverlayCard } from "../components/OverlayCard";
import { AccountGrid } from "../components/AccountGrid";
import { PreviewBackground } from "../components/PreviewBackground";
import { COLORS, SAFE, SPRING_CONFIG } from "../theme";

export const scene01Schema = commonOverlaySchema.extend({
  title: z.string(),
  subtitle: z.string(),
  selectedAccounts: z.array(z.number()),
});

export const scene01Defaults: z.infer<typeof scene01Schema> = {
  ...DEFAULT_COMMON,
  title: "Buying Group Mapping",
  subtitle: "Finding the real committee inside 100 accounts",
  selectedAccounts: [12, 34, 57, 78],
};

export const Scene01_Title: React.FC<z.infer<typeof scene01Schema>> = (props) => {
  const { title, subtitle, selectedAccounts, accent, fontScale, delayInFrames, showReferenceFrame } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delayInFrames;

  const titleIn = spring({ frame: f, fps, config: SPRING_CONFIG });
  const titleY = interpolate(titleIn, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1]);
  const barWidth = interpolate(titleIn, [0, 1], [0, 96]);

  return (
    <>
      <PreviewBackground show={showReferenceFrame} />
      <OverlayRoot {...props}>
        {/* Title block — lower-left */}
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: `0 0 ${SAFE.bottomMargin + 60}px ${SAFE.leftColumnX}px`,
          }}
        >
          <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOpacity }}>
            <div
              style={{
                width: barWidth,
                height: 6,
                background: accent,
                borderRadius: 3,
                marginBottom: 22,
              }}
            />
            <div
              style={{
                color: COLORS.textPrimary,
                fontSize: fs(84, fontScale),
                fontWeight: 700,
                letterSpacing: -1.5,
                lineHeight: 1.02,
                textShadow: "0 6px 30px rgba(0,0,0,0.55)",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 16,
                color: COLORS.textSecondary,
                fontSize: fs(34, fontScale),
                fontWeight: 500,
                textShadow: "0 4px 18px rgba(0,0,0,0.5)",
              }}
            >
              {subtitle}
            </div>
          </div>
        </AbsoluteFill>

        {/* Account grid — lower-right, inside a subtle card */}
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: `0 ${SAFE.leftColumnX}px ${SAFE.bottomMargin + 40}px 0`,
          }}
        >
          <OverlayCard appearAt={fps * 0.6} padding={26}>
            <div
              style={{
                color: COLORS.textMuted,
                fontSize: fs(20, fontScale),
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Target Accounts · 100
            </div>
            <AccountGrid
              appearAt={fps * 0.8}
              selected={selectedAccounts}
              accent={accent}
            />
          </OverlayCard>
        </AbsoluteFill>
      </OverlayRoot>
    </>
  );
};
