"use client";

import { DetailedHTMLProps, HTMLAttributes, ReactNode, useState, JSX } from "react";
import { DefaultFallback, groupFallbackWrapperStyle } from "./DefaultFallback";
import { SciChartGroup } from "./SciChartGroup";
import { IInitResult } from "./types";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type TChartGroupLoaderProps = TDivProps & {
    fallback?: ReactNode | undefined;
    onInit?: (chartInitResults: IInitResult[]) => void;
    onInitError?: (error: any) => void;
};

/** The purpose of this component is to hide UI behind a spinner until the charts within it are initialized */
export const ChartGroupLoader = (props: TChartGroupLoaderProps): JSX.Element => {
    const { fallback, onInit, onInitError, ...divProps } = props;
    const [isInitialized, setIsInitialized] = useState(false);

    return (
        <SciChartGroup
            onInit={(chartInitResults: IInitResult[]) => {
                props.onInit?.(chartInitResults);
                setIsInitialized(true);
            }}
            onInitError={onInitError}
        >
            {/* the fallback below is absolutely positioned and must resolve against this element,
                so it needs a positioned ancestor here - without it the overlay escapes to the
                nearest positioned ancestor (often the page) and lands offset from the group.
                A caller's own position wins, since divProps.style is spread last. */}
            <div {...divProps} style={{ position: "relative", ...divProps.style }}>
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
