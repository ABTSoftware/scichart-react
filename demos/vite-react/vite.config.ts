import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Vite configuration for the client-only SciChart.js demo.
 *
 * There is no SSR here, so nothing needs guarding behind `typeof window !== "undefined"` or a
 * dynamic import: the whole app is browser code and the chart components mount normally.
 * The only non-default setting is the resolution fix described below.
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        /*
         * Why `dedupe` is load-bearing in this demo
         * -----------------------------------------
         * `scichart-react` is consumed as `"file:../../lib"`, so npm puts a SYMLINK at
         * node_modules/scichart-react -> ../../lib. Vite resolves symlinks to their real path
         * (`resolve.preserveSymlinks` is false by default), so the wrapper's own bare imports
         * (`scichart`, `react/jsx-runtime`) are resolved starting from the repo checkout rather
         * than from this app - and both are also installed at the repo root as dev dependencies.
         *
         * Measured with a resolution probe over `vite build`, the unconfigured build pulled in
         * FIVE package roots:
         *     demos/vite-react/node_modules/{react, react-dom, scichart}
         *     <repo>/node_modules/{react, scichart}          <-- duplicates
         * i.e. two copies of SciChart.js (~doubling the bundle, two WASM engines at runtime) and
         * two copies of React (the classic "Invalid hook call" failure - the repo root is on
         * React 18 while this app is on React 19).
         *
         * `dedupe` tells Vite to always resolve these bare ids from the project root, which
         * collapses the list to the three app-local roots. It applies to dev and build alike.
         *
         * `resolve.preserveSymlinks: true` also fixes it (the wrapper then resolves through the
         * symlinked path, i.e. this app's node_modules) and is what the repo's bundle-check
         * harness uses. It is deliberately NOT used here: it only works while the linked package
         * has no nested node_modules of its own, it changes resolution for every dependency
         * rather than the three that need it, and it does nothing about duplicate copies that
         * arrive through ordinary (non-symlinked) transitive installs. `dedupe` is the narrower,
         * more portable fix - and it is exactly what a published-npm consumer would use to
         * collapse a duplicated `scichart` anyway.
         */
        dedupe: ["scichart", "react", "react-dom"]
    },
    server: {
        fs: {
            /*
             * The symlinked wrapper resolves to <repo>/lib, so in dev it is served as
             * `/@fs/<repo>/lib/esm/...` - a path outside this app's folder, which Vite's dev server
             * only serves if it is inside the allow-list.
             *
             * In a normal git checkout this line changes nothing: Vite's default allow-list is the
             * workspace root it detects by walking up for a `.git` folder (or a workspace manifest),
             * which lands on the repo root and already covers `<repo>/lib`. Verified by removing the
             * setting - the `/@fs/...` request still returns 200.
             *
             * It is kept because the detection has nothing to find when the repository is used
             * without its `.git` folder (a source zip, a vendored copy), and then the same request
             * returns 403. An app installing scichart-react from npm never needs it.
             */
            allow: ["../.."]
        }
    }
});
