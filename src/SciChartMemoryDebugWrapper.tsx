"use client";

import { ChangeEventHandler, MouseEventHandler, PropsWithChildren, useState, JSX, useCallback } from "react";
import { SciChartSurface, MemoryUsageHelper } from "scichart";

/**
 * SciChartMemoryDebugWrapper is used to help checking memory leaks related to SciChart.
 * Rendering the component enables Memory Debug Mode and adds extra UI elements to allow easily mount/unmount the child components
 * @remarks Find more info at [Memory Leak Debugging docs](https://www.scichart.com/documentation/js/v6/2d-charts/performance-tips/memory-leak-debugging/)
 */
export function SciChartMemoryDebugWrapper(
    props: PropsWithChildren<{
        /** Whether the child components are rendered on the first render. Defaults to false */
        defaultRenderChildren?: boolean;
    }>
): JSX.Element {
    useState(() => {
        MemoryUsageHelper.isMemoryUsageDebugEnabled = true;
        SciChartSurface.autoDisposeWasmContext = true;
        SciChartSurface.wasmContextDisposeTimeout = 0;
    });

    const [drawChart, setDrawChart] = useState(props.defaultRenderChildren ?? false);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = e => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore force garbage collection in Chrome if enabled with --js-flags="--expose-gc"
        window.gc && window.gc();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log("state", state);
    };

    return (
        <>
            {/* Sticky rather than fixed, and the children sit outside it. A fixed box with no
                width shrink-wraps to its content, so children rendered inside it lost their
                sizing - a chart asking for a percentage width resolved it against the collapsed
                box - and, being out of flow, anything below the fold could not be scrolled to.
                Sticky keeps the controls in view while leaving the children in normal flow. */}
            <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff" }}>
                <input type="checkbox" checked={drawChart} onChange={handleCheckbox} /> Render Child Components Tree
                <br />
                <input type="button" onClick={handleClick} value="Log Object Registry State"></input>
            </div>
            {drawChart ? props.children : null}
        </>
    );
}
