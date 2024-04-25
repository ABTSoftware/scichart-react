import {
    EAutoRange,
    EAxisType,
    ELegendOrientation,
    ELegendPlacement,
    EThemeProviderType,
    FastLineRenderableSeries,
    LegendModifier,
    NumberRange,
    NumericAxis,
    SciChartDefaults,
    SciChartSurface,
    XyDataSeries,
    XyScatterRenderableSeries,
    chartBuilder
} from "scichart";
import { IInitResult, SciChartGroup, SciChartReact, TResolvedReturnType } from "../../../../src";
import { SciChartNestedLegend } from "../../../../src/SciChartLegendComponent";
import "./styles.css";

// SciChart core lib requires asynchronously loaded WASM module.
// It could be loaded from CDN or by specified path.
// check out SciChart.JS Docs for configuration info
// SciChartSurface.useWasmFromCDN();
SciChartDefaults.performanceWarnings = false;

export function App() {
    return (
        <div className="App">
            <SciChartReact<SciChartSurface>
                style={{
                    width: 600,
                    height: 300,
                    aspectRatio: 2,
                    minWidth: "600px",
                    minHeight: "300px"
                }}
                innerContainerProps={{ style: { height: "80%" } }}
                fallback={<div className="fallback">Data fetching & Chart Initialization in progress</div>}
                initChart={chartInitializationFunction}
                onInit={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                    console.log("Chart 1 onInit");
                }}
                onDelete={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                    console.log("Chart 1 onDelete");
                }}
            >
                <SciChartNestedLegend
                    style={{ background: "lightgrey", height: "20%", width: "100%" }}
                    options={{
                        orientation: ELegendOrientation.Horizontal,
                        margin: 0,
                        backgroundColor: "darkgrey"
                    }}
                />
            </SciChartReact>
        </div>
    );
}

const chartInitializationFunction = async (rootElement: string | HTMLDivElement) => {
    const createChart = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

        const xAxis = new NumericAxis(wasmContext);
        const yAxis = new NumericAxis(wasmContext);

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
            id: "lineSeries1",
            stroke: "Yellow"
        });
        sciChartSurface.renderableSeries.add(lineSeries1);
        lineSeries1.dataSeries = new XyDataSeries(wasmContext, {
            xValues: [1, 3],
            yValues: [2, 4]
        });

        const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
            id: "lineSeries2",
            stroke: "Red"
        });
        sciChartSurface.renderableSeries.add(lineSeries2);
        lineSeries2.dataSeries = new XyDataSeries(wasmContext, {
            xValues: [1, 7],
            yValues: [3, 8]
        });

        const lineSeries3 = new FastLineRenderableSeries(wasmContext, {
            id: "lineSeries3",
            stroke: "Blue"
        });
        sciChartSurface.renderableSeries.add(lineSeries3);
        lineSeries3.dataSeries = new XyDataSeries(wasmContext, {
            xValues: [1, 7],
            yValues: [6, 3]
        });

        const lineSeries4 = new FastLineRenderableSeries(wasmContext, {
            id: "lineSeries4",
            stroke: "Green"
        });
        sciChartSurface.renderableSeries.add(lineSeries4);
        lineSeries4.dataSeries = new XyDataSeries(wasmContext, {
            xValues: [10, 6],
            yValues: [6, 3]
        });

        const lineSeries5 = new FastLineRenderableSeries(wasmContext, {
            id: "lineSeries5",
            stroke: "Purple"
        });
        sciChartSurface.renderableSeries.add(lineSeries5);
        lineSeries5.dataSeries = new XyDataSeries(wasmContext, {
            xValues: [15, 8],
            yValues: [12, 6]
        });

        const lineSeries6 = new FastLineRenderableSeries(wasmContext, {
            id: "lineSeries6",
            stroke: "Orange"
        });
        sciChartSurface.renderableSeries.add(lineSeries6);
        lineSeries6.dataSeries = new XyDataSeries(wasmContext, {
            xValues: [13, 8],
            yValues: [2, 1]
        });

        return sciChartSurface;
    };

    // // a function that simulates an async data fetching
    // const getData = async () => {
    //     await new Promise(resolve => {
    //         setTimeout(() => resolve({}), 1500);
    //     });

    //     return { xValues: [0, 1, 2, 3, 4], yValues: [3, 6, 1, 5, 2] };
    // };

    const [sciChartSurface] = await Promise.all([createChart()]);

    // const wasmContext = sciChartSurface.webAssemblyContext2D;

    // sciChartSurface.renderableSeries.add(
    //     new XyScatterRenderableSeries(wasmContext, {
    //         dataSeries: new XyDataSeries(wasmContext, {
    //             ...data
    //         }),
    //         strokeThickness: 4,
    //         stroke: "#216939"
    //     })
    // );
    return { sciChartSurface };
};
