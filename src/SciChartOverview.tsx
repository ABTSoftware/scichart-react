"use client";

import { useContext, useRef, JSX } from "react";
import { SciChartSurface, IOverviewOptions, SciChartOverview } from "scichart";
import { IChartComponentPropsCore, IInitResult } from "./types";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { SciChartReact } from "./SciChart";

export const SciChartNestedOverview = (
    props: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions }
): JSX.Element => {
    const { options, ...chartComponentProps } = props;
    const parentSurface = useContext(SciChartSurfaceContext)!.sciChartSurface as SciChartSurface;
    const overviewRef = useRef<SciChartOverview | null>(null);
    const overviewCreatePromiseRef = useRef<Promise<SciChartOverview> | null>(null);

    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        overviewCreatePromiseRef.current = SciChartOverview.create(parentSurface, divElementId, options);
        const overview = await overviewCreatePromiseRef.current;
        overviewRef.current = overview;
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    return (
        <SciChartReact
            {...chartComponentProps}
            initChart={initChart}
            onDelete={() => {
                overviewRef.current!.delete();
            }}
        />
    );
};