import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { ISciChartSurfaceBase, SciChartSurface, TSurfaceDefinition } from "scichart";

/** Describes the core return type of a chart initialization function */
export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    sciChartSurface: TSurface;
}

/** Describes the core type of a chart initialization function */
export type TInitFunction<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> = (
    rootElement: string | HTMLDivElement
) => Promise<TInitResult>;

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** @ignore */
export interface IChartComponentPropsCore<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> extends TDivProps {
    /** a component that would be rendered while the chart is being initialized */
    fallback?: ReactNode | undefined;
    /** a callback function used after the chart is initialized */
    onInit?: (initResult: TInitResult) => void;
    /** a callback function used when the component with initialized chart is unmounted */
    onDelete?: (initResult: TInitResult) => void;
    /** props passed to the inner container of the chart */
    innerContainerProps?: TDivProps;
}

/** @ignore */
export type TChartComponentPropsWithInit<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = IChartComponentPropsCore<TSurface, TInitResult> & {
    initChart: TInitFunction<TSurface, TInitResult>;
    config?: never;
};

type TChartComponentPropsWithConfig<TSurface extends ISciChartSurfaceBase> = IChartComponentPropsCore<
    TSurface,
    IInitResult<TSurface>
> & {
    initChart?: never;
    config: string | TSurfaceDefinition;
};

/** Describes allowed properties for {@link SciChartReact} */
export type TChartComponentProps<
    TSurface extends ISciChartSurfaceBase = SciChartSurface,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> | TChartComponentPropsWithConfig<TSurface>;

type TChartComponentPropsIntersection<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> & TChartComponentPropsWithConfig<TSurface>;

export type TResolvedReturnType<TFunc extends (...args: any) => any> = Awaited<ReturnType<TFunc>>;
