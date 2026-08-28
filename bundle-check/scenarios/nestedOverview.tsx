// The initChartOnly chart plus a SciChartNestedOverview child.
// Delta vs initChartOnly = the overview cost through the wrapper.
import { createRoot } from "react-dom/client";
import { SciChartReact, SciChartNestedOverview } from "scichart-react";
import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries } from "scichart";

const initChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: [0, 1, 2, 3], yValues: [0, 1, 4, 9] })
        })
    );

    return { sciChartSurface };
};

createRoot(document.getElementById("root")!).render(
    <SciChartReact initChart={initChart} innerContainerProps={{ style: { height: "80%" } }}>
        <SciChartNestedOverview style={{ height: "20%" }} />
    </SciChartReact>
);
