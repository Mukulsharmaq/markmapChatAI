/**
 * Outro — "the signal found" · place at the very end, before the podcast.
 *
 * The brand book calls the rising gold line "the brand's one hero gesture —
 * revenue up, the signal found", and the brand idea is "the signal in the
 * noise". This outro animates exactly that story:
 *
 *   Act 1 · THE NOISE   (0–2.2s)  a muted line wanders flat; the gold signal
 *                                 line draws through the same field, leaving
 *                                 data-point ticks at each vertex
 *   Act 2 · THE STRIKE  (2.2–3s)  the gold line breaks away and accelerates
 *                                 up-right; blueprint crosshairs + rings
 *                                 converge on the strike point
 *   Act 3 · THE LOCK    (3–3.9s)  impact: flash, shockwave ring, a subtle
 *                                 scene kick — the logo wipes in from the
 *                                 exact point of its target lock
 *   Act 4 · THE SHOW    (3.9–6.5s) tagline wipes on behind a gold dash,
 *                                 "A RECOTAP PODCAST" tracks in, slow push-in
 *                                 hold with breathing rings — cut to episode
 *
 * Full-frame and fully opaque once faded in (first ~0.4s blends from video).
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
import { easeInOutCubic, easeOutQuint, rise } from "../components/motion";
import { BRAND_FONT, WEIGHT } from "../fonts";
import { COLORS, HEIGHT, NAVY_AURORA, WIDTH, sec } from "../theme";

export const OUTRO_DURATION = sec(6.5);

/* ------------------------------------------------------------------ layout */

const LOGO_W = 860;
const LOGO_H = Math.round((425 / 897) * LOGO_W); // 407
const LOGO_X = (WIDTH - LOGO_W) / 2; // 530
const LOGO_CY = 496;
const LOGO_Y = LOGO_CY - Math.round(LOGO_H / 2); // 292

// Bullseye of the target lock, measured from the logo artwork.
const TARGET_FX = 0.897;
const TARGET_FY = 0.215;
const IMPACT = {
  x: LOGO_X + TARGET_FX * LOGO_W,
  y: LOGO_Y + TARGET_FY * LOGO_H,
};

/* -------------------------------------------------------- the signal line */

// Wandering "revenue" polyline that ends in a straight strike into the
// bullseye. Screen coordinates.
const SIGNAL_POINTS: Array<[number, number]> = [
  [-90, 802],
  [150, 748],
  [318, 806],
  [488, 686],
  [636, 754],
  [806, 630],
  [952, 696],
  [IMPACT.x, IMPACT.y], // the strike
];

// The flat "noise" line the signal leaves behind.
const NOISE_POINTS: Array<[number, number]> = [
  [-90, 812],
  [220, 790],
  [470, 816],
  [730, 786],
  [980, 812],
  [1290, 792],
  [1620, 812],
  [2010, 800],
];

const toPath = (pts: Array<[number, number]>) =>
  pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

const segmentLengths = (pts: Array<[number, number]>) => {
  const lens: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    lens.push(Math.hypot(dx, dy));
  }
  return lens;
};

const SIGNAL_SEGS = segmentLengths(SIGNAL_POINTS);
const SIGNAL_LEN = SIGNAL_SEGS.reduce((a, b) => a + b, 0);
// Length fraction where the strike segment begins (the divergence point).
const STRIKE_FRACTION = 1 - SIGNAL_SEGS[SIGNAL_SEGS.length - 1] / SIGNAL_LEN;

/** Point at length-fraction t along the polyline. */
const pointAt = (pts: Array<[number, number]>, segs: number[], t: number) => {
  const target = t * segs.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= target) {
      const local = (target - acc) / segs[i];
      return {
        x: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * local,
        y: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * local,
      };
    }
    acc += segs[i];
  }
  return { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };
};

/* ----------------------------------------------------------- timing (30fps) */

const T = {
  fadeIn: [0, 12],
  wander: [6, 66] as const, // draw 0 → STRIKE_FRACTION
  strike: [66, 88] as const, // draw STRIKE_FRACTION → 1, accelerating
  impact: 88,
  reveal: [90, 120] as const, // logo circular wipe
  lineFade: [96, 116] as const,
  tagline: [116, 140] as const,
  eyebrow: [130, 154] as const,
  pushIn: [150, 195] as const,
};

/** Draw progress of the signal line (fraction of total length). */
const signalProgress = (frame: number) => {
  const wander = interpolate(
    frame,
    T.wander as unknown as number[],
    [0, STRIKE_FRACTION],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOutCubic,
    }
  );
  const strike = interpolate(
    frame,
    T.strike as unknown as number[],
    [0, 1 - STRIKE_FRACTION],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t * t, // accelerate hard into the target
    }
  );
  return Math.min(1, wander + strike);
};

