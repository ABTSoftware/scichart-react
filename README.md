# SciChart.React - Official React Component Wrapper for SciChart.js: High Performance [JavaScript Chart Library](https://www.scichart.com/javascript-chart-features)

SciChart.React requires core [SciChart.js](https://www.npmjs.com/package/scichart) package to work and uses it as a peer dependency.

The SciChartReact itself is MIT licensed, find the core library licensing info at [https://www.scichart.com/licensing-scichart-js/](https://www.scichart.com/licensing-scichart-js/).

## What does SciChart.React do?

-   Neatly wraps up the lifecycle of SciChart.js into a React component to ensure proper initialisation and memory cleanup.
-   Provides a number of ways to configure a chart (via JSON config or initialization function)
-   Can be used to create complex dashboards linking multiple charts (demos are coming soon!)

## Getting Started

### Prerequisites

-   `react` 16.14+
-   `scichart` 6.0.0+ (v6 prereleases are supported; for scichart 3.x-5.x use scichart-react 1.x)

### Installing

```
npm install scichart scichart-react
```

### Loading required WASM dependencies

SciChart.js requires WebAssembly binaries to work. Since v6 the engine is modular — a core plus
side modules it loads at runtime — so the payload is the whole `_wasm` **directory**, not a single
file: `scichart-data.wasm` is fetched for every chart and `scichart-charting3d.wasm` for the first
3D chart. The library fetches them asynchronously at runtime.

```js
// webpack — copy the directory so a new variant or module never breaks the build
new CopyPlugin({ patterns: [{ from: "node_modules/scichart/_wasm/", to: "" }] })
```

Find detailed info at [Deploying Wasm Docs](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html)

By default scichart-react applies the following configuration:

```typescript
SciChartSurface.configure({
    wasmUrl: "/scichart.wasm"
});
```

These defaults are applied at import time by the `configureSciChartDefaults` module, which is bundled whenever your app uses the chart components. Your own `SciChartSurface.configure(...)` / `loadWasmFromCDN()` calls always run after it and take precedence.

### Using

There are two chart components:

-   **`SciChartReact`** — takes an initialization function via the `initChart` prop. This is the primary component for code-first apps and produces the smallest bundles.
-   **`SciChartDeclarative`** — takes a chart definition (object or JSON string) via the `config` prop and creates the chart with the [Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html). The Builder API is only bundled by apps that use this component. It registers every built-in chart type, so any definition works with no setup.

#### With Initialization Function (SciChartReact)

Pass a function which should create a surface on the provided root element and resolve to it.

```tsx
import {
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    SplineMountainRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { SciChartReact } from "scichart-react";

// Call loadWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
// Alternative methods for serving and resolving wasm are available on our website
SciChartSurface.loadWasmFromCDN();

function App() {
    return (
        <SciChartReact
            style={{ width: 800, height: 600 }}
            initChart={async function (rootElement) {
                const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

                const xAxis = new NumericAxis(wasmContext);
                const yAxis = new NumericAxis(wasmContext);

                sciChartSurface.xAxes.add(xAxis);
                sciChartSurface.yAxes.add(yAxis);

                sciChartSurface.renderableSeries.add(
                    new SplineMountainRenderableSeries(wasmContext, {
                        dataSeries: new XyDataSeries(wasmContext, {
                            xValues: [1, 2, 3, 4],
                            yValues: [1, 4, 7, 3]
                        }),
                        fill: "#3ca832",
                        stroke: "#eb911c",
                        strokeThickness: 4,
                        opacity: 0.4
                    })
                );

                sciChartSurface.chartModifiers.add(
                    new ZoomPanModifier({ enableZoom: true }),
                    new MouseWheelZoomModifier(),
                    new ZoomExtentsModifier()
                );

                return { sciChartSurface };
            }}
        />
    );
}
```

#### With Config (SciChartDeclarative)

Alternatively, pass a config object that will be used to generate a chart via the [Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).

```tsx
import { EAxisType, EChart2DModifierType, ESeriesType, SciChartSurface } from "scichart";
import { SciChartDeclarative } from "scichart-react";

// Call loadWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
// Alternative methods for serving and resolving wasm are available on our website
SciChartSurface.loadWasmFromCDN();

function App() {
    return (
        <SciChartDeclarative
            style={{ width: 800, height: 600 }}
            config={{
                xAxes: [{ type: EAxisType.NumericAxis }],
                yAxes: [{ type: EAxisType.NumericAxis }],
                series: [
                    {
                        type: ESeriesType.SplineMountainSeries,
                        options: {
                            fill: "#3ca832",
                            stroke: "#eb911c",
                            strokeThickness: 4,
                            opacity: 0.4
                        },
                        xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
                    }
                ],
                modifiers: [
                    { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
                    { type: EChart2DModifierType.MouseWheelZoom },
                    { type: EChart2DModifierType.ZoomExtents }
                ]
            }}
        />
    );
}
```

**NOTE** Make sure that in both cases `initChart` and `config` props do not change, as they should be only used for initial chart render.

## Type registration (SciChart v6)

A chart definition names its parts as strings — `{ type: "LineSeries" }`. A string cannot pull code
into a bundle, so since SciChart v6 the Builder API registers nothing on import: the types a
definition names have to be registered, or building it fails with
`Nothing registered for RenderableSeries:LineSeries`.

`SciChartDeclarative` handles this for you by registering every built-in type, so any definition
works with no setup. The trade-off is bundle size: the whole type universe is included, which is
most of why the `config` approach costs ~205 KB gzip more than an `initChart` chart. If that matters,
use `SciChartReact` with an `initChart` function — types you construct yourself register
automatically, because a class registers itself when its module is in your bundle.

You can also use the Builder API directly from an `initChart` function, registering only the types
your definition names. That keeps the `config` style without bundling the full registry:

```tsx
import { build2DChart, ESeriesType } from "scichart";
import type { ISciChart2DDefinition } from "scichart";
import { registerNumericAxis } from "scichart/Builder/register/axes";
import { registerSplineMountainSeries } from "scichart/Builder/register/series";
import { registerXyDataSeries } from "scichart/Builder/register/dataSeries";
import { SciChartReact } from "scichart-react";

// register the axis type even if the definition omits xAxes/yAxes — the Builder
// creates the two default axes through the registry
registerNumericAxis();
registerSplineMountainSeries();
registerXyDataSeries();

const definition: ISciChart2DDefinition = {
    series: [
        {
            type: ESeriesType.SplineMountainSeries,
            xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
        }
    ]
};

function App() {
    return (
        <SciChartReact
            style={{ width: 800, height: 600 }}
            initChart={async rootElement => await build2DChart(rootElement, definition)}
        />
    );
}
```

An unregistered type fails with an error naming the register function to call, so the message tells
you what to add. `registerAllTypes()` from `scichart` is the one-line escape hatch if you would
rather not maintain the list — that is exactly what `SciChartDeclarative` does internally.

## Migrating from 1.x to 2.0

-   **`SciChartOverview` no longer mirrors** palette providers, animations or data labels onto the overview's mini series. Set them on the overview series explicitly if you relied on that.
-   **`scichart` peer dependency is now v6+** (one union `scichart.wasm` file instead of the `scichart2d.wasm`/`scichart3d.wasm` pair, no more `.data` files). Apps staying on scichart 3.x-5.x should stay on scichart-react 1.x. When upgrading the core library, the `scichart-migrate` codemod automates the renames.
-   **The `config` prop moved to the new `SciChartDeclarative` component**: replace `<SciChartReact config={...} />` with `<SciChartDeclarative config={...} />` (one JSX rename; all other props are identical). `SciChartReact` now requires `initChart` and throws a pointer error if it receives `config`.


## Useful Links

### Features & benefits

-   Learn about [features of SciChart.js](https://scichart.com/javascript-chart-features) here

### Onboarding

-   [Tutorials](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html)
-   [Getting Started Guide](https://scichart.com/getting-started/scichart-javascript/)
-   [Documentation](https://www.scichart.com/documentation/js/current/webframe.html)
-   [CodePen, JSFiddle support](https://www.scichart.com/blog/codepen-codesandbox-and-jsfiddle-support-in-scichart-js/)

### Support

-   [Community forums](https://scichart.com/questions)
-   [Stackoverflow tag](https://stackoverflow.com/tags/scichart)
-   [Contact Us (Technical support or sales)](https://scichart.com/contact-us)
