"use client";

import { DetailedHTMLProps, HTMLAttributes, ReactNode, useState, JSX } from "react";
import { DefaultFallback, groupFallbackWrapperStyle } from "./DefaultFallback";
import { SciChartGroup } from "./SciChartGroup";
import { IInitResult, IStateClassNames } from "./types";
import { mergeStateClassNames } from "./utils";
import { defaultGroupStateClassNames } from "./stateClassNames";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** Props for {@link ChartGroupLoader}: a div's own props, plus the group's loading, init and state-class options */
export type TChartGroupLoaderProps = TDivProps & {
    /** a component that would be rendered while the charts are being initialized */
    fallback?: ReactNode | undefined;
    /** called once all charts are initialized, while the fallback is still shown */
    onInit?: (chartInitResults: IInitResult[]) => void;
    /**
     * called once all charts are initialized and have rendered at least once, after the fallback is removed;
     * see {@link IStateClassNames.rendered}
     */
    onRendered?: (chartInitResults: IInitResult[]) => void;
    /** a callback function used when an initialization function has thrown an error */
    onInitError?: (error: any) => void;
    /**
     * class names added to the element as the charts within the group reach each state;
     * a state left out uses its {@link defaultGroupStateClassNames} entry, and an empty string adds no class
     */
    stateClassNames?: Partial<IStateClassNames>;
};

/** The purpose of this component is to hide UI behind a spinner until the charts within it are initialized */
export const ChartGroupLoader = (props: TChartGroupLoaderProps): JSX.Element => {
    const { fallback, onInit, onRendered, onInitError, stateClassNames, className, ...divProps } = props;
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    return (
        <SciChartGroup
            onInit={(chartInitResults: IInitResult[]) => {
                onInit?.(chartInitResults);
                setIsInitialized(true);
            }}
            onRendered={(chartInitResults: IInitResult[]) => {
                onRendered?.(chartInitResults);
                setIsRendered(true);
            }}
            onInitError={onInitError}
        >
            {/* the fallback below is absolutely positioned and must resolve against this element,
                so it needs a positioned ancestor here - without it the overlay escapes to the
                nearest positioned ancestor (often the page) and lands offset from the group.
                A caller's own position wins, since divProps.style is spread last. */}
            <div
                {...divProps}
                className={mergeStateClassNames(
                    className,
                    { isInitialized, isRendered },
                    stateClassNames,
                    defaultGroupStateClassNames
                )}
                style={{ position: "relative", ...divProps.style }}
            >
                {props.children}
                {/* both branches are wrapped, so the default overlay is layered above the
                    per-chart overlays exactly as a custom one is */}
                {!isInitialized ? (
                    <div style={groupFallbackWrapperStyle}>{fallback ? fallback : <DefaultFallback />}</div>
                ) : null}
            </div>
        </SciChartGroup>
    );
};
