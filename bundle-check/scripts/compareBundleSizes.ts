import * as fs from "node:fs";
import * as path from "node:path";
import { baselineDir, reportsDir } from "./paths";
import { formatKb, type ISizesFile } from "./sizeUtils";

/**
 * Compares reports/current/sizes.json against the committed baseline/sizes.json.
 * Fails (exit 1) when any scenario's gzip size grows beyond tolerance; shrinks and new
 * scenarios are reported as informational. Run `npm run updateBaseline` to accept changes.
 */

// growth is tolerated up to whichever is larger: 5% of baseline or 5 KB (measurement noise floor)
const GROWTH_TOLERANCE_RATIO = 0.05;
const GROWTH_TOLERANCE_BYTES = 5 * 1024;

const baselinePath = path.join(baselineDir, "sizes.json");
const currentPath = path.join(reportsDir, "current", "sizes.json");

if (!fs.existsSync(currentPath)) {
    console.error("compareSizes: reports/current/sizes.json not found — run snapshotSizes first");
    process.exit(1);
}

if (!fs.existsSync(baselinePath)) {
    console.log("compareSizes: no committed baseline yet — run `npm run updateBaseline` to create it");
    process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8")) as ISizesFile;
const current = JSON.parse(fs.readFileSync(currentPath, "utf8")) as ISizesFile;

const errors: string[] = [];
const notes: string[] = [];

for (const [bundler, scenarios] of Object.entries(current.bundlers)) {
    for (const [scenario, size] of Object.entries(scenarios)) {
        const base = baseline.bundlers[bundler]?.[scenario];
        const key = `${bundler}/${scenario}`;

        if (!base) {
            notes.push(`${key}: new scenario (${formatKb(size.gzipBytes)} KB gzip) — not in baseline`);
            continue;
        }

        const delta = size.gzipBytes - base.gzipBytes;
        const tolerance = Math.max(base.gzipBytes * GROWTH_TOLERANCE_RATIO, GROWTH_TOLERANCE_BYTES);

        if (delta > tolerance) {
            errors.push(
                `${key}: gzip grew ${formatKb(base.gzipBytes)} KB -> ${formatKb(size.gzipBytes)} KB (+${formatKb(delta)} KB, tolerance ${formatKb(tolerance)} KB)`
            );
        } else if (delta < -tolerance) {
            notes.push(`${key}: gzip shrank ${formatKb(base.gzipBytes)} KB -> ${formatKb(size.gzipBytes)} KB`);
        }
    }
}

for (const [bundler, scenarios] of Object.entries(baseline.bundlers)) {
    for (const scenario of Object.keys(scenarios)) {
        if (!current.bundlers[bundler]?.[scenario]) {
            errors.push(`${bundler}/${scenario}: present in baseline but missing from the current build`);
        }
    }
}

notes.forEach(note => console.log(`note: ${note}`));

if (errors.length > 0) {
    console.error(`compareSizes: FAILED with ${errors.length} regression(s):`);
    errors.forEach(message => console.error(`  - ${message}`));
    console.error("If the growth is intended, run `npm run updateBaseline` and commit baseline/sizes.json.");
    process.exit(1);
}

console.log("compareSizes: within tolerance of the committed baseline");
