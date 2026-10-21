import type { JSX } from "react";
import { DeclarativeChartExample } from "./DeclarativeChartExample";
import { InitChartExample } from "./InitChartExample";

/**
 * Root of the demo: the two chart components side by side, so the imperative `initChart` API and
 * the declarative Builder API `config` can be compared at a glance.
 * @returns the page layout
 */
export function App(): JSX.Element {
    return (
        <main className="page">
            <header className="page-header">
                <h1>scichart-react on Vite + React 19</h1>
                <p>
                    A client-only single-page app - no SSR, no server components, no dynamic-import dance. This is the
                    simplest way to host SciChart.js in React.
                </p>
            </header>

            <div className="chart-grid">
                <section className="chart-card">
                    <h2>
                        <code>SciChartReact</code> with <code>initChart</code>
                    </h2>
                    <p>Imperative setup. Smallest bundle - the Builder API is never referenced.</p>
                    <InitChartExample />
                </section>

                <section className="chart-card">
                    <h2>
                        <code>SciChartDeclarative</code> with <code>config</code>
                    </h2>
                    <p>Builder API definition object. Convenient, but adds about 200 KB gzip to the bundle.</p>
                    <DeclarativeChartExample />
                </section>
            </div>
        </main>
    );
}
