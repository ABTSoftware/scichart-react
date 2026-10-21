import { useState } from "react";
import type { JSX } from "react";
import {
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { SciChartReact } from "scichart-react";
import type { TInitFunction } from "scichart-react";
import { ChartInitError } from "./ChartInitError";

/** Number of points in the generated damped-sine dataset. */
const POINT_COUNT = 800;

/** Angular step between two generated points. */
const ANGULAR_STEP = 0.02;

/** Exponential decay applied to the generated sine wave. */
const DAMPING_FACTOR = 0.004;

const LINE_STROKE = "#50C7E0";
const LINE_STROKE_THICKNESS = 3;

/**
 * Builds a deterministic damped sine wave so the example needs no data source.
 * @returns parallel arrays of x and y values consumable by {@link XyDataSeries}
 */
function createDampedSineData(): { xValues: number[]; yValues: number[] } {
    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < POINT_COUNT; i++) {
        const x = i * ANGULAR_STEP;

        xValues.push(x);
        yValues.push(Math.sin(x) * Math.exp(-DAMPING_FACTOR * i));
    }

    return { xValues, yValues };
}

/**
 * The chart initialization function passed to {@link SciChartReact}.
 *
 * It is declared at module scope on purpose: `initChart` is only read on the initial render,
 * so an inline arrow function would create a new identity on every render for no benefit.
 * @param rootElement the container element provided by the wrapper component
 * @returns the created surface, which the wrapper then owns and disposes of on unmount
 */
const initChart: TInitFunction<SciChartSurface> = async rootElement => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X" }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y" }));

    const { xValues, yValues } = createDampedSineData();

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            // the generated data is sorted in x and has no gaps; saying so skips SciChart's checks
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataIsSortedInX: true, containsNaN: false }),
            stroke: LINE_STROKE,
            strokeThickness: LINE_STROKE_THICKNESS
        })
    );

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    return { sciChartSurface };
};

/**
 * Demonstrates the imperative, code-first approach: `SciChartReact` + an `initChart` function.
 *
 * This is the recommended path. Only the SciChart.js APIs referenced by `initChart` end up in the
 * bundle - in particular the Builder API is never pulled in (see {@link DeclarativeChartExample}).
 * @returns the chart component filling its grid cell, or an error panel if initialization failed
 */
export function InitChartExample(): JSX.Element {
    const [initError, setInitError] = useState<string | null>(null);

    if (initError) {
        return <ChartInitError message={initError} />;
    }

    return (
        <SciChartReact
            initChart={initChart}
            className="chart"
            fallback={<div className="chart-fallback" />}
            onInitError={error => setInitError(String(error))}
        />
    );
}
