// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

/**
 * Astro configuration for the scichart-react demo.
 *
 * `resolve.dedupe` is the load-bearing setting. `scichart-react` is installed with `file:../../lib`,
 * which npm materialises as a symlink. Vite resolves symlinks to their real path, so the wrapper's
 * own `import "scichart"` is resolved starting from the repository root — where a second copy of
 * `scichart` is installed. Two copies means two WebAssembly engine instances and a chart that
 * silently misbehaves. Deduping forces every one of these bare specifiers to resolve from this
 * demo's own `node_modules`. It is the Vite equivalent of the webpack alias in the Next.js demo.
 * Removing it is measurable: the client bundle grows from ~2.0 MB to ~3.2 MB and `dist/_astro/`
 * gains a second SciChart engine chunk.
 *
 * `optimizeDeps.include` is a dev-server ergonomics setting, not a correctness one. Vite does not
 * pre-bundle linked (`file:`) dependencies, so without it `scichart-react` is served as a raw
 * module graph out of `/@fs/<repo>/lib/esm/*`, one request per file. Listing it produces a single
 * pre-bundled chunk instead. `scichart` is listed alongside it so the pre-bundle stays a shared
 * chunk even in an app that never imports `scichart` directly. Neither entry affects `astro build`,
 * and neither is what prevents the duplicate copy — that is `dedupe` above.
 *
 * Note there is deliberately no `ssr.noExternal` entry: it was measured to make no difference here,
 * because `client:only` islands never enter the server module graph in the first place. See README.
 */
export default defineConfig({
    integrations: [react()],
    vite: {
        resolve: {
            dedupe: ["react", "react-dom", "scichart", "scichart-react"]
        },
        optimizeDeps: {
            include: ["scichart", "scichart-react"]
        }
    }
});
