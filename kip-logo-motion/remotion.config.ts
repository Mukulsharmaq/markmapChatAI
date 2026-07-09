import { Config } from "@remotion/cli/config";

// PNG frames carry an alpha channel, which the transparent-overlay export
// (ProRes 4444 .mov / VP9 .webm with yuva420p) needs. The opaque end-card
// export (h264 .mp4) simply ignores the alpha. Codec + pixel-format are chosen
// per-render via the npm scripts so this file stays output-agnostic.
Config.setVideoImageFormat("png");
Config.setChromiumOpenGlRenderer("angle");
