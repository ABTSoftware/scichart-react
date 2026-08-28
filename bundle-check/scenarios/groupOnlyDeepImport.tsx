// SciChartGroup via the deep './*' exports path — bypasses the barrel, so every bundler
// (not just barrel-skipping webpack) should drop configureDefaults and the scichart graph.
import { createRoot } from "react-dom/client";
import { SciChartGroup } from "scichart-react/SciChartGroup";

createRoot(document.getElementById("root")!).render(
    <SciChartGroup>
        <div>charts placeholder</div>
    </SciChartGroup>
);
