/**
 * fonts.ts — brand typography, self-hosted.
 *
 * The brand system pairs Graphik (brand face) with Archivo Black (the "hook"
 * voice: thumbnails, posters, one-liners — uppercase, ≤6 words, one gold
 * word). Graphik is a commercial face, so we substitute Inter — the same
 * grotesque flavour — at the brand's specified weights (400/500/600/700).
 *
 * Font files live in public/fonts (latin subsets) so renders never touch the
 * network: Inter ships as a variable font covering the full weight range,
 * Archivo Black as a single 400 weight.
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Body / headline face (Graphik stand-in). */
export const BRAND_FONT = "Inter";

/** Hook face — big numbers, uppercase hooks. */
export const HOOK_FONT = "Archivo Black";

loadFont({
  family: BRAND_FONT,
  url: staticFile("fonts/Inter-latin.woff2"),
  weight: "100 900", // variable font — one file, every weight
});

loadFont({
  family: HOOK_FONT,
  url: staticFile("fonts/ArchivoBlack-latin.woff2"),
  weight: "400",
});

export const WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
