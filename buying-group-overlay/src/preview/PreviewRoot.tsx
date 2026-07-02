/**
 * PreviewRoot — SEPARATE, non-product entry used only to render watchable
 * preview MP4s (each overlay scene composited on a dark background, so you can
 * play them in any normal video player and judge the animation/quality).
 *
 * These are NOT the deliverable. The deliverable is the transparent .webm
 * clips rendered from src/index.ts. Rendered via: src/preview-index.ts
 */
import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { FPS, HEIGHT, SCENE_TIMING, WIDTH, sec } from "../theme";

import { Scene01_Title, scene01Defaults } from "../scenes/Scene01_Title";
import { Scene02_CustomerIntel, scene02Defaults } from "../scenes/Scene02_CustomerIntel";
import { Scene03_PowerUsers, scene03Defaults } from "../scenes/Scene03_PowerUsers";
import { Scene04_Departments, scene04Defaults } from "../scenes/Scene04_Departments";
import { Scene05_Committee, scene05Defaults } from "../scenes/Scene05_Committee";
import { Scene06_Validation, scene06Defaults } from "../scenes/Scene06_Validation";

const DARK = "#141a1f";

/** Wraps a scene with a solid dark backdrop (simulates dark podcast footage). */
const onDark =
  (Comp: React.FC<any>, props: Record<string, unknown>): React.FC =>
  () =>
    (
      <AbsoluteFill style={{ backgroundColor: DARK }}>
        <Comp {...props} />
      </AbsoluteFill>
    );

const dur = (k: keyof typeof SCENE_TIMING) =>
  sec(SCENE_TIMING[k].to) - sec(SCENE_TIMING[k].from);

export const PreviewRoot: React.FC = () => (
  <>
    <Composition id="Preview01-Title" component={onDark(Scene01_Title, scene01Defaults)} durationInFrames={dur("Scene01_Title")} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Preview02-CustomerIntel" component={onDark(Scene02_CustomerIntel, scene02Defaults)} durationInFrames={dur("Scene02_CustomerIntel")} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Preview03-PowerUsers" component={onDark(Scene03_PowerUsers, scene03Defaults)} durationInFrames={dur("Scene03_PowerUsers")} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Preview04-Departments" component={onDark(Scene04_Departments, scene04Defaults)} durationInFrames={dur("Scene04_Departments")} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Preview05-Committee" component={onDark(Scene05_Committee, scene05Defaults)} durationInFrames={dur("Scene05_Committee")} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="Preview06-Validation" component={onDark(Scene06_Validation, scene06Defaults)} durationInFrames={dur("Scene06_Validation")} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
