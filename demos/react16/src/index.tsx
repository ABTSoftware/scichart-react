import React from "react";
import ReactDOM from "react-dom";
import { SciChartSurface } from "scichart";
import { SciChartReact } from "scichart-react";

function Main() {
    return <SciChartReact config={{}} style={{ height: 600, width: 800 }} />;
}

if (typeof window !== "undefined") {
    // SciChartSurface.useWasmFromCDN();
    ReactDOM.render(<Main />, document.querySelector("#app"));
}
