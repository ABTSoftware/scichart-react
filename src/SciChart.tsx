"use client";

import "./configureDefaults";
import { useRef, useState, useEffect, useContext, JSX } from "react";
import { generateGuid } from "scichart";
import type { ISciChartSurfaceBase, SciChartSurfaceBase } from "scichart";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { IInitResult, TChartComponentPropsWithInit } from "./types";
import { defaultChartStateClassNames } from "./stateClassNames";
import { useIsMountedRef, createChartRoot, mergeStateClassNames, waitForFirstRender } from "./utils";
import { SciChartGroupContext } from "./SciChartGroupContext";
import { DefaultFallback, fallbackWrapperStyle } from "./DefaultFallback";
import { configMovedMessage, missingInitChartMessage, wrongInitResultMessage } from "./constants";

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

function validateResult<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    result: TInitResult
) {
    if (!result.sciChartSurface) {
        throw new Error(wrongInitResultMessage);
    }
    markLifecycleManagedExternally(result.sciChartSurface);
    return result;
}

/**
 * This component removes the chart root before the async delete and may delete a surface twice
 * (e.g. the nested overview), so the matching memory-debug warnings are expected noise here.
 */
function markLifecycleManagedExternally(surface: ISciChartSurfaceBase) {
    // The flag lives on SciChartSurfaceBase; the ISciChartSurfaceBase interface does not expose it.
    (
        surface as ISciChartSurfaceBase & Pick<SciChartSurfaceBase, "isLifecycleManagedExternally">
    ).isLifecycleManagedExternally = true;
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

    const isMountedRef = useIsMountedRef();
    const innerContainerRef = useRef<HTMLDivElement>(null);

    const initPromiseRef = useRef<Promise<TInitResult | IInitResult<TSurface>>>();
    const initResultRef = useRef<TInitResult | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        // generate guid to distinguish between effect calls in StrictMode
        const chartId = generateGuid();
        groupContext?.addChartToGroup(chartId, false, null);

        const rootElement = innerContainerRef.current;

        const chartRoot = createChartRoot();
        rootElement!.appendChild(chartRoot);

        const initializationFunction = (root: HTMLDivElement) => initChart(root).then(validateResult);

        let cancelled = false;
        let cleanupCallback: void | (() => void);
        let stopWaitingForRender: (() => void) | undefined;

        const runInit = async () => {
            try {
                const result = await initializationFunction(chartRoot);

                // check if the component was unmounted before init finished
                if (isMountedRef.current) {
                    groupContext?.addChartToGroup(chartId, true, result);
                    initResultRef.current = result;
                    setIsInitialized(true);

                    if (onInit) {
                        cleanupCallback = onInit(result);
                    }

                    stopWaitingForRender = waitForFirstRender(result.sciChartSurface, () => {
                        setIsRendered(true);
                        onRendered?.(result);
                        groupContext?.setChartRendered(chartId);
                    });
                } else {
                    cancelled = true;
                }

                return result;
            } catch (error: any) {
                if (onInitError) {
                    onInitError(error);
                }

                groupContext?.notifyError(error);
                throw error;
            }
        };

        // workaround to handle StrictMode
        const initPromise = initPromiseRef.current ? initPromiseRef.current.then(runInit) : runInit();
        initPromiseRef.current = initPromise;

        const performCleanup = (initResult: TInitResult) => {
            stopWaitingForRender?.();

            if (!cancelled && cleanupCallback) {
                cleanupCallback();
                cleanupCallback = undefined;
            }

            if (!cancelled) {
                onDelete?.(initResult);
            }

            // TODO check if this is needed at all
            if (isMountedRef.current) {
                initResultRef.current = null;
                setIsInitialized(false);
                setIsRendered(false);
            }

            groupContext?.removeChartFromGroup(chartId);
            initResult.sciChartSurface!.delete();
        };

        return () => {
            rootElement!.removeChild(chartRoot);
            // wait for init to finish before deleting it
            initPromise.then(performCleanup);
        };
        // Runs once per chart lifecycle: re-running on callback or context identity would tear
        // down and re-create the surface.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const groupContext = useContext(SciChartGroupContext);

    const mergedInnerContainerProps = {
        ...innerContainerProps,
        style: { height: "100%", width: "100%", ...innerContainerProps?.style }
    };

    return (
        <SciChartSurfaceContext.Provider value={initResultRef.current}>
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
