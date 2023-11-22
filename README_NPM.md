# SciChart React - React Wrapper for [SciChart.js: High Performance JavaScript Chart Library](https://www.npmjs.com/package/scichart)

## Getting Started

```
npm install scichart scichart-react
```

```tsx
import { SciChartSurface } from "scichart";
import { SciChartReact } from "scichart-react";

// Call useWasmFromCDN once before SciChart.js is initialised to load Wasm files from our CDN
// Alternative methods for serving and resolving wasm are available on our website
SciChartSurface.loadWasmFromCDN();

// Apply your licese key once before startup
SciChartSurface.setRuntimeLicenseKey("--YOUR_KEY_HERE--");

// ...

<SciChartReact config={{}} style={{ width: 600, height: 400 }} />;
```

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
