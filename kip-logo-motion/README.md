# KIP Logo Motion — Remotion

An animated logo sting for the **Killing Imaginary People** podcast, built from
the supplied `KIP_LogoJuly_2026.ai`. Designed to close a teaser.

## Concept

The logo is a sniper-scope reticle, so the animation plays that beat:
scope powers on → reticle expands from centre → scan line → target lock
(flash + ring pulse) → title wipes in → hold.

All typography and the reticle are the **original artwork**, sliced into two
transparent layers (`public/frame.png` = scope/HUD + metadata, `public/title.png`
= KILLING / Imaginary / PEOPLE) and choreographed — nothing is re-typeset, so
the design is pixel-faithful. `public/full.png` is the flat reference and
`public/reference.png` is the source render.

## Compositions

| ID | Background | Output |
|---|---|---|
| `KipLogo` | opaque brand red `#e50747` | end-card `.mp4` |
| `KipLogoTransparent` | alpha (none) | overlay `.webm` / `.mov` |

Both are 1920×1080, 30 fps, 180 frames (6.0s). The single `background` prop is
the only difference.

## Develop

```bash
npm install
npm run studio          # live preview + scrubbing at http://localhost:3000
```

> Rendering here used the sandbox Chromium. On a normal machine Remotion finds
> its own browser; the `--browser-executable=…headless_shell` flag in the render
> commands below is only needed in restricted environments.

## Render

```bash
npm run render                    # KipLogo -> out/kip-logo-endcard.mp4 (h264)
npm run render:transparent-webm   # KipLogoTransparent -> out/kip-logo-overlay.webm (VP9 + alpha)
npm run render:transparent-mov    # KipLogoTransparent -> out/kip-logo-overlay.mov (ProRes 4444 + alpha)
npm run still                     # single end-frame PNG
```

Transparent codecs need an alpha-capable pixel format — that's why the webm uses
`--pixel-format=yuva420p` and the mov uses ProRes `4444`.

## Tweak guide

All timing/values live in `src/KipLogo.tsx` (frames @30fps) and `src/theme.ts`.

- **Total length / hold:** `DURATION_FRAMES` in `theme.ts` (180 = 6s). Add
  frames to lengthen the final hold.
- **Title reveal speed/timing:** the `titleP` interpolation (`[56, 112]`).
- **Scope power-on speed:** the `revealR` interpolation (`[10, 56]`).
- **Lock flash strength:** the `flash` peak (`0.22`).
- **Glow / vignette (end-card only):** the `glow` value and the two background
  `radial-gradient`s in the `background && (...)` block.
- **Colours:** `BRAND_RED`, `BRAND_RED_DEEP` in `theme.ts` (sampled from the
  source art).

## Regenerating the layers from the `.ai`

The `.ai` is PDF-compatible. The layers in `public/` were produced by rendering
page 1 with pdf.js, keying the flat crimson to transparent, and separating the
title glyphs from the thin reticle lines by local fill-density. If the logo
changes, re-run that extraction and drop the new `frame.png` / `title.png` in
`public/` — the animation code is resolution-independent and needs no changes.
