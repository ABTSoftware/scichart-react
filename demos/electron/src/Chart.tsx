import { SciChartDeclarative } from "scichart-react";

// By default scichart-react uses the following to configure how WASM module dependencies are resolved
// SciChartSurface.configure({
//     wasmUrl: "/scichart.wasm"
// });
//
// or you can load the WASM files from CDN by changing the config
// SciChartSurface.useWasmFromCDN();

// since 2.0 the JSON-config chart is SciChartDeclarative; SciChartReact takes initChart
export default function ChartExample() {
    return <SciChartDeclarative config={{}} style={{ height: 600, width: 800 }} />;
}
