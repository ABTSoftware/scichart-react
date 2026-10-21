import type { JSX } from "react";
import {
    EAutoRange,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import type { IInitResult } from "scichart-react";
import { SciChartReact } from "scichart-react";

/** Number of points in the generated sine wave. */
const POINT_COUNT = 1000;

/** Angular step between two generated points. */
const ANGLE_STEP = 0.02;

/** Stroke colour of the line series. */
const LINE_STROKE = "#50C7E0";

/** Stroke thickness of the line series. */
const LINE_STROKE_THICKNESS = 3;

/**
 * Builds the chart imperatively with the plain SciChart.js API.
 *
 * This is the `initChart` contract of {@link SciChartReact}: receive the root element that the
 * wrapper created, create a surface on it, and resolve with `{ sciChartSurface }`. The wrapper
 * owns the element lifecycle and calls `sciChartSurface.delete()` on unmount.
 * @param rootElement the element created by the wrapper for this chart instance
 * @returns the initialization result consumed by {@link SciChartReact}
 */
async function initChart(rootElement: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis", autoRange: EAutoRange.Once }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis", autoRange: EAutoRange.Once }));

    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < POINT_COUNT; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * ANGLE_STEP) * Math.exp(-i / POINT_COUNT));
    }

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: LINE_STROKE,
            strokeThickness: LINE_STROKE_THICKNESS,
            // the generated data is sorted in x and has no gaps; saying so skips SciChart's checks
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
                dataSeriesName: "Damped Sine",
                dataIsSortedInX: true,
                containsNaN: false
            })
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
 * Demonstrates the `initChart` approach of `scichart-react`.
 *
 * This is the recommended path: only the SciChart.js types actually referenced above end up in the
 * bundle, so the Builder API is tree-shaken away entirely.
 *
 * This component must be mounted from an `.astro` page with `client:only="react"` — see the README
 * for why `client:load` does not work with a WebGL/WASM component.
 *
 * It sizes itself to its parent rather than to a fixed pixel height. A `client:only` island renders
 * nothing on the server, so the height has to be reserved by the surrounding `.astro` markup to
 * avoid a reflow when the island mounts; see the `.chart-frame` wrapper in `src/pages/index.astro`.
 * @returns the chart island
 */
export default function InitChartIsland(): JSX.Element {
    return <SciChartReact initChart={initChart} style={{ width: "100%", height: "100%" }} />;
}
