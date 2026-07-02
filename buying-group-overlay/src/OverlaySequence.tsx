/**
 * OverlaySequence — stitches all six scenes onto one 55s / 30fps transparent
 * timeline using SCENE_TIMING from theme.ts. Each scene fades in at its head and
 * out at its tail so they never hard-cut on top of the podcast.
 *
 * This is the "BuyingGroupOverlay" master composition. For manual overlay work
 * you can instead render each scene composition on its own (see Root.tsx).
 */
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "./types";
import { FADE_SECONDS, SCENE_TIMING, sec } from "./theme";

import { Scene01_Title, scene01Defaults } from "./scenes/Scene01_Title";
import { Scene02_CustomerIntel, scene02Defaults } from "./scenes/Scene02_CustomerIntel";
import { Scene03_PowerUsers, scene03Defaults } from "./scenes/Scene03_PowerUsers";
import { Scene04_Departments, scene04Defaults } from "./scenes/Scene04_Departments";
import { Scene05_Committee, scene05Defaults } from "./scenes/Scene05_Committee";
import { Scene06_Validation, scene06Defaults } from "./scenes/Scene06_Validation";

export const overlaySequenceSchema = commonOverlaySchema.pick({
  showReferenceFrame: true,
});

export const overlaySequenceDefaults: z.infer<typeof overlaySequenceSchema> = {
  showReferenceFrame: DEFAULT_COMMON.showReferenceFrame,
};

/** Fades the child in/out at the edges of its own sequence window. */
const FadeWrap: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = Math.round(FADE_SECONDS * fps);
  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

type SceneEntry = {
  key: keyof typeof SCENE_TIMING;
  Comp: React.FC<any>;
  props: Record<string, unknown>;
};

const SCENES: SceneEntry[] = [
  { key: "Scene01_Title", Comp: Scene01_Title, props: scene01Defaults },
  { key: "Scene02_CustomerIntel", Comp: Scene02_CustomerIntel, props: scene02Defaults },
  { key: "Scene03_PowerUsers", Comp: Scene03_PowerUsers, props: scene03Defaults },
  { key: "Scene04_Departments", Comp: Scene04_Departments, props: scene04Defaults },
  { key: "Scene05_Committee", Comp: Scene05_Committee, props: scene05Defaults },
  { key: "Scene06_Validation", Comp: Scene06_Validation, props: scene06Defaults },
];

export const OverlaySequence: React.FC<z.infer<typeof overlaySequenceSchema>> = ({
  showReferenceFrame,
}) => {
  return (
    <AbsoluteFill>
      {SCENES.map(({ key, Comp, props }) => {
        const timing = SCENE_TIMING[key];
        const from = sec(timing.from);
        const durationInFrames = sec(timing.to) - from;
        return (
          <Sequence key={key} from={from} durationInFrames={durationInFrames} name={key}>
            <FadeWrap durationInFrames={durationInFrames}>
              <Comp {...props} showReferenceFrame={showReferenceFrame} />
            </FadeWrap>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
