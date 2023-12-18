// TODO
controls
description
required/optional
remove padding

usage with typescript
3d charts

# SciChart.React - Official React Component Wrapper for SciChart.js: High Performance [JavaScript Chart Library](https://www.scichart.com/javascript-chart-features)

SciChart.React requires core [SciChart.js](https://www.npmjs.com/package/scichart) package to work and uses it as a peer dependency.

The SciChartReact itself is MIT licensed, find the core library licensing info at [https://www.scichart.com/licensing-scichart-js/](https://www.scichart.com/licensing-scichart-js/).

## What does SciChart.React do?

-   Neatly wraps up the lifecycle of SciChart.js into a React component to ensure proper initialisation and memory cleanup.
-   Provides a number of ways to configure a chart (via JSON config or initialization function)
-   Can be used to create complex dashboards linking multiple charts (demos are coming soon!)

## Getting Started

### Prerequisites

-   `react` 16.8+
-   `scichart` 3.2.516+

### Installing

```
npm install scichart scichart-react
```

### Loading required WASM dependencies

SciChart.js requires additional WASM modules to work (`scichart2d.wasm` + `scichart2d.data` for instantiating `SciChartSurface` and `scichart3d.wasm` + `scichart3d.data` for `SciChart3DSurface`).  
The library will try to fetch the appropriate files asynchronously during runtime.
Find detailed info at [Deploying Wasm Docs](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html)

By default SciChartReact applies the following configuration:

```typescript
SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm",
    dataUrl: "/scichart2d.data"
});

SciChart3DSurface.configure({
    wasmUrl: "/scichart3d.wasm",
    dataUrl: "/scichart3d.data"
});
```

### Using

There are two ways to setup `SciChartReact`.
The component requires one of `config` or `initChart` properties to create a chart.

#### With Config

Pass a config object that will be used to generate a chart via the [Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).

```tsx
import { EAxisType, EChart2DModifierType, ESeriesType, SciChartSurface } from "scichart";
import { SciChartReact } from "scichart-react";

// Call loadWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
// Alternative methods for serving and resolving wasm are available on our website
SciChartSurface.loadWasmFromCDN();

function App() {
    return (
        <SciChartReact
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

#### With Initialization Function

Alternatively you can pass a function which should create a surface on the provided root element.

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

**NOTE** Make sure that in both cases `initChart` and `config` props do not change, as they should be only used for initial chart render.

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

### Project idea

SciChart.js has some prerequisites and specific behavior when working with. A wrapper component for a specific framework, provides a boilerplate with the required setup and simplifies the usage of the core library within the .

There are several points to consider:

-   a chart may require a root `div` element to be present in the DOM tree at the moment of initialization
-   surfaces should not reference the same root element
-   chart initialization is an asynchronous process (refer to [SciChartSurface.create]()/[SciChartSurface.createSingle]()/[SciChart3DSurface.create]()/[SciChart3DSurface.createSingle](), [SciChartPieSurface.create]() )
-   chart disposal should be managed explicitly and should be handled properly considering async initialization
-   appropriate usage of the chart lifecycle, which could consist of multiple stages: (WASM initialization) -> surface initialization -> chart setup (series, annotations, animations).
    To achieve a smooth drawing, it is important to properly control the order of code execution for chart setup, data fetching, displaying fallback, and the chart rendering itself.
-   Handling React.StrictMode
-   React component fallback
-   Context shared with nested elements

-   Overview
-   Group
-   MemoryDebugWrapper

-
