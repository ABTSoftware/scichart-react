"use client";

import { SciChartMemoryDebugWrapper } from "scichart-react";
import ChartExample from "./ChartExample";
import Surface3DChart from "./Surface3DChart";

/**
 * Both charts behind the memory-debug wrapper, which enables SciChart's object registry and adds
 * the checkbox that mounts and unmounts the tree. That mount/unmount cycle is what the leak test
 * drives, and rendering the children on the first render keeps the page looking like a demo rather
 * than an empty panel.
 */
export default function Charts() {
    return (
        <SciChartMemoryDebugWrapper defaultRenderChildren>
            {/* 2D, built from a JSON definition through the Builder API */}
            <ChartExample />
            {/* 3D, built imperatively - it also pulls the charting3d wasm side module */}
            <Surface3DChart />
        </SciChartMemoryDebugWrapper>
    );
}
