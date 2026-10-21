import { useState } from "react";
import type { JSX } from "react";
import { EAxisType, EChart2DModifierType, ESeriesType } from "scichart";
import type { TSurfaceDefinition } from "scichart";
import { SciChartDeclarative } from "scichart-react";
import { ChartInitError } from "./ChartInitError";

const AREA_FILL = "#3ca83280";
const AREA_STROKE = "#EB911C";
const AREA_STROKE_THICKNESS = 3;

/**
 * A Builder API surface definition. It is a plain object (a JSON string is accepted too), which
 * makes it easy to ship chart layouts from a server or a CMS instead of hard-coding them.
 *
 * Declared at module scope because `config`, like `initChart`, is only read on the first render.
 */
const chartConfig: TSurfaceDefinition = {
    xAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "X" } }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "Y" } }],
    series: [
        {
            type: ESeriesType.SplineMountainSeries,
            options: {
                fill: AREA_FILL,
                stroke: AREA_STROKE,
                strokeThickness: AREA_STROKE_THICKNESS
            },
            xyData: {
                xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                yValues: [3, 5, 4, 7, 6, 9, 8, 11, 9, 12],
                dataIsSortedInX: true,
                containsNaN: false
            }
        }
    ],
    modifiers: [
        { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
        { type: EChart2DModifierType.MouseWheelZoom },
        { type: EChart2DModifierType.ZoomExtents }
    ]
};

/**
 * Demonstrates the declarative approach: `SciChartDeclarative` + a Builder API `config`.
 *
 * Bundle-size trade-off: `SciChartDeclarative` is the only component that references the SciChart.js
 * Builder API, and the Builder API has to reach every chart type it might be asked to construct.
 * Using this component therefore adds about 200 KB gzip over the equivalent `initChart` chart
 * (measured in the repo's bundle-check harness). Apps that only use `SciChartReact` never pay it,
 * so reach for `config` when the chart definition is data - not merely as a shorter syntax.
 * @returns the chart component filling its grid cell, or an error panel if initialization failed
 */
export function DeclarativeChartExample(): JSX.Element {
    const [initError, setInitError] = useState<string | null>(null);

    if (initError) {
        return <ChartInitError message={initError} />;
    }

    return (
        <SciChartDeclarative
            config={chartConfig}
            className="chart"
            fallback={<div className="chart-fallback" />}
            onInitError={error => setInitError(String(error))}
        />
    );
}
