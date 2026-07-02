/**
 * Scene01_TitleHero — full-screen opening hook. Editorial title on the left,
 * a large glowing "100 accounts" grid on the right with a scanning target that
 * locks onto the few real target accounts. Living backdrop + grain.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../../fonts";
import { Backdrop } from "../../components/fx/Backdrop";
import { Grain } from "../../components/fx/Grain";

const ACCENT = "#F5C518";
const SELECTED = new Set([23, 46, 68]); // accounts that "light up"

const GRID = { cols: 10, rows: 10, cell: 34, gap: 12, cx: 1360, cy: 540 };

const HeroGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = GRID.cols * GRID.rows;
  const w = GRID.cols * GRID.cell + (GRID.cols - 1) * GRID.gap;
  const h = GRID.rows * GRID.cell + (GRID.rows - 1) * GRID.gap;
  const originX = GRID.cx - w / 2;
  const originY = GRID.cy - h / 2;

  // Scanning target ring travels to the selected accounts one by one.
  const seq = [23, 46, 68];
  const step = Math.floor(interpolate(frame, [fps * 1.0, fps * 3.4], [0, seq.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const targetIdx = seq[Math.min(step, seq.length - 1)];
  const tCol = targetIdx % GRID.cols;
  const tRow = Math.floor(targetIdx / GRID.cols);
  const targetX = originX + tCol * (GRID.cell + GRID.gap) + GRID.cell / 2;
  const targetY = originY + tRow * (GRID.cell + GRID.gap) + GRID.cell / 2;

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: total }).map((_, i) => {
        const col = i % GRID.cols;
        const row = Math.floor(i / GRID.cols);
        const x = originX + col * (GRID.cell + GRID.gap);
        const y = originY + row * (GRID.cell + GRID.gap);
        const isSel = SELECTED.has(i);
        const appear = spring({
          frame: frame - fps * 0.3 - (col + row) * 1.1,
          fps,
          config: { damping: 20, stiffness: 120, mass: 0.6 },
        });
        const baseOp = interpolate(appear, [0, 1], [0, isSel ? 1 : 0.22]);
        const pulse = isSel ? 0.55 + 0.45 * Math.sin(frame / (fps * 0.5) + i) : 1;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={GRID.cell}
            height={GRID.cell}
            rx={7}
            fill={isSel ? ACCENT : "rgba(255,255,255,0.14)"}
            stroke={isSel ? ACCENT : "rgba(255,255,255,0.08)"}
            strokeWidth={1}
            opacity={isSel ? baseOp * pulse : baseOp}
            style={isSel ? { filter: `drop-shadow(0 0 10px ${ACCENT})` } : undefined}
          />
        );
      })}
      {/* Scanning target crosshair */}
      {frame > fps * 0.9 && (
        <g style={{ transition: "none" }}>
          <rect
            x={targetX - 28}
            y={targetY - 28}
            width={56}
            height={56}
            rx={10}
            fill="none"
            stroke={ACCENT}
            strokeWidth={3}
            opacity={0.9}
          />
          <line x1={targetX - 40} y1={targetY} x2={targetX - 30} y2={targetY} stroke={ACCENT} strokeWidth={2} />
          <line x1={targetX + 30} y1={targetY} x2={targetX + 40} y2={targetY} stroke={ACCENT} strokeWidth={2} />
          <line x1={targetX} y1={targetY - 40} x2={targetX} y2={targetY - 30} stroke={ACCENT} strokeWidth={2} />
          <line x1={targetX} y1={targetY + 30} x2={targetX} y2={targetY + 40} stroke={ACCENT} strokeWidth={2} />
        </g>
      )}
    </svg>
  );
};

export const Scene01_TitleHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kick = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const title = spring({ frame: frame - 12, fps, config: { damping: 20, stiffness: 110, mass: 1 } });
  const sub = spring({ frame: frame - 22, fps, config: { damping: 20, stiffness: 120 } });

  const titleY = interpolate(title, [0, 1], [46, 0]);
  const bar = interpolate(kick, [0, 1], [0, 64]);

  // "100" count up.
  const count = Math.round(interpolate(frame, [fps * 0.4, fps * 1.4], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      <Backdrop accent={ACCENT} />

      <HeroGrid />

      {/* Left title block */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 0 0 120px" }}>
        <div style={{ maxWidth: 900 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: interpolate(kick, [0, 1], [0, 1]),
            }}
          >
            <div style={{ width: bar, height: 5, background: ACCENT, borderRadius: 3 }} />
            <span style={{ color: ACCENT, fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
              GTM PLAYBOOK
            </span>
          </div>

          <div
            style={{
              marginTop: 22,
              transform: `translateY(${titleY}px)`,
              opacity: interpolate(title, [0, 1], [0, 1]),
              color: "#fff",
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 0.98,
              textShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            Buying Group
            <br />
            Mapping
          </div>

          <div
            style={{
              marginTop: 26,
              opacity: interpolate(sub, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(sub, [0, 1], [16, 0])}px)`,
              color: "rgba(255,255,255,0.72)",
              fontSize: 34,
              fontWeight: 500,
            }}
          >
            Finding the{" "}
            <span style={{ color: ACCENT, fontWeight: 700 }}>real committee</span> inside{" "}
            <span style={{ color: "#fff", fontWeight: 800 }}>{count}</span> accounts
          </div>
        </div>
      </AbsoluteFill>

      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
