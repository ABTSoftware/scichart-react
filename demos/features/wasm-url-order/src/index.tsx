import { createRoot } from "react-dom/client";
import { SciChartSurface, sciChartConfig } from "scichart";
// The app's only eager import from scichart-react. Mirrors the Examples site, whose eagerly loaded
// ChartControlWrapper imports just SciChartGroup. The barrel is side-effect-free, so webpack links
// this straight to SciChartGroup.js and configureDefaults.js is not evaluated here.
import { SciChartGroup } from "scichart-react";

SciChartSurface.configure({ wasmUrl: "/demo/scichart.wasm" });

declare const require: any;
// Like the Examples site: a synchronous require.context whose modules are evaluated on call,
// i.e. after this module's own code above has run.
const examples = require.context("./examples", true, /index\.tsx$/);

const Example = examples("./line/index.tsx").default;

document.getElementById("wasm-url")!.textContent = sciChartConfig.wasmUrl ?? "(undefined)";

createRoot(document.getElementById("root")!).render(
    <SciChartGroup>
        <Example />
    </SciChartGroup>
);
