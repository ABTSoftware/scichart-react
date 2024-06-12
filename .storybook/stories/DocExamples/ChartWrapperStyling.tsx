import {
    SciChartSurface,
    NumericAxis,
    SplineMountainRenderableSeries,
    XyDataSeries,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    SciChartJSDarkTheme,
    SciChartJSLightTheme
} from "scichart";
import { SciChartReact } from "scichart-react";

export const ChartWrapperStyling = () => (
    <SciChartReact
        initChart={async rootElement => {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
                disableAspect: true
            });

            sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
            sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

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

            const toggleChartTheme = () => {
                sciChartSurface.applyTheme(
                    sciChartSurface.themeProvider.isLightBackground
                        ? new SciChartJSDarkTheme()
                        : new SciChartJSLightTheme()
                );
            };

            return { sciChartSurface, toggleChartTheme };
        }}
        style={{
            aspectRatio: 2,
            minWidth: "600px",
            minHeight: "300px",
            boxSizing: "border-box",
            backgroundColor: "darkslategrey",
            padding: 10
        }}
        innerContainerProps={{
            style: { backgroundColor: "darkgrey", boxSizing: "border-box", height: "80%", padding: 10 }
        }}
    >
        {/* The child components will be rendered only after the surface initialization */}
        <NestedComponent />
    </SciChartReact>
);

const NestedComponent = () => {
    return (
        <div style={{ background: "lightgrey", height: "20%", width: "100%", textAlign: "center" }}>
            Nested Component Content
        </div>
    );
};
