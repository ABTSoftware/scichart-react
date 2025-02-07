"use client";

import { useContext, useRef, JSX, useEffect, CSSProperties } from "react";
import { SciChartSurface, I2DSubSurfaceOptions, SciChartSubSurface } from "scichart";
import { TDivProps } from "./types";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";

export interface ISciChartNestedLegendProps extends TDivProps {
    options?: Omit<I2DSubSurfaceOptions, "subChartContainerId">;
    onInit?: (surface: SciChartSubSurface) => void;
    onDelete?: (surface: SciChartSubSurface) => void;
}

export const SubChart = (props: ISciChartNestedLegendProps): JSX.Element | null => {
    const { options, onInit, onDelete, children, ...divProps } = props;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const initResult = useContext(SciChartSurfaceContext);
    const parentSurface = initResult?.sciChartSurface as SciChartSurface;
    useEffect(() => {
        const subChartOptions: I2DSubSurfaceOptions = {
            ...options,
            subChartContainerId: wrapperRef.current as HTMLDivElement
        };

        const subChart = parentSurface.addSubChart(subChartOptions);

        onInit?.(subChart);

        return () => {
            onDelete?.(subChart);

            parentSurface.removeSubChart(subChart);
        };
    }, [parentSurface]);

    return (
        <div {...divProps} style={{ position: "absolute" }} ref={wrapperRef}>
            {children}
        </div>
    );
};

const Section = (positionClassName: string, defaultStyle: CSSProperties) => (props: TDivProps) => {
    const mergedProps = {
        ...props,
        style: { ...defaultStyle, ...props.style },
        className: props.className ? `${positionClassName} ${props.className}` : positionClassName
    };

    return <div {...mergedProps}>{props.children}</div>;
};

export const LeftSection = Section("left-section", {
    pointerEvents: "all",
    position: "absolute",
    top: 0,
    left: 0
});

export const RightSection = Section("right-section", {
    pointerEvents: "all",
    position: "absolute",
    top: 0,
    right: 0
});
export const TopSection = Section("top-section", {
    pointerEvents: "all",
    position: "absolute",
    top: 0
});

export const BottomSection = Section("bottom-section", {
    pointerEvents: "all",
    position: "absolute",
    bottom: 0,
    left: 0
});
