import { NumericAxis, SciChartSurface } from "scichart";
import { SciChartReact, ChartGroupLoader } from "scichart-react";

export const ChartGroupLoaderBasic = () => (
    <ChartGroupLoader style={{ minWidth: 600, display: "flex" }}>
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

                return { sciChartSurface };
            }}
            style={{ flex: "auto", minHeight: "200px" }}
        />
        <SciChartReact config={{}} style={{ flex: "auto", minHeight: "200px" }} />
        <SciChartReact config={{}} style={{ flex: "auto", minHeight: "200px" }} />
    </ChartGroupLoader>
);
