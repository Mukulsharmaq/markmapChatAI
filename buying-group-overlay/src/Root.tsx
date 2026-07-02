/**
 * Root.tsx — registers every composition.
 *
 * - "BuyingGroupOverlay" is the full 55s master (all six scenes sequenced).
 * - Each scene is ALSO registered as its own composition so you can render it
 *   independently as a transparent MOV and place it manually in your editor
 *   (the recommended workflow — see README Step 13, Option B).
 *
 * No composition sets a background, so all exports carry an alpha channel.
 */
import React from "react";
import { Composition } from "remotion";
import { FPS, HEIGHT, MASTER_DURATION_SECONDS, SCENE_TIMING, WIDTH, sec } from "./theme";

import { OverlaySequence, overlaySequenceSchema, overlaySequenceDefaults } from "./OverlaySequence";
import { Scene01_Title, scene01Schema, scene01Defaults } from "./scenes/Scene01_Title";
import { Scene02_CustomerIntel, scene02Schema, scene02Defaults } from "./scenes/Scene02_CustomerIntel";
import { Scene03_PowerUsers, scene03Schema, scene03Defaults } from "./scenes/Scene03_PowerUsers";
import { Scene04_Departments, scene04Schema, scene04Defaults } from "./scenes/Scene04_Departments";
import { Scene05_Committee, scene05Schema, scene05Defaults } from "./scenes/Scene05_Committee";
import { Scene06_Validation, scene06Schema, scene06Defaults } from "./scenes/Scene06_Validation";

const dur = (k: keyof typeof SCENE_TIMING) => sec(SCENE_TIMING[k].to) - sec(SCENE_TIMING[k].from);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master timeline: all six scenes, sequenced + cross-faded */}
      <Composition
        id="BuyingGroupOverlay"
        component={OverlaySequence}
        durationInFrames={sec(MASTER_DURATION_SECONDS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={overlaySequenceSchema}
        defaultProps={overlaySequenceDefaults}
      />

      {/* Standalone scenes — render each as its own transparent clip */}
      <Composition
        id="Scene01-Title"
        component={Scene01_Title}
        durationInFrames={dur("Scene01_Title")}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={scene01Schema}
        defaultProps={scene01Defaults}
      />
      <Composition
        id="Scene02-CustomerIntel"
        component={Scene02_CustomerIntel}
        durationInFrames={dur("Scene02_CustomerIntel")}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={scene02Schema}
        defaultProps={scene02Defaults}
      />
      <Composition
        id="Scene03-PowerUsers"
        component={Scene03_PowerUsers}
        durationInFrames={dur("Scene03_PowerUsers")}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={scene03Schema}
        defaultProps={scene03Defaults}
      />
      <Composition
        id="Scene04-Departments"
        component={Scene04_Departments}
        durationInFrames={dur("Scene04_Departments")}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={scene04Schema}
        defaultProps={scene04Defaults}
      />
      <Composition
        id="Scene05-Committee"
        component={Scene05_Committee}
        durationInFrames={dur("Scene05_Committee")}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={scene05Schema}
        defaultProps={scene05Defaults}
      />
      <Composition
        id="Scene06-Validation"
        component={Scene06_Validation}
        durationInFrames={dur("Scene06_Validation")}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={scene06Schema}
        defaultProps={scene06Defaults}
      />
    </>
  );
};
