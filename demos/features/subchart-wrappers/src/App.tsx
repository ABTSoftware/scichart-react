import {
    CursorModifier,
    EAutoRange,
    EAxisType,
    ECoordinateMode,
    EThemeProviderType,
    EXyDirection,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartDefaults,
    SciChartSubSurface,
    SciChartSurface,
    TSciChart,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomPanModifier,
    chartBuilder
} from "scichart";
import { IInitResult, SciChartGroup, SciChartReact, TResolvedReturnType } from "../../../../src";
import { BottomSection, LeftSection, RightSection, SubChart, TopSection } from "../../../../src/SubChart";
import "./styles.css";

// SciChart core lib requires asynchronously loaded WASM module.
// It could be loaded from CDN or by specified path.
// check out SciChart.JS Docs for configuration info
SciChartSurface.useWasmFromCDN();
SciChartDefaults.performanceWarnings = false;

export function App() {
    return (
        <div className="App">
            <SciChartReact<SciChartSurface>
                style={{ width: 1080, height: 720 }}
                fallback={<div className="fallback">Data fetching & Chart Initialization in progress</div>}
                initChart={chartInitializationFunction}
                onInit={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                    console.log("Chart 1 onInit");
                }}
                onDelete={(initResult: TResolvedReturnType<typeof chartInitializationFunction>) => {
                    console.log("Chart 1 onDelete");
                }}
            >
                <SubChart
                    options={{
                        coordinateMode: ECoordinateMode.Relative,
                        position: new Rect(0.2, 0.2, 0.7, 0.7)
                    }}
                    onInit={initSubChart}
                    onDelete={surface => {
                        /* cleanup anything not surface related */
                    }}
                >
                    <LeftSection
                        style={{
                            width: "20%",
                            height: "100%",
                            color: "white",
                            backgroundColor: "green",
                            opacity: 0.7
                        }}
                    >
                        Left Section Content.
                        <hr />
                        Your Ad could go here
                    </LeftSection>
                    <RightSection
                        style={{
                            width: "20%",
                            height: "100%",
                            color: "white",
                            backgroundColor: "blue",
                            opacity: 0.7
                        }}
                    >
                        Left Section Content.
                        <hr />
                        Your Ad could go here
                    </RightSection>
                    <TopSection
                        style={{
                            width: "60%",
                            height: "20%",
                            marginLeft: "20%",
                            color: "white",
                            backgroundColor: "brown",
                            opacity: 0.7
                        }}
                    >
                        Top Section Content.
                        <hr />
                        Your Ad could go here
                    </TopSection>
                    <BottomSection
                        style={{
                            width: "60%",
                            height: "20%",
                            marginLeft: "20%",
                            color: "white",
                            backgroundColor: "pink",
                            opacity: 0.7
                        }}
                    >
                        Bottom Section Content.
                        <hr />
                        Your Ad could go here
                    </BottomSection>
                </SubChart>
            </SciChartReact>
        </div>
    );
}
function getData(wasmContext: TSciChart, chartNumber: number, points: number) {
    const xValues = Array.from(Array(points).keys());
    const yValues = xValues.map(x => Math.sin(x * 0.3 + chartNumber * 0.1));

    const xyDataSeries = new XyDataSeries(wasmContext, { xValues, yValues, containsNaN: false });
    return xyDataSeries;
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
                disableAspect: true,
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

    const [sciChartSurface] = await Promise.all([createChart()]);

    const wasmContext = sciChartSurface.webAssemblyContext2D;

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

const initSubChart = (sub: SciChartSubSurface) => {
    const wasmContext = sub.webAssemblyContext2D;
    sub.xAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: true,
            drawMajorGridLines: true,
            drawMajorBands: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMinorGridLines: false,
            drawLabels: true,
            growBy: new NumberRange(0, 0.2),
            labelStyle: { fontSize: 10 }
        })
    );
    sub.xAxes.get(0).labelProvider.useNativeText = true;
    sub.xAxes.get(0).labelProvider.useSharedCache = true;
    sub.yAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: true,
            drawMajorGridLines: true,
            drawMajorBands: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMinorGridLines: false,
            drawLabels: true,
            growBy: new NumberRange(0.05, 0.05),
            labelStyle: { fontSize: 10 }
        })
    );

    sub.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            dataSeries: getData(wasmContext, 2, 100)
        })
    );
    sub.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new CursorModifier({ showTooltip: true })
    );
};
