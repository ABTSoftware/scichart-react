import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { DefaultFallback } from "./DefaultFallback";
import { SciChartGroup } from "./SciChartGroup";
import { IInitResult } from "./types";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** The purpose of this component is to hide UI behind a spinner until the charts within it are initialized */
export const ChartGroupLoader = (props: TDivProps & { onInit?: (chartInitResults: IInitResult[]) => void }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <SciChartGroup
            onInit={(chartInitResults: IInitResult[]) => {
                props.onInit?.(chartInitResults);
                setIsInitialized(true);
            }}
            onError={() => {
                setHasError(true);
            }}
        >
            <div {...props}>
                {props.children}
                {!isInitialized ? hasError ? <ErrorDialog /> : <DefaultFallback /> : null}
            </div>
        </SciChartGroup>
    );
};

const ErrorDialog = () => (
    <div
        style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0,
            textAlign: "center",
            color: "white",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 12
        }}
    >
        <div>There were issues during initialization. Check console for errors</div>
    </div>
);
