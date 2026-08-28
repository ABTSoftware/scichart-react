import { build as viteBuild } from "vite";
import { bundleScenarios, includesBundler, runtimeOnlyWasmModulePattern, scenarioHtmlPath } from "../scenarios";
import { fromRoot, harnessRoot } from "./paths";

/**
 * Builds every vite-applicable scenario through the Vite JS API in library-consumer mode
 * (an HTML entry per scenario, exactly as a customer app is built). Vite 5's production build
 * uses Rollup internally, so its tree-shaking matches the rollup driver; measuring it
 * separately captures Vite's own defaults (modulepreload, asset hashing, esbuild minify).
 * The modulepreload polyfill is disabled to remove ~2KB of boilerplate from the measurement.
 */

const importConditions = ["import", "browser", "module", "default"];
const requireConditions = ["require", "node", "default"];

async function main(): Promise<void> {
    const scenarios = bundleScenarios.filter(scenario => includesBundler(scenario, "vite"));

    for (const scenario of scenarios) {
        await viteBuild({
            configFile: false,
            root: harnessRoot,
            logLevel: "warn",
            resolve: {
                preserveSymlinks: true,
                conditions: scenario.forceCjs ? requireConditions : importConditions
            },
            build: {
                outDir: fromRoot("dist", "vite", scenario.name),
                emptyOutDir: true,
                minify: "esbuild",
                target: "es2020",
                reportCompressedSize: false,
                modulePreload: { polyfill: false },
                rollupOptions: {
                    input: fromRoot(scenarioHtmlPath(scenario)),
                    // Lazily-imported memory64 glue: runtime-only, excluded from measurement.
                    external: (source: string) => runtimeOnlyWasmModulePattern.test(source)
                }
            }
        });

        console.log(`vite: built ${scenario.name}`);
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
