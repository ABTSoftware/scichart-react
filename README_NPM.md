# SciChart React - React Wrapper for [SciChart.js: High Performance JavaScript Chart Library](https://www.npmjs.com/package/scichart)

> **NEW!** ChangeLog
>
> Find out what's new in every Major and Minor release at the [Change Log here](https://www.scichart.com/changelog/scichart-js/)

[SciChart.js](https://www.scichart.com) is a High Performance JavaScript & TypeScript Charting library
which WebGL and WebAssembly to achieve incredible real-time and big-data performance. Fast and able to draw millions of datapoints in realtime, our charts will never cause your app to slow down again!

> SciChart has an extremely configurable and extensible API and is
> **perfect for scientific, financial, medical, engineering and enterprise applications**,
> apps with demanding performance requirements or complex and mission critical charting.

[![SciChart.js 2D 3D chart types](https://www.scichart.com/wp-content/uploads/2022/12/sc-home-collage.png)](https://www.scichart.com/javascript-chart-features)

SciChart.JS v3.2 is released! Check out

-   [Latest Changes](https://www.scichart.com/changelog/scichart-js/)
-   [v3.2 Release notes](https://www.scichart.com/scichart-js-v3-2-released/)
-   [v3.1 Release notes](https://www.scichart.com/scichart-js-v3-1-released/)
-   [v3.0 Release notes](https://www.scichart.com/scichart-js-v3-0-released) There should not be any breaking changes from v2.

## License

> SciChart.js is commercial software with a free trial, but we are planning a free community edition soon!
>
> **Licensing Links**
>
> -   [Read about our **license terms** here](https://www.scichart.com/scichart-eula)
> -   [**Start a trial** by following steps here](https://scichart.com/getting-started/scichart-javascript)
> -   [**Purchase commercial licenses** here](https://store.scichart.com)
> -   Academic usage, universities and schools qualify for a free license. Read more about this [here](https://www.scichart.com/educational-discount-programme).

## Demo Application

-   We've published a **live demo app** at [demo.scichart.com](https://demo.scichart.com) with 85 examples you can try in browser.
-   You can clone the repo for the demo app at Github: [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
-   Or, checkout our boilerplates for various popular Js frameworks:
    -   [React](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-react-scichart) + SciChart boilerplate
    -   [Vue.js](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-vue-scichart)
    -   [Angular](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-angular-scichart)
    -   [NextJs](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-nextjs)
    -   [Nuxt.js](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-nuxtjs)
    -   [Electron](https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-electron)

# Getting Started

> We've prepared a short [Getting Started guide here](https://scichart.com/getting-started/scichart-javascript).
>
> This will walk you through the entire process of starting a trial and show you where tutorials and documentation are and examples.

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

### Purchasing

-   [Pricing](https://store.scichart.com)

## Quick Start with NPM and Webpack

SciChart.js can be loaded as an ES6 module with Babel or TypeScript transpiler.

1. **Install SciChart.js**

```shell
npm i scichart
```

2. **Create a simple chart** by putting this into `src/index.js` file

```javascript
// New syntax from v3.0.284! import { all, the, things } from "scichart"
import { SciChartSurface, NumericAxis, NumericAxis, FastLineRenderableSeries } from "scichart";

// Call useWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
// Alternative methods for serving wasm from webpack or offline are available on our website
SciChartSurface.useWasmFromCDN();

// Apply your licese key once before startup
SciChartSurface.setRuntimeLicenseKey("--YOUR_KEY_HERE--");

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a line series with some data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 5, 8, 10],
        yValues: [3, 1, 7, 5, 8]
    });
    const renderableSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "steelblue"
    });
    sciChartSurface.renderableSeries.add(renderableSeries);
}

initSciChart();
```

3. **Create src/index.html file**

```html
<html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>SciChart.js Tutorial 1</title>
        <script async type="text/javascript" src="bundle.js"></script>
    </head>
    <body>
        <!-- the Div where the SciChartSurface will reside -->
        <div id="scichart-root" style="width: 800px; height: 600px;"></div>
    </body>
</html>
```

4. **Run it `npm start`**. As a result you will see a simple line chart.

> Further reading:
>
> -   See the [Getting Started Page](https://scichart.com/getting-started/scichart-javascript/) as well as our [Tutorials](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) for more information on creating your first chart

## Quick Start with Browser Bundle (Iife bundle)

[![](https://data.jsdelivr.com/v1/package/npm/scichart/badge)](https://www.jsdelivr.com/package/npm/scichart)

If your environment does not include a bundler like Parcel or Webpack, you can still load SciChart.js using the browser bundle module from [JSDlvr](https://www.jsdelivr.com/package/npm/scichart)

1. **Include index.min.js in your webpage**

```html
<!-- Always include latest scichart.js version -->
<script src="https://cdn.jsdelivr.net/npm/scichart/index.min.js" crossorigin="anonymous"></script>
<!-- or, choose specific version -->
<script src="https://cdn.jsdelivr.net/npm/scichart@3.0.284/index.min.js" crossorigin="anonymous"></script>
<!-- or, choosing latest version from 3.x -->
<script src="https://cdn.jsdelivr.net/npm/scichart@3/index.min.js" crossorigin="anonymous"></script>
```

2.**Create scichart-example.js file with a simple chart**

```javascript
// Imports when using Browser Bundle
const {
    SciChartSurface,
    SciChartDefaults,
    chartBuilder,
    SciChartJsNavyTheme,
    XyDataSeries,
    FastLineRenderableSeries,
    NumericAxis
} = SciChart;

// Option 1: Create chart with Builder API
async function initSciChartBuilderApi() {
    // Create a chart using the json builder api
    await chartBuilder.buildChart("chart0", {
        series: {
            type: "LineSeries",
            options: { stroke: "steelblue", strokeThickness: 5 },
            xyData: {
                xValues: [1, 2, 5, 8, 10],
                yValues: [3, 1, 7, 5, 8]
            }
        }
    });
}

// Option 2: Create chart with the programmatic API
async function initSciChartProgrammaticApi() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("chart1", {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 3,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 5, 8, 10],
                yValues: [3, 1, 7, 5, 8]
            })
        })
    );
}

// See deployment options for WebAssembly at https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html
// call useWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
SciChartSurface.useWasmFromCDN();
// Also, call & set runtime license key here once before scichart shown
SciChartSurface.setRuntimeLicenseKey("-- Your license key here --");

initSciChartBuilderApi();
initSciChartProgrammaticApi();
```

> [View above in CodePen](https://codepen.io/scichart/pen/ZEjjELy)

> See the full [browser bundle tutorial here](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html)

# Release notes. What's New!

Check out what's new in SciChart.js at the below pages:

-   [What's New in SciChart.js v2.0](https://www.scichart.com/documentation/js/current/What's%20New%20in%20SciChart.js%20SDK%20v2.x.html)
-   [What's New in SciChart.js v2.1](https://www.scichart.com/documentation/js/current/WhatsNewInSciChart2_1.html)
-   [What's New in SciChart.js v2.2](https://www.scichart.com/documentation/js/current/What's%20New%20in%20SciChart.js%20SDK%20v2.2.html)
-   [What's New in SciChart.js v3.0](https://www.scichart.com/scichart-js-v3-0-released)

We release often and if you want to report a bug, request a feature or give general feedback [contact us](https://scichart.com/contact-us)!
