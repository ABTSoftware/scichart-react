import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import type { ISciChartSurfaceBase, SciChartSurface, TSurfaceDefinition } from "scichart";

/** Describes the core return type of a chart initialization function */
export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    /** the created surface; deleted on unmount */
    sciChartSurface: TSurface;
    /**
     * an optional callback to clean up disposable entities, other than the surface, created within `initChart`.
     * Executes on unmount, even if init has not finished, before the surface is deleted
     */
    destructor?: TCleanupCallback;
}

/**
 * Describes the type of a chart initialization function
 * @param rootElement the internal element that should be used to create a chart
 * @returns a Promise with the initialization result object containing the created surface reference as `sciChartSurface` property
 */
export type TInitFunction<
    TSurface extends ISciChartSurfaceBase = SciChartSurface,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> = (rootElement: string | HTMLDivElement) => Promise<TInitResult>;

/** @ignore */
export type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** @ignore */
export type TCleanupCallback = () => void;

/** Class names a component adds to its element as its charts reach each state */
export interface IStateClassNames {
    /** added once the charts are initialized */
    initialized: string;
    /**
     * added once the charts are initialized and have rendered at least once.
     * A chart has rendered once its surface has raised its `rendered` event, which does not mean it is on screen
     * yet; a pie chart raises it only once it has a segment
     */
    rendered: string;
}

/** Describes the common properties shared by {@link SciChartReact} and {@link SciChartDeclarative} */
export interface IChartComponentPropsCore<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> extends TDivProps {
    /** a component that would be rendered while the chart is being initialized */
    fallback?: ReactNode | undefined;
    /**
     * called after init, before the fallback is removed; skipped if unmounted earlier.
     * May return a cleanup function
     */
    onInit?: (initResult: TInitResult) => TCleanupCallback | void;
    /**
     * called after the first render, once the fallback is removed; see {@link IStateClassNames.rendered}.
     * May return a cleanup function
     */
    onRendered?: (initResult: TInitResult) => TCleanupCallback | void;
    /**
     * called on unmount, before the surface is deleted; skipped if `onInit` was.
     * For what `initChart` created, use {@link IInitResult.destructor}
     */
    onDelete?: (initResult: TInitResult) => void;
    /** called when the initialization function or `onInit` throws */
    onInitError?: (err?: any) => void;
    /** props passed to the inner container of the chart */
    innerContainerProps?: TDivProps;
    /**
     * class names added to the element as the chart reaches each state;
     * a state left out uses its {@link defaultChartStateClassNames} entry, and an empty string adds no class
     */
    stateClassNames?: Partial<IStateClassNames>;
}

/** Describes allowed properties for {@link SciChartReact} */
export type TChartComponentPropsWithInit<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = IChartComponentPropsCore<TSurface, TInitResult> & {
    /**
     * An initialization function which should return surface instance created on the provided root element.
     */
    initChart: TInitFunction<TSurface, TInitResult>;
    config?: never;
};

/** Describes allowed properties for {@link SciChartDeclarative} */
export type TChartComponentPropsWithConfig<TSurface extends ISciChartSurfaceBase> = IChartComponentPropsCore<
    TSurface,
    IInitResult<TSurface>
> & {
    initChart?: never;
    /**
     * A string with chart definition or configuration object acceptable by SciChart Builder API
     */
    config: string | TSurfaceDefinition;
};

/**
 * Describes allowed properties for either {@link SciChartReact} or {@link SciChartDeclarative}
 * @deprecated since 2.0 the `initChart` and `config` approaches are separate components —
 * use {@link TChartComponentPropsWithInit} for {@link SciChartReact}
 * and {@link TChartComponentPropsWithConfig} for {@link SciChartDeclarative}
 */
export type TChartComponentProps<
    TSurface extends ISciChartSurfaceBase = SciChartSurface,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> | TChartComponentPropsWithConfig<TSurface>;

export type TResolvedReturnType<TFunc extends (...args: any) => any> = Awaited<ReturnType<TFunc>>;
