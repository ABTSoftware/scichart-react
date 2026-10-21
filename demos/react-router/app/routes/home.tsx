import { Suspense, lazy, type ReactElement } from "react";

import { ClientOnly } from "../components/ClientOnly";
import type { Route } from "./+types/home";

/**
 * `React.lazy` is the second half of the SSR gate, and it is not optional.
 *
 * `<ClientOnly>` stops the component from *rendering* on the server, but a static
 * `import ... from "../charts/InitChartExample"` would still be *evaluated* on the server:
 * React Router pulls every route module into the server bundle to read its `loader`,
 * `action` and `meta` exports. Vite leaves `scichart` external in the SSR build, and the
 * `scichart` ESM entry uses extensionless specifiers meant for a bundler, so Node cannot
 * resolve them — `react-router-serve` then dies on startup with ERR_MODULE_NOT_FOUND before
 * it can answer a single request. The dynamic import keeps that whole graph off the server's
 * evaluation path. See README.md, "SSR safety".
 */
const InitChartExample = lazy(() => import("../charts/InitChartExample"));

export function meta(): Route.MetaDescriptors {
    return [
        { title: "scichart-react on React Router 8 — initChart" },
        {
            name: "description",
            content: "A SciChart.js line chart created with an initChart function inside a server-rendered app."
        }
    ];
}

/**
 * The `/` route: `SciChartReact` behind the reusable `<ClientOnly>` wrapper.
 *
 * Everything outside `<ClientOnly>` — heading, copy, layout — is server-rendered and arrives
 * in the initial HTML response. Only the chart itself waits for hydration.
 */
export default function Home(): ReactElement {
    return (
        <main>
            <h1>SciChartReact with an initChart function</h1>
            <p>
                This page is server-rendered. The surrounding markup is in the initial HTML response; the chart below is
                mounted only after hydration by the <code>&lt;ClientOnly&gt;</code> wrapper, because SciChart.js needs a
                real DOM element, a WebGL context and a WebAssembly module.
            </p>

            <ClientOnly fallback={<div className="chart-panel chart-placeholder">Waiting for hydration…</div>}>
                {() => (
                    <Suspense fallback={<div className="chart-panel chart-placeholder">Loading chart module…</div>}>
                        <InitChartExample />
                    </Suspense>
                )}
            </ClientOnly>
        </main>
    );
}
