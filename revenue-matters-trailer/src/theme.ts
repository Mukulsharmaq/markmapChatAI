/**
 * theme.ts — Revenue Matters brand system tokens (Brand System v2.0, Jul 2026).
 *
 * Every value here is lifted from the brand PDF:
 *  - "A two-colour brand, one action accent": Recotap Navy #00204C base,
 *    Signal Gold #E7B53B as THE single accent (one gold gesture per surface).
 *  - Extended & neutrals: Navy 700 #0A2C5C, Navy 900 #041634, Deep Gold
 *    #9C7A1C, Gold Soft #FBF4DD, Signal Blue #3B79E7, Muted #5B6B82,
 *    Line #E6EBF2, Surface Alt #F8FAFD.
 *  - Radii & motion: panels 40 / cards 14–16 / pills 999; reveal = fade +
 *    28px rise; nothing rushed.
 *  - Design language: blueprint grid on every navy surface; aurora navy for
 *    finale panels; gold signal = eyebrow dash + live dot + one hot word.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS = {
  navy: "#00204C", // Recotap Navy — the base
  navy700: "#0A2C5C",
  navy900: "#041634",
  navyAurora: "#0B2A5E", // top stop of the brand aurora/dissolve gradient

  gold: "#E7B53B", // Signal Gold — the ONE accent
  deepGold: "#9C7A1C",
  goldSoft: "#FBF4DD",

  signalBlue: "#3B79E7",
  muted: "#5B6B82",
  line: "#E6EBF2",
  surfaceAlt: "#F8FAFD",

  white: "#FFFFFF",
  white80: "rgba(255, 255, 255, 0.8)", // brand: body at 80% white on navy
  white60: "rgba(255, 255, 255, 0.6)",
  white40: "rgba(255, 255, 255, 0.4)",

  // Blueprint grid line on navy — faint, engineered
  gridLine: "rgba(231, 235, 242, 0.075)",
  cardBorder: "rgba(231, 235, 242, 0.16)",
} as const;

/**
 * The exact layered background recipe from the brand PDF ("copy the values —
 * don't improvise new ones").
 */
export const NAVY_DISSOLVE = `linear-gradient(158deg, ${COLORS.navyAurora} 0%, ${COLORS.navy} 46%, ${COLORS.navy900} 100%)`;

export const NAVY_AURORA = [
  "radial-gradient(80% 62% at 50% 118%, rgba(231,181,59,.20), transparent 58%)",
  "radial-gradient(58% 46% at 12% -8%, rgba(59,121,231,.32), transparent 60%)",
  NAVY_DISSOLVE,
].join(", ");

export const RADIUS = {
  panel: 40,
  card: 16,
  overlayCard: 28, // between card and panel — our overlay panels are mid-size
  pill: 999,
} as const;

export const SHADOW = {
  panel: "0 30px 80px rgba(2, 10, 26, 0.6), 0 8px 24px rgba(2, 10, 26, 0.45)",
} as const;

/**
 * SAFE margins — overlays keep clear of frame edges and (as lower thirds /
 * bottom bands) of speaker faces in a typical two-up podcast frame.
 */
export const SAFE = {
  x: 96,
  bottom: 84,
  top: 84,
} as const;

/** Gentle, no-overshoot spring for "smooth, polished, never rushed" motion. */
export const SOFT_SPRING = {
  damping: 34,
  stiffness: 66,
  mass: 1,
} as const;

/** Brand reveal spec: fade + 28px rise. */
export const RISE_PX = 28;

export const sec = (s: number) => Math.round(s * FPS);
