import type { Meta, StoryObj } from "@storybook/react";
import NestedOverviewBasicSrc from "!!raw-loader!./DocExamples/NestedOverviewBasic";
import { NestedOverviewBasic as NestedOverviewBasicRenderer } from "./DocExamples/NestedOverviewBasic";
import { EAxisType, EChart2DModifierType, ESeriesType, SciChart3DSurface, SciChartSurface } from "scichart";
import { Title, Subtitle, Description, Primary, Controls, Stories, ArgTypes } from "@storybook/blocks";
import { SciChartNestedOverview } from "../../src/SciChartOverview";
import { SciChartReact } from "../../src/SciChart";

// SciChartSurface.loadWasmFromCDN();
// SciChartSurface.loadWasmFromCDN();
SciChartSurface.useWasmFromCDN();
SciChart3DSurface.useWasmFromCDN();

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
    title: "Example/SciChartOverview",
    component: SciChartNestedOverview,
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
} satisfies Meta<typeof SciChartNestedOverview>;

export default meta;
type Story = StoryObj<typeof SciChartNestedOverview>;

/**
 * SciChartNestedOverview creates an overview component for the parent chart
 */
export const BasicNestedOverview: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: NestedOverviewBasicSrc } } },
    render: NestedOverviewBasicRenderer
};
