import {
    SciChartSurface,
    NumericAxis,
    SplineMountainRenderableSeries,
    XyDataSeries,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    ZoomExtentsModifier
} from "scichart";
import { SciChartReact } from "scichart-react";

export const ChartWithFallback = () => (
    <SciChartReact
        initChart={async rootElement => {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

            const xAxis = new NumericAxis(wasmContext);
            const yAxis = new NumericAxis(wasmContext);

            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(yAxis);

            sciChartSurface.renderableSeries.add(
                new SplineMountainRenderableSeries(wasmContext, {
                    dataSeries: new XyDataSeries(wasmContext, {
                        xValues: [1, 2, 3, 4],
                        yValues: [1, 4, 7, 3]
                    }),
                    fill: "#3ca832",
                    stroke: "#eb911c",
                    strokeThickness: 4,
                    opacity: 0.4
                })
            );

            sciChartSurface.chartModifiers.add(
                new ZoomPanModifier({ enableZoom: true }),
                new MouseWheelZoomModifier(),
                new ZoomExtentsModifier()
            );

            // simulate long running task
            await new Promise(resolve =>
                setTimeout(() => {
                    // never resolve to demonstrate the fallback in this axample
                    // resolve()
                }, 10000)
            );

            return { sciChartSurface };
        }}
        fallback={
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#242529",
                    top: 0,
                    left: 0,
                    width: 600,
                    height: 200,
                    fontSize: 30,
                    color: "grey",
                    textAlign: "center",
                    verticalAlign: "middle",
                    justifyContent: "stretch"
                }}
            >
                <div style={{ flex: "auto" }}> Loading...</div>
            </div>
        }
        style={{
            width: "100%",
            height: "300px"
        }}
    />
);
