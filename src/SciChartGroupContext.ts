"use client";

import { createContext } from "react";
import { IInitResult } from "./types";

type TSciChartGroupContext = {
    groupInitialized: boolean;
    charts: Map<any, { isInitialized: boolean; initResult?: IInitResult }>;
    addChartToGroup: (chart: any, isInitialized: boolean, initResult?: IInitResult) => void;
    removeChartFromGroup: (chart: any) => void;
};

export const SciChartGroupContext = createContext<TSciChartGroupContext | undefined>(undefined);
