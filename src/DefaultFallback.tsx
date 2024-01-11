"use client";

import { useEffect, useRef, JSX } from "react";
import { DefaultSciChartLoader, SciChartSurfaceBase } from "scichart";

export const DefaultFallback = (): JSX.Element => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loader = new DefaultSciChartLoader();
        const loaderDiv = loader.addChartLoader(rootRef.current as HTMLDivElement, SciChartSurfaceBase.DEFAULT_THEME);

        return () => {
            if (rootRef.current) {
                loader.removeChartLoader(rootRef.current as HTMLDivElement, loaderDiv);
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
                background: SciChartSurfaceBase.DEFAULT_THEME.sciChartBackground
            }}
        />
    );
};
