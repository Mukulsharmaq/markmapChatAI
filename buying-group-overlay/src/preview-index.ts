import { registerRoot } from "remotion";
import { PreviewRoot } from "./preview/PreviewRoot";

// Preview-only entry (dark-background MP4s). Not the product; see src/index.ts.
registerRoot(PreviewRoot);
