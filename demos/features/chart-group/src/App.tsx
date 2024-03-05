import {
    EAutoRange,
    EAxisType,
    EThemeProviderType,
    NumberRange,
    SciChartDefaults,
    SciChartSurface,
    XyDataSeries,
    XyScatterRenderableSeries,
    chartBuilder
} from "scichart";
import { IInitResult, SciChartGroup, SciChartReact, TResolvedReturnType } from "../../../../src";
import "./styles.css";

// SciChart core lib requires asynchronously loaded WASM module.
// It could be loaded from CDN or by specified path.
// check out SciChart.JS Docs for configuration info
SciChartSurface.useWasmFromCDN();
SciChartDefaults.performanceWarnings = false;

export function App() {
    return (
        <div className="App">
            <SciChartGroup
                onInit={(initResults: IInitResult[]) => {
                    console.log("Group onInit", initResults);
                }}
                onDelete={(initResults: IInitResult[]) => {
                    console.log("Group onDelete", initResults);
                }}
            >
                <SciChartReact<SciChartSurface>
                    style={{ width: 600, height: 300 }}
                    fallback={<div className="fallback">Data fetching & Chart Initialization in progress</div>}
                    initChart={chartInitializationFunction}
                    onInit={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                        console.log("Chart 1 onInit");
                    }}
                    onDelete={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                        console.log("Chart 1 onDelete");
                    }}
                />
                <hr />
                <SciChartReact<SciChartSurface>
                    style={{ width: 600, height: 300 }}
                    fallback={<div className="fallback">Data fetching & Chart Initialization in progress</div>}
                    initChart={chartInitializationFunction}
                    onInit={() => {
                        console.log("Chart 2 onInit");
                    }}
                    onDelete={() => {
                        console.log("Chart 2 onDelete");
                    }}
                />
            </SciChartGroup>
        </div>
    );
}

const chartInitializationFunction = async (rootElement: string | HTMLDivElement) => {
    const createChart = async () => {
        console.log("createChart");
        // for demonstration purposes, here we have used Builder API explicitly
        const { sciChartSurface } = await chartBuilder.build2DChart(rootElement, {
            xAxes: {
                type: EAxisType.NumericAxis,
                options: {
                    autoRange: EAutoRange.Once,
                    growBy: new NumberRange(0.2, 0.2)
                }
            },
            yAxes: {
                type: EAxisType.NumericAxis,
                options: { autoRange: EAutoRange.Never }
            },
            surface: {
                theme: { type: EThemeProviderType.Dark },
                title: "Scatter Chart",
                titleStyle: {
                    fontSize: 20
                }
            }
        });

        return sciChartSurface;
    };

    // a function that simulates an async data fetching
    const getData = async () => {
        await new Promise(resolve => {
            setTimeout(() => resolve({}), 1500);
        });

        return { xValues: [0, 1, 2, 3, 4], yValues: [3, 6, 1, 5, 2] };
    };

    const [sciChartSurface, data] = await Promise.all([createChart(), getData()]);

    const wasmContext = sciChartSurface.webAssemblyContext2D;

    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                ...data
            }),
            strokeThickness: 4,
            stroke: "#216939"
        })
    );
    return { sciChartSurface };
};
