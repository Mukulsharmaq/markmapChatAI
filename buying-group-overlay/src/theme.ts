/**
 * theme.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for the visual system: colors, fonts, spacing, and the
 * "safe areas" where overlays are allowed to sit so they don't cover the
 * podcast speakers.
 *
 * Change values HERE to restyle every scene at once. Per-scene overrides live in
 * each scene's `defaultProps` (editable live in Remotion Studio's right panel).
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * ACCENT — the one accent color used across all scenes. Swap this single value
 * to re-brand everything. Yellow (Kissflow-ish) by default; a blue alt is
 * provided for quick A/B.
 */
export const ACCENT = "#F5C518"; // premium warm yellow
export const ACCENT_ALT = "#4F9DFF"; // blue alternative

export const COLORS = {
  accent: ACCENT,
  accentAlt: ACCENT_ALT,

  // Dark translucent card system
  cardBg: "rgba(14, 18, 26, 0.72)",
  cardBgSolid: "rgba(14, 18, 26, 0.9)",
  cardBorder: "rgba(255, 255, 255, 0.14)",
  cardBorderStrong: "rgba(255, 255, 255, 0.28)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.68)",
  textMuted: "rgba(255, 255, 255, 0.42)",

  // Connector lines
  line: "rgba(255, 255, 255, 0.55)",
  lineFaint: "rgba(255, 255, 255, 0.22)",

  // States
  success: "#3ECF8E",
  glow: "rgba(245, 197, 24, 0.55)",
} as const;

export const FONT = {
  // Filled in by loadFont() in fonts.ts. Fallback keeps things rendering even
  // before the webfont resolves.
  family: 'Inter, "Helvetica Neue", Arial, sans-serif',
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
} as const;

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const SHADOW = {
  card: "0 18px 48px rgba(0, 0, 0, 0.45)",
  soft: "0 8px 24px rgba(0, 0, 0, 0.35)",
} as const;

/**
 * SAFE AREAS — approximate pixel anchors that keep overlays clear of speaker
 * faces on a typical two-person Riverside frame. Adjust after previewing your
 * own reference-frame.png (see PreviewBackground + Step 12 in the README).
 */
export const SAFE = {
  lowerThirdY: HEIGHT - 300, // baseline for lower-third titles
  leftColumnX: 120, // left-safe column (speaker usually center/right)
  rightColumnX: WIDTH - 120,
  topMargin: 90,
  bottomMargin: 90,
} as const;

/**
 * Standard spring for pop-in motion. Tweak damping/stiffness once, everywhere.
 */
export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 140,
  mass: 0.9,
} as const;

/**
 * SCENE_TIMING — master timeline. seconds → used by Root.tsx and
 * OverlaySequence.tsx. Edit the seconds to retime the whole film. Each scene's
 * standalone composition uses (to - from) as its duration.
 */
export const SCENE_TIMING = {
  Scene01_Title: { from: 0, to: 7 },
  Scene02_CustomerIntel: { from: 7, to: 15 },
  Scene03_PowerUsers: { from: 15, to: 23 },
  Scene04_Departments: { from: 23, to: 32 },
  Scene05_Committee: { from: 32, to: 43 },
  Scene06_Validation: { from: 43, to: 55 },
} as const;

export const MASTER_DURATION_SECONDS = 55;

/** Cross-scene fade length (seconds) used at the head/tail of each master clip. */
export const FADE_SECONDS = 0.5;

export const sec = (s: number) => Math.round(s * FPS);
