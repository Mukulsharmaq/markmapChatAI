import { Config } from "@remotion/cli/config";

// Overlays must be transparent so they can sit on top of podcast footage.
// We render PNG frames (which carry alpha); the codec/pixel-format that keep
// that alpha channel are chosen per-render via the npm scripts / CLI flags
// (ProRes 4444 for .mov, VP8/VP9 with yuva420p for .webm). We intentionally do
// NOT pin a codec or ProRes profile here so those flags fully control output.
Config.setVideoImageFormat("png");

// Keep concurrency reasonable for overlay-only compositions.
Config.setChromiumOpenGlRenderer("angle");
