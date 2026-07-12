/**
 * G3 — the closer quote · place at 00:37.5
 * Audio: "If you are not telling a good story, no one is going to buy
 *         from you." — Raja
 *
 * The brand's quote-card layout: gold pull-quote mark, white quote with one
 * gold hot phrase ("good story"), attribution "name in white, @handle in
 * gold". Rendered as a wide bottom band — the beat that hands off to the
 * logo outro.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueprintPanel } from "../components/BlueprintPanel";
import { exitFall, rise, softSpring } from "../components/motion";
import { BRAND_FONT, HOOK_FONT, WEIGHT } from "../fonts";
import { COLORS, SAFE, WIDTH, sec } from "../theme";

export const G3_DURATION = sec(6.5);

const PANEL_W = 990;

export const G3Quote: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const panelIn = rise(frame, 0, 26);
  const panelScale = 0.985 + softSpring(frame, 0) * 0.015;
  const out = exitFall(frame, durationInFrames - 18, 16);

  const markIn = softSpring(frame, 8);
  const line1 = rise(frame, 18, 26);
  const line2 = rise(frame, 30, 26);
  const attr = rise(frame, 52, 24);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (WIDTH - PANEL_W) / 2,
          bottom: SAFE.bottom,
          opacity: panelIn.opacity * out.opacity,
          transform: `translateY(${panelIn.translateY + out.translateY}px) scale(${panelScale})`,
          transformOrigin: "bottom center",
        }}
      >
        <BlueprintPanel style={{ width: PANEL_W, padding: "46px 60px 42px" }}>
          <div style={{ display: "flex", gap: 40 }}>
            {/* Gold pull-quote mark */}
            <div
              style={{
                fontFamily: HOOK_FONT,
                fontSize: 130,
                lineHeight: 0.6,
                color: COLORS.gold,
                marginTop: 26,
                opacity: markIn,
                transform: `scale(${0.7 + markIn * 0.3})`,
                transformOrigin: "top left",
              }}
            >
              “
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: BRAND_FONT,
                  fontWeight: WEIGHT.semibold,
                  fontSize: 47,
                  lineHeight: 1.32,
                  letterSpacing: "-0.015em",
                  color: COLORS.white,
                }}
              >
                <div
                  style={{
                    opacity: line1.opacity,
                    transform: `translateY(${line1.translateY}px)`,
                  }}
                >
                  If you’re not telling a{" "}
                  <span style={{ color: COLORS.gold }}>good story</span>,
                </div>
                <div
                  style={{
                    opacity: line2.opacity,
                    transform: `translateY(${line2.translateY}px)`,
                  }}
                >
                  no one is going to buy from you.
                </div>
              </div>

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: attr.opacity,
                  transform: `translateY(${attr.translateY}px)`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 3.5,
                    borderRadius: 2,
                    background: COLORS.muted,
                  }}
                />
                <span
                  style={{
                    fontFamily: BRAND_FONT,
                    fontWeight: WEIGHT.bold,
                    fontSize: 26,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: COLORS.white80,
                  }}
                >
                  Raja T M
                </span>
                <span
                  style={{
                    fontFamily: BRAND_FONT,
                    fontWeight: WEIGHT.bold,
                    fontSize: 26,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: COLORS.gold,
                  }}
                >
                  @kissflow
                </span>
              </div>
            </div>
          </div>
        </BlueprintPanel>
      </div>
    </AbsoluteFill>
  );
};
