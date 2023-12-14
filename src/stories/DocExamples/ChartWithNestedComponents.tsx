import {
    SciChartSurface,
    NumericAxis,
    SplineMountainRenderableSeries,
    XyDataSeries,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    ZoomExtentsModifier
} from "scichart";
import { SciChartReact, SciChartNestedOverview } from "scichart-react";

export const ChartWithNestedComponents = () => (
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

            return { sciChartSurface };
        }}
        style={{
            width: "100%",
            height: "300px"
        }}
        innerContainerProps={{ style: { height: "80%" } }}
    >
        <SciChartNestedOverview style={{ height: "20%" }} />
    </SciChartReact>
);
