import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Copies every WebAssembly binary shipped by the installed `scichart` package into `public/`,
 * which the framework serves at the site root in dev and in the production build.
 *
 * All of them, not only `scichart.wasm`: the core picks a variant per browser (`-nosimd`, `-64`)
 * and fetches the 3D engine (`scichart-charting3d*.wasm`) on demand, all relative to the
 * `wasmUrl` scichart-react configures by default, `/scichart.wasm`.
 */

const demoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(demoRoot, "public");

const require = createRequire(import.meta.url);
const scichartRoot = dirname(require.resolve("scichart/package.json"));
const wasmSourceDir = join(scichartRoot, "_wasm");

if (!existsSync(wasmSourceDir) || !statSync(wasmSourceDir).isDirectory()) {
    console.error(`copy-wasm: no _wasm folder found in the installed scichart package (${wasmSourceDir}).`);
    process.exit(1);
}

const wasmFileNames = readdirSync(wasmSourceDir).filter(fileName => fileName.endsWith(".wasm"));

if (wasmFileNames.length === 0) {
    console.error(`copy-wasm: no *.wasm files found in ${wasmSourceDir}. Is the scichart install complete?`);
    process.exit(1);
}

mkdirSync(publicDir, { recursive: true });

for (const fileName of wasmFileNames) {
    copyFileSync(join(wasmSourceDir, fileName), join(publicDir, fileName));
}

console.log(`copy-wasm: copied ${wasmFileNames.length} file(s) to public/ -> ${wasmFileNames.join(", ")}`);
