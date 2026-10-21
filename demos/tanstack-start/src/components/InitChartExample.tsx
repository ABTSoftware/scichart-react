import {
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartJsNavyTheme,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { SciChartReact } from "scichart-react";
import type { IInitResult } from "scichart-react";
import type { JSX } from "react";

const POINT_COUNT = 1000;

/**
 * Creates the chart on the element supplied by {@link SciChartReact}.
 *
 * This is the code-first path: everything is built from the concrete SciChart classes, so the
 * Builder API never reaches the bundle (see DeclarativeChartExample.tsx for the trade-off).
 */
async function initChart(rootElement: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis" }));

    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let index = 0; index < POINT_COUNT; index++) {
        xValues.push(index);
        yValues.push(Math.sin(index * 0.02) * Math.exp(-index / 1500));
    }

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 3,
            // the generated data is sorted in x and has no gaps; saying so skips SciChart's checks
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataIsSortedInX: true, containsNaN: false })
        })
    );

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    return { sciChartSurface };
}

/**
 * Demonstrates the recommended `SciChartReact` + `initChart` approach: the smallest possible
 * bundle, because only the SciChart classes actually referenced above are pulled in.
 */
export default function InitChartExample(): JSX.Element {
    return <SciChartReact initChart={initChart} className="example__surface" />;
}
