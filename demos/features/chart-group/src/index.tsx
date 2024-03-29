import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { SciChartMemoryDebugWrapper } from "../../../../src";

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
    <StrictMode>
        <SciChartMemoryDebugWrapper>
            <App />
        </SciChartMemoryDebugWrapper>
    </StrictMode>
);
