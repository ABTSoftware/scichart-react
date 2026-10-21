import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";

import { DeclarativeChart, InitChart } from "../components/ClientOnlyCharts";

export const Route = createFileRoute("/")({
    component: HomePage
});

/**
 * The only route of the demo.
 *
 * The page itself is server-rendered as usual — only the two chart surfaces are deferred to the
 * browser by the wrappers in `src/components/ClientOnlyCharts.tsx`.
 */
function HomePage(): JSX.Element {
    return (
        <main className="page">
            <h1 className="page__title">scichart-react with TanStack Start</h1>
            <p className="page__subtitle">
                Server-rendered page, client-only charts. Scroll-wheel zooms, drag pans, double-click resets.
            </p>

            <section className="example">
                <h2 className="example__title">SciChartReact — initChart</h2>
                <p className="example__description">
                    The recommended, smallest-bundle path: an async function builds the surface from the SciChart
                    classes it actually needs.
                </p>
                <InitChart />
            </section>

            <section className="example">
                <h2 className="example__title">SciChartDeclarative — Builder API config</h2>
                <p className="example__description">
                    The same chart described as a configuration object. Convenient and serialisable, but it is the only
                    component that ships the Builder API.
                </p>
                <DeclarativeChart />
            </section>
        </main>
    );
}
