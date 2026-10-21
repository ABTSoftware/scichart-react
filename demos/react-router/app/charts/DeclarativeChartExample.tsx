import type { ReactElement } from "react";
import { EAxisType, EChart2DModifierType, ESeriesType, type TSurfaceDefinition } from "scichart";
import { SciChartDeclarative } from "scichart-react";

const POINT_COUNT = 400;
const ANGULAR_FREQUENCY = 0.03;
const MOUNTAIN_FILL = "#2d6b8a";
const MOUNTAIN_STROKE = "#50c7e8";
const MOUNTAIN_STROKE_THICKNESS = 3;
const MOUNTAIN_OPACITY = 0.5;

/** Generates the series plotted by the declarative chart. */
function createWave(): { xValues: number[]; yValues: number[] } {
    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < POINT_COUNT; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * ANGULAR_FREQUENCY) + Math.sin(i * ANGULAR_FREQUENCY * 3) / 3);
    }

    return { xValues, yValues };
}

/**
 * The same chart expressed as a Builder API definition instead of imperative code.
 *
 * Declared at module scope so its identity is stable across renders — `SciChartDeclarative`
 * only reads `config` for the initial render.
 */
const chartConfig: TSurfaceDefinition = {
    xAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "Sample" } }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "Amplitude" } }],
    series: [
        {
            type: ESeriesType.SplineMountainSeries,
            options: {
                fill: MOUNTAIN_FILL,
                stroke: MOUNTAIN_STROKE,
                strokeThickness: MOUNTAIN_STROKE_THICKNESS,
                opacity: MOUNTAIN_OPACITY
            },
            xyData: { ...createWave(), dataIsSortedInX: true, containsNaN: false }
        }
    ],
    modifiers: [
        { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
        { type: EChart2DModifierType.MouseWheelZoom },
        { type: EChart2DModifierType.ZoomExtents }
    ]
};

/**
 * Demonstrates {@link SciChartDeclarative} — the `config` (Builder API) approach.
 *
 * Bundle-size trade-off: `SciChartDeclarative` is the only component in `scichart-react` that
 * references the SciChart Builder API, and the Builder API is a large slice of the core
 * library (about +200 KB gzip, measured in the repo's bundle-check harness). Apps
 * that only use `SciChartReact` with `initChart` never pay for it. Use this component when the
 * chart definition arrives as data — from JSON, a CMS or a saved user layout — and the
 * imperative API when the definition is code you own.
 *
 * Like the `initChart` example, this module is client-only and is loaded through `React.lazy`.
 */
export default function DeclarativeChartExample(): ReactElement {
    return (
        <SciChartDeclarative
            className="chart-panel"
            config={chartConfig}
            fallback={<div className="chart-placeholder">Initialising SciChart.js…</div>}
        />
    );
}
