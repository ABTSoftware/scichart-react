"use client";

import {
    CameraController,
    EDrawMeshAs,
    GradientColorPalette,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SurfaceMeshRenderableSeries3D,
    UniformGridDataSeries3D,
    Vector3,
    zeroArray2D
} from "scichart";
import { SciChartReact } from "scichart-react";

const GRID_SIZE = 25;

/** Builds the heightmap the surface mesh is drawn from. */
function createHeightmap(): number[][] {
    const heightmap: number[][] = zeroArray2D([GRID_SIZE, GRID_SIZE]);

    for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const xValue = (x / GRID_SIZE) * 25.0;
            const zValue = (z / GRID_SIZE) * 25.0;

            heightmap[z][x] = Math.sin(xValue * 0.2) / ((zValue + 1) * 2);
        }
    }

    return heightmap;
}

/**
 * A 3D surface mesh chart.
 *
 * Since SciChart v6 the 3D engine is a side module the core fetches on demand
 * (`scichart-charting3d.wasm`), resolved next to the configured `wasmUrl` - so this is what
 * proves the npm "copyWasm" script put the whole _wasm directory where the core can find it.
 * 3D charts are built with `initChart`; the `config` prop and `SciChartDeclarative` are 2D only.
 */
export default function Surface3DChart() {
    return (
        <SciChartReact
            style={{ width: 800, height: 500 }}
            initChart={async rootElement => {
                const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement);

                sciChart3DSurface.camera = new CameraController(wasmContext, {
                    position: new Vector3(-200, 150, 200),
                    target: new Vector3(0, 50, 0)
                });
                sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

                sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
                sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
                    axisTitle: "Y Axis",
                    visibleRange: new NumberRange(0, 0.3)
                });
                sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

                const dataSeries = new UniformGridDataSeries3D(wasmContext, {
                    yValues: createHeightmap(),
                    xStep: 1,
                    zStep: 1,
                    dataSeriesName: "Uniform Surface Mesh"
                });

                const meshColorPalette = new GradientColorPalette(wasmContext, {
                    gradientStops: [
                        { offset: 1, color: "pink" },
                        { offset: 0.9, color: "orange" },
                        { offset: 0.7, color: "red" },
                        { offset: 0.5, color: "green" },
                        { offset: 0.3, color: "blue" },
                        { offset: 0, color: "violet" }
                    ]
                });

                sciChart3DSurface.renderableSeries.add(
                    new SurfaceMeshRenderableSeries3D(wasmContext, {
                        dataSeries,
                        minimum: 0,
                        maximum: 0.5,
                        opacity: 0.9,
                        cellHardnessFactor: 1.0,
                        shininess: 0,
                        lightingFactor: 0.0,
                        highlight: 1.0,
                        stroke: "blue",
                        strokeThickness: 2.0,
                        contourStroke: "blue",
                        contourInterval: 2,
                        contourOffset: 0,
                        contourStrokeThickness: 2,
                        drawSkirt: false,
                        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
                        meshColorPalette,
                        isVisible: true
                    })
                );

                sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
                sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
                sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

                // the result must carry the created surface as `sciChartSurface` for cleanup
                return { sciChartSurface: sciChart3DSurface };
            }}
        />
    );
}
