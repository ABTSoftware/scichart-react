import type { ReactElement } from "react";
import {
    EAutoRange,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { SciChartReact } from "scichart-react";
import type { IInitResult } from "scichart-react";

const POINT_COUNT = 1000;
const ANGULAR_FREQUENCY = 0.02;
const DAMPING_FACTOR = 0.002;
const LINE_STROKE = "#50c7e8";
const LINE_STROKE_THICKNESS = 2;
const AXIS_GROWBY_MIN = 0.05;
const AXIS_GROWBY_MAX = 0.05;

/** Generates a damped sine wave so the example plots something with visible shape. */
function createDampedSine(): { xValues: number[]; yValues: number[] } {
    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < POINT_COUNT; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * ANGULAR_FREQUENCY) * Math.exp(-i * DAMPING_FACTOR));
    }

    return { xValues, yValues };
}

/**
 * Builds the chart imperatively with the core SciChart.js API.
 *
 * Declared at module scope on purpose — `SciChartReact` only reads `initChart` for the initial
 * render, so passing an inline arrow function would create a new identity on every render for
 * no benefit.
 *
 * @param rootElement the element (or element id) provided by `SciChartReact`
 * @returns the created surface, in the shape `SciChartReact` expects
 */
export async function initLineChart(rootElement: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Sample",
            autoRange: EAutoRange.Once
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Amplitude",
            autoRange: EAutoRange.Once,
            growBy: new NumberRange(AXIS_GROWBY_MIN, AXIS_GROWBY_MAX)
        })
    );

    const { xValues, yValues } = createDampedSine();

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
}

/**
 * Demonstrates {@link SciChartReact} — the `initChart` approach.
 *
 * This is the smaller-bundle path: only the SciChart types this file imports end up in the
 * client bundle. Compare with `DeclarativeChartExample`, which pulls in the whole Builder API.
 *
 * The module is never evaluated on the server: the `/` route loads it through `React.lazy`
 * inside `<ClientOnly>`, so `SciChartSurface.create` — which needs a real DOM element and a
 * WebGL context — can only run in the browser.
 */
export default function InitChartExample(): ReactElement {
    return (
        <SciChartReact
            className="chart-panel"
            initChart={initLineChart}
            fallback={<div className="chart-placeholder">Initialising SciChart.js…</div>}
        />
    );
}
