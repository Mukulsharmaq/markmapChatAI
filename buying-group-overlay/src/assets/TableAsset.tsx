/**
 * TableAsset — a 1-frame, transparent composition whose only job is to render
 * the TableIllustration to a PNG:
 *
 *   npx remotion still src/index.ts Asset-Table public/assets/table.png
 *
 * The scene then loads that PNG as its base layer.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { TableIllustration } from "./TableIllustration";

export const TableAsset: React.FC = () => (
  <AbsoluteFill>
    <TableIllustration />
  </AbsoluteFill>
);
