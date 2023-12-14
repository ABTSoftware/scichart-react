import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ChartWithConfigSrcCode from "!!raw-loader!./DocExamples/ChartWithConfig.tsx";
import ChartWithInitFunctionSrcCode from "!!raw-loader!./DocExamples/ChartWithInitFunction.tsx";
import ChartWithFallbackSrcCode from "!!raw-loader!./DocExamples/ChartWithConfig.tsx";
import ChartWithInitCallbackSrcCode from "!!raw-loader!./DocExamples/ChartWithInitCallback.tsx";
import ChartWithNestedComponentsSrcCode from "!!raw-loader!./DocExamples/ChartWithNestedComponents.tsx";
import { ChartWithConfig as ChartWithConfigRenderer } from "./DocExamples/ChartWithConfig";
import { ChartWithInitFunction as ChartWithInitFunctionRenderer } from "./DocExamples/ChartWithInitFunction";
import { ChartWithFallback as ChartWithFallbackRenderer } from "./DocExamples/ChartWithFallback";
import { ChartWithInitCallback as ChartWithInitCallbackRenderer } from "./DocExamples/ChartWithInitCallback";
import { ChartWithNestedComponents as ChartWithNestedComponentsRenderer } from "./DocExamples/ChartWithNestedComponents";
import { SciChartSurface } from "scichart";
import { SciChartReact } from "../SciChart";

SciChartSurface.useWasmFromCDN();
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
    title: "Example/SciChartReact",
    component: SciChartReact,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: "centered"
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
    }
} satisfies Meta<typeof SciChartReact>;

export default meta;
type Story = StoryObj<typeof SciChartReact>;

// !!! Using "render" Story approach since the "args" one has issues with the component unmounting

export const ChartWithConfig: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithConfigSrcCode } } },
    render: ChartWithConfigRenderer
};

export const ChartWithInitFunction: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithInitFunctionSrcCode } } },
    render: ChartWithInitFunctionRenderer
};

export const ChartWithFallback: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithFallbackSrcCode } } },
    render: ChartWithFallbackRenderer
};

export const ChartWithInitCallback: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithInitCallbackSrcCode } } },
    render: ChartWithInitCallbackRenderer
};

export const ChartWithNestedComponents: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithNestedComponentsSrcCode } } },
    // render: ChartWithNestedComponentsRenderer
    render: ChartWithNestedComponentsRenderer
};
