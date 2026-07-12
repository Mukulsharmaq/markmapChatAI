/**
 * G1 — "Where targeting starts" · place at 00:00
 * Audio: "So typically 100 to 125 per vertical or per market. So that is
 *         where we start with."
 *
 * A stat-led card (brand thumbnail layout C: "a single giant gold number")
 * anchored bottom-left as a lower third. The two ends of the range count up
 * together, then the label settles underneath. One gold gesture: the stat
 * itself (the eyebrow dash is its pointer).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueprintPanel } from "../components/BlueprintPanel";
import { Eyebrow } from "../components/Eyebrow";
import { countUp, exitFall, rise, softSpring } from "../components/motion";
import { BRAND_FONT, HOOK_FONT, WEIGHT } from "../fonts";
import { COLORS, SAFE, sec } from "../theme";

export const G1_DURATION = sec(7.5);

export const G1Stat: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Panel entrance: fade + 28px rise (brand reveal), slow and calm.
  const panelIn = rise(frame, 0, 26);
  const panelScale = 0.985 + softSpring(frame, 0) * 0.015;

  // Exit begins 16 frames before the end.
  const out = exitFall(frame, durationInFrames - 18, 16);

  const n1 = countUp(frame, 22, 100, 44);
  const n2 = countUp(frame, 22, 125, 44);
  const statIn = rise(frame, 18, 26);
  const labelIn = rise(frame, 40, 24);
  const subIn = rise(frame, 52, 24);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: SAFE.x,
          bottom: SAFE.bottom,
          opacity: panelIn.opacity * out.opacity,
          transform: `translateY(${panelIn.translateY + out.translateY}px) scale(${panelScale})`,
          transformOrigin: "bottom left",
        }}
      >
        <BlueprintPanel style={{ width: 660, padding: "44px 52px 46px" }}>
          <Eyebrow frame={frame} from={8} label="Where targeting starts" />

          <div
            style={{
              marginTop: 26,
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              opacity: statIn.opacity,
              transform: `translateY(${statIn.translateY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: HOOK_FONT,
                fontSize: 112,
                lineHeight: 1,
                color: COLORS.gold,
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {n1}
            </span>
            <span
              style={{
                fontFamily: HOOK_FONT,
                fontSize: 80,
                lineHeight: 1,
                color: COLORS.gold,
                transform: "translateY(-5px)",
              }}
            >
              –
            </span>
            <span
              style={{
                fontFamily: HOOK_FONT,
                fontSize: 112,
                lineHeight: 1,
                color: COLORS.gold,
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {n2}
            </span>
          </div>

          <div
            style={{
              marginTop: 22,
              fontFamily: BRAND_FONT,
              fontWeight: WEIGHT.bold,
              fontSize: 40,
              letterSpacing: "0.02em",
              color: COLORS.white,
              opacity: labelIn.opacity,
              transform: `translateY(${labelIn.translateY}px)`,
            }}
          >
            Target accounts
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: BRAND_FONT,
              fontWeight: WEIGHT.medium,
              fontSize: 28,
              color: COLORS.white60,
              opacity: subIn.opacity,
              transform: `translateY(${subIn.translateY}px)`,
            }}
          >
            per vertical · per market
          </div>
        </BlueprintPanel>
      </div>
    </AbsoluteFill>
  );
};
