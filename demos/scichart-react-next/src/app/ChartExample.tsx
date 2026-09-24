"use client";

import { SciChartDeclarative } from "scichart-react";

// scichart-react configures SciChartSurface.configure({ wasmUrl: "/scichart.wasm" }) at import
// time, and the npm "copyWasm" script puts the _wasm directory into public/ to match, so nothing
// more is needed here. To serve the engine from a CDN instead, call
// SciChartSurface.useWasmFromCDN() before the first chart is created.

export default function ChartExample() {
    return <SciChartDeclarative config={{}} style={{ height: 600, width: 800 }} />;
}
