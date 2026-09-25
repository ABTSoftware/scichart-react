import * as path from "node:path";

/** Absolute path of the bundle-check harness root. */
export const harnessRoot = path.resolve(__dirname, "..");

/** Bundler output root: dist/<bundler>/<scenario>/ */
export const distDir = path.join(harnessRoot, "dist");

/** Generated (untracked) reports: reports/current/sizes.{json,md} */
export const reportsDir = path.join(harnessRoot, "reports");

/** Committed baseline snapshot dir. */
export const baselineDir = path.join(harnessRoot, "baseline");

/** Resolve a harness-root-relative path. */
export const fromRoot = (...segments: string[]): string => path.join(harnessRoot, ...segments);
