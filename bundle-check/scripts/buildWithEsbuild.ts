import * as fs from "node:fs";
import * as path from "node:path";
import * as esbuild from "esbuild";
import { bundleScenarios, includesBundler, scenarioEntryPath } from "../scenarios";
import { fromRoot } from "./paths";

/**
 * Builds every esbuild-applicable scenario through the esbuild JS API. esbuild does NOT
 * tree-shake CommonJS (a CJS module is an opaque unit), so its numbers reflect what a fast
 * production bundler achieves on the shakeable lib/esm builds.
 */

const importConditions = ["import", "browser", "module"];
const requireConditions = ["require", "node"];

async function main(): Promise<void> {
    const scenarios = bundleScenarios.filter(scenario => includesBundler(scenario, "esbuild"));

    for (const scenario of scenarios) {
        const outFile = fromRoot("dist", "esbuild", scenario.name, "bundle.js");
        fs.rmSync(path.dirname(outFile), { recursive: true, force: true });
        fs.mkdirSync(path.dirname(outFile), { recursive: true });

        await esbuild.build({
            entryPoints: [fromRoot(scenarioEntryPath(scenario))],
            bundle: true,
            minify: true,
            format: "esm",
            target: "es2020",
            platform: "browser",
            jsx: "automatic",
            outfile: outFile,
            preserveSymlinks: true,
            legalComments: "none",
            logLevel: "silent",
            define: { "process.env.NODE_ENV": JSON.stringify("production") },
            // Lazily-imported memory64 glue: runtime-only, excluded from measurement.
            external: ["*_glue/scichart-64"],
            conditions: scenario.forceCjs ? requireConditions : importConditions,
            mainFields: scenario.forceCjs ? ["main"] : ["browser", "module", "main"]
        });

        console.log(`esbuild: built ${scenario.name}`);
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
