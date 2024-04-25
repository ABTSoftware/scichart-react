"use client";

import { useRef, useState, useEffect, useContext, JSX } from "react";
import { ISciChartSurfaceBase, SciChart3DSurface, SciChartSurface, generateGuid } from "scichart";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { IInitResult, TChartComponentProps, TInitFunction } from "./types";
import { useIsMountedRef, createChartRoot, createChartFromConfig } from "./utils";
import { SciChartGroupContext } from "./SciChartGroupContext";
import { DefaultFallback } from "./DefaultFallback";
import { conflictingConfigsMessage, wrongInitResultMessage } from "./constants";

// use base URL to resolve WASM module
SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm",
    dataUrl: "/scichart2d.data"
});

SciChart3DSurface.configure({
    wasmUrl: "/scichart3d.wasm",
    dataUrl: "/scichart3d.data"
});

function SciChartComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(props: TChartComponentProps<TSurface, TInitResult>): JSX.Element {
    const { initChart, config, fallback, onInit, onDelete, innerContainerProps, ...divElementProps } = props;

    if ((!initChart && !config) || (initChart && config)) {
        throw new Error(conflictingConfigsMessage);
    }

    const [divElementId] = useState(divElementProps.id);

    const isMountedRef = useIsMountedRef();
    const innerContainerRef = useRef<HTMLDivElement>(null);

    const initPromiseRef = useRef<Promise<TInitResult | IInitResult<TSurface>>>();

    const [initResult, setInitResult] = useState<TInitResult | null>(null);
    const [chartRoot] = useState(createChartRoot);

    useEffect(() => {
        // generate guid to distinguish between effect calls in StrictMode
        const chartId = generateGuid();
        groupContext?.addChartToGroup(chartId, false, null);

        const rootElement = innerContainerRef.current;
        rootElement!.appendChild(chartRoot as Node);

        const initializationFunction = initChart
            ? initChart
            : (createChartFromConfig<TSurface>(config) as TInitFunction<TSurface, TInitResult>);

        let cancelled = false;

        const runInit = async (): Promise<TInitResult> =>
            new Promise((resolve, reject) => {
                initializationFunction(chartRoot as HTMLDivElement)
                    .then(result => {
                        if (!result.sciChartSurface) {
                            throw new Error(wrongInitResultMessage);
                        }
                        // check if the component was unmounted before init finished
                        if (isMountedRef.current && chartRoot) {
                            groupContext?.addChartToGroup(chartId, true, result);
                            setInitResult(result);

                            if (onInit) {
                                onInit(result);
                            }
                        } else {
                            cancelled = true;
                        }

                        resolve(result);
                    })
                    .catch(reject);
            });

        // workaround to handle StrictMode
        const initPromise = initPromiseRef.current ? initPromiseRef.current.then(runInit) : runInit();
        initPromiseRef.current = initPromise;

        const performCleanup = (initResult: TInitResult) => {
            if (!cancelled && onDelete) {
                onDelete(initResult);
            }
            groupContext?.removeChartFromGroup(chartId);
            initResult.sciChartSurface!.delete();
        };

        return () => {
            // wait for init to finish before deleting it
            initPromise.then(performCleanup);
        };
    }, []);

    const groupContext = useContext(SciChartGroupContext);

    const mergedInnerContainerProps = {
        ...innerContainerProps,
        style: { height: "100%", width: "100%", ...innerContainerProps?.style }
    };

    return (
        <SciChartSurfaceContext.Provider value={initResult}>
            <div {...divElementProps} style={{ position: "relative", ...divElementProps.style }}>
                <>
                    <div {...mergedInnerContainerProps} ref={innerContainerRef} id={divElementId} />
                    {initResult ? props.children : null}
                </>
                {!initResult ? (
                    fallback ? (
                        <div
                            style={{ position: "absolute", height: "100%", width: "100%", top: 0, left: 0, zIndex: 12 }}
                        >
                            {fallback}
                        </div>
                    ) : (
                        <DefaultFallback />
                    )
                ) : null}
            </div>
        </SciChartSurfaceContext.Provider>
    );
}

/**
 * The component for rendering a chart surface.
 * There are 2 ways to setup a chart.
 * It requires a chart configuration object passed via `config` or an initialization function passed via `initChart`
 * @param props {@link TChartComponentProps}
 * @returns a React wrapper component that contains a chart
 */
export const SciChartReact = SciChartComponent;
