import { Config } from "@remotion/cli/config";

// Overlays must be transparent so they can sit on top of podcast footage.
// ProRes 4444 (.mov) and VP8/VP9 (.webm) both support an alpha channel.
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva420p");
Config.setCodec("prores");
Config.setProResProfile("4444");

// Keep concurrency reasonable for overlay-only compositions.
Config.setChromiumOpenGlRenderer("angle");
