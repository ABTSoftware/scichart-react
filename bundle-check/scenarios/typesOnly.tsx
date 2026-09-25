// Floor control: type-only imports are erased, the bundle should be a few hundred bytes.
import type { TChartComponentPropsWithInit, IInitResult } from "scichart-react";
import type { ISciChartSurfaceBase } from "scichart";

const props: Partial<TChartComponentPropsWithInit<ISciChartSurfaceBase, IInitResult>> = {};

console.log(Object.keys(props).length);
