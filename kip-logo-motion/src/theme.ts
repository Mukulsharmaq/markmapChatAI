/**
 * theme.ts — brand constants sampled directly from the supplied logo artwork
 * (KIP_LogoJuly_2026.ai). Keeping them here means every scene stays true to the
 * original design.
 */

// Exact crimson of the logo background (sampled from the source .ai render).
export const BRAND_RED = "#e50747";
// A deeper shade of the same hue used only for the ignite-in gradient, so the
// background feels like it "powers up" into the true brand colour.
export const BRAND_RED_DEEP = "#8a022a";
export const WHITE = "#ffffff";

// Composition geometry (matches the source card exactly).
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 180; // 6.0s: reveal + comfortable hold for trimming

// The reticle is centred on the frame in the original artwork.
export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;

// Distance from centre to a corner — the radius the scope reveal must reach to
// uncover the whole frame.
export const CORNER_RADIUS = Math.hypot(WIDTH / 2, HEIGHT / 2); // ≈ 1101
