import * as path from "node:path";
import * as fs from "node:fs";
import { bundlerNames, bundleScenarios, includesBundler, type TBundlerName } from "../scenarios";
import { distDir } from "./paths";
import { listFilesRecursive } from "./sizeUtils";

/**
 * Content assertions over the built scenarios — the pass/fail gate that sizes alone can't
 * provide (a size-only measurement cannot tell you a bundle is correct; see the core
 * BundleAnalysis README's declarative-pointMarker lesson).
 *
 * Markers are string literals from scichart-react's own source, so they survive minification
 * (function/property names get mangled by terser/esbuild and cannot be markers):
 * - WASM_MARKER  — the default wasmUrl set by configureDefaults (the sideEffects-listed module)
 * - DECLARATIVE_MARKER — an error message emitted only by SciChartDeclarative.js (the sole
 *   module referencing the Builder API)
 */

const WASM_MARKER = "/scichart.wasm";
const DECLARATIVE_MARKER = "SciChartDeclarative requires the";

// the scichart Builder graph costs ~100 KB gzip — if it leaks into the init-only bundle the delta collapses
const MIN_BUILDER_DELTA_RAW_BYTES = 100 * 1024;

/** Bundlers that barrel-skip (retarget barrel imports at defining modules): only webpack. */
const barrelSkippingBundlers: readonly TBundlerName[] = ["webpack"];

interface IExpectation {
    readonly scenario: string;
    /** wasm marker must be present (true), absent (false), or is bundler-dependent (per-bundler map). */
    readonly wasmMarker: boolean | Partial<Record<TBundlerName, boolean>>;
    /** declarative marker must be present (true) or absent (false). */
    readonly declarativeMarker: boolean;
}

/**
 * Expected content per scenario. `groupOnly` is the bundler-dependent case: webpack barrel-skips
 * (drops configureDefaults), rollup-family bundlers retain the barrel's side-effect module.
 */
const expectations: readonly IExpectation[] = [
    { scenario: "typesOnly", wasmMarker: false, declarativeMarker: false },
    { scenario: "reactBaseline", wasmMarker: false, declarativeMarker: false },
    { scenario: "groupOnly", wasmMarker: { webpack: false }, declarativeMarker: false },
    { scenario: "groupOnlyDeepImport", wasmMarker: false, declarativeMarker: false },
    { scenario: "initChartOnly", wasmMarker: true, declarativeMarker: false },
    { scenario: "nestedOverview", wasmMarker: true, declarativeMarker: false },
    { scenario: "declarative", wasmMarker: true, declarativeMarker: true },
    { scenario: "fullImport", wasmMarker: true, declarativeMarker: true },
    // the CJS control resolves the whole cjs barrel, so everything is retained — that is the point
    { scenario: "cjsRequireBaseline", wasmMarker: true, declarativeMarker: true }
];

function readScenarioContent(bundler: TBundlerName, scenario: string): string | null {
    const dir = path.join(distDir, bundler, scenario);
    const jsFiles = listFilesRecursive(dir).filter(file => file.endsWith(".js"));

    if (jsFiles.length === 0) {
        return null;
    }

    return jsFiles.map(file => fs.readFileSync(file, "utf8")).join("\n");
}

const errors: string[] = [];

for (const expectation of expectations) {
    const scenario = bundleScenarios.find(candidate => candidate.name === expectation.scenario);

    if (!scenario) {
        errors.push(`${expectation.scenario}: expectation references an unknown scenario`);
        continue;
    }

    for (const bundler of bundlerNames) {
        if (!includesBundler(scenario, bundler)) {
            continue;
        }

        const content = readScenarioContent(bundler, scenario.name);
        const key = `${bundler}/${scenario.name}`;

        if (content === null) {
            errors.push(`${key}: no built output found — run the builds first`);
            continue;
        }

        const wasmExpected =
            typeof expectation.wasmMarker === "boolean"
                ? expectation.wasmMarker
                : expectation.wasmMarker[bundler];

        if (wasmExpected !== undefined) {
            const hasWasm = content.includes(WASM_MARKER);

            if (wasmExpected && !hasWasm) {
                errors.push(`${key}: configureDefaults was dropped (no "${WASM_MARKER}" marker)`);
            }

            if (!wasmExpected && hasWasm) {
                errors.push(`${key}: configureDefaults retained where it should have been shaken away`);
            }
        }

        const hasDeclarative = content.includes(DECLARATIVE_MARKER);

        if (expectation.declarativeMarker && !hasDeclarative) {
            errors.push(`${key}: SciChartDeclarative is missing from a bundle that must contain it`);
        }

        if (!expectation.declarativeMarker && hasDeclarative) {
            errors.push(`${key}: SciChartDeclarative (Builder path) leaked into the bundle`);
        }
    }
}

// the Builder graph must ride only with the declarative scenario — checked on the
// barrel-skipping bundler, where scenario composition maps 1:1 to retained modules
for (const bundler of barrelSkippingBundlers) {
    const initOnly = readScenarioContent(bundler, "initChartOnly");
    const declarative = readScenarioContent(bundler, "declarative");

    if (initOnly && declarative && declarative.length - initOnly.length < MIN_BUILDER_DELTA_RAW_BYTES) {
        errors.push(
            `${bundler}: declarative output is not meaningfully larger than initChartOnly — the Builder graph likely leaked into the init-only bundle`
        );
    }

}

if (errors.length > 0) {
    console.error(`assertBundles: FAILED with ${errors.length} error(s):`);
    errors.forEach(message => console.error(`  - ${message}`));
    process.exit(1);
}

console.log("assertBundles: all content assertions passed");
