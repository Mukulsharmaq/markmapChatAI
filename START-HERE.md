# START HERE 👋 — your podcast overlay clips

You asked for **motion-graphic overlay videos** for your buying-group-mapping
podcast clip. Here they are, plus exactly where each one goes.

## Where the videos are

```
buying-group-overlay/
├── clips/        ← THE ACTUAL OVERLAYS (transparent .webm) — drag these onto your podcast
└── previews/     ← watch-me .mp4 versions (on a dark background) so you can SEE each one
```

- **`clips/*.webm`** = transparent overlays. They have NO background, so when you
  drop them on top of your podcast, only the graphics show. (In a normal media
  player a transparent file can look blank/checkerboard — that's correct.)
- **`previews/*-PREVIEW.mp4`** = the same graphics on a dark background so you can
  just double-click and watch them. **Do NOT overlay these** — they're only for
  previewing. Overlay the `.webm` files.

## Which clip goes with which moment (your transcript)

| Use? | Clip file | Plays when the audio says… |
|:---:|---|---|
| ✅ | `clips/1-title.webm` | **00:00 – Ganesh's question:** "…the process you follow on buying group mapping… 100 accounts" |
| optional | `clips/2-customer-intel.webm` | "we try to first of all take the **intel from the customer accounts**" |
| ✅ | `clips/3-power-users-champions.webm` | "who are the **power users**, who are the **champions** for Kissflow" |
| ✅ | `clips/4-department-use-cases.webm` | "based on the **use cases we solve for their department**" |
| ✅ | `clips/5-buying-committee.webm` | "one **chief digital transformation officer**… **CFO**… now we know **three, four buying committee members**" |
| optional | `clips/6-validation.webm` | "we go back to the **analyst**… **local experts, SMEs**… **validate**" |

**My recommendation for a 30–40s clip:** use the four ✅ ones (1, 3, 4, 5).
Six would feel too busy. Keep 2 and 6 in your back pocket.

## How to use them (any editor — CapCut / Premiere / DaVinci / CapCut)

1. Put your **podcast video + audio** on the bottom track.
2. Drag the overlay **`.webm`** onto a track **above** it.
3. Slide the overlay so it starts on the matching sentence in the table above.
4. That's it — the graphic sits on top, the rest of the frame stays your podcast.

> If your editor ever shows a **black box instead of transparency**, tell me and
> I'll re-export those clips as **ProRes 4444 .mov** (the other transparent format
> some editors prefer).

## Details

- 1920×1080, 30fps, transparent.
- Everything else (source code, how to tweak text/colors/positions) lives in
  `buying-group-overlay/README.md`. You don't need it to use the clips above.
