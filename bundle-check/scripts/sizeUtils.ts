import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";

/** Raw + gzipped byte sizes for a single scenario bundle (sum of its JS output files). */
export interface IBundleSize {
    readonly rawBytes: number;
    readonly gzipBytes: number;
    readonly fileCount: number;
}

/** Per-bundler map of scenario name -> size. */
export type TBundlerSizes = Record<string, IBundleSize>;

/** The committed/tracked size snapshot: bundler -> scenario -> size. */
export interface ISizesFile {
    readonly generatedAt: string;
    readonly scichartReactVersion: string;
    readonly scichartVersion: string;
    readonly bundlers: Record<string, TBundlerSizes>;
}

/** JS output extensions that count toward a bundle's payload (excludes .map, .html, .wasm). */
const JS_EXTENSIONS = new Set([".js", ".mjs", ".cjs"]);

/** Recursively list files under a directory (absolute paths). Returns [] if it does not exist. */
export function listFilesRecursive(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const out: string[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            out.push(...listFilesRecursive(full));
        } else {
            out.push(full);
        }
    }

    return out;
}

/** Sum raw + gzip bytes of all JS files in a scenario output directory. */
export function measureBundleDir(scenarioDir: string): IBundleSize {
    const jsFiles = listFilesRecursive(scenarioDir).filter(file => JS_EXTENSIONS.has(path.extname(file)));

    let rawBytes = 0;
    let gzipBytes = 0;

    for (const file of jsFiles) {
        const buffer = fs.readFileSync(file);
        rawBytes += buffer.byteLength;
        gzipBytes += zlib.gzipSync(buffer, { level: 9 }).byteLength;
    }

    return { rawBytes, gzipBytes, fileCount: jsFiles.length };
}

/** Read the version field of an installed package, or "unknown". */
export function readPackageVersion(harnessRoot: string, packageName: string): string {
    try {
        const pkgPath = path.resolve(harnessRoot, "node_modules", packageName, "package.json");
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { version?: string };
        return pkg.version ?? "unknown";
    } catch {
        return "unknown";
    }
}

/** Format bytes as KB with one decimal. */
export function formatKb(bytes: number): string {
    return (bytes / 1024).toFixed(1);
}
