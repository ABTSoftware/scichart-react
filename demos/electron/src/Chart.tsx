import { SciChartReact } from "scichart-react";

// By default SciChartReact uses the following to configure how WASM module dependencies are resolved
// SciChartSurface.configure({
//     wasmUrl: "/scichart2d.wasm",
//     dataUrl: "/scichart2d.data"
// });
//
// or you can load the WASM files from CDN by changing the config
// SciChartSurface.loadWasmFromCDN();

export default function ChartExample() {
    return <SciChartReact config={{}} style={{ height: 600, width: 800 }} />;
}
