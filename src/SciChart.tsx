"use client";

import { useRef, useState, useEffect } from "react";
import { ISciChartSurfaceBase, SciChartSurface } from "scichart";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { IInitResult, TChartComponentProps, TInitFunction } from "./types";
import { useIsMountedRef, createChartRoot, createChartFromConfig } from "./utils";

function SciChartComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(props: TChartComponentProps<TSurface, TInitResult>): JSX.Element {
    const { initChart, config, fallback, onInit, innerContainerProps, ...divElementProps } = props;

    if ((!initChart && !config) || (initChart && config)) {
        throw new Error(`Only one of "initChart" or "config" props is required!`);
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
        // use base URL to resolve WASM module
        SciChartSurface.configure({
            wasmUrl: "/scichart2d.wasm",
            dataUrl: "/scichart2d.data"
        });

        const initializationFunction = initChart
            ? (initChart as TInitFunction<TSurface, TInitResult>)
            : createChartFromConfig<TSurface>(config);

        const runInit = async () => {
            return initializationFunction(chartRoot as HTMLDivElement).then(initResult => {
                if (!initResult.sciChartSurface) {
                    throw new Error(
                        `"initChart" function should resolve to an object with "sciChartSurface" property ({ sciChartSurface })`
                    );
                }
                sciChartSurfaceRef.current = initResult.sciChartSurface as TSurface;
                initResultRef.current = initResult as TInitResult;

                setIsInitialized(true);

                return initResult;
            });
        };

        // workaround to handle StrictMode
        const initPromise = initPromiseRef.current ? initPromiseRef.current.then(runInit) : runInit();
        initPromiseRef.current = initPromise;

        const performCleanup = () => {
            sciChartSurfaceRef.current!.delete();
            // Redundant cleanup which causes issue in StrictMode
            // sciChartSurfaceRef.current = undefined;
            // initResultRef.current = undefined;
        };

        return () => {
            // check if chart is already initialized or wait init to finish before deleting it
            sciChartSurfaceRef.current ? performCleanup() : initPromise.then(performCleanup);
        };
    }, []);

    useEffect(() => {
        if (isInitialized && isMountedRef.current && chartRoot) {
            const rootElement = innerContainerRef.current;
            rootElement!.appendChild(chartRoot);

            if (onInit) {
                onInit(initResultRef.current as TInitResult);
            }
        }
    }, [isInitialized]);

    const mergedInnerContainerProps = { style: { height: "100%", width: "100%" }, ...innerContainerProps };

    return isInitialized ? (
        <SciChartSurfaceContext.Provider value={initResultRef.current}>
            <div {...divElementProps}>
                <div {...mergedInnerContainerProps} ref={innerContainerRef} id={divElementId}></div>
                {props.children}
            </div>
        </SciChartSurfaceContext.Provider>
    ) : (
        <>{fallback}</> ?? null
    );
}

export const SciChartReact = SciChartComponent;
