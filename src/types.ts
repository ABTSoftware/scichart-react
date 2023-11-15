import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { ISciChartSurfaceBase, TSurfaceDefinition } from "scichart";

export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    sciChartSurface: TSurface;
}

export type TInitFunction<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> = (
    rootElementId: string | HTMLDivElement
) => Promise<TInitResult>;

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface IChartComponentPropsCore<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> extends TDivProps {
    fallback?: ReactNode | undefined;
    onInit?: (initResult?: TInitResult) => void;
    innerContainerProps?: TDivProps;
}

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

export type TChartComponentProps<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> =
    | TChartComponentPropsWithInit<TSurface, TInitResult>
    | TChartComponentPropsWithConfig<TSurface>;

type TChartComponentPropsIntersection<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> & TChartComponentPropsWithConfig<TSurface>;

