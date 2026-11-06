"use client";

import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { generateGuid } from "scichart";
import type { ISciChartSurfaceBase, SciChartSurfaceBase } from "scichart";
import { SciChartGroupContext } from "./SciChartGroupContext";
import { IInitResult, TChartComponentPropsWithInit } from "./types";
import { createChartRoot, useIsMountedRef, waitForFirstRender } from "./utils";
import { wrongInitResultMessage } from "./constants";

/** @ignore */
export type TChartLifecycleOptions<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = Pick<
    TChartComponentPropsWithInit<TSurface, TInitResult>,
    "initChart" | "onInit" | "onRendered" | "onDelete" | "onInitError"
>;

/** @ignore */
export type TChartLifecycle<TInitResult> = {
    /** the element the chart is created in */
    innerContainerRef: RefObject<HTMLDivElement>;
    /** the init result, or `null` until the chart is initialized */
    initResult: TInitResult | null;
    /** `true` once the init function has resolved, until the chart is deleted */
    isInitialized: boolean;
    /** `true` once the chart is initialized and has rendered at least once, until the chart is deleted */
    isRendered: boolean;
};

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

/**
 * Creates a chart in the returned container on mount and deletes it on unmount, registering it with the
 * enclosing group, if any
 * @ignore
 */
export function useChartLifecycle<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    options: TChartLifecycleOptions<TSurface, TInitResult>
): TChartLifecycle<TInitResult> {
    const { initChart, onInit, onRendered, onDelete, onInitError } = options;

    const isMountedRef = useIsMountedRef();
    const innerContainerRef = useRef<HTMLDivElement>(null);

    const initPromiseRef = useRef<Promise<TInitResult | IInitResult<TSurface>>>();
    const initResultRef = useRef<TInitResult | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    const groupContext = useContext(SciChartGroupContext);

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

    return { innerContainerRef, initResult: initResultRef.current, isInitialized, isRendered };
}
