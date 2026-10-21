import type { Config } from "@react-router/dev/config";

export default {
    /**
     * Server-side rendering stays ON deliberately.
     *
     * Flipping this to `false` puts React Router into SPA mode, which would make the
     * WebGL/WASM problem disappear by removing the server render entirely. That is a valid
     * production choice for a chart-only app, but it would prove nothing — the point of
     * this demo is that `scichart-react` composes with a real SSR framework as long as the
     * chart itself is gated to the client. See README.md, "Why not `ssr: false`?".
     */
    ssr: true
} satisfies Config;
