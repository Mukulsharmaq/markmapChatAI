/**
 * G2 — "The $500 play" · place at 00:20.5
 * Audio: "Now you have jobs to be done and the category entry point which
 *         Kissflow would fit in. So what we do is that we take a budget of
 *         like maybe $500 … and then you have a sizable audience within that
 *         subsegment of users."
 *
 * Bottom-right lower third. The two inputs land first as navy pills —
 * JOBS TO BE DONE + CATEGORY ENTRY POINT — then the $500 stat counts up as
 * the play they unlock. Gold gesture: the $500.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BlueprintPanel } from "../components/BlueprintPanel";
import { Eyebrow } from "../components/Eyebrow";
import { countUp, exitFall, rise, softSpring } from "../components/motion";
import { BRAND_FONT, HOOK_FONT, WEIGHT } from "../fonts";
import { COLORS, RADIUS, SAFE, sec } from "../theme";

export const G2_DURATION = sec(8);

const Pill: React.FC<{
  frame: number;
  from: number;
  children: React.ReactNode;
}> = ({ frame, from, children }) => {
  const r = rise(frame, from, 24, 20);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 24px",
        borderRadius: RADIUS.pill,
        background: COLORS.navy700,
        border: `1.5px solid rgba(231, 235, 242, 0.22)`,
        fontFamily: BRAND_FONT,
        fontWeight: WEIGHT.bold,
        fontSize: 23,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: COLORS.white,
        opacity: r.opacity,
        transform: `translateY(${r.translateY}px)`,
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 99,
          background: COLORS.line,
          opacity: 0.7,
        }}
      />
      {children}
    </div>
  );
};

export const G2Play: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const panelIn = rise(frame, 0, 26);
  const panelScale = 0.985 + softSpring(frame, 0) * 0.015;
  const out = exitFall(frame, durationInFrames - 18, 16);

  // $500 lands as the speaker says it (~2.5s into the clip).
  const statIn = rise(frame, 66, 26);
  const dollars = countUp(frame, 70, 500, 42);
  const labelIn = rise(frame, 88, 24);
  const subIn = rise(frame, 100, 24);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: SAFE.x,
          bottom: SAFE.bottom,
          opacity: panelIn.opacity * out.opacity,
          transform: `translateY(${panelIn.translateY + out.translateY}px) scale(${panelScale})`,
          transformOrigin: "bottom right",
        }}
      >
        <BlueprintPanel style={{ width: 700, padding: "44px 52px 46px" }}>
          <Eyebrow frame={frame} from={8} label="The play" />

          <div
            style={{
              marginTop: 26,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <Pill frame={frame} from={22}>
              Jobs to be done
            </Pill>
            <Pill frame={frame} from={36}>
              Category entry point
            </Pill>
          </div>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "baseline",
              gap: 22,
              opacity: statIn.opacity,
              transform: `translateY(${statIn.translateY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: HOOK_FONT,
                fontSize: 132,
                lineHeight: 1,
                color: COLORS.gold,
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${dollars}
            </span>
            <span
              style={{
                fontFamily: BRAND_FONT,
                fontWeight: WEIGHT.bold,
                fontSize: 38,
                color: COLORS.white,
                opacity: labelIn.opacity,
                transform: `translateY(${labelIn.translateY}px)`,
              }}
            >
              test budget
            </span>
          </div>

          <div
            style={{
              marginTop: 16,
              fontFamily: BRAND_FONT,
              fontWeight: WEIGHT.medium,
              fontSize: 28,
              color: COLORS.white60,
              opacity: subIn.opacity,
              transform: `translateY(${subIn.translateY}px)`,
            }}
          >
            a sizable audience in that subsegment
          </div>
        </BlueprintPanel>
      </div>
    </AbsoluteFill>
  );
};
