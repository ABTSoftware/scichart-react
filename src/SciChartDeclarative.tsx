"use client";

import { JSX } from "react";
import { buildChart, registerAllTypes } from "scichart";
import type { ISciChartSurfaceBase, TSurfaceDefinition } from "scichart";
import { SciChartReact } from "./SciChart";
import { IInitResult, TChartComponentPropsWithConfig, TInitFunction } from "./types";
import { initChartOnDeclarativeMessage, missingConfigMessage } from "./constants";

/**
 * Creates a chart initialization function from a Builder API config.
 * @remarks This module is the only one in the package referencing the Builder API,
 * so apps that only use {@link SciChartReact} don't bundle it.
 */
function createChartFromConfig<TSurface extends ISciChartSurfaceBase>(
    config: string | TSurfaceDefinition
): TInitFunction<TSurface, IInitResult<TSurface>> {
    return async (chartRoot: string | HTMLDivElement) => {
        // Since SciChart v6 the Builder API registers nothing on import: a chart type named only as
        // a string in a definition cannot pull its class into the bundle. Registering here rather
        // than at module scope is deliberate — this package declares every module except
        // configureDefaults side-effect-free, so a bundler may keep only the bindings it needs and
        // drop a module-scope call. registerAllTypes is idempotent.
        registerAllTypes();

        // Potentially should return 2D, 3D, or Pie Chart
        // TODO add better type handling
        const chart = (await buildChart(chartRoot, config as string)) as any;

        if ("sciChartSurface" in chart) {
            // 2D Chart
            return { sciChartSurface: chart.sciChartSurface as TSurface };
        } else if ("sciChart3DSurface" in chart) {
            // 3D Chart
            return { sciChartSurface: chart.sciChart3DSurface as TSurface };
        } else {
            // Pie Chart
            return { sciChartSurface: chart as TSurface };
        }
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
 * @param props {@link TChartComponentPropsWithConfig}
 * @returns a React wrapper component that contains a chart
 */
export function SciChartDeclarative<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase>(
    props: TChartComponentPropsWithConfig<TSurface>
): JSX.Element {
    const { config, ...chartComponentProps } = props;

    validateArgs(props);

    const initChart = createChartFromConfig<TSurface>(config);

    return <SciChartReact<TSurface, IInitResult<TSurface>> {...chartComponentProps} initChart={initChart} />;
}
