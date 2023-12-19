import { EColor, GradientParams, PieSegment, Point, SciChartPieSurface } from "scichart";
import { SciChartReact } from "scichart-react";

export const ChartWithPieSurface = () => (
    <SciChartReact
        initChart={async rootElement => {
            const sciChartPieSurface = await SciChartPieSurface.create(rootElement);

            const pieSegment1 = new PieSegment({
                color: EColor.Green,
                value: 10,
                text: "Green",
                delta: 10,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#1D976C", offset: 0 },
                    { color: "#93F9B9", offset: 1 }
                ])
            });
            pieSegment1.radiusAdjustment = 1.2;
            const pieSegment2 = new PieSegment({
                color: EColor.Red,
                value: 20,
                text: "Red",
                delta: 20,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#DD5E89", offset: 0 },
                    { color: "#F7BB97", offset: 1 }
                ])
            });
            pieSegment2.radiusAdjustment = 0.7;
            const pieSegment3 = new PieSegment({
                color: EColor.Blue,
                value: 30,
                text: "Blue",
                delta: 30,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#2b2828", offset: 0 },
                    { color: "#656565", offset: 1 }
                ])
            });
            const pieSegment4 = new PieSegment({
                color: EColor.Yellow,
                value: 40,
                text: "Yellow",
                delta: 40,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#F09819", offset: 0 },
                    { color: "#EDDE5D", offset: 1 }
                ])
            });

            sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);

            // the returned result should contain at least a reference to the created surface as `sciChartSurface`
            return { sciChartSurface: sciChartPieSurface };
        }}
        style={{
            aspectRatio: 2,
            minWidth: "600px",
            minHeight: "300px"
        }}
    />
);
