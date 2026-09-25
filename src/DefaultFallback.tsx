"use client";

import { useEffect, useRef, JSX, CSSProperties } from "react";
import { DefaultSciChartLoader, SciChartSurfaceBase } from "scichart";

export const DefaultFallback = (): JSX.Element => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const rootElement = rootRef.current as HTMLDivElement;
        const loader = new DefaultSciChartLoader();
        const loaderDiv = loader.addChartLoader(rootElement, SciChartSurfaceBase.DEFAULT_THEME);

        return () => {
            if (rootElement) {
                loader.removeChartLoader(rootElement, loaderDiv);
            }
        };
    }, []);

    return (
        <div
            ref={rootRef}
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                textAlign: "center",
                background: SciChartSurfaceBase.DEFAULT_THEME.sciChartBackground
            }}
        />
    );
};

/**
 * Stacking order for the two kinds of loading overlay. A group's overlay has to cover the
 * per-chart overlays of the charts inside it, so it sits one layer above. Both participate in
 * the same stacking context: a chart's wrapper is positioned but has z-index auto, so it
 * creates no context of its own and its fallback's z-index competes with the group's directly.
 * @ignore
 */
const chartFallbackZIndex = 12;
/** @ignore */
const groupFallbackZIndex = chartFallbackZIndex + 1;

/** @ignore */
export const fallbackWrapperStyle: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: chartFallbackZIndex
};

/**
 * Wrapper for a chart group's loading overlay. Identical to {@link fallbackWrapperStyle} but one
 * layer higher, so the group's overlay hides the charts and their own overlays rather than
 * showing through the gaps between them.
 * @ignore
 */
export const groupFallbackWrapperStyle: CSSProperties = {
    ...fallbackWrapperStyle,
    zIndex: groupFallbackZIndex
};
