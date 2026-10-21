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
import { SciChartReact } from "../../../../src";

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
 * A 3D surface mesh chart in the same group as the 2D ones, so the group waits for both engines.
 * The 3D engine is a side module the core fetches on demand (`scichart-charting3d.wasm`).
 */
export function Surface3DChart() {
    return (
        <SciChartReact
            style={{ width: 600, height: 300 }}
            fallback={<div className="fallback">3D Chart Initialization in progress</div>}
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
                        stroke: "blue",
                        strokeThickness: 2.0,
                        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
                        meshColorPalette
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
