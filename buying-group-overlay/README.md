# Buying Group Overlay — transparent Remotion motion graphics for a podcast clip

Transparent overlay motion graphics for a ~30–40s Riverside podcast clip about
**buying group mapping**. This project renders **overlay clips only** — no
background, no audio. You place them on top of the podcast footage in your video
editor (Premiere / DaVinci / Final Cut / CapCut).

- **Format:** 1920×1080, 30 fps, transparent (alpha) export
- **Style:** premium B2B SaaS — dark translucent cards, thin white connector
  lines, one accent color, clean Inter typography, subtle spring animations
- **Six scenes**, each also renderable on its own so you can drop them in
  manually where they fit the narration.

---

## The story the overlays tell

> Buying group mapping starts by interviewing customers, finding power users and
> champions, identifying department-level use cases, then validating the buying
> committee with analysts, local experts, and SMEs.

| # | Scene | Audio moment | Visual |
|---|-------|--------------|--------|
| 1 | `Scene01_Title` | Ganesh asks about buying group mapping | Title + 10×10 account grid |
| 2 | `Scene02_CustomerIntel` | "intel from customer accounts" | Customer account cards slide in |
| 3 | `Scene03_PowerUsers` | "power users, champions" | Org map reveals |
| 4 | `Scene04_Departments` | "use cases … for their department" | Department use-case cards |
| 5 | `Scene05_Committee` | "CDTO … CFO … 3–4 members" | Buying committee map (payoff) |
| 6 | `Scene06_Validation` | "analysts, local experts, SMEs" | Validation checks + "Validated" |

> **Editing tip (important):** In a 30–40s clip, don't use all six. Use scenes
> **1, 3, 4, 5** for a clean result. Build six, ship four.

---

## Quick start

```bash
cd buying-group-overlay
npm install
npm run dev          # opens Remotion Studio
```

In Studio you'll see the master `BuyingGroupOverlay` composition and each scene
on its own. The right-hand panel exposes live controls for every scene.

---

## Editable controls (live in Studio)

Every scene shares these props (right panel), so you can reposition around the
speakers without touching code:

| Prop | Meaning |
|------|---------|
| `x`, `y` | Nudge the whole overlay (px) |
| `scale` | Uniform scale |
| `opacity` | Master opacity |
| `accent` | Accent color (hex) — swap once to re-brand |
| `fontScale` | Font size multiplier |
| `delayInFrames` | Delay the scene's animation |
| `showReferenceFrame` | **Preview only** — show a podcast still behind the overlay |

Scene-specific text/labels (titles, node names, department use-cases, badges)
are also props with sensible defaults — edit them live or in each scene's
`*Defaults` export. Global colors, fonts, spacing, safe areas, spring feel, and
the master timeline all live in [`src/theme.ts`](src/theme.ts).

---

## Positioning around the speakers (Step 12)

1. Export one still frame from your Riverside clip.
2. Save it as `public/assets/reference-frame.png`.
3. In Studio, set `showReferenceFrame = true` on a scene to preview overlays on
   top of the real frame; nudge `x` / `y` / `scale` until faces are clear.
4. Set it back to `false` before rendering (all render scripts already keep it
   false, and the file is git-ignored).

Overlays are pre-placed in safe zones (lower-third, left column, or centered/low)
but every frame is different — always verify against your own still.

---

## Rendering transparent clips

Two workflows — **Option B (per-scene) is recommended** for manual overlaying.

### Option A — one master clip

```bash
npm run render:master        # ProRes 4444 .mov (best alpha, larger files)
npm run render:master-webm   # VP8 .webm with alpha (smaller)
```

### Option B — each scene separately (recommended)

```bash
npm run render:all-scenes    # renders scene01…scene06 as ProRes 4444 .mov
# or individually:
npm run render:scene05       # just the committee payoff
```

Outputs land in `out/`. Raw commands (equivalent):

```bash
npx remotion render src/index.ts Scene05-Committee out/scene05-committee.mov \
  --codec=prores --prores-profile=4444
# WebM alpha alternative:
npx remotion render src/index.ts Scene05-Committee out/scene05-committee.webm \
  --codec=vp8 --pixel-format=yuva420p
```

> Composition IDs use hyphens (`Scene05-Committee`), not underscores — Remotion
> only allows `a-z A-Z 0-9 -` in IDs. The component/file names keep the
> `Scene05_Committee` form.

Use **ProRes 4444 .mov** if your editor supports it (safest alpha). Use
**WebM (vp8, yuva420p)** for lighter web-friendly files.

---

## Assembling in your editor

```
V3: captions / subtitles      ← keyword highlights only (add here, not in Remotion)
V2: Remotion overlays (.mov)  ← this project, muted
V1: podcast video
A1: podcast audio
```

- Align each overlay clip to its narration line; trim to taste.
- Add a tiny extra fade if a cut feels abrupt.
- Subtitle only key words (buying group mapping, power users, champions, CDTO,
  CFO, buying committee, validated) — don't bake subtitles into the overlays.

---

## Retiming

Edit the seconds in `SCENE_TIMING` (and `MASTER_DURATION_SECONDS`) in
`src/theme.ts`. The master sequence and each standalone scene's duration both
derive from it, so one edit retimes everything consistently.

## Project structure

```
src/
  theme.ts            # colors, fonts, safe areas, spring, master timeline
  types.ts            # shared editable prop schema (Zod)
  fonts.ts            # Inter via @remotion/google-fonts
  components/         # OverlayRoot, OverlayCard, Node, Connector, AccountGrid,
                      #   Checkmark, PreviewBackground
  scenes/             # Scene01_Title … Scene06_Validation
  OverlaySequence.tsx # master 55s timeline with cross-fades
  Root.tsx            # registers master + per-scene compositions
  index.ts
```
