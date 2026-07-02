/**
 * Scene05_CommitteeBoardroom — the "real render" version of the committee hero.
 *
 * Base layer  : the Magnific-generated cinematic boardroom render
 *               (public/assets/boardroom.png).
 * People layer: five TRANSPARENT character cutouts (public/assets/cutout-1..5.png),
 *               generated in Magnific and background-removed, seated around the
 *               table with a rise-in animation, contact shadow, nameplate, and a
 *               final count-up badge — over a slow cinematic push-in.
 *
 * Every seat's position/scale is prop-driven (see `committeeBoardroomSchema`) so
 * you can nudge each person into their chair live in Remotion Studio's right-hand
 * panel once the real render + cutouts are in place — no code edits needed.
 *
 * ── How the assets get here (run in a session where pikaso.cdnpk.net is allowed)
 *   1. Boardroom render already exists in Magnific (identifier LUHhAgeswO).
 *   2. Generate 5 cutouts, then images_remove_background each → transparent PNGs.
 *   3. Fill scripts/magnific-assets.json with the fresh signed URLs and run
 *      `bash scripts/pull-magnific-assets.sh` → drops them in public/assets/.
 *   See RETRY-RUNBOOK.md for the copy-paste steps.
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { FONT_FAMILY } from "../../fonts";
import { Grain } from "../../components/fx/Grain";

const ACCENT = "#F5C518";

const seatSchema = z.object({
  /** transparent cutout PNG under public/assets/ */
  src: z.string(),
  label: z.string(),
  /** horizontal center of the seat, in 1920-wide space */
  x: z.number(),
  /** vertical anchor for the BOTTOM of the cutout, in 1080-tall space */
  baselineY: z.number(),
  /** rendered height of the cutout in px */
  height: z.number(),
  /** stagger: seconds after scene start this seat rises in */
  appearAtSec: z.number(),
});

export const committeeBoardroomSchema = z.object({
  /** base boardroom render (opaque) under public/assets/ */
  background: z.string(),
  seats: z.array(seatSchema),
  showTitle: z.boolean(),
  showBadge: z.boolean(),
});

export type CommitteeBoardroomProps = z.infer<typeof committeeBoardroomSchema>;

/**
 * Defaults spread the five committee members across the lower-center of the
 * frame. These are STARTING points — tune each seat's x / baselineY / height in
 * Studio so every person lands in a chair once the real render is loaded.
 */
export const committeeBoardroomDefaults: CommitteeBoardroomProps = {
  background: "assets/boardroom.png",
  showTitle: true,
  showBadge: true,
  seats: [
    { src: "assets/cutout-1.png", label: "Power User", x: 470, baselineY: 940, height: 360, appearAtSec: 0.7 },
    { src: "assets/cutout-2.png", label: "Champion", x: 720, baselineY: 985, height: 400, appearAtSec: 1.15 },
    { src: "assets/cutout-3.png", label: "Economic Buyer", x: 960, baselineY: 1010, height: 430, appearAtSec: 1.6 },
    { src: "assets/cutout-4.png", label: "CDTO", x: 1200, baselineY: 985, height: 400, appearAtSec: 2.05 },
    { src: "assets/cutout-5.png", label: "CFO", x: 1450, baselineY: 940, height: 360, appearAtSec: 2.5 },
  ],
};

const Seat: React.FC<{ seat: CommitteeBoardroomProps["seats"][number] }> = ({ seat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appearAt = Math.round(seat.appearAtSec * fps);
  const e = spring({ frame: frame - appearAt, fps, config: { damping: 16, stiffness: 130, mass: 0.9 } });
  const rise = interpolate(e, [0, 1], [180, 0]);
  const op = interpolate(e, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const width = seat.height * 0.62; // cutout aspect placeholder; object-fit keeps ratio

  // Nameplate lands a beat after the person settles.
  const plateAt = appearAt + Math.round(fps * 0.45);
  const pe = spring({ frame: frame - plateAt, fps, config: { damping: 16, stiffness: 150 } });
  const plateOp = interpolate(pe, [0, 1], [0, 1]);
  const plateW = Math.max(150, seat.label.length * 12.5 + 44);

  return (
    <div style={{ position: "absolute", left: seat.x, top: 0, transform: "translateX(-50%)", opacity: op }}>
      {/* contact shadow grounds the cutout on the table/floor */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: seat.baselineY + rise - 14,
          transform: "translateX(-50%)",
          width: width * 0.9,
          height: 34,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.45)",
          filter: "blur(12px)",
        }}
      />
      {/* the transparent character cutout, anchored by its bottom edge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: seat.baselineY + rise - seat.height,
          transform: "translateX(-50%)",
          width,
          height: seat.height,
        }}
      >
        <Img
          src={staticFile(seat.src)}
          style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center" }}
        />
      </div>
      {/* nameplate */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: seat.baselineY + rise + 26,
          transform: `translateX(-50%) scale(${interpolate(pe, [0, 1], [0.85, 1])})`,
          opacity: plateOp,
          width: plateW,
          padding: "9px 0",
          textAlign: "center",
          borderRadius: 9,
          background: "rgba(12,16,22,0.92)",
          border: `1.5px solid ${ACCENT}`,
          color: ACCENT,
          fontSize: 21,
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        {seat.label}
      </div>
    </div>
  );
};

export const Scene05_CommitteeBoardroom: React.FC<CommitteeBoardroomProps> = ({
  background,
  seats,
  showTitle,
  showBadge,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const kick = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const bar = interpolate(kick, [0, 1], [0, 56]);

  const badgeAt = Math.round(fps * 3.4);
  const badgeIn = spring({ frame: frame - badgeAt, fps, config: { damping: 12, stiffness: 170, mass: 0.8 } });
  const count = Math.round(
    interpolate(frame, [badgeAt, badgeAt + fps], [0, seats.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // Slow cinematic push-in toward the table.
  const cam = interpolate(frame, [0, durationInFrames], [1.0, 1.075], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY, backgroundColor: "#0b0f16" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "960px 640px" }}>
        {/* BASE: Magnific boardroom render, full-bleed */}
        <Img src={staticFile(background)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {/* readability scrim so white nameplates/title pop off the render */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(6,9,14,0.55) 0%, rgba(6,9,14,0.0) 26%, rgba(6,9,14,0.0) 58%, rgba(6,9,14,0.6) 100%)",
          }}
        />

        {/* Title */}
        {showTitle && (
          <div style={{ position: "absolute", left: 120, top: 96, opacity: interpolate(kick, [0, 1], [0, 1]) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: bar, height: 4, background: ACCENT, borderRadius: 2 }} />
              <span style={{ color: ACCENT, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>
                THE BUYING COMMITTEE
              </span>
            </div>
            <div style={{ color: "#fff", fontSize: 46, fontWeight: 800, letterSpacing: -1, marginTop: 8 }}>
              Everyone who has to say yes
            </div>
          </div>
        )}

        {/* People */}
        {seats.map((s) => (
          <Seat key={s.label} seat={s} />
        ))}

        {/* Count-up badge */}
        {showBadge && (
          <div
            style={{
              position: "absolute",
              left: 960,
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
            <span style={{ color: ACCENT, fontSize: 38, fontWeight: 900, minWidth: 30, textAlign: "center" }}>
              {count}
            </span>
            <span style={{ color: "#fff", fontSize: 27, fontWeight: 700 }}>
              buying-committee members identified
            </span>
          </div>
        )}
      </AbsoluteFill>

      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
