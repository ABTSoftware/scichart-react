import { useContext } from "react";
import {
    XyDataSeries,
    MountainAnimation,
    EAutoRange,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    SplineMountainRenderableSeries,
    easing
} from "scichart";
import { SciChartReact, SciChartSurfaceContext } from "scichart-react";

export const PrimaryChartExample = () => (
    <SciChartReact
        fallback={fallbackComponent}
        initChart={async rootElement => {
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

            const xAxis = new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(0, 9)
            });
            const yAxis = new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(0, 12)
            });

            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(yAxis);

            const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    yValues: [1, 4, 7, 3, 7, 6, 7, 4, 2, 5]
                }),
                fill: "#3ca832",
                stroke: "#eb911c",
                strokeThickness: 4,
                opacity: 0.4
            });

            sciChartSurface.renderableSeries.add(mountainSeries);

            // create a temp series for passing animation values
            const animationSeries = new XyDataSeries(wasmContext);
            // register this so it is deleted along with the main surface
            sciChartSurface.addDeletable(animationSeries);

            const updatePoints = () => {
                const numberOfPoints = 10;
                const xValues = new Array(numberOfPoints);
                const yValues = new Array(numberOfPoints);

                // Generate points
                for (let j = 0; j < numberOfPoints; ++j) {
                    xValues[j] = j;
                    yValues[j] = Math.random() * 10 + 1;
                }

                // update points
                animationSeries.clear();
                animationSeries.appendRange(xValues, yValues);

                mountainSeries.runAnimation(
                    new MountainAnimation({ duration: 300, ease: easing.outQuad, dataSeries: animationSeries })
                );
            };

            let timerId;
            const startUpdate = () => {
                clearInterval(timerId);
                timerId = setInterval(updatePoints, 400);
            };

            const stopUpdate = () => {
                clearInterval(timerId);
            };

            return { sciChartSurface, startUpdate, stopUpdate };
        }}
        onInit={initResult => {
            // enable updating the chart when it is rendered
            initResult.startUpdate();
        }}
        onDelete={initResult => {
            // do a cleanup after the component unmounts
            initResult.stopUpdate();
        }}
        style={{
            aspectRatio: 2,
            minWidth: "600px",
            minHeight: "300px"
        }}
    >
        <div style={{ display: "flex", justifyContent: "center" }}>
            <StartButton />
            <StopButton />
        </div>
    </SciChartReact>
);

const StartButton = () => {
    const initResult = useContext(SciChartSurfaceContext);
    const handleClick = () => {
        initResult.startUpdate();
    };
    return <input type="button" onClick={handleClick} value="Start Animation"></input>;
};

const StopButton = () => {
    const initResult = useContext(SciChartSurfaceContext);
    const handleClick = () => {
        initResult.stopUpdate();
    };
    return <input type="button" onClick={handleClick} value="Stop Animation"></input>;
};

const fallbackComponent = (
    <div
        style={{
            aspectRatio: 2,
            minWidth: "600px",
            minHeight: "300px",
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
);
