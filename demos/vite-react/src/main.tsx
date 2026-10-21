import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Could not find the #root element declared in index.html");
}

/*
 * StrictMode is intentional: in development React 19 mounts, unmounts and remounts every effect
 * once. The wrapper components handle that correctly (each surface created by `initChart` /
 * `config` is deleted on unmount), so the demo doubles as a check that no WebGL context leaks.
 */
createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);
