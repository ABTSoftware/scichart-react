"use client";

import { JSX } from "react";
import { buildChart, registerAllTypes } from "scichart";
import type {
    ISciChartSurfaceBase,
    SciChartPieSurface,
    TSurfaceDefinition,
    TWebAssemblyChart,
    TWebAssemblyChart3D
} from "scichart";
import { SciChartReact } from "./SciChart";
import { TChartComponentPropsWithConfig, TInitFunction, TSurfaceFromConfig } from "./types";
import { initChartOnDeclarativeMessage, missingConfigMessage } from "./constants";

/**
 * {@link buildChart} for any definition. Its overloads each accept one surface kind, so none
 * takes the `string | TSurfaceDefinition` union; this signature is the union of all of them.
 */
const buildAnyChart = buildChart as (
    divElementId: string | HTMLDivElement,
    definition: string | TSurfaceDefinition
) => Promise<TWebAssemblyChart | TWebAssemblyChart3D | SciChartPieSurface>;

/**
 * Creates a chart initialization function from a Builder API config.
 * @remarks This module is the only one in the package referencing the Builder API,
 * so apps that only use {@link SciChartReact} don't bundle it.
 */
function createChartFromConfig(config: string | TSurfaceDefinition): TInitFunction<ISciChartSurfaceBase> {
    return async (chartRoot: string | HTMLDivElement) => {
        // Since SciChart v6 the Builder API registers nothing on import: a chart type named only as
        // a string in a definition cannot pull its class into the bundle. Registering here rather
        // than at module scope is deliberate — this package declares every module except
        // configureDefaults side-effect-free, so a bundler may keep only the bindings it needs and
        // drop a module-scope call. registerAllTypes is idempotent.
        registerAllTypes();

        const chart = await buildAnyChart(chartRoot, config);

        if ("sciChartSurface" in chart) {
            // 2D and polar
            return { sciChartSurface: chart.sciChartSurface };
        }

        if ("sciChart3DSurface" in chart) {
            return { sciChartSurface: chart.sciChart3DSurface };
        }

        // Pie
        return { sciChartSurface: chart };
    };
}

function validateArgs<TSurface extends ISciChartSurfaceBase>(props: TChartComponentPropsWithConfig<TSurface>) {
    if (!props.config) {
        throw new Error(missingConfigMessage);
    }

    if ((props as { initChart?: unknown }).initChart) {
        throw new Error(initChartOnDeclarativeMessage);
    }
}

/**
 * The component for rendering a chart surface from a Builder API config.
 * Requires a chart definition (JSON string or configuration object) passed via `config`.
 *
 * Every built-in chart type is registered, so any definition works with no setup. That
 * convenience means the whole type universe is bundled — to avoid it, use {@link SciChartReact}
 * with an `initChart` function, which does not involve the Builder API at all.
 *
 * The surface type passed to callbacks follows the `type` field of a `config` object
 * (see {@link TSurfaceFromConfig}); a JSON string gives {@link ISciChartSurfaceBase}.
 *
 * @param props {@link TChartComponentPropsWithConfig}
 * @returns a React wrapper component that contains a chart
 */
export function SciChartDeclarative<TConfig extends string | TSurfaceDefinition>(
    props: TChartComponentPropsWithConfig<TSurfaceFromConfig<TConfig>> & { config: TConfig }
): JSX.Element;
/**
 * The component for rendering a chart surface from a Builder API config,
 * with the surface type given explicitly as `TSurface`.
 *
 * @param props {@link TChartComponentPropsWithConfig}
 * @returns a React wrapper component that contains a chart
 */
export function SciChartDeclarative<TSurface extends ISciChartSurfaceBase>(
    props: TChartComponentPropsWithConfig<TSurface>
): JSX.Element;
export function SciChartDeclarative(props: TChartComponentPropsWithConfig<ISciChartSurfaceBase>): JSX.Element {
    const { config, ...chartComponentProps } = props;

    validateArgs(props);

    const initChart = createChartFromConfig(config);

    return <SciChartReact<ISciChartSurfaceBase> {...chartComponentProps} initChart={initChart} />;
}
