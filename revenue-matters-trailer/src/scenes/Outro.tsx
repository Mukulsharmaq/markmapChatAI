/**
 * Outro — the logo sting · place at the very end, before the podcast begins.
 *
 * Full-frame and fully opaque. Built from the brand's finale recipe:
 * aurora navy (exact gradient values from the PDF) over a blueprint grid,
 * concentric target rings behind the logo (the show-cover motif), the
 * reversed logo lockup (preferred on media), the show line, and the
 * "A RECOTAP PODCAST" eyebrow.
 *
 * Choreography (30fps, 8s):
 *   0–14   frame fades up from the video
 *   6–60   target rings breathe outward, one after another
 *   14–48  logo settles in (scale 1.045 → 1, fade) with a soft gold bloom
 *   64–92  show line rises
 *   84–112 eyebrow + live dot land
 *   112+   calm hold (ring pulse keeps breathing) — cut to the episode
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { blueprintGridBackground } from "../components/BlueprintPanel";
import { easeOutQuint, rise, softSpring } from "../components/motion";
import { BRAND_FONT, WEIGHT } from "../fonts";
import { COLORS, HEIGHT, NAVY_AURORA, WIDTH, sec } from "../theme";

export const OUTRO_DURATION = sec(8);

const RING_COUNT = 3;

/** One slow breathing target ring. */
const Ring: React.FC<{
  frame: number;
  index: number;
  cx: number;
  cy: number;
}> = ({ frame, index, cx, cy }) => {
  const appear = interpolate(
    frame,
    [6 + index * 10, 40 + index * 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutQuint,
    }
  );
  // Continuous, very slow breathing after arrival (12s period).
  const breathe = 1 + 0.012 * Math.sin((frame / 360) * Math.PI * 2 + index);
  const base = 340 + index * 210;
  const size = base * (0.92 + appear * 0.08) * breathe;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid rgba(231, 235, 242, ${0.11 * appear * (1 - index * 0.22)})`,
      }}
    />
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const frameIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo: gentle settle, no bounce.
  const logoSpring = softSpring(frame, 14);
  const logoOpacity = interpolate(frame, [14, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  const logoScale = 1.045 - logoSpring * 0.045;

  // Soft gold bloom behind the logo, breathing slowly during the hold.
  const bloom =
    interpolate(frame, [20, 70], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutQuint,
    }) *
    (0.85 + 0.15 * Math.sin((frame / 300) * Math.PI * 2));

  const tagline = rise(frame, 64, 28);
  const eyebrow = rise(frame, 84, 28, 18);

  // Live-pulse dot next to the eyebrow (brand "coming soon" cue).
  const pulseT = ((frame + 20) % 75) / 75;
  const pulseR = 6 + pulseT * 16;
  const pulseO = (1 - pulseT) * 0.5;

  const cx = WIDTH / 2;
  const logoCy = HEIGHT / 2 - 76;

  return (
    <AbsoluteFill style={{ opacity: frameIn }}>
      {/* Aurora navy field — exact brand gradient stack, fully opaque */}
      <AbsoluteFill style={{ background: NAVY_AURORA }} />
      {/* Blueprint grid */}
      <AbsoluteFill style={{ background: blueprintGridBackground(64) }} />
      {/* Gentle vignette to focus the lockup */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(75% 68% at 50% 44%, transparent 55%, rgba(4, 22, 52, 0.55) 100%)",
        }}
      />

      {/* Target rings behind the logo */}
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <Ring key={i} frame={frame} index={i} cx={cx} cy={logoCy} />
      ))}

      {/* Gold bloom */}
      <div
        style={{
          position: "absolute",
          left: cx - 560,
          top: logoCy - 330,
          width: 1120,
          height: 660,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(231,181,59,0.16), transparent 68%)",
          opacity: bloom,
        }}
      />

      {/* Logo lockup — reversed (white on navy), preferred on media */}
      <div
        style={{
          position: "absolute",
          left: cx - 430,
          top: logoCy - 204,
          width: 860,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transformOrigin: "center",
        }}
      >
        <Img
          src={staticFile("assets/rm-logo-reversed.png")}
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* Show line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: logoCy + 268,
          textAlign: "center",
          fontFamily: BRAND_FONT,
          fontWeight: WEIGHT.medium,
          fontSize: 35,
          letterSpacing: "0.005em",
          color: COLORS.white80,
          opacity: tagline.opacity,
          transform: `translateY(${tagline.translateY}px)`,
        }}
      >
        One real B2B deal, broken down every week.
      </div>

      {/* Eyebrow: live dot + A RECOTAP PODCAST */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: logoCy + 340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          opacity: eyebrow.opacity,
          transform: `translateY(${eyebrow.translateY}px)`,
        }}
      >
        <div style={{ position: "relative", width: 12, height: 12 }}>
          <div
            style={{
              position: "absolute",
              left: 6 - pulseR,
              top: 6 - pulseR,
              width: pulseR * 2,
              height: pulseR * 2,
              borderRadius: "50%",
              border: `1.5px solid rgba(231, 181, 59, ${pulseO})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 1.5,
              borderRadius: "50%",
              background: COLORS.gold,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: BRAND_FONT,
            fontWeight: WEIGHT.bold,
            fontSize: 24,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: COLORS.white60,
          }}
        >
          A Recotap podcast
        </span>
      </div>
    </AbsoluteFill>
  );
};
