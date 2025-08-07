import { useState } from "react";
import { NumericAxis, SciChartSurface } from "scichart";
import { SciChartReact, ChartGroupLoader, DefaultFallback } from "scichart-react";

// this will be displayed if error happens during initialization
const customFallback = (
    <div style={{ background: "red", height: "100%", display: "flex", justifyContent: "center" }}>
        <div
            style={{
                flex: "none",
                alignSelf: "center",
                fontSize: "1.5em",
                maxWidth: "100%",
                wordWrap: "normal",
                textAlign: "center"
            }}
        >
            This is a custom Error Message: An error occurred during initialization!
        </div>
    </div>
);

export const ChartGroupLoaderCustom = () => {
    const [hasError, setHasError] = useState(false);
    const fallback = hasError ? customFallback : <DefaultFallback />;

    return (
        <ChartGroupLoader
            fallback={fallback}
            style={{ minWidth: 600, display: "flex", height: 400, position: "relative" }}
            onInit={initResults => {
                console.log("initResults", initResults);
            }}
            onInitError={() => {
                setHasError(true);
            }}
        >
            <SciChartReact
                id="slowLoadingChart"
                initChart={async rootElement => {
                    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
                    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
                    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

                    // delay
                    await new Promise(res =>
                        setTimeout(() => {
                            res(null);
                        }, 4000)
                    );

                    throw new Error("Something wrong!");

                    return { sciChartSurface };
                }}
                style={{ flex: "auto", minHeight: "200px" }}
            />
            <SciChartReact config={{}} style={{ flex: "auto", minHeight: "200px" }} />
            <SciChartReact config={{}} style={{ flex: "auto", minHeight: "200px" }} />
        </ChartGroupLoader>
    );
};
