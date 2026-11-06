import { useState } from "react";
import { NumericAxis, SciChartSurface } from "scichart";
import { SciChartReact, SciChartDeclarative, ChartGroupLoader } from "scichart-react";

// this will be displayed while the charts are being initialized
const customLoader = (
    <div
        style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#242529",
            fontSize: 30,
            color: "grey"
        }}
    >
        Loading...
    </div>
);

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
    const fallback = hasError ? customFallback : customLoader;

    return (
        <ChartGroupLoader
            fallback={fallback}
            style={{ minWidth: 600, display: "flex", position: "relative" }}
            onInit={initResults => {
                console.log("initialized", initResults.length, "charts");
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
                        }, 2000)
                    );

                    // this story exists to show the group's error path, so the throw is the point
                    // and the return below is deliberately never reached
                    throw new Error("Something wrong!");

                    // eslint-disable-next-line no-unreachable
                    return { sciChartSurface };
                }}
                style={{ flex: "auto", minHeight: "200px" }}
            />
            <SciChartDeclarative config={{}} style={{ flex: "auto", minHeight: "200px" }} />
            <SciChartDeclarative config={{}} style={{ flex: "auto", minHeight: "200px" }} />
        </ChartGroupLoader>
    );
};
