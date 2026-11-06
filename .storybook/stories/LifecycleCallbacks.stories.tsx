import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useEffect, useRef, useState, JSX } from "react";
import { render as legacyRender, unmountComponentAtNode } from "react-dom";
import { NumericAxis, SciChartPieSurface, SciChartSurface, ISciChartSurfaceBase } from "scichart";
import { ChartGroupLoader, IInitResult, SciChartReact } from "scichart-react";

/**
 * Stories for tests/lifecycle-callbacks.spec.ts. Each lifecycle step is logged to `window.lifecycleLog`,
 * with whether the fallback and the children were in the DOM at that moment
 */

/** One logged lifecycle step */
export type TLifecycleEntry = { step: string; fallbackShown: boolean; childMounted: boolean };

declare global {
    interface Window {
        lifecycleLog: TLifecycleEntry[];
    }
}

const isInDom = (testId: string): boolean => document.querySelector(`[data-testid="${testId}"]`) !== null;

const log = (step: string): void => {
    window.lifecycleLog ??= [];
    window.lifecycleLog.push({ step, fallbackShown: isInDom("fallback"), childMounted: isInDom("child") });
};

const createLineSurface = async (rootElement: string | HTMLDivElement): Promise<ISciChartSurfaceBase> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    return sciChartSurface;
};

/** An empty pie surface never renders */
const createEmptyPieSurface = (rootElement: string | HTMLDivElement): Promise<ISciChartSurfaceBase> =>
    SciChartPieSurface.create(rootElement);

const Fallback = (): JSX.Element => <div data-testid="fallback">Loading...</div>;
const Child = (): JSX.Element => <div data-testid="child">child</div>;

const chartStyle = { width: 400, height: 200 };

type TLoggedChartProps = {
    createSurface?: (rootElement: string | HTMLDivElement) => Promise<ISciChartSurfaceBase>;
    /** init waits for the "Finish init" button */
    delayInit?: boolean;
    noDestructor?: boolean;
};

/** A chart that logs every lifecycle step, with an "Unmount" button */
const LoggedChart = ({
    createSurface = createLineSurface,
    delayInit,
    noDestructor
}: TLoggedChartProps): JSX.Element => {
    const [mounted, setMounted] = useState(true);
    const finishInitRef = useRef<() => void>();

    const initChart = async (rootElement: string | HTMLDivElement): Promise<IInitResult> => {
        log("initChart");
        const sciChartSurface = await createSurface(rootElement);
        sciChartSurface.addDeletable({ delete: () => log("surface deleted") });

        if (delayInit) {
            await new Promise<void>(resolve => (finishInitRef.current = resolve));
        }

        log("initChart resolved");

        return noDestructor ? { sciChartSurface } : { sciChartSurface, destructor: () => log("destructor") };
    };

    return (
        <div>
            <button onClick={() => setMounted(false)}>Unmount</button>
            {delayInit ? <button onClick={() => finishInitRef.current?.()}>Finish init</button> : null}
            {mounted ? (
                <SciChartReact
                    initChart={initChart}
                    fallback={<Fallback />}
                    style={chartStyle}
                    onInit={() => {
                        log("onInit");
                        return () => log("onInit cleanup");
                    }}
                    onRendered={() => {
                        log("onRendered");
                        return () => log("onRendered cleanup");
                    }}
                    onDelete={() => log("onDelete")}
                >
                    <Child />
                </SciChartReact>
            ) : null}
        </div>
    );
};

/** A chart group that logs its callbacks */
const LoggedGroup = (): JSX.Element => (
    <ChartGroupLoader
        fallback={<Fallback />}
        onInit={() => log("group onInit")}
        onRendered={() => log("group onRendered")}
    >
        <SciChartReact
            initChart={async rootElement => ({ sciChartSurface: await createLineSurface(rootElement) })}
            style={chartStyle}
        >
            <Child />
        </SciChartReact>
    </ChartGroupLoader>
);

/** Mounts a chart with the pre-React-18 `ReactDOM.render`, which does not batch updates */
const LegacyRootChart = (): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current!;
        legacyRender(<LoggedChart />, container);

        return () => {
            unmountComponentAtNode(container);
        };
    }, []);

    return <div ref={containerRef} />;
};

const meta = {
    title: "Tests/LifecycleCallbacks",
    component: SciChartReact,
    // hidden from the sidebar and the docs; tests/visual.spec.ts skips "test-only" stories
    tags: ["!dev", "!autodocs", "test-only"]
} satisfies Meta<typeof SciChartReact>;

export default meta;
type Story = StoryObj<typeof SciChartReact>;

export const Basic: Story = { render: () => <LoggedChart /> };

export const LegacyRoot: Story = { render: () => <LegacyRootChart /> };

export const DelayedInit: Story = { render: () => <LoggedChart delayInit /> };

export const NeverRenders: Story = { render: () => <LoggedChart createSurface={createEmptyPieSurface} /> };

export const NoDestructor: Story = { render: () => <LoggedChart noDestructor /> };

export const Group: Story = { render: () => <LoggedGroup /> };
