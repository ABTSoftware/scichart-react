import { EAxisType, EChart2DModifierType, ESeriesType, EThemeProviderType } from "scichart";
import type { TSurfaceDefinition } from "scichart";
import { SciChartDeclarative } from "scichart-react";
import type { JSX } from "react";

const POINT_COUNT = 1000;

const xValues: number[] = Array.from({ length: POINT_COUNT }, (_unused, index) => index);
const yValues: number[] = xValues.map(x => Math.cos(x * 0.02) * Math.exp(-x / 1500));

/**
 * The same chart expressed as a Builder API definition instead of imperative code.
 * The definition is a plain object, so it can equally be fetched as JSON at runtime.
 */
const config: TSurfaceDefinition = {
    surface: { theme: { type: EThemeProviderType.Navy } },
    xAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "X Axis" } }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: "Y Axis" } }],
    series: [
        {
            type: ESeriesType.LineSeries,
            options: { stroke: "#EC0F6C", strokeThickness: 3 },
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
 * Demonstrates `SciChartDeclarative`, the only component that reaches for the SciChart Builder API.
 *
 * Bundle-size trade-off: the Builder API is a large part of the core library (about +200 KB gzip
 * on the repository's own measurements) and it is pulled in as soon as this component is bundled.
 * Apps that only ever use `SciChartReact` with an `initChart` function never pay for it.
 */
export default function DeclarativeChartExample(): JSX.Element {
    return <SciChartDeclarative config={config} className="example__surface" />;
}
