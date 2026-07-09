import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import {
  BRAND_RED,
  BRAND_RED_DEEP,
  CENTER_X,
  CENTER_Y,
  CORNER_RADIUS,
} from "./theme";

export type KipLogoProps = {
  background: boolean;
};

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

/** interpolate with clamping on both ends (the common case). */
const lerp = (
  frame: number,
  range: [number, number],
  out: [number, number],
  easing?: (n: number) => number
) =>
  interpolate(frame, range, out, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const KipLogo: React.FC<KipLogoProps> = ({ background }) => {
  const frame = useCurrentFrame();

  /* ----------------------------------------------------------------------- *
   *  BEAT MAP (30fps)
   *  00–24  ignite      background powers up + glow blooms
   *  10–54  power-on    reticle reveals outward from centre (scope online)
   *  14–44  scan        a single light bar sweeps down
   *  48–78  lock        flash + ring "ping" — target acquired
   *  56–110 title       diagonal wipe reveals KILLING / Imaginary / PEOPLE
   *  110–180 hold       everything sharp, faint breathing to keep it alive
   * ----------------------------------------------------------------------- */

  // --- Background: powers up from a deep shade into the true brand crimson ---
  const bgColor = interpolateColors(
    lerp(frame, [0, 26], [0, 1], easeOut),
    [0, 1],
    [BRAND_RED_DEEP, BRAND_RED]
  );

  // Centre glow blooms during power-on, then settles to a quiet ambient level.
  const glow =
    lerp(frame, [6, 40], [0, 0.16], easeOut) -
    lerp(frame, [40, 78], [0, 0.1], easeInOut);

  // --- Reticle (scope) reveal: an expanding circular mask from the centre. ---
  const revealR = lerp(
    frame,
    [10, 56],
    [0, CORNER_RADIUS + 150],
    easeOut
  );
  const feather = 140;
  const frameOpacity = lerp(frame, [10, 30], [0, 1], easeOut);
  // slight scale-settle so the reticle appears to "focus" into place
  const frameScale = lerp(frame, [10, 62], [1.05, 1], easeOut);
  // faint breathing during the hold keeps the still card feeling alive
  const breathe =
    Math.sin(interpolate(frame, [110, 180], [0, Math.PI * 2]) as number) *
    (frame > 100 ? 0.0035 : 0);
  const reticleMask = `radial-gradient(circle at ${CENTER_X}px ${CENTER_Y}px, #000 0px, #000 ${revealR}px, transparent ${
    revealR + feather
  }px)`;

  // --- Scan line sweeping down during power-on ---
  const scanProgress = lerp(frame, [14, 46], [0, 1], easeInOut);
  const scanY = interpolate(scanProgress, [0, 1], [-6, 106]); // % of height
  const scanOpacity =
    lerp(frame, [14, 20], [0, 0.55], easeOut) -
    lerp(frame, [40, 47], [0, 0.55], easeOut);

  // --- Lock: white flash + expanding ring ping ---
  const flash =
    lerp(frame, [48, 55], [0, 0.22], easeOut) -
    lerp(frame, [55, 70], [0, 0.22], easeInOut);
  const pingR = lerp(frame, [50, 84], [70, 560], easeOut);
  const pingOpacity = lerp(frame, [50, 84], [0.5, 0], easeInOut);
  const ping2R = lerp(frame, [124, 158], [80, 520], easeOut);
  const ping2Opacity =
    (lerp(frame, [124, 132], [0, 0.18], easeOut) -
      lerp(frame, [132, 158], [0, 0.18], easeInOut));

  // --- Title diagonal wipe (naturally reveals the 3 words in reading order) ---
  const titleP = lerp(frame, [56, 112], [-26, 118], easeInOut);
  const titleFeather = 20;
  const titleMask = `linear-gradient(118deg, #000 0%, #000 ${titleP}%, transparent ${
    titleP + titleFeather
  }%)`;
  const titleOpacity = lerp(frame, [56, 84], [0, 1], easeOut);
  const titleBlur = lerp(frame, [56, 100], [7, 0], easeOut);
  const titleRise = lerp(frame, [56, 104], [16, 0], easeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* ---------------------------------------------------------------- */}
      {/* Background (only for the opaque end-card export)                  */}
      {/* ---------------------------------------------------------------- */}
      {background && (
        <>
          <AbsoluteFill style={{ backgroundColor: bgColor }} />
          {/* ambient centre glow */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${CENTER_X}px ${CENTER_Y}px, rgba(255,255,255,${glow}) 0%, rgba(255,255,255,0) 46%)`,
            }}
          />
          {/* soft vignette to frame the card */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${CENTER_X}px ${CENTER_Y}px, rgba(0,0,0,0) 52%, rgba(0,0,0,0.22) 100%)`,
            }}
          />
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Reticle / scope HUD (rings, crosshair, brackets, metadata)       */}
      {/* ---------------------------------------------------------------- */}
      <AbsoluteFill
        style={{
          opacity: frameOpacity,
          transform: `scale(${frameScale + breathe})`,
          WebkitMaskImage: reticleMask,
          maskImage: reticleMask,
        }}
      >
        <Img
          src={staticFile("frame.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Ring ping — the "target acquired" pulse */}
      <AbsoluteFill>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={pingR}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
            opacity={pingOpacity}
          />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={ping2R}
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.5}
            opacity={ping2Opacity}
          />
        </svg>
      </AbsoluteFill>

      {/* ---------------------------------------------------------------- */}
      {/* Title — KILLING / Imaginary / PEOPLE                             */}
      {/* ---------------------------------------------------------------- */}
      <AbsoluteFill
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleRise}px)`,
          filter: `blur(${titleBlur}px)`,
          WebkitMaskImage: titleMask,
          maskImage: titleMask,
        }}
      >
        <Img
          src={staticFile("title.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* ---------------------------------------------------------------- */}
      {/* Scan line + lock flash (drawn on top, light blend)               */}
      {/* ---------------------------------------------------------------- */}
      <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanY}%`,
            height: 3,
            opacity: scanOpacity,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)",
            boxShadow: "0 0 22px 6px rgba(255,255,255,0.35)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: "#ffffff",
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
