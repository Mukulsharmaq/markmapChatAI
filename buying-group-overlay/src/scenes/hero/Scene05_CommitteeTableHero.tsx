/**
 * Scene05_CommitteeTableHero — the buying committee shown as a LITERAL
 * boardroom table. A light (brand-white) conference table sits in the editorial
 * scene; each committee member (CDTO, CFO, Champion, Power User) rises up from
 * behind the table into their seat, one after another, with a nameplate. This
 * reads instantly as "the group of people who decide."
 *
 * Layering trick: figures are drawn first, then the tabletop is drawn ON TOP so
 * it hides their lower bodies — so they look seated AT the table.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY } from "../../fonts";
import { Backdrop } from "../../components/fx/Backdrop";
import { Grain } from "../../components/fx/Grain";
import { Person } from "../../components/fx/Person";

const ACCENT = "#F5C518";

const SEATS = [
  { role: "poweruser", label: "Power User", x: 560 },
  { role: "cdto", label: "CDTO", x: 840 },
  { role: "cfo", label: "CFO", x: 1100 },
  { role: "champion", label: "Champion", x: 1360 },
] as const;

const SETTLED_TOP = 430;
const PERSON = 220;

const Seat: React.FC<{ seat: (typeof SEATS)[number]; appearAt: number }> = ({ seat, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - appearAt, fps, config: { damping: 15, stiffness: 130, mass: 0.9 } });
  const rise = interpolate(e, [0, 1], [230, 0]);
  const op = interpolate(e, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: seat.x,
        top: SETTLED_TOP + rise,
        transform: "translateX(-50%)",
        opacity: op,
      }}
    >
      {/* Chair back behind the figure */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 30,
          transform: "translateX(-50%)",
          width: 156,
          height: 160,
          borderRadius: "30px 30px 14px 14px",
          background: "linear-gradient(180deg, rgba(40,47,60,0.55), rgba(22,28,38,0.55))",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      />
      <Person role={seat.role} size={PERSON} accent={ACCENT} />
    </div>
  );
};

/** The light conference table, drawn in perspective. */
const Table: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="tableTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#faf8f2" />
        <stop offset="100%" stopColor="#e4ded0" />
      </linearGradient>
      <linearGradient id="tableEdge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cfc7b6" />
        <stop offset="100%" stopColor="#b3ab98" />
      </linearGradient>
      <radialGradient id="tableSheen" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Contact shadow under the table */}
    <ellipse cx="960" cy="840" rx="720" ry="70" fill="rgba(0,0,0,0.5)" />

    {/* Front edge (thickness) */}
    <path d="M360 792 L1560 792 L1560 828 L360 828 Z" fill="url(#tableEdge)" />
    {/* Table top (perspective trapezoid) */}
    <path
      d="M520 636 L1400 636 Q1420 636 1428 650 L1560 792 Q1566 802 1552 802 L368 802 Q354 802 360 792 L492 650 Q500 636 520 636 Z"
      fill="url(#tableTop)"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.5"
    />
    {/* Sheen */}
    <path
      d="M520 636 L1400 636 Q1420 636 1428 650 L1560 792 Q1566 802 1552 802 L368 802 Q354 802 360 792 L492 650 Q500 636 520 636 Z"
      fill="url(#tableSheen)"
      opacity="0.6"
    />
  </svg>
);

export const Scene05_CommitteeTableHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kick = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const bar = interpolate(kick, [0, 1], [0, 56]);

  const badgeAt = Math.round(fps * 3.2);
  const badgeIn = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 170, mass: 0.8 } });
  const count = Math.round(interpolate(frame, [badgeAt, badgeAt + fps], [0, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      <Backdrop accent={ACCENT} />

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

      {/* Figures (behind table) */}
      {SEATS.map((s, i) => (
        <Seat key={s.label} seat={s} appearAt={Math.round(fps * (0.7 + i * 0.45))} />
      ))}

      {/* Table drawn on top to occlude lower bodies */}
      <Table />

      {/* Nameplates sitting on the table in front of each seat */}
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {SEATS.map((s, i) => {
          const at = Math.round(fps * (0.7 + i * 0.45)) + Math.round(fps * 0.5);
          const e = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 150 } });
          const op = interpolate(e, [0, 1], [0, 1]);
          const y = 712;
          // Perspective: nameplates widen slightly toward the front/edges.
          const w = 170;
          return (
            <g key={s.label} opacity={op} transform={`translate(${s.x}, ${y}) scale(${interpolate(e, [0, 1], [0.85, 1])})`}>
              <rect x={-w / 2} y={-24} width={w} height={48} rx={8} fill="rgba(12,16,22,0.92)" stroke={ACCENT} strokeWidth="1.5" />
              <text x={0} y={6} textAnchor="middle" fill={ACCENT} fontSize="24" fontWeight="800" fontFamily={FONT_FAMILY}>
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

      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
