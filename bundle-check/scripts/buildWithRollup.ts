import * as fs from "node:fs";
import * as path from "node:path";
import { rollup, type Plugin, type RollupLog } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { minify } from "rollup-plugin-esbuild";
import { transform } from "esbuild";
import { bundleScenarios, includesBundler, runtimeOnlyWasmModulePattern, scenarioEntryPath } from "../scenarios";
import { fromRoot } from "./paths";

/**
 * Builds every rollup-applicable scenario through the Rollup JS API (one build() call per
 * scenario for isolation, mirroring the webpack multi-compiler design).
 *
 * Rollup is normally the strictest tree-shaker; two things are load-bearing (same as in the
 * core BundleAnalysis harness):
 *
 * 1. `@rollup/plugin-node-resolve` MUST own module resolution — it is the only thing that reads
 *    the packages' `sideEffects` arrays and hands rollup per-module `moduleSideEffects` flags.
 *    The TypeScript transform below is therefore transform-only (no resolveId hook).
 * 2. `@rollup/plugin-commonjs` is scoped to the modules that really are CommonJS — react and
 *    friends, the Emscripten wasm glue, and the cjs builds of scichart / scichart-react.
 */

const importConditions = ["import", "browser", "module", "default"];

/** Genuinely-CommonJS module paths that need @rollup/plugin-commonjs. */
const commonJsOnlyPaths: RegExp[] = [
    /node_modules[/\\](react|react-dom|scheduler)[/\\]/,
    // the Emscripten glue is a UMD module; since v6 it lives in _glue/ rather than _wasm/
    /_glue[/\\]scichart(-64)?\.js$/,
    /[/\\]scichart[/\\]cjs[/\\]/,
    /[/\\]lib[/\\]cjs[/\\]/
];

/** TypeScript/JSX -> JS transform for the scenario entries (transform-only, see above). */
const transformTypeScript = (): Plugin => ({
    name: "typescript-transform-only",
    async transform(code: string, id: string) {
        if (!id.endsWith(".ts") && !id.endsWith(".tsx")) {
            return null;
        }

        const result = await transform(code, {
            loader: id.endsWith(".tsx") ? "tsx" : "ts",
            jsx: "automatic",
            format: "esm",
            target: "es2020"
        });

        return { code: result.code, map: null };
    }
});

/** Expected noise from the compiled library output; anything else is surfaced. */
const suppressedWarnings = new Set(["THIS_IS_UNDEFINED", "CIRCULAR_DEPENDENCY", "MODULE_LEVEL_DIRECTIVE"]);

async function main(): Promise<void> {
    const scenarios = bundleScenarios.filter(scenario => includesBundler(scenario, "rollup"));

    for (const scenario of scenarios) {
        const outDir = fromRoot("dist", "rollup", scenario.name);
        fs.rmSync(outDir, { recursive: true, force: true });
        fs.mkdirSync(outDir, { recursive: true });

        const bundle = await rollup({
            input: fromRoot(scenarioEntryPath(scenario)),
            external: (source: string) => runtimeOnlyWasmModulePattern.test(source),
            onwarn: (warning: RollupLog, defaultHandler: (warning: RollupLog) => void) => {
                if (!suppressedWarnings.has(warning.code ?? "")) {
                    defaultHandler(warning);
                }
            },
            plugins: [
                transformTypeScript(),
                replace({
                    preventAssignment: true,
                    values: { "process.env.NODE_ENV": JSON.stringify("production") }
                }),
                nodeResolve({
                    browser: true,
                    exportConditions: [...importConditions],
                    extensions: [".tsx", ".ts", ".js", ".mjs"]
                }),
                commonjs({ include: commonJsOnlyPaths }),
                minify({ target: "es2020" })
            ]
        });

        await bundle.write({
            dir: outDir,
            format: "esm",
            entryFileNames: "bundle.js",
            sourcemap: false
        });
        await bundle.close();

        console.log(`rollup: built ${scenario.name}`);
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
