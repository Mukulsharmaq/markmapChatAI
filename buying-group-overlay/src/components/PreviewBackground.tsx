/**
 * PreviewBackground — shows a still frame from the podcast BEHIND the overlays,
 * for positioning only. It is gated on a prop that defaults to FALSE and must
 * NEVER be true in the final transparent render.
 *
 * Usage: drop a screenshot at public/assets/reference-frame.png, then toggle
 * `showReferenceFrame` on in Studio to check overlays don't cover faces.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const PreviewBackground: React.FC<{
  show: boolean;
  src?: string;
}> = ({ show, src = "assets/reference-frame.png" }) => {
  if (!show) return null;
  return (
    <AbsoluteFill style={{ zIndex: -1 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};
