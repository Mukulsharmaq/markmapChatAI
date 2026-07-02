# public/assets

Drop your podcast reference still here as **`reference-frame.png`**.

Then in Remotion Studio, flip the `showReferenceFrame` prop to `true` on any
scene (right-hand props panel) to preview the overlay *on top of* a real podcast
frame — so you can nudge x / y / scale until nothing covers Ganesh's or Raja's
face.

The reference frame is **never** part of the transparent export: it only renders
when `showReferenceFrame` is true, and every render script keeps it false.

Other subfolders (`fonts/`, `icons/`, `textures/`) are optional — the project
uses the Inter webfont via `@remotion/google-fonts`, so no local font files are
required to render.
