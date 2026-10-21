import { Suspense, lazy, type ReactElement } from "react";

import type { Route } from "./+types/declarative";

/** See the note in `routes/home.tsx` — the dynamic import keeps SciChart out of the server bundle. */
const DeclarativeChartExample = lazy(() => import("../charts/DeclarativeChartExample"));

export function meta(): Route.MetaDescriptors {
    return [
        { title: "scichart-react on React Router 8 — Builder API" },
        {
            name: "description",
            content: "A SciChart.js chart created from a Builder API config inside a server-rendered app."
        }
    ];
}

/**
 * A `clientLoader` with no server `loader` moves this route's data fetching — and, more
 * importantly here, its first render — into the browser. React Router renders
 * {@link HydrateFallback} on the server and swaps in the route component once the client
 * loader has resolved during hydration.
 *
 * The returned value is only there to make the pattern concrete; a real app would fetch
 * something that is only available in the browser, such as an IndexedDB cache or a
 * `localStorage`-scoped user preference.
 */
export async function clientLoader(): Promise<{ hydratedAt: number }> {
    return { hydratedAt: Date.now() };
}

// Redundant as long as this route has no server `loader`: React Router already treats the first
// client render as a hydration request when a route has a `clientLoader` and no server `loader`.
// Kept explicit because adding a server `loader` later would otherwise silently stop the client
// loader — and therefore the `HydrateFallback` render gate — from running on hydration.
clientLoader.hydrate = true as const;

/**
 * Rendered on the server, and on the client until `clientLoader` resolves.
 *
 * Exporting this is what makes the route component itself client-only: without a
 * `HydrateFallback`, React Router would have to render the component during SSR.
 */
export function HydrateFallback(): ReactElement {
    return (
        <main>
            <h1>SciChartDeclarative with a Builder API config</h1>
            <p>Waiting for hydration…</p>
            <div className="chart-panel chart-placeholder">Waiting for hydration…</div>
        </main>
    );
}

/**
 * The `/declarative` route: `SciChartDeclarative` behind route-level `clientLoader` +
 * `HydrateFallback`, the alternative to the `<ClientOnly>` wrapper used on `/`.
 */
export default function Declarative({ loaderData }: Route.ComponentProps): ReactElement {
    return (
        <main>
            <h1>SciChartDeclarative with a Builder API config</h1>
            <p>
                This route has no server <code>loader</code>. Its <code>clientLoader</code> runs during hydration and
                React Router renders <code>HydrateFallback</code> until it resolves, so the route component — and the
                chart inside it — never executes on the server. Hydrated at{" "}
                {new Date(loaderData.hydratedAt).toLocaleTimeString()}.
            </p>

            <Suspense fallback={<div className="chart-panel chart-placeholder">Loading chart module…</div>}>
                <DeclarativeChartExample />
            </Suspense>
        </main>
    );
}
