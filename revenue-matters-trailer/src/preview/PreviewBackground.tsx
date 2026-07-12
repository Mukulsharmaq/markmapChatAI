/**
 * PreviewBackground — a neutral dark studio backdrop used ONLY for the
 * watch-me MP4 previews, standing in for the podcast footage. It is
 * deliberately NOT brand navy, so you can judge how the navy panels separate
 * from a busy dark video frame. Never overlay the preview files.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND_FONT, WEIGHT } from "../fonts";

export const PreviewBackground: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(85% 70% at 50% 30%, #3a3f47 0%, #23262b 55%, #141619 100%)",
        }}
      />
      {/* Faux speaker glow spots to suggest a two-up podcast frame */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(24% 38% at 26% 42%, rgba(216,180,140,0.10), transparent 70%), radial-gradient(24% 38% at 74% 42%, rgba(150,180,216,0.10), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 36,
          fontFamily: BRAND_FONT,
          fontWeight: WEIGHT.semibold,
          fontSize: 22,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.32)",
        }}
      >
        preview · {label} — overlay the .webm, not this file
      </div>
      {children}
    </AbsoluteFill>
  );
};
