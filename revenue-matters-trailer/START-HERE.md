# START HERE 👋 — Revenue Matters trailer graphics + logo outro

Three motion graphics and a logo outro for your podcast trailer/teaser, built
with Remotion from the **Revenue Matters Brand System v2.0** (Recotap Navy
`#00204C`, one Signal Gold `#E7B53B` gesture per surface, blueprint grid,
Archivo Black hooks, fade + 28px-rise motion).

Every panel is **fully opaque** — the video never shows through the graphic.
Only the area *around* each panel is transparent, so the clips drop straight
onto your footage.

## Where the files are

```
revenue-matters-trailer/
├── clips/        ← THE ACTUAL OVERLAYS (transparent .webm) — drag these onto your trailer
└── previews/     ← watch-me .mp4 versions (dark background) so you can SEE each one
```

- **`clips/*.webm`** = transparent overlays. In a normal player they can look
  blank/checkerboard — that's correct. Overlay them in your editor.
- **`previews/*-PREVIEW.mp4`** = the same graphics on a placeholder dark
  background. **Do NOT overlay these** — preview only.

## Which clip goes where (timed to your trailer transcript)

| # | Clip file | Start it at | Plays over the audio… | Where it sits on screen |
|---|---|---|---|---|
| 1 | `clips/1-target-accounts.webm` | **00:00** | Raja: "typically **100 to 125 per vertical or per market**… that is where we start" | bottom-left card |
| 2 | `clips/2-500-dollar-play.webm` | **00:20.5** | "…**jobs to be done** and the **category entry point**… we take a budget of like maybe **$500**… a sizable audience within that subsegment" | bottom-right card |
| 3 | `clips/3-story-quote.webm` | **00:37.5** | Raja: "**If you are not telling a good story, no one is going to buy from you.**" | bottom-center quote band |
| 4 | `clips/4-logo-outro.webm` | **~00:44** (end of trailer) | Logo sting → cut into the episode | full frame (covers everything) |

Why these three moments: the trailer opens on a number (a stat card earns the
first 7 seconds), the $500 play is the concrete, repeatable insight in the
middle, and the story line is the emotional closer that hands off to the logo.

Timing details:
- Clip 2's **$500 counts up ~2.5s into the clip**, right as Raja says it —
  keep the clip start at 00:20.5 for the sync to land.
- Clip 4 fades itself up from transparent over the first half-second, so it
  blends smoothly over your final shot, holds the lockup, and ends on a stable
  frame you can cut from. It's full-frame and opaque once faded in.

## How to use them (CapCut / Premiere / DaVinci / FCP)

1. Put your **trailer video + audio** on the bottom track.
2. Drag each overlay **`.webm`** onto a track **above** it.
3. Slide each overlay so it starts at the timestamp in the table above.
4. Done — graphics sit on top, the rest of the frame stays your footage.

> If your editor shows a **black box instead of transparency**, tell me and
> I'll re-export as **ProRes 4444 .mov** instead.

## Tweaks

Everything (copy, colors, sizes, positions, timings) lives in
`src/scenes/*.tsx` + `src/theme.ts`. Run `npm i && npm run dev` for the live
Remotion Studio, `npm run render:all` to re-export. There's also a
`Preview-FullTrailer` composition in the Studio that plays all four clips at
their transcript-timed positions.

- 1920×1080 · 30fps · VP9 with alpha (`yuva420p`)
- Logo artwork extracted from the brand PDF (reversed lockup — the version
  the brand book prefers on media)
