import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SciChartReact } from "..";
import {
    EAxisType,
    EChart2DModifierType,
    ELabelProviderType,
    EPaletteProviderType,
    EPointMarkerType,
    ESeriesType,
    SciChartSurface,
    TSurfaceDefinition
} from "scichart";
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

const config: TSurfaceDefinition = {
    surface: { theme: { type: "DarkV2", axisTitleColor: "#96ccfa", sciChartBackground: "#0c0136" } },
    series: {
        type: ESeriesType.LineSeries,
        options: {
            pointMarker: { type: EPointMarkerType.Ellipse, options: { width: 9, height: 9 } },
            paletteProvider: {
                type: EPaletteProviderType.DataPointSelection,
                options: { stroke: undefined, fill: "white" }
            }
        },
        xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3], metadata: { isSelected: false } }
    },
    modifiers: [
        {
            type: EChart2DModifierType.DataPointSelection,
            options: { allowClickSelect: true, allowDragSelect: true }
        },
        { type: EChart2DModifierType.MouseWheelZoom }
    ]
};

// !!! Using "render" Story approach since the "args" one has issues with the component unmounting

export const ChartWithConfig: Story = {
    render: () => (
        <SciChartReact
            config={config}
            style={{
                width: 600,
                height: 200
            }}
        />
    )
};

// TODO
// export const ChartWithInitFunction: Story = {
//     render: () => (
//         <SciChartReact
//             config={config}
//             style={{
//                 width: 600,
//                 height: 200
//             }}
//         />
//     )
// };

// export const ChartWithConfig: Story = {
//     args: {
//         config,
//         style: {
//             width: 600,
//             height: 200
//         }
//     }
// };

// export const ChartWithInitFunction: Story = {
//     args: {
//         config,
//         style: {
//             width: 600,
//             height: 200
//         }
//     }
// };

// export const ChartWithFallback: Story = {
//     args: {
//         config,
//         style: {
//             width: 600,
//             height: 200
//         }
//     }
// };

// export const ChartWithInitCallback: Story = {
//     args: {
//         config,
//         style: {
//             width: 600,
//             height: 200
//         }
//     }
// };

// export const ChartStyling: Story = {
//     args: {
//         config,
//         style: {
//             width: 600,
//             height: 200
//         }
//     }
// };

// export const ChartWithNestedComponents: Story = {
//     args: {
//         config,
//         style: {
//             width: 600,
//             height: 200
//         }
//     }
// };
