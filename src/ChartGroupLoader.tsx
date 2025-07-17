import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { DefaultFallback } from "./DefaultFallback";
import { SciChartGroup } from "./SciChartGroup";
import { IInitResult } from "./types";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** The purpose of this component is to hide UI behind a spinner until the charts within it are initialized */
export const ChartGroupLoader = (props: TDivProps & { onInit?: (chartInitResults: IInitResult[]) => void }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    return (
        <SciChartGroup
            onInit={(chartInitResults: IInitResult[]) => {
                props.onInit?.(chartInitResults);
                setIsInitialized(true);
            }}
        >
            <div {...props}>
                {props.children}
                {!isInitialized ? <DefaultFallback /> : null}
            </div>
        </SciChartGroup>
    );
};
