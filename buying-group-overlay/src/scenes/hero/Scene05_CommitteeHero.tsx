/**
 * Scene05_CommitteeHero — the ALL-OUT editorial version of the buying-committee
 * payoff. Full-screen cutaway (own background) designed to hook attention:
 * living backdrop + halftone figure "cutouts" with offset accent strokes +
 * drawing connectors with traveling pulses + count-up badge + film grain.
 *
 * Full-screen hero (not a transparent overlay) — this is the attention moment
 * you cut TO from the podcast, then cut back.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../../fonts";
import { Backdrop } from "../../components/fx/Backdrop";
import { Grain } from "../../components/fx/Grain";
import { Person } from "../../components/fx/Person";
import { PulseLine } from "../../components/fx/PulseLine";

const ACCENT = "#F5C518";
const CENTER = { x: 960, y: 512 };

const MEMBERS = [
  { role: "cdto", label: "CDTO", sub: "Chief Digital Transformation", x: 960, y: 214 },
  { role: "cfo", label: "CFO", sub: "Finance decision-maker", x: 1452, y: 512 },
  { role: "champion", label: "Champion", sub: "Internal advocate", x: 960, y: 812 },
  { role: "poweruser", label: "Power User", sub: "Daily driver", x: 468, y: 512 },
] as const;

const MemberCard: React.FC<{
  m: (typeof MEMBERS)[number];
  appearAt: number;
}> = ({ m, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - appearAt, fps, config: { damping: 16, stiffness: 130, mass: 0.9 } });
  // Slide from center outward.
  const x = interpolate(e, [0, 1], [CENTER.x, m.x]);
  const y = interpolate(e, [0, 1], [CENTER.y, m.y]);
  const op = interpolate(e, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const float = Math.sin((frame - appearAt) / (fps * 1.6)) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        transform: "translate(-50%, -50%)",
        opacity: op,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 260,
      }}
    >
      <Person role={m.role} size={128} accent={ACCENT} />
      <div
        style={{
          marginTop: 10,
          padding: "10px 22px",
          borderRadius: 999,
          background: "rgba(12,16,22,0.82)",
          border: `1.5px solid ${ACCENT}`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 22px ${ACCENT}44`,
          backdropFilter: "blur(4px)",
          textAlign: "center",
        }}
      >
        <div style={{ color: ACCENT, fontSize: 30, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1 }}>
          {m.label}
        </div>
        <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 16, fontWeight: 500, marginTop: 4 }}>
          {m.sub}
        </div>
      </div>
    </div>
  );
};

export const Scene05_CommitteeHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Whole-scene gentle scale-in.
  const intro = spring({ frame, fps, config: { damping: 22, stiffness: 90, mass: 1 } });
  const sceneScale = interpolate(intro, [0, 1], [1.08, 1]);

  // Kicker.
  const kick = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });

  // Center hub.
  const hub = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 140, mass: 0.9 } });
  const hubScale = interpolate(hub, [0, 1], [0.7, 1]);

  // Count-up 0 -> 4 for the badge.
  const badgeAt = Math.round(fps * 2.6);
  const badgeIn = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 170, mass: 0.8 } });
  const count = Math.round(interpolate(frame, [badgeAt, badgeAt + fps * 0.9], [0, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      <Backdrop accent={ACCENT} />

      <AbsoluteFill style={{ transform: `scale(${sceneScale})` }}>
        {/* Connectors + pulses behind everything */}
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {MEMBERS.map((m, i) => (
            <PulseLine
              key={m.label}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={m.x}
              y2={m.y}
              appearAt={Math.round(fps * (0.55 + i * 0.16))}
              drawFrames={Math.round(fps * 0.4)}
              accent={ACCENT}
            />
          ))}
        </svg>

        {/* Kicker */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 96,
            opacity: interpolate(kick, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(kick, [0, 1], [-24, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 4, background: ACCENT, borderRadius: 2 }} />
            <span style={{ color: ACCENT, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>
              THE BUYING COMMITTEE
            </span>
          </div>
          <div style={{ color: "#fff", fontSize: 40, fontWeight: 800, letterSpacing: -0.8, marginTop: 8 }}>
            Who actually signs off
          </div>
        </div>

        {/* Member cutouts */}
        {MEMBERS.map((m, i) => (
          <MemberCard key={m.label} m={m} appearAt={Math.round(fps * (0.7 + i * 0.16))} />
        ))}

        {/* Center hub */}
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: CENTER.y,
            transform: `translate(-50%,-50%) scale(${hubScale})`,
            opacity: interpolate(hub, [0, 1], [0, 1]),
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "22px 40px",
              borderRadius: 20,
              background: "linear-gradient(180deg, rgba(20,26,34,0.96), rgba(11,15,22,0.96))",
              border: `2px solid ${ACCENT}`,
              boxShadow: `0 22px 60px rgba(0,0,0,0.6), 0 0 44px ${ACCENT}55`,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M6 34 V16 L20 7 L34 16 V34 Z" fill="none" stroke={ACCENT} strokeWidth="2.4" strokeLinejoin="round" />
              <rect x="14" y="22" width="12" height="12" fill={ACCENT} opacity="0.85" />
            </svg>
            <div style={{ color: "#fff", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
              Buying Committee
            </div>
          </div>
        </div>

        {/* Count-up badge */}
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: 992,
            transform: `translate(-50%,0) scale(${interpolate(badgeIn, [0, 1], [0.6, 1])})`,
            opacity: interpolate(badgeIn, [0, 1], [0, 1]),
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 30px",
            borderRadius: 999,
            background: `${ACCENT}1f`,
            border: `2px solid ${ACCENT}`,
            boxShadow: `0 0 34px ${ACCENT}55`,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: ACCENT, fontSize: 40, fontWeight: 900, minWidth: 34, textAlign: "center" }}>
            {count}
          </span>
          <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>
            buying-committee members identified
          </span>
        </div>
      </AbsoluteFill>

      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
