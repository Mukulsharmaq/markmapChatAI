/**
 * types.ts — shared prop shapes. Every scene extends CommonOverlayProps so the
 * same live controls (x, y, scale, opacity, accent, fontScale, delay) appear in
 * Remotion Studio for all six scenes.
 */
import { z } from "zod";

/**
 * Common editable controls exposed on every scene. Studio renders these in the
 * right-hand panel because we register them with a Zod schema on each
 * Composition (see Root.tsx).
 */
export const commonOverlaySchema = z.object({
  /** Horizontal nudge in px (positive = right). Anchors the whole overlay. */
  x: z.number(),
  /** Vertical nudge in px (positive = down). */
  y: z.number(),
  /** Uniform scale multiplier for the whole overlay. */
  scale: z.number(),
  /** Master opacity 0..1 (multiplied on top of animation fades). */
  opacity: z.number(),
  /** Accent color (hex). Overrides theme accent for this scene only. */
  accent: z.string(),
  /** Font size multiplier for the whole overlay. */
  fontScale: z.number(),
  /** Extra start delay in frames before the scene's own animation begins. */
  delayInFrames: z.number(),
  /**
   * PREVIEW ONLY. When true, renders public/assets/reference-frame.png behind
   * the overlay so you can position elements around the speakers. MUST be false
   * for the final transparent export.
   */
  showReferenceFrame: z.boolean(),
});

export type CommonOverlayProps = z.infer<typeof commonOverlaySchema>;

export const DEFAULT_COMMON: CommonOverlayProps = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  accent: "#F5C518",
  fontScale: 1,
  delayInFrames: 0,
  showReferenceFrame: false,
};
