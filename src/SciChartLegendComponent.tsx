"use client";

import { useContext, useRef, JSX, useEffect } from "react";
import { SciChartSurface, LegendModifier, ILegendModifierOptions } from "scichart";
import { TDivProps } from "./types";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";

export interface ISciChartNestedLegendProps extends TDivProps {
    options?: Omit<ILegendModifierOptions, "placementDivId">;
}

export const SciChartNestedLegend = (props: ISciChartNestedLegendProps): JSX.Element | null => {
    const { options, ...divProps } = props;
    const legendPlacementDivRef = useRef<HTMLDivElement>(null);
    const initResult = useContext(SciChartSurfaceContext);
    const parentSurface = initResult?.sciChartSurface as SciChartSurface;
    useEffect(() => {
        const legendModifier = new LegendModifier({
            ...props?.options,
            placementDivId: legendPlacementDivRef.current as HTMLDivElement
        });

        parentSurface.chartModifiers.add(legendModifier);

        return () => {
            parentSurface.chartModifiers.remove(legendModifier, true);
        };
    }, [parentSurface]);

    return <div {...divProps} ref={legendPlacementDivRef}></div>;
};
