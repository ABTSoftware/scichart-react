import type { Preview } from "@storybook/react-webpack5";
import { SciChartSurface } from "scichart";

// The docs are deployed under /scichart-react/, where the library's root-absolute default
// "/scichart.wasm" does not exist; the wasm files sit next to iframe.html
SciChartSurface.configure({ wasmUrl: "scichart.wasm" });

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        docs: {
            toc: true
        }
    }
};

export default preview;
