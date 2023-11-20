"use client";

import { createContext } from "react";
import { ISciChartSurfaceBase } from "scichart";
import { IInitResult } from "./types";

export const SciChartSurfaceContext = createContext<IInitResult<ISciChartSurfaceBase> | null>(null);
