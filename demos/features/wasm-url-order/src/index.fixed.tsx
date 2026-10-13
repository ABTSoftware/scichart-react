// The workaround the Examples site adopted: evaluate the wrapper's defaults first, so the app's
// configure() below runs last and wins.
import "scichart-react/configureDefaults";
import { createRoot } from "react-dom/client";
import { SciChartSurface, sciChartConfig } from "scichart";
import { SciChartGroup } from "scichart-react";

SciChartSurface.configure({ wasmUrl: "/demo/scichart.wasm" });

declare const require: any;
const examples = require.context("./examples", true, /index\.tsx$/);

const Example = examples("./line/index.tsx").default;

document.getElementById("wasm-url")!.textContent = sciChartConfig.wasmUrl ?? "(undefined)";

createRoot(document.getElementById("root")!).render(
    <SciChartGroup>
        <Example />
    </SciChartGroup>
);
