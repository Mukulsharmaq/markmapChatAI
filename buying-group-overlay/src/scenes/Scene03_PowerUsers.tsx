/**
 * Scene03_PowerUsers — org map: Customer Account -> Power User / Champion /
 * Department Owner. Connectors draw, then child nodes pop in; Power User &
 * Champion get accent highlights. Left-safe placement.
 * Audio moment: "...who are the power users, who are the champions".
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import { commonOverlaySchema, DEFAULT_COMMON } from "../types";
import { OverlayRoot } from "../components/OverlayRoot";
import { Node } from "../components/Node";
import { Connector } from "../components/Connector";
import { PreviewBackground } from "../components/PreviewBackground";
import { SAFE } from "../theme";

export const scene03Schema = commonOverlaySchema.extend({
  rootLabel: z.string(),
  children: z.array(z.object({ label: z.string(), highlight: z.boolean() })),
});

export const scene03Defaults: z.infer<typeof scene03Schema> = {
  ...DEFAULT_COMMON,
  rootLabel: "Customer Account",
  children: [
    { label: "Power User", highlight: true },
    { label: "Champion", highlight: true },
    { label: "Department Owner", highlight: false },
  ],
};

// Layout geometry (within a 700x520 overlay box).
const BOX_W = 880;
const BOX_H = 520;
const CHILD_MARGIN = 150; // horizontal inset for the first/last child center
const ROOT = { x: BOX_W / 2, y: 70 };
const CHILD_Y = 360;

export const Scene03_PowerUsers: React.FC<z.infer<typeof scene03Schema>> = (props) => {
  const { rootLabel, children, accent, fontScale, delayInFrames, showReferenceFrame } = props;
  const { fps } = useVideoConfig();

  const childXs = children.map((_, i) => {
    const span = BOX_W - CHILD_MARGIN * 2;
    const step = children.length > 1 ? span / (children.length - 1) : 0;
    return CHILD_MARGIN + step * i;
  });

  return (
    <>
      <PreviewBackground show={showReferenceFrame} />
      <OverlayRoot {...props}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            padding: `0 0 0 ${SAFE.leftColumnX}px`,
          }}
        >
          <div style={{ position: "relative", width: BOX_W, height: BOX_H }}>
            {/* Connectors behind nodes */}
            <svg
              width={BOX_W}
              height={BOX_H}
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              {childXs.map((cx, i) => (
                <Connector
                  key={i}
                  x1={ROOT.x}
                  y1={ROOT.y + 40}
                  x2={cx}
                  y2={CHILD_Y - 10}
                  appearAt={delayInFrames + Math.round(fps * (0.7 + i * 0.12))}
                  durationInFrames={Math.round(fps * 0.4)}
                />
              ))}
            </svg>

            {/* Root node */}
            <div
              style={{
                position: "absolute",
                left: ROOT.x,
                top: ROOT.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Node
                label={rootLabel}
                appearAt={delayInFrames + Math.round(fps * 0.1)}
                accent={accent}
                fontSize={Math.round(32 * fontScale)}
              />
            </div>

            {/* Child nodes */}
            {children.map((c, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: childXs[i],
                  top: CHILD_Y,
                  transform: "translate(-50%, 0)",
                }}
              >
                <Node
                  label={c.label}
                  appearAt={delayInFrames + Math.round(fps * (1.0 + i * 0.3))}
                  highlight={c.highlight}
                  accent={accent}
                  fontSize={Math.round(28 * fontScale)}
                />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </OverlayRoot>
    </>
  );
};
