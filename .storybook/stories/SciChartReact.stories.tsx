import type { Meta, StoryObj } from "@storybook/react";
import PrimaryChartExampleSrcCode from "!!raw-loader!./DocExamples/PrimaryChartExample";
import ChartWithConfigSrcCode from "!!raw-loader!./DocExamples/ChartWithConfig";
import ChartWithInitFunctionSrcCode from "!!raw-loader!./DocExamples/ChartWithInitFunction";
import ChartWithFallbackSrcCode from "!!raw-loader!./DocExamples/ChartWithFallback";
import ChartWithInitCallbackSrcCode from "!!raw-loader!./DocExamples/ChartWithInitCallback";
import ChartWithNestedComponentsSrcCode from "!!raw-loader!./DocExamples/ChartWithNestedComponents";
import ChartUsageWithTypescriptSrcCode from "!!raw-loader!./DocExamples/ChartUsageWithTypescript";
import ChartWith3dSurfaceSrcCode from "!!raw-loader!./DocExamples/ChartWith3dSurface";
import ChartWithPieSurfaceSrcCode from "!!raw-loader!./DocExamples/ChartWithPieSurface";
import ChartWrapperStylingSrcCode from "!!raw-loader!./DocExamples/ChartWrapperStyling";
import { PrimaryChartExample as PrimaryChartExampleRenderer } from "./DocExamples/PrimaryChartExample";
import { ChartWithConfig as ChartWithConfigRenderer } from "./DocExamples/ChartWithConfig";
import { ChartWithInitFunction as ChartWithInitFunctionRenderer } from "./DocExamples/ChartWithInitFunction";
import { ChartWithFallback as ChartWithFallbackRenderer } from "./DocExamples/ChartWithFallback";
import { ChartWithInitCallback as ChartWithInitCallbackRenderer } from "./DocExamples/ChartWithInitCallback";
import { ChartWithNestedComponents as ChartWithNestedComponentsRenderer } from "./DocExamples/ChartWithNestedComponents";
import { ChartUsageWithTypescript as ChartUsageWithTypescriptRenderer } from "./DocExamples/ChartUsageWithTypescript";
import { ChartWith3dSurface as ChartWith3dSurfaceRenderer } from "./DocExamples/ChartWith3dSurface";
import { ChartWithPieSurface as ChartWithPieSurfaceRenderer } from "./DocExamples/ChartWithPieSurface";
import { ChartWrapperStyling as ChartWrapperStylingRenderer } from "./DocExamples/ChartWrapperStyling";
import { SciChart3DSurface, SciChartSurface } from "scichart";
import { SciChartReact } from "../../src/SciChart";
import { Title, Subtitle, Description, Primary, Controls, Stories, ArgTypes } from "@storybook/blocks";

SciChartSurface.useWasmFromCDN();
SciChart3DSurface.useWasmFromCDN();

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
 * If no fallback provided, the chart will use a default one.
 */
export const ChartWithFallback: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithFallbackSrcCode } } },
    render: ChartWithFallbackRenderer
};

/**
 * To properly apply sizing and positioning to the component (or any CSS styles) consider these implementation details:
 * - SciChartReact uses several HTML elements over the basic ones required for SciChart.JS.
 * - The inner component tree looks like following
 *   - **outer**: the component propagates it props to this container element.
 *   - **inner**: rendered within `outer` container; its default styles could be overridden using the `innerContainerProps`
 *   - **rootElement**: an element created implicitly within the `inner` container and then passed to the chart initialization function;
 *     SciChart adds other required drawing layers to this element;
 *     It could  be accessed by ref via `sciChartSurface.domChartRoot`.
 *   - **children**: elements passed via children props rendered within `outer` container; These elements are provided with `SciChartSurfaceContext`.
 *   - **fallback**: rendered within `outer` container; it is displayed over the `inner` container and `children` during initialization.
 * - consider passing `disableAspect` option when creating a chart to prevent the default sizing applied by SciChart.
 */
export const ChartWrapperStyling: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWrapperStylingSrcCode } } },
    render: ChartWrapperStylingRenderer
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

/**
 * SciChartReact defines a generic function-component that accepts type parameters specifying:
 * - the returned surface type (`TSurface`)
 * - a type of an object returned by the initialization function (`TInitResult`)
 *
 * The `TInitResult` can be applied to:
 * - params of callbacks
 * - `SciChartSurfaceContext` value
 */
export const ChartUsageWithTypescript: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartUsageWithTypescriptSrcCode } } },
    render: ChartUsageWithTypescriptRenderer
};

/**
 * Creating a 3D chart with an init function is similar to the 2D chart initialization.
 * Currently 3D charts do not support initialization via config.
 */
export const ChartWith3dSurface: Story = {
    name: "Chart with 3D Surface",
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWith3dSurfaceSrcCode } } },
    render: ChartWith3dSurfaceRenderer
};

/**
 * Creating a Pie chart uses the same approach.
 * Pie Charts are supported by config definition.
 */
export const ChartWithPieSurface: Story = {
    parameters: { docs: { source: { type: "dynamic", language: "tsx", code: ChartWithPieSurfaceSrcCode } } },
    render: ChartWithPieSurfaceRenderer
};
