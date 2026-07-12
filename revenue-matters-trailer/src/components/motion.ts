/**
 * motion.ts — shared animation helpers implementing the brand motion spec:
 * "Reveal: fade + 28px rise · honour reduced-motion · nothing rushed."
 *
 * All entrances are slow-breathing eases with zero overshoot; exits are
 * shorter but still gentle.
 */
import { interpolate, spring } from "remotion";
import { FPS, RISE_PX, SOFT_SPRING } from "../theme";

export type Ease = (t: number) => number;

/** Quintic ease-out — fast start, long soft landing. */
export const easeOutQuint: Ease = (t) => 1 - Math.pow(1 - t, 5);

/** Cubic ease-in-out for exits. */
export const easeInOutCubic: Ease = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Brand reveal: returns opacity + translateY for a fade + 28px rise starting
 * at `from` (frames) and lasting `duration` frames.
 */
export const rise = (
  frame: number,
  from: number,
  duration = 24,
  distance = RISE_PX
) => {
  const t = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuint,
  });
  return {
    opacity: t,
    translateY: (1 - t) * distance,
  };
};

/** Gentle no-overshoot spring, 0 → 1, starting at `from`. */
export const softSpring = (frame: number, from: number, fps = FPS) =>
  spring({
    frame: frame - from,
    fps,
    config: SOFT_SPRING,
  });

/**
 * Fade-down exit. Returns opacity + translateY; identity before `from`.
 */
export const exitFall = (frame: number, from: number, duration = 16) => {
  const t = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });
  return {
    opacity: 1 - t,
    translateY: t * 14,
  };
};

/**
 * Eased count-up for stat numbers: 0 → target, starting at `from`, over
 * `duration` frames, with a long deceleration so the final value settles
 * rather than snaps.
 */
export const countUp = (
  frame: number,
  from: number,
  target: number,
  duration = 40
) =>
  Math.round(
    interpolate(frame, [from, from + duration], [0, target], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutQuint,
    })
  );
