// Compile-time checks for SciChartDeclarative typing; run by `npm run typecheck`, never executed.
import {
    ESciChartSurfaceType,
    ISciChartSurfaceBase,
    SciChart3DSurface,
    SciChartPieSurface,
    SciChartPolarSurface,
    SciChartSurface
} from "scichart";
import { SciChartDeclarative } from "../../src/SciChartDeclarative";

/** Fails to compile unless `TActual` and `TExpected` are the same type. */
type TExact<TActual, TExpected> = [TActual] extends [TExpected]
    ? [TExpected] extends [TActual]
        ? true
        : false
    : false;

function assertType<TCheck extends true>(): void {}

export const inferred3D = (
    <SciChartDeclarative
        config={{ type: ESciChartSurfaceType.Default3D, options: {} }}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, SciChart3DSurface>>();
        }}
    />
);

export const inferredPie = (
    <SciChartDeclarative
        config={{ type: ESciChartSurfaceType.Pie2D, options: {} }}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, SciChartPieSurface>>();
        }}
    />
);

export const inferredPolar = (
    <SciChartDeclarative
        config={{ type: ESciChartSurfaceType.Polar2D, options: {} }}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, SciChartPolarSurface>>();
        }}
    />
);

export const inferred2DExplicitType = (
    <SciChartDeclarative
        config={{ type: ESciChartSurfaceType.Default2D, options: {} }}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, SciChartSurface>>();
        }}
    />
);

export const inferred2DNoType = (
    <SciChartDeclarative
        config={{}}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, SciChartSurface>>();
        }}
    />
);

declare const jsonConfig: string;

export const inferredFromString = (
    <SciChartDeclarative
        config={jsonConfig}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, ISciChartSurfaceBase>>();
        }}
    />
);

export const explicitTypeArgument = (
    <SciChartDeclarative<SciChart3DSurface>
        config={jsonConfig}
        onInit={({ sciChartSurface }) => {
            assertType<TExact<typeof sciChartSurface, SciChart3DSurface>>();
        }}
    />
);

export const inferredMembers = (
    <SciChartDeclarative
        config={{ type: ESciChartSurfaceType.Default3D, options: {} }}
        onInit={({ sciChartSurface }) => {
            sciChartSurface.camera.position;
            // @ts-expect-error 2D axes do not exist on a 3D surface
            sciChartSurface.xAxes;
        }}
    />
);
