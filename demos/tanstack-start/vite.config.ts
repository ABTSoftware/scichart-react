import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        // `scichart-react` is linked from ../../lib through a `file:` dependency, so Vite resolves it
        // to its real path outside this folder. Its own `import "scichart"` would then resolve against
        // the repository root's node_modules and a second copy of the engine would end up in the
        // bundle. Deduping pins every one of these specifiers to this demo's own node_modules.
        // (Equivalent to the `scichart` webpack alias in demos/scichart-react-next/next.config.js.)
        dedupe: ["scichart", "scichart-react", "react", "react-dom"]
    },
    // Note on the SSR build: `scichart` stays an external dependency there, and its ESM build is
    // bundler-only (internal imports have no file extensions), so Node cannot import it directly.
    // That is fine — the charts sit behind a client-only gate, so the engine only ever lives in
    // dynamically imported chunks that the server never executes. Should something legitimately
    // need it in the server graph, add `ssr: { noExternal: ["scichart"] }` so Vite bundles it.
    plugins: [
        // tanstackStart() must be registered before viteReact().
        tanstackStart(),
        viteReact()
    ]
});
