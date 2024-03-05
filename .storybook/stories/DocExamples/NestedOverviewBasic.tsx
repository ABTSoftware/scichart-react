import { EAxisType, ESeriesType, EChart2DModifierType } from "scichart";
import { SciChartReact, SciChartNestedOverview } from "scichart-react";

export const NestedOverviewBasic = () => (
    <SciChartReact
        config={{
            xAxes: [{ type: EAxisType.NumericAxis }],
            yAxes: [{ type: EAxisType.NumericAxis }],
            series: [
                {
                    type: ESeriesType.SplineMountainSeries,
                    options: {
                        fill: "#3ca832",
                        stroke: "#eb911c",
                        strokeThickness: 4,
                        opacity: 0.4
                    },
                    xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
                }
            ],
            modifiers: [
                { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
                { type: EChart2DModifierType.MouseWheelZoom },
                { type: EChart2DModifierType.ZoomExtents }
            ]
        }}
        style={{
            aspectRatio: 2,
            minWidth: "600px",
            minHeight: "300px"
        }}
        // customize size of the inner chart wrapper
        innerContainerProps={{ style: { height: "80%" } }}
    >
        <SciChartNestedOverview style={{ height: "20%" }} />
    </SciChartReact>
);
