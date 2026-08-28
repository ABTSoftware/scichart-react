import * as fs from "node:fs";
import * as path from "node:path";
import { baselineDir, reportsDir } from "./paths";

/** Promotes reports/current/sizes.json to the committed baseline/sizes.json. */

const currentPath = path.join(reportsDir, "current", "sizes.json");

if (!fs.existsSync(currentPath)) {
    console.error("updateBaseline: reports/current/sizes.json not found — run snapshotSizes first");
    process.exit(1);
}

fs.mkdirSync(baselineDir, { recursive: true });
fs.copyFileSync(currentPath, path.join(baselineDir, "sizes.json"));

console.log("updateBaseline: baseline/sizes.json updated — review and commit it");
