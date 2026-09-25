// Scenario (c): imports only SciChartGroup from the barrel.
// Expected on webpack (barrel-skipping): near-zero scichart, no "/scichart.wasm" marker.
// On vite/rollup-family (no barrel-skip) the retained size is measured and documented, not asserted.
import { createRoot } from "react-dom/client";
import { SciChartGroup } from "scichart-react";

createRoot(document.getElementById("root")!).render(
    <SciChartGroup>
        <div>charts placeholder</div>
    </SciChartGroup>
);
