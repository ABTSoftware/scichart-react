import { useRef, useEffect } from "react";
import { generateGuid, ISciChartSurfaceBase, TSurfaceDefinition, chartBuilder } from "scichart";
import { IInitResult } from "./types";

export const useIsMountedRef = () => {
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMountedRef;
};

export const createChartRoot = () => {
    // check if SSR
    if (typeof window === "undefined") {
        return null;
    }

    const internalRootElement = document.createElement("div") as HTMLDivElement;
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = "100%";
    internalRootElement.style.height = "100%";
    return internalRootElement;
};

export function createChartFromConfig<TSurface extends ISciChartSurfaceBase>(config: string | TSurfaceDefinition) {
    return async (chartRoot: string | HTMLDivElement) => {
        // @ts-ignore Potentially should return 2D, 3D, or Pie Chart
        const chart = (await chartBuilder.buildChart(chartRoot, config)) as any;
        if ("sciChartSurface" in chart) {
            // 2D Chart
            return { sciChartSurface: chart.sciChartSurface as TSurface };
        } else if ("sciChart3DSurface" in chart) {
            // 3D Chart
            return { sciChartSurface: chart.sciChart3DSurface as TSurface };
        } else {
            // Pie Chart
            return { sciChartSurface: chart as TSurface };
        }
    };
}
