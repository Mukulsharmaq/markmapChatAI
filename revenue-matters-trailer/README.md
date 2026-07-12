# revenue-matters-trailer

Remotion project that produces the trailer motion graphics + logo outro for
the **Revenue Matters** podcast (a Recotap show). See `START-HERE.md` for the
non-technical guide (which clip goes where, how to overlay).

## Compositions

| ID | Output | Duration | What it is |
|---|---|---|---|
| `G1-TargetAccounts` | `clips/1-target-accounts.webm` | 7.5s | "100–125 target accounts" stat card, bottom-left |
| `G2-500DollarPlay` | `clips/2-500-dollar-play.webm` | 8s | Jobs-to-be-done + category-entry-point pills → $500 test-budget stat, bottom-right |
| `G3-StoryQuote` | `clips/3-story-quote.webm` | 6.5s | Closing quote card with gold hot phrase + attribution |
| `Outro-Logo` | `clips/4-logo-outro.webm` | 8s | Full-frame aurora-navy logo sting (opaque) |
| `Preview-*` | `previews/*-PREVIEW.mp4` | — | Same scenes on a placeholder dark background |
| `Preview-FullTrailer` | (studio only) | 52s | All four at their transcript-timed placements |

## Commands

```bash
npm install
npm run dev              # Remotion Studio
npm run typecheck
npm run render:webm      # transparent overlay clips (VP9 + alpha)
npm run render:previews  # dark-background preview MP4s (H.264)
npm run render:all
```

## Brand system implementation notes

- **Colors** (`src/theme.ts`): Recotap Navy `#00204C` base; Signal Gold
  `#E7B53B` as the single accent; extended navies `#0A2C5C`/`#041634`;
  neutrals per the PDF. Magenta is the parent-site CTA colour and is
  deliberately not used here.
- **Backgrounds**: the exact "navy dissolve" and "navy aurora" gradient stacks
  from the *Gradients, glows & motion* page, plus the blueprint grid signature
  on every navy surface. Panels are 100% opaque by design (no frosted glass on
  video — the brief requires the background never to show through).
- **Type**: Archivo Black for hook-scale numbers; Inter stands in for Graphik
  (commercial) at the brand weights 400/500/600/700. Labels are 700 uppercase
  with wide tracking; body/leading follows the type page. Fonts are
  self-hosted in `public/fonts` so renders are offline-deterministic.
- **Motion**: the brand reveal (fade + 28px rise) drives every entrance;
  gentle no-overshoot springs; eased count-ups for stats; nothing under ~0.7s.
- **Logo**: `public/assets/rm-logo-reversed.png` extracted from the brand PDF
  (reversed lockup, preferred on media). Never recoloured, rotated, boxed on
  gold, or stretched.
- **Rendering**: uses the pre-installed Chromium via
  `Config.setBrowserExecutable` (this environment blocks Remotion's headless
  shell download).
