# Boardroom committee composite — retry runbook

The compositing scene + pull pipeline are **already built and committed**. The
only thing missing is the image bytes, because Magnific serves every asset from
`pikaso.cdnpk.net`, which this web environment's egress policy **blocks with a
403**. Do the steps below in a session/machine where that host is allowed.

## 0. Confirm the network is open
```
curl -sI https://pikaso.cdnpk.net/
```
Anything other than a `403 CONNECT tunnel failed` (e.g. a normal HTTP status)
means you're good. If it's still 403, the CDN isn't allowlisted yet — stop.

## 1. Re-pull the boardroom render (already exists in Magnific)
- Creation identifier: **`LUHhAgeswO`** ("modern executive boardroom at dusk", 4K, 16:9).
- Get its fresh signed `url` via the Magnific MCP: `creations_get(LUHhAgeswO)`.
- Paste that `url` into `scripts/magnific-assets.json` under the `boardroom` entry.

## 2. Generate the 5 character cutouts
For each of the five roles, generate a seated/upper-body businessperson, then
strip the background so it composites cleanly:

1. `images_generate` — one per role. Suggested prompts (16:9 or 3:4, keep style
   consistent with the boardroom: dusk, warm gold rim light, navy palette):
   - **Power User** — "young professional wearing a headset, seated at a boardroom table, three-quarter view, warm cinematic rim light, navy tones"
   - **Champion** — "enthusiastic professional gesturing, seated, blazer, three-quarter view, warm cinematic rim light"
   - **Economic Buyer** — "senior executive, authoritative posture, seated at head of table, three-quarter view, warm cinematic rim light"
   - **CDTO** — "professional wearing glasses, thoughtful, seated, three-quarter view, warm cinematic rim light"
   - **CFO** — "formal executive in a suit and tie, seated, three-quarter view, warm cinematic rim light"
   > Tip: pass the boardroom render (`LUHhAgeswO`) as an image reference so the
   > lighting/style matches, and keep one seed family for a consistent cast.
2. `images_remove_background` on each generated cutout → transparent PNG.
3. `creations_get` each transparent cutout → copy its signed `url` into
   `scripts/magnific-assets.json` (`cutout-1`..`cutout-5`), and record the
   `identifier` too.

## 3. Download everything into public/assets/
```
bash scripts/pull-magnific-assets.sh
```
This writes `public/assets/boardroom.png` and `public/assets/cutout-1..5.png`.
It retries transient errors with backoff and fails loudly on a 403.

## 4. Composite + tune in Remotion Studio
```
npm run studio      # open "Hero05-CommitteeBoardroom"
```
- The five cutouts rise into their seats over a slow push-in, with nameplates
  and a count-up badge.
- Every seat is prop-driven — in the right-hand panel adjust each seat's
  `x`, `baselineY`, `height`, and `appearAtSec` so each person lands in a chair.
- Adjust `background` / per-seat `src` if you named files differently.

## 5. Render
Transparent overlay is not needed here (the boardroom IS the background), so
render an opaque clip:
```
npx remotion render src/index.ts Hero05-CommitteeBoardroom out/committee-boardroom.mp4 --codec=h264
```
(or `--codec=prores --prores-profile=4444` for an editing master.)

---
Mapping to the podcast: this is the payoff for the **"buying committee"** beat
(00: "chief digital transformation officer… CFO… three, four buying committee
members") — the same moment `clips/5-buying-committee.webm` covers, but as a
full-screen cinematic cutaway instead of a lower-third overlay.
