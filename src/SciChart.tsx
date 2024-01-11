"use client";

import { useRef, useState, useEffect, useContext } from "react";
import { ISciChartSurfaceBase, SciChart3DSurface, SciChartSurface } from "scichart";
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
    const initResultRef = useRef<TInitResult | null>(null);
    const sciChartSurfaceRef = useRef<TSurface>();

    const [isInitialized, setIsInitialized] = useState(false);
    const [chartRoot] = useState(createChartRoot);

    useEffect(() => {
        const rootElement = innerContainerRef.current;
        rootElement!.appendChild(chartRoot as Node);

        const initializationFunction = initChart
            ? (initChart as TInitFunction<TSurface, TInitResult>)
            : createChartFromConfig<TSurface>(config);

        // marks if destructor called for the current effect
        let isCancelled = false;

        const runInit = async (): Promise<IInitResult<TSurface>> =>
            new Promise((resolve, reject) =>
                initializationFunction(chartRoot as HTMLDivElement)
                    .then(initResult => {
                        if (!initResult.sciChartSurface) {
                            throw new Error(wrongInitResultMessage);
                        }
                        sciChartSurfaceRef.current = initResult.sciChartSurface as TSurface;
                        initResultRef.current = initResult as TInitResult;

                        if (!isCancelled) {
                            setIsInitialized(true);
                        }

                        resolve(initResult);
                    })
                    .catch(reject)
            );

        // workaround to handle StrictMode
        const initPromise = initPromiseRef.current ? initPromiseRef.current.then(runInit) : runInit();
        initPromiseRef.current = initPromise;

        const performCleanup = () => {
            if (isInitialized && onDelete) {
                onDelete(initResultRef.current as TInitResult);
            }
            sciChartSurfaceRef.current!.delete();
        };

        return () => {
            isCancelled = true;
            groupContext?.removeChartFromGroup(chartRoot);
            // check if chart is already initialized or wait init to finish before deleting it
            sciChartSurfaceRef.current ? performCleanup() : initPromise.then(performCleanup);
        };
    }, []);

    const groupContext = useContext(SciChartGroupContext);

    useEffect(() => {
        if (isInitialized && isMountedRef.current && chartRoot) {
            if (onInit) {
                onInit(initResultRef.current as TInitResult);
            }
        }

        groupContext?.addChartToGroup(chartRoot, isInitialized, initResultRef.current);
    }, [isInitialized]);

    const mergedInnerContainerProps = {
        ...innerContainerProps,
        style: { height: "100%", width: "100%", ...innerContainerProps?.style }
    };

    return (
        <SciChartSurfaceContext.Provider value={initResultRef.current}>
            <div {...divElementProps} style={{ position: "relative", ...divElementProps.style }}>
                <>
                    <div {...mergedInnerContainerProps} ref={innerContainerRef} id={divElementId} />
                    {isInitialized ? props.children : null}
                </>
                {!isInitialized ? (
                    fallback ? (
                        <div style={{ position: "absolute", height: "100%", width: "100%", top: 0, left: 0 }}>
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
