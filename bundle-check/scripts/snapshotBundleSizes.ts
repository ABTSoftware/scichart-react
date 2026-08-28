import * as fs from "node:fs";
import * as path from "node:path";
import { bundlerNames, bundleScenarios, includesBundler } from "../scenarios";
import { distDir, harnessRoot, reportsDir } from "./paths";
import { formatKb, type ISizesFile, measureBundleDir, readPackageVersion, type TBundlerSizes } from "./sizeUtils";

/**
 * Walks dist/<bundler>/<scenario>/ for every built scenario, records raw + gzip byte sizes,
 * and writes reports/current/sizes.json (machine-readable, the tracked metric) plus
 * reports/current/sizes.md (a bundler x scenario table for pasting into docs).
 */

function buildSizes(): ISizesFile {
    const bundlers: Record<string, TBundlerSizes> = {};

    for (const bundler of bundlerNames) {
        const perScenario: TBundlerSizes = {};

        for (const scenario of bundleScenarios) {
            if (!includesBundler(scenario, bundler)) {
                continue;
            }

            const size = measureBundleDir(path.join(distDir, bundler, scenario.name));

            if (size.fileCount > 0) {
                perScenario[scenario.name] = size;
            }
        }

        bundlers[bundler] = perScenario;
    }

    return {
        generatedAt: new Date().toISOString(),
        scichartReactVersion: readPackageVersion(harnessRoot, "scichart-react"),
        scichartVersion: readPackageVersion(harnessRoot, "scichart"),
        bundlers
    };
}

function renderMarkdown(sizes: ISizesFile): string {
    const lines: string[] = [
        "# scichart-react bundle sizes",
        "",
        `- scichart-react version: \`${sizes.scichartReactVersion}\``,
        `- scichart version: \`${sizes.scichartVersion}\``,
        `- generated: ${sizes.generatedAt}`,
        "",
        "Gzip KB (raw KB) of the JS payload per scenario. Only within-bundler, build-to-build deltas are",
        "authoritative; cross-bundler numbers are indicative (different minifiers/runtimes).",
        ""
    ];

    const scenarioNames = bundleScenarios.map(scenario => scenario.name);

    lines.push(`| Scenario | ${bundlerNames.join(" | ")} |`);
    lines.push(`|---|${bundlerNames.map(() => "---:").join("|")}|`);

    for (const name of scenarioNames) {
        const cells = bundlerNames.map(bundler => {
            const size = sizes.bundlers[bundler]?.[name];
            return size ? `${formatKb(size.gzipBytes)} (${formatKb(size.rawBytes)})` : "—";
        });
        lines.push(`| ${name} | ${cells.join(" | ")} |`);
    }

    lines.push("");
    return lines.join("\n");
}

const sizes = buildSizes();
const currentDir = path.join(reportsDir, "current");
fs.mkdirSync(currentDir, { recursive: true });
fs.writeFileSync(path.join(currentDir, "sizes.json"), JSON.stringify(sizes, null, 4) + "\n");
fs.writeFileSync(path.join(currentDir, "sizes.md"), renderMarkdown(sizes));

console.log(renderMarkdown(sizes));
console.log(`snapshotSizes: written to ${path.join(currentDir, "sizes.json")}`);
