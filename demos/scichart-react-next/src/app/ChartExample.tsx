"use client";

import { SciChartSurface } from "scichart";
import { SciChartDeclarative } from "scichart-react";

// By default scichart-react uses the following to configure how WASM module dependencies are resolved
// SciChartSurface.configure({
//     wasmUrl: "/scichart.wasm"
// });
//
// or you can load the WASM files from CDN by changing the config
// TODO replace with SciChartSurface.loadWasmFromCDN();
// eslint-disable-next-line
SciChartSurface.useWasmFromCDN();

export default function ChartExample() {
    return <SciChartDeclarative config={{}} style={{ height: 600, width: 800 }} />;
}
