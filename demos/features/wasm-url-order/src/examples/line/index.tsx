import { JSX } from "react";
import { FastLineRenderableSeries, NumericAxis, SciChartSurface, XyDataSeries } from "scichart";
import { SciChartReact } from "scichart-react";

const setStatus = (text: string): void => {
    document.getElementById("status")!.textContent = text;
};

const initChart = async (rootElement: string | HTMLDivElement): Promise<{ sciChartSurface: SciChartSurface }> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: [0, 1, 2, 3, 4], yValues: [0, 1, 0, 1, 0] })
        })
    );

    return { sciChartSurface };
};

export default function LineExample(): JSX.Element {
    return (
        <SciChartReact
            style={{ width: "100%", height: "100%" }}
            initChart={initChart}
            onInit={() => setStatus("chart created")}
            onInitError={(error: unknown) => setStatus(`init failed: ${String(error)}`)}
        />
    );
}
