import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [reactRouter()],
    resolve: {
        /**
         * `scichart-react` is linked with `file:../../lib`, so Vite resolves it through the
         * symlink to the repository root. Node's resolution algorithm then walks up from
         * THAT location when the wrapper imports `scichart`, and can find the repository's
         * own copy instead of this app's. Two copies of `scichart` mean two WebAssembly
         * engine instances and a chart that never renders.
         *
         * `dedupe` forces these packages to resolve from this app's `node_modules`,
         * whichever file in the graph asked for them. It is the Vite equivalent of the
         * webpack `resolve.alias` used by the Next.js demo in this repository.
         */
        dedupe: ["react", "react-dom", "scichart", "scichart-react"]
    }
});
