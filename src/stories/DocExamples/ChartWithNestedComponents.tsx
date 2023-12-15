import { useContext } from "react";
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
import { SciChartReact, SciChartSurfaceContext } from "scichart-react";

export const ChartWithNestedComponents = () => (
    <SciChartReact
        initChart={async rootElement => {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

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
            minHeight: "300px"
        }}
        innerContainerProps={{ style: { height: "80%" } }}
    >
        {/* The child components will be rendered only after the surface initialization */}
        <ToggleThemeButton />
    </SciChartReact>
);

const ToggleThemeButton = () => {
    // get the resolved result of initChart
    const initResult = useContext(SciChartSurfaceContext);
    const handleClick = () => {
        initResult.toggleChartTheme();
    };
    return <input type="button" onClick={handleClick} value="Toggle Chart Theme"></input>;
};
