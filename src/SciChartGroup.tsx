import { PropsWithChildren, useEffect, useState } from "react";
import { SciChartGroupContext } from "./SciChartGroupContext";
import { IInitResult } from "./types";

export type TSciChartGroupProps = PropsWithChildren<{
    onInit?: (chartInitResults: IInitResult[]) => void;
    onDelete?: (chartInitResults: IInitResult[]) => void;
}>;

export const SciChartGroup = (props: TSciChartGroupProps) => {
    const { onInit, onDelete } = props;

    const [groupState, setGroupState] = useState<{
        groupInitialized: boolean;
        charts: Map<any, { isInitialized: boolean; initResult?: IInitResult }>;
    }>({
        groupInitialized: false,
        charts: new Map()
    });

    const addChartToGroup = (chart: any, isInitialized: boolean, initResult?: IInitResult) => {
        groupState.charts.set(chart, { isInitialized, initResult });
        const groupInitialized = Array.from(groupState.charts.values()).every(({ isInitialized }) => isInitialized);
        setGroupState({ groupInitialized, charts: groupState.charts });
    };

    const removeChartFromGroup = (chart: any) => {
        groupState.charts.delete(chart);
        const groupInitialized = Array.from(groupState.charts.values()).every(({ isInitialized }) => isInitialized);
        setGroupState({ groupInitialized, charts: groupState.charts });
    };

    const contextState = { ...groupState, addChartToGroup, removeChartFromGroup };

    useEffect(() => {
        if (onInit && groupState.groupInitialized) {
            const initResults = Array.from(groupState.charts.values()).map(
                ({ initResult }) => initResult
            ) as IInitResult[];
            onInit(initResults);
        }
    }, [onInit, groupState.groupInitialized]);

    useEffect(() => {
        if (onDelete && groupState.groupInitialized) {
            const initResults = Array.from(groupState.charts.values()).map(
                ({ initResult }) => initResult
            ) as IInitResult[];

            return () => {
                onDelete(initResults);
            };
        }
    }, [onDelete, groupState.groupInitialized]);

    return <SciChartGroupContext.Provider value={contextState}>{props.children}</SciChartGroupContext.Provider>;
};
