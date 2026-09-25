import { existsSync, readFileSync, readdirSync } from "fs";
import * as path from "path";

/**
 * Post-build sanity checks for the published artifact layout in lib/.
 * Run via `npm run verifyLib` (wired into `npm run build` after copyToLib).
 * Guards the invariants the dual ESM/CJS packaging relies on — see README "ESM, CJS and tree-shaking".
 */

const libDir = path.join(process.cwd(), "lib");

const errors: string[] = [];

function fail(message: string) {
    errors.push(message);
}

function readLib(relativePath: string): string {
    return readFileSync(path.join(libDir, relativePath), "utf8");
}

// Modules that must carry the "use client" directive in both outputs: every component, plus
// the two contexts, which call createContext at module scope. Modules that merely call hooks
// inside a function body are inert at import time and do not need it.
const CLIENT_MODULES = [
    "ChartGroupLoader",
    "DefaultFallback",
    "SciChart",
    "SciChartDeclarative",
    "SciChartGroup",
    "SciChartGroupContext",
    "SciChartLegendComponent",
    "SciChartMemoryDebugWrapper",
    "SciChartOverview",
    "SciChartSurfaceContext"
];

// Builder API isolation: only these modules may reach the Builder, so apps using SciChartReact
// with an initChart function never bundle it.
const BUILDER_MODULE = "SciChartDeclarative.js";

const EXPECTED_SIDE_EFFECTS = ["./configureDefaults.js"];

if (!existsSync(libDir)) {
    console.error("verify-lib: lib/ does not exist — run the build first");
    process.exit(1);
}

for (const format of ["cjs", "esm"] as const) {
    const formatDir = path.join(libDir, format);

    if (!existsSync(formatDir)) {
        fail(`${format}: output folder is missing`);
        continue;
    }

    for (const moduleName of CLIENT_MODULES) {
        const filePath = `${format}/${moduleName}.js`;

        if (!existsSync(path.join(libDir, filePath))) {
            fail(`${filePath}: file is missing`);
            continue;
        }

        // the directive must stay within the directive prologue (first statements of the file)
        const head = readLib(filePath).split("\n").slice(0, 2).join("\n");

        if (!head.includes(`"use client"`)) {
            fail(`${filePath}: "use client" is missing from the directive prologue`);
        }
    }

    const jsFiles = readdirSync(formatDir).filter(fileName => fileName.endsWith(".js"));

    for (const fileName of jsFiles) {
        const content = readLib(`${format}/${fileName}`);

        if (format === "esm" && /\brequire\(/.test(content)) {
            fail(`esm/${fileName}: contains require() — ESM output must not use CommonJS`);
        }

        if (format === "cjs" && /^(import|export)\s/m.test(content)) {
            fail(`cjs/${fileName}: contains ESM syntax — CJS output must not use import/export`);
        }

        if (/\bbuildChart\b/.test(content) && fileName !== BUILDER_MODULE) {
            fail(`${format}/${fileName}: references the Builder API — only ${BUILDER_MODULE} may do so`);
        }

        if (/\bregisterAllTypes\b/.test(content) && fileName !== BUILDER_MODULE) {
            fail(
                `${format}/${fileName}: references registerAllTypes — only ${BUILDER_MODULE} may register every built-in type`
            );
        }
    }

    const configContent = readLib(`${format}/configureDefaults.js`);

    if (!configContent.includes("/scichart.wasm")) {
        fail(`${format}/configureDefaults.js: default wasmUrl "/scichart.wasm" is missing`);
    }

    const nestedManifest = JSON.parse(readLib(`${format}/package.json`));

    if (JSON.stringify(nestedManifest.sideEffects) !== JSON.stringify(EXPECTED_SIDE_EFFECTS)) {
        fail(`${format}/package.json: sideEffects must be exactly ${JSON.stringify(EXPECTED_SIDE_EFFECTS)}`);
    }

    if (format === "cjs" && nestedManifest.type !== "commonjs") {
        fail(`cjs/package.json: "type" must be "commonjs"`);
    }

    // the esm folder is bundler-only by design (extensionless imports) — "type": "module" would break it
    if (format === "esm" && nestedManifest.type) {
        fail(`esm/package.json: must NOT declare a "type" field`);
    }
}

if (!existsSync(path.join(libDir, "types/index.d.ts"))) {
    fail("types/index.d.ts is missing");
}

const manifest = JSON.parse(readLib("package.json"));

if (manifest.main !== "./cjs/index.js" || manifest.module !== "./esm/index.js" || manifest.types !== "./types/index.d.ts") {
    fail("package.json: main/module/types entry points are wrong");
}

if (!manifest.exports || !manifest.exports["."] || !manifest.exports["./*"] || !manifest.exports["./package.json"]) {
    fail(`package.json: exports map must declare ".", "./*" and "./package.json"`);
}

if (manifest.type) {
    fail(`package.json: must NOT declare a "type" field`);
}

if (manifest.sideEffects) {
    fail(`package.json: sideEffects belongs in the nested cjs/esm package.json files, not the root`);
}

if (Object.keys(manifest.scripts ?? {}).length > 0 || Object.keys(manifest.devDependencies ?? {}).length > 0) {
    fail("package.json: scripts/devDependencies were not blanked by updateJson");
}

if (errors.length > 0) {
    console.error(`verify-lib: FAILED with ${errors.length} error(s):`);
    errors.forEach(message => console.error(`  - ${message}`));
    process.exit(1);
}

console.log("verify-lib: all artifact checks passed");
