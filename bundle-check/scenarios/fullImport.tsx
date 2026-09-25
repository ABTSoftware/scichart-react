// Upper bound: the entire 'scichart-react' barrel kept alive, including the Builder path.
import { createRoot } from "react-dom/client";
import * as SciChartReactAll from "scichart-react";

// keep the whole namespace reachable so nothing is dropped
(window as unknown as { sciChartReactAll: unknown }).sciChartReactAll = SciChartReactAll;

createRoot(document.getElementById("root")!).render(<div>{Object.keys(SciChartReactAll).length}</div>);
