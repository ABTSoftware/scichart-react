import { useRef, useEffect } from "react";
import { generateGuid } from "scichart";
import type { ISciChartSurfaceBase, SciChartPieSurface } from "scichart";
import type { IStateClassNames } from "./types";

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
    const internalRootElement = document.createElement("div");
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = "100%";
    internalRootElement.style.height = "100%";
    return internalRootElement;
};

/**
 * Tells whether a surface has rendered at least once
 * @param surface the surface to check
 * @returns `true` if the surface has rendered at least once; `false` if it has not or its kind is unknown
 */
export const hasSurfaceRendered = (surface: ISciChartSurfaceBase): boolean => {
    // declared on SciChartSurfaceBase (2D, 3D, polar and sub-surfaces), not on the interface;
    // undefined until the surface's first render pass sets it
    if ("seriesViewRect" in surface) {
        return surface.seriesViewRect !== undefined;
    }

    // declared on SciChartPieSurface, which does not extend SciChartSurfaceBase;
    // a pie draws as soon as it gets a segment and draws nothing without one
    if ("pieSegments" in surface) {
        return (surface.pieSegments as SciChartPieSurface["pieSegments"]).size() > 0;
    }

    return false;
};

/**
 * Builds an element's class name from the caller's own class name and the classes of the states reached
 * @param className the caller's own class name
 * @param state the states reached
 * @param stateClassNames the class names that override the defaults; an empty string adds no class
 * @param defaultStateClassNames the class names used for any state not overridden
 * @returns the merged class name, or `undefined` if there is none
 */
export const mergeStateClassNames = (
    className: string | undefined,
    state: { isInitialized: boolean; isRendered: boolean },
    stateClassNames: Partial<IStateClassNames> | undefined,
    defaultStateClassNames: Readonly<IStateClassNames>
): string | undefined => {
    const initializedClassName = stateClassNames?.initialized ?? defaultStateClassNames.initialized;
    const renderedClassName = stateClassNames?.rendered ?? defaultStateClassNames.rendered;
    const classNames: string[] = [];

    if (className) {
        classNames.push(className);
    }

    if (state.isInitialized && initializedClassName) {
        classNames.push(initializedClassName);
    }

    if (state.isRendered && renderedClassName) {
        classNames.push(renderedClassName);
    }

    return classNames.length > 0 ? classNames.join(" ") : undefined;
};
