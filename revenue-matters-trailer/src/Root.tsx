import React from "react";
import { Composition, Sequence } from "remotion";
import { PreviewBackground } from "./preview/PreviewBackground";
import { G1Stat, G1_DURATION } from "./scenes/G1Stat";
import { G2Play, G2_DURATION } from "./scenes/G2Play";
import { G3Quote, G3_DURATION } from "./scenes/G3Quote";
import { Outro, OUTRO_DURATION } from "./scenes/Outro";
import { FPS, HEIGHT, WIDTH, sec } from "./theme";

/**
 * Transcript-timed placement (trailer audio):
 *   G1  @ 00:00.0 — "typically 100 to 125 per vertical or per market"
 *   G2  @ 00:20.5 — "jobs to be done … budget of like maybe $500"
 *   G3  @ 00:37.5 — "if you are not telling a good story…"
 *   OUT @ 00:44.0 — logo sting into the episode
 */
const PLACEMENT = {
  g2: sec(20.5),
  g3: sec(37.5),
  outro: sec(44),
} as const;

const TrailerPreview: React.FC = () => (
  <PreviewBackground label="full trailer timing">
    <Sequence durationInFrames={G1_DURATION}>
      <G1Stat />
    </Sequence>
    <Sequence from={PLACEMENT.g2} durationInFrames={G2_DURATION}>
      <G2Play />
    </Sequence>
    <Sequence from={PLACEMENT.g3} durationInFrames={G3_DURATION}>
      <G3Quote />
    </Sequence>
    <Sequence from={PLACEMENT.outro} durationInFrames={OUTRO_DURATION}>
      <Outro />
    </Sequence>
  </PreviewBackground>
);

const preview = (label: string, Scene: React.FC): React.FC =>
  function PreviewWrapped() {
    return (
      <PreviewBackground label={label}>
        <Scene />
      </PreviewBackground>
    );
  };

export const RemotionRoot: React.FC = () => {
  const common = { fps: FPS, width: WIDTH, height: HEIGHT };
  return (
    <>
      {/* Transparent overlay clips — render these as .webm */}
      <Composition
        id="G1-TargetAccounts"
        component={G1Stat}
        durationInFrames={G1_DURATION}
        {...common}
      />
      <Composition
        id="G2-500DollarPlay"
        component={G2Play}
        durationInFrames={G2_DURATION}
        {...common}
      />
      <Composition
        id="G3-StoryQuote"
        component={G3Quote}
        durationInFrames={G3_DURATION}
        {...common}
      />
      <Composition
        id="Outro-Logo"
        component={Outro}
        durationInFrames={OUTRO_DURATION}
        {...common}
      />

      {/* Watch-me previews on a dark studio background */}
      <Composition
        id="Preview-G1"
        component={preview("1 · target accounts", G1Stat)}
        durationInFrames={G1_DURATION}
        {...common}
      />
      <Composition
        id="Preview-G2"
        component={preview("2 · the $500 play", G2Play)}
        durationInFrames={G2_DURATION}
        {...common}
      />
      <Composition
        id="Preview-G3"
        component={preview("3 · story quote", G3Quote)}
        durationInFrames={G3_DURATION}
        {...common}
      />
      <Composition
        id="Preview-Outro"
        component={preview("4 · logo outro", Outro)}
        durationInFrames={OUTRO_DURATION}
        {...common}
      />
      <Composition
        id="Preview-FullTrailer"
        component={TrailerPreview}
        durationInFrames={PLACEMENT.outro + OUTRO_DURATION}
        {...common}
      />
    </>
  );
};
