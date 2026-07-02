/**
 * fonts.ts — loads Inter via @remotion/google-fonts so the overlays render with
 * consistent, premium typography with no local font files required.
 */
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const FONT_FAMILY = fontFamily;
