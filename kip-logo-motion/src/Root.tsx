import React from "react";
import { Composition } from "remotion";
import { KipLogo } from "./KipLogo";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Opaque branded end-card (red background) — the hero deliverable. */}
      <Composition
        id="KipLogo"
        component={KipLogo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ background: true }}
      />
      {/* Transparent version — white artwork on alpha, to overlay on footage. */}
      <Composition
        id="KipLogoTransparent"
        component={KipLogo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ background: false }}
      />
    </>
  );
};
