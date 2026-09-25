import * as fs from "node:fs";
import * as path from "node:path";
import { baselineDir, reportsDir } from "./paths";

/**
 * Promotes reports/current to the committed baseline.
 *
 * Both files move together: sizes.json is what compareSizes gates on, and sizes.md is the
 * human-readable table carrying the versions the numbers were recorded against. Copying only
 * the JSON leaves the table claiming versions that are no longer the baseline's.
 */

const files = ["sizes.json", "sizes.md"];
const currentDir = path.join(reportsDir, "current");

const missing = files.filter(name => !fs.existsSync(path.join(currentDir, name)));

if (missing.length > 0) {
    console.error(`updateBaseline: reports/current/${missing.join(", ")} not found — run snapshotSizes first`);
    process.exit(1);
}

fs.mkdirSync(baselineDir, { recursive: true });

for (const name of files) {
    fs.copyFileSync(path.join(currentDir, name), path.join(baselineDir, name));
}

console.log(`updateBaseline: baseline/${files.join(" and ")} updated — review and commit`);
