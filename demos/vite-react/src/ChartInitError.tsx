import type { JSX } from "react";

/** Props for {@link ChartInitError}. */
export interface IChartInitErrorProps {
    /** The message describing why chart initialization failed. */
    message: string;
}

/**
 * Renders in place of a chart that failed to initialize.
 *
 * Both chart components report failures through their `onInitError` callback and then keep showing
 * their `fallback` forever, so without a component like this an initialization problem is invisible
 * unless the browser console is open. Handling `onInitError` is the recommended way to surface it,
 * for example a WebAssembly binary that the server does not serve.
 * @param props see {@link IChartInitErrorProps}
 * @returns the error panel filling the space the chart would have occupied
 */
export function ChartInitError({ message }: IChartInitErrorProps): JSX.Element {
    return (
        <div className="chart chart-error" role="alert">
            <strong>The chart could not be initialized.</strong>
            <code>{message}</code>
        </div>
    );
}