/* ---------------------------------------------------------------- component */

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const frameIn = interpolate(frame, T.fadeIn, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progress = signalProgress(frame);
  const head = pointAt(SIGNAL_POINTS, SIGNAL_SEGS, progress);
  const struck = frame >= T.impact;

  // The drawn line hands off to the logo's own arrow after impact.
  const lineOpacity = interpolate(
    frame,
    T.lineFade as unknown as number[],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const noiseDraw = interpolate(frame, [6, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  // Targeting: crosshairs + converging rings during the strike.
  const targeting = interpolate(
    frame,
    [T.strike[0] - 6, T.impact],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutQuint }
  );
  const targetingFade = interpolate(frame, [T.impact, T.impact + 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Impact: flash + shockwave + scene kick.
  const flash = interpolate(frame, [T.impact - 2, T.impact + 3, T.impact + 16], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shockT = interpolate(frame, [T.impact, T.impact + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  const kick = interpolate(frame, [T.impact, T.impact + 4, T.impact + 16], [0, 0.016, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  // Logo reveal: circle wipe out of the bullseye.
  const revealT = interpolate(frame, T.reveal as unknown as number[], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  const revealR = revealT * 1180; // px — covers the full lockup
  const sweep = interpolate(frame, [104, 134], [-0.35, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });

  // Copy.
  const taglineWipe = interpolate(frame, T.tagline as unknown as number[], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  const dashW = interpolate(frame, [T.tagline[0] - 4, T.tagline[1]], [0, 56], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  const eyebrowIn = rise(frame, T.eyebrow[0], 24, 12);
  const tracking = interpolate(frame, [T.eyebrow[0], T.eyebrow[1]], [0.5, 0.26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });

  // Living hold: slow push-in + breathing.
  const pushIn = interpolate(frame, T.pushIn as unknown as number[], [1, 1.018], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });
  const breathe = 0.9 + 0.1 * Math.sin((frame / 210) * Math.PI * 2);

  const pulseT = ((frame + 30) % 66) / 66;

  return (
    <AbsoluteFill style={{ opacity: frameIn }}>
      {/* Aurora navy field — exact brand gradient stack, fully opaque */}
      <AbsoluteFill style={{ background: NAVY_AURORA }} />
      <AbsoluteFill style={{ background: blueprintGridBackground(64) }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(75% 68% at 50% 44%, transparent 55%, rgba(4, 22, 52, 0.55) 100%)",
        }}
      />

      {/* Everything that reacts to the impact kick / hold push-in */}
      <AbsoluteFill
        style={{
          transform: `scale(${pushIn * (1 + kick)})`,
          transformOrigin: `${IMPACT.x}px ${IMPACT.y}px`,
        }}
      >
        {/* THE NOISE — muted line that never rises */}
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", inset: 0, opacity: lineOpacity }}
        >
          <path
            d={toPath(NOISE_POINTS)}
            pathLength={1}
            stroke={COLORS.muted}
            strokeOpacity={0.32}
            strokeWidth={2.5}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - noiseDraw}
          />
        </svg>

        {/* THE SIGNAL — gold line with glow + head */}
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", inset: 0, opacity: lineOpacity }}
        >
          {/* soft glow pass */}
          <path
            d={toPath(SIGNAL_POINTS)}
            pathLength={1}
            stroke={COLORS.gold}
            strokeOpacity={0.35}
            strokeWidth={13}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
            style={{ filter: "blur(7px)" }}
          />
          {/* core */}
          <path
            d={toPath(SIGNAL_POINTS)}
            pathLength={1}
            stroke={COLORS.gold}
            strokeWidth={5.5}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
          />
          {/* data-point ticks left at passed vertices (skip endpoints) */}
          {SIGNAL_POINTS.slice(1, -1).map(([x, y], i) => {
            const vertexFrac =
              SIGNAL_SEGS.slice(0, i + 1).reduce((a, b) => a + b, 0) /
              SIGNAL_LEN;
            const passed = progress >= vertexFrac;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={5}
                fill={COLORS.gold}
                opacity={passed ? 0.45 : 0}
              />
            );
          })}
        </svg>

        {/* head glow of the signal line */}
        {!struck && progress > 0.005 ? (
          <div
            style={{
              position: "absolute",
              left: head.x - 46,
              top: head.y - 46,
              width: 92,
              height: 92,
              borderRadius: "50%",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(231,181,59,0.85) 0%, rgba(231,181,59,0.25) 38%, transparent 70%)",
            }}
          />
        ) : null}

        {/* TARGETING — blueprint crosshairs + converging rings */}
        <div style={{ opacity: targeting * targetingFade }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: IMPACT.y - 0.75,
              height: 1.5,
              background: `linear-gradient(90deg, transparent 4%, rgba(231,235,242,0.28) 50%, transparent 96%)`,
              transform: `scaleX(${targeting})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: IMPACT.x - 0.75,
              width: 1.5,
              background: `linear-gradient(180deg, transparent 4%, rgba(231,235,242,0.28) 50%, transparent 96%)`,
              transform: `scaleY(${targeting})`,
            }}
          />
          {[0, 1].map((i) => {
            const r = (120 + i * 70) * (2.1 - 1.1 * targeting);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: IMPACT.x - r,
                  top: IMPACT.y - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: "50%",
                  border: `1.5px solid rgba(231, 181, 59, ${0.4 - i * 0.15})`,
                }}
              />
            );
          })}
        </div>

        {/* IMPACT — flash + shockwave */}
        <div
          style={{
            position: "absolute",
            left: IMPACT.x - 340,
            top: IMPACT.y - 340,
            width: 680,
            height: 680,
            borderRadius: "50%",
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(251,244,221,0.9) 0%, rgba(231,181,59,0.45) 30%, transparent 65%)",
            opacity: flash,
          }}
        />
        {shockT > 0 && shockT < 1 ? (
          <div
            style={{
              position: "absolute",
              left: IMPACT.x - shockT * 330,
              top: IMPACT.y - shockT * 330,
              width: shockT * 660,
              height: shockT * 660,
              borderRadius: "50%",
              border: `${3 - shockT * 2}px solid rgba(231, 181, 59, ${0.55 * (1 - shockT)})`,
            }}
          />
        ) : null}

        {/* THE LOGO — wipes in from the bullseye */}
        <div
          style={{
            position: "absolute",
            left: LOGO_X,
            top: LOGO_Y,
            width: LOGO_W,
            height: LOGO_H,
            clipPath: `circle(${revealR}px at ${TARGET_FX * 100}% ${TARGET_FY * 100}%)`,
          }}
        >
          <Img
            src={staticFile("assets/rm-logo-reversed.png")}
            style={{ width: "100%", display: "block" }}
          />
          {/* light sweep across the letterforms, masked to the logo alpha */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(112deg, transparent ${sweep * 100 - 14}%, rgba(255,255,255,0.38) ${sweep * 100}%, transparent ${sweep * 100 + 14}%)`,
              WebkitMaskImage: `url(${staticFile("assets/rm-logo-reversed.png")})`,
              WebkitMaskSize: "100% 100%",
              maskImage: `url(${staticFile("assets/rm-logo-reversed.png")})`,
              maskSize: "100% 100%",
            }}
          />
        </div>

        {/* gold bloom behind the lockup once revealed, breathing */}
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2 - 560,
            top: LOGO_CY - 320,
            width: 1120,
            height: 640,
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(231,181,59,0.13), transparent 66%)",
            opacity: revealT * breathe,
            pointerEvents: "none",
          }}
        />

        {/* TAGLINE — gold dash draws, line wipes on */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LOGO_Y + LOGO_H + 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: dashW,
              height: 4,
              borderRadius: 2,
              background: COLORS.gold,
            }}
          />
          <div
            style={{
              fontFamily: BRAND_FONT,
              fontWeight: WEIGHT.medium,
              fontSize: 34,
              color: COLORS.white80,
              clipPath: `inset(0 ${(1 - taglineWipe) * 100}% 0 0)`,
              transform: `translateX(${(1 - taglineWipe) * -10}px)`,
            }}
          >
            One real B2B deal, broken down every week.
          </div>
        </div>

        {/* EYEBROW — live dot + tracking-in label */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LOGO_Y + LOGO_H + 134,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            opacity: eyebrowIn.opacity,
            transform: `translateY(${eyebrowIn.translateY}px)`,
          }}
        >
          <div style={{ position: "relative", width: 12, height: 12 }}>
            <div
              style={{
                position: "absolute",
                left: 6 - (6 + pulseT * 15),
                top: 6 - (6 + pulseT * 15),
                width: (6 + pulseT * 15) * 2,
                height: (6 + pulseT * 15) * 2,
                borderRadius: "50%",
                border: `1.5px solid rgba(231, 181, 59, ${(1 - pulseT) * 0.5})`,
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
              fontSize: 23,
              letterSpacing: `${tracking}em`,
              textTransform: "uppercase",
              color: COLORS.white60,
            }}
          >
            A Recotap podcast
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
