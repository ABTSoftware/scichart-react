import type { IStateClassNames } from "./types";

/** The class names a chart component uses for any state not overridden by its `stateClassNames` prop */
export const defaultChartStateClassNames: Readonly<IStateClassNames> = Object.freeze({
    initialized: "scichart_initialized",
    rendered: "scichart_rendered"
});

/** The class names {@link ChartGroupLoader} uses for any state not overridden by its `stateClassNames` prop */
export const defaultGroupStateClassNames: Readonly<IStateClassNames> = Object.freeze({
    initialized: "scichart_group_initialized",
    rendered: "scichart_group_rendered"
});
