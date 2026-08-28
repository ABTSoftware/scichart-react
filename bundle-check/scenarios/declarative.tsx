// Scenario (b): Builder-config consumer via SciChartDeclarative.
// Expected: configureDefaults survives AND the Builder API is present ("buildChart" marker).
import { createRoot } from "react-dom/client";
import { SciChartDeclarative } from "scichart-react";

const config = {
    xAxes: [{ type: "NumericAxis" }],
    yAxes: [{ type: "NumericAxis" }],
    series: [{ type: "LineSeries", xyData: { xValues: [0, 1, 2, 3], yValues: [0, 1, 4, 9] } }]
} as any;

createRoot(document.getElementById("root")!).render(<SciChartDeclarative config={config} />);
