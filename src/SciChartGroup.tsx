"use client";

import { PropsWithChildren, useEffect, useState, JSX } from "react";
import { SciChartGroupContext, TGroupChartState } from "./SciChartGroupContext";
import { IInitResult } from "./types";

export type TSciChartGroupProps = PropsWithChildren<{
    onInit?: (chartInitResults: IInitResult[]) => void;
    /**
     * a callback function used once every chart within the group is initialized and has rendered at least once,
     * whichever happens last; see {@link IStateClassNames.rendered}. Called after {@link TSciChartGroupProps.onInit}
     */
    onRendered?: (chartInitResults: IInitResult[]) => void;
    onDelete?: (chartInitResults: IInitResult[]) => void;
    onInitError?: (error: any) => void;
}>;

type TGroupState = {
    groupInitialized: boolean;
    groupRendered: boolean;
    charts: Map<any, TGroupChartState>;
};

/**
 * Derives the state of a group from the state of its charts
 * @param charts the state of each chart within the group
 * @returns the group state
 */
function getGroupState(charts: Map<any, TGroupChartState>): TGroupState {
    const chartStates = Array.from(charts.values());
    const groupInitialized = chartStates.length > 0 && chartStates.every(({ isInitialized }) => isInitialized);
    const groupRendered = groupInitialized && chartStates.every(({ isRendered }) => isRendered);

    return { groupInitialized, groupRendered, charts };
}

/**
 * Collects the init result of every chart within a group
 * @param charts the state of each chart within the group
 * @returns the init results, or `undefined` while any chart has none
 */
function getGroupInitResults(charts: ReadonlyMap<unknown, TGroupChartState>): IInitResult[] | undefined {
    const initResults = Array.from(charts.values()).map(({ initResult }) => initResult);

    if (!initResults.every((initResult): initResult is IInitResult => initResult !== null)) {
        return undefined;
    }

    return initResults;
}

/**
 * Provides a common context for multiple wrapped {@link SciChartReact} elements.
 * Accepts callbacks used after all charts within the group are initialized, after they have also rendered,
 * and when they are unmounted.
 */
export const SciChartGroup = (props: TSciChartGroupProps): JSX.Element => {
    const { onInit, onRendered, onDelete } = props;

    const [groupState, setGroupState] = useState<TGroupState>({
        groupInitialized: false,
        groupRendered: false,
        charts: new Map()
    });

    const addChartToGroup = (chart: any, isInitialized: boolean, initResult: IInitResult | null) => {
        groupState.charts.set(chart, { isInitialized, isRendered: false, initResult });
        setGroupState(getGroupState(groupState.charts));
    };

    const setChartRendered = (chart: any) => {
        const chartState = groupState.charts.get(chart);

        if (!chartState) {
            return;
        }

        groupState.charts.set(chart, { ...chartState, isRendered: true });
        setGroupState(getGroupState(groupState.charts));
    };

    const removeChartFromGroup = (chart: any) => {
        groupState.charts.delete(chart);
        setGroupState(getGroupState(groupState.charts));
    };

    const notifyError = (error: any) => {
        return props?.onInitError?.(error);
    };

    const contextState = { ...groupState, addChartToGroup, setChartRendered, removeChartFromGroup, notifyError };

    // The effects read the live chart map: a chart mounted in the commit that initialized the group has
    // already joined it, without an init result, so the callbacks wait until that chart is initialized too.

    // set in the effect that calls onInit, so onRendered waits for the commit of whatever onInit updated
    const [isInitHandled, setIsInitHandled] = useState(false);

    useEffect(() => {
        const initResults = getGroupInitResults(groupState.charts);
        const isGroupInitialized = groupState.groupInitialized && initResults !== undefined;

        if (onInit && isGroupInitialized) {
            onInit(initResults);
        }

        setIsInitHandled(isGroupInitialized);
        // Runs once per chart lifecycle: re-running on callback or context identity would tear
        // down and re-create the surface.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupState.groupInitialized]);

    useEffect(() => {
        const initResults = getGroupInitResults(groupState.charts);

        if (onRendered && groupState.groupRendered && isInitHandled && initResults) {
            onRendered(initResults);
        }
        // Runs once each time every chart within the group has rendered; re-running on callback identity
        // would call onRendered again for the same charts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupState.groupRendered, isInitHandled]);

    useEffect(() => {
        const initResults = getGroupInitResults(groupState.charts);

        if (onDelete && groupState.groupInitialized && initResults) {
            return () => {
                onDelete(initResults);
            };
        }
        // Runs once per chart lifecycle: re-running on callback or context identity would tear
        // down and re-create the surface.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupState.groupInitialized]);

    return <SciChartGroupContext.Provider value={contextState}>{props.children}</SciChartGroupContext.Provider>;
};
