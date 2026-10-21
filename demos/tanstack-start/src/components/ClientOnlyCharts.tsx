import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { JSX, ReactNode } from "react";

/**
 * SciChart renders through WebGL and loads a WebAssembly engine, so it cannot run in the SSR pass.
 *
 * Two layers are needed, and they solve different problems:
 *
 * 1. `lazy(() => import(...))` keeps `scichart` / `scichart-react` out of the server module graph
 *    entirely — the chunk is only fetched in the browser. Importing them statically would drag the
 *    whole engine into the server build for markup that can never be produced there.
 * 2. `<ClientOnly>` renders the fallback during SSR and on the very first client render, so the
 *    hydrated markup matches the server markup and the lazy chunk is requested only afterwards.
 *
 * The alternative, if a whole page needs the browser, is to opt the route out of SSR instead:
 * `createFileRoute("/")({ ssr: false, component: HomePage })`.
 */
const LazyInitChartExample = lazy(() => import("./InitChartExample"));
const LazyDeclarativeChartExample = lazy(() => import("./DeclarativeChartExample"));

function ChartPlaceholder({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
    return <div className="chart-placeholder">{children}</div>;
}

function ClientOnlyChart({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
    const placeholder = <ChartPlaceholder>Loading chart…</ChartPlaceholder>;

    return (
        <ClientOnly fallback={placeholder}>
            <Suspense fallback={placeholder}>{children}</Suspense>
        </ClientOnly>
    );
}

/** Client-only wrapper around the `SciChartReact` + `initChart` example. */
export function InitChart(): JSX.Element {
    return (
        <ClientOnlyChart>
            <LazyInitChartExample />
        </ClientOnlyChart>
    );
}

/** Client-only wrapper around the `SciChartDeclarative` + Builder API example. */
export function DeclarativeChart(): JSX.Element {
    return (
        <ClientOnlyChart>
            <LazyDeclarativeChartExample />
        </ClientOnlyChart>
    );
}
