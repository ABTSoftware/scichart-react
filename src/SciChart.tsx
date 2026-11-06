"use client";

import "./configureDefaults";
import { JSX } from "react";
import type { ISciChartSurfaceBase } from "scichart";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { IInitResult, TChartComponentPropsWithInit } from "./types";
import { defaultChartStateClassNames } from "./stateClassNames";
import { mergeStateClassNames } from "./utils";
import { useChartLifecycle } from "./useChartLifecycle";
import { DefaultFallback, fallbackWrapperStyle } from "./DefaultFallback";
import { configMovedMessage, missingInitChartMessage } from "./constants";

function validateArgs<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    props: TChartComponentPropsWithInit<TSurface, TInitResult>
) {
    if (!props.initChart) {
        throw new Error(missingInitChartMessage);
    }

    if ((props as { config?: unknown }).config) {
        throw new Error(configMovedMessage);
    }
}

function SciChartComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(props: TChartComponentPropsWithInit<TSurface, TInitResult>): JSX.Element {
    const {
        initChart,
        fallback,
        onInit,
        onRendered,
        onDelete,
        onInitError,
        innerContainerProps,
        stateClassNames,
        className,
        ...divElementProps
    } = props;

    validateArgs(props);

    const { innerContainerRef, initResult, isInitialized, isRendered } = useChartLifecycle({
        initChart,
        onInit,
        onRendered,
        onDelete,
        onInitError
    });

    const mergedInnerContainerProps = {
        ...innerContainerProps,
        style: { height: "100%", width: "100%", ...innerContainerProps?.style }
    };

    return (
        <SciChartSurfaceContext.Provider value={initResult}>
            <div
                {...divElementProps}
                className={mergeStateClassNames(
                    className,
                    { isInitialized, isRendered },
                    stateClassNames,
                    defaultChartStateClassNames
                )}
                style={{ position: "relative", ...divElementProps.style }}
            >
                <>
                    <div {...mergedInnerContainerProps} ref={innerContainerRef} />
                    {isInitialized ? props.children : null}
                </>
                {!isInitialized ? (
                    fallback ? (
                        <div style={fallbackWrapperStyle}>{fallback}</div>
                    ) : (
                        <DefaultFallback />
                    )
                ) : null}
            </div>
        </SciChartSurfaceContext.Provider>
    );
}

/**
 * The component for rendering a chart surface from an initialization function.
 * Requires an initialization function passed via `initChart` which should create a surface
 * on the provided root element and resolve to `{ sciChartSurface }`.
 *
 * To create a chart from a Builder API config/definition instead, use {@link SciChartDeclarative}.
 * @param props {@link TChartComponentPropsWithInit}
 * @returns a React wrapper component that contains a chart
 */
export const SciChartReact = SciChartComponent;
