import type { JSX } from "react";
import { EAutoRange, EAxisType, EChart2DModifierType, ESeriesType } from "scichart";
import type { TSurfaceDefinition } from "scichart";
import { SciChartDeclarative } from "scichart-react";

/** Number of points in the generated cosine wave. */
const POINT_COUNT = 1000;

/** Angular step between two generated points. */
const ANGLE_STEP = 0.02;

/** Stroke colour of the mountain series. */
const SERIES_STROKE = "#EC0F6C";

/** Fill colour of the mountain series. */
const SERIES_FILL = "#EC0F6C44";

const xValues: number[] = [];
const yValues: number[] = [];

for (let i = 0; i < POINT_COUNT; i++) {
    xValues.push(i);
    yValues.push(Math.cos(i * ANGLE_STEP) * Math.exp(-i / POINT_COUNT));
}

/**
 * The same chart expressed as a Builder API definition — plain data, no SciChart.js constructors.
 * A definition like this can equally be loaded from JSON at runtime.
 */
const chartConfig: TSurfaceDefinition = {
    xAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "X Axis", autoRange: EAutoRange.Once } }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "Y Axis", autoRange: EAutoRange.Once } }],
    series: [
        {
            type: ESeriesType.MountainSeries,
            options: { stroke: SERIES_STROKE, fill: SERIES_FILL, strokeThickness: 2 },
            xyData: { xValues, yValues, dataIsSortedInX: true, containsNaN: false }
        }
    ],
    modifiers: [
        { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
        { type: EChart2DModifierType.MouseWheelZoom },
        { type: EChart2DModifierType.ZoomExtents }
    ]
};

/**
 * Demonstrates the `config` approach of `scichart-react`.
 *
 * Trade-off versus {@link InitChartIsland}: `SciChartDeclarative` is the only component in the
 * package that references the SciChart.js Builder API, and the Builder API pulls in every chart
 * type it can build. Using this component therefore adds a significant amount to the bundle,
 * whichever series types the definition actually names. Prefer `SciChartReact` with `initChart`
 * unless the chart definition genuinely has to be data (loaded from JSON, a CMS, a server, ...).
 *
 * This component must be mounted from an `.astro` page with `client:only="react"` — see the README
 * for why `client:load` does not work with a WebGL/WASM component.
 *
 * It sizes itself to its parent rather than to a fixed pixel height. A `client:only` island renders
 * nothing on the server, so the height has to be reserved by the surrounding `.astro` markup to
 * avoid a reflow when the island mounts; see the `.chart-frame` wrapper in `src/pages/index.astro`.
 * @returns the chart island
 */
export default function DeclarativeChartIsland(): JSX.Element {
    return <SciChartDeclarative config={chartConfig} style={{ width: "100%", height: "100%" }} />;
}
