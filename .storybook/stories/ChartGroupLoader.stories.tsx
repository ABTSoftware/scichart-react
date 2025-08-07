import type { Meta, StoryObj } from "@storybook/react";
import ChartGroupLoaderBasicSrc from "!!raw-loader!./DocExamples/ChartGroupLoaderBasic";
import ChartGroupLoaderCustomSrc from "!!raw-loader!./DocExamples/ChartGroupLoaderCustom";
import { ChartGroupLoaderBasic as ChartGroupLoaderBasicRenderer } from "./DocExamples/ChartGroupLoaderBasic";
import { ChartGroupLoaderCustom as ChartGroupLoaderCustomRenderer } from "./DocExamples/ChartGroupLoaderCustom";
import { EAxisType, EChart2DModifierType, ESeriesType, SciChart3DSurface, SciChartSurface } from "scichart";
import { Title, Subtitle, Description, Primary, Controls, Stories, ArgTypes } from "@storybook/blocks";
import { ChartGroupLoader } from "../../src/ChartGroupLoader";

SciChartSurface.loadWasmFromCDN();
SciChartSurface.loadWasmFromCDN();

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
    title: "Example/ChartGroupLoader",
    component: ChartGroupLoader,
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
} satisfies Meta<typeof ChartGroupLoader>;

export default meta;
type Story = StoryObj<typeof ChartGroupLoader>;

/**
 * ChartGroupLoader provides a container element with shared fallback
 */
export const BasicChartGroupLoader: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartGroupLoaderBasicSrc } } },
    render: ChartGroupLoaderBasicRenderer
};

/**
 * ChartGroupLoader provides a container element with shared fallback
 */
export const CustomChartGroupLoader: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartGroupLoaderCustomSrc } } },
    render: ChartGroupLoaderCustomRenderer
};
