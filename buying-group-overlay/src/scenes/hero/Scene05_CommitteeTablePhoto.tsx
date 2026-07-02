/**
 * Scene05_CommitteeTablePhoto — same boardroom-committee idea, but the table is
 * a PRE-RENDERED IMAGE (public/assets/table.png, authored in code + rendered to
 * PNG) used as a base layer, with Remotion animating the people/nameplates on
 * top. This is the "create an image, then layer Remotion onto it" pipeline.
 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../../fonts";
import { Backdrop } from "../../components/fx/Backdrop";
import { Grain } from "../../components/fx/Grain";
import { Person } from "../../components/fx/Person";

const ACCENT = "#F5C518";

// Economic Buyer sits at the head/center (the ultimate sign-off), flanked by
// the rest of the committee.
const SEATS = [
  { role: "poweruser", label: "Power User", x: 540 },
  { role: "champion", label: "Champion", x: 750 },
  { role: "buyer", label: "Economic Buyer", x: 960 },
  { role: "cdto", label: "CDTO", x: 1170 },
  { role: "cfo", label: "CFO", x: 1380 },
] as const;

const SETTLED_TOP = 470;
const PERSON = 188;

const Seat: React.FC<{ seat: (typeof SEATS)[number]; appearAt: number }> = ({ seat, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - appearAt, fps, config: { damping: 15, stiffness: 130, mass: 0.9 } });
  const rise = interpolate(e, [0, 1], [240, 0]);
  const op = interpolate(e, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: seat.x, top: SETTLED_TOP + rise, transform: "translateX(-50%)", opacity: op }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 30,
          transform: "translateX(-50%)",
          width: 138,
          height: 150,
          borderRadius: "28px 28px 12px 12px",
          background: "linear-gradient(180deg, rgba(40,47,60,0.5), rgba(22,28,38,0.5))",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      />
      <Person role={seat.role} size={PERSON} accent={ACCENT} />
    </div>
  );
};

export const Scene05_CommitteeTablePhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const kick = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const bar = interpolate(kick, [0, 1], [0, 56]);

  const badgeAt = Math.round(fps * 3.4);
  const badgeIn = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 170, mass: 0.8 } });
  const count = Math.round(interpolate(frame, [badgeAt, badgeAt + fps], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Slow cinematic push-in toward the table.
  const cam = interpolate(frame, [0, durationInFrames], [1.0, 1.075], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      <Backdrop accent={ACCENT} />

      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "960px 700px" }}>

      {/* Title */}
      <div style={{ position: "absolute", left: 120, top: 96, opacity: interpolate(kick, [0, 1], [0, 1]) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: bar, height: 4, background: ACCENT, borderRadius: 2 }} />
          <span style={{ color: ACCENT, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>THE BUYING COMMITTEE</span>
        </div>
        <div style={{ color: "#fff", fontSize: 46, fontWeight: 800, letterSpacing: -1, marginTop: 8 }}>
          Everyone who has to say yes
        </div>
      </div>

      {/* Figures behind the table */}
      {SEATS.map((s, i) => (
        <Seat key={s.label} seat={s} appearAt={Math.round(fps * (0.7 + i * 0.45))} />
      ))}

      {/* BASE IMAGE: the pre-rendered table PNG, layered on top to occlude bodies */}
      <AbsoluteFill>
        <Img src={staticFile("assets/table.png")} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      {/* Nameplates on the table */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {SEATS.map((s, i) => {
          const at = Math.round(fps * (0.7 + i * 0.45)) + Math.round(fps * 0.5);
          const e = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150 } });
          const op = interpolate(e, [0, 1], [0, 1]);
          const w = Math.max(148, s.label.length * 12.5 + 40);
          return (
            <g key={s.label} opacity={op} transform={`translate(${s.x}, 712) scale(${interpolate(e, [0, 1], [0.85, 1])})`}>
              <rect x={-w / 2} y={-23} width={w} height={46} rx={8} fill="rgba(12,16,22,0.92)" stroke={ACCENT} strokeWidth="1.5" />
              <text x={0} y={6} textAnchor="middle" fill={ACCENT} fontSize="22" fontWeight="800" fontFamily={FONT_FAMILY}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Count-up badge */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 968,
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
        <span style={{ color: ACCENT, fontSize: 38, fontWeight: 900, minWidth: 30, textAlign: "center" }}>{count}</span>
        <span style={{ color: "#fff", fontSize: 27, fontWeight: 700 }}>buying-committee members identified</span>
      </div>

      </AbsoluteFill>

      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
