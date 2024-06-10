import {
    EAutoRange,
    EAxisType,
    EThemeProviderType,
    FastLineRenderableSeries,
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
SciChartSurface.loadWasmFromCDN();
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
                <SciChartReact<SciChartSurface, TResolvedReturnType<typeof chartInitializationFunction>>
                    style={{ width: 600, height: 300 }}
                    fallback={<div className="fallback">Data fetching & Chart Initialization in progress</div>}
                    initChart={chartInitializationFunction}
                    onInit={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                        console.log("Chart 1 onInit");

                        const token = setInterval(initResult.updateData, 500);
                        return () => {
                            console.log("Chart 1 destructor for onInit");
                            clearInterval(token);
                        };
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
                    autoRange: EAutoRange.Always,
                    growBy: new NumberRange(0.2, 0.2)
                }
            },
            yAxes: {
                type: EAxisType.NumericAxis,
                options: { autoRange: EAutoRange.Always }
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

    const generateData = (offset: number) => {
        const xValues = Array.from(Array(20).keys()).map(x => x + offset);
        const yValues = xValues.map(() => Math.abs(Math.random() * 10));
        return { xValues, yValues };
    };

    // a function that simulates an async data fetching
    const getData = async (offset: number = 0) => {
        await new Promise(resolve => {
            setTimeout(() => resolve({}), 1500);
        });

        return generateData(offset);
    };

    const [sciChartSurface, data] = await Promise.all([createChart(), getData()]);

    const wasmContext = sciChartSurface.webAssemblyContext2D;
    const dataSeries = new XyDataSeries(wasmContext, {
        fifoCapacity: 100,
        ...data
    });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 4,
            stroke: "#216939"
        })
    );

    let lastX = data.xValues.length;
    const updateData = () => {
        const { xValues, yValues } = generateData(lastX);
        dataSeries.appendRange(xValues, yValues);
        lastX += xValues.length;
    };

    return { sciChartSurface, updateData };
};
