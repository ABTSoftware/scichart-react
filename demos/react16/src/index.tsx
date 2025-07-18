import React from "react";
import ReactDOM from "react-dom";
import { SciChartSurface } from "scichart";
import { ChartGroupLoader, SciChartMemoryDebugWrapper, SciChartReact } from "scichart-react";

SciChartSurface.loadWasmFromCDN();

const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    // throw new Error("Somethin wrong!");
    return { sciChartSurface };
};
function Main() {
    return (
        <div className="App">
            <SciChartMemoryDebugWrapper>
                <ChartGroupLoader>
                    <SciChartReact initChart={drawExample} style={{ width: "80%", height: 60 }} />
                </ChartGroupLoader>
            </SciChartMemoryDebugWrapper>
        </div>
    );
}

if (typeof window !== "undefined") {
    // SciChartSurface.useWasmFromCDN();
    ReactDOM.render(<Main />, document.querySelector("#app"));
}
