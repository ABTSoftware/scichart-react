import type { Meta, StoryObj } from "@storybook/react";
import PrimaryChartExampleSrcCode from "!!raw-loader!./DocExamples/PrimaryChartExample.tsx";
import ChartWithConfigSrcCode from "!!raw-loader!./DocExamples/ChartWithConfig.tsx";
import ChartWithInitFunctionSrcCode from "!!raw-loader!./DocExamples/ChartWithInitFunction.tsx";
import ChartWithFallbackSrcCode from "!!raw-loader!./DocExamples/ChartWithFallback.tsx";
import ChartWithInitCallbackSrcCode from "!!raw-loader!./DocExamples/ChartWithInitCallback.tsx";
import ChartWithNestedComponentsSrcCode from "!!raw-loader!./DocExamples/ChartWithNestedComponents.tsx";
import { PrimaryChartExample as PrimaryChartExampleRenderer } from "./DocExamples/PrimaryChartExample";
import { ChartWithConfig as ChartWithConfigRenderer } from "./DocExamples/ChartWithConfig";
import { ChartWithInitFunction as ChartWithInitFunctionRenderer } from "./DocExamples/ChartWithInitFunction";
import { ChartWithFallback as ChartWithFallbackRenderer } from "./DocExamples/ChartWithFallback";
import { ChartWithInitCallback as ChartWithInitCallbackRenderer } from "./DocExamples/ChartWithInitCallback";
import { ChartWithNestedComponents as ChartWithNestedComponentsRenderer } from "./DocExamples/ChartWithNestedComponents";
import { SciChartSurface } from "scichart";
import { SciChartReact } from "../SciChart";
import { Title, Subtitle, Description, Primary, Controls, Stories, ArgTypes } from "@storybook/blocks";
SciChartSurface.useWasmFromCDN();
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
    title: "Example/SciChartReact",
    component: SciChartReact,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: "centered",
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Primary />
                    <ArgTypes />
                    <Stories title="Examples" includePrimary={false} />
                </>
            )
        }
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"]
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof SciChartReact>;

export default meta;
type Story = StoryObj<typeof SciChartReact>;

// !!! Using "render" Story approach since the "args" one has issues with the component unmounting

export const PrimaryChartExample: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: PrimaryChartExampleSrcCode } } },
    render: PrimaryChartExampleRenderer
};

/**
 * Creating a chart using a definition object via `config` property.
 * It could also accept a serialized chart definition as a `string`.
 */
export const ChartWithConfig: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithConfigSrcCode } } },
    render: ChartWithConfigRenderer
};

/**
 * An initialization function passed via `initChart` property allows to define chart creation logic explicitly.
 */
export const ChartWithInitFunction: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithInitFunctionSrcCode } } },
    render: ChartWithInitFunctionRenderer
};

/**
 * A component provided via `fallback` prop is rendered while the initialization is in progress.
 */
export const ChartWithFallback: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithFallbackSrcCode } } },
    render: ChartWithFallbackRenderer
};

/**
 * `onInit` and `onDelete` are executed when a chart is initialized and when it is deleted respectively.
 */
export const ChartWithInitCallback: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithInitCallbackSrcCode } } },
    render: ChartWithInitCallbackRenderer
};

/**
 * A chart could contain arbitrary child elements and provides them with `SciChartSurfaceContext`.
 */
export const ChartWithNestedComponents: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithNestedComponentsSrcCode } } },
    render: ChartWithNestedComponentsRenderer
};
