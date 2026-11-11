"use client";

import { createContext } from "react";
import { IInitResult } from "./types";

/** @ignore */
export type TGroupChartState = { isInitialized: boolean; isRendered: boolean; initResult: IInitResult | null };

type TSciChartGroupContext = {
    groupInitialized: boolean;
    groupRendered: boolean;
    charts: Map<any, TGroupChartState>;
    addChartToGroup: (chart: any, isInitialized: boolean, initResult: IInitResult | null) => void;
    setChartRendered: (chart: any) => void;
    removeChartFromGroup: (chart: any) => void;
    /** passes an init error to the group's `onInitError`; returns whether the group has one */
    notifyError: (error: any) => boolean;
};

/** The context provided within a {@link SciChartGroup} */
export const SciChartGroupContext = createContext<TSciChartGroupContext | undefined>(undefined);
